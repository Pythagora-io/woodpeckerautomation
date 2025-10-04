import { IAutomation } from '../models/Automation';
import ProcessedUser from '../models/ProcessedUser';
import { ActivityLogService } from './activityLogService';
import { MongoDBService } from './mongodbService';
import axios from 'axios';
import { decrypt } from '../utils/encryption';
import Settings from '../models/Settings';

interface ExternalUser {
  _id: string;
  email: string;
  firstName?: string;
  company?: string;
  createdAt: Date;
  segmentData?: {
    useCase?: string;
    category?: string;
    alternative?: string;
  };
}

export class AutomationExecutor {
  /**
   * Execute a single automation
   */
  static async executeAutomation(automation: IAutomation): Promise<void> {
    const startTime = Date.now();
    let usersFound = 0;
    let usersAdded = 0;
    let errorMessage: string | undefined;
    let status: 'success' | 'failed' | 'partial' = 'success';

    try {
      console.log(`Executing automation: ${automation.name} (${automation._id})`);

      // Get users from external MongoDB
      const users = await this.fetchUsersFromExternalDB(automation);
      usersFound = users.length;

      console.log(`Found ${usersFound} users matching criteria for automation ${automation.name}`);

      if (usersFound === 0) {
        console.log(`No users to process for automation ${automation.name}`);
      } else {
        // Add users to Woodpecker campaign
        const addedCount = await this.addUsersToWoodpecker(automation, users);
        usersAdded = addedCount;

        if (usersAdded < usersFound) {
          status = 'partial';
          errorMessage = `Only ${usersAdded} of ${usersFound} users were successfully added`;
        }

        console.log(`Added ${usersAdded} users to Woodpecker campaign ${automation.campaignName}`);
      }
    } catch (error) {
      console.error(`Error executing automation ${automation.name}:`, error);
      status = 'failed';
      errorMessage = error.message;
    } finally {
      const executionTime = Date.now() - startTime;

      // Log execution
      try {
        await ActivityLogService.createLog({
          automationId: automation._id.toString(),
          automationName: automation.name,
          campaignName: automation.campaignName,
          userId: automation.userId.toString(),
          status,
          usersFound,
          usersAdded,
          errorMessage,
          executionTime,
        });
      } catch (logError) {
        console.error(`Error logging automation execution:`, logError);
      }
    }
  }

  /**
   * Fetch users from external MongoDB based on automation criteria
   */
  private static async fetchUsersFromExternalDB(automation: IAutomation): Promise<ExternalUser[]> {
    try {
      // Get MongoDB connection URL from settings
      const settings = await Settings.findOne({});
      if (!settings?.mongodbUrl) {
        throw new Error('External MongoDB URL not configured');
      }

      const mongoUrl = decrypt(settings.mongodbUrl);

      // Calculate time window
      const { startTime, endTime } = this.calculateTimeWindow(automation);

      console.log(`Fetching users who signed up between ${startTime} and ${endTime}`);

      // Build query
      const query: any = {
        createdAt: {
          $gte: startTime,
          $lte: endTime,
        },
      };

      // Apply segment filters if configured
      if (automation.segmentFilters) {
        if (automation.segmentFilters.useCase && automation.segmentFilters.useCase.length > 0) {
          query['segmentData.useCase'] = { $in: automation.segmentFilters.useCase };
        }
        if (automation.segmentFilters.category && automation.segmentFilters.category.length > 0) {
          query['segmentData.category'] = { $in: automation.segmentFilters.category };
        }
        if (automation.segmentFilters.alternative && automation.segmentFilters.alternative.length > 0) {
          query['segmentData.alternative'] = { $in: automation.segmentFilters.alternative };
        }
      }

      // Fetch users from external MongoDB
      const users = await MongoDBService.queryExternalUsers(mongoUrl, query);

      // Filter out already processed users
      const unprocessedUsers = await this.filterUnprocessedUsers(automation._id.toString(), users);

      console.log(`Found ${users.length} matching users, ${unprocessedUsers.length} unprocessed`);

      return unprocessedUsers;
    } catch (error) {
      console.error('Error fetching users from external DB:', error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Calculate time window based on automation timing
   */
  private static calculateTimeWindow(automation: IAutomation): { startTime: Date; endTime: Date } {
    const now = new Date();

    // Convert timing to hours
    let targetHours = automation.timingValue;
    if (automation.timingUnit === 'days') {
      targetHours *= 24;
    }

    // Calculate margin based on frequency
    let marginHours = 1; // default for minute/second/hour
    if (automation.frequency === 'day') {
      marginHours = 24;
    } else if (automation.frequency === 'week') {
      marginHours = 24;
    }

    // Calculate time window
    const targetTime = new Date(now.getTime() - targetHours * 60 * 60 * 1000);
    const startTime = new Date(targetTime.getTime() - marginHours * 60 * 60 * 1000);
    const endTime = new Date(targetTime.getTime() + marginHours * 60 * 60 * 1000);

    return { startTime, endTime };
  }

  /**
   * Filter out users that have already been processed
   */
  private static async filterUnprocessedUsers(
    automationId: string,
    users: ExternalUser[]
  ): Promise<ExternalUser[]> {
    try {
      const emails = users.map((u) => u.email.toLowerCase());

      const processedUsers = await ProcessedUser.find({
        automationId,
        userEmail: { $in: emails },
      }).lean();

      const processedEmails = new Set(processedUsers.map((pu) => pu.userEmail));

      return users.filter((user) => !processedEmails.has(user.email.toLowerCase()));
    } catch (error) {
      console.error('Error filtering unprocessed users:', error);
      // If error, return all users to be safe
      return users;
    }
  }

  /**
   * Add users to Woodpecker campaign
   */
  private static async addUsersToWoodpecker(
    automation: IAutomation,
    users: ExternalUser[]
  ): Promise<number> {
    try {
      // Get Woodpecker API key from settings
      const settings = await Settings.findOne({});
      if (!settings?.woodpeckerApiKey) {
        throw new Error('Woodpecker API key not configured');
      }

      const apiKey = decrypt(settings.woodpeckerApiKey);

      let successCount = 0;

      // Process users in batches of 10
      const batchSize = 10;
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);

        // Prepare prospects data
        const prospects = batch.map((user) => ({
          email: user.email,
          first_name: user.firstName || '',
          company: user.company || '',
        }));

        try {
          // Add prospects to campaign
          const response = await axios.post(
            'https://api.woodpecker.co/rest/v1/add_prospects_campaign',
            {
              campaign: { campaign_id: automation.campaignId },
              prospects,
            },
            {
              headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
              },
            }
          );

          console.log(`Added batch of ${batch.length} users to Woodpecker campaign ${automation.campaignId}`);

          // Mark users as processed
          for (const user of batch) {
            try {
              await ProcessedUser.create({
                automationId: automation._id,
                userEmail: user.email.toLowerCase(),
                externalUserId: user._id,
              });
            } catch (err) {
              // Ignore duplicate key errors
              if (err.code !== 11000) {
                console.error(`Error marking user ${user.email} as processed:`, err);
              }
            }
          }

          successCount += batch.length;
        } catch (error) {
          console.error(`Error adding batch to Woodpecker:`, error.response?.data || error.message);
          // Continue with next batch
        }

        // Small delay between batches to avoid rate limiting
        if (i + batchSize < users.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return successCount;
    } catch (error) {
      console.error('Error adding users to Woodpecker:', error);
      throw new Error(`Failed to add users to Woodpecker: ${error.message}`);
    }
  }
}

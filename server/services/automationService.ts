import Automation, { IAutomation } from '../models/Automation';
import mongoose from 'mongoose';

export class AutomationService {
  /**
   * Create a new automation
   */
  static async createAutomation(userId: string, automationData: Partial<IAutomation>): Promise<IAutomation> {
    try {
      console.log(`Creating automation for user ${userId}:`, automationData.name);

      const automation = new Automation({
        ...automationData,
        userId: new mongoose.Types.ObjectId(userId),
      });

      // Calculate next run time if active
      if (automation.isActive) {
        automation.nextRun = this.calculateNextRun(automation);
      }

      await automation.save();
      console.log(`Automation created successfully: ${automation._id}`);

      return automation;
    } catch (error) {
      console.error('Error creating automation:', error);
      throw new Error(`Failed to create automation: ${error.message}`);
    }
  }

  /**
   * Get all automations for a user
   */
  static async getUserAutomations(userId: string): Promise<IAutomation[]> {
    try {
      console.log(`Fetching automations for user ${userId}`);

      const automations = await Automation.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .lean();

      console.log(`Found ${automations.length} automations for user ${userId}`);
      return automations as IAutomation[];
    } catch (error) {
      console.error('Error fetching user automations:', error);
      throw new Error(`Failed to fetch automations: ${error.message}`);
    }
  }

  /**
   * Get automation by ID
   */
  static async getAutomationById(automationId: string, userId: string): Promise<IAutomation | null> {
    try {
      console.log(`Fetching automation ${automationId} for user ${userId}`);

      const automation = await Automation.findOne({
        _id: new mongoose.Types.ObjectId(automationId),
        userId: new mongoose.Types.ObjectId(userId),
      }).lean();

      if (!automation) {
        console.log(`Automation ${automationId} not found`);
        return null;
      }

      return automation as IAutomation;
    } catch (error) {
      console.error('Error fetching automation:', error);
      throw new Error(`Failed to fetch automation: ${error.message}`);
    }
  }

  /**
   * Update automation
   */
  static async updateAutomation(
    automationId: string,
    userId: string,
    updates: Partial<IAutomation>
  ): Promise<IAutomation | null> {
    try {
      console.log(`Updating automation ${automationId} for user ${userId}`);

      const automation = await Automation.findOne({
        _id: new mongoose.Types.ObjectId(automationId),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!automation) {
        console.log(`Automation ${automationId} not found`);
        return null;
      }

      // Update fields
      Object.assign(automation, updates);

      // Recalculate next run if frequency or timing changed or if activated
      if (automation.isActive) {
        automation.nextRun = this.calculateNextRun(automation);
      } else {
        automation.nextRun = undefined;
      }

      await automation.save();
      console.log(`Automation ${automationId} updated successfully`);

      return automation;
    } catch (error) {
      console.error('Error updating automation:', error);
      throw new Error(`Failed to update automation: ${error.message}`);
    }
  }

  /**
   * Toggle automation status
   */
  static async toggleAutomationStatus(automationId: string, userId: string): Promise<IAutomation | null> {
    try {
      console.log(`Toggling automation ${automationId} status for user ${userId}`);

      const automation = await Automation.findOne({
        _id: new mongoose.Types.ObjectId(automationId),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!automation) {
        console.log(`Automation ${automationId} not found`);
        return null;
      }

      automation.isActive = !automation.isActive;

      if (automation.isActive) {
        automation.nextRun = this.calculateNextRun(automation);
        console.log(`Automation ${automationId} activated, next run: ${automation.nextRun}`);
      } else {
        automation.nextRun = undefined;
        console.log(`Automation ${automationId} deactivated`);
      }

      await automation.save();

      return automation;
    } catch (error) {
      console.error('Error toggling automation status:', error);
      throw new Error(`Failed to toggle automation status: ${error.message}`);
    }
  }

  /**
   * Delete automation
   */
  static async deleteAutomation(automationId: string, userId: string): Promise<boolean> {
    try {
      console.log(`Deleting automation ${automationId} for user ${userId}`);

      const result = await Automation.deleteOne({
        _id: new mongoose.Types.ObjectId(automationId),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (result.deletedCount === 0) {
        console.log(`Automation ${automationId} not found`);
        return false;
      }

      console.log(`Automation ${automationId} deleted successfully`);
      return true;
    } catch (error) {
      console.error('Error deleting automation:', error);
      throw new Error(`Failed to delete automation: ${error.message}`);
    }
  }

  /**
   * Get active automations that need to run
   */
  static async getAutomationsDueForExecution(): Promise<IAutomation[]> {
    try {
      const now = new Date();

      const automations = await Automation.find({
        isActive: true,
        $or: [
          { nextRun: { $lte: now } },
          { nextRun: { $exists: false } },
          { nextRun: null },
        ],
      }).lean();

      console.log(`Found ${automations.length} automations due for execution`);
      return automations as IAutomation[];
    } catch (error) {
      console.error('Error fetching automations due for execution:', error);
      throw new Error(`Failed to fetch automations: ${error.message}`);
    }
  }

  /**
   * Update last run and calculate next run
   */
  static async updateAutomationRunTime(automationId: string): Promise<void> {
    try {
      const automation = await Automation.findById(automationId);

      if (!automation) {
        console.log(`Automation ${automationId} not found`);
        return;
      }

      automation.lastRun = new Date();
      automation.nextRun = this.calculateNextRun(automation);

      await automation.save();
      console.log(`Updated automation ${automationId} run time, next run: ${automation.nextRun}`);
    } catch (error) {
      console.error('Error updating automation run time:', error);
      throw new Error(`Failed to update automation run time: ${error.message}`);
    }
  }

  /**
   * Calculate next run time based on frequency
   */
  private static calculateNextRun(automation: IAutomation): Date {
    const now = new Date();
    let nextRun = new Date(now);

    switch (automation.frequency) {
      case 'second':
        nextRun.setSeconds(nextRun.getSeconds() + 1);
        break;

      case 'minute':
        nextRun.setMinutes(nextRun.getMinutes() + 1);
        break;

      case 'hour':
        nextRun.setHours(nextRun.getHours() + 1);
        break;

      case 'day':
        if (automation.timeOfDay) {
          const [hours, minutes] = automation.timeOfDay.split(':').map(Number);
          nextRun.setDate(nextRun.getDate() + 1);
          nextRun.setHours(hours, minutes, 0, 0);
        } else {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        break;

      case 'week':
        if (automation.dayOfWeek !== undefined) {
          const currentDay = nextRun.getDay();
          const daysUntilNext = (automation.dayOfWeek - currentDay + 7) % 7 || 7;
          nextRun.setDate(nextRun.getDate() + daysUntilNext);

          if (automation.timeOfDay) {
            const [hours, minutes] = automation.timeOfDay.split(':').map(Number);
            nextRun.setHours(hours, minutes, 0, 0);
          }
        } else {
          nextRun.setDate(nextRun.getDate() + 7);
        }
        break;

      default:
        nextRun.setHours(nextRun.getHours() + 1);
    }

    return nextRun;
  }
}

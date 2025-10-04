import ActivityLog, { IActivityLog } from '../models/ActivityLog';
import mongoose from 'mongoose';

export class ActivityLogService {
  /**
   * Create activity log entry
   */
  static async createLog(logData: {
    automationId: string;
    automationName: string;
    campaignName: string;
    userId: string;
    status: 'success' | 'failed' | 'partial';
    usersFound: number;
    usersAdded: number;
    errorMessage?: string;
    executionTime: number;
  }): Promise<IActivityLog> {
    try {
      console.log(`Creating activity log for automation ${logData.automationName}`);

      const log = new ActivityLog({
        automationId: new mongoose.Types.ObjectId(logData.automationId),
        automationName: logData.automationName,
        campaignName: logData.campaignName,
        userId: new mongoose.Types.ObjectId(logData.userId),
        status: logData.status,
        usersFound: logData.usersFound,
        usersAdded: logData.usersAdded,
        errorMessage: logData.errorMessage,
        executionTime: logData.executionTime,
      });

      await log.save();
      console.log(`Activity log created: ${log._id}`);

      return log;
    } catch (error) {
      console.error('Error creating activity log:', error);
      throw new Error(`Failed to create activity log: ${error.message}`);
    }
  }

  /**
   * Get activity logs for a user
   */
  static async getUserActivityLogs(userId: string, limit: number = 50): Promise<IActivityLog[]> {
    try {
      console.log(`Fetching activity logs for user ${userId}, limit: ${limit}`);

      const logs = await ActivityLog.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      console.log(`Found ${logs.length} activity logs for user ${userId}`);
      return logs as IActivityLog[];
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw new Error(`Failed to fetch activity logs: ${error.message}`);
    }
  }

  /**
   * Get activity logs for a specific automation
   */
  static async getAutomationActivityLogs(automationId: string, limit: number = 20): Promise<IActivityLog[]> {
    try {
      console.log(`Fetching activity logs for automation ${automationId}, limit: ${limit}`);

      const logs = await ActivityLog.find({ automationId: new mongoose.Types.ObjectId(automationId) })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      console.log(`Found ${logs.length} activity logs for automation ${automationId}`);
      return logs as IActivityLog[];
    } catch (error) {
      console.error('Error fetching automation activity logs:', error);
      throw new Error(`Failed to fetch activity logs: ${error.message}`);
    }
  }

  /**
   * Delete old activity logs (cleanup)
   */
  static async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      console.log(`Cleaning up activity logs older than ${cutoffDate}`);

      const result = await ActivityLog.deleteMany({
        createdAt: { $lt: cutoffDate },
      });

      console.log(`Deleted ${result.deletedCount} old activity logs`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up old logs:', error);
      throw new Error(`Failed to cleanup old logs: ${error.message}`);
    }
  }
}

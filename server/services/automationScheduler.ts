import { AutomationService } from './automationService';
import { AutomationExecutor } from './automationExecutor';

export class AutomationScheduler {
  private static intervalId: NodeJS.Timeout | null = null;
  private static isRunning = false;
  private static checkIntervalMs = 10000; // Check every 10 seconds

  /**
   * Start the automation scheduler
   */
  static start(): void {
    if (this.isRunning) {
      console.log('Automation scheduler is already running');
      return;
    }

    console.log('Starting automation scheduler...');
    this.isRunning = true;

    // Run immediately on start
    this.checkAndExecuteAutomations();

    // Then run at intervals
    this.intervalId = setInterval(() => {
      this.checkAndExecuteAutomations();
    }, this.checkIntervalMs);

    console.log(`Automation scheduler started (checking every ${this.checkIntervalMs / 1000} seconds)`);
  }

  /**
   * Stop the automation scheduler
   */
  static stop(): void {
    if (!this.isRunning) {
      console.log('Automation scheduler is not running');
      return;
    }

    console.log('Stopping automation scheduler...');

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('Automation scheduler stopped');
  }

  /**
   * Check for automations that need to run and execute them
   */
  private static async checkAndExecuteAutomations(): Promise<void> {
    try {
      // Get automations due for execution
      const automations = await AutomationService.getAutomationsDueForExecution();

      if (automations.length === 0) {
        return;
      }

      console.log(`Found ${automations.length} automations ready to execute`);

      // Execute automations in parallel
      const executionPromises = automations.map(async (automation) => {
        try {
          // Update last run time before execution
          await AutomationService.updateAutomationRunTime(automation._id.toString());

          // Execute automation
          await AutomationExecutor.executeAutomation(automation);
        } catch (error) {
          console.error(`Error executing automation ${automation.name}:`, error);
        }
      });

      await Promise.all(executionPromises);
    } catch (error) {
      console.error('Error in automation scheduler check:', error);
    }
  }

  /**
   * Get scheduler status
   */
  static getStatus(): { running: boolean; checkInterval: number } {
    return {
      running: this.isRunning,
      checkInterval: this.checkIntervalMs,
    };
  }

  /**
   * Update check interval (in milliseconds)
   */
  static setCheckInterval(intervalMs: number): void {
    if (intervalMs < 1000) {
      throw new Error('Check interval must be at least 1000ms');
    }

    this.checkIntervalMs = intervalMs;
    console.log(`Automation scheduler check interval updated to ${intervalMs}ms`);

    // Restart scheduler if running
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }
}

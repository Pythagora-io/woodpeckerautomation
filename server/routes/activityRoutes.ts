import express from 'express';
import { requireUser } from './middlewares/auth';
import { ActivityLogService } from '../services/activityLogService';

const router = express.Router();

// Description: Get activity logs for the authenticated user
// Endpoint: GET /api/activity
// Request: { limit?: number }
// Response: { logs: Array<ActivityLog> }
router.get('/', requireUser(), async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    console.log(`Fetching activity logs for user ${req.user._id}, limit: ${limit}`);

    const logs = await ActivityLogService.getUserActivityLogs(req.user._id.toString(), limit);

    res.status(200).json({ logs });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get activity logs for a specific automation
// Endpoint: GET /api/activity/automation/:automationId
// Request: { limit?: number }
// Response: { logs: Array<ActivityLog> }
router.get('/automation/:automationId', requireUser(), async (req, res) => {
  try {
    const { automationId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    console.log(`Fetching activity logs for automation ${automationId}, limit: ${limit}`);

    const logs = await ActivityLogService.getAutomationActivityLogs(automationId, limit);

    res.status(200).json({ logs });
  } catch (error) {
    console.error('Error fetching automation activity logs:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

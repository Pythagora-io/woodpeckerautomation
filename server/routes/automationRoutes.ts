import express from 'express';
import { requireUser } from './middlewares/auth';
import { AutomationService } from '../services/automationService';

const router = express.Router();

// Description: Get all automations for the authenticated user
// Endpoint: GET /api/automations
// Request: {}
// Response: { automations: Array<Automation> }
router.get('/', requireUser, async (req, res) => {
  try {
    console.log(`Fetching automations for user ${req.user._id}`);

    const automations = await AutomationService.getUserAutomations(req.user._id.toString());

    res.status(200).json({ automations });
  } catch (error) {
    console.error('Error fetching automations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Description: Get a single automation by ID
// Endpoint: GET /api/automations/:id
// Request: {}
// Response: { automation: Automation }
router.get('/:id', requireUser, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Fetching automation ${id} for user ${req.user._id}`);

    const automation = await AutomationService.getAutomationById(id, req.user._id.toString());

    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    res.status(200).json({ automation });
  } catch (error) {
    console.error('Error fetching automation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Description: Create a new automation
// Endpoint: POST /api/automations
// Request: { name, frequency, dayOfWeek?, timeOfDay?, campaignId, campaignName, timingValue, timingUnit, segmentFilters?, isActive }
// Response: { automation: Automation }
router.post('/', requireUser, async (req, res) => {
  try {
    const automationData = req.body;

    console.log(`Creating automation for user ${req.user._id}:`, automationData.name);

    // Validate required fields
    if (!automationData.name || !automationData.frequency || !automationData.campaignId ||
        !automationData.campaignName || !automationData.timingValue || !automationData.timingUnit) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate frequency-specific fields
    if (automationData.frequency === 'day' && !automationData.timeOfDay) {
      return res.status(400).json({ error: 'timeOfDay is required for daily frequency' });
    }

    if (automationData.frequency === 'week' && (automationData.dayOfWeek === undefined || !automationData.timeOfDay)) {
      return res.status(400).json({ error: 'dayOfWeek and timeOfDay are required for weekly frequency' });
    }

    const automation = await AutomationService.createAutomation(req.user._id.toString(), automationData);

    res.status(201).json({ automation });
  } catch (error) {
    console.error('Error creating automation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Description: Update an automation
// Endpoint: PUT /api/automations/:id
// Request: { name?, frequency?, dayOfWeek?, timeOfDay?, campaignId?, campaignName?, timingValue?, timingUnit?, segmentFilters?, isActive? }
// Response: { automation: Automation }
router.put('/:id', requireUser, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log(`Updating automation ${id} for user ${req.user._id}`);

    const automation = await AutomationService.updateAutomation(id, req.user._id.toString(), updates);

    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    res.status(200).json({ automation });
  } catch (error) {
    console.error('Error updating automation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Description: Toggle automation status (active/inactive)
// Endpoint: PATCH /api/automations/:id/toggle
// Request: {}
// Response: { automation: Automation }
router.patch('/:id/toggle', requireUser, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Toggling automation ${id} status for user ${req.user._id}`);

    const automation = await AutomationService.toggleAutomationStatus(id, req.user._id.toString());

    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    res.status(200).json({ automation });
  } catch (error) {
    console.error('Error toggling automation status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Description: Delete an automation
// Endpoint: DELETE /api/automations/:id
// Request: {}
// Response: { success: boolean, message: string }
router.delete('/:id', requireUser, async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Deleting automation ${id} for user ${req.user._id}`);

    const deleted = await AutomationService.deleteAutomation(id, req.user._id.toString());

    if (!deleted) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    res.status(200).json({ success: true, message: 'Automation deleted successfully' });
  } catch (error) {
    console.error('Error deleting automation:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

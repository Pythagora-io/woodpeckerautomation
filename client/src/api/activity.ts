import api from './api';

// Description: Get activity log
// Endpoint: GET /api/activity
// Request: { limit?: number }
// Response: { logs: Array<ActivityLog> }
export const getActivityLog = async (limit?: number) => {
  try {
    const params = limit ? { limit } : {};
    const response = await api.get('/api/activity', { params });
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get activity logs for a specific automation
// Endpoint: GET /api/activity/automation/:automationId
// Request: { limit?: number }
// Response: { logs: Array<ActivityLog> }
export const getAutomationActivityLog = async (automationId: string, limit?: number) => {
  try {
    const params = limit ? { limit } : {};
    const response = await api.get(`/api/activity/automation/${automationId}`, { params });
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

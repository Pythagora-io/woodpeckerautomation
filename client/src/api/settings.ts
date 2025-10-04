import api from './api';

// Description: Get connection status
// Endpoint: GET /api/settings/status
// Request: {}
// Response: { mongodbConnected: boolean, woodpeckerConnected: boolean, isSetupComplete: boolean }
export const getConnectionStatus = async () => {
  try {
    const response = await api.get('/api/settings/status');
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Check if initial setup is complete
// Endpoint: GET /api/settings/status
// Request: {}
// Response: { isSetupComplete: boolean }
export const getSetupStatus = async () => {
  try {
    const response = await api.get('/api/settings/status');
    return { setupComplete: response.data.isSetupComplete };
  } catch (error: unknown) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

import api from './api';

// Description: Get all Woodpecker campaigns
// Endpoint: GET /api/settings/woodpecker/campaigns
// Request: {}
// Response: { campaigns: Array<{ id: number, name: string, status: string }> }
export const getWoodpeckerCampaigns = async () => {
  try {
    const response = await api.get('/api/settings/woodpecker/campaigns');
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Test Woodpecker connection
// Endpoint: POST /api/settings/woodpecker/test
// Request: { apiKey: string }
// Response: { connected: boolean, message: string, error?: string }
export const testWoodpeckerConnection = async (apiKey: string) => {
  try {
    const response = await api.post('/api/settings/woodpecker/test', { apiKey });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update Woodpecker API key
// Endpoint: POST /api/settings/woodpecker/api-key
// Request: { apiKey: string }
// Response: { success: boolean, message: string }
export const updateWoodpeckerApiKey = async (apiKey: string) => {
  try {
    const response = await api.post('/api/settings/woodpecker/api-key', { apiKey });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

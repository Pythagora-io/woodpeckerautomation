import api from './api';

// Description: Get all Woodpecker campaigns
// Endpoint: GET /api/woodpecker/campaigns
// Request: {}
// Response: { campaigns: Array<{ id: string, name: string }> }
export const getWoodpeckerCampaigns = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        campaigns: [
          { id: 'camp_123', name: 'Welcome Series' },
          { id: 'camp_456', name: 'Follow-up Series' },
          { id: 'camp_789', name: 'Re-engagement Campaign' },
          { id: 'camp_101', name: 'Product Launch' },
          { id: 'camp_202', name: 'Newsletter Signup' }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/woodpecker/campaigns');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Test Woodpecker connection
// Endpoint: POST /api/woodpecker/test
// Request: { apiKey: string }
// Response: { success: boolean, message: string, campaignCount: number }
export const testWoodpeckerConnection = (apiKey: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Connection successful',
        campaignCount: 5
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/woodpecker/test', { apiKey });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update Woodpecker API key
// Endpoint: PUT /api/woodpecker/api-key
// Request: { apiKey: string }
// Response: { success: boolean, message: string }
export const updateWoodpeckerApiKey = (apiKey: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'API key updated successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put('/api/woodpecker/api-key', { apiKey });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};
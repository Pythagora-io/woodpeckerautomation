import api from './api';

// Description: Get connection status
// Endpoint: GET /api/settings/status
// Request: {}
// Response: { mongodb: { connected: boolean }, woodpecker: { connected: boolean } }
export const getConnectionStatus = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        mongodb: { connected: true },
        woodpecker: { connected: true }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/settings/status');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Check if initial setup is complete
// Endpoint: GET /api/settings/setup-status
// Request: {}
// Response: { setupComplete: boolean }
export const getSetupStatus = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        setupComplete: true
      });
    }, 300);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/settings/setup-status');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};
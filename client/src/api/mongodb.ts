import api from './api';

// Description: Test MongoDB connection
// Endpoint: POST /api/mongodb/test
// Request: { connectionUrl: string }
// Response: { success: boolean, message: string }
export const testMongoDBConnection = (connectionUrl: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Connection successful'
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/mongodb/test', { connectionUrl });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update MongoDB connection URL
// Endpoint: PUT /api/mongodb/connection
// Request: { connectionUrl: string }
// Response: { success: boolean, message: string }
export const updateMongoDBConnection = (connectionUrl: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Connection URL updated successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put('/api/mongodb/connection', { connectionUrl });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get segment filter options
// Endpoint: GET /api/mongodb/segment-options
// Request: {}
// Response: { useCases: string[], categories: string[], alternatives: string[] }
export const getSegmentOptions = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        useCases: ['saas', 'ecommerce', 'marketplace', 'b2b', 'b2c', 'enterprise'],
        categories: ['startup', 'small-business', 'mid-market', 'enterprise', 'agency'],
        alternatives: ['competitor-a', 'competitor-b', 'competitor-c', 'manual-process', 'in-house-solution']
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/mongodb/segment-options');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};
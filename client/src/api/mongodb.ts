import api from './api';

// Description: Test MongoDB connection
// Endpoint: POST /api/settings/mongodb/test
// Request: { url: string }
// Response: { connected: boolean, message: string, error?: string }
export const testMongoDBConnection = async (connectionUrl: string) => {
  try {
    const response = await api.post('/api/settings/mongodb/test', { url: connectionUrl });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update MongoDB connection URL
// Endpoint: POST /api/settings/mongodb/url
// Request: { url: string }
// Response: { success: boolean, message: string }
export const updateMongoDBConnection = async (connectionUrl: string) => {
  try {
    const response = await api.post('/api/settings/mongodb/url', { url: connectionUrl });
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Sync segment data from external MongoDB
// Endpoint: POST /api/settings/mongodb/sync-segments
// Request: {}
// Response: { success: boolean, message: string, data: { useCases: string[], categories: string[], alternatives: string[] } }
export const syncSegmentData = async () => {
  try {
    const response = await api.post('/api/settings/mongodb/sync-segments');
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get segment filter options
// Endpoint: GET /api/settings/segments
// Request: {}
// Response: { useCases: string[], categories: string[], alternatives: string[] }
export const getSegmentOptions = async () => {
  try {
    const response = await api.get('/api/settings/segments');
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

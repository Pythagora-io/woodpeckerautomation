import api from './api';

// Description: Get all automations
// Endpoint: GET /api/automations
// Request: {}
// Response: { automations: Array<{ _id: string, name: string, status: boolean, frequency: string, frequencyDetails: object, campaignId: string, campaignName: string, timeValue: number, timeUnit: string, segmentFilters: object, lastRun: string }> }
export const getAutomations = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        automations: [
          {
            _id: '1',
            name: 'Welcome Campaign - 2 hours after signup',
            status: true,
            frequency: 'hour',
            frequencyDetails: {},
            campaignId: 'camp_123',
            campaignName: 'Welcome Series',
            timeValue: 2,
            timeUnit: 'hours',
            segmentFilters: {
              useCase: ['saas', 'ecommerce'],
              category: ['startup'],
              alternative: []
            },
            lastRun: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            name: 'Follow-up Campaign - 1 day after signup',
            status: false,
            frequency: 'day',
            frequencyDetails: { time: '09:00' },
            campaignId: 'camp_456',
            campaignName: 'Follow-up Series',
            timeValue: 1,
            timeUnit: 'days',
            segmentFilters: {
              useCase: [],
              category: [],
              alternative: []
            },
            lastRun: '2024-01-14T09:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/automations');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Create a new automation
// Endpoint: POST /api/automations
// Request: { name: string, frequency: string, frequencyDetails: object, campaignId: string, timeValue: number, timeUnit: string, segmentFilters: object, status: boolean }
// Response: { automation: { _id: string, name: string, status: boolean, frequency: string, frequencyDetails: object, campaignId: string, timeValue: number, timeUnit: string, segmentFilters: object } }
export const createAutomation = (data: any) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        automation: {
          _id: Math.random().toString(36).substr(2, 9),
          ...data
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/automations', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update an automation
// Endpoint: PUT /api/automations/:id
// Request: { name: string, frequency: string, frequencyDetails: object, campaignId: string, timeValue: number, timeUnit: string, segmentFilters: object, status: boolean }
// Response: { automation: { _id: string, name: string, status: boolean, frequency: string, frequencyDetails: object, campaignId: string, timeValue: number, timeUnit: string, segmentFilters: object } }
export const updateAutomation = (id: string, data: any) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        automation: {
          _id: id,
          ...data
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/automations/${id}`, data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Delete an automation
// Endpoint: DELETE /api/automations/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteAutomation = (id: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Automation deleted successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/automations/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Toggle automation status
// Endpoint: PATCH /api/automations/:id/toggle
// Request: { status: boolean }
// Response: { automation: { _id: string, status: boolean } }
export const toggleAutomationStatus = (id: string, status: boolean) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        automation: {
          _id: id,
          status
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.patch(`/api/automations/${id}/toggle`, { status });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get automation by ID
// Endpoint: GET /api/automations/:id
// Request: {}
// Response: { automation: { _id: string, name: string, status: boolean, frequency: string, frequencyDetails: object, campaignId: string, campaignName: string, timeValue: number, timeUnit: string, segmentFilters: object } }
export const getAutomationById = (id: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        automation: {
          _id: id,
          name: 'Welcome Campaign - 2 hours after signup',
          status: true,
          frequency: 'hour',
          frequencyDetails: {},
          campaignId: 'camp_123',
          campaignName: 'Welcome Series',
          timeValue: 2,
          timeUnit: 'hours',
          segmentFilters: {
            useCase: ['saas', 'ecommerce'],
            category: ['startup'],
            alternative: []
          }
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/automations/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};
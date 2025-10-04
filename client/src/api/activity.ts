import api from './api';

// Description: Get activity log
// Endpoint: GET /api/activity
// Request: {}
// Response: { activities: Array<{ _id: string, automationId: string, automationName: string, timestamp: string, usersFound: number, usersAdded: number, status: string, errorMessage: string }> }
export const getActivityLog = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        activities: [
          {
            _id: '1',
            automationId: '1',
            automationName: 'Welcome Campaign - 2 hours after signup',
            timestamp: '2024-01-15T10:30:00Z',
            usersFound: 15,
            usersAdded: 15,
            status: 'success',
            errorMessage: ''
          },
          {
            _id: '2',
            automationId: '2',
            automationName: 'Follow-up Campaign - 1 day after signup',
            timestamp: '2024-01-15T09:00:00Z',
            usersFound: 8,
            usersAdded: 8,
            status: 'success',
            errorMessage: ''
          },
          {
            _id: '3',
            automationId: '1',
            automationName: 'Welcome Campaign - 2 hours after signup',
            timestamp: '2024-01-15T09:30:00Z',
            usersFound: 12,
            usersAdded: 10,
            status: 'partial',
            errorMessage: '2 users failed to add due to invalid email format'
          },
          {
            _id: '4',
            automationId: '2',
            automationName: 'Follow-up Campaign - 1 day after signup',
            timestamp: '2024-01-14T09:00:00Z',
            usersFound: 0,
            usersAdded: 0,
            status: 'success',
            errorMessage: ''
          },
          {
            _id: '5',
            automationId: '1',
            automationName: 'Welcome Campaign - 2 hours after signup',
            timestamp: '2024-01-14T08:30:00Z',
            usersFound: 5,
            usersAdded: 0,
            status: 'failed',
            errorMessage: 'Woodpecker API connection timeout'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/activity');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};
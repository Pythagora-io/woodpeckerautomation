import api from './api';

// Description: Get all automations
// Endpoint: GET /api/automations
// Request: {}
// Response: { automations: Array<Automation> }
export const getAutomations = async () => {
  try {
    const response = await api.get('/api/automations');
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new automation
// Endpoint: POST /api/automations
// Request: { name, frequency, dayOfWeek?, timeOfDay?, campaignId, campaignName, timingValue, timingUnit, segmentFilters?, isActive }
// Response: { automation: Automation }
export const createAutomation = async (data: {
  name: string;
  frequency: string;
  dayOfWeek?: number;
  timeOfDay?: string;
  campaignId: number;
  campaignName: string;
  timingValue: number;
  timingUnit: string;
  segmentFilters?: {
    useCase?: string[];
    category?: string[];
    alternative?: string[];
  };
  isActive: boolean;
}) => {
  try {
    const response = await api.post('/api/automations', data);
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update an automation
// Endpoint: PUT /api/automations/:id
// Request: { name?, frequency?, dayOfWeek?, timeOfDay?, campaignId?, campaignName?, timingValue?, timingUnit?, segmentFilters?, isActive? }
// Response: { automation: Automation }
export const updateAutomation = async (id: string, data: {
  name?: string;
  frequency?: string;
  dayOfWeek?: number;
  timeOfDay?: string;
  campaignId?: number;
  campaignName?: string;
  timingValue?: number;
  timingUnit?: string;
  segmentFilters?: {
    useCase?: string[];
    category?: string[];
    alternative?: string[];
  };
  isActive?: boolean;
}) => {
  try {
    const response = await api.put(`/api/automations/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete an automation
// Endpoint: DELETE /api/automations/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteAutomation = async (id: string) => {
  try {
    const response = await api.delete(`/api/automations/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Toggle automation status
// Endpoint: PATCH /api/automations/:id/toggle
// Request: {}
// Response: { automation: Automation }
export const toggleAutomationStatus = async (id: string) => {
  try {
    const response = await api.patch(`/api/automations/${id}/toggle`);
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get automation by ID
// Endpoint: GET /api/automations/:id
// Request: {}
// Response: { automation: Automation }
export const getAutomationById = async (id: string) => {
  try {
    const response = await api.get(`/api/automations/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

import axios from 'axios';
import { decrypt } from '../utils/encryption';

const WOODPECKER_API_BASE_URL = 'https://api.woodpecker.co/rest/v1';

export interface WoodpeckerCampaign {
  id: number;
  name: string;
  status: string;
}

/**
 * Tests connection to Woodpecker API
 * @param encryptedApiKey - Encrypted Woodpecker API key
 * @returns Object with connection status and message
 */
export const testWoodpeckerConnection = async (
  encryptedApiKey: string
): Promise<{ connected: boolean; message: string; error?: string }> => {
  try {
    console.log('Testing Woodpecker API connection...');

    // Decrypt the API key
    const apiKey = decrypt(encryptedApiKey);

    // Test API connection by fetching campaigns
    // Woodpecker API uses Basic authentication with the API key as username
    const response = await axios.get(`${WOODPECKER_API_BASE_URL}/campaigns`, {
      auth: {
        username: apiKey,
        password: '',
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    if (response.status === 200) {
      console.log('Woodpecker API connection test successful');
      return {
        connected: true,
        message: 'Successfully connected to Woodpecker API',
      };
    } else {
      console.error('Woodpecker API connection test failed with status:', response.status);
      return {
        connected: false,
        message: 'Failed to connect to Woodpecker API',
        error: `Unexpected status code: ${response.status}`,
      };
    }
  } catch (error: unknown) {
    console.error('Woodpecker API connection test failed:', error);

    if (error.response) {
      // API responded with error
      return {
        connected: false,
        message: 'Failed to connect to Woodpecker API',
        error: error.response.data?.message || `HTTP ${error.response.status}`,
      };
    } else if (error.request) {
      // No response received
      return {
        connected: false,
        message: 'Failed to connect to Woodpecker API',
        error: 'No response from API - check your network connection',
      };
    } else {
      // Other error
      return {
        connected: false,
        message: 'Failed to connect to Woodpecker API',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
};

/**
 * Fetches campaigns from Woodpecker API
 * @param encryptedApiKey - Encrypted Woodpecker API key
 * @returns Array of campaigns
 */
export const fetchWoodpeckerCampaigns = async (
  encryptedApiKey: string
): Promise<WoodpeckerCampaign[]> => {
  try {
    console.log('Fetching Woodpecker campaigns...');

    // Decrypt the API key
    const apiKey = decrypt(encryptedApiKey);

    // Fetch campaigns from Woodpecker API
    // Woodpecker API uses Basic authentication with the API key as username
    const response = await axios.get(`${WOODPECKER_API_BASE_URL}/campaigns`, {
      auth: {
        username: apiKey,
        password: '',
      },
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    if (response.status === 200 && response.data) {
      const campaigns = response.data.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
      }));

      console.log(`Successfully fetched ${campaigns.length} Woodpecker campaigns`);
      return campaigns;
    } else {
      console.error('Unexpected response from Woodpecker API:', response.status);
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error: unknown) {
    console.error('Error fetching Woodpecker campaigns:', error);

    if (error.response) {
      throw new Error(
        error.response.data?.message || `HTTP ${error.response.status}: Failed to fetch campaigns`
      );
    } else if (error.request) {
      throw new Error('No response from Woodpecker API - check your network connection');
    } else {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch Woodpecker campaigns');
    }
  }
};

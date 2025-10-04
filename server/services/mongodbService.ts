import mongoose from 'mongoose';
import { decrypt } from '../utils/encryption';

export class MongoDBService {
  /**
   * Tests connection to external MongoDB instance
   * @param encryptedUrl - Encrypted MongoDB connection URL
   * @returns Object with connection status and message
   */
  static async testConnection(
    encryptedUrl: string
  ): Promise<{ connected: boolean; message: string; error?: string }> {
    return testMongoDBConnection(encryptedUrl);
  }

  /**
   * Query external users based on criteria
   * @param mongoUrl - Decrypted MongoDB connection URL
   * @param query - MongoDB query object
   * @returns Array of users matching criteria
   */
  static async queryExternalUsers(mongoUrl: string, query: Record<string, unknown>): Promise<unknown[]> {
    let externalConnection: typeof mongoose | null = null;

    try {
      console.log('Querying external MongoDB for users...');

      // Create a separate connection instance
      externalConnection = await mongoose.createConnection(mongoUrl, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 10000,
      }).asPromise();

      console.log('Connected to external MongoDB');

      const db = externalConnection.db;
      const usersCollection = db.collection('users');

      // Execute query
      const users = await usersCollection.find(query).toArray();

      console.log(`Found ${users.length} users matching query`);

      // Close the connection
      await externalConnection.close();

      return users;
    } catch (error: unknown) {
      console.error('Error querying external MongoDB:', error);

      if (externalConnection) {
        try {
          await externalConnection.close();
        } catch (closeError) {
          console.error('Error closing MongoDB connection:', closeError);
        }
      }

      throw new Error(`Failed to query external MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch segment data from external MongoDB
   * @param encryptedUrl - Encrypted MongoDB connection URL
   * @returns Object with segment data arrays
   */
  static async fetchSegmentData(encryptedUrl: string): Promise<{
    useCases: string[];
    categories: string[];
    alternatives: string[];
  }> {
    return fetchSegmentData(encryptedUrl);
  }
}

/**
 * Tests connection to external MongoDB instance
 * @param encryptedUrl - Encrypted MongoDB connection URL
 * @returns Object with connection status and message
 */
export const testMongoDBConnection = async (
  encryptedUrl: string
): Promise<{ connected: boolean; message: string; error?: string }> => {
  let externalConnection: typeof mongoose | null = null;

  try {
    console.log('Testing external MongoDB connection...');

    // Decrypt the URL
    const mongoUrl = decrypt(encryptedUrl);

    // Create a separate connection instance
    externalConnection = await mongoose.createConnection(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    }).asPromise();

    console.log('External MongoDB connection test successful');

    // Close the connection
    await externalConnection.close();

    return {
      connected: true,
      message: 'Successfully connected to MongoDB',
    };
  } catch (error: unknown) {
    console.error('MongoDB connection test failed:', error);

    if (externalConnection) {
      try {
        await externalConnection.close();
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
      }
    }

    return {
      connected: false,
      message: 'Failed to connect to MongoDB',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Fetches segment data from external MongoDB
 * @param encryptedUrl - Encrypted MongoDB connection URL
 * @returns Object with segment data arrays
 */
export const fetchSegmentData = async (
  encryptedUrl: string
): Promise<{
  useCases: string[];
  categories: string[];
  alternatives: string[];
}> => {
  let externalConnection: typeof mongoose | null = null;

  try {
    console.log('Fetching segment data from external MongoDB...');

    // Decrypt the URL
    const mongoUrl = decrypt(encryptedUrl);

    // Create a separate connection instance
    externalConnection = await mongoose.createConnection(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    }).asPromise();

    console.log('Connected to external MongoDB for segment data fetch');

    // The external MongoDB has a 'users' collection with 'segmentData' field
    // segmentData is an object with keys: useCase, category, alternative
    const db = externalConnection.db;

    // Fetch all users
    const usersCollection = db.collection('users');
    const usersData = await usersCollection.find({}).toArray();

    console.log(`Fetched ${usersData.length} users from external database`);

    // Extract unique segment data values
    const useCasesSet = new Set<string>();
    const categoriesSet = new Set<string>();
    const alternativesSet = new Set<string>();

    for (const user of usersData) {
      if (user.segmentData) {
        // Add useCase if it exists
        if (user.segmentData.useCase) {
          useCasesSet.add(user.segmentData.useCase);
        }
        // Add category if it exists
        if (user.segmentData.category) {
          categoriesSet.add(user.segmentData.category);
        }
        // Add alternative if it exists
        if (user.segmentData.alternative) {
          alternativesSet.add(user.segmentData.alternative);
        }
      }
    }

    // Convert sets to arrays
    const useCases = Array.from(useCasesSet).sort();
    const categories = Array.from(categoriesSet).sort();
    const alternatives = Array.from(alternativesSet).sort();

    console.log(`Extracted ${useCases.length} unique use cases`);
    console.log(`Extracted ${categories.length} unique categories`);
    console.log(`Extracted ${alternatives.length} unique alternatives`);

    // Close the connection
    await externalConnection.close();
    console.log('Successfully fetched and closed external MongoDB connection');

    return {
      useCases,
      categories,
      alternatives,
    };
  } catch (error: unknown) {
    console.error('Error fetching segment data from external MongoDB:', error);

    if (externalConnection) {
      try {
        await externalConnection.close();
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to fetch segment data: ${errorMessage}`);
  }
};

import mongoose from 'mongoose';
import { decrypt } from '../utils/encryption';

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

    // Define schema for external collections
    // Assuming the external MongoDB has collections: usecases, categories, alternatives
    // Adjust these based on actual external database structure

    const db = externalConnection.db;

    // Fetch use cases
    const useCasesCollection = db.collection('usecases');
    const useCasesData = await useCasesCollection.find({}).toArray();
    const useCases = useCasesData.map((doc: any) => doc.name || doc.title || doc._id.toString());

    console.log(`Fetched ${useCases.length} use cases`);

    // Fetch categories
    const categoriesCollection = db.collection('categories');
    const categoriesData = await categoriesCollection.find({}).toArray();
    const categories = categoriesData.map((doc: any) => doc.name || doc.title || doc._id.toString());

    console.log(`Fetched ${categories.length} categories`);

    // Fetch alternatives
    const alternativesCollection = db.collection('alternatives');
    const alternativesData = await alternativesCollection.find({}).toArray();
    const alternatives = alternativesData.map((doc: any) => doc.name || doc.title || doc._id.toString());

    console.log(`Fetched ${alternatives.length} alternatives`);

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

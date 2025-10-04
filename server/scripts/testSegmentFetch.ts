import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Settings from '../models/Settings.js';
import { fetchSegmentData } from '../services/mongodbService.js';

// Load environment variables
dotenv.config();

/**
 * Test script to verify segment data fetching from external MongoDB
 */
async function testSegmentFetch() {
  try {
    console.log('Connecting to local database...');
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log('Connected to local database successfully');

    // Get settings
    const settings = await Settings.findOne();
    if (!settings) {
      console.error('No settings found. Please run init:settings first.');
      process.exit(1);
    }

    if (!settings.mongodbUrl) {
      console.error('No MongoDB URL configured. Please configure in the settings page.');
      process.exit(1);
    }

    console.log('\nFetching segment data from external MongoDB...');
    const segmentData = await fetchSegmentData(settings.mongodbUrl);

    console.log('\n=== SEGMENT DATA RESULTS ===');
    console.log(`Use Cases (${segmentData.useCases.length}):`);
    segmentData.useCases.forEach(uc => console.log(`  - ${uc}`));

    console.log(`\nCategories (${segmentData.categories.length}):`);
    segmentData.categories.forEach(cat => console.log(`  - ${cat}`));

    console.log(`\nAlternatives (${segmentData.alternatives.length}):`);
    segmentData.alternatives.forEach(alt => console.log(`  - ${alt}`));

    console.log('\n✓ Segment data fetch test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error testing segment fetch:', error);
    process.exit(1);
  }
}

testSegmentFetch();

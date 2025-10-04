import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Settings from '../models/Settings.js';
import Segment from '../models/Segment.js';

// Load environment variables
dotenv.config();

/**
 * Initialize Settings and Segment collections
 * This script ensures the singleton documents exist
 */
async function initSettings() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log('Connected to database successfully');

    // Initialize Settings
    let settings = await Settings.findOne();
    if (!settings) {
      console.log('Creating initial settings document...');
      settings = await Settings.create({
        mongodbUrl: '',
        mongodbConnected: false,
        mongodbLastTested: null,
        woodpeckerApiKey: '',
        woodpeckerConnected: false,
        woodpeckerLastTested: null,
        isSetupComplete: false,
      });
      console.log('Settings document created successfully');
    } else {
      console.log('Settings document already exists');
    }

    // Initialize Segment
    let segment = await Segment.findOne();
    if (!segment) {
      console.log('Creating initial segment document...');
      segment = await Segment.create({
        useCases: [],
        categories: [],
        alternatives: [],
        lastSyncedAt: new Date(),
      });
      console.log('Segment document created successfully');
    } else {
      console.log('Segment document already exists with:');
      console.log(`  - ${segment.useCases.length} use cases`);
      console.log(`  - ${segment.categories.length} categories`);
      console.log(`  - ${segment.alternatives.length} alternatives`);
    }

    console.log('\nInitialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing settings:', error);
    process.exit(1);
  }
}

initSettings();

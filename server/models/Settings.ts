import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  mongodbUrl: string;
  mongodbConnected: boolean;
  mongodbLastTested: Date | null;
  woodpeckerApiKey: string;
  woodpeckerConnected: boolean;
  woodpeckerLastTested: Date | null;
  isSetupComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    mongodbUrl: {
      type: String,
      default: '',
    },
    mongodbConnected: {
      type: Boolean,
      default: false,
    },
    mongodbLastTested: {
      type: Date,
      default: null,
    },
    woodpeckerApiKey: {
      type: String,
      default: '',
    },
    woodpeckerConnected: {
      type: Boolean,
      default: false,
    },
    woodpeckerLastTested: {
      type: Date,
      default: null,
    },
    isSetupComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists (singleton pattern)
settingsSchema.index({}, { unique: true });

const Settings = mongoose.model<ISettings>('Settings', settingsSchema);

export default Settings;

import mongoose, { Schema, Document } from 'mongoose';

export interface IAutomation extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  isActive: boolean;

  // Trigger frequency
  frequency: 'minute' | 'second' | 'hour' | 'day' | 'week';
  dayOfWeek?: number; // 0-6, Sunday-Saturday
  timeOfDay?: string; // HH:MM format

  // Woodpecker campaign
  campaignId: number;
  campaignName: string;

  // Timing after signup
  timingValue: number;
  timingUnit: 'hours' | 'days';

  // Segment filters (optional)
  segmentFilters?: {
    useCase?: string[];
    category?: string[];
    alternative?: string[];
  };

  // Tracking
  lastRun?: Date;
  nextRun?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const automationSchema = new Schema<IAutomation>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ['minute', 'second', 'hour', 'day', 'week'],
      required: true,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },
    timeOfDay: {
      type: String,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    campaignId: {
      type: Number,
      required: true,
    },
    campaignName: {
      type: String,
      required: true,
    },
    timingValue: {
      type: Number,
      required: true,
      min: 1,
    },
    timingUnit: {
      type: String,
      enum: ['hours', 'days'],
      required: true,
    },
    segmentFilters: {
      useCase: [String],
      category: [String],
      alternative: [String],
    },
    lastRun: {
      type: Date,
    },
    nextRun: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
automationSchema.index({ userId: 1, isActive: 1 });
automationSchema.index({ nextRun: 1, isActive: 1 });

export default mongoose.model<IAutomation>('Automation', automationSchema);

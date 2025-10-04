import mongoose, { Document, Schema } from 'mongoose';

export interface ISegment extends Document {
  useCases: string[];
  categories: string[];
  alternatives: string[];
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const segmentSchema = new Schema<ISegment>(
  {
    useCases: {
      type: [String],
      default: [],
    },
    categories: {
      type: [String],
      default: [],
    },
    alternatives: {
      type: [String],
      default: [],
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one segment document exists (singleton pattern)
segmentSchema.index({}, { unique: true });

const Segment = mongoose.model<ISegment>('Segment', segmentSchema);

export default Segment;

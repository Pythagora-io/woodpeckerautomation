import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  automationId: mongoose.Types.ObjectId;
  automationName: string;
  campaignName: string;
  userId: mongoose.Types.ObjectId;

  status: 'success' | 'failed' | 'partial';
  usersFound: number;
  usersAdded: number;

  errorMessage?: string;
  executionTime: number; // in milliseconds

  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    automationId: {
      type: Schema.Types.ObjectId,
      ref: 'Automation',
      required: true,
    },
    automationName: {
      type: String,
      required: true,
    },
    campaignName: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'partial'],
      required: true,
    },
    usersFound: {
      type: Number,
      default: 0,
    },
    usersAdded: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
    },
    executionTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ automationId: 1, createdAt: -1 });

export default mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

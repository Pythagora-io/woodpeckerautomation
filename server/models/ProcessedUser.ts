import mongoose, { Schema, Document } from 'mongoose';

export interface IProcessedUser extends Document {
  automationId: mongoose.Types.ObjectId;
  userEmail: string;
  processedAt: Date;
  externalUserId?: string; // ID from external MongoDB
}

const processedUserSchema = new Schema<IProcessedUser>(
  {
    automationId: {
      type: Schema.Types.ObjectId,
      ref: 'Automation',
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    externalUserId: {
      type: String,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index to prevent duplicate processing
processedUserSchema.index({ automationId: 1, userEmail: 1 }, { unique: true });

export default mongoose.model<IProcessedUser>('ProcessedUser', processedUserSchema);

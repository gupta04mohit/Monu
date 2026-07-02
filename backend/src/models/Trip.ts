import mongoose, { Schema, Document } from 'mongoose';

export interface ITrip extends Document {
  userId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  itinerary: any; // Storing as JSON object for flexibility
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema: Schema = new Schema(
  {
    userId: { type: String, required: true }, // Ties back to Prisma user ID
    destination: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: Number, required: true },
    itinerary: { type: Schema.Types.Mixed, required: true }, // Flexible JSON schema
  },
  { timestamps: true }
);

export default mongoose.model<ITrip>('Trip', TripSchema);

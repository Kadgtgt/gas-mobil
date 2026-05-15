import mongoose, { Document, Schema } from 'mongoose';

export interface ICylinder extends Document {
  name: string;
  size: string;
  weight: number;
  price: number;
  description: string;
  image: string;
  category: string;
  available: number;
  createdAt: Date;
  updatedAt: Date;
}

const cylinderSchema = new Schema<ICylinder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: String,
    image: String,
    category: {
      type: String,
      enum: ['lpg', 'compressed', 'oxygen'],
      required: true,
    },
    available: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICylinder>('Cylinder', cylinderSchema);

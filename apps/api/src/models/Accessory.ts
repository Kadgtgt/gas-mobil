import mongoose, { Document, Schema } from 'mongoose';

export interface IAccessory extends Document {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const accessorySchema = new Schema<IAccessory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: String,
    image: String,
    category: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAccessory>('Accessory', accessorySchema);

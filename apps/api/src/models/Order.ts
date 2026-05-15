import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: string;
  cylinderId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryDate: Date;
  paymentMethod: 'card' | 'wallet' | 'cash';
  paymentStatus: 'pending' | 'completed' | 'failed';
  trackingId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    cylinderId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryDate: Date,
    paymentMethod: {
      type: String,
      enum: ['card', 'wallet', 'cash'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    trackingId: String,
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);

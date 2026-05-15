import mongoose, { Document, Schema } from 'mongoose';

export interface IDelivery extends Document {
  orderId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedArrival: Date;
  status: 'assigned' | 'picked_up' | 'on_the_way' | 'arrived' | 'completed';
  route: Array<{ latitude: number; longitude: number }>;
  createdAt: Date;
  updatedAt: Date;
}

const deliverySchema = new Schema<IDelivery>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    driverId: {
      type: String,
      required: true,
    },
    driverName: String,
    driverPhone: String,
    vehicleNumber: String,
    currentLocation: {
      latitude: Number,
      longitude: Number,
    },
    estimatedArrival: Date,
    status: {
      type: String,
      enum: ['assigned', 'picked_up', 'on_the_way', 'arrived', 'completed'],
      default: 'assigned',
    },
    route: [
      {
        latitude: Number,
        longitude: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IDelivery>('Delivery', deliverySchema);

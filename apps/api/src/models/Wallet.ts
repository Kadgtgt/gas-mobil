import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  userId: string;
  balance: number;
  transactions: Array<{
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        id: String,
        amount: Number,
        type: {
          type: String,
          enum: ['credit', 'debit'],
        },
        description: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IWallet>('Wallet', walletSchema);

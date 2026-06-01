import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
	itemId: string;
	name: string;
	type: "accessory" | "cylinder";
	unitPrice: number;
	quantity: number;
}

export interface IOrder extends Document {
	userId: string;
	items?: IOrderItem[];
	cylinderId?: string;
	quantity?: number;
	totalPrice: number;
	status: "pending" | "confirmed" | "in_delivery" | "delivered" | "cancelled";
	deliveryAddress: string;
	deliveryDate?: Date;
	paymentMethod: "mtn" | "airtel" | "visa" | "wallet" | "cash";
	paymentStatus: "pending" | "completed" | "failed";
	orderType?: "quick" | "swap" | "buy_new" | "find_agent";
	trackingId?: string;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
	{
		itemId: { type: String, required: true },
		name: { type: String, required: true },
		type: { type: String, enum: ["accessory", "cylinder"], required: true },
		unitPrice: { type: Number, required: true },
		quantity: { type: Number, required: true, min: 1 },
	},
	{ _id: false },
);

const orderSchema = new Schema<IOrder>(
	{
		userId: {
			type: String,
			required: true,
		},
		items: {
			type: [OrderItemSchema],
			default: undefined,
		},
		cylinderId: String,
		quantity: {
			type: Number,
			min: 1,
		},
		totalPrice: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "confirmed", "in_delivery", "delivered", "cancelled"],
			default: "pending",
		},
		deliveryAddress: {
			type: String,
			required: true,
		},
		deliveryDate: Date,
		paymentMethod: {
			type: String,
			enum: ["mtn", "airtel", "visa", "wallet", "cash"],
			required: true,
		},
		orderType: {
			type: String,
			enum: ["quick", "swap", "buy_new", "find_agent"],
		},
		paymentStatus: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
		trackingId: String,
		notes: String,
	},
	{ timestamps: true },
);

export default mongoose.model<IOrder>("Order", orderSchema);

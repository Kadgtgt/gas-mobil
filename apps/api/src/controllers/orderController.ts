import { Request, Response } from "express";
import Order from "../models/Order";
import Delivery from "../models/Delivery";

export const createOrder = async (req: Request, res: Response) => {
	try {
		const { items, cylinderId, quantity, totalPrice, deliveryAddress, paymentMethod } =
			req.body;
		const userId = (req as any).userId || process.env.DEMO_USER_ID || "demo-user";
		const userName = (req as any).userName || process.env.DEMO_USER_NAME || "Demo User";

		if (!deliveryAddress) {
			return res.status(400).json({ success: false, error: "Delivery address is required" });
		}

		if (!paymentMethod) {
			return res.status(400).json({ success: false, error: "Payment method is required" });
		}

		const orderItems =
			Array.isArray(items) && items.length > 0 ? items
			: cylinderId && quantity ?
				[
					{
						itemId: cylinderId,
						name: "Gas Cylinder",
						type: "cylinder",
						unitPrice: totalPrice / quantity,
						quantity,
					},
				]
			:	[];

		const computedTotal =
			totalPrice ||
			orderItems.reduce((sum: number, item: any) => sum + item.unitPrice * item.quantity, 0);

		// Allow creating orders even when `items` is empty.
		// Some clients may place orders without a cart (e.g., quick cylinder orders),
		// so we skip the strict items length validation and let the order be created
		// with an empty items array if needed. The schema supports no items.

		const order = new Order({
			userId,
			userName,
			items: orderItems,
			cylinderId: cylinderId || orderItems[0]?.itemId,
			quantity:
				quantity || orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
			totalPrice: computedTotal,
			deliveryAddress,
			paymentMethod,
			orderType: req.body.orderType,
			paymentStatus: "pending",
		});

		await order.save();

		const delivery = new Delivery({
			orderId: order._id.toString(),
			driverId: "demo-driver",
			driverName: "Moses K.",
			driverPhone: "+256700000000",
			vehicleNumber: "UAX 234B",
			currentLocation: {
				latitude: 0.3476,
				longitude: 32.5825,
			},
			estimatedArrival: new Date(Date.now() + 30 * 60 * 1000),
			status: "assigned",
			route: [{ latitude: 0.3476, longitude: 32.5825 }],
		});

		await delivery.save();

		res.status(201).json({
			success: true,
			data: {
				order,
				delivery,
			},
		});
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const getOrders = async (req: Request, res: Response) => {
	try {
		const userId = (req as any).userId || process.env.DEMO_USER_ID || "demo-user";
		const orders = await Order.find({ userId });

		res.json({
			success: true,
			data: orders,
		});
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const getOrderById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const order = await Order.findById(id);

		if (!order) {
			return res.status(404).json({ success: false, error: "Order not found" });
		}

		res.json({
			success: true,
			data: order,
		});
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

export const cancelOrder = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const order = await Order.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });

		if (!order) {
			return res.status(404).json({ success: false, error: "Order not found" });
		}

		res.json({
			success: true,
			data: order,
		});
	} catch (error: any) {
		res.status(500).json({ success: false, error: error.message });
	}
};

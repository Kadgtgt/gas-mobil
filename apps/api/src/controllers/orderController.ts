import { Request, Response } from 'express';
import Order from '../models/Order';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { cylinderId, quantity, totalPrice, deliveryAddress, paymentMethod } = req.body;
    const userId = (req as any).userId;

    const order = new Order({
      userId,
      cylinderId,
      quantity,
      totalPrice,
      deliveryAddress,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
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
      return res.status(404).json({ success: false, error: 'Order not found' });
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
    const order = await Order.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

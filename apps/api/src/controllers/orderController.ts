import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Product } from "../entities/Product";
import { Delivery } from "../entities/Delivery";

const orderRepository = AppDataSource.getRepository(Order);
const orderItemRepository = AppDataSource.getRepository(OrderItem);
const productRepository = AppDataSource.getRepository(Product);
const deliveryRepository = AppDataSource.getRepository(Delivery);

export const createOrder = async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { items, deliveryAddress, deliveryCity, deliveryLatitude, deliveryLongitude, notes } = req.body;
    const userId = (req as any).userId || process.env.DEMO_USER_ID || "demo-user";

    if (!deliveryAddress) {
      return res.status(400).json({ success: false, error: "Delivery address is required" });
    }

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    // Create order items and calculate total
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: item.productId } });
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const subtotal = Number(product.price) * item.quantity;
        totalAmount += subtotal;

        const orderItem = queryRunner.manager.create(OrderItem, {
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          subtotal,
        });
        orderItems.push(orderItem);
      }
    }

    // Create order
    const order = queryRunner.manager.create(Order, {
      userId,
      totalAmount,
      deliveryAddress,
      deliveryCity,
      deliveryLatitude,
      deliveryLongitude,
      notes,
      status: "pending",
    });

    const savedOrder = await queryRunner.manager.save(order);

    // Save order items with orderId
    for (const item of orderItems) {
      item.orderId = savedOrder.id;
      await queryRunner.manager.save(item);
    }

    await queryRunner.commitTransaction();

    const createdOrder = await orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ["items", "items.product"],
    });

    res.status(201).json(createdOrder);
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await queryRunner.release();
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId || req.params.userId || process.env.DEMO_USER_ID || "demo-user";
    const orders = await orderRepository.find({
      where: { userId },
      relations: ["items", "items.product"],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await orderRepository.findOne({
      where: { id },
      relations: ["items", "items.product", "deliveries"],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await orderRepository.findOne({ where: { id } });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = "cancelled";
    await orderRepository.save(order);

    res.json(order);
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
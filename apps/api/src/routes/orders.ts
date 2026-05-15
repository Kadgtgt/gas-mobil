import express from 'express';
import { createOrder, getOrders, getOrderById, cancelOrder } from '../controllers/orderController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.post('/:id/cancel', authMiddleware, cancelOrder);

export default router;

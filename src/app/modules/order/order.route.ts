import express from 'express';
import { OrderController } from './order.controller';

const router = express.Router();

router.post('/order', OrderController.createOrder);

router.get('/revenue', OrderController.calculateRevenue);

export const OrderRoutes = router;


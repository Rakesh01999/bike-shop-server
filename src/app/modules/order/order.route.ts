import express from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

// router.post('/order', OrderController.createOrder);
router.post('/order',auth(USER_ROLE.customer), OrderController.createOrder);
router.post('/order',auth(USER_ROLE.customer), OrderController.verifyPayment);

// router.get('/revenue', OrderController.calculateRevenue);
router.get('/revenue',auth(USER_ROLE.admin), OrderController.calculateRevenue);

export const OrderRoutes = router;


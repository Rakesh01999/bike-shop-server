import { Bike } from '../bike/bike.model';
import { TUser } from '../User/user.interface';
import { Order } from './order.model';
import { orderUtils } from './order.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

interface IOrderPayload {
  email: string;
  product: string;
  quantity: number;
}

const createOrderInDB = async (
  user: TUser,
  payload: IOrderPayload,
  client_ip: string
) => {
//   console.log('User:', user);
//   console.log('Payload:', payload);

  if (!payload?.product) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Product is not specified');
  }

  // Find the bike
  const bike = await Bike.findById(payload.product);
  console.log('f-OS, Bike:', bike);
  if (!bike) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Bike with ID ${payload.product} not found`
    );
  }

  // Calculate total price
  const totalPrice = bike.price * payload.quantity;

  // Check stock
  if (bike.quantity < payload.quantity) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Insufficient stock for ${bike.name}`
    );
  }

  // Reduce stock
  await Bike.reduceStock(bike.id, payload.quantity);

  // Create product detail
  const productDetail = {
    product: bike._id,
    quantity: payload.quantity,
    subtotal: totalPrice,
  };

  // Create order in the database
  const order = await Order.create({
    user: user._id,
    products: [productDetail], // Wrap in array since schema expects array
    totalPrice,
  });

  // Prepare SurjoPay payment payload
  const surjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: user.name,
    customer_email: user.email,
    client_ip,
  };

  // Make payment with SurjoPay
  const payment = await orderUtils.makePayment(surjopayPayload);

  if (payment?.transactionStatus) {
    await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const getOrdersFromDB = async () => {
  const data = await Order.find().populate('products.product');
  return data;
};

const verifyPayment = async (orderId: string) => {
  const order = await Order.findById(orderId);
  
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Add your payment verification logic here
  const verificationResult = await orderUtils.verifyPayment(orderId);
  
  if (verificationResult.status === 'success') {
    await order.updateOne({
      'transaction.status': 'completed',
      'transaction.verifiedAt': new Date(),
    });
  }

  return order;
};

export const OrderService = {
  createOrderInDB,
  getOrdersFromDB,
  verifyPayment,
};
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
    if (!payload?.product) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Product is not specified');
    }

    // Find the bike
    const bike = await Bike.findById(payload.product);
    //   console.log('f-OS, Bike:', bike);
    if (!bike) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            `Bike with ID ${payload.product} not found`
        );
    }

    // Calculate total price
    const totalPrice = bike.price * payload.quantity;
    // console.log('f-OS, totalPrice:', totalPrice);

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
    console.log('f-OS, productDetail:', productDetail);

    // Create order in the database
    const order = await Order.create({
        product: bike._id,
        email: payload.email,
        quantity: payload.quantity,
        user: user._id,
        products: [productDetail], // Wrap in array since schema expects array
        totalPrice,
    });
    console.log('f-OS, order:', order);

    // Prepare SurjoPay payment payload
    const surjopayPayload = {
        amount: totalPrice,
        order_id: order._id,
        currency: 'BDT',
        customer_name: user.name,
        customer_email: user.email,
        client_ip,
        customer_phone: user.phone || 'N/A', // Customer phone
        customer_address: user.address || 'N/A', // Customer address
        customer_city: user.city || 'N/A', // Customer city    
    };

    // Make payment with SurjoPay
    const payment = await orderUtils.makePayment(surjopayPayload);
    console.log('f-OS, payment:', payment);

    if (payment?.transactionStatus) {
        await order.updateOne({
            transaction: {
                id: payment.sp_order_id,
                transactionStatus: payment.transactionStatus,
            },
        });
    }
    const url = payment.checkout_url;
    console.log('f-OS, payment-url:', payment.checkout_url);

    // return { order, payment.checkout_url};
    return { order, url};
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
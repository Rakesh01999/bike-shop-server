import { Bike } from '../bike/bike.model';
import { TUser } from '../User/user.interface';
import { Order } from './order.model';
import { orderUtils } from './order.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createOrderInDB = async (
    user: TUser,
    payload: { products: { product: string; quantity: number }[] },
    client_ip: string
) => {
    if (!payload?.products?.length) {
        throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Order is not specified');
    }

    const products = payload.products;

    let totalPrice = 0;

    const productDetails = await Promise.all(
        products.map(async (item) => {
            const bike = await Bike.findById(item.product);

            if (bike) {
                const subtotal = bike.price * item.quantity;
                totalPrice += subtotal;

                if (bike.quantity < item.quantity) {
                    throw new AppError(
                        httpStatus.BAD_REQUEST,
                        `Insufficient stock for ${bike.name}`
                    );
                }

                // Reduce stock
                await Bike.reduceStock(bike.id, item.quantity);

                return {
                    product: bike._id,
                    quantity: item.quantity,
                    subtotal,
                };
            } else {
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    `Bike with ID ${item.product} not found`
                );
            }
        })
    );

    // Create order in the database
    //   let order = await Order.create({
    const order = await Order.create({
        user: user._id,
        products: productDetails,
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
    const payment = await orderUtils.makePaymentAsync(surjopayPayload);

    if (payment?.transactionStatus) {
        await order.updateOne({
            transaction: {
                id: payment.sp_order_id,
                transactionStatus: payment.transactionStatus,
            },
        });
    }

    return payment.checkout_url; // Return the checkout URL for the client to redirect to
};

const verifyPayment = async (order_id: string) => {
    const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

    if (verifiedPayment.length) {
        await Order.findOneAndUpdate(
            {
                'transaction.id': order_id,
            },
            {
                'transaction.bank_status': verifiedPayment[0].bank_status,
                'transaction.sp_code': verifiedPayment[0].sp_code,
                'transaction.sp_message': verifiedPayment[0].sp_message,
                'transaction.transactionStatus':
                    verifiedPayment[0].transaction_status,
                'transaction.method': verifiedPayment[0].method,
                'transaction.date_time': verifiedPayment[0].date_time,
                status:
                    verifiedPayment[0].bank_status === 'Success'
                        ? 'Paid'
                        : verifiedPayment[0].bank_status === 'Failed'
                            ? 'Pending'
                            : verifiedPayment[0].bank_status === 'Cancel'
                                ? 'Cancelled'
                                : '',
            }
        );
    }

    return verifiedPayment;
};

const getOrdersFromDB = async () => {
    const data = await Order.find();
    return data;
};

export const OrderService = {
    createOrderInDB,
    verifyPayment,
    getOrdersFromDB,
};

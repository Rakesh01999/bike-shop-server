import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
// import { orderService } from "./order.service";
import httpStatus from "http-status";
import { OrderService } from "./order.service";
import { Order } from "./order.model";
// import { UserModel } from "../User/user.model";

const createOrder = catchAsync(async (req, res) => {
    const user = req.user;
    // const user = await UserModel.findOne({ email: req.user.email });
    // console.log('f-OC', user);
    
    // const order = await OrderService.createOrderInDB(user, req.body, req.ip!);
    const order = await OrderService.createOrderInDB(user, req.body, req.ip!);
    // console.log('f-OC, order:', order);
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order placed successfully !!",
        data: order,
    });
});

const getOrders = catchAsync(async (req, res) => {
    const order = await OrderService.getOrdersFromDB();

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order retrieved successfully",
        data: order,
    });
});

const verifyPayment = catchAsync(async (req, res) => {
    const order = await OrderService.verifyPayment(req.query.order_id as string);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order verified successfully",
        data: order,
    });
});

// Calculate total revenue from all orders
const calculateRevenue = async (req, res) => {
    try {
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
        ]);

        const revenue = totalRevenue[0]?.totalRevenue || 0;

        // res.status(200).json({
        //     success: true,
        //     message: 'Revenue calculated successfully',
        //     data: {
        //         totalRevenue: revenue,
        //     },
        // });
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Order retrieved successfully",
            data: {
                totalRevenue: revenue,
            },
        });
    } catch (error: unknown) {
        // Type-safe handling of the error
        const errorMessage =
            error instanceof Error ? error.message : 'An unexpected error occurred';

        console.error('Error calculating revenue:', errorMessage);
        // res.status(500).json({
        //     success: false,
        //     message: errorMessage,
        // });
        sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: res,
        });
    }
};


export const OrderController = { createOrder, verifyPayment, getOrders, calculateRevenue };
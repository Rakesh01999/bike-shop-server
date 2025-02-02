import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { OrderService } from "./order.service";
import { Order } from "./order.model";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const user = req.user; // Assuming authentication middleware sets this
    const clientIp = req.ip || ""; // Default to empty string if undefined

    const order = await OrderService.createOrderInDB(user, req.body, clientIp);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order placed successfully !!",
        data: order,
    });
});


const getOrders = catchAsync(async (req: Request, res: Response) => {
    const orders = await OrderService.getOrdersFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
    });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
    const order = await OrderService.verifyPayment(req.query.order_id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order verified successfully",
        data: order,
    });
});

// Calculate total revenue from all orders
const calculateRevenue = catchAsync(async (req: Request, res: Response) => {
    try {
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
        ]);

        const revenue = totalRevenue[0]?.totalRevenue || 0;

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Revenue calculated successfully",
            data: {
                totalRevenue: revenue,
            },
        });
    } catch (error: unknown) {
        // Type-safe handling of the error
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

        console.error("Error calculating revenue:", errorMessage);

        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: errorMessage,
            data: null,
        });
    }
});

export const OrderController = { createOrder, verifyPayment, getOrders, calculateRevenue };

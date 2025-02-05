import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { OrderService } from "./order.service";
import { Order } from "./order.model";
// import { OrderValidationSchema } from "./order.validation";
// import { BikeServices } from "../bike/bike.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    const user = req.user; // Assuming authentication middleware sets this
    const clientIp = req.ip || ""; // Default to empty string if undefined
    console.log('f-OC, body', req.body);
    
    const order = await OrderService.createOrderInDB(user, req.body, clientIp);
    console.log('f-OC, order', order);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order placed successfully !!",
        data: order,
    });
});

// const createOrder = async (req: Request, res: Response) => {
//     try {
//         const Orderdata = req.body;
//         const ZodparseCardata = OrderValidationSchema.parse(Orderdata);

//         const { quantity: orderQuantity, car } = Orderdata;

//         //   const carDataArray = await BikeServices.getSingleCarFromDB(car);
//         const carDataArray = await BikeServices.getSingleBikeFromDB(car);

//         // const carData = carDataArray[0];
//         const carData = carDataArray;

//         const { quantity, inStock } = carData;

//         if (!inStock || quantity < orderQuantity) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Insufficient stock",
//             });
//         }

//         carData.quantity -= orderQuantity;

//         if (carData.quantity === 0) {
//             carData.inStock = false;
//         }

//         // const result2 = await CarServices.getUpdateCarFromDB(car, carData)
//         const result2 = await BikeServices.updateBikeInDB(car, carData)

//         // const result = await OrderServices.createOrderIntoDB(ZodparseCardata);
//         const result = await OrderService.createOrderInDB(ZodparseCardata);

//         return res.status(200).json({
//             success: true,
//             message: "Order created successfully",
//             data: result,
//             data1: result2
//         });
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Something went wrong",
//             error,
//         });
//     }
// };


const getOrders = catchAsync(async (req: Request, res: Response) => {
    const orders = await OrderService.getOrdersFromDB();
    console.log('f-OC:orders',orders);
    
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

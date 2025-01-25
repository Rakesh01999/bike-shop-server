import { Request, Response } from 'express';
import { Order } from './order.model';
import { Bike } from '../bike/bike.model';
import mongoose from 'mongoose';

// Create an order and update inventory
const createOrder = async (req: Request, res: Response): Promise<void> => {
    const session = await mongoose.startSession(); // Start a session for atomic operations
    session.startTransaction();

    try {
        const { email, product, quantity } = req.body;

        // Validate input
        if (!email || !product || !quantity) {
            res.status(400).json({
                success: false,
                message: 'Email, product, and quantity are required',
            });
            return; // Stop execution
        }

        // Check if the product exists
        const bike = await Bike.findById(product).session(session);

        // Handle case where bike is null
        if (!bike) {
            res.status(404).json({
                success: false,
                message: 'Product not found',
            });
            return; // Stop execution
        }

        // Handle case where bike is deleted
        if (bike.isDeleted) {
            res.status(404).json({
                success: false,
                message: 'Product is no longer available',
            });
            return; // Stop execution
        }

        // Check inventory stock
        if (bike.quantity < quantity) {
            res.status(400).json({
                success: false,
                message: 'Insufficient stock to fulfill the order',
            });
            return; // Stop execution
        }

        // Calculate total price
        const totalPrice = bike.price * quantity;

        // Reduce the bike's quantity and update `inStock` status
        bike.quantity -= quantity;
        if (bike.quantity === 0) {
            bike.inStock = false;
        }
        await bike.save({ session }); // Save the updated bike in the same session

        // Create the order
        const newOrder = await Order.create([{ email, product, quantity, totalPrice }], { session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        // Construct response with `_id` at the top
        const responseData = {
            _id: newOrder[0]._id,
            email: newOrder[0].email,
            product: newOrder[0].product,
            quantity: newOrder[0].quantity,
            totalPrice: newOrder[0].totalPrice,
            createdAt: newOrder[0].createdAt,
            updatedAt: newOrder[0].updatedAt,
        };

        // Send the response
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: responseData,
        });
    } catch (error) {
        // Rollback transaction if an error occurs
        await session.abortTransaction();
        session.endSession();

        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the order',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Calculate total revenue from all orders
const calculateRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
        ]);

        const revenue = totalRevenue[0]?.totalRevenue || 0;

        res.status(200).json({
            success: true,
            message: 'Revenue calculated successfully',
            data: {
                totalRevenue: revenue,
            },
        });
    } catch (error: unknown) {
        // Type-safe handling of the error
        const errorMessage =
            error instanceof Error ? error.message : 'An unexpected error occurred';

        console.error('Error calculating revenue:', errorMessage);
        res.status(500).json({
            success: false,
            message: errorMessage,
        });
    }
};

// Export the OrderController
export const OrderController = {
    createOrder,
    calculateRevenue,
};

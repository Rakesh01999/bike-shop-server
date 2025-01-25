import { Schema, model } from 'mongoose';
import { OrderModel, TOrder } from './order.interface';

const orderSchema = new Schema<TOrder, OrderModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    product: {
      // type: Schema.Types.ObjectId,
      type: String,
      ref: 'Bike', // Reference to Bike model
      required: [true, 'Product reference is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Order quantity must be at least 1'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price must be a positive number'],
    },
  },
  {
    timestamps: true,
  }
);

// Add this static method in the orderSchema
orderSchema.statics.calculateTotalRevenue = async function () {
  try {
    const result = await this.aggregate([
      {
        $lookup: {
          from: 'bikes', // Match with the 'Bike' collection
          localField: 'product',
          foreignField: '_id',
          as: 'bikeDetails',
        },
      },
      { $unwind: '$bikeDetails' }, // Flatten the bikeDetails array
      {
        $group: {
          _id: null, // Group all documents together
          totalRevenue: {
            $sum: { $multiply: ['$quantity', '$bikeDetails.price'] }, // Calculate revenue
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field from the result
          totalRevenue: 1, // Include totalRevenue field
        },
      },
    ]);

    return result[0]?.totalRevenue || 0; // Return total revenue or 0 if no orders
  } catch (error: unknown) {
    console.log("Error calculating revenue:", error); // Log the error for debugging
    throw new Error('Error calculating revenue'); // Throw error to be caught by the controller
  }
};


export const Order = model<TOrder, OrderModel>('Order', orderSchema);

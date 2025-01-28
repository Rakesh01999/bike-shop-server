import { Document, Model } from 'mongoose';

export interface TOrder extends Document {
    email: string;
    product: string; // Bike ID (ObjectId)
    quantity: number;
    totalPrice: number;
    status: "Pending" | "Paid" | "Shipped" | "Completed" | "Cancelled";
    transaction: {
        id: string;
        transactionStatus: string;
        bank_status: string;
        sp_code: string;
        sp_message: string;
        method: string;
        date_time: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderModel extends Model<TOrder> {
    calculateRevenue(): Promise<number>;
}

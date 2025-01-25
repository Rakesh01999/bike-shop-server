import { Document, Model } from 'mongoose';

export interface TOrder extends Document {
    email: string;
    product: string; // Bike ID (ObjectId)
    quantity: number;
    totalPrice: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderModel extends Model<TOrder> {
    calculateRevenue(): Promise<number>;
}

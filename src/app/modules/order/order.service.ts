import { Order } from './order.model';

export const OrderServices = {
    async createOrderInDB(data: { email: string; product: string; quantity: number; totalPrice: number }) {
        const order = new Order(data);
        return await order.save();
    },

    async calculateRevenue() {
        return await Order.calculateRevenue();
    },
};

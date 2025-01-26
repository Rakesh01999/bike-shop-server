import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
// import { AuthRoutes } from './modules/auth/auth.route';
// import { ProductRoutes } from './modules/product/product.route';
// import { OrderRoutes } from './modules/order/order.route';
// import { UserRoutes } from '../modules/User/user.route';

const router = Router();

const moduleRoutes = [
//   {
//     path: '/auth',
//     route: AuthRoutes, // User registration, login
//   },
//   {
//     path: '/products',
//     route: ProductRoutes, // Product CRUD operations
//   },
//   {
//     path: '/orders',
//     route: OrderRoutes, // Order management and checkout
//   },
  {
    path: '/users',
    route: UserRoutes, // Manage customers and admins
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

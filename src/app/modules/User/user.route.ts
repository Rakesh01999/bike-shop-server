/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { upload } from '../../utils/sendImageToCloudinary';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

/**
 * Create a customer
 */
router.post(
  '/create-customer',
  auth('admin'), // Only admin can create customers
  upload.single('file'), // Upload customer profile image
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data); // Parse the body from the multipart request
    next();
  },
  validateRequest(UserValidation.createCustomerValidationSchema), // Validate customer creation data
  UserControllers.createCustomer, // Controller to handle customer creation
);

/**
 * Create an admin
 */
router.post(
  '/create-admin',
  auth('admin'), // Only an admin can create another admin
  upload.single('file'), // Upload admin profile image
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data); // Parse the body from the multipart request
    next();
  },
  validateRequest(UserValidation.createAdminValidationSchema), // Validate admin creation data
  UserControllers.createAdmin, // Controller to handle admin creation
);

/**
 * Change the status of a user
 */
router.post(
  '/change-status/:id',
  auth('admin'), // Only an admin can change user statuses
  validateRequest(UserValidation.changeStatusValidationSchema), // Validate status change data
  UserControllers.changeStatus, // Controller to change user status
);

/**
 * Get the authenticated user's profile
 */
router.get(
  '/me',
  auth('customer', 'admin'), // Both customer and admin can fetch their own profile
  UserControllers.getMe, // Controller to fetch authenticated user's profile
);

/**
 * Delete a user by ID
 */
router.delete(
  '/:id',
  auth('admin'), // Only admin can delete a user
  UserControllers.deleteUser, // Controller to delete a user
);

/**
 * Get all users
 */
router.get(
  '/',
  auth('admin'), // Only admin can retrieve all users
  UserControllers.getAllUsers, // Controller to fetch all users
);

export const UserRoutes = router;

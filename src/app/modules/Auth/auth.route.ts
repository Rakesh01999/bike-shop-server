import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../User/user.constant';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @description Log in a user (customer, admin, etc.)
 * @access Public
 */
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

/**
 * @route POST /api/auth/change-password
 * @description Allows users to change their password
 * @access Protected (requires authentication)
 */
router.post(
  '/change-password',
  auth(
    USER_ROLE.admin,
  ),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

/**
 * @route POST /api/auth/refresh-token
 * @description Refresh the user's access token using the refresh token
 * @access Public
 */
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

/**
 * @route POST /api/auth/forget-password
 * @description Generate a password reset link
 * @access Public
 */
router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

/**
 * @route POST /api/auth/reset-password
 * @description Reset the user's password using the reset token
 * @access Public
 */
router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema), // Correct schema for reset password
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;

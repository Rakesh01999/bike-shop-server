import { z } from 'zod';

// Validation for login
const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required.' }).email({ message: 'Invalid email address' }),
    password: z.string({ required_error: 'Password is required.' }),
  }),
});

// Validation for changing the password
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required.',
    }),
    newPassword: z.string({ required_error: 'New password is required.' }),
  }),
});

// Validation for refreshing the token
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

// Validation for forgetting the password
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User email is required!',
    }).email({ message: 'Invalid email address' }),
  }),
});

// Validation for resetting the password
const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User email is required!',
    }).email({ message: 'Invalid email address' }),
    newPassword: z.string({
      required_error: 'New password is required!',
    }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};

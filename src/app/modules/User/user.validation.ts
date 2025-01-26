import { z } from 'zod';

const userValidationSchema = z.object({
  pasword: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'Password can not be more than 20 characters' })
    .optional(),
});

// const changeStatusValidationSchema = z.object({
//   body: z.object({
//     status: z.enum([...USER_STATUS] as [string, ...string[]]),
//   }),
// });

// Validation schema for creating a customer
// const createCustomerValidationSchema = z.object({
//   body: z.object({
//     user: z.object({
//       name: z.string({ required_error: 'Name is required.' }),
//       email: z.string({ required_error: 'Email is required.' }).email('Invalid email format.'),
//       password: z.string({ required_error: 'Password is required.' }),
//     }), 
//   }),
// });
const createUserValidationSchema = z.object({
  body: z.object({
      name: z.string({ required_error: 'Name is required.' }),
      email: z.string({ required_error: 'Email is required.' }).email('Invalid email format.'),
      password: z.string({ required_error: 'Password is required.' }),
  }),
});

// Validation schema for creating an admin
const createAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name: z.string({ required_error: 'Name is required.' }),
      email: z.string({ required_error: 'Email is required.' }).email('Invalid email format.'),
      password: z.string({ required_error: 'Password is required.' }),
    }),
  }),
});

// Validation schema for changing user status
const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'blocked', ], {
      required_error: 'Status is required.',
      invalid_type_error: 'Invalid status provided.',
    }),
  }),
});


export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
  // createCustomerValidationSchema,
  createAdminValidationSchema,
  createUserValidationSchema,
};

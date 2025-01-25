import { z } from "zod";

// Updated Bike validation schema
const bikeValidationSchema = z.object({
  modelNumber: z
    .string()
    .min(1, "Model Number is required")
    .refine(
      (value) => /^[a-zA-Z0-9-]+$/.test(value), // Allows letters, numbers, and dashes
      { message: "Model Number can only contain letters, numbers, and dashes" }
    ),
  name: z
    .string()
    .min(1, "Bike name is required")
    .max(50, "Bike name cannot exceed 50 characters")
    .refine(
      (value) => value.charAt(0) === value.charAt(0).toUpperCase(),
      { message: "Bike name must start with a capital letter" }
    ),
  brand: z.string().min(1, "Brand is required"),
  category: z.enum(["Mountain", "Road", "Hybrid", "Electric"], {
    invalid_type_error: "Invalid category",
  }),
  price: z
    .number()
    .positive("Price must be a positive number")
    .min(0, "Price must be at least 0"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be a non-negative integer"),
  description: z.string().min(1, "Description is required"),
  inStock: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  isDeleted: z.boolean(),
});

export default bikeValidationSchema;

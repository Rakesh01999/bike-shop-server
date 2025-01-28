import Shurjopay, { PaymentResponse, VerificationResponse } from "shurjopay";
import config from "../../config";

// Define the payload type
// type TPaymentPayload = {
//   amount: number; // Payment amount
//   order_id: string; // Unique order ID
//   currency: string; // Payment currency (e.g., "BDT")
//   customer_name: string; // Customer's full name
//   customer_email: string; // Customer's email address
//   client_ip: string; // Customer's IP address
//   customer_phone?: string; // Optional phone number
//   customer_address?: string; // Optional address
//   customer_city?: string; // Optional city
// };

// Initialize ShurjoPay
const shurjopay = new Shurjopay();

shurjopay.config(
  config.sp.sp_endpoint!,
  config.sp.sp_username!,
  config.sp.sp_password!,
  config.sp.sp_prefix!,
  config.sp.sp_return_url!
);


// Create a payment
const makePayment = async (
  paymentPayload: any
): Promise<PaymentResponse> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      (response) => resolve(response),
      (error) => reject(error)
    );
  });
};

// Verify a payment
const verifyPaymentAsync = (
  order_id: string
): Promise<VerificationResponse[]> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (response) => resolve(response),
      (error) => reject(error)
    );
  });
};

// Export utility functions
export const orderUtils = {
  makePayment,
  verifyPaymentAsync,
};

// /Users/gios_laptop/chatbot_2/utils/square/functions/paymentClient.ts

import { generateIdempotencyKey } from "../../functions/generateIdempotencyKey"; 

// Generic function to call the API endpoint
export async function createPayment(paymentData: {
  amount: string | number;
  currency: string;
  idempotencyKey: string;
  sourceId: string;
}) {
  try {
    const response = await fetch("/api/square/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error("Payment creation failed.");
    }

    return await response.json();
  } catch (error: any) {
    // Optional: add logging or error handling here
    throw error;
  }
}

// Utility function for $1.00 premium access with 24-hour countdown
export async function createPaymentForPremiumAccess(cardNonce: string) {
  const paymentData = {
    amount: 100, // $1.00 in cents
    currency: "USD",
    idempotencyKey: generateIdempotencyKey(),
    sourceId: cardNonce,
  };

  return createPayment(paymentData);
}

// Utility function for $20.00 unlimited chatbot access monthly
export async function createPaymentForUnlimitedAccess(cardNonce: string) {
  const paymentData = {
    amount: 2000, // $20.00 in cents
    currency: "USD",
    idempotencyKey: generateIdempotencyKey(),
    sourceId: cardNonce,
  };

  return createPayment(paymentData);
}

// Utility function for $50.00 monthly charge for DB space
export async function createPaymentForDBSpace(cardNonce: string) {
  const paymentData = {
    amount: 5000, // $50.00 in cents
    currency: "USD",
    idempotencyKey: generateIdempotencyKey(),
    sourceId: cardNonce,
  };

  return createPayment(paymentData);
}
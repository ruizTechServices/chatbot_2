// app/api/square/payment/route.ts

import { NextResponse } from "next/server";
import { SquareClient, SquareEnvironment } from "square";

export async function POST(request: Request) {
  try {
    // Parse the JSON payload from the request
    const body = await request.json();
    const { amount, currency, idempotencyKey, sourceId } = body;

    // Validate required fields
    if (!amount || !currency || !idempotencyKey || !sourceId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Initialize the Square client using environment variables for security
    const client = new SquareClient({
      environment:
        process.env.NODE_ENV === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
      token: process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN || "", // set your token in the .env file
    });

    // Create the payment using the Square API
    const response = await client.payments.create({
      amountMoney: {
        amount: BigInt(amount), // Ensure amount is a BigInt
        currency,
      },
      idempotencyKey,
      sourceId,
    });

    // Return the successful response
    return NextResponse.json(response);
  } catch (error: any) {
    // Log the error if needed and return an error response
    return NextResponse.json(
      { error: error.message || "Payment creation failed." },
      { status: 500 }
    );
  }
}
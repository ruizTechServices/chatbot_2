import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma";
import { SquareClient, SquareEnvironment } from 'square';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

// Removed local interfaces (Money, QuickPay, CreatePaymentLinkRequest) since they were unused.

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  // check existing session
  const session = await prisma.userSession.findUnique({ where: { userId } });
  if (session && session.expiresAt > new Date()) {
    return NextResponse.json({ redirect: "/chatbot_basic" });
  }

  const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment:
      process.env.NODE_ENV === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  });

  // Determine the base URL for redirects. Falls back to localhost in dev or production domain otherwise.
  const baseUrl =
    process.env.NEXT_PUBLIC_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://24hourgpt.com");

  // Access the payment links API correctly
  const { paymentLinks } = client.checkout;

  try {
    const response = await paymentLinks.create({
      idempotencyKey: randomUUID(),
      quickPay: {
        name: "24-Hour GPT Access",
        priceMoney: { amount: 100n, currency: "USD" },
        locationId: process.env.SQUARE_LOCATION_ID!,
      },
      checkoutOptions: {
        redirectUrl: `${baseUrl}/chatbot_basic`,
        askForShippingAddress: false,
      },
      paymentNote: userId,
    });
    return NextResponse.json({ checkoutUrl: response.paymentLink?.url });
  } catch (error) {
    console.error('Square API Error:', error);
    return new Response(JSON.stringify({ error: 'Square API Error', details: error }), { status: 500 });
  }
}
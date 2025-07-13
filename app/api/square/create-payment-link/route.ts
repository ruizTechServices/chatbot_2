import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma";
import squareClient from "@/utils/square/client";
import type { Currency } from "square/api";
// Local minimal request typing to satisfy eslint
interface Money {
  amount: bigint;
  currency: Currency;
}
interface QuickPay {
  name: string;
  priceMoney: Money;
  locationId: string;
}
interface CreatePaymentLinkRequest {
  idempotencyKey: string;
  quickPay: QuickPay;
  checkoutOptions: { redirectUrl: string };
  prePopulatedData?: Record<string, unknown>;
  subscriptionPlanId?: string;
  note: string;
}
import { generateIdempotencyKey } from "@/utils/functions/generateIdempotencyKey";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  // check existing session 
  const session = await prisma.userSession.findUnique({ where: { userId }});
  if (session && session.expiresAt > new Date()) {
    return Response.json({ redirect: "/chatbot_basic" });
  }

  // Square checkout link
  // Square SDK v^30 exposes `onlineCheckoutsApi` instead of `checkoutApi`
  // Fallback to whichever exists.
  // Square Node SDK v^43 exposes the payment link creation under
  // `client.checkout.paymentLinks.createPaymentLink`
  const paymentLinksClient = squareClient.checkout?.paymentLinks;
  if (!paymentLinksClient) {
    console.error("Square SDK missing paymentLinks client (checkout.paymentLinks)");
    return new Response("Payment not available", { status: 500 });
  }

  const body: CreatePaymentLinkRequest = {
    idempotencyKey: generateIdempotencyKey(),
    quickPay: {
      name: "24-Hour GPT Access",
      priceMoney: { amount: 100n, currency: "USD" as Currency }, // $1.00
      locationId: process.env.SQUARE_LOCATION_ID!,
    },
    checkoutOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/chatbot_basic`,
    },
    // Store Clerk userId so we can correlate on webhook
    prePopulatedData: { buyerEmail: undefined },
    subscriptionPlanId: undefined,
    note: userId,
  };

  const result = await paymentLinksClient.create(body);

  return Response.json({ checkoutUrl: result.paymentLink?.url });
}
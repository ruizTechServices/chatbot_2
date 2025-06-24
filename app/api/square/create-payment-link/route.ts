import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma";
import squareClient from "@/utils/square/client";
// Local minimal request typing to satisfy eslint
interface Money {
  amount: number;
  currency: string;
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
  const checkoutClient = (squareClient as any).checkoutApi ?? squareClient.onlineCheckoutsApi;
  if (!checkoutClient) {
    console.error("Square SDK missing checkout client");
    return new Response("Payment not available", { status: 500 });
  }
  const body: CreatePaymentLinkRequest = {
    idempotencyKey: generateIdempotencyKey(),
    quickPay: {
      name: "24-Hour GPT Access",
      priceMoney: { amount: 100, currency: "USD" }, // $1.00
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

    const { result } = await checkoutClient.createPaymentLink(body);

  return Response.json({ checkoutUrl: result.paymentLink?.url });
}
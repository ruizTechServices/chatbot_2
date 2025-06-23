import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma";
import squareClient from "@/utils/square/client";
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
  const { checkoutApi } = squareClient;
  const body = {
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
  } as any;

  const { result } = await checkoutApi.createPaymentLink(body);

  return Response.json({ checkoutUrl: result.paymentLink?.url });
}
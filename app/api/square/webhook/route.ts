import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/utils/prisma";

const SIGNATURE_HEADER = "x-square-signature";

/**
 * Verify Square webhook signature.
 * Square sends base64-encoded HMAC-SHA1 of raw request body using your
 * Webhook Signature Key (in plain text, *not* your access token).
 */
function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha1", secret);
  hmac.update(rawBody);
  const expected = hmac.digest("base64");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER);
  const secret = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  if (!secret) {
    console.error("SQUARE_WEBHOOK_SIGNATURE_KEY env var missing");
    return new NextResponse("Server Misconfigured", { status: 500 });
  }

  if (!verifySignature(rawBody, signature, secret)) {
    console.warn("Invalid Square webhook signature");
    return new NextResponse("Invalid signature", { status: 401 });
  }

  interface PaymentUpdatedEvent {
  type: "payment.updated";
  data: {
    object: {
      payment: {
        status: string;
        note?: string;
      };
    };
  };
}

let payload: PaymentUpdatedEvent;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  if (payload?.type !== "payment.updated") {
    return new NextResponse("Event ignored", { status: 200 });
  }

  const payment = payload?.data?.object?.payment;
  if (!payment || payment.status !== "COMPLETED") {
    return new NextResponse("Payment not completed", { status: 200 });
  }

  const clerkUserId: string | undefined = payment.note; // we stored it in note
  if (!clerkUserId) {
    console.error("No user id in payment note");
    return new NextResponse("Missing user id", { status: 200 });
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.userSession.upsert({
    where: { userId: clerkUserId },
    update: { expiresAt },
    create: { userId: clerkUserId, expiresAt },
  });

  return new NextResponse("Session updated", { status: 200 });
}

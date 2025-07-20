import { Webhook } from "svix";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

/**
 * Clerk Webhook handler
 * Listens for `user.created` events and ensures a matching User row
 * exists in the local Postgres database (Supabase) so that we always
 * have a stable UUID primary key for relations.
 *
 * To secure:
 * 1. Create a webhook endpoint in Clerk dashboard pointing to
 *    /api/clerk/webhook
 * 2. Set CLERK_WEBHOOK_SECRET in Vercel / .env (value from Clerk)
 */
export async function POST(req: NextRequest) {
  // Raw body is required for Svix signature verification
  const payload = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") ?? "",
    "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
    "svix-signature": req.headers.get("svix-signature") ?? "",
  };

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET env var not set");
    return new NextResponse("Server mis-config", { status: 500 });
  }

  let evt: any;
  try {
    const wh = new Webhook(webhookSecret);
    evt = wh.verify(payload, svixHeaders);
  } catch (err) {
    console.error("Clerk Webhook verification failed", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    const clerkId: string = data.id;
    const email: string | undefined = data.email_addresses?.[0]?.email_address;

    await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: {
        clerkId,
        email: email ?? `no-reply+${clerkId}@example.com`,
      },
    });
  }

  return NextResponse.json({ ok: true });
}

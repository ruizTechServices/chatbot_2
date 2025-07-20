import { NextRequest, NextResponse } from "next/server";
import { Clerk } from "@clerk/clerk-sdk-node";
import { prisma } from "@/utils/prisma";

/**
 * One-off endpoint to backfill existing Clerk users into Supabase `users` table.
 * Protect with BACKFILL_TOKEN header so it can’t be abused.
 * Usage (dev):
 *   curl -H "Authorization: Bearer <token>" http://localhost:3000/api/admin/backfill-users
 */
export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (token !== process.env.BACKFILL_TOKEN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY! });
  let imported = 0;
  for await (const user of clerk.users.getUserList()) {
    const email = user.emailAddresses?.[0]?.emailAddress;
    await prisma.user.upsert({
      where: { clerkId: user.id },
      update: { email },
      create: { clerkId: user.id, email },
    });
    imported++;
  }

  return NextResponse.json({ imported });
}

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@clerk/nextjs/server";

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * GET /api/sessions
 * Get all sessions for the current user
 * Returns: { sessions: UserSession[] }
 */
export async function GET(req: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all sessions for the user, active ones first
    const sessions = await prisma.userSession.findMany({
      where: {
        userId,
      },
      orderBy: [
        { active: "desc" },
        { expiresAt: "desc" }
      ],
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sessions
 * Create a new user session after payment is processed
 * Body: { paymentId: string }
 * Returns: { success: boolean, session: UserSession }
 */
export async function POST(req: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Mark any existing active sessions as inactive
    await prisma.userSession.updateMany({
      where: {
        userId,
        active: true
      },
      data: {
        active: false
      }
    });

    // Create a new session that expires in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const newSession = await prisma.userSession.create({
      data: {
        userId,
        paymentId,
        expiresAt,
        active: true
      }
    });

    return NextResponse.json({
      success: true,
      session: newSession
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

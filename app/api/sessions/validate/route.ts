import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@clerk/nextjs/server";

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * GET /api/sessions/validate
 * Check if the current user has an active session
 * Returns: { hasActiveSession: boolean, expiresIn: number }
 */
export async function GET(req: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { 
          hasActiveSession: false,
          expiresIn: 0
        }
      );
    }

    // Get the most recent active session for the user
    const activeSession = await prisma.userSession.findFirst({
      where: {
        userId,
        active: true,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
      orderBy: {
        expiresAt: "desc", // Get the one that expires last
      },
    });

    if (!activeSession) {
      return NextResponse.json({
        hasActiveSession: false,
        expiresIn: 0,
      });
    }

    // Calculate time remaining in milliseconds
    const expiresIn = activeSession.expiresAt.getTime() - Date.now();

    return NextResponse.json({
      hasActiveSession: true,
      expiresIn: expiresIn > 0 ? expiresIn : 0,
      sessionId: activeSession.id,
    });
  } catch (error) {
    console.error("Error validating session:", error);
    return NextResponse.json(
      { 
        hasActiveSession: false,
        expiresIn: 0,
        error: "Failed to validate session" 
      }, 
      { status: 500 }
    );
  }
}

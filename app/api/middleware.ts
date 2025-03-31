import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Middleware to protect routes that require an active session
 * This can be imported and used in API routes that need session validation
 */
export async function withSessionValidation(
  req: NextRequest,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Get authenticated user
    const authData = await auth();
    const userId = authData?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if the user has an active session
    const activeSession = await prisma.userSession.findFirst({
      where: {
        userId,
        active: true,
        expiresAt: {
          gt: new Date(), // Not expired
        },
      },
    });

    // Add debug logging
    console.log(`Session validation for user ${userId}: ${activeSession ? 'Active session found' : 'No active session'}`);

    if (!activeSession) {
      return NextResponse.json(
        { error: "No active session. Please purchase a 24-hour session to continue." },
        { status: 403 }
      );
    }

    // User has an active session, proceed with the handler
    return handler(req, userId);
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      { error: "Error validating session" },
      { status: 500 }
    );
  }
}

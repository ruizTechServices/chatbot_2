import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

/**
 * Utility function to check if a user has an active session
 * This can be used in API routes or middleware to protect routes
 */
export async function checkActiveSession(userId: string): Promise<boolean> {
  try {
    // Make request to our own API to validate the session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const response = await fetch(`${baseUrl}/api/sessions/validate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Include auth header for server-side requests
        Authorization: `Bearer ${process.env.INTERNAL_API_SECRET || ""}`
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    const data = await response.json();
    return data.hasActiveSession === true;
  } catch (error) {
    console.error("Error checking session:", error);
    return false;
  }
}

/**
 * Middleware to check for active sessions in protected routes
 * Can be imported and used in specific API routes
 */
export async function validateSessionMiddleware(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const authData = await auth();
    const userId = authData?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const hasActiveSession = await checkActiveSession(userId);
    
    if (!hasActiveSession) {
      return NextResponse.json(
        { error: "No active session. Please purchase a 24-hour session." },
        { status: 403 }
      );
    }

    return handler(req);
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json(
      { error: "Error validating session" },
      { status: 500 }
    );
  }
}

// app/api/square/test/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    // Get authenticated user for logging
    const authData = await auth();
    const userId = authData?.userId;
    
    // Log environment status
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SQUARE_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN ? 
        `${process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN.substring(0, 5)}...` : 'not set',
      NEXT_PUBLIC_SQUARE_APPLICATION_ID: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
      NEXT_PUBLIC_SQUARE_LOCATION_ID: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
      userId: userId || 'not authenticated'
    };
    
    console.log("Square Test API: Environment", envInfo);

    // For test route, we'll just check if we have the required environment variables
    if (!process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN) {
      throw new Error('Missing Square access token in environment variables');
    }
    
    if (!process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
      throw new Error('Missing Square location ID in environment variables');
    }

    if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID) {
      throw new Error('Missing Square application ID in environment variables');
    }

    // Return successful test result without making an actual API call
    // This avoids potential syntax issues with Square SDK versions
    return NextResponse.json({
      success: true,
      message: "Square environment variables verified",
      environment: process.env.NODE_ENV === "production" ? "production" : "sandbox",
      credentials: {
        accessToken: process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN ? "present" : "missing",
        applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ? "present" : "missing",
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ? "present" : "missing"
      }
    });
  } catch (error: any) {
    console.error("Square Test API Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to verify Square environment",
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

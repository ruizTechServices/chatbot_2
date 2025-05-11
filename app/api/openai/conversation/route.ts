//app/api/openai/conversation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/utils/openai/functions/chat';

/**
 * POST /api/openai/conversation
 * Generates a chat response from OpenAI
 * Requires an active session
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, model = "gpt-4o" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array required" }, 
        { status: 400 }
      );
    }

    console.log(`Received ${messages.length} messages`);

    // Add a system message to the beginning of the conversation
    const messagesWithSystem = [
      {
        role: "system",
        content: "You are 24HRGPT, a premium AI assistant focused on providing high-quality, detailed, and helpful responses. Be concise but thorough."
      },
      ...messages
    ];

    try {
      const chatResponse = await generateChatResponse(messagesWithSystem, model);
      console.log("OpenAI response received successfully");
      return NextResponse.json(chatResponse);
    } catch (error: unknown) { 
      let errorMessage = 'Unknown API error';
      let errorDetails: unknown = null;
      let errorStatus = 500;

      if (error instanceof Error) {
        errorMessage = error.message;
        const errorAsObj = error as unknown as Record<string, unknown>; 
        errorDetails = errorAsObj; // Keep the original error structure for details
        if (typeof errorAsObj.status === 'number') {
          errorStatus = errorAsObj.status;
        } else if (errorAsObj.response && typeof errorAsObj.response === 'object') {
          const responseObj = errorAsObj.response as Record<string, unknown>;
          if (typeof responseObj.status === 'number') {
            errorStatus = responseObj.status;
          }
          if (responseObj.data) { // For errors like from Axios
            errorDetails = responseObj.data;
          }
        }
      } else if (typeof error === 'string'){
        errorMessage = error;
        errorDetails = error;
      } else if (error && typeof error === 'object'){
        const errorObj = error as Record<string, unknown>;
        if (typeof errorObj.message === 'string') errorMessage = errorObj.message;
        errorDetails = errorObj;
        if (typeof errorObj.status === 'number') errorStatus = errorObj.status;
      }

      console.error("OpenAI API error:", errorMessage, "Details:", errorDetails);
      return NextResponse.json(
        { error: "OpenAI API error", details: errorMessage }, // Provide main message in details
        { status: errorStatus }
      );
    }
  } catch (error: unknown) { 
    console.error("Error in /conversation route:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}
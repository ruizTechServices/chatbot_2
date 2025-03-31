//app/api/openai/conversation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/utils/openai/functions/chat';
import { withSessionValidation } from '@/app/api/middleware';

/**
 * POST /api/openai/conversation
 * Generates a chat response from OpenAI
 * Requires an active session
 */
export async function POST(req: NextRequest) {
  return withSessionValidation(req, async (req, userId) => {
    try {
      const { messages, model = "gpt-4o" } = await req.json();

      if (!messages || !Array.isArray(messages)) {
        return NextResponse.json(
          { error: "Messages array required" }, 
          { status: 400 }
        );
      }

      console.log(`Processing OpenAI conversation for user ${userId} with model ${model}`);
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
      } catch (apiError: any) { // Properly type the error
        console.error("OpenAI API error:", apiError);
        return NextResponse.json(
          { error: "OpenAI API error", details: apiError?.message || "Unknown API error" }, 
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error in /conversation route:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { error: errorMessage }, 
        { status: 500 }
      );
    }
  });
}
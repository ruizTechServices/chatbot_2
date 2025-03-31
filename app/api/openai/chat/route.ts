//app/api/openai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/utils/openai/functions/chat';
import { withSessionValidation } from '@/app/api/middleware';

/**
 * POST /api/openai/chat
 * Protected endpoint for sending messages to OpenAI
 * Requires an active session
 */
export async function POST(req: NextRequest) {
  return withSessionValidation(req, async (req, userId) => {
    try {
      const { messages } = await req.json();
      
      if (!messages || !Array.isArray(messages)) {
        return NextResponse.json(
          { error: "Invalid request. 'messages' must be an array." },
          { status: 400 }
        );
      }
      
      const response = await generateChatResponse(messages);
      return NextResponse.json(response);
    } catch (error) {
      console.error("Error processing chat request:", error);
      return NextResponse.json(
        { error: "Failed to process chat request" },
        { status: 500 }
      );
    }
  });
}

//This is How to test endpoint on Postman to check if the API is working.
// {
//   "messages": [
//     {
//       "role": "user",
//       "content": "hello"
//     }
//   ],
//   "model": "gpt-4o"
// }
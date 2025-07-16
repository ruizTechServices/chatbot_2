//app/api/openai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/utils/openai/functions/chat';
import { withSecurity } from '@/utils/security/middleware';
import { ChatRequestSchema } from '@/utils/validation/schemas';

/**
 * POST /api/openai/chat
 * Protected endpoint for sending messages to OpenAI
 * Requires an active session
 * Now includes Zod validation and security middleware
 */
export const POST = withSecurity(
  ChatRequestSchema,
  async (req: NextRequest, validatedData) => {
    try {
      const { messages, model } = validatedData;
      
      const response = await generateChatResponse(messages, model);
      
      return NextResponse.json(response);
    } catch (error) {
      console.error("Error processing chat request:", error);
      return NextResponse.json(
        { error: "Failed to process chat request" },
        { status: 500 }
      );
    }
  }
);

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
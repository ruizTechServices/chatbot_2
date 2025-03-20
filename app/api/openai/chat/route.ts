//app/api/openai/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/utils/openai/functions/chat';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const response = await generateChatResponse(messages);
  return NextResponse.json(response);
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
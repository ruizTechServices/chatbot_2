//app/api/openai/conversation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/utils/openai/functions/chat';

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "gpt-4o" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }


    const chatResponse = await generateChatResponse([
      {
        role: "system",
        content: messages[0].content
      },
      ...messages
    ], model);

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.error("Error in /conversation route:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
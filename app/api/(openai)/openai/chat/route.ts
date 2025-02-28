import { NextRequest, NextResponse } from 'next/server';
import openai from '@/utils/openai/client';

export async function POST(req: NextRequest) {
  try {
    const { messages, model = "gpt-4o" } = await req.json();

    if (!messages) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
    });

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
    }
  }
}

//This is a test endpoint to check if the API is working.
// {
//     "messages": [
//       { "role": "user", "content": "Hello" }
//     ]
//   }
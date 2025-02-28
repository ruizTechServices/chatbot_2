import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const { text, model = "tts-1", voice = "alloy" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 });
    }

    const response = await openai.audio.speech.create({
      model,
      input: text,
      voice,
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
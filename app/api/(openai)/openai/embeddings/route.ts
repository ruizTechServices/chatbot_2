import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const { input, model = "text-embedding-3-small" } = await req.json();

    if (!input) {
      return NextResponse.json({ error: "Input text is required" }, { status: 400 });
    }

    const response = await openai.embeddings.create({
      model,
      input,
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

//This endpoint is complete.
// {
//   "input": "Your text here"
// }
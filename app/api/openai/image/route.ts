//app/api/openai/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/utils/openai/functions/image';

export async function POST(req: NextRequest) {
  try {
    const { prompt, size } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const response = await generateImage(prompt, size);
    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


///This endpoint is complete.
// {
//   "prompt": "a fast car",
//   "size": "1024x1024"
// }
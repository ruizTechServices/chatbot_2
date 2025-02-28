//app/api/openai/embeddings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateEmbeddings } from '@/utils/openai/functions/embeddings';

export async function POST(req: NextRequest) {
  const { input } = await req.json();
  const response = await generateEmbeddings(input);
  return NextResponse.json(response);
}

//This endpoint is complete.
// {
//   "model":"text-embedding-3-small",
//   "input":"hello"
// }
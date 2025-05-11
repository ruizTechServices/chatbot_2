import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateEmbeddings } from '@/utils/openai/functions/embeddings';
import { getUserNamespace } from '@/utils/pinecone/client';

/**
 * POST /api/pinecone/upsert
 * Upserts a vector into Pinecone for the authenticated user
 * Body: { input: string, metadata: { conversationId?: string, messageId?: string } }
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { input, metadata } = await req.json();
    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Input text is required.' }, { status: 400 });
    }
    // Generate embedding
    const embeddingResponse = await generateEmbeddings(input);
    const vector = embeddingResponse.data?.[0]?.embedding;
    if (!vector) {
      return NextResponse.json({ error: 'Failed to generate embedding.' }, { status: 500 });
    }
    // Prepare Pinecone vector
    const id = metadata?.messageId || metadata?.conversationId || `${userId}:${Date.now()}`;
    const ns = getUserNamespace(userId);
    await ns.upsert([{
      id,
      values: vector,
      metadata: {
        userId,
        ...metadata,
        input,
        createdAt: new Date().toISOString()
      }
    }]);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Pinecone upsert error:', error);
    let errorMessage = 'Failed to upsert embedding.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { withSessionValidation } from '@/app/api/middleware';
import { generateEmbeddings } from '@/utils/openai/functions/embeddings';
import { getUserNamespace } from '@/utils/pinecone/client';

/**
 * POST /api/pinecone/upsert
 * Upserts a vector into Pinecone for the authenticated user
 * Body: { input: string, metadata: { conversationId?: string, messageId?: string } }
 */
export async function POST(req: NextRequest) {
  return withSessionValidation(req, async (req, userId) => {
    try {
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
      return NextResponse.json({ error: 'Failed to upsert embedding.' }, { status: 500 });
    }
  });
}

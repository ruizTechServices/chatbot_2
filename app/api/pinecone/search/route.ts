import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateEmbeddings } from '@/utils/openai/functions/embeddings';
import { getUserNamespace } from '@/utils/pinecone/client';

/**
 * POST /api/pinecone/search
 * Searches Pinecone for similar vectors in the user's namespace
 * Body: { query: string, topK?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, topK = 5 } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query text is required.' }, { status: 400 });
    }
    // Generate embedding for the query
    const embeddingResponse = await generateEmbeddings(query);
    const vector = embeddingResponse.data?.[0]?.embedding;
    if (!vector) {
      return NextResponse.json({ error: 'Failed to generate embedding.' }, { status: 500 });
    }
    // Search Pinecone
    const ns = getUserNamespace(userId);
    const results = await ns.query({
      topK,
      vector,
      includeMetadata: true
    });
    return NextResponse.json({ matches: results.matches || [] });
  } catch (error) {
    console.error('Pinecone search error:', error);
    let errorMessage = 'Failed to search embeddings.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

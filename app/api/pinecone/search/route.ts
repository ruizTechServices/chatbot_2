import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { getUserNamespace } from '@/utils/pinecone/client';
import { withSecurity } from '@/utils/security/middleware';
import { PineconeSearchSchema } from '@/utils/validation/schemas';

/**
 * POST /api/pinecone/search
 * Searches Pinecone for similar vectors in the user's namespace
 * Now includes Zod validation and security middleware
 */
export const POST = withSecurity(
  PineconeSearchSchema,
  async (req: NextRequest, validatedData) => {
    try {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { vector, topK = 5, includeMetadata = true } = validatedData;
      
      // Search Pinecone
      const ns = getUserNamespace(userId);
      const results = await ns.query({
        topK,
        vector,
        includeMetadata
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
);

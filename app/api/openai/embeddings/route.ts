//app/api/openai/embeddings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateEmbeddings } from '@/utils/openai/functions/embeddings';
import { withSecurity } from '@/utils/security/middleware';
import { EmbeddingRequestSchema } from '@/utils/validation/schemas';

export const POST = withSecurity(
  EmbeddingRequestSchema,
  async (req: NextRequest, validatedData) => {
    try {
      const { text, model } = validatedData;
      const response = await generateEmbeddings(text, model);
      return NextResponse.json(response);
    } catch (error) {
      console.error("Error processing embeddings request:", error);
      return NextResponse.json(
        { error: "Failed to process embeddings request" },
        { status: 500 }
      );
    }
  }
);

//This endpoint is complete.
// {
//   "model":"text-embedding-3-small",
//   "input":"hello"
// }
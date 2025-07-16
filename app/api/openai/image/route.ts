//app/api/openai/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/utils/openai/functions/image';
import { withSecurity } from '@/utils/security/middleware';
import { ImageRequestSchema } from '@/utils/validation/schemas';

export const POST = withSecurity(
  ImageRequestSchema,
  async (req: NextRequest, validatedData) => {
    try {
      const { prompt, size, n } = validatedData;
      const response = await generateImage(prompt, size);
      return NextResponse.json(response);
    } catch (error) {
      console.error("Error processing image request:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }
);

///This endpoint is complete.
// {
//   "prompt": "a fast car",
//   "size": "1024x1024"
// }
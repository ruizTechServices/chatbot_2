//app/api/google/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withSecurity } from '@/utils/security/middleware';
import { ChatRequestSchema } from '@/utils/validation/schemas';

export const POST = withSecurity(
  ChatRequestSchema,
  async (req: NextRequest, validatedData) => {
    try {
      const { messages } = validatedData;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return NextResponse.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
      }

      // Convert messages to Gemini format
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents }),
        }
      );

      if (!response.ok) {
        console.error("Error response from Gemini API:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error processing Gemini request:", error);
      return NextResponse.json(
        { error: "Failed to process Gemini request" },
        { status: 500 }
      );
    }
  }
);

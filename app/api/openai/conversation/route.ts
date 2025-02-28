import { NextRequest, NextResponse } from 'next/server';
import { handleUserSession } from '@/utils/userSession';
import { generateChatResponse } from '@/utils/openai/functions/chat';
import { generateEmbeddings } from '@/utils/openai/functions/embeddings';

export async function POST(req: NextRequest) {
  try {
    const { supabaseUser, pineconeNamespace } = await handleUserSession();
    const { messages, model = "gpt-4o" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const userMessage = messages[messages.length - 1].content;

    const embeddingsResponse = await generateEmbeddings(userMessage);
    const embeddings = embeddingsResponse.data[0].embedding;

    await pineconeNamespace.upsert([{ id: Date.now().toString(), values: embeddings, metadata: { text: userMessage } }]);

    const context = await pineconeNamespace.query({ vector: embeddings, topK: 5 });

    const chatResponse = await generateChatResponse([
      {
        role: "system",
        content: `Context: ${context.matches.map(c => c.metadata?.text ?? "").join("\n")}`
      },
      ...messages
    ], model);

    return NextResponse.json(chatResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
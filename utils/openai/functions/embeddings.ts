import openai from '../client';

export async function generateEmbeddings(input: string, model = 'text-embedding-ada-002') {
  const response = await openai.embeddings.create({
    model,
    input,
  });
  return response;
}
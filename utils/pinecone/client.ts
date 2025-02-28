import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });

export const getUserNamespace = (userId: string) => {
  const index = pc.index(process.env.PINECONE_INDEX || '24hourgpt');
  return index.namespace(userId);
};

export const storeUserEmbedding = async (userId: string, vectors: any[]) => {
  const namespace = getUserNamespace(userId);
  await namespace.upsert(vectors);
};

export const retrieveUserEmbeddings = async (userId: string, queryVector: number[]) => {
  const namespace = getUserNamespace(userId);
  const result = await namespace.query({ vector: queryVector, topK: 5 });
  return result.matches;
};
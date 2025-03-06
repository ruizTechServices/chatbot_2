import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });

export const getUserNamespace = (userId: string) => {
  const index = pc.index(process.env.PINECONE_INDEX || '24hourgpt');
  return index.namespace(userId);
};
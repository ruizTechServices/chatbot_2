import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

export function getUserNamespace(userId: string) {
  return pc.index(process.env.PINECONE_INDEX || '24HourGPT-main').namespace(userId);
}
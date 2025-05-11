import { Pinecone } from '@pinecone-database/pinecone';

// Initialize Pinecone client only if API key is available
let pc: Pinecone | null = null;

// Conditional initialization to avoid errors during build
if (process.env.PINECONE_API_KEY) {
  try {
    pc = new Pinecone({ 
      apiKey: process.env.PINECONE_API_KEY 
    });
  } catch (error) {
    console.error('Failed to initialize Pinecone client:', error);
  }
}

// Safely get user namespace with error handling
export const getUserNamespace = (userId: string) => {
  if (!pc) {
    throw new Error('Pinecone client not initialized. Please check your API key.');
  }
  
  const indexName = process.env.PINECONE_INDEX || '24hourgpt';
  const index = pc.index(indexName);
  return index.namespace(userId);
};
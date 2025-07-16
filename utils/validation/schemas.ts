// utils/validation/schemas.ts
import { z } from 'zod';

// Chat message schema
export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(10000), // Limit message length
});

// Chat request schema
export const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50), // Limit conversation history
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().min(1).max(4000).optional(),
});

// Conversation schema
export const ConversationSchema = z.object({
  title: z.string().min(1).max(200),
  messages: z.array(MessageSchema).optional(),
});

// Embedding request schema
export const EmbeddingRequestSchema = z.object({
  text: z.string().min(1).max(8000),
  model: z.string().optional(),
});

// Image generation schema
export const ImageRequestSchema = z.object({
  prompt: z.string().min(1).max(1000),
  size: z.enum(['256x256', '512x512', '1024x1024']).optional(),
  n: z.number().min(1).max(4).optional(),
});

// Pinecone upsert schema
export const PineconeUpsertSchema = z.object({
  vectors: z.array(z.object({
    id: z.string(),
    values: z.array(z.number()),
    metadata: z.record(z.any()).optional(),
  })).min(1).max(100),
});

// Pinecone search schema
export const PineconeSearchSchema = z.object({
  vector: z.array(z.number()).min(1),
  topK: z.number().min(1).max(100).optional(),
  includeMetadata: z.boolean().optional(),
});

// Rate limiting schema
export const RateLimitSchema = z.object({
  userId: z.string(),
  endpoint: z.string(),
  timestamp: z.number(),
});

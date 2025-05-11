//utils/openai/client.ts
import OpenAI from 'openai';

// Provide a fallback API key or placeholder for development
const apiKey = process.env.OPENAI_API_KEY || 'placeholder-key-update-env-file';

// Create OpenAI client with error handling
const openai = new OpenAI({
  apiKey,
  // Default configuration
  defaultHeaders: {
    'Content-Type': 'application/json',
  }
});

export default openai;  
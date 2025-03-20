///Users/gios_laptop/chatbot_2/utils/openai/client.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default openai;
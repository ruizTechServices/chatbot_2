import { ElevenLabsClient } from 'elevenlabs';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});

export default client;
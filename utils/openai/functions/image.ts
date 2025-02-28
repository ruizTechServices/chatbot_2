import openai from '@/utils/openai/client';

export async function generateImage(prompt: string, size: '1024x1024' | '256x256' | '512x512' | '1792x1024' | '1024x1792' = '1024x1024') {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    size,
  });
    return response;
}
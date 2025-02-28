import openai from '@/utils/openai/client';

export async function generateChatResponse(messages: any[], model = 'gpt-4o') {
    const response = await openai.chat.completions.create({
        model,
        messages,
    });
    return response;
}
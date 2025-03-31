///Users/gios_laptop/chatbot_2/utils/openai/functions/chat.ts
import openai from '@/utils/openai/client';

export async function generateChatResponse(messages: any[], model = 'gpt-4o') {
    try {
        console.log(`Calling OpenAI API with model: ${model}`);
        console.log(`Using API key: ${process.env.OPENAI_API_KEY ? "API key exists" : "API key is missing"}`);
        
        const response = await openai.chat.completions.create({
            model,
            messages,
        });
        
        return response;
    } catch (error: any) {
        console.error("Error in OpenAI call:", error.message);
        console.error("Error status:", error.status);
        console.error("Error type:", error.type);
        throw error; // Re-throw to be handled by the caller
    }
}
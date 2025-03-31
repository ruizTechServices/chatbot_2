///Users/gios_laptop/chatbot_2/app/api/conversations/[id]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withSessionValidation } from '@/app/api/middleware';
import openai from '@/utils/openai/client'; // Direct import of OpenAI client
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'; // Import the correct type

const prisma = new PrismaClient();

/**
 * POST /api/conversations/[id]/messages
 * Add a new message to a conversation and get AI response
 * Requires an active session
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withSessionValidation(request, async (request, userId) => {
    try {
      // Await the asynchronous params before destructuring.
      const { id } = await context.params;
      const { message, model } = await request.json();

      const conversation = await prisma.conversation.findFirst({
        where: { id, userId }
      });
      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' }, 
          { status: 404 }
        );
      }

      const maxPositionResult = await prisma.message.findFirst({
        where: { conversationId: id },
        orderBy: { positionId: 'desc' },
        select: { positionId: true }
      });
      const nextPositionId = maxPositionResult ? maxPositionResult.positionId + 1 : 0;

      await prisma.message.create({
        data: {
          conversationId: id,
          positionId: nextPositionId,
          text: message.content,
          isUser: true
        }
      });

      const conversationMessages = await prisma.message.findMany({
        where: { conversationId: id },
        orderBy: { positionId: 'asc' }
      });

      // Format messages for OpenAI API with proper typing
      const formattedMessages: ChatCompletionMessageParam[] = conversationMessages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));

      // Instead of using our API route, directly use the OpenAI client here
      // This removes a potential point of failure in the middleware
      try {
        console.log("Directly calling OpenAI API...");
        console.log(`OpenAI API Key exists: ${process.env.OPENAI_API_KEY ? "Yes" : "No"}`);
        
        // Add system message
        const messagesWithSystem: ChatCompletionMessageParam[] = [
          {
            role: 'system',
            content: "You are 24HRGPT, a premium AI assistant focused on providing high-quality, detailed, and helpful responses. Be concise but thorough."
          },
          ...formattedMessages
        ];
        
        // Call OpenAI directly
        const aiResponse = await openai.chat.completions.create({
          model: model || "gpt-4o",
          messages: messagesWithSystem,
        });
        
        const assistantContent = aiResponse.choices[0]?.message?.content;
        if (!assistantContent) {
          throw new Error('Invalid AI response format');
        }

        // Save the assistant's message
        await prisma.message.create({
          data: {
            conversationId: id,
            positionId: nextPositionId + 1,
            text: assistantContent,
            isUser: false
          }
        });

        let title = conversation.title;
        if (conversationMessages.length <= 2) {
          title = message.content.split(' ').slice(0, 5).join(' ') + '...';
          await prisma.conversation.update({
            where: { id },
            data: { title }
          });
        }

        return NextResponse.json({
          userMessage: { role: 'user', content: message.content },
          assistantMessage: { role: 'assistant', content: assistantContent },
          title
        });
      } catch (openaiError: any) {
        console.error("OpenAI API Error:", openaiError.message);
        console.error("OpenAI Error Status:", openaiError.status);
        return NextResponse.json(
          { error: 'Failed to get AI response', details: openaiError.message }, 
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Error processing message:', error);
      return NextResponse.json(
        { error: 'Failed to process message' }, 
        { status: 500 }
      );
    }
  });
}
///Users/gios_laptop/chatbot_2/app/api/conversations/[id]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import openai from '@/utils/openai/client'; // Direct import of OpenAI client
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'; // Import the correct type
import { auth } from '@clerk/nextjs/server'; // Added auth import

const prisma = new PrismaClient();

/**
 * POST /api/conversations/[id]/messages
 * Add a new message to a conversation and get AI response
 * Requires an active session
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  // Assumes path like /api/conversations/{id}/messages
  const conversationsIndex = pathParts.findIndex(part => part === 'conversations');
  const conversationId = conversationsIndex !== -1 && pathParts.length > conversationsIndex + 1 ? pathParts[conversationsIndex + 1] : '';
  if (!conversationId) {
    return NextResponse.json({ error: 'Conversation ID not found in path' }, { status: 400 });
  }

  const { userId } = await auth(); // Use auth() for userId

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); // Standard unauthorized response
  }

  try {
    const { message, model } = await request.json();

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId }
    });
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' }, 
        { status: 404 }
      );
    }

    const maxPositionResult = await prisma.message.findFirst({
      where: { conversationId },
      orderBy: { positionId: 'desc' },
      select: { positionId: true }
    });
    const nextPositionId = maxPositionResult ? maxPositionResult.positionId + 1 : 0;

    await prisma.message.create({
      data: {
        conversationId,
        positionId: nextPositionId,
        text: message.content,
        isUser: true
      }
    });

    const conversationMessages = await prisma.message.findMany({
      where: { conversationId },
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
          conversationId,
          positionId: nextPositionId + 1,
          text: assistantContent,
          isUser: false
        }
      });

      let title = conversation.title;
      if (conversationMessages.length <= 2) {
        title = message.content.split(' ').slice(0, 5).join(' ') + '...';
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { title }
        });
      }

      return NextResponse.json({
        userMessage: { role: 'user', content: message.content },
        assistantMessage: { role: 'assistant', content: assistantContent },
        title
      });
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred while communicating with OpenAI';
      let errorStatus: number | string = 500;

      if (error instanceof Error) {
        errorMessage = error.message;
        // Check for non-standard properties on the Error object
        const errorAsObj = error as unknown as Record<string, unknown>; // More specific than 'any', via unknown
        if (typeof errorAsObj.status === 'number' || typeof errorAsObj.status === 'string') {
          errorStatus = errorAsObj.status as (number | string);
        } else if (errorAsObj.response && typeof errorAsObj.response === 'object') {
          const responseObj = errorAsObj.response as Record<string, unknown>;
          if (typeof responseObj.status === 'number') {
            errorStatus = responseObj.status;
          }
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') { // For generic objects not Error instances
        const errorObj = error as Record<string, unknown>; // More specific than 'any'
        if (typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        }
        if (typeof errorObj.status === 'number' || typeof errorObj.status === 'string') {
          errorStatus = errorObj.status as (number | string);
        } else if (errorObj.response && typeof errorObj.response === 'object') {
          const responseObj = errorObj.response as Record<string, unknown>;
          if (typeof responseObj.status === 'number') {
            errorStatus = responseObj.status;
          }
        }
      }

      console.error("OpenAI API Error:", errorMessage);
      console.error("OpenAI Error Details:", error); // Log the whole error object for more context
      console.error("OpenAI Error Status Determined:", errorStatus);
      return NextResponse.json(
        { error: 'Failed to get AI response', details: errorMessage },
        { status: typeof errorStatus === 'number' ? errorStatus : 500 }
      );
    }
  } catch (error: unknown) { // Outer catch block
    let generalErrorMessage = 'Error processing message';
    if (error instanceof Error) {
      generalErrorMessage = error.message;
    }
    console.error('Error processing message:', generalErrorMessage);
    console.error('Full error details:', error);
    return NextResponse.json({ error: generalErrorMessage }, { status: 500 });
  }
}
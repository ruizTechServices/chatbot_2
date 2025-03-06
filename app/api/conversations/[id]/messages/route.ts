import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { message, model } = await req.json();
    
    const { id } = await params;
    
    // Verify that the conversation belongs to the user
    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId
      }
    });
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    // Get the maximum position ID to ensure correct ordering
    const maxPositionResult = await prisma.message.findFirst({
      where: { conversationId: id },
      orderBy: { positionId: 'desc' },
      select: { positionId: true }
    });
    
    const nextPositionId = maxPositionResult ? maxPositionResult.positionId + 1 : 0;
    
    // Add user message to the conversation
    const userMessage = await prisma.message.create({
      data: {
        conversationId: id,
        positionId: nextPositionId,
        text: message.content,
        isUser: true,
      },
    });

    // Get all messages for context (for the AI to have the full conversation history)
    const conversationMessages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { positionId: 'asc' }
    });
    
    // Format messages for the OpenAI API
    const formattedMessages = conversationMessages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Call OpenAI API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/openai/conversation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: formattedMessages,
        model: model || "gpt-4o"
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }
    
    const data = await response.json();
    const assistantContent = data.choices && data.choices[0]?.message?.content;
    
    if (!assistantContent) {
      throw new Error('Invalid AI response format');
    }

    // Add AI response to the conversation
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: id,
        positionId: nextPositionId + 1,
        text: assistantContent,
        isUser: false,
      },
    });

    // Update conversation title if it's the first message
    let title = conversation.title;
    if (conversationMessages.length <= 2) {
      // For the first exchange, use the first few words of the user message as the title
      title = message.content.split(' ').slice(0, 5).join(' ') + '...';
      
      await prisma.conversation.update({
        where: { id },
        data: { title }
      });
    }

    return NextResponse.json({
      userMessage: {
        role: 'user',
        content: message.content
      },
      assistantMessage: {
        role: 'assistant',
        content: assistantContent
      },
      title
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

///Users/gios_laptop/chatbot_2/app/api/conversations/[id]/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = params;
    const { message, model } = await request.json();
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId }
    });
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
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
    const formattedMessages = conversationMessages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }));
    const openaiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/openai/conversation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: formattedMessages,
          model: model || "gpt-4o"
        })
      }
    );
    if (!openaiResponse.ok) {
      throw new Error('Failed to get AI response');
    }
    const data = await openaiResponse.json();
    const assistantContent = data.choices && data.choices[0]?.message?.content;
    if (!assistantContent) {
      throw new Error('Invalid AI response format');
    }
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
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
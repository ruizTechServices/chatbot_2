import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;//L.R. Says: Leave this as is!!!!, I am getting an issue mentioning that params should be awaited before using its properties. `https://nextjs.org/docs/messages/sync-dynamic-apis`
    
    const conversation = await prisma.conversation.findUnique({
      where: { 
        id,
        userId // Ensure the conversation belongs to the current user
      },
      include: { 
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
    });
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // First verify the conversation belongs to the user
    const conversation = await prisma.conversation.findUnique({
      where: { 
        id: params.id,
        userId
      },
    });
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    await prisma.conversation.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { title } = await request.json();
    
    // First verify the conversation belongs to the user
    const conversation = await prisma.conversation.findUnique({
      where: { 
        id: params.id,
        userId
      },
    });
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    const updatedConversation = await prisma.conversation.update({
      where: { id: params.id },
      data: { title },
    });
    
    return NextResponse.json(updatedConversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}

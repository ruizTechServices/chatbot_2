//app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

/**
 * GET /api/conversations/[id]
 * Get conversation details with messages
 * Requires an active session
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract conversation ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const conversationsIndex = pathParts.findIndex(part => part === 'conversations');
    const id = conversationsIndex !== -1 && pathParts.length > conversationsIndex + 1 ? pathParts[conversationsIndex + 1] : '';
    
    if (!id) {
      return NextResponse.json({ error: 'Conversation ID not found in path' }, { status: 400 });
    }
    
    const conversation = await prisma.conversation.findUnique({
      where: { 
        id,
        userId // Ensures the conversation belongs to the current user
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
      return NextResponse.json(
        { error: 'Conversation not found or access denied' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    let errorMessage = 'Failed to fetch conversation';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}
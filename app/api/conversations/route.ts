//app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { withSecurity } from '@/utils/security/middleware';
import { ConversationSchema } from '@/utils/validation/schemas';
import { cleanUserInput } from '@/utils/security/sanitize';

const prisma = new PrismaClient();

/**
 * GET /api/conversations
 * Get all conversations for the authenticated user
 * Requires an active session
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching conversations for user:', userId);
    
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        // Get the count of messages for each conversation
        _count: {
          select: { messages: true }
        }
      }
    });
    
    console.log('Found conversations:', conversations.length);
    
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    let errorMessage = 'Failed to fetch conversations';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}

/**
 * POST /api/conversations
 * Create a new conversation for the authenticated user
 * Requires an active session
 * Now includes Zod validation and security middleware
 */
export const POST = withSecurity(
  ConversationSchema,
  async (req: NextRequest, validatedData) => {
    try {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const { title } = validatedData;
      const cleanTitle = cleanUserInput(title);

      console.log('Creating conversation for user:', userId);
      
      const newConversation = await prisma.conversation.create({
        data: {
          userId,
          title: cleanTitle,
        },
      });
      
      console.log('Created new conversation:', newConversation.id);
      return NextResponse.json(newConversation, { status: 201 });
    } catch (error) {
      console.error('Error creating conversation:', error);
      let errorMessage = 'Failed to create conversation';
      if (error instanceof Error) {
          errorMessage = error.message;
      }
      return NextResponse.json(
        { error: errorMessage }, 
        { status: 500 }
      );
    }
  }
);

//app/api/conversations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withSessionValidation } from '@/app/api/middleware';

const prisma = new PrismaClient();

/**
 * GET /api/conversations/[id]
 * Get conversation details with messages
 * Requires an active session
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return withSessionValidation(request, async (request, userId) => {
    try {
      // Await the asynchronous params to extract the id.
      const { id } = await context.params;
      
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
          { error: 'Conversation not found' }, 
          { status: 404 }
        );
      }
      
      return NextResponse.json(conversation);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return NextResponse.json(
        { error: 'Failed to fetch conversation' }, 
        { status: 500 }
      );
    }
  });
}
//app/api/conversations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withSessionValidation } from '@/app/api/middleware';

const prisma = new PrismaClient();

/**
 * GET /api/conversations
 * Get all conversations for the authenticated user
 * Requires an active session
 */
export async function GET(req: NextRequest) {
  return withSessionValidation(req, async (req, userId) => {
    try {
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
      return NextResponse.json(
        { error: 'Failed to fetch conversations' }, 
        { status: 500 }
      );
    }
  });
}

/**
 * POST /api/conversations
 * Create a new conversation for the authenticated user
 * Requires an active session
 */
export async function POST(req: NextRequest) {
  return withSessionValidation(req, async (req, userId) => {
    try {
      console.log('Creating conversation for user:', userId);
      
      const { title } = await req.json();
      
      if (!title) {
        return NextResponse.json(
          { error: 'Title is required' }, 
          { status: 400 }
        );
      }
      
      const newConversation = await prisma.conversation.create({
        data: { 
          title,
          userId 
        },
      });
      
      console.log('Created conversation:', newConversation.id);
      
      return NextResponse.json(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      return NextResponse.json(
        { error: 'Failed to create conversation' }, 
        { status: 500 }
      );
    }
  });
}

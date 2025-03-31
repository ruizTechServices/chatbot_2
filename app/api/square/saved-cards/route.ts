import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

// Import Square SDK
const { ApiError, Client, Environment } = require('square');

const prisma = new PrismaClient();

// Define type for our raw query result
type UserWithSquareCustomer = {
  id: string;
  squareCustomerId: string | null;
};

/**
 * Set up Square client based on environment
 */
const getSquareClient = () => {
  const isProd = process.env.NODE_ENV === 'production';
  
  // Use appropriate credentials based on environment
  const accessToken = isProd 
    ? process.env.SQUARE_ACCESS_TOKEN 
    : process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN;
  
  // Initialize and return the Square client
  return new Client({
    accessToken,
    environment: isProd ? Environment.Production : Environment.Sandbox
  });
};

/**
 * GET /api/square/saved-cards
 * Retrieves saved payment cards for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await auth();
    const userId = authResult?.userId;
    
    if (!userId) {
      console.error('Unauthorized: No userId in auth result');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For development mode, return mock cards
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({
        cards: [
          {
            id: 'mock_card_1',
            last4: '1111',
            cardBrand: 'VISA',
            expMonth: 12,
            expYear: 2030,
            cardholderName: 'DEV USER'
          }
        ]
      });
    }

    // Log for debugging
    console.log('Production mode: Fetching saved cards');
    console.log('Square Access Token exists:', !!process.env.SQUARE_ACCESS_TOKEN);
    console.log('User ID:', userId);

    try {
      // Get the user with Square customer ID
      const users = await prisma.$queryRaw<UserWithSquareCustomer[]>`
        SELECT id, square_customer_id as "squareCustomerId" 
        FROM users 
        WHERE clerk_user_id = ${userId} 
        LIMIT 1
      `;
      
      console.log('Database query result:', JSON.stringify(users || []));

      // Check if we found a user and if they have a Square customer ID
      if (!users || users.length === 0 || !users[0].squareCustomerId) {
        console.log('No Square customer ID found for user');
        return NextResponse.json({ cards: [] });
      }

      const squareCustomerId = users[0].squareCustomerId;
      console.log('Found Square customer ID:', squareCustomerId);

      // Initialize Square client
      const client = getSquareClient();
      
      // Get customer's cards
      console.log('Calling Square API to list cards');
      const listCardsResponse = await client.cardsApi.listCards({
        customerId: squareCustomerId
      });
      
      console.log('Square API response:', listCardsResponse.result ? 'Success' : 'No result');

      // Format card data for client
      const cards = listCardsResponse.result.cards?.map((card: any) => ({
        id: card.id,
        last4: card.last4,
        cardBrand: card.cardBrand,
        expMonth: card.expMonth,
        expYear: card.expYear,
        cardholderName: card.cardholderName
      })) || [];

      console.log(`Found ${cards.length} cards for customer`);
      return NextResponse.json({ cards });
    } catch (dbError: any) {
      console.error('Database or Square API error:', dbError);
      console.error('Error stack:', dbError.stack);
      return NextResponse.json(
        { error: 'Database or Square API error', details: dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Failed to retrieve saved cards:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to retrieve saved cards', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/square/saved-cards
 * Removes a saved payment card for the authenticated user
 */
export async function DELETE(req: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await auth();
    const userId = authResult?.userId;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get card ID from request
    const { cardId } = await req.json();
    
    if (!cardId) {
      return NextResponse.json(
        { error: 'Missing card ID' },
        { status: 400 }
      );
    }

    // For development mode, pretend to delete the card
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ success: true, cardId });
    }

    // Get the user with Square customer ID
    const users = await prisma.$queryRaw<UserWithSquareCustomer[]>`
      SELECT id, square_customer_id as "squareCustomerId" 
      FROM users 
      WHERE clerk_user_id = ${userId} 
      LIMIT 1
    `;

    // Check if we found a user and if they have a Square customer ID
    if (!users || users.length === 0 || !users[0].squareCustomerId) {
      return NextResponse.json(
        { error: 'No saved cards found for this user' },
        { status: 404 }
      );
    }

    // Initialize Square client
    const client = getSquareClient();
    
    // Disable the card
    await client.cardsApi.disableCard(cardId);

    return NextResponse.json({ success: true, cardId });
  } catch (error: any) {
    console.error('Failed to delete saved card:', error);
    return NextResponse.json(
      { error: 'Failed to delete saved card', details: error.message },
      { status: 500 }
    );
  }
}

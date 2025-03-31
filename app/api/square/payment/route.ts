// app/api/square/payment/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

// Import Square SDK
const { Client, Environment } = require('square');

const prisma = new PrismaClient();

// Define type for our raw query result
type UserWithSquareCustomer = {
  id: string;
  square_customer_id: string | null;
};

/**
 * Set up Square client based on environment
 */
const getSquareClient = () => {
  const isProd = process.env.NODE_ENV === 'production';
  
  // Use the appropriate credentials based on environment
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
 * POST /api/square/payment
 * Processes a payment and creates a user session
 * Supports saving cards for future use
 */
export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await auth();
    const userId = authResult?.userId;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get payment details from request
    const { 
      sourceId, 
      amount = 100, 
      currency = 'USD', 
      idempotencyKey,
      saveCardForFuture = false
    } = await req.json();
    
    if (!sourceId || !idempotencyKey) {
      return NextResponse.json(
        { error: 'Missing required payment parameters' },
        { status: 400 }
      );
    }
    
    // For development mode, create a mock session directly
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Creating mock session');
      
      // Mark any existing active sessions as inactive
      await prisma.userSession.updateMany({
        where: {
          userId,
          active: true
        },
        data: {
          active: false
        }
      });
      
      // Create a new session with 24-hour expiration
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24);
      
      const mockPaymentId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      const session = await prisma.userSession.create({
        data: {
          userId,
          active: true,
          expiresAt: expirationDate,
          paymentId: mockPaymentId
        }
      });
      
      console.log(`Mock session created for user ${userId}, expires at ${expirationDate}`);
      
      return NextResponse.json({
        success: true,
        sessionId: session.id,
        paymentId: mockPaymentId,
        expiresAt: expirationDate,
        mockPayment: true
      });
    }

    // Production mode - initialize Square client
    console.log('Production mode: Processing real payment...');
    const client = getSquareClient();
    
    try {
      // First, try to find or create a customer record in Square
      let squareCustomerId = '';
      
      try {
        // Define type for raw SQL query result
        type UserWithSquare = {
          id: string;
          square_customer_id: string | null;
        }

        // Check if the user already has a Square customer ID in our database
        const users = await prisma.$queryRaw<UserWithSquare[]>`
          SELECT id, square_customer_id
          FROM users 
          WHERE clerk_user_id = ${userId} 
          LIMIT 1
        `;
        
        if (users && users.length > 0 && users[0].square_customer_id) {
          // User already has a Square customer ID
          console.log(`User has existing Square customer ID: ${users[0].square_customer_id}`);
          squareCustomerId = users[0].square_customer_id;
        } else {
          // Create a new customer in Square
          console.log('Creating new Square customer...');
          
          const response = await client.customersApi.createCustomer({
            idempotencyKey,
            givenName: 'Customer',
            familyName: '',
            emailAddress: '',
            referenceId: userId
          });
          
          if (!response.result.customer?.id) {
            throw new Error('Failed to create Square customer');
          }
          
          squareCustomerId = response.result.customer.id;
          
          if (users && users.length > 0) {
            // User exists but doesn't have a Square customer ID yet
            await prisma.$executeRaw`
              UPDATE users 
              SET square_customer_id = ${squareCustomerId} 
              WHERE id = ${users[0].id}
            `;
          } else {
            // User doesn't exist in our database yet
            // Generate a unique ID for the new user
            const newUserId = crypto.randomUUID();
            const userEmail = 'user@example.com';
            
            try {
              console.log('Creating new user with Square customer ID');
              await prisma.$executeRaw`
                INSERT INTO users (id, clerk_user_id, email, square_customer_id, created_at) 
                VALUES (${newUserId}, ${userId}, ${userEmail}, ${squareCustomerId}, NOW())
              `;
              console.log('User created successfully');
            } catch (dbError: any) {
              console.error('Error creating user:', dbError);
              throw new Error(`Failed to create user: ${dbError.message}`);
            }
          }
          
          console.log(`Created new Square customer: ${squareCustomerId}`);
        }
      } catch (error: any) {
        console.error('Error finding or creating Square customer:', error);
        throw error;
      }
      
      // Save the card for future use if requested
      if (saveCardForFuture && squareCustomerId) {
        console.log('Saving card for future use...');
        
        // Create customer card
        const cardResponse = await client.cardsApi.createCard({
          idempotencyKey: `card_${idempotencyKey}`,
          sourceId,
          card: {
            customerId: squareCustomerId,
            cardholderName: 'User'
          }
        });
        
        console.log(`Card created with ID: ${cardResponse.result.card?.id}`);
      }
      
      // Process the payment
      console.log('Processing payment...');
      const paymentResponse = await client.paymentsApi.createPayment({
        sourceId,
        idempotencyKey,
        amountMoney: {
          amount: BigInt(amount),
          currency
        },
        customerId: squareCustomerId || undefined
      });

      // If payment is successful, create a user session
      if (paymentResponse.result.payment?.status === 'COMPLETED') {
        // Create a new session
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 24); // 24 hour session
        
        // Mark any existing active sessions as inactive
        await prisma.userSession.updateMany({
          where: {
            userId,
            active: true
          },
          data: {
            active: false
          }
        });

        const session = await prisma.userSession.create({
          data: {
            userId,
            active: true,
            expiresAt: expirationDate,
            paymentId: paymentResponse.result.payment.id
          }
        });
        
        console.log(`Payment successful. Session created for ${userId} until ${expirationDate}`);
        
        return NextResponse.json({
          success: true,
          sessionId: session.id,
          paymentId: paymentResponse.result.payment.id,
          expiresAt: expirationDate,
          cardSaved: saveCardForFuture
        });
      } else {
        throw new Error(`Payment status: ${paymentResponse.result.payment?.status || 'unknown'}`);
      }
    } catch (error: any) {
      console.error('Square API error:', error);
      
      // Check for specific Square API errors
      if (error.errors) {
        const errorDetails = error.errors.map((e: any) => e.detail).join(', ');
        return NextResponse.json(
          { error: 'Square API Error', details: errorDetails },
          { status: 400 }
        );
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment', details: error.message },
      { status: 500 }
    );
  }
}
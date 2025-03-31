'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { SavedCards } from './SavedCards';

/**
 * Component for purchasing a 24-hour session
 * Integrates with Square Web Payments SDK for secure payment processing
 */
export function SessionPurchase({ onSessionPurchased }: { onSessionPurchased: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string | null>(null);
  const [squareLoaded, setSquareLoaded] = useState(false);
  const [paymentForm, setPaymentForm] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<'saved-cards' | 'new-card'>('saved-cards');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [cardLoadFailed, setCardLoadFailed] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  
  // Determine if we're in development
  const isDev = process.env.NODE_ENV === 'development';
  
  // Get Square application ID and location ID from environment variables
  const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || '';
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || '';
  
  // Select Square SDK URL based on environment
  const squareSdkUrl = isDev
    ? "https://sandbox.web.squarecdn.com/v1/square.js"
    : "https://web.squarecdn.com/v1/square.js";

  // Initialize Square payment form when SDK is loaded
  useEffect(() => {
    if (!squareLoaded || !applicationId || !locationId || !cardContainerRef.current || paymentStep !== 'new-card') {
      return;
    }
    
    async function initializeCard() {
      try {
        setDebug('Initializing Square payment form...');
        
        if (typeof window === 'undefined' || !window.Square) {
          throw new Error('Square SDK not loaded properly');
        }
        
        const payments = window.Square.payments(applicationId, locationId);
        const card = await payments.card();
        await card.attach('#card-container');
        
        setPaymentForm(card);
        setDebug('Square payment form initialized successfully');
      } catch (err: any) {
        console.error('Failed to initialize Square card form:', err);
        setError(`Payment form initialization error: ${err.message}`);
      }
    }
    
    initializeCard();
    
    // Cleanup on unmount
    return () => {
      if (paymentForm) {
        try {
          paymentForm.destroy();
        } catch (e) {
          console.error('Error destroying payment form:', e);
        }
      }
    };
  }, [squareLoaded, applicationId, locationId, paymentStep]);

  const handleSavedCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    setDebug(`Selected saved card with ID: ${cardId}`);
  };

  const handleNewCard = () => {
    setPaymentStep('new-card');
    setSelectedCardId(null);
    setDebug('Switched to new card entry');
  };

  const handleCardLoadError = () => {
    setCardLoadFailed(true);
    setPaymentStep('new-card');
    setDebug('Card loading failed, switched to new card entry');
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);
    setDebug('Processing payment...');
    
    try {
      // Generate a unique idempotency key
      const idempotencyKey = `${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      // Initialize payment request object
      const paymentRequest: any = {
        idempotencyKey,
        amount: 100, // $1.00 in cents
        currency: 'USD',
        saveCardForFuture: paymentStep === 'new-card' // Only save if it's a new card
      };
      
      // Determine source ID based on payment method
      let sourceId = '';
      
      if (isDev) {
        // In development, use a mock source ID
        sourceId = 'mock-card-nonce';
        setDebug('Development mode: Using mock payment source');
      } else if (paymentStep === 'saved-cards' && selectedCardId) {
        // Using a saved card - the ID becomes the source ID for the payment
        sourceId = selectedCardId;
        setDebug(`Using saved card with ID: ${selectedCardId}`);
      } else if (paymentStep === 'new-card') {
        // Using a new card - tokenize via Square SDK
        if (!paymentForm) {
          throw new Error('Payment form not initialized');
        }
        
        setDebug('Tokenizing new card...');
        const tokenResult = await paymentForm.tokenize();
        
        if (tokenResult.status === 'OK') {
          sourceId = tokenResult.token;
          setDebug(`Card tokenized successfully: ${sourceId.substring(0, 8)}...`);
        } else {
          throw new Error(tokenResult.errors[0]?.message || 'Card tokenization failed');
        }
      } else {
        throw new Error('No payment method selected');
      }
      
      // Add source ID to payment request
      paymentRequest.sourceId = sourceId;
      
      // Make the API request to process payment
      setDebug('Submitting payment to server...');
      const response = await fetch('/api/square/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      const data = await response.json();
      
      if (isDev) {
        setDebug(`API Response: ${JSON.stringify(data, null, 2)}`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process payment');
      }

      // Session successfully purchased
      setDebug(`Success! Session active until: ${new Date(data.expiresAt).toLocaleString()}`);
      
      // Call the callback function
      onSessionPurchased();
      
      // Refresh to update the UI
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during payment processing');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Load Square Web Payments SDK */}
      <Script
        src={squareSdkUrl}
        onLoad={() => {
          setSquareLoaded(true);
          setDebug(`Square SDK loaded from ${squareSdkUrl}`);
        }}
        onError={(e) => {
          console.error('Failed to load Square SDK:', e);
          setError('Failed to load payment system. Please try again later.');
        }}
      />
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 p-3 text-sm text-red-200">
          {error}
        </div>
      )}
      
      {paymentStep === 'saved-cards' && !cardLoadFailed ? (
        <SavedCards 
          onCardSelect={handleSavedCardSelect} 
          onNewCard={handleNewCard}
          onError={handleCardLoadError}
        />
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Enter Card Details</h3>
          <div className="mb-4 rounded-sm bg-gray-900 p-4 min-h-[120px]">
            <div id="card-container" ref={cardContainerRef} className="min-h-[60px]"></div>
          </div>
          <button
            onClick={() => setPaymentStep('saved-cards')}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back to saved cards
          </button>
        </div>
      )}
      
      <button
        onClick={handlePurchase}
        disabled={loading || (!isDev && paymentStep === 'new-card' && !paymentForm) || (!isDev && paymentStep === 'saved-cards' && !selectedCardId)}
        className={`w-full py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-center font-light tracking-wider transition-all ${
          loading || (!isDev && ((paymentStep === 'new-card' && !paymentForm) || (paymentStep === 'saved-cards' && !selectedCardId)))
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:from-amber-600 hover:to-amber-400'
        }`}
      >
        {loading ? 'PROCESSING...' : 'PURCHASE 24-HOUR ACCESS ($1)'}
      </button>
      
      {(isDev || debug) && (
        <div className="mt-4 p-4 bg-gray-900 border border-gray-800 text-gray-400 text-xs font-mono overflow-x-auto">
          <div className="mb-1 text-gray-500">Debug Information (Dev Only):</div>
          <div>Environment: {isDev ? 'Development' : 'Production'}</div>
          <div>Payment Step: {paymentStep}</div>
          <div>Selected Card ID: {selectedCardId || 'None'}</div>
          <div>Application ID: {applicationId ? `${applicationId.substring(0, 10)}...` : 'Not set'}</div>
          <div>Location ID: {locationId ? `${locationId.substring(0, 10)}...` : 'Not set'}</div>
          <div>Square SDK: {squareLoaded ? 'Loaded' : 'Not loaded'}</div>
          <div>Card Form: {paymentForm ? 'Initialized' : 'Not initialized'}</div>
          {debug && <pre className="mt-2 pt-2 border-t border-gray-800">{debug}</pre>}
        </div>
      )}
    </div>
  );
}

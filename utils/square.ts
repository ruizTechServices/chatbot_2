/**
 * Utility functions for working with Square payments SDK
 */

declare global {
  interface Window {
    Square?: any;
  }
}

/**
 * Loads the Square Web Payments SDK if not already loaded
 * @returns Promise that resolves when the SDK is loaded
 */
export async function loadSquareSdk(): Promise<void> {
  if (window.Square) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    
    // Use production or sandbox URL based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    script.src = isProduction
      ? 'https://web.squarecdn.com/v1/square.js'
      : 'https://sandbox.web.squarecdn.com/v1/square.js';
    
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Square SDK'));
    
    document.body.appendChild(script);
  });
}

/**
 * Initializes Square Payments with the appropriate application ID
 * @returns Square Payments instance
 */
export async function initializeSquarePayments() {
  if (!window.Square) {
    throw new Error('Square SDK not loaded');
  }
  
  try {
    const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    
    if (!applicationId || !locationId) {
      throw new Error('Square application ID or location ID not configured');
    }
    
    return window.Square.payments(applicationId, locationId);
  } catch (error) {
    console.error('Error initializing Square Payments:', error);
    throw error;
  }
}

/**
 * Creates a card payment method
 * @returns Card payment method
 */
export async function createCardPaymentMethod() {
  try {
    const payments = await initializeSquarePayments();
    return await payments.card();
  } catch (error) {
    console.error('Error creating card payment method:', error);
    throw error;
  }
}

/**
 * utils/square/client.ts
 */
export const createClient = () => {
  // Check if code is running in browser environment
  if (typeof window === 'undefined') {
    throw new Error(
      "Square client cannot be created during server-side rendering."
    );
  }

  if (!(window as any).Square) {
    throw new Error(
      "Square SDK not loaded. Please ensure the Square Web Payments SDK is included in your layout (e.g., in app/layout.tsx using next/script with strategy 'beforeInteractive')."
    );
  }
  
  if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || !process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID) {
    throw new Error(
      "Square credentials missing. Please ensure NEXT_PUBLIC_SQUARE_APPLICATION_ID and NEXT_PUBLIC_SQUARE_LOCATION_ID are set in your environment variables."
    );
  }
  
  return (window as any).Square.payments(
    process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
    process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
  );
};
/**
 * Debug utility functions to help troubleshoot issues
 * with session management and payment processing
 */

// Check if environment variables are properly loaded
export function checkSquareEnvVariables() {
  const variables = {
    NEXT_PUBLIC_SQUARE_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN,
    NEXT_PUBLIC_SQUARE_APPLICATION_ID: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
    NEXT_PUBLIC_SQUARE_LOCATION_ID: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  };

  console.log('Square Environment Variables:', variables);
  
  return variables;
}

// Check the current session status from the API
export async function checkSessionStatus() {
  try {
    const response = await fetch('/api/sessions/validate', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    
    const data = await response.json();
    console.log('Session Status:', data);
    
    return data;
  } catch (error) {
    console.error('Error checking session status:', error);
    return null;
  }
}

// Log API requests for debugging
export function logApiRequest(endpoint: string, method: string, data?: any) {
  console.log(`API Request: ${method} ${endpoint}`, { data });
}

// Log API responses for debugging
export function logApiResponse(endpoint: string, response: any) {
  console.log(`API Response: ${endpoint}`, response);
}

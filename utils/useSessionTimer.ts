import { useCallback, useEffect } from 'react';
import { useSessionTimeStore, TimeRemaining } from './sessionTimeStore';

/**
 * Hook to manage and display session timer
 * Fetches active session data and updates the timer in real-time
 * Using a global store to ensure consistent display across components
 * @returns Current time remaining, loading state, and refresh function
 */
export function useSessionTimer(): [TimeRemaining, boolean, () => void] {
  // Access our global session time store
  const { 
    timeRemaining, 
    loading, 
    setTimeRemaining, 
    setLoading 
  } = useSessionTimeStore();

  // Function to refresh session data
  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch real session data from the API
      const res = await fetch('/api/sessions/validate', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });
      
      if (!res.ok) {
        throw new Error('Failed to validate session');
      }
      
      const data = await res.json();
      
      if (data.hasActiveSession && data.expiresIn > 0) {
        // Convert milliseconds to hours, minutes, seconds
        const totalSeconds = Math.floor(data.expiresIn / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        setTimeRemaining({
          hours,
          minutes,
          seconds,
          hasActiveSession: true
        });
      } else {
        setTimeRemaining({
          hours: 0,
          minutes: 0,
          seconds: 0,
          hasActiveSession: false
        });
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
      
      // If there's an error, we'll assume there's no active session
      setTimeRemaining({
        hours: 0,
        minutes: 0,
        seconds: 0,
        hasActiveSession: false
      });
    } finally {
      setLoading(false);
    }
  }, [setLoading, setTimeRemaining]);

  // Initial fetch of session data
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Set up timer to update countdown
  useEffect(() => {
    if (!timeRemaining.hasActiveSession) return;
    
    const interval = setInterval(() => {
      setTimeRemaining((prev: TimeRemaining) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Session expired
          return { hours: 0, minutes: 0, seconds: 0, hasActiveSession: false };
        }
      });
    }, 1000);

    // Refresh session data from server every 5 minutes to keep in sync
    const refreshInterval = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(refreshInterval);
    };
  }, [timeRemaining.hasActiveSession, refreshSession, setTimeRemaining]);

  return [timeRemaining, loading, refreshSession];
}

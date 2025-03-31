import React, { useEffect } from 'react';
import { useSessionTimeStore } from '@/utils/sessionTimeStore';

interface SessionStatusProps {
  onSessionExpired: () => void;
}

/**
 * Component to display the remaining time in the current session
 * Shows hours, minutes, and seconds in a premium UI format
 * Now using global session time state for consistency across components
 */
export default function SessionStatus({ onSessionExpired }: SessionStatusProps) {
  // Use the global session time store for consistent display
  const { timeRemaining, loading, formatTime } = useSessionTimeStore();

  // If session is expired, trigger the callback
  useEffect(() => {
    if (!loading && !timeRemaining.hasActiveSession) {
      onSessionExpired();
    }
  }, [timeRemaining.hasActiveSession, loading, onSessionExpired]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-2">
        <div className="animate-pulse flex space-x-1">
          <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
          <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
          <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!timeRemaining.hasActiveSession) {
    return (
      <div className="text-center py-2">
        <span className="text-red-500">Session expired</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-xl font-light">
      <div className="flex items-center">
        <span>{formatTime(timeRemaining.hours)}</span>
        <span className="mx-1">:</span>
        <span>{formatTime(timeRemaining.minutes)}</span>
        <span className="mx-1">:</span>
        <span>{formatTime(timeRemaining.seconds)}</span>
      </div>
      <button
        onClick={onSessionExpired}
        className="text-xs text-amber-500 hover:text-amber-400 uppercase tracking-wider"
      >
        Extend
      </button>
    </div>
  );
}

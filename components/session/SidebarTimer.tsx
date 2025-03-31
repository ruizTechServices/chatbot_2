import React from 'react';
import { useSessionTimeStore } from '@/utils/sessionTimeStore';

/**
 * Component to display the remaining time in the sidebar
 * Uses the global session time store for consistent timing
 */
export default function SidebarTimer() {
  // Use the global session time store for consistent display
  const { timeRemaining, loading, formatTime } = useSessionTimeStore();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 py-2 text-gray-500">
        <div className="animate-pulse flex space-x-1">
          <div className="h-1.5 w-1.5 bg-amber-500 rounded-full"></div>
          <div className="h-1.5 w-1.5 bg-amber-500 rounded-full"></div>
          <div className="h-1.5 w-1.5 bg-amber-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!timeRemaining.hasActiveSession) {
    return (
      <div className="text-center py-2">
        <span className="text-red-500 text-sm">Session expired</span>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="text-gray-400 text-xs uppercase mb-1 tracking-wider">TIME REMAINING</div>
      <div className="flex items-center text-lg font-light">
        <span>{formatTime(timeRemaining.hours)}</span>
        <span className="mx-1">:</span>
        <span>{formatTime(timeRemaining.minutes)}</span>
        <span className="mx-1">:</span>
        <span>{formatTime(timeRemaining.seconds)}</span>
      </div>
    </div>
  );
}

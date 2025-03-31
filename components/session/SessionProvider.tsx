import React, { useState, useEffect, createContext, useContext } from 'react';
import SessionModal from './SessionModal';
import SessionStatus from './SessionStatus';
import { useSessionTimer } from '@/utils/useSessionTimer';
import { useSessionTimeStore } from '@/utils/sessionTimeStore';

interface SessionContextType {
  isSessionActive: boolean;
  refreshSession: () => void;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  isSessionActive: false,
  refreshSession: () => {},
  loading: true
});

export const useSession = () => useContext(SessionContext);

interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages session state and UI
 * Displays session timer and handles expired sessions
 * Uses the global session time store for consistent time across the app
 */
export default function SessionProvider({ children }: SessionProviderProps) {
  // Use the session timer hook which now updates our global store
  const [timeRemaining, loading, refreshSession] = useSessionTimer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Show modal when session expires
  useEffect(() => {
    if (!loading && !timeRemaining.hasActiveSession) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [timeRemaining.hasActiveSession, loading]);

  // Handle session purchase completion
  const handleSessionPurchased = () => {
    refreshSession();
    setIsModalOpen(false);
  };

  const contextValue = {
    isSessionActive: timeRemaining.hasActiveSession,
    refreshSession,
    loading
  };

  return (
    <SessionContext.Provider value={contextValue}>
      <div className="flex flex-col min-h-screen">
        {/* Top bar with session timer */}
        <div className="border-b border-gray-800 p-2 bg-[#0a0a0a]">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-amber-500">24HRGPT</h1>
            {!loading && timeRemaining.hasActiveSession && (
              <div className="flex items-center space-x-2">
                <div className="text-gray-400 text-sm">Time Remaining:</div>
                <SessionStatus onSessionExpired={() => setIsModalOpen(true)} />
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow">
          {children}
        </div>

        {/* Session modal */}
        <SessionModal
          isOpen={isModalOpen}
          onClose={() => {}} // Don't allow closing if session is expired
          onSessionPurchased={handleSessionPurchased}
        />
      </div>
    </SessionContext.Provider>
  );
}

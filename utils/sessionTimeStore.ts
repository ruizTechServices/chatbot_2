import { create } from 'zustand';

export type TimeRemaining = {
  hours: number;
  minutes: number;
  seconds: number;
  hasActiveSession: boolean;
};

type SessionTimeState = {
  timeRemaining: TimeRemaining;
  loading: boolean;
  setTimeRemaining: (time: TimeRemaining | ((prev: TimeRemaining) => TimeRemaining)) => void;
  setLoading: (loading: boolean) => void;
  formatTime: (value: number) => string;
};

// Create a global store for session time
export const useSessionTimeStore = create<SessionTimeState>((set) => ({
  timeRemaining: {
    hours: 0,
    minutes: 0,
    seconds: 0,
    hasActiveSession: false
  },
  loading: true,
  setTimeRemaining: (time: TimeRemaining | ((prev: TimeRemaining) => TimeRemaining)) => 
    set((state) => ({ 
      timeRemaining: typeof time === 'function' 
        ? (time as (prev: TimeRemaining) => TimeRemaining)(state.timeRemaining) 
        : time 
    })),
  setLoading: (loading: boolean) => set({ loading }),
  // Helper function to format time consistently
  formatTime: (value: number) => value.toString().padStart(2, '0')
}));

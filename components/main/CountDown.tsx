'use client';
import { useState, useEffect } from 'react';

interface TimerProps {
  onExpire?: () => void;
}

export default function Timer({ onExpire }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });
  const [showModal, setShowModal] = useState(false);

  // Countdown effect with functional updates
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          setShowModal(true);
          if (onExpire) onExpire();
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire]);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <>
      <div className="p-6 border border-gray-800 bg-black/50 backdrop-blur-sm">
        <h3 className="text-xl font-light mb-4">Time Remaining</h3>
        <div className="flex items-center space-x-4 text-2xl font-light">
          <div className="flex flex-col items-center">
            <span className="text-3xl">{formatTime(timeRemaining.hours)}</span>
            <span className="text-xs text-gray-500 uppercase mt-1">Hours</span>
          </div>
          <span>:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl">{formatTime(timeRemaining.minutes)}</span>
            <span className="text-xs text-gray-500 uppercase mt-1">Minutes</span>
          </div>
          <span>:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl">{formatTime(timeRemaining.seconds)}</span>
            <span className="text-xs text-gray-500 uppercase mt-1">Seconds</span>
          </div>
        </div>
        <a
          href="#"
          className="block w-full mt-6 py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-center font-light tracking-wider hover:from-amber-600 hover:to-amber-400 transition-all"
        >
          EXTEND SESSION
        </a>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-8 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
            <p className="mb-4">
              Your session has ended. Please extend your session or upgrade to our premium plan.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-amber-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
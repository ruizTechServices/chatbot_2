import React, { useState } from 'react';
import { SessionPurchase } from '@/components/session/SessionPurchase';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionPurchased: () => void;
}

/**
 * Modal that appears when a user's session expires
 * Allows the user to purchase a new 24-hour session
 */
export default function SessionModal({ isOpen, onClose, onSessionPurchased }: SessionModalProps) {
  const [step, setStep] = useState<'info' | 'purchase'>('info');

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    window.location.href = '/';
  };

  const renderInfoStep = () => (
    <>
      <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
      <p className="text-gray-400 mb-6">
        Your 24-hour session has expired. Purchase a new session to continue using 24HRGPT.
      </p>
      <div className="space-y-4">
        <button
          onClick={() => setStep('purchase')}
          className="block w-full py-3 bg-gradient-to-r from-amber-700 to-amber-500 text-center font-light tracking-wider hover:from-amber-600 hover:to-amber-400 transition-all"
        >
          PURCHASE 24-HOUR ACCESS ($1)
        </button>
        <button
          onClick={handleClose}
          className="block w-full py-3 border border-gray-700 text-center font-light tracking-wider hover:bg-gray-800 transition-all"
        >
          CLOSE
        </button>
      </div>
    </>
  );

  const renderPurchaseStep = () => (
    <>
      <h2 className="text-2xl font-bold mb-4">Purchase Session</h2>
      <p className="text-gray-400 mb-6">
        Get unlimited access to 24HRGPT for 24 hours.
      </p>
      
      <SessionPurchase onSessionPurchased={onSessionPurchased} />
      
      <button
        onClick={() => setStep('info')}
        className="mt-4 w-full py-3 border border-gray-700 text-center font-light tracking-wider hover:bg-gray-800 transition-all"
      >
        BACK
      </button>
    </>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a0a] border border-gray-800 p-8 max-w-md w-full rounded-sm">
        {step === 'info' ? renderInfoStep() : renderPurchaseStep()}
      </div>
    </div>
  );
}

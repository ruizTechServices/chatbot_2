'use client';

import React, { useEffect, useState } from 'react';

export default function TestPaymentPage() {
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`]);
  };

  useEffect(() => {
    // Display environment variables (only public ones)
    addLog(`NEXT_PUBLIC_SQUARE_APPLICATION_ID: ${process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || 'not set'}`);
    addLog(`NEXT_PUBLIC_SQUARE_LOCATION_ID: ${process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || 'not set'}`);
    
    // Hard-coded test values (same as in SessionPurchase.tsx)
    const applicationId = 'sandbox-sq0idb-4g1j2v3x5f8z4e7a9c6d';
    const locationId = 'LANF3ZF08CMWT';
    
    addLog(`Using applicationId: ${applicationId}`);
    addLog(`Using locationId: ${locationId}`);
    
    // Load Square SDK
    const loadSquareSdk = async () => {
      try {
        addLog('Loading Square SDK...');
        
        if (window.Square) {
          addLog('Square SDK already loaded');
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
        script.async = true;
        
        // Promise to track when script is loaded
        const loadPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => {
            addLog('Square SDK loaded successfully');
            resolve();
          };
          
          script.onerror = () => {
            const errMsg = 'Failed to load Square SDK';
            addLog(errMsg);
            reject(new Error(errMsg));
          };
        });
        
        document.body.appendChild(script);
        await loadPromise;
        
        // Initialize Square
        if (!window.Square) {
          throw new Error('Square not available after script load');
        }
        
        addLog('Initializing Square payments...');
        const payments = window.Square.payments(applicationId, locationId);
        addLog('Square payments initialized');
        
        // Create card element
        addLog('Creating card element...');
        const card = await payments.card();
        addLog('Card element created');
        
        // Attach card element to DOM
        addLog('Attaching card element to DOM...');
        await card.attach('#card-container');
        addLog('Card element attached successfully');
        
        setStatus('Ready');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        addLog(`ERROR: ${errorMessage}`);
        setError(errorMessage);
        setStatus('Failed');
      }
    };
    
    loadSquareSdk();
  }, []);
  
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Square Payment Test Page</h1>
      
      <div className="mb-6 p-4 border border-gray-700 rounded-md">
        <h2 className="text-xl mb-2">Status: <span className={status === 'Ready' ? 'text-green-500' : status === 'Failed' ? 'text-red-500' : 'text-yellow-500'}>{status}</span></h2>
        
        {error && (
          <div className="bg-red-900/20 border border-red-800 p-3 my-3 text-red-400">
            {error}
          </div>
        )}
        
        <div className="mt-4">
          <h3 className="text-lg mb-2">Card Test Element:</h3>
          <div 
            id="card-container" 
            className="p-3 bg-[#111111] border border-gray-800 rounded-md min-h-[40px]"
          ></div>
          <p className="text-xs text-gray-500 mt-1">
            For testing, use card number: 4111 1111 1111 1111, any future date, and any CVC
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg mb-2">Debug Logs:</h2>
        <pre className="bg-gray-900 p-4 rounded-md text-xs h-80 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="pb-1">{log}</div>
          ))}
        </pre>
      </div>
      
      <div>
        <h2 className="text-lg mb-2">Test Square API Directly:</h2>
        <button 
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-md mr-3"
          onClick={async () => {
            try {
              addLog('Testing API endpoint...');
              const response = await fetch('/api/square/test', {
                method: 'POST',
              });
              const data = await response.json();
              addLog(`API response: ${JSON.stringify(data)}`);
            } catch (err) {
              addLog(`API test error: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
          }}
        >
          Test Square API
        </button>
      </div>
    </div>
  );
}

// For TypeScript
declare global {
  interface Window {
    Square?: any;
  }
}

'use client';

import React, { useState, useEffect } from 'react';

type Card = {
  id: string;
  last4: string;
  cardBrand: string;
  expMonth: number;
  expYear: number;
  cardholderName?: string;
};

interface SavedCardsProps {
  onCardSelect: (cardId: string) => void;
  onNewCard: () => void;
  onError?: () => void;
}

export function SavedCards({ onCardSelect, onNewCard, onError }: SavedCardsProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSavedCards() {
      try {
        setLoading(true);
        const response = await fetch('/api/square/saved-cards');
        
        // Check if response is ok before parsing JSON
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server responded with error:', response.status, errorText);
          throw new Error(`Server error (${response.status}): Unable to load saved cards`);
        }
        
        const data = await response.json();
        setCards(data.cards || []);
      } catch (err: any) {
        console.error('Error loading saved cards:', err);
        // Set a user-friendly error message
        setError('We encountered an issue loading your saved payment methods. You can continue with a new card.');
        
        // Notify parent component about the error
        if (onError) {
          onError();
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchSavedCards();
  }, [onError]);

  const getCardIcon = (brand: string) => {
    switch (brand.toUpperCase()) {
      case 'VISA':
        return '💳 Visa';
      case 'MASTERCARD':
        return '💳 Mastercard';
      case 'AMEX':
        return '💳 American Express';
      case 'DISCOVER':
        return '💳 Discover';
      default:
        return '💳 Card';
    }
  };
  
  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
    onCardSelect(cardId);
  };
  
  const handleDeleteCard = async (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to remove this card?')) {
      return;
    }
    
    try {
      const response = await fetch('/api/square/saved-cards', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete card');
      }
      
      // Remove the card from the list
      setCards(cards.filter(card => card.id !== cardId));
      
      // If this was the selected card, clear the selection
      if (selectedCard === cardId) {
        setSelectedCard(null);
      }
    } catch (err: any) {
      console.error('Error deleting card:', err);
      setError(err.message || 'Failed to delete card');
    }
  };

  if (loading) {
    return <div className="py-4 text-center text-gray-400">Loading saved payment methods...</div>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-900/30 border border-red-800 p-3 text-sm text-red-200 my-3">
          {error}
        </div>
        <button
          onClick={onNewCard}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-700 to-amber-500 text-sm hover:from-amber-600 hover:to-amber-400 transition-all"
        >
          Continue with New Card
        </button>
      </div>
    );
  }

  return (
    <div className="my-4">
      <h3 className="text-lg font-medium mb-3">Select Payment Method</h3>
      
      {cards.length === 0 ? (
        <div className="text-gray-400 mb-4">
          You have no saved payment methods.
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {cards.map(card => (
            <div 
              key={card.id}
              onClick={() => handleCardSelect(card.id)}
              className={`p-3 border rounded-sm cursor-pointer transition-colors ${
                selectedCard === card.id 
                  ? 'bg-amber-900/20 border-amber-700' 
                  : 'bg-gray-900 border-gray-800 hover:bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{getCardIcon(card.cardBrand)}</div>
                  <div className="text-sm text-gray-400">
                    •••• {card.last4} | Expires {card.expMonth}/{card.expYear}
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDeleteCard(card.id, e)}
                  className="text-gray-500 hover:text-red-400 p-1"
                  aria-label="Delete card"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex space-x-2">
        <button
          onClick={onNewCard}
          className="py-2 px-4 border border-gray-700 text-sm hover:bg-gray-800 transition-colors"
        >
          {cards.length > 0 ? '+ Use New Card' : 'Add Payment Method'}
        </button>
        
        {selectedCard && (
          <button
            onClick={() => onCardSelect(selectedCard)}
            className="py-2 px-4 bg-gradient-to-r from-amber-700 to-amber-500 text-sm hover:from-amber-600 hover:to-amber-400 transition-all"
          >
            Continue with Selected Card
          </button>
        )}
      </div>
    </div>
  );
}

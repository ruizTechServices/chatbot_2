'use client';
import { useState, useEffect } from "react";
import ChecklistItemComponent from "./ChecklistItem";

// Define the ChecklistItem type
export type ChecklistItem = {
  id: string;
  name: string;
  isChecked: boolean;
  updatedAt: string;
};

export default function Checklist() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch checklist items when component mounts
  useEffect(() => {
    const initializeChecklist = async () => {
      try {
        // First ensure the checklist is initialized
        await fetch('/api/checklist/init');
        
        // Then fetch the current state
        const response = await fetch('/api/checklist');
        if (!response.ok) {
          throw new Error('Failed to fetch checklist');
        }
        const data = await response.json();
        setChecklistItems(data);
      } catch (error) {
        console.error('Error loading checklist:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChecklist();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = async (name: string, isChecked: boolean) => {
    try {
      // Optimistically update UI
      setChecklistItems(prev =>
        prev.map(item =>
          item.name === name ? { ...item, isChecked } : item
        )
      );
      
      // Send update to server
      const response = await fetch('/api/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isChecked }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update checklist');
        // If there's an error, we would revert the optimistic update here
      }
    } catch (error) {
      console.error('Error updating checklist:', error);
      // Revert optimistic update on error
      const response = await fetch('/api/checklist');
      const data = await response.json();
      setChecklistItems(data);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10 h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold underline mb-4 text-center">
        24HourGPT Features Checklist
      </h1>
      
      {loading ? (
        <p>Loading checklist...</p>
      ) : (
        <ul className="list-none space-y-2 divide-y divide-gray-200">
          {/* Render each checklist item */}
          {checklistItems.length === 0 && (
            <p className="text-center text-gray-500">No items found.</p>
          )}
          {checklistItems.map(item => (
            <ChecklistItemComponent 
              key={item.id} 
              item={item} 
              onChange={handleCheckboxChange} 
            />
          ))}
        </ul>
      )}
    </div>
  );
}
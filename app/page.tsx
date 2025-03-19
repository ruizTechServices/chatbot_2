'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { generateEmbeddings } from "@/utils/functions/generateEmbeddings";

// Define the ChecklistItem type
type ChecklistItem = {
  id: string;
  name: string;
  isChecked: boolean;
  updatedAt: string;
};

export default function Home() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
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
    <div className="p-6">
      {isSignedIn ? (
        <div className="flex items-center gap-4">
          <p>Welcome {user?.firstName ?? "User"}</p>
          <UserButton />
          <Link href="/chat">Chatbot</Link>
        </div>
      ) : (
        <Link href="/sign-in">Sign-In</Link>
      )}
      <p>{user?.lastName ?? "User"}</p>
      <h1 className="text-3xl font-bold underline mb-4">
        24HourGPT Features Checklist
      </h1>
      
      {loading ? (
        <p>Loading checklist...</p>
      ) : (
        <ul className="list-none space-y-2">
          {checklistItems.map(item => (
            <li key={item.id} className="flex items-center">
              <input 
                type="checkbox" 
                id={item.name}
                checked={item.isChecked}
                onChange={(e) => handleCheckboxChange(item.name, e.target.checked)}
                className="mr-2" 
              />
              <label htmlFor={item.name}>
                {item.name === 'auth' && 'Clerk Authentication'}
                {item.name === 'prisma' && 'Prisma ORM'}
                {item.name === 'sqlite' && 'SQLite Database'}
                {item.name === 'multitenancy' && 'Multi-tenancy'}
                {item.name === 'square' && 'Square API Payments'}
                {item.name === 'timer' && '24-hour Timer Countdown after $1 USD Payment'}
                {item.name === 'pinecone' && 'Pinecone Integration'}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


////TO DO LIST March 11, 2025 11:59am
//Implement payment
//Implement chat history export
//Implement monthly database storage
//Implement tracking
//Implement analytics
//Implement user feedback
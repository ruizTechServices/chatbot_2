'use client';
import React from "react";
import { ChecklistItem } from "./Checklist";

type ChecklistItemProps = {
  item: ChecklistItem;
  onChange: (name: string, isChecked: boolean) => void;
};

export default function ChecklistItemComponent({ item, onChange }: ChecklistItemProps) {
  // Helper function to determine label text
  const getLabel = () => {
    switch(item.name) {
      case 'auth': return 'Clerk Authentication';
      case 'prisma': return 'Prisma ORM';
      case 'sqlite': return 'SQLite Database';
      case 'multitenancy': return 'Multi-tenancy';
      case 'square': return 'Square API Payments';
      case 'timer': return '24-hour Timer Countdown after $1 USD Payment';
      case 'pinecone': return 'Pinecone Integration';
      default: return item.name;
    }
  };

  return (
    <li className="flex items-center">
      <input 
        type="checkbox" 
        id={item.name}
        checked={item.isChecked}
        onChange={(e) => onChange(item.name, e.target.checked)}
        className="mr-2" 
      />
      <label htmlFor={item.name}>
        {getLabel()}
      </label>
    </li>
  );
}
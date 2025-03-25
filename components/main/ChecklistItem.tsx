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
      case 'langchain': return 'LangChain Integration';
      case 'openai': return 'OpenAI API Integration';
      case 'Google': return 'Google API Integration';
      case 'contact form': return 'Contact Form';
      case 'email': return 'Email Notifications';
      case 'webhooks': return 'Webhooks';
      case 'admin dashboard': return 'admin dashboard';
      case 'user dashboard': return 'user dashboard';
      case 'user profile': return 'user profile';
      case 'user settings': return 'user settings';
      case 'user management': return 'user management';
      case 'user roles': return 'user roles';
      case 'user permissions': return 'user permissions';
      case 'user activity': return 'user activity';
      case 'user notifications': return 'user notifications';
      case 'user preferences': return 'user preferences';
      case 'user groups': return 'user groups';
      case 'user tags': return 'user tags';
      case 'user notes': return 'user notes';
      case 'terms&conditions': return ' Terms & Conditions';
      case 'privacy policy': return 'Privacy Policy';
      case 'cookie policy': return 'Cookie Policy';
      case 'GDPR': return 'GDPR Compliance';
      case 'CCPA': return 'CCPA Compliance';
      case 'security': return 'Security Features';
      case 'performance': return 'Performance Optimization';
      case 'scalability': return 'Scalability Features';
      case 'accessibility': return 'Accessibility Features';
      case 'analytics': return 'Analytics and Reporting';
      case 'monitoring': return 'Monitoring and Logging';
      case 'backup': return 'Backup and Recovery';
      case 'support': return 'Customer Support';
      case 'documentation': return 'Documentation and Guides';
      case 'API': return 'API Documentation';
      case 'SDK': return 'SDK Documentation';
      case 'CLI': return 'CLI Documentation';
      case 'UI': return 'UI Components';
      case 'UX': return 'UX Design';
      case 'testing': return 'Testing and QA';
      case 'deployment': return 'Deployment and CI/CD';
      case 'localization': return 'Localization and Internationalization';
      case 'customization': return 'Customization Options';
      case 'integration': return 'Integration with Third-party Services';
      case 'migration': return 'Data Migration Tools';
      default: return item.name;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
    <li className="flex items-center mb-2 hover:bg-gray-100 p-2 rounded">
      {/* Checkbox input */}
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
    </div>
  );
}
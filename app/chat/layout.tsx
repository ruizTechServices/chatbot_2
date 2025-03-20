import Link from 'next/link';
import React from 'react';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* No header or footer in the luxury chat interface */}
      <main>
        {children}
      </main>
    </div>
  );
}
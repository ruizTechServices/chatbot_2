'use client';
import AuthSection from '@/components/main/AuthSection';
import Checklist from '@/components/main/Checklist';

export default function Home() {
  return (
    <div className="p-6">
      <AuthSection />
      <Checklist />
    </div>
  );
}
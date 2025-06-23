//app/page.tsx
//app/page.tsx - server component

import Navigation from '@/components/main/Navigation';
import HeroSection from '@/components/main/HeroSection';
import FeaturesSection from '@/components/main/FeaturesSection';
import TestimonialsSection from '@/components/main/TestimonialsSection';
import PricingSection from '@/components/main/PricingSection';
import FaqSection from '@/components/main/FaqSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-light">
      {/* Client components */}
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
    </div>
  );
}

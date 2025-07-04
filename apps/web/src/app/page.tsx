"use client";

import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { WhyUmiSection } from '@/components/WhyUmiSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ParallaxStarfieldBackground } from '../components/ParallaxStarfieldBackground';
import { Dashboard } from '../components/Dashboard';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <main className="relative overflow-x-hidden">
      <ParallaxStarfieldBackground />
      {isConnected ? (
        <Dashboard />
      ) : (
        <>
          <HeroSection />
          <AboutSection />
          <WhyUmiSection />
          <FeaturesSection />
        </>
      )}
    </main>
  );
}

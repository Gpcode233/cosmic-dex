"use client";

import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { WhyUmiSection } from '@/components/WhyUmiSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ParallaxStarfieldBackground } from '../components/ParallaxStarfieldBackground';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [showDashboard, setShowDashboard] = useState(false);

  // Add a small delay to prevent flickering
  useEffect(() => {
    if (isConnected && address) {
      const timer = setTimeout(() => {
        setShowDashboard(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowDashboard(false);
    }
  }, [isConnected, address]);

  // Show dashboard when wallet is connected
  if (showDashboard && isConnected && address) {
    return <Dashboard />;
  }

  // Show landing page when wallet is not connected
  return (
    <main className="relative overflow-x-hidden">
      <ParallaxStarfieldBackground />
      <HeroSection />
      <AboutSection />
      <WhyUmiSection />
      <FeaturesSection />
    </main>
  );
}

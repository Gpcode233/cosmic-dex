import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { WhyUmiSection } from '@/components/WhyUmiSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ParallaxStarfieldBackground } from '../components/ParallaxStarfieldBackground';

export default function Home() {
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

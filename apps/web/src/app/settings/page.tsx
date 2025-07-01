'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">Settings page is only available on mobile.</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
      <h1 className="text-2xl font-bold mb-4 text-white">Settings</h1>
      <div className="bg-white/5 rounded-xl p-4 text-white">User settings and preferences go here.</div>
    </div>
  );
} 
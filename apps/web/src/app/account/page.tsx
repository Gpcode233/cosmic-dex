'use client';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">Account page is only available on mobile.</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
      <h1 className="text-2xl font-bold mb-4 text-white">Account</h1>
      <div className="bg-white/5 rounded-xl p-4 text-white">User account details and actions go here.</div>
    </div>
  );
} 
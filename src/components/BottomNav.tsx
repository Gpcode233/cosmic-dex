// src/components/BottomNav.tsx
'use client';

import Link from 'next/link';
import { Home, Repeat, Search, User, Menu } from 'lucide-react';

const bottomNavLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Swap', href: '/swap', icon: Repeat },
  { name: 'Explore', href: '/explore', icon: Search },
  { name: 'Portfolio', href: '/portfolio', icon: User },
];

export default function BottomNav({ onMenu }: { onMenu: () => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a1747] border-t border-[#192a56] flex justify-around items-center h-16 md:hidden">
      {bottomNavLinks.map(link => (
        <Link
          key={link.name}
          href={link.href}
          className="flex flex-col items-center text-xs text-gray-300 hover:text-white transition-colors px-2 py-1"
        >
          <link.icon className="w-6 h-6 mb-1" />
          {link.name}
        </Link>
      ))}
      <button
        onClick={onMenu}
        className="flex flex-col items-center text-xs text-gray-300 hover:text-white transition-colors px-2 py-1 focus:outline-none"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 mb-1" />
        More
      </button>
    </nav>
  );
}

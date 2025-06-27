'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Repeat, Search, User, Info, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Swap', href: '/swap', icon: Repeat },
  { name: 'Explore', href: '/explore', icon: Search },
  { name: 'Portfolio', href: '/portfolio', icon: User },
  { name: 'About', href: '/about', icon: Info },
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
];

const mainLinks = navLinks.slice(0, 4); // Show these in top nav on mobile
const menuLinks = navLinks.slice(4); // These go in the menu on mobile

const BottomNav = dynamic(() => import('./BottomNav'), { ssr: false });

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex justify-between items-center bg-[#0a1747] border-b border-[#192a56] shadow-lg font-orbitron">
        <div className="flex items-center gap-4 w-full justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <Image src="/galaxy.svg" alt="Cosmic DEX Logo" width={36} height={36} priority />
            <span className="text-xl font-extrabold text-white tracking-wide select-none leading-tight">COSMIC DEX</span>
          </Link>
          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex gap-3">
              {navLinks.map(link => (
                <Link key={link.name} href={link.href} className="flex items-center gap-1 px-3 py-2 rounded-lg text-base font-semibold text-gray-200 hover:bg-[#132c56] hover:text-white transition-all">
                  <link.icon className="w-5 h-5 mb-0.5" />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <a
              href="#"
              className="px-3 py-1.5 rounded-lg font-semibold text-sm text-white bg-[#181830] border border-[#233c7b] hover:bg-[#232347] hover:border-[#00ffe7] shadow-lg transition-all duration-300 whitespace-nowrap"
            >
              Get the App
            </a>
            <div className="min-w-0 flex-shrink-0"><ConnectButton /></div>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cosmic-400">
              <Menu className="w-7 h-7 text-white" />
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 right-0 w-64 h-full border-l border-[#233c7b] shadow-2xl z-50 flex flex-col p-6 gap-6 bg-[#0a1747]"
            >
              <button className="self-end mb-4" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="w-7 h-7 text-white" />
              </button>
              {mainLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 text-lg font-bold text-gray-200 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-[#233c7b] my-2" />
              {menuLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 text-base font-semibold text-gray-200 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              <a
                href="#"
                className="mt-4 px-3 py-1.5 rounded-lg font-semibold text-sm text-white bg-[#181830] border border-[#233c7b] hover:bg-[#232347] hover:border-[#00ffe7] shadow-lg transition-all duration-300 text-center block"
              >
                Get the App
              </a>
              <div className="mt-4"><ConnectButton /></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Bottom Navigation for Mobile */}
      <BottomNav onMenu={() => setMobileMenuOpen(true)} />
    </>
  );
}
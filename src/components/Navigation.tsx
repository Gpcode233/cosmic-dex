'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Swap', href: '/swap' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-[#0d0c24]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-cosmic-500/10 font-orbitron rounded-b-2xl">
      <div className="flex items-center gap-6 w-full justify-between">
        <Link href="/" className="flex items-center gap-3 cursor-pointer flex-shrink-0">
          <span className="relative flex items-center gap-2">
            <Image src="/galaxy.svg" alt="Cosmic DEX Logo" width={40} height={40} priority />
            <span className="text-2xl font-extrabold text-gray-300 transition-colors duration-200 hover:text-white tracking-wide select-none leading-tight">COSMIC DEX</span>
          </span>
        </Link>
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="flex gap-2">
            {navLinks.map(link => (
              <motion.div key={link.name} whileHover={{ scale: 1.08 }}>
                <Link href={link.href} className="text-base font-medium text-gray-300 hover:text-white transition-colors px-2 py-1 rounded whitespace-nowrap">
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <motion.a
            href="#"
            className="px-3 py-1.5 rounded-lg font-semibold text-sm text-white bg-[#181830] border-2 border-white hover:bg-[#232347] hover:border-[#00ffe7] shadow-lg transition-all duration-300 whitespace-nowrap"
            whileHover={{ scale: 1.07 }}
          >
            Get the App
          </motion.a>
          <div className="min-w-0 flex-shrink-0"><ConnectButton /></div>
        </div>
        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="w-8 h-8 text-cosmic-400" />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.2 }}
                className="fixed top-0 right-0 w-64 h-full bg-[#0d0c24]/90 backdrop-blur-lg border-l border-cosmic-400/20 shadow-2xl z-50 flex flex-col p-6 gap-6"
              >
                <button className="self-end mb-4" onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="w-7 h-7 text-cosmic-400" />
                </button>
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-bold text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <a
                  href="#"
                  className="mt-4 px-3 py-1.5 rounded-lg font-semibold text-sm text-white bg-[#181830] border-2 border-white hover:bg-[#232347] hover:border-[#00ffe7] shadow-lg transition-all duration-300 text-center block"
                >
                  Get the App
                </a>
                <div className="mt-4"><ConnectButton /></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
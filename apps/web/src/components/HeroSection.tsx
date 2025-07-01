'use client';

import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-void">
      {/* CSS Galaxy Swirl Background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Swirl core */}
        <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cosmic-400/60 via-nebula-500/40 to-stellar-500/10 blur-2xl animate-spin-slow" />
        {/* Outer swirl */}
        <div className="absolute left-1/2 top-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-conic from-cosmic-400/20 via-nebula-500/10 to-stellar-500/0 blur-3xl animate-spin-reverse-slower" />
        {/* Starfield (optional, can add a PNG or CSS dots) */}
      </div>
      {/* Animated background elements */}
      <div className="absolute inset-0 z-10">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-cosmic-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-nebula-500/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        {/* Main title */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-t from-[#181830] via-[#bfc6e6] to-[#f3f4fa] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          COSMIC DEX
        </motion.h1>
        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-orbitron"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          The future of decentralized trading is here. Experience seamless swaps across the galaxy.<br />
          <span className="text-cosmic-400 font-bold">Built for Umi network.</span>
        </motion.p>
        {/* CTA Button */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
        >
          <ConnectButton />
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-cosmic-500 to-nebula-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(107, 99, 255, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Explore DEX
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
} 
'use client';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="max-w-2xl mx-auto mt-24 p-8 bg-white/5 rounded-2xl shadow-lg border border-white/10 text-center">
        <h1 className="text-3xl font-orbitron font-bold mb-4">About Cosmic DEX</h1>
        <p className="text-gray-300 mb-4">Cosmic DEX is your gateway to trading in the stars. We blend a futuristic, space-inspired UI with the power of the Umi network for fast, secure, and decentralized swaps.</p>
        <h2 className="text-xl font-bold text-cosmic-400 mb-2">Powered by Umi</h2>
        <p className="text-gray-400 mb-4">Umi is a next-generation blockchain network designed for speed, scalability, and interoperability. Cosmic DEX leverages Umi to deliver a seamless trading experience.</p>
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-1">Team & Hackathon Credits</h3>
          <p className="text-gray-400">Built for the Umi Hackathon by the Cosmic DEX team.</p>
        </div>
      </div>
    </motion.div>
  );
} 
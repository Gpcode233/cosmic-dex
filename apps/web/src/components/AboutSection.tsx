"use client";
import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section className="relative py-24 text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          What is Cosmic DEX?
        </motion.h2>
        <motion.p
          className="text-lg md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Cosmic DEX is a futuristic, space-themed decentralized exchange built for the next generation of traders. Our mission is to make DeFi accessible, secure, and fun for everyone—across the galaxy and beyond. Swap, earn, and explore new frontiers in decentralized finance with a platform designed for speed, transparency, and community.
        </motion.p>
        <motion.div
          className="flex justify-center gap-8 mt-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="bg-cosmic-500/10 rounded-xl p-6 shadow-lg backdrop-blur-md">
            <span className="block text-3xl font-bold text-cosmic-400 mb-2">🚀</span>
            <span className="block text-lg font-semibold">Fast & Secure Swaps</span>
          </div>
          <div className="bg-nebula-500/10 rounded-xl p-6 shadow-lg backdrop-blur-md">
            <span className="block text-3xl font-bold text-nebula-400 mb-2">🪐</span>
            <span className="block text-lg font-semibold">Space-Themed Experience</span>
          </div>
          <div className="bg-stellar-500/10 rounded-xl p-6 shadow-lg backdrop-blur-md">
            <span className="block text-3xl font-bold text-stellar-400 mb-2">🌌</span>
            <span className="block text-lg font-semibold">Community Driven</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
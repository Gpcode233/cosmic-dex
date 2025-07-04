"use client";
import { motion } from "framer-motion";

export function WhyUmiSection() {
  return (
    <section className="relative py-24 text-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Why Build on Umi?
        </motion.h2>
        <motion.p
          className="text-lg md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Umi is a next-generation blockchain network trusted by developers and users alike. With blazing-fast transaction speeds, low fees, and robust security, Umi empowers Cosmic DEX to deliver a seamless and reliable DeFi experience. We chose Umi because it stands for trust, innovation, and a vision for a truly decentralized future.
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="bg-cosmic-500/10 rounded-xl p-6 shadow-lg backdrop-blur-md min-w-[220px]">
            <span className="block text-3xl font-bold text-cosmic-400 mb-2">🔒</span>
            <span className="block text-lg font-semibold">Trusted & Secure</span>
          </div>
          <div className="bg-nebula-500/10 rounded-xl p-6 shadow-lg backdrop-blur-md min-w-[220px]">
            <span className="block text-3xl font-bold text-nebula-400 mb-2">⚡</span>
            <span className="block text-lg font-semibold">Lightning Fast</span>
          </div>
          <div className="bg-stellar-500/10 rounded-xl p-6 shadow-lg backdrop-blur-md min-w-[220px]">
            <span className="block text-3xl font-bold text-stellar-400 mb-2">💡</span>
            <span className="block text-lg font-semibold">Innovative & Scalable</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
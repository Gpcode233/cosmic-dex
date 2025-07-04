"use client";
import { motion } from "framer-motion";
import { Zap, Smartphone, Shield } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="relative py-24 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Features & How It Works
        </motion.h2>
        <motion.p
          className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Discover the power of Cosmic DEX. Swap tokens instantly, track your portfolio, and explore new DeFi opportunities—all in one place.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            className="bg-cosmic-500/10 rounded-xl p-8 shadow-lg backdrop-blur-md"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <span className="block mb-4"><Zap className="w-10 h-10 mx-auto" /></span>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-300">Trade your favorite tokens with minimal delay and maximum efficiency.</p>
          </motion.div>
          <motion.div
            className="bg-nebula-500/10 rounded-xl p-8 shadow-lg backdrop-blur-md"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span className="block mb-4"><Smartphone className="w-10 h-10 mx-auto" /></span>
            <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
            <p className="text-gray-300">Enjoy a seamless experience on any device, anywhere.</p>
          </motion.div>
          <motion.div
            className="bg-stellar-500/10 rounded-xl p-8 shadow-lg backdrop-blur-md"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <span className="block mb-4"><Shield className="w-10 h-10 mx-auto" /></span>
            <h3 className="text-xl font-bold mb-2">Secure</h3>
            <p className="text-gray-300">Your trades and data are protected with industry-leading security.</p>
          </motion.div>
        </div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <a
            href="#"
            className="inline-block px-10 py-4 bg-gradient-to-r from-cosmic-500 to-nebula-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300 text-lg"
          >
            Start Exploring Cosmic DEX
          </a>
        </motion.div>
      </div>
    </section>
  );
} 
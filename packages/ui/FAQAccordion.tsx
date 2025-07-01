'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What is Cosmic DEX?',
    answer: 'Cosmic DEX is a futuristic, space-themed decentralized exchange built on the Umi network.'
  },
  {
    question: 'How do I connect my wallet?',
    answer: 'Click the Connect Wallet button in the navbar to connect using RainbowKit.'
  },
  {
    question: 'Is Cosmic DEX live on mainnet?',
    answer: 'This is a hackathon project and currently uses mock data. Mainnet launch coming soon!'
  },
  {
    question: 'What is the Umi network?',
    answer: 'Umi is a next-generation blockchain network designed for speed, scalability, and interoperability.'
  },
];

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="max-w-2xl mx-auto mt-24 p-8 bg-white/5 rounded-2xl shadow-lg border border-cosmic-400/40 text-center">
      <h1 className="text-3xl font-orbitron font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="rounded-xl border border-cosmic-400/30 bg-void/60">
            <button
              className="w-full text-left px-6 py-4 font-bold text-lg text-cosmic-400 flex justify-between items-center focus:outline-none"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              {faq.question}
              <span className="ml-2 text-cosmic-400 flex items-center">
                {open === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open === idx && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-6 pb-4 text-gray-300 border-t border-cosmic-400/20"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
} 
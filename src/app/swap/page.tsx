'use client';
import  SwapWidget  from '@/components/SwapWidget';
import { motion } from 'framer-motion';

export default function SwapPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-24">
      <SwapWidget />
    </motion.div>
  );
} 
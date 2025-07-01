'use client';
import { FAQAccordion } from '@/components/FAQAccordion';
import { motion } from 'framer-motion';

export default function FAQPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <FAQAccordion />
    </motion.div>
  );
} 
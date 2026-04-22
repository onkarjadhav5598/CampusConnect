import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function Loader({ fullPage = true, size = 'lg' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-white/10 border-t-primary"
        />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Zap className="w-6 h-6 text-primary" />
          </motion.div>
        </div>
      </div>
      <p className="text-sm text-gray-400 tracking-wide">Loading…</p>
    </div>
  );

  if (!fullPage) return spinner;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {spinner}
    </div>
  );
}

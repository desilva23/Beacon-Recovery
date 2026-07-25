'use client';
import { motion } from 'framer-motion';

export const BreathPacer = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 my-8">
      <motion.div
        className="w-32 h-32 rounded-full bg-indigo-500/20 flex items-center justify-center border-4 border-indigo-500"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.3, 1, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="text-lg font-medium text-indigo-700 dark:text-indigo-300">
          Breathe
        </span>
      </motion.div>
      <p className="text-slate-600 dark:text-slate-400 text-sm animate-pulse">Wait, help is coming. Breathe with me...</p>
    </div>
  );
};

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      // whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      className={`
        relative overflow-hidden rounded-3xl 
        bg-[#0A142A]/80 backdrop-blur-xl 
        border border-gray-700/50 
        shadow-2xl shadow-black/20
        before:absolute before:inset-0 
        before:bg-gradient-to-br before:from-blue-500/5 before:to-transparent 
        before:rounded-3xl before:pointer-events-none
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

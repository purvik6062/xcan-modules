"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  completed: number;
  total: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "purple" | "orange";
  className?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({
  progress,
  completed,
  total,
  showLabel = true,
  size = "md",
  color = "blue",
  className = "",
  showPercentage = true,
}: ProgressBarProps) {
  const heightClass = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  }[size];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  }[color];

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {progress === 100 && (
        <motion.div
          className="flex items-center gap-2 mt-2 text-green-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-lg">✓</span>
          <span className="text-sm font-medium">Complete!</span>
        </motion.div>
      )}
    </div>
  );
}

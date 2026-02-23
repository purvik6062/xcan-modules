"use client";

import { motion } from "framer-motion";

export interface ModuleUserCount {
  moduleId: string;
  moduleName: string;
  userCount: number;
}

interface ModuleCardProps {
  module: ModuleUserCount;
  selected: boolean;
  onClick: () => void;
  delay?: number;
}

export function ModuleCard({
  module,
  selected,
  onClick,
  delay = 0,
}: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus:outline-none ${
        selected
          ? "border-emerald-500/50 bg-emerald-500/5 ring-2 ring-emerald-500"
          : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800/80"
      }`}
    >
      <div className="mb-2 text-lg font-semibold text-white">
        {module.moduleName}
      </div>
      <div className="text-2xl font-bold text-emerald-400">
        {module.userCount}
      </div>
      <div className="text-sm text-slate-400">users completed</div>
    </motion.div>
  );
}

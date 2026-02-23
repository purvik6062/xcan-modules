"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type Variant = "emerald" | "amber" | "blue" | "indigo" | "purple" | "pink" | "cyan" | "white";

const variantStyles: Record<
  Variant,
  { value: string }
> = {
  emerald: { value: "text-emerald-400" },
  amber: { value: "text-amber-400" },
  blue: { value: "text-blue-400" },
  indigo: { value: "text-indigo-400" },
  purple: { value: "text-purple-400" },
  pink: { value: "text-pink-400" },
  cyan: { value: "text-cyan-400" },
  white: { value: "text-white" },
};

interface StatCardProps {
  value: string | number;
  label: string;
  variant?: Variant;
  icon?: LucideIcon;
  delay?: number;
}

export function StatCard({
  value,
  label,
  variant = "emerald",
  icon: Icon,
  delay = 0,
}: StatCardProps) {
  const { value: valueClass } = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5 shadow-lg transition-all duration-200 hover:border-slate-600/50 hover:shadow-xl sm:p-6"
    >
      {Icon && (
        <div className={`mb-3 opacity-70 ${valueClass}`}>
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
      )}
      <div className={`text-3xl font-bold sm:text-4xl ${valueClass}`}>
        {value}
      </div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
    </motion.div>
  );
}

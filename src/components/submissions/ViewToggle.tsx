"use client";

import { motion } from "framer-motion";

export interface ViewToggleOption {
  value: string;
  label: string;
}

interface ViewToggleProps {
  value: string;
  onChange: (value: string) => void;
  options: ViewToggleOption[];
  disabled?: boolean;
  layoutId?: string;
}

export function ViewToggle({
  value,
  onChange,
  options,
  disabled = false,
  layoutId = "viewToggleActive",
}: ViewToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="inline-flex rounded-xl bg-slate-800/50 p-1"
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-pressed={isActive}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => !disabled && onChange(opt.value)}
            className={`relative rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus:outline-none ${
              isActive
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg border border-emerald-500/50 bg-emerald-500/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search by wallet address...",
}: SearchInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative"
    >
      <Search
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 py-2.5 pl-12 pr-12 text-white placeholder-slate-500 transition-all duration-200 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </motion.div>
  );
}

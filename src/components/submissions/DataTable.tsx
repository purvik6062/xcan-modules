"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DataTableProps {
  children: ReactNode;
  className?: string;
  pagination?: ReactNode;
}

export function DataTable({ children, className = "", pagination }: DataTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl ${className}`}
    >
      <div className="overflow-x-auto">{children}</div>
      {pagination}
    </motion.div>
  );
}

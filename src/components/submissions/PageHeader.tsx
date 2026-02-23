"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8 text-center"
    >
      <h1 className="mb-4 flex items-center justify-center gap-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {Icon && (
          <span className="text-emerald-400">
            <Icon className="h-8 w-8 sm:h-9 sm:w-9" />
          </span>
        )}
        {title}
      </h1>
      {subtitle && (
        <p className="text-base text-slate-400">{subtitle}</p>
      )}
    </motion.div>
  );
}

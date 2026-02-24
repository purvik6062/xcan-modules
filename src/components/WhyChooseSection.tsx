"use client";

import { motion } from "framer-motion";
import { Code, GraduationCap, Zap } from "lucide-react";

const items = [
  {
    icon: Code,
    title: "Interactive Learning",
    description:
      "Write, test, and execute code directly in your browser with real-time feedback and validation.",
    accent: "emerald",
  },
  {
    icon: GraduationCap,
    title: "Progressive Curriculum",
    description:
      "Structured learning paths that take you from basics to advanced Precompile Playground.",
    accent: "blue",
  },
  {
    icon: Zap,
    title: "Real-World Projects",
    description:
      "Build actual DApps and smart contracts that you can deploy on Arbitrum networks.",
    accent: "indigo",
  },
];

const accentClasses: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/20 text-blue-400",
  indigo: "bg-indigo-500/20 text-indigo-400",
};

export default function WhyChooseSection() {
  return (
    <section className="py-16 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why Choose Modules?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            The most comprehensive platform for learning Arbitrum Core Concepts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 text-center shadow-lg transition-all duration-200 hover:border-slate-600/50 hover:shadow-xl"
              >
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${accentClasses[item.accent]}`}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Target, ArrowRight } from "lucide-react";
import {
  featuredChallenges,
  FeaturedChallenge,
} from "../data/featuredChallenges";

export default function FeaturedChallengesSection() {
  return (
    <section className="py-16 bg-slate-950/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 flex items-center justify-center gap-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="text-emerald-400">
              <Target className="h-8 w-8 sm:h-9 sm:w-9" />
            </span>
            Featured Challenges
          </h2>
          <p className="text-lg text-slate-400">
            Get started with these popular challenges from our Arbitrum Precompiles module
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredChallenges.map((challenge: FeaturedChallenge, index) => (
            <motion.div
              key={challenge.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link
                href={`/challenges/${challenge.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-lg transition-all duration-200 hover:border-slate-600/50 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus:outline-none"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-emerald-400">
                    {challenge.title}
                  </h3>
                  <span
                    className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      challenge.level === "Beginner"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : challenge.level === "Intermediate"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {challenge.level}
                  </span>
                </div>

                <div className="mb-4 flex-grow">
                  <p className="text-sm leading-relaxed text-slate-400">
                    {challenge.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
                    {challenge.precompile}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-medium text-emerald-400 transition-colors group-hover:text-emerald-300">
                    Try Challenge
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-6 py-3 font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus:outline-none"
          >
            View All Challenges
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

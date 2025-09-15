"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { orbitChapters } from "../../../data/orbitChapters";
import ChapterCard from "../../../components/ChapterCard";
import ProgressOverview from "../../../components/ProgressOverview";
import { useWalletProtection } from "../../../hooks/useWalletProtection";

export default function LearnOrbitPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { address, isReady } = useWalletProtection();
  const [chapterProgress, setChapterProgress] = useState<Record<string, { completed: number; total: number }>>({});

  const totalsByChapter = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const chapter of orbitChapters) {
      totals[chapter.id] = chapter.sections.filter((s) => s.status === "available").length;
    }
    return totals;
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!isReady || !address) return;
      try {
        const params = new URLSearchParams({ userAddress: address, module: "master-orbit" });
        const res = await fetch(`/api/challenges?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const chaptersMap: Record<string, string[]> = data?.chapters || {};
        const progressByChapter: Record<string, { totalSections: number; completedSectionIds: string[] }> = data?.progressByChapter || {};
        const next: Record<string, { completed: number; total: number }> = {};
        for (const ch of orbitChapters) {
          const done = chaptersMap[ch.id] || progressByChapter[ch.id]?.completedSectionIds || [];
          const total = progressByChapter[ch.id]?.totalSections ?? totalsByChapter[ch.id] ?? 0;
          next[ch.id] = { completed: done.length, total };
        }
        setChapterProgress(next);
      } catch (e) {
        console.error("learn-orbit: failed to fetch progress", e);
      }
    };
    load();
  }, [address, isReady, totalsByChapter]);

  const filteredChapters =
    selectedLevel === "all"
      ? orbitChapters
      : orbitChapters.filter(
        (chapter) => chapter.level.toLowerCase() === selectedLevel
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Master Arbitrum Orbit
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Launch your own Layer 3 blockchain with full control. Learn from
            configuration to production deployment through hands-on tutorials.
          </motion.p>

          {/* Key Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-emerald-600">L3</div>
              <div className="text-sm text-gray-300">
                Custom Chains
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-teal-600">6</div>
              <div className="text-sm text-gray-300">
                Complete Chapters
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-300">
                Hands-on Lessons
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-purple-600">SDK</div>
              <div className="text-sm text-gray-300">
                Orbit Integration
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <motion.div
            className="bg-slate-800 rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              🚀 Your Orbit Learning Journey
            </h2>
            <p className="text-gray-300 mb-4">
              Track your progress as you master Arbitrum Orbit development from basic concepts to production deployment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-600">0/42</div>
                <div className="text-sm text-emerald-300">
                  Sections Completed
                </div>
              </div>
              <div className="bg-teal-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-teal-600">0</div>
                <div className="text-sm text-teal-300">
                  Badges Earned
                </div>
              </div>
              <div className="bg-blue-900/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">0%</div>
                <div className="text-sm text-blue-300">
                  Overall Progress
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter Controls */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {["all", "beginner", "intermediate", "advanced"].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${selectedLevel === level
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {filteredChapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} basePath="/learn-orbit" progress={chapterProgress[chapter.id]} />
          ))}
        </div>

        {/* Learning Path Info */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Recommended Learning Path</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Follow our structured approach from Orbit fundamentals to launching your own
            production-ready Layer 3 blockchain. Each chapter builds comprehensive knowledge.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {orbitChapters.map((chapter, index) => (
              <div key={chapter.id} className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full text-sm font-bold text-black">
                  {index + 1}
                </div>
                {index < orbitChapters.length - 1 && (
                  <div className="w-8 h-0.5 bg-white bg-opacity-30 mx-2" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Featured Technologies */}
        <motion.div
          className="mt-16 bg-slate-800 rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Technologies You'll Master
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🏗️</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Orbit SDK
              </h3>
              <p className="text-sm text-gray-300">
                Comprehensive toolkit for chain deployment and management
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Chain Configuration
              </h3>
              <p className="text-sm text-gray-300">
                Custom gas tokens, governance, and chain parameters
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Bridge Development
              </h3>
              <p className="text-sm text-gray-300">
                L2-L3 communication and asset transfers
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Security & Monitoring
              </h3>
              <p className="text-sm text-gray-300">
                Production deployment and chain maintenance
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Launch Your Own Chain?
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Start with the fundamentals and work your way up to deploying a production-ready
            Arbitrum Orbit chain with custom features and governance.
          </p>
          <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300">
            Begin Your Journey →
          </button>
        </motion.div>
      </div>
    </div>
  );
} 
"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { defiChapters } from "../data/defiChapters";
import { useWalletProtection } from "../hooks/useWalletProtection";

type ChapterProgress = { completed: number; total: number };

export default function ProgressOverview() {
  const { address, isReady } = useWalletProtection();
  const [chapterProgress, setChapterProgress] = useState<Record<string, ChapterProgress>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Compute per-chapter total sections (exclude coming-soon)
  const totalsByChapter = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const chapter of defiChapters) {
      const totalAvailable = chapter.sections.filter((s) => s.status === "available").length;
      totals[chapter.id] = totalAvailable;
    }
    return totals;
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isReady || !address) return;
      try {
        setIsLoading(true);
        const params = new URLSearchParams({ userAddress: address, module: "master-defi" });
        const res = await fetch(`/api/challenges?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch progress: ${res.status}`);
        const data = await res.json();
        console.log("ProgressOverview: API data", data);

        const chaptersMap: Record<string, string[]> = data?.chapters || {};
        const progressByChapter: Record<string, { totalSections: number; completedSectionIds: string[] }> = data?.progressByChapter || {};
        const nextProgress: Record<string, ChapterProgress> = {};

        for (const chapter of defiChapters) {
          const completedArray = chaptersMap[chapter.id] || progressByChapter[chapter.id]?.completedSectionIds || [];
          const totalFromApi = progressByChapter[chapter.id]?.totalSections;
          nextProgress[chapter.id] = {
            completed: completedArray.length,
            total: typeof totalFromApi === "number" ? totalFromApi : (totalsByChapter[chapter.id] ?? chapter.sections.filter((s) => s.status === "available").length),
          };
        }
        setChapterProgress(nextProgress);
      } catch (e) {
        console.error("ProgressOverview: failed to load progress", e);
        // Fallback to zeros
        const zeros: Record<string, ChapterProgress> = {};
        for (const chapter of defiChapters) {
          zeros[chapter.id] = { completed: 0, total: totalsByChapter[chapter.id] ?? 0 };
        }
        setChapterProgress(zeros);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, [address, isReady, totalsByChapter]);

  const totalCompleted = Object.values(chapterProgress).reduce(
    (sum, chapter) => sum + (chapter?.completed ?? 0),
    0
  );
  const totalSections = Object.values(chapterProgress).reduce(
    (sum, chapter) => sum + (chapter?.total ?? 0),
    0
  );
  const overallProgress = totalSections > 0 ? (totalCompleted / totalSections) * 100 : 0;

  const completedChapters = Object.values(chapterProgress).filter(
    (chapter) => (chapter?.completed ?? 0) === (chapter?.total ?? 0) && (chapter?.total ?? 0) > 0
  ).length;
  const earnedBadges = defiChapters.filter((chapter) => {
    const progress = chapterProgress[chapter.id];
    return progress && progress.completed === progress.total && progress.total > 0;
  }).length;

  return (
    <motion.div
      className="bg-slate-800 rounded-2xl shadow-xl p-8 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Your Learning Journey
        </h2>
        <p className="text-gray-300">
          Track your progress through the DeFi mastery path
        </p>
      </div>

      {/* Overall Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold text-white">
            Overall Progress
          </span>
          <span className="text-lg font-bold text-blue-600">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-3">
          <motion.div
            className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-sm text-gray-300">
          {totalCompleted} of {totalSections} sections completed
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          className="text-center p-4 bg-blue-900/20 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {completedChapters}
          </div>
          <div className="text-sm text-blue-300">
            Chapters Completed
          </div>
        </motion.div>

        <motion.div
          className="text-center p-4 bg-green-900/20 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-3xl font-bold text-green-600 mb-1">
            {earnedBadges}
          </div>
          <div className="text-sm text-green-300">
            NFT Badges Earned
          </div>
        </motion.div>

        <motion.div
          className="text-center p-4 bg-purple-900/20 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {totalCompleted}
          </div>
          <div className="text-sm text-purple-300">
            Lessons Completed
          </div>
        </motion.div>

        <motion.div
          className="text-center p-4 bg-orange-900/20 rounded-xl"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {Math.round(overallProgress) > 0 ? Math.round(overallProgress) : 0}%
          </div>
          <div className="text-sm text-orange-300">
            Progress Score
          </div>
        </motion.div>
      </div>

      {/* Chapter Progress Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Chapter Progress
        </h3>

        {defiChapters.map((chapter, index) => {
          const progress = chapterProgress[chapter.id];
          const progressPercentage = progress && progress.total > 0
            ? (progress.completed / progress.total) * 100
            : 0;

          return (
            <motion.div
              key={chapter.id}
              className="flex items-center p-4 bg-slate-700 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-2xl mr-4">{chapter.icon}</div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">
                    {chapter.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {chapter.status === "coming-soon" ? (
                      <span className="px-2 py-1 text-xs bg-orange-900 text-orange-200 rounded-full">
                        Coming Soon
                      </span>
                    ) : progressPercentage === 100 ? (
                      <span className="px-2 py-1 text-xs bg-green-900 text-green-200 rounded-full">
                        ✓ Completed
                      </span>
                    ) : progressPercentage > 0 ? (
                      <span className="px-2 py-1 text-xs bg-blue-900 text-blue-200 rounded-full">
                        In Progress
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-gray-800 text-gray-200 rounded-full">
                        Not Started
                      </span>
                    )}
                    <span className="text-sm font-medium text-gray-300">
                      {progress
                        ? `${progress.completed}/${progress.total}`
                        : "0/0"}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-600 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${progressPercentage === 100
                      ? "bg-green-500"
                      : progressPercentage > 0
                        ? "bg-blue-500"
                        : "bg-gray-600"
                      }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Achievement Preview */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-purple-100 mb-1">
              Next Achievement
            </h3>
            <p className="text-purple-300 text-sm">
              Complete the Introduction to DeFi chapter to earn your first NFT
              badge!
            </p>
          </div>
          <div className="text-4xl">🏆</div>
        </div>
      </div>
    </motion.div>
  );
}

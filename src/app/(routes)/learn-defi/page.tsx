"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { defiChapters } from "../../../data/defiChapters";
import ChapterCard from "../../../components/ChapterCard";
import ProgressOverview from "../../../components/ProgressOverview";

export default function LearnDeFiPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const filteredChapters =
    selectedLevel === "all"
      ? defiChapters
      : defiChapters.filter(
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
            Master DeFi on Arbitrum
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            From absolute beginner to DeFi expert. Learn through interactive
            lessons, hands-on practice, and real-world projects on Arbitrum.
          </motion.p>

          {/* Key Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-blue-600">$2.5B+</div>
              <div className="text-sm text-gray-300">
                TVL on Arbitrum
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-green-600">6</div>
              <div className="text-sm text-gray-300">
                Complete Chapters
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-300">
                Interactive Lessons
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-orange-600">NFT</div>
              <div className="text-sm text-gray-300">
                Badges Earned
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <ProgressOverview />

        {/* Filter Controls */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {["all", "beginner", "intermediate", "advanced"].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${selectedLevel === level
                ? "bg-blue-600 text-white shadow-lg"
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
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>

        {/* Learning Path Info */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-[#825291] to-[#614793] rounded-2xl p-8 text-white text-center"
          // className="mt-16 bg-gradient-to-r from-[#010229] to-[#01056b] rounded-2xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Recommended Learning Path</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Follow our structured path from DeFi fundamentals to building your
            own applications. Each chapter builds upon the previous one,
            ensuring a solid foundation.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {defiChapters.map((chapter, index) => (
              <div key={chapter.id} className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full text-sm font-bold text-black">
                  {index + 1}
                </div>
                {index < defiChapters.length - 1 && (
                  <div className="w-8 h-0.5 bg-white bg-opacity-30 mx-2" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Featured Protocols */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Protocols You'll Master
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Uniswap", logo: "🦄" },
              { name: "SushiSwap", logo: "🍣" },
              { name: "GMX", logo: "⚡" },
              { name: "Camelot", logo: "🏰" },
              { name: "Beefy", logo: "🥩" },
              { name: "Yearn", logo: "🔷" },
            ].map((protocol) => (
              <div
                key={protocol.name}
                className="bg-slate-800 rounded-lg p-4 text-center shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="text-3xl mb-2">{protocol.logo}</div>
                <div className="font-semibold text-white">
                  {protocol.name}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

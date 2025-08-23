"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { web3BasicsChapters } from "../../../data/web3BasicsChapters";
import Web3BasicsChapterCard from "../../../components/web3-basics/Web3BasicsChapterCard";

export default function LearnWeb3BasicsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const filteredChapters =
    selectedLevel === "all"
      ? web3BasicsChapters
      : web3BasicsChapters.filter(
        (chapter) => chapter.level.toLowerCase() === selectedLevel
      );

  // Check which chapters are accessible
  const getChapterAccessibility = () => {
    return web3BasicsChapters.map((chapter, index) => {
      if (index === 0) return true; // First chapter always accessible

      // Check if previous chapter is completed
      const prevChapter = web3BasicsChapters[index - 1];
      const prevChapterSections = prevChapter.sections.filter(s => s.status === "available");
      const prevChapterProgress = localStorage.getItem(`web3-basics-progress-${prevChapter.id}`);
      const prevChapterCompleted = prevChapterProgress ? JSON.parse(prevChapterProgress) : [];

      return prevChapterSections.every(section =>
        prevChapterCompleted.includes(section.id)
      );
    });
  };

  const chapterAccessibility = getChapterAccessibility();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Master Web3 Basics
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Learn Web3 fundamentals through engaging stories and interactive lessons.
            From Web1 to Web3, wallets to NFTs - master the building blocks of the decentralized web.
          </motion.p>

          {/* Key Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">📖</div>
              <div className="text-sm text-gray-300">
                Story-Based Learning
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-cyan-400">8</div>
              <div className="text-sm text-gray-300">
                Complete Chapters
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">🎯</div>
              <div className="text-sm text-gray-300">
                Interactive Quizzes
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-orange-400">👛</div>
              <div className="text-sm text-gray-300">
                Hands-on Practice
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <motion.div
            className="bg-gray-800 rounded-2xl border border-gray-700 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              🌐 Your Web3 Learning Journey
            </h2>
            <p className="text-gray-300 mb-4">
              Track your progress as you master Web3 fundamentals through story-based learning
              and interactive challenges.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="text-2xl font-bold text-blue-400">0/8</div>
                <div className="text-sm text-blue-300">
                  Chapters Completed
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="text-2xl font-bold text-cyan-400">0</div>
                <div className="text-sm text-cyan-300">
                  Badges Earned
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="text-2xl font-bold text-green-400">0%</div>
                <div className="text-sm text-green-300">
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
          {["all", "beginner"].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${selectedLevel === level
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
                }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {filteredChapters.map((chapter, index) => {
            const originalIndex = web3BasicsChapters.findIndex(ch => ch.id === chapter.id);
            // console.log("chapter: ", originalIndex, chapter);
            const isAccessible = chapterAccessibility[originalIndex];

            return (
              <div key={chapter.id} className="relative">
                <Web3BasicsChapterCard
                  chapter={chapter}
                  basePath="/learn-web3-basics"
                />
                {!isAccessible && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🔒</div>
                      <p className="text-sm font-medium">Complete previous chapter</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Learning Path Info */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Learning Path</h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Learn Web3 fundamentals through engaging stories and interactive quizzes.
            Each chapter uses storytelling to make complex concepts simple and memorable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {web3BasicsChapters.map((chapter, index) => (
              <div key={chapter.id} className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-white text-black bg-opacity-20 rounded-full text-sm font-bold">
                  {index + 1}
                </div>
                {index < web3BasicsChapters.length - 1 && (
                  <div className="w-8 h-0.5 bg-white bg-opacity-30 mx-2" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Concepts */}
        <motion.div
          className="mt-16 bg-gray-800 rounded-2xl border border-gray-700 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Concepts You'll Master
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Web Evolution
              </h3>
              <p className="text-sm text-gray-300">
                From Web1 to Web3 - understand the evolution of the internet
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">👛</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Digital Wallets
              </h3>
              <p className="text-sm text-gray-300">
                Your gateway to Web3 - secure, self-custodial identity
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Cryptocurrency
              </h3>
              <p className="text-sm text-gray-300">
                Digital money that's scarce, programmable, and borderless
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🧱</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Blockchain
              </h3>
              <p className="text-sm text-gray-300">
                The unbreakable chain of digital truth and trust
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Distributed Ledgers
              </h3>
              <p className="text-sm text-gray-300">
                Shared records without central authority or control
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Cryptographic Keys
              </h3>
              <p className="text-sm text-gray-300">
                The mathematical magic that secures your digital assets
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                NFTs
              </h3>
              <p className="text-sm text-gray-300">
                True digital ownership and provable scarcity
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                DeFi Trading
              </h3>
              <p className="text-sm text-gray-300">
                Decentralized finance and automated market makers
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
            Ready to Enter the Web3 World?
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Start your journey with our story-based approach that makes complex Web3 concepts
            simple, engaging, and memorable. No prior experience needed!
          </p>
          <motion.button
            onClick={() => {
              const firstChapter = document.getElementById(web3BasicsChapters[0].id);
              firstChapter?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Begin Your Web3 Journey →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

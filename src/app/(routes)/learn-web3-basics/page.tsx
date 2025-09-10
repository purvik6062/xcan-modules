"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { web3BasicsChapters } from "../../../data/web3BasicsChapters";
import Web3BasicsChapterCard from "../../../components/web3-basics/Web3BasicsChapterCard";
import { useWalletProtection } from "../../../hooks/useWalletProtection";
import { useMint } from "../../../hooks/useMint";
import toast from "react-hot-toast";

export default function LearnWeb3BasicsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [progressData, setProgressData] = useState<{ [chapterId: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const { address, isReady } = useWalletProtection();
  const { certificationMint, isCertificationMinting } = useMint();
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  const filteredChapters =
    selectedLevel === "all"
      ? web3BasicsChapters
      : web3BasicsChapters.filter(
        (chapter) => chapter.level.toLowerCase() === selectedLevel
      );

  // Fetch progress data
  useEffect(() => {
    const fetchProgress = async () => {
      if (!isReady || !address) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const params = new URLSearchParams({ userAddress: address });
        const res = await fetch(`/api/challenges?${params.toString()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProgressData(data?.chapters || {});
          try {
            const claimRes = await fetch(`/api/certification/claim/web3-basics?${params.toString()}`, { cache: "no-store" });
            if (claimRes.ok) {
              const claim = await claimRes.json();
              setAlreadyClaimed(Boolean(claim?.claimed));
            }
          } catch { }
        }
      } catch (e) {
        console.error("Failed to fetch progress", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [isReady, address]);

  // Calculate overall progress
  const calculateOverallProgress = () => {
    let totalSections = 0;
    let completedSections = 0;

    web3BasicsChapters.forEach(chapter => {
      const availableSections = chapter.sections.filter(s => s.status === "available");
      totalSections += availableSections.length;
      const chapterCompleted = progressData[chapter.id] || [];
      completedSections += chapterCompleted.length;
    });

    return {
      total: totalSections,
      completed: completedSections,
      percentage: totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0
    };
  };

  const overallProgress = calculateOverallProgress();

  const claimNFT = async () => {
    try {
      if (!address) {
        toast.error("Connect your wallet first");
        return;
      }
      if (overallProgress.percentage !== 100) {
        toast.error("Complete all sections to claim certification");
        return;
      }
      const minted = await certificationMint("web3-basics");
      // await fetch("/api/certification/claim/web3-basics", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     userAddress: address,
      //     transactionHash: minted?.transactionHash,
      //     metadataUrl: minted?.metadataUrl,
      //     imageUrl: minted?.imageUrl,
      //   }),
      // });
      toast.success("Certification claimed!");
    } catch (_) {
      // errors already handled
    }
  }

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
              <div className="text-2xl font-bold text-cyan-400">{web3BasicsChapters.length}</div>
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

        {/* Progress Overview - Similar to the image */}
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

            {/* Overall Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-300">Progress</span>
                </div>
                <div className="text-sm text-gray-400">
                  {overallProgress.completed}/{overallProgress.total} sections {overallProgress.percentage}%
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress.percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="text-2xl font-bold text-blue-400">
                  {overallProgress.completed}/{overallProgress.total}
                </div>
                <div className="text-sm text-blue-300">
                  Sections Completed
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="text-2xl font-bold text-cyan-400">
                  {Object.keys(progressData).filter(chapterId => {
                    const chapter = web3BasicsChapters.find(ch => ch.id === chapterId);
                    if (!chapter) return false;
                    const availableSections = chapter.sections.filter(s => s.status === "available");
                    const completed = progressData[chapterId] || [];
                    return availableSections.every(s => completed.includes(s.id));
                  }).length}
                </div>
                <div className="text-sm text-cyan-300">
                  Chapters Completed
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="text-2xl font-bold text-green-400">{overallProgress.percentage}%</div>
                <div className="text-sm text-green-300">
                  Overall Progress
                </div>
              </div>
            </div>
          </motion.div>
          <div className="flex flex-col items-center mt-6 space-y-4 w-full bg-[#0B1326]/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            {/* Explanatory Text */}
            <div className="text-center w-full">
              {overallProgress.percentage !== 100 ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Complete all sections to unlock your certificate
                  </h3>
                </div>
              ) : alreadyClaimed ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-semibold">Certification claimed — check your wallet</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your NFT certification has been minted to your wallet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Ready to claim</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Great work—everything’s complete. Claim your NFT certification now.
                  </p>
                </div>
              )}
            </div>

            {/* Claim Button */}
            <button
              onClick={claimNFT}
              disabled={overallProgress.percentage !== 100 || isCertificationMinting || alreadyClaimed}
              className={`${alreadyClaimed
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700 cursor-default"
                : overallProgress.percentage === 100 && !isCertificationMinting
                  ? "bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-600 hover:via-sky-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-cyan-500/20 ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transform hover:scale-[1.03] active:scale-[0.98]"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border border-gray-400/30 dark:border-gray-600/40"
                } px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2`}
            >
              {alreadyClaimed ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Certification Claimed</span>
                </>
              ) : isCertificationMinting ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Claiming...</span>
                </>
              ) : overallProgress.percentage === 100 ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11l7-5 7 5V7l-7-5z" clipRule="evenodd" />
                  </svg>
                  <span>Claim NFT Certification</span>
                </>
              ) : (
                <span>Complete All Challenges</span>
              )}
            </button>

            {/* Additional Info for Claimed State */}
            {/* {alreadyClaimed && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11l7-5 7 5V7l-7-5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      Your achievement is now onchain
                    </p>
                    <p className="text-green-700 dark:text-green-300 mt-1">
                      This NFT is permanent proof of completion
                    </p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
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
          {filteredChapters.map((chapter) => (
            <div key={chapter.id}>
              <Web3BasicsChapterCard
                chapter={chapter}
                basePath="/learn-web3-basics"
                progressData={progressData[chapter.id] || []}
                isLoading={isLoading}
              />
            </div>
          ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Web3 Fundamentals
              </h3>
              <p className="text-sm text-gray-300">
                Web evolution, digital wallets, and cryptocurrency basics
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🧱</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Blockchain & DeFi
              </h3>
              <p className="text-sm text-gray-300">
                Blockchain technology, distributed ledgers, and DeFi concepts
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🦀</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Rust & Advanced Web3
              </h3>
              <p className="text-sm text-gray-300">
                Rust programming and advanced Web3 concepts like NFTs
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

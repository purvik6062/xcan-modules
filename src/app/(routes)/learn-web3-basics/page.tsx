"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { web3BasicsChapters } from "../../../data/web3BasicsChapters";
import Web3BasicsChapterCard from "../../../components/web3-basics/Web3BasicsChapterCard";
import { useWalletProtection } from "../../../hooks/useWalletProtection";
import { useMint } from "../../../hooks/useMint";
import toast from "react-hot-toast";
import PromoCodeModal from "@/components/PromoCodeModal";
import ConnectWallet from "@/components/ConnectWallet";
import { MODULE_THEME_BG_R } from "@/theme/moduleTheme";

export default function LearnWeb3BasicsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [progressData, setProgressData] = useState<{ [chapterId: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const { address, isReady } = useWalletProtection();
  const { certificationMint, isCertificationMinting } = useMint();
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [isClaimStatusLoading, setIsClaimStatusLoading] = useState(true);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

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
        setIsClaimStatusLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setIsClaimStatusLoading(true);
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
        setIsClaimStatusLoading(false);
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
      const response = await fetch("/api/certification/claim/web3-basics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: address,
          transactionHash: minted?.transactionHash,
          metadataUrl: minted?.metadataUrl,
          imageUrl: minted?.imageUrl,
        }),
      });
      if (response.ok) {
        setAlreadyClaimed(true);
      }
      // toast.success("Certification claimed!");
    } catch (_) {
      // errors already handled
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <motion.h1
            className="mb-3 bg-gradient-to-r from-[#79A5FF] via-[#4A7CFF] to-[#1E3A8A] bg-clip-text text-3xl font-bold text-transparent sm:mb-4 sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Master Web3 & Rust Foundations
          </motion.h1>
          <motion.p
            className="mx-auto mb-6 max-w-3xl px-1 text-base text-gray-300 sm:mb-8 sm:text-lg lg:text-xl"
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
            <div className="bg-slate-800/90 rounded-lg p-4 border border-slate-700/80">
              <div className="text-2xl font-bold text-[#79A5FF]">📖</div>
              <div className="text-sm text-gray-300">
                Story-Based Learning
              </div>
            </div>
            <div className="bg-slate-800/90 rounded-lg p-4 border border-slate-700/80">
              <div className="text-2xl font-bold text-[#4A7CFF]">{web3BasicsChapters.length}</div>
              <div className="text-sm text-gray-300">
                Complete Chapters
              </div>
            </div>
            <div className="bg-slate-800/90 rounded-lg p-4 border border-slate-700/80">
              <div className="text-2xl font-bold text-[#79A5FF]">🎯</div>
              <div className="text-sm text-gray-300">
                Interactive Quizzes
              </div>
            </div>
            <div className="bg-slate-800/90 rounded-lg p-4 border border-slate-700/80">
              <div className="text-2xl font-bold text-[#4A7CFF]">👛</div>
              <div className="text-sm text-gray-300">
                Hands-on Practice
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Overview - Similar to the image */}
        <div className="mb-8">
          <motion.div
            className="bg-slate-800/95 rounded-2xl border border-slate-700/60 p-6"
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
                  <div className="h-2 w-2 rounded-full bg-[#79A5FF]"></div>
                  <span className="text-sm font-medium text-gray-300">Progress</span>
                </div>
                <div className="text-sm text-gray-400">
                  {overallProgress.completed}/{overallProgress.total} sections {overallProgress.percentage}%
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-700/80">
                <motion.div
                  className={`h-2 rounded-full ${MODULE_THEME_BG_R}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress.percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1E3A8A]/20 rounded-lg p-4 border border-[#4A7CFF]/30">
                <div className="text-2xl font-bold text-[#79A5FF]">
                  {overallProgress.completed}/{overallProgress.total}
                </div>
                <div className="text-sm text-[#b7cbff]">
                  Sections Completed
                </div>
              </div>
              <div className="bg-[#1E3A8A]/20 rounded-lg p-4 border border-[#4A7CFF]/30">
                <div className="text-2xl font-bold text-[#79A5FF]">
                  {Object.keys(progressData).filter(chapterId => {
                    const chapter = web3BasicsChapters.find(ch => ch.id === chapterId);
                    if (!chapter) return false;
                    const availableSections = chapter.sections.filter(s => s.status === "available");
                    const completed = progressData[chapterId] || [];
                    return availableSections.every(s => completed.includes(s.id));
                  }).length}
                </div>
                <div className="text-sm text-[#b7cbff]">
                  Chapters Completed
                </div>
              </div>
              <div className="bg-[#1E3A8A]/20 rounded-lg p-4 border border-[#4A7CFF]/30">
                <div className="text-2xl font-bold text-[#79A5FF]">{overallProgress.percentage}%</div>
                <div className="text-sm text-[#b7cbff]">
                  Overall Progress
                </div>
              </div>
            </div>
          </motion.div>
          {!address && (
            <div className="flex flex-col items-center mt-6 space-y-4 w-full bg-[#0B1326]/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              {/* Explanatory Text */}
              <div className="text-center w-full">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-400 dark:text-gray-200">
                    Connect your wallet to see your NFT certification status.
                  </h3>
                  <ConnectWallet />
                </div>
                {/* ) 
              : isClaimStatusLoading ? (
                <div className="flex items-center justify-center space-x-2 text-gray-400 mb-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <h3 className="text-lg font-semibold">Checking certification status...</h3>
                </div>
              ) : overallProgress.percentage !== 100 ? (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-400 dark:text-gray-200">
                    Complete all sections to unlock your certificate
                  </h3>
                </div>
              ) : alreadyClaimed ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-[#79A5FF]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-semibold">Certification claimed — check your wallet</h3>
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-400">
                    Your NFT certification has been minted to your wallet.
                  </p>
                </div>
              ) : ( 
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#79A5FF]">Ready to claim</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400">
                    Great work—everything’s complete. Claim your NFT certification now.
                  </p>
                </div> */}
              </div>


              {/* Claim Button - only show when wallet connected */}
              {/* {address && (
              <button
                // onClick={claimNFT}
                onClick={() => setIsPromoOpen(true)}
                disabled={isClaimStatusLoading || overallProgress.percentage !== 100 || isCertificationMinting || alreadyClaimed}
                className={`${alreadyClaimed
                  ? "bg-[#1E3A8A]/30 text-[#b7cbff] border-2 border-[#4A7CFF]/40 cursor-default"
                  : overallProgress.percentage === 100 && !isCertificationMinting && !isClaimStatusLoading
                    ? `cursor-pointer ${MODULE_THEME_BG_R} hover:brightness-110 text-white shadow-md shadow-[#4A7CFF]/15 ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#79A5FF]/60 transform hover:scale-[1.02] active:scale-[0.98]`
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border border-gray-400/30 dark:border-gray-600/40"
                  } px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2`}
              >
                {isClaimStatusLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Checking...</span>
                  </div>
                ) : alreadyClaimed ? (
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
            )} */}
            </div>
          )}
        </div>

        {/* Filter Controls */}
        <motion.div
          className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {["all", "beginner", "intermediate", "advanced"].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm transition-all duration-200 sm:px-6 sm:text-base ${selectedLevel === level
                ? `${MODULE_THEME_BG_R} text-white shadow-md shadow-[#4A7CFF]/15 ring-1 ring-white/10`
                : "bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-[#79A5FF] border border-slate-600"
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
                ctaTheme="blue"
              />
            </div>
          ))}
        </div>

        {/* Learning Path Info */}
        <motion.div
          className="mt-12 rounded-2xl border border-slate-600/50 bg-gradient-to-b from-slate-800/90 to-slate-900/95 p-4 text-center text-white shadow-xl shadow-black/25 ring-1 ring-white/5 sm:mt-16 sm:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">Learning Path</h2>
          <p className="mx-auto mb-6 max-w-3xl text-base text-gray-300 sm:text-lg">
            Learn Web3 fundamentals through engaging stories and interactive quizzes.
            Each chapter uses storytelling to make complex concepts simple and memorable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {web3BasicsChapters.map((chapter, index) => (
              <div key={chapter.id} className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/90 text-sm font-semibold text-white ring-1 ring-slate-500/40">
                  {index + 1}
                </div>
                {index < web3BasicsChapters.length - 1 && (
                  <div className="mx-2 h-0.5 w-8 bg-slate-600/60" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Concepts */}
        <motion.div
          className="mt-12 rounded-2xl border border-slate-700/60 bg-slate-800/95 p-4 sm:mt-16 sm:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="mb-4 text-center text-2xl font-bold text-white sm:mb-6 sm:text-3xl">
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
      </div>
      <PromoCodeModal
        isOpen={isPromoOpen}
        onClose={() => setIsPromoOpen(false)}
        onMint={claimNFT}
        address={address}
      />
    </div>
  );
}

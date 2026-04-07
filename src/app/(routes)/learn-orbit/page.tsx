"use client";

import { useEffect, useMemo, useState } from "react";
// import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { orbitChapters } from "../../../data/orbitChapters";
import ChapterCard from "../../../components/ChapterCard";
import ProgressOverview from "../../../components/ProgressOverview";
import { useWalletProtection } from "../../../hooks/useWalletProtection";
import { useMint } from "../../../hooks/useMint";
import PromoCodeModal from "../../../components/PromoCodeModal";
import ConnectWallet from "@/components/ConnectWallet";
import { MODULE_THEME_BG_R } from "@/theme/moduleTheme";

export default function LearnOrbitPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { address, isReady } = useWalletProtection();
  const [chapterProgress, setChapterProgress] = useState<Record<string, { completed: number; total: number }>>({});
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);
  const { certificationMint, isCertificationMinting } = useMint();
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [isClaimStatusLoading, setIsClaimStatusLoading] = useState(true);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  // Aggregate totals across all chapters
  const overall = useMemo(() => {
    const values = Object.values(chapterProgress);
    const total = values.reduce((sum, v) => sum + (v?.total ?? 0), 0);
    const completed = values.reduce((sum, v) => sum + (v?.completed ?? 0), 0);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [chapterProgress]);

  const totalsByChapter = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const chapter of orbitChapters) {
      totals[chapter.id] = chapter.sections.filter((s) => s.status === "available").length;
    }
    return totals;
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!isReady || !address) {
        setIsClaimStatusLoading(false);
        return;
      }
      try {
        setIsClaimStatusLoading(true);
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
        setIsModuleCompleted(Boolean(data?.isCompleted));
        // If backend marks module as completed and optionally returns certificate status, set claimed
        if (data?.isCertificationClaimed) setAlreadyClaimed(true);
      } catch (e) {
        console.error("learn-orbit: failed to fetch progress", e);
      } finally {
        setIsClaimStatusLoading(false);
      }
    };
    load();
  }, [address, isReady, totalsByChapter]);

  // Celebrate when entire module completed
  // useEffect(() => {
  //   if (isModuleCompleted) {
  //     confetti({ particleCount: 160, spread: 70, origin: { y: 0.6 } });
  //   }
  // }, [isModuleCompleted]);

  const filteredChapters =
    selectedLevel === "all"
      ? orbitChapters
      : orbitChapters.filter(
        (chapter) => chapter.level.toLowerCase() === selectedLevel
      );

  const claimNFT = async () => {
    try {
      const minted = await certificationMint("arbitrum-orbit");
      const response = await fetch("/api/certification/claim/arbitrum-orbit", {
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
    } catch { }
  };

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
            Master Arbitrum Orbit
          </motion.h1>
          <motion.p
            className="mx-auto mb-6 max-w-3xl px-1 text-base text-gray-300 sm:mb-8 sm:text-lg lg:text-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Configure, deploy, test, and operate your own Orbit L3. This module is
            theory and quiz driven with code walkthroughs where helpful, aligned to
            the exact chapters and sections below.
          </motion.p>

          {/* Key Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-lg border border-slate-700/80 bg-slate-800/90 p-4 shadow-lg">
              <div className="text-2xl font-bold text-[#79A5FF]">L3</div>
              <div className="text-sm text-gray-300">
                Custom Chains
              </div>
            </div>
            <div className="rounded-lg border border-slate-700/80 bg-slate-800/90 p-4 shadow-lg">
              <div className="text-2xl font-bold text-[#4A7CFF]">7</div>
              <div className="text-sm text-gray-300">
                Complete Chapters
              </div>
            </div>
            <div className="rounded-lg border border-slate-700/80 bg-slate-800/90 p-4 shadow-lg">
              <div className="text-2xl font-bold text-[#79A5FF]">{overall.total}</div>
              <div className="text-sm text-gray-300">
                Total Sections
              </div>
            </div>
            <div className="rounded-lg border border-slate-700/80 bg-slate-800/90 p-4 shadow-lg">
              <div className="text-2xl font-bold text-[#4A7CFF]">SDK</div>
              <div className="text-sm text-gray-300">
                Orbit Integration
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <motion.div
            className="rounded-2xl border border-slate-700/60 bg-slate-800/95 p-6 shadow-xl"
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
              <div className="rounded-lg bg-[#1E3A8A]/20 p-4 ring-1 ring-[#4A7CFF]/25">
                <div className="text-2xl font-bold text-[#79A5FF]">{overall.completed}/{overall.total}</div>
                <div className="text-sm text-[#b7cbff]">
                  Sections Completed
                </div>
              </div>
              <div className="rounded-lg bg-[#1E3A8A]/20 p-4 ring-1 ring-[#4A7CFF]/25">
                <div className="text-2xl font-bold text-[#79A5FF]">{Object.values(chapterProgress).filter(v => v.total > 0 && v.completed === v.total).length}</div>
                <div className="text-sm text-[#b7cbff]">
                  Badges Earned
                </div>
              </div>
              <div className="rounded-lg bg-[#1E3A8A]/20 p-4 ring-1 ring-[#4A7CFF]/25">
                <div className="text-2xl font-bold text-[#79A5FF]">{overall.percent}%</div>
                <div className="text-sm text-[#b7cbff]">
                  Overall Progress
                </div>
              </div>
            </div>
            {/* Claim Certification */}
            <div className="flex flex-col items-center mt-6 space-y-4 w-full bg-[#0B1326]/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="text-center w-full">
                {!address ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-400">
                      Connect your wallet to see your NFT certification status.
                    </h3>
                    <ConnectWallet />
                  </div>
                ) : isClaimStatusLoading ? (
                  <div className="flex items-center justify-center space-x-2 text-gray-400 mb-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h3 className="text-lg font-semibold">Checking certification status...</h3>
                  </div>
                ) : !isModuleCompleted ? (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-400">
                      Complete the first chapter to unlock your certificate
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
                    <p className="text-sm text-gray-400">
                      Your NFT certification has been minted to your wallet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[#79A5FF]">Ready to claim</h3>
                    <p className="text-sm text-gray-400">
                      Great work—everything's complete. Claim your NFT certification now.
                    </p>
                  </div>
                )}
              </div>
              {address && (
              <button
                onClick={() => setIsPromoOpen(true)}
                disabled={isClaimStatusLoading || !isModuleCompleted || isCertificationMinting || alreadyClaimed}
                className={`${alreadyClaimed
                  ? "bg-[#1E3A8A]/30 text-[#b7cbff] border-2 border-[#4A7CFF]/40 cursor-default"
                  : isModuleCompleted && !isCertificationMinting && !isClaimStatusLoading
                    ? `cursor-pointer ${MODULE_THEME_BG_R} hover:brightness-110 text-white shadow-lg hover:shadow-[#4A7CFF]/20 ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#79A5FF]/60 transform hover:scale-[1.03] active:scale-[0.98]`
                    : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400/30"
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
                ) : isModuleCompleted ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11l7-5 7 5V7l-7-5z" clipRule="evenodd" />
                    </svg>
                    <span>Claim NFT Certification</span>
                  </>
                ) : (
                  <span>Complete First Chapter</span>
                )}
              </button>
              )}

            </div>
          </motion.div>
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
                ? `${MODULE_THEME_BG_R} text-white shadow-lg shadow-[#4A7CFF]/15 ring-1 ring-white/10`
                : "bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-[#79A5FF]"
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
          className="mt-12 rounded-2xl border border-slate-600/50 bg-gradient-to-b from-slate-800/90 to-slate-900/95 p-4 text-center text-white shadow-xl shadow-black/25 ring-1 ring-white/5 sm:mt-16 sm:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">Recommended Learning Path</h2>
          <p className="mx-auto mb-6 max-w-3xl text-base text-gray-300 sm:text-lg">
            Follow the sequence: Introduction → Configuration → Deployment → Testing → Advanced Features → Production.
            Each chapter offers theory, checklists, and targeted quizzes that mirror the data in this module.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {orbitChapters.map((chapter, index) => (
              <div key={chapter.id} className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/90 text-sm font-semibold text-white ring-1 ring-slate-500/40">
                  {index + 1}
                </div>
                {index < orbitChapters.length - 1 && (
                  <div className="mx-2 h-0.5 w-8 bg-slate-600/60" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Featured Technologies */}
        <motion.div
          className="mt-12 rounded-2xl border border-slate-700/60 bg-slate-800/95 p-4 shadow-xl sm:mt-16 sm:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="mb-4 text-center text-2xl font-bold text-white sm:mb-6 sm:text-3xl">
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

      </div>
      <PromoCodeModal
        isOpen={isPromoOpen}
        onClose={() => setIsPromoOpen(false)}
        onMint={claimNFT}
      />
    </div>
  );
} 
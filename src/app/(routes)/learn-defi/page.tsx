"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { defiChapters } from "../../../data/defiChapters";
import ChapterCard from "../../../components/ChapterCard";
import ProgressOverview from "../../../components/ProgressOverview";
import { useWalletProtection } from "../../../hooks/useWalletProtection";
import { useMint } from "../../../hooks/useMint";
import PromoCodeModal from "../../../components/PromoCodeModal";
import toast from "react-hot-toast";

export default function LearnDeFiPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const { address, isReady } = useWalletProtection();
  const [chapterProgress, setChapterProgress] = useState<Record<string, { completed: number; total: number }>>({});
  const { certificationMint, isCertificationMinting } = useMint();
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  const overall = useMemo(() => {
    const values = Object.values(chapterProgress);
    const total = values.reduce((sum, v) => sum + (v?.total ?? 0), 0);
    const completed = values.reduce((sum, v) => sum + (v?.completed ?? 0), 0);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [chapterProgress]);

  const totalsByChapter = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const chapter of defiChapters) {
      totals[chapter.id] = chapter.sections.filter((s) => s.status === "available").length;
    }
    return totals;
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!isReady || !address) return;
      try {
        const params = new URLSearchParams({ userAddress: address, module: "master-defi" });
        const res = await fetch(`/api/challenges?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const chaptersMap: Record<string, string[]> = data?.chapters || {};
        const progressByChapter: Record<string, { totalSections: number; completedSectionIds: string[] }> = data?.progressByChapter || {};
        const next: Record<string, { completed: number; total: number }> = {};
        for (const ch of defiChapters) {
          const done = chaptersMap[ch.id] || progressByChapter[ch.id]?.completedSectionIds || [];
          const total = progressByChapter[ch.id]?.totalSections ?? totalsByChapter[ch.id] ?? 0;
          next[ch.id] = { completed: done.length, total };
        }
        setChapterProgress(next);
        if (data?.isCertificationClaimed) setAlreadyClaimed(true);
      } catch (e) {
        console.error("learn-defi: failed to fetch progress", e);
      }
    };
    load();
  }, [address, isReady, totalsByChapter]);

  const filteredChapters =
    selectedLevel === "all"
      ? defiChapters
      : defiChapters.filter(
        (chapter) => chapter.level.toLowerCase() === selectedLevel
      );

  const claimNFT = async () => {
    try {
        if (!address) {
          toast.error("Connect your wallet first");
          return;
        }
        if (overall.percent !== 100) {
          toast.error("Complete all challenges to claim certification");
          return;
        }
        const minted = await certificationMint("defi-arbitrum");
        const response = await fetch("/api/certification/claim/defi-arbitrum", {
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
              Learn DeFi on Arbitrum through theory and quizzes aligned to six chapters:
              Introduction → DEXs → Vaults & Yield → Risks & Security → AI & DeFi → Build a DeFi App.
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
                <div className="text-2xl font-bold text-blue-600">50+</div>
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
          <div className="mb-8">
            <motion.div
              className="bg-slate-800 rounded-2xl shadow-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                🚀 Your DeFi Learning Journey
              </h2>
              <p className="text-gray-300 mb-4">
                Track your progress across all chapters as you master DeFi on Arbitrum.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{overall.completed}/{overall.total}</div>
                  <div className="text-sm text-blue-300">Sections Completed</div>
                </div>
                <div className="bg-indigo-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-400">{Object.values(chapterProgress).filter(v => v.total > 0 && v.completed === v.total).length}</div>
                  <div className="text-sm text-indigo-300">Badges Earned</div>
                </div>
                <div className="bg-blue-900/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">{overall.percent}%</div>
                  <div className="text-sm text-blue-300">Overall Progress</div>
                </div>
              </div>

              {/* Claim Certification */}
              <div className="flex flex-col items-center mt-6 space-y-4 w-full bg-[#0B1326]/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                <div className="text-center w-full">
                  {overall.percent !== 100 ? (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-400">
                        Complete all sections to unlock your certificate
                      </h3>
                    </div>
                  ) : alreadyClaimed ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-green-600">
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
                      <h3 className="text-lg font-semibold text-green-400">Ready to claim</h3>
                      <p className="text-sm text-gray-400">
                        Great work—everything's complete. Claim your NFT certification now.
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsPromoOpen(true)}
                  disabled={overall.percent !== 100 || isCertificationMinting || alreadyClaimed}
                  className={`${alreadyClaimed
                    ? "bg-green-100 text-green-700 border-2 border-green-300 cursor-default"
                    : overall.percent === 100 && !isCertificationMinting
                      ? "cursor-pointer bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-600 hover:via-cyan-500 hover:to-blue-500 text-white shadow-lg ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transform hover:scale-[1.03] active:scale-[0.98]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400/30"
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
                  ) : overall.percent === 100 ? (
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
              </div>
            </motion.div>
          </div>

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
              <ChapterCard key={chapter.id} chapter={chapter} progress={chapterProgress[chapter.id]} />
            ))}
          </div>

          {/* Learning Path Info */}
          <motion.div
            className="mt-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Recommended Learning Path</h2>
            <p className="text-lg mb-6 max-w-3xl mx-auto">
              Follow the sequence: fundamentals, decentralized exchanges, vaults & yield,
              risks & security, AI integrations, then assemble a minimal dApp. Each chapter’s
              story and quiz content maps directly to the curriculum data.
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
                { name: "Aave", logo: "🏦" },
                { name: "Compound", logo: "🏛️" },
                { name: "Curve", logo: "💧" },
                { name: "Balancer", logo: "⚖️" },
                { name: "Yearn", logo: "🔷" },
                { name: "Beefy", logo: "🥩" },
                { name: "Radiant", logo: "✨" },
                { name: "Arbitrum Bridge", logo: "🌉" },
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
        <PromoCodeModal
          isOpen={isPromoOpen}
          onClose={() => setIsPromoOpen(false)}
          onMint={claimNFT}
        />
      </div>
    );
  }

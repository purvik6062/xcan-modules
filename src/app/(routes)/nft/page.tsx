"use client";

import { useEligibility } from "@/hooks/useEligibility";
import { useMintedStatus } from "@/hooks/useMintedStatus";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/nft/GlassCard";
import { FloatingParticles } from "@/components/nft/FloatingParticles";
import { MintedNFTDisplay } from "@/components/nft/MintedNFTDisplay";
import { SuccessfulMint } from "@/components/nft/SuccessfulMint";
import { useRouter } from "next/navigation";
import { useWalletProtection } from "@/hooks/useWalletProtection";
import {
  Wallet,
  Shield,
  Zap,
  Trophy,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  Loader2,
  Crown,
  Gem,
  Star,
  ChevronRight,
  Award,
  Target,
  Rocket,
} from "lucide-react";
import { useMint } from "@/hooks/useMint";
import { CertificationLevels } from "@/components/nft/CertificationLevels";

export default function HomePage() {
  const { handleMint, isMinting, isMined, mintedNFT } = useMint();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const { isReady, isLoading, address: userAddress, isWalletConnected } = useWalletProtection();
  const router = useRouter();

  // Redirect to NFT page when minting is successful
  useEffect(() => {
    if (isMined && selectedLevel) {
      router.push(`/nft/${selectedLevel}?justMinted=true`);
    }
  }, [isMined, selectedLevel, router]);
  const {
    data: eligibility,
    isLoading: isCheckingEligibility,
    error,
  } = useEligibility(userAddress || null);

  const {
    hasMinted,
    nft: existingNFT,
    nfts: mintedNFTs,
    totalMinted,
    isLoading: isCheckingMinted,
    refetch: refetchMintedStatus,
  } = useMintedStatus(userAddress || null);

  const handleMintLevel = async (levelKey: string, levelName: string, level: number) => {
    setSelectedLevel(levelKey);
    await handleMint(eligibility?.githubUsername, levelName, level, levelKey);
  };

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />

        {/* Subtle background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative mb-8">
            <motion.div
              className="w-24 h-24 mx-auto relative"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-lg"></div>
              <div className="relative w-full h-full bg-gradient-to-r from-blue-500/80 to-indigo-500/80 rounded-full flex items-center justify-center">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <motion.div
              className="absolute inset-0 w-24 h-24 mx-auto"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="w-full h-full border-4 border-blue-400/20 rounded-full"></div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-slate-300 bg-clip-text text-transparent mb-4">
              Speedrun Portal
            </h1>
            <motion.p
              className="text-xl text-slate-300 font-medium"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              Initializing your journey...
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] relative overflow-hidden">
      <FloatingParticles />

      {/* Subtle gradient orbs matching the theme */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/5 via-indigo-500/3 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-indigo-500/5 via-blue-500/3 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-gray-500/3 to-blue-500/3 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Enhanced Header with softer colors */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-4 mb-8"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="relative"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400/80 to-orange-400/80 rounded-full flex items-center justify-center relative">
                <Crown className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl animate-pulse"></div>
              </div>
            </motion.div>

            <div className="text-center">
              <h1 className="text-7xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-gray-300 bg-clip-text text-transparent tracking-tight">
                Speedrun Stylus
              </h1>
              <motion.div
                className="h-1 bg-gradient-to-r from-blue-500/60 via-indigo-500/60 to-gray-500/60 rounded-full mt-2"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>

            <motion.div
              className="relative"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: 2,
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400/80 to-blue-400/80 rounded-full flex items-center justify-center relative">
                <Gem className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              Multi-Level NFT Badge Collection
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Complete challenges across 7 different certification levels and mint your
              exclusive{" "}
              <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded-lg">
                Achievement Badges
              </span>{" "}
              on Arbitrum Sepolia! Each level unlocks a unique NFT badge.
            </p>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {!isWalletConnected ? (
              <motion.div
                key="connect"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="p-16 text-center max-w-3xl mx-auto">
                  <motion.div
                    className="mb-12"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative inline-block">
                      <motion.div
                        className="w-32 h-32 bg-gradient-to-br from-blue-500/80 via-indigo-500/80 to-slate-500/80 rounded-3xl flex items-center justify-center mx-auto mb-8 relative"
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(59, 130, 246, 0.2)",
                            "0 0 0 20px rgba(59, 130, 246, 0)",
                            "0 0 0 0 rgba(59, 130, 246, 0)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Wallet className="w-16 h-16 text-white" />
                      </motion.div>

                      <motion.div
                        className="absolute -top-4 -right-4"
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Sparkles className="w-12 h-12 text-amber-300" />
                      </motion.div>

                      <motion.div
                        className="absolute -bottom-4 -left-4"
                        animate={{ rotate: -360, scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Shield className="w-10 h-10 text-emerald-400" />
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-5xl font-bold text-white mb-6">
                      Connect Your Wallet
                    </h2>
                    <p className="text-gray-300 text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
                      Connect your wallet to check your Speedrun Stylus challenge
                      completion status and mint your achievement badge
                    </p>

                    <motion.p
                      className="text-sm text-gray-400 mt-8 flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Shield className="w-4 h-4" />
                      Secured by Privy • Arbitrum Sepolia Network
                    </motion.p>
                  </motion.div>
                </GlassCard>
              </motion.div>
            ) : (
              /* Authenticated User Section */
              <motion.div
                key="authenticated"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* User Info with softer colors */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <GlassCard className="p-8">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <motion.div
                          className="w-20 h-20 bg-gradient-to-br from-emerald-400/80 via-green-500/80 to-teal-500/80 rounded-2xl flex items-center justify-center relative"
                          whileHover={{ rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle className="w-10 h-10 text-white" />
                          <motion.div
                            className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-lg"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          />
                        </motion.div>

                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            Wallet Connected
                          </h3>
                          <p className="text-gray-300 font-mono text-lg bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
                            {userAddress
                              ? `${userAddress.slice(
                                0,
                                8
                              )}...${userAddress.slice(-6)}`
                              : "Loading..."}
                          </p>
                          <p className="text-sm text-gray-400 flex items-center gap-2 mt-2">
                            <Zap className="w-4 h-4" />
                            Arbitrum Sepolia Network
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Challenge Status */}
                <AnimatePresence mode="wait">
                  {isCheckingEligibility ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <GlassCard className="p-16 text-center">
                        <div className="flex items-center justify-center mb-8">
                          <motion.div
                            className="relative"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          >
                            <Loader2 className="w-16 h-16 text-blue-400" />
                            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-400/20 rounded-full animate-pulse"></div>
                          </motion.div>
                          <motion.div
                            className="ml-6"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          >
                            <Target className="w-12 h-12 text-indigo-400" />
                          </motion.div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4">
                          Analyzing Your Achievements
                        </h3>
                        <p className="text-gray-300 text-lg">
                          Scanning blockchain for completed challenges...
                        </p>
                      </GlassCard>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <GlassCard className="p-12 border-red-500/30">
                        <div className="text-center">
                          <motion.div
                            className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          >
                            <Clock className="w-10 h-10 text-red-400" />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-red-300 mb-4">
                            Connection Error
                          </h3>
                          <p className="text-red-200 text-lg">
                            Failed to check eligibility. Please try again.
                          </p>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ) : eligibility ? (
                    <motion.div
                      key="eligibility"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-8"
                    >
                      {/* Overall Progress Summary */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <GlassCard className="p-10">
                          <div className="flex items-center gap-6 mb-10">
                            <motion.div
                              className="w-16 h-16 bg-gradient-to-br from-blue-500/80 to-indigo-500/80 rounded-2xl flex items-center justify-center relative"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.8 }}
                            >
                              <Award className="w-8 h-8 text-white" />
                              <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-lg animate-pulse"></div>
                            </motion.div>
                            <div>
                              <h3 className="text-4xl font-bold text-white mb-2">
                                Your Achievement Overview
                              </h3>
                              <p className="text-gray-300 text-lg">
                                Complete challenges across all levels to unlock rewards
                              </p>
                            </div>
                          </div>

                          {/* Total Progress */}
                          <div className="bg-gradient-to-r from-blue-500/8 via-indigo-500/8 to-gray-500/8 border border-blue-400/20 rounded-3xl p-8 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex items-center justify-between">
                                <h4 className="text-2xl font-bold text-white flex items-center gap-3">
                                  <Zap className="w-6 h-6 text-blue-400" />
                                  Total Challenges Completed
                                </h4>
                                <motion.span
                                  className="text-4xl font-black text-blue-400"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    delay: 0.5,
                                    type: "spring",
                                    stiffness: 200,
                                  }}
                                >
                                  {eligibility.totalCompletedChallenges}
                                </motion.span>
                              </div>
                              <div className="flex items-center justify-between">
                                <h4 className="text-2xl font-bold text-white flex items-center gap-3">
                                  <Trophy className="w-6 h-6 text-amber-400" />
                                  NFTs Minted
                                </h4>
                                <motion.span
                                  className="text-4xl font-black text-amber-400"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    delay: 0.7,
                                    type: "spring",
                                    stiffness: 200,
                                  }}
                                >
                                  {totalMinted}
                                </motion.span>
                              </div>
                            </div>
                            <p className="text-gray-300 text-lg mt-4">
                              Great work! You&apos;ve completed{" "}
                              {eligibility.totalCompletedChallenges} challenge
                              {eligibility.totalCompletedChallenges !== 1
                                ? "s"
                                : ""}{" "}
                              and minted {totalMinted} NFT{totalMinted !== 1 ? "s" : ""} on Speedrun Stylus.
                            </p>
                          </div>

                          {/* Levels Overview */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {eligibility.certificationLevels.map((level) => {
                              const hasMintedThisLevel = mintedNFTs.some(nft => nft.level === level.level);
                              return (
                                <motion.div
                                  key={level.levelKey}
                                  className={`border-2 rounded-2xl p-4 text-center ${hasMintedThisLevel
                                    ? "bg-gradient-to-r from-purple-500/8 to-pink-500/8 border-purple-400/40"
                                    : level.isEligible
                                      ? "bg-gradient-to-r from-emerald-500/8 to-green-500/8 border-emerald-400/40"
                                      : "bg-gradient-to-r from-slate-800/30 to-slate-700/30 border-slate-600/40"
                                    }`}
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <div className="text-2xl font-bold text-white mb-2">
                                    Level {level.level}
                                  </div>
                                  <div className="text-sm text-gray-300 mb-2">
                                    {level.completedRequiredChallenges}/{level.requiredChallenges}
                                  </div>
                                  <div className={`text-xs ${hasMintedThisLevel
                                    ? "text-purple-300"
                                    : level.isEligible
                                      ? "text-emerald-300"
                                      : "text-amber-300"
                                    }`}>
                                    {hasMintedThisLevel ? "Minted" : level.isEligible ? "Ready" : "In Progress"}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </GlassCard>
                      </motion.div>

                      {/* Certification Levels */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <GlassCard className="p-10">
                          <div className="flex items-center gap-6 mb-10">
                            <motion.div
                              className="w-16 h-16 bg-gradient-to-br from-indigo-500/80 to-blue-500/80 rounded-2xl flex items-center justify-center relative"
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Trophy className="w-8 h-8 text-white" />
                              <div className="absolute inset-0 bg-indigo-400/20 rounded-2xl blur-lg animate-pulse"></div>
                            </motion.div>
                            <div>
                              <h3 className="text-4xl font-bold text-white mb-2">
                                Certification Levels
                              </h3>
                              <p className="text-gray-300 text-lg">
                                Complete challenges for each level to mint your NFT badges
                              </p>
                            </div>
                          </div>

                          <CertificationLevels
                            certificationLevels={eligibility.certificationLevels}
                            onMint={handleMintLevel}
                            isMinting={isMinting}
                            selectedLevel={selectedLevel}
                            hasMinted={hasMinted}
                            isCheckingMinted={isCheckingMinted}
                            mintedNFTs={mintedNFTs}
                          />
                        </GlassCard>
                      </motion.div>


                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

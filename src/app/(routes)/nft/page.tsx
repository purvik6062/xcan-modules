"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/nft/GlassCard";
import { FloatingParticles } from "@/components/nft/FloatingParticles";
import { ModuleCard } from "@/components/nft/ModuleCard";
import { useRouter } from "next/navigation";
import { useWalletProtection } from "@/hooks/useWalletProtection";
import { useChainId, useSwitchChain } from "wagmi";
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
  AlertTriangle,
  RefreshCw,
  BookOpen,
  Code,
  Cpu,
  GraduationCap,
  RocketIcon,
  Link,
  EyeIcon,
} from "lucide-react";
import { nftModules } from "@/data/nftModules";
import { XcanAdvocateHighlight } from "@/components/nft/XcanAdvocateHighlight";

// Arbitrum Sepolia Chain ID
const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

export default function HomePage() {
  const { isReady, isLoading, address: userAddress, isWalletConnected } = useWalletProtection();
  const router = useRouter();

  // Chain management hooks
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const isCorrectNetwork = chainId === ARBITRUM_SEPOLIA_CHAIN_ID;

  const handleSwitchNetwork = () => {
    switchChain({ chainId: ARBITRUM_SEPOLIA_CHAIN_ID });
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return "Ethereum Mainnet";
      case 5:
        return "Goerli Testnet";
      case 11155111:
        return "Sepolia Testnet";
      case 137:
        return "Polygon Mainnet";
      case 80001:
        return "Polygon Mumbai";
      case 42161:
        return "Arbitrum One";
      case 421614:
        return "Arbitrum Sepolia";
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        {/* <FloatingParticles /> */}

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
      {/* <FloatingParticles /> */}

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
          {/* <motion.div
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
          </motion.div> */}

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
          {/* Xcan Advocate Highlight */}
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
                      Connect your wallet to check your module completion status and claim your NFT badges
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
              <>

                <motion.div
                  key="authenticated"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* User Info with Network Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <GlassCard className="p-8">
                      <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-6">
                          <motion.div
                            className={`w-20 h-20 rounded-2xl flex items-center justify-center relative ${isCorrectNetwork
                              ? "bg-gradient-to-br from-emerald-400/80 via-green-500/80 to-teal-500/80"
                              : "bg-gradient-to-br from-amber-400/80 via-orange-500/80 to-red-500/80"
                              }`}
                            whileHover={{ rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {isCorrectNetwork ? (
                              <CheckCircle className="w-10 h-10 text-white" />
                            ) : (
                              <AlertTriangle className="w-10 h-10 text-white" />
                            )}
                            <motion.div
                              className={`absolute inset-0 rounded-2xl blur-lg ${isCorrectNetwork ? "bg-emerald-400/20" : "bg-amber-400/20"
                                }`}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                              }}
                            />
                          </motion.div>

                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-white mb-2">
                                {isCorrectNetwork ? "Wallet Connected" : "Wrong Network"}
                              </h3>
                              <p className="text-gray-300 font-mono text-lg bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 mb-2">
                                {userAddress
                                  ? `${userAddress.slice(0, 8)}...${userAddress.slice(-6)}`
                                  : "Loading..."}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <p className={`text-sm flex items-center gap-2 ${isCorrectNetwork ? "text-emerald-300" : "text-amber-300"
                                    }`}>
                                    <Zap className="w-4 h-4" />
                                    Current Network: {getNetworkName(chainId)}
                                  </p>
                                  {!isCorrectNetwork && (
                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                      <Target className="w-4 h-4" />
                                      Required: Arbitrum Sepolia
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <>
                          {!isCorrectNetwork && (
                            <motion.button
                              onClick={handleSwitchNetwork}
                              disabled={isSwitchingChain}
                              className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              {isSwitchingChain ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Switching...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-4 h-4" />
                                  Switch Network
                                </>
                              )}
                            </motion.button>
                          )}
                        </>
                      </div>

                      {!isCorrectNetwork && (
                        <motion.div
                          className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-xl"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                            <p className="text-amber-200 text-sm">
                              Please switch to Arbitrum Sepolia network to mint your NFT badges and access all features.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </GlassCard>
                  </motion.div>

                  {/* Modules Showcase - Non-grid interactive layout (horizontal carousel) */}
                  {isCorrectNetwork && (
                    <>
                      <XcanAdvocateHighlight />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
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
                                Learning Modules
                              </h3>
                              <p className="text-gray-300 text-lg">
                                Complete modules to unlock and claim your NFT badges
                              </p>
                            </div>
                          </div>

                          {/* Spotlight vertical list (no claim buttons) */}
                          <div className="space-y-5">
                            {nftModules.map((module, index) => {

                              const handleOpen = () => {
                                if (module.id === "arbitrum-stylus") {
                                  router.push(`/nft/arbitrum-stylus`);
                                } else if (module.id === "stylus-foundation") {
                                  router.push(`/nft/stylus-foundation`);
                                } else if (module.database === "postgres") {
                                  router.push(`/nft/arbitrum-stylus`);
                                } else {
                                  router.push(`/nft/modules/${module.id}`);
                                }
                              };

                              return (
                                <motion.div
                                  key={module.id}
                                  className="group w-full text-left"
                                  initial={{ opacity: 0, y: 24 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.05 * index }}
                                >
                                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-white/20">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                                    <div className="relative p-6 sm:p-7">
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                          <div className={`p-3 rounded-xl bg-gradient-to-br ${module.gradient} bg-opacity-20`}>
                                            <module.icon className="w-8 h-8 text-white" />
                                          </div>
                                          <div>
                                            <h4 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{module.title}</h4>
                                            <p className="text-gray-300 text-sm sm:text-base max-w-2xl">{module.description}</p>
                                          </div>
                                        </div>

                                        <div className="hidden sm:flex items-center">
                                          <motion.button
                                            className="px-4 py-2 cursor-pointer rounded-full text-sm font-medium border border-[#9aadfe] shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#667eea] focus:ring-offset-2 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms] bg-gradient-to-r from-[#667eea]  to-[#764ba2] hover:from-[#5a67d8] hover:to-[#6b46c1] text-white"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleOpen}
                                          >
                                            <span className="flex items-center gap-2">
                                              <EyeIcon className="w-4 h-4" /> {/* Assuming you have an Eye icon from Heroicons or similar */}
                                              View Module
                                            </span>
                                          </motion.button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </GlassCard>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
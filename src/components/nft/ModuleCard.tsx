"use client";

import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, Clock, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { NFTModule } from "@/data/nftModules";

interface ModuleCardProps {
  module: NFTModule;
  isCompleted: boolean;
  isClaimed: boolean;
  isClaiming: boolean;
  onClaim: (moduleId: string) => void;
  onViewClaimed: (moduleId: string) => void;
  className?: string;
}

export function ModuleCard({
  module,
  isCompleted,
  isClaimed,
  isClaiming,
  onClaim,
  onViewClaimed,
  className = "",
}: ModuleCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (module.id === "arbitrum-stylus" || module.database === "postgres") {
      router.push(`/nft/arbitrum-stylus`);
      return;
    }
    router.push(`/nft/modules/${module.id}`);
  };

  const getButtonContent = () => {
    if (module.database === "postgres") {
      return (
        <>
          <ExternalLink className="w-4 h-4" />
          View Stylus NFTs
        </>
      );
    }

    if (isClaiming) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Claiming...
        </>
      );
    }

    if (isClaimed) {
      return (
        <>
          <CheckCircle className="w-4 h-4" />
          View NFT
        </>
      );
    }

    if (isCompleted) {
      return (
        <>
          <CheckCircle className="w-4 h-4" />
          Claim NFT
        </>
      );
    }

    return (
      <>
        <Clock className="w-4 h-4" />
        Complete Module
      </>
    );
  };

  const getButtonState = () => {
    if (module.database === "postgres") {
      return "enabled";
    }

    if (isClaiming) {
      return "loading";
    }

    if (isClaimed || isCompleted) {
      return "enabled";
    }

    return "disabled";
  };

  const buttonState = getButtonState();

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/10 ${className}`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${module.gradient} bg-opacity-20`}>
            <module.icon className="w-8 h-8 text-white" />
          </div>

          <div className="flex items-center gap-2">
            {isClaimed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-1 rounded-full bg-emerald-500/20"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </motion.div>
            )}

            {module.status === "coming-soon" && (
              <div className="px-2 py-1 rounded-full bg-amber-500/20 border border-amber-400/30">
                <span className="text-xs text-amber-300 font-medium">Coming Soon</span>
              </div>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            {module.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {module.description}
          </p>
        </div>

        {/* Module Info */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            {/* <div className="flex items-center gap-4"> */}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {module.duration}
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {module.challenges} challenges
            </span>
            {/* </div> */}

          </div>
          <div className="flex text-sm justify-end w-fit px-2 py-1 rounded-md bg-white/10 text-white/70">
            {module.level}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleClick}
          disabled={buttonState === "disabled" || buttonState === "loading"}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${buttonState === "disabled"
            ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
            : buttonState === "loading"
              ? "bg-blue-500/50 text-blue-200 cursor-not-allowed"
              : isClaimed
                ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-emerald-500/25"
                : module.database === "postgres"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25"
            }`}
          whileHover={buttonState === "enabled" ? { scale: 1.02 } : {}}
          whileTap={buttonState === "enabled" ? { scale: 0.98 } : {}}
        >
          {getButtonContent()}
        </motion.button>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none" />
    </motion.div >
  );
}

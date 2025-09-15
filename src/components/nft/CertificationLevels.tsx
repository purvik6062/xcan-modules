import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import {
  Trophy,
  CheckCircle,
  Clock,
  Sparkles,
  Crown,
  Gem,
  Star,
  Award,
  Target,
  Rocket,
  Zap,
  Loader2,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface ChallengeDetail {
  id: string;
  completed: boolean;
  details: {
    challengeId: string;
    reviewAction: string;
    submittedAt: string;
  } | null;
}

interface CertificationLevel {
  levelKey: string;
  name: string;
  description: string;
  level: number;
  isEligible: boolean;
  completedRequiredChallenges: number;
  requiredChallenges: number;
  challengeDetails: ChallengeDetail[];
}

interface CertificationLevelsProps {
  certificationLevels: CertificationLevel[];
  onMint: (levelKey: string, levelName: string, level: number) => void;
  isMinting: boolean;
  selectedLevel: string | null;
  hasMinted: boolean;
  isCheckingMinted: boolean;
  mintedNFTs: any[];
}

const CHALLENGE_NAMES = {
  "simple-counter-example": "Simple Counter Example",
  "simple-nft-example": "Simple NFT Example",
  "vending-machine": "Vending Machine",
  "multisig-wallet": "Multisig Wallet",
  "uniswap-v2-stylus": "Uniswap V2 Stylus",
  "zkp-age": "ZKP Age Verification",
  "zkp-balance": "ZKP Balance Proof",
  "zkp-password": "ZKP Password Verification",
  "zkp-location": "ZKP Location Proof",
  "zkp-model": "ZKP Model Verification",
  "zkp-public-doc-verifier": "ZKP Public Document Verifier",
  "vibekit-setup": "VibeKit Setup",
  "vibekit-basic-agents": "VibeKit Basic Agents",
  "vibekit-advanced-agents": "VibeKit Advanced Agents",
  "farcaster-miniapps": "Farcaster Miniapps",
};

const CHALLENGE_DESCRIPTIONS = {
  "simple-counter-example":
    "Build a basic counter smart contract with increment and decrement functionality",
  "simple-nft-example": "Create an NFT contract with minting capabilities",
  "vending-machine": "Develop a vending machine contract with purchase logic",
  "multisig-wallet": "Build a multi-signature wallet for secure transactions",
  "uniswap-v2-stylus": "Implement Uniswap V2-style DEX functionality with Stylus",
  "zkp-age": "Create zero-knowledge proof for age verification without revealing actual age",
  "zkp-balance": "Implement zero-knowledge proof for balance verification",
  "zkp-password": "Build zero-knowledge proof system for password verification",
  "zkp-location": "Develop zero-knowledge proof for location verification",
  "zkp-model": "Create zero-knowledge proof for model verification",
  "zkp-public-doc-verifier": "Build zero-knowledge proof system for public document verification",
  "vibekit-setup": "Set up VibeKit for agentic DeFi applications",
  "vibekit-basic-agents": "Implement basic VibeKit agents for DeFi automation",
  "vibekit-advanced-agents": "Create advanced VibeKit agents with complex strategies",
  "farcaster-miniapps": "Build Farcaster miniapps using Stylus technology",
};

const getLevelIcon = (level: number) => {
  switch (level) {
    case 0:
      return <Sparkles className="w-8 h-8 text-amber-400" />;
    case 1:
      return <Trophy className="w-8 h-8 text-amber-400" />;
    case 2:
      return <Gem className="w-8 h-8 text-blue-400" />;
    case 3:
      return <Star className="w-8 h-8 text-purple-400" />;
    case 4:
      return <Crown className="w-8 h-8 text-yellow-400" />;
    case 5:
      return <Award className="w-8 h-8 text-green-400" />;
    case 6:
      return <Target className="w-8 h-8 text-red-400" />;
    case 7:
      return <Rocket className="w-8 h-8 text-indigo-400" />;
    default:
      return <Trophy className="w-8 h-8 text-slate-400" />;
  }
};

const getLevelColor = (level: number) => {
  switch (level) {
    case 0:
      return "from-orange-500/8 to-red-500/8 border-orange-400/40";
    case 1:
      return "from-amber-500/8 to-orange-500/8 border-amber-400/40";
    case 2:
      return "from-blue-500/8 to-indigo-500/8 border-blue-400/40";
    case 3:
      return "from-purple-500/8 to-pink-500/8 border-purple-400/40";
    case 4:
      return "from-yellow-500/8 to-amber-500/8 border-yellow-400/40";
    case 5:
      return "from-green-500/8 to-emerald-500/8 border-green-400/40";
    case 6:
      return "from-red-500/8 to-pink-500/8 border-red-400/40";
    case 7:
      return "from-indigo-500/8 to-purple-500/8 border-indigo-400/40";
    default:
      return "from-slate-500/8 to-gray-500/8 border-slate-400/40";
  }
};

export function CertificationLevels({
  certificationLevels,
  onMint,
  isMinting,
  selectedLevel,
  hasMinted,
  isCheckingMinted,
  mintedNFTs,
}: CertificationLevelsProps) {
  return (
    <div className="space-y-8">
      {certificationLevels.map((level, index) => (
        <motion.div
          key={level.levelKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <GlassCard className={`p-10 backdrop-blur-xl bg-slate-800/20 border border-slate-700/30 ${getLevelColor(level.level)}`}>
            <div className="flex items-center gap-6 mb-8">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-slate-500/80 to-slate-600/80 rounded-2xl flex items-center justify-center relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {getLevelIcon(level.level)}
                <div className="absolute inset-0 bg-slate-400/20 rounded-2xl blur-lg animate-pulse"></div>
              </motion.div>
              <div className="flex-grow">
                <h3 className="text-3xl font-bold text-slate-100 mb-2">
                  Level {level.level}: {level.name}
                </h3>
                <p className="text-slate-300 text-lg">{level.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-3">
                  <motion.span
                    className={`text-3xl font-bold ${level.isEligible ? "text-emerald-400" : "text-amber-400"
                      }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                  >
                    {level.completedRequiredChallenges}/{level.requiredChallenges}
                  </motion.span>
                  {level.isEligible && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.9, type: "spring" }}
                    >
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                  )}
                </div>
                <p className={`text-sm mt-2 ${level.isEligible ? "text-emerald-200" : "text-amber-200"
                  }`}>
                  {(() => {
                    const hasMintedThisLevel = mintedNFTs.some(nft => nft.level === level.level);
                    if (hasMintedThisLevel) {
                      return "🎉 Already Minted!";
                    } else if (level.isEligible) {
                      return "🎉 Ready to mint!";
                    } else {
                      return `${level.requiredChallenges - level.completedRequiredChallenges} more to go`;
                    }
                  })()}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-slate-100">
                  Progress
                </span>
                <span className="text-lg font-bold text-slate-300">
                  {Math.round(
                    (level.completedRequiredChallenges / level.requiredChallenges) *
                    100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden border border-slate-600/30">
                <motion.div
                  className={`h-4 rounded-full ${level.isEligible
                    ? "bg-gradient-to-r from-emerald-400/80 to-green-500/80"
                    : "bg-gradient-to-r from-amber-400/80 to-orange-500/80"
                    }`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(level.completedRequiredChallenges / level.requiredChallenges) *
                      100
                      }%`,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5,
                    ease: "easeOut",
                  }}
                />
              </div>
            </div>

            {/* Challenge Details */}
            <div className="grid gap-4 mb-8">
              {level.challengeDetails.map((challenge, challengeIndex) => (
                <motion.div
                  key={challenge.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${challenge.completed
                    ? "bg-gradient-to-r from-emerald-500/8 to-green-500/8 border-emerald-400/40"
                    : "bg-gradient-to-r from-slate-800/30 to-slate-700/30 border-slate-600/40"
                    }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * challengeIndex }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-6">
                      {challenge.completed ? (
                        <motion.div
                          className="relative"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.8 }}
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400/80 to-green-500/80 rounded-2xl flex items-center justify-center relative">
                            <CheckCircle className="w-8 h-8 text-white" />
                            <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-lg animate-pulse"></div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="w-16 h-16 border-4 border-slate-500 border-dashed rounded-2xl flex items-center justify-center">
                          <Clock className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h4 className="text-xl font-bold text-slate-100 mb-2">
                        {CHALLENGE_NAMES[challenge.id as keyof typeof CHALLENGE_NAMES] || challenge.id}
                      </h4>
                      <p className="text-slate-300 mb-3">
                        {CHALLENGE_DESCRIPTIONS[challenge.id as keyof typeof CHALLENGE_DESCRIPTIONS] || "Complete this challenge to progress"}
                      </p>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${challenge.completed
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-600/20 text-slate-400 border border-slate-600/30"
                            }`}
                        >
                          {challenge.completed ? "✓ Completed" : "○ Pending"}
                        </span>
                        {challenge.details && (
                          <span className="text-xs text-slate-400 flex items-center gap-2 bg-slate-700/30 px-2 py-1 rounded-lg">
                            <Clock className="w-3 h-3" />
                            {new Date(challenge.details.submittedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mint Button and View NFT Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {(() => {
                const hasMintedThisLevel = mintedNFTs.some(nft => nft.level === level.level);

                if (hasMintedThisLevel) {
                  return (
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                      <motion.div
                        className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 px-6 py-4 rounded-2xl border border-emerald-400/30 backdrop-blur-xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <span className="font-semibold text-lg">Level {level.level} Already Minted</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          href={`/nft/${level.levelKey}`}
                          className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-pink-500/25"
                        >
                          <Eye className="w-5 h-5 group-hover:animate-pulse" />
                          <span>View Minted NFT</span>
                          <Sparkles className="w-5 h-5 group-hover:animate-bounce" />
                        </Link>
                      </motion.div>
                    </div>
                  );
                }

                if (level.isEligible) {
                  const isThisLevelMinting = isMinting && selectedLevel === level.levelKey;
                  return (
                    <motion.button
                      onClick={() => onMint(level.levelKey, level.name, level.level)}
                      disabled={isMinting || isCheckingMinted}
                      className="group relative bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-6 px-12 rounded-2xl text-xl transition-all duration-300 overflow-hidden shadow-2xl"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 30px 60px rgba(251, 191, 36, 0.5)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {isThisLevelMinting ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Minting Level {level.level} Badge...
                          </>
                        ) : (
                          <>
                            <Gem className="w-6 h-6 group-hover:animate-bounce" />
                            Mint Level {level.level} Badge
                            <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
                          </>
                        )}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      />
                    </motion.button>
                  );
                }

                return null;
              })()}
            </motion.div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
} 
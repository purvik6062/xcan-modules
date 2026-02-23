"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Target,
  Layers,
  BookOpen,
  Sparkles,
  ExternalLink,
  Check,
} from "lucide-react";
import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import {
  StatCard,
  ViewToggle,
  PageHeader,
} from "@/components/submissions";

// Fallback avatar component for when DiceBear image fails to load
function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [imgError, setImgError] = useState(false);
  if (imgError) {
    return (
      <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full border-2 border-slate-600/50 bg-slate-800/80 text-4xl">
        <User className="h-16 w-16 text-slate-400" />
      </div>
    );
  }
  return (
    <Image
      width={128}
      height={128}
      src={src}
      alt={alt}
      className="mb-4 rounded-full border-2 border-slate-600/50 shadow-lg"
      unoptimized
      onError={() => setImgError(true)}
    />
  );
}

interface ProfileData {
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  joinDate: string;
  userAddress: string;
  level: string;
  points: number;
  totalChallengesCompleted: number;
  totalSectionsCompleted: number;
  totalModulesCompleted: number;
  totalMinted: number;
  completedModules: Array<{
    id: string;
    name: string;
    completedAt: string;
  }>;
  completedChallenges: Array<{
    id: string;
    moduleId: string;
    moduleName: string;
    title: string;
    completedOn: string;
    points: number;
    level: string;
  }>;
  levelDistribution: Record<string, number>;
  mintedNFTs: Array<{
    level: number;
    levelKey: string;
    levelName: string;
    transactionHash: string;
    metadataUrl: string;
    imageUrl: string;
    mintedAt: string;
    network: string;
  }>;
}

const tabOptions = [
  { value: "overview", label: "Overview" },
  { value: "challenges", label: "Challenges" },
  { value: "modules", label: "Modules" },
  { value: "nfts", label: "NFTs" },
];

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-12 text-center"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-6 text-sm text-slate-400">{description}</p>
      {action}
    </motion.div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/profile?address=${address}`);

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [address]);

  const copyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Loading state - centered in viewport minus navbar and footer
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-500"
            aria-hidden
          />
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-500/20 bg-slate-800/50 p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <span className="text-3xl text-red-400">!</span>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">Error Loading Profile</h2>
            <p className="mb-6 text-slate-400">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-emerald-500/20 px-6 py-2.5 font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Connect wallet state
  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700/50">
              <User className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">Connect Your Wallet</h2>
            <p className="mb-6 text-slate-400">Please connect your wallet to view your profile</p>
            <ConnectWallet />
          </motion.div>
        </div>
      </div>
    );
  }

  // No data state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          <EmptyState
            icon={User}
            title="No Profile Data"
            description="No profile data found for this address"
          />
        </div>
      </div>
    );
  }

  const totalPoints = userData.points;
  const completedCount = userData.totalChallengesCompleted;
  const beginnerCount = userData.levelDistribution.Beginner || 0;
  const intermediateCount = userData.levelDistribution.Intermediate || 0;
  const advancedCount = userData.levelDistribution.Advanced || 0;

  const levelColor =
    userData.level === "Beginner"
      ? "text-emerald-400 bg-emerald-500/20"
      : userData.level === "Intermediate"
        ? "text-amber-400 bg-amber-500/20"
        : "text-rose-400 bg-rose-500/20";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl">
              <div className="flex flex-col items-center text-center">
                <AvatarImage src={userData.avatar} alt={userData.username} />
                <h1 className="text-xl font-bold tracking-tight text-white">{userData.username}</h1>
                <p className="mt-1 text-sm text-slate-400">Member since {userData.joinDate}</p>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-slate-700/30 px-4 py-3">
                    <span className="text-sm text-slate-400">Level</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${levelColor}`}>
                      {userData.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-700/30 px-4 py-3">
                    <span className="text-sm text-slate-400">Points</span>
                    <span className="font-semibold text-white">{userData.points}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-6">
                <ViewToggle
                  value={activeTab}
                  onChange={setActiveTab}
                  options={tabOptions}
                  layoutId="profileTabActive"
                />
              </div>

              <AnimatePresence mode="wait">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                      <StatCard value={totalPoints} label="Total Points" variant="blue" delay={0} />
                      <StatCard value={completedCount} label="Challenges" variant="emerald" delay={0.05} />
                      <StatCard value={userData.totalSectionsCompleted} label="Sections" variant="purple" delay={0.1} />
                      <StatCard value={userData.totalModulesCompleted} label="Modules" variant="pink" delay={0.15} />
                      <StatCard value={userData.totalMinted} label="NFTs" variant="amber" delay={0.2} />
                      <StatCard value={userData.completedModules.length} label="Completed" variant="cyan" delay={0.25} />
                    </div>

                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl">
                      <h3 className="mb-4 text-lg font-semibold text-white">Completed Modules</h3>
                      {userData.completedModules.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {userData.completedModules.map((mod) => (
                            <div
                              key={mod.id}
                              className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-700/30 p-4 transition-colors hover:border-slate-600/50"
                            >
                              <div>
                                <div className="font-medium text-white">{mod.name}</div>
                                <div className="text-xs text-slate-400">{mod.completedAt}</div>
                              </div>
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                                <Check className="h-4 w-4 text-emerald-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={BookOpen}
                          title="No modules completed"
                          description="Start learning to complete your first module"
                        />
                      )}
                    </div>

                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl">
                      <h3 className="mb-4 text-lg font-semibold text-white">Challenge Progress</h3>
                      <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-slate-700/50">
                        {completedCount > 0 && (
                          <>
                            {beginnerCount > 0 && (
                              <div
                                className="h-full bg-emerald-500 transition-all"
                                style={{ width: `${(beginnerCount / completedCount) * 100}%` }}
                                title={`${beginnerCount} Beginner`}
                              />
                            )}
                            {intermediateCount > 0 && (
                              <div
                                className="h-full bg-amber-500 transition-all"
                                style={{ width: `${(intermediateCount / completedCount) * 100}%` }}
                                title={`${intermediateCount} Intermediate`}
                              />
                            )}
                            {advancedCount > 0 && (
                              <div
                                className="h-full bg-rose-500 transition-all"
                                style={{ width: `${(advancedCount / completedCount) * 100}%` }}
                                title={`${advancedCount} Advanced`}
                              />
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Beginner ({beginnerCount})
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          Intermediate ({intermediateCount})
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-rose-500" />
                          Advanced ({advancedCount})
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl">
                      <h3 className="mb-4 text-lg font-semibold text-white">Recent Activity</h3>
                      {userData.completedChallenges.length > 0 ? (
                        <div className="space-y-4">
                          {userData.completedChallenges.slice(0, 5).map((challenge) => (
                            <div key={challenge.id} className="flex items-start gap-4">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                                <Check className="h-5 w-5 text-emerald-400" />
                              </div>
                              <div>
                                <div className="text-sm">
                                  <span className="text-slate-400">{challenge.moduleName}: </span>
                                  <span className="font-medium text-white">{challenge.title}</span>
                                </div>
                                <div className="text-xs text-slate-500">
                                  {challenge.completedOn} · {challenge.points} pts
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={Target}
                          title="No challenges completed"
                          description="Complete challenges to see your activity"
                        />
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Challenges Tab */}
                {activeTab === "challenges" && (
                  <motion.div
                    key="challenges"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="mb-4 text-xl font-semibold text-white">
                      Completed Challenges ({userData.completedChallenges.length})
                    </h2>
                    {userData.completedChallenges.length > 0 ? (
                      <div className="space-y-4">
                        {userData.completedChallenges.map((challenge) => (
                          <div
                            key={challenge.id}
                            className="flex flex-col gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <div className="font-medium text-white">{challenge.title}</div>
                              <div className="mt-1 text-sm text-slate-400">{challenge.moduleName}</div>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    challenge.level === "Beginner"
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : challenge.level === "Intermediate"
                                        ? "bg-amber-500/20 text-amber-400"
                                        : "bg-rose-500/20 text-rose-400"
                                  }`}
                                >
                                  {challenge.level}
                                </span>
                                <span className="text-xs text-slate-500">{challenge.completedOn}</span>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end">
                              <div className="font-bold text-blue-400">{challenge.points} pts</div>
                              <span className="flex items-center gap-1 text-sm text-emerald-400">
                                <Check className="h-4 w-4" /> Completed
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Target}
                        title="No Challenges Completed"
                        description="Start learning to complete your first challenge!"
                        action={
                          <Link
                            href="/challenges"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-6 py-2.5 font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30"
                          >
                            Browse Challenges
                          </Link>
                        }
                      />
                    )}
                  </motion.div>
                )}

                {/* Modules Tab */}
                {activeTab === "modules" && (
                  <motion.div
                    key="modules"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6">
                        <h3 className="mb-2 text-lg font-semibold text-emerald-400">Completed</h3>
                        <div className="text-3xl font-bold text-white">{userData.totalModulesCompleted}</div>
                        <div className="text-sm text-slate-400">modules completed</div>
                      </div>
                      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6">
                        <h3 className="mb-2 text-lg font-semibold text-blue-400">In Progress</h3>
                        <div className="text-3xl font-bold text-white">{6 - userData.totalModulesCompleted}</div>
                        <div className="text-sm text-slate-400">modules available</div>
                      </div>
                    </div>

                    <h3 className="mb-4 text-lg font-semibold text-white">Completed Modules</h3>
                    {userData.completedModules.length > 0 ? (
                      <div className="space-y-4">
                        {userData.completedModules.map((module) => (
                          <div
                            key={module.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                                <Check className="h-6 w-6 text-emerald-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">{module.name}</h4>
                                <p className="text-sm text-slate-400">Completed on {module.completedAt}</p>
                              </div>
                            </div>
                            <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400">
                              Complete
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Layers}
                        title="No Modules Completed"
                        description="Complete all challenges in a module to mark it as complete!"
                        action={
                          <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-6 py-2.5 font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30"
                          >
                            Browse Modules
                          </Link>
                        }
                      />
                    )}
                  </motion.div>
                )}

                {/* NFTs Tab */}
                {activeTab === "nfts" && (
                  <motion.div
                    key="nfts"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="mb-6 text-xl font-semibold text-white">Your Minted NFTs</h2>
                    {userData.mintedNFTs.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {userData.mintedNFTs.map((nft, idx) => (
                          <div
                            key={nft.transactionHash || `${nft.level}-${nft.levelName}-${idx}`}
                            className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl transition-all hover:border-slate-600/50"
                          >
                            <div className="relative aspect-square overflow-hidden bg-slate-700/30">
                              <Image
                                src={nft.imageUrl}
                                alt={nft.levelName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="p-5">
                              <h3 className="mb-1 font-bold text-white">{nft.levelName}</h3>
                              <p className="mb-4 text-sm text-slate-400">Level {nft.level}</p>
                              <p className="mb-4 text-xs text-slate-500">
                                Minted on{" "}
                                {new Date(nft.mintedAt).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              <a
                                href={`https://sepolia.arbiscan.io/tx/${nft.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500/20 py-2.5 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/30"
                              >
                                View Transaction
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={Sparkles}
                        title="No NFTs Minted Yet"
                        description="Complete challenges to mint your first NFT and showcase your achievements!"
                        action={
                          <Link
                            href="/challenges"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-6 py-2.5 font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30"
                          >
                            Start Challenges
                          </Link>
                        }
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface FoundationSubmission {
  walletAddress: string;
  githubRepo?: string;
  contractAddress?: string;
  moduleId: "stylus-foundation";
  type: "foundation";
  transactionHash?: string;
}

interface AdvocateSubmission {
  walletAddress: string;
  moduleId: "xcan-advocate";
  type: "advocate";
  isEligible?: boolean;
  transactionHash?: string;
  certificationLevel?: string;
  certificationLevelName?: string;
}

interface ModuleSubmission {
  walletAddress: string;
  moduleId: string;
  moduleName: string;
  isCompleted: boolean;
  type: "module";
  transactionHash?: string;
  completedChaptersCount?: number;
  totalPoints?: number;
  certificationLevel?: string;
  certificationLevelName?: string;
  updatedAt?: string;
}

type Submission = FoundationSubmission | AdvocateSubmission | ModuleSubmission;

interface UserModuleCount {
  walletAddress: string;
  moduleCount: number;
  modules: string[];
}

interface ModuleUserCount {
  moduleId: string;
  moduleName: string;
  userCount: number;
}

interface SubmissionsData {
  submissions: Submission[];
  submissionsByModule: Record<string, Submission[]>;
  totalSubmissions: number;
  uniqueUsers: number;
  userModuleCounts: UserModuleCount[];
  moduleUserCounts: ModuleUserCount[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats: {
    totalFoundationSubmissions: number;
    totalModuleSubmissions: number;
    averageModulesPerUser: number;
  };
}

export default function SubmissionsPage() {
  const [submissionsData, setSubmissionsData] = useState<SubmissionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>("web3-basics");
  const [viewMode, setViewMode] = useState<"all" | "by-module" | "by-user">("by-module");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSubmissions = async (module: string | null = null, page: number = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (module && module !== "all") {
        params.append("module", module);
      }
      params.append("page", page.toString());

      const response = await fetch(`/api/submissions?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch submissions data");
      }

      const data = await response.json();
      setSubmissionsData(data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("Failed to load submissions data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === "by-module") {
      fetchSubmissions(selectedModule, currentPage);
    } else {
      fetchSubmissions(null, currentPage);
    }
  }, [viewMode, selectedModule, currentPage]);

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
    setCurrentPage(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getTransactionUrl = (txHash: string) => {
    // Assuming Arbitrum Sepolia or Mainnet
    return `https://sepolia.arbiscan.io/tx/${txHash}`;
  };

  const shortenAddress = (address: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const shortenUrl = (url: string) => {
    if (!url) return "N/A";
    if (url.length <= 50) return url;
    return `${url.slice(0, 47)}...`;
  };

  // Filter submissions by search query
  const filteredSubmissions = submissionsData?.submissions.filter((submission) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return submission.walletAddress.toLowerCase().includes(query);
  }) || [];

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="h-12 w-64 bg-slate-700 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-96 bg-slate-700 rounded-lg mx-auto animate-pulse"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 shadow-lg">
              <div className="h-10 w-20 bg-slate-700 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-32 bg-slate-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="h-8 w-48 bg-slate-700 rounded mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-12 flex-1 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-12 flex-1 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-12 flex-1 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-12 flex-1 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-12 w-32 bg-slate-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!submissionsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6 text-center text-white">📋 Submissions</h1>
          <div className="bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-300 text-lg">No submissions yet. Be the first to submit!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4">📋 Submissions</h1>
          <p className="text-xl text-gray-300">
            All submissions from Arbitrum Stylus builders
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-emerald-400">{submissionsData.totalSubmissions}</div>
            <div className="text-gray-300 mt-2 text-sm">Total Submissions</div>
          </div>
          {/* <div className="bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-400">{submissionsData.uniqueUsers}</div>
            <div className="text-gray-300 mt-2 text-sm">Unique Users</div>
          </div> */}
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-purple-400">
              {submissionsData.stats.averageModulesPerUser.toFixed(1)}
            </div>
            <div className="text-gray-300 mt-2 text-sm">Avg Modules/User</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            {/* <div className="text-4xl font-bold text-cyan-400">{submissionsData.moduleUserCounts.length}</div> */}
            <div className="text-4xl font-bold text-cyan-400">8</div>
            <div className="text-gray-300 mt-2 text-sm">Active Modules</div>
          </div>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          className="mb-6 flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={() => {
              setViewMode("all");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === "all"
              ? "bg-emerald-500 text-white"
              : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
          >
            All Submissions
          </button>
          <button
            onClick={() => {
              setViewMode("by-module");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === "by-module"
              ? "bg-emerald-500 text-white"
              : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
          >
            By Module
          </button>
          <button
            onClick={() => {
              setViewMode("by-user");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${viewMode === "by-user"
              ? "bg-emerald-500 text-white"
              : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
          >
            By User
          </button>
        </motion.div>

        {/* Search Bar */}
        {(viewMode === "all" || viewMode === "by-user") && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-slate-800 rounded-xl p-4">
              <input
                type="text"
                placeholder="Search by wallet address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </motion.div>
        )}

        {/* Module List for By Module View */}
        {viewMode === "by-module" && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Select Module</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {submissionsData.moduleUserCounts.map((module) => (
                <div
                  key={module.moduleId}
                  className={`bg-slate-800 rounded-xl p-4 shadow-lg cursor-pointer transition-all hover:bg-slate-700 ${selectedModule === module.moduleId ? "ring-2 ring-emerald-400" : ""
                    }`}
                  onClick={() => handleModuleClick(module.moduleId)}
                >
                  <div className="text-lg font-semibold text-white mb-2">{module.moduleName}</div>
                  <div className="text-3xl font-bold text-emerald-400">{module.userCount}</div>
                  <div className="text-gray-400 text-sm mt-1">users completed</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Current Module Display */}
        {viewMode === "by-module" && selectedModule && (
          <motion.div
            className="mb-6 bg-slate-800 rounded-xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">
                Showing: {submissionsData.moduleUserCounts.find((m) => m.moduleId === selectedModule)?.moduleName}
              </span>
            </div>
          </motion.div>
        )}

        {/* Submissions Display */}
        {viewMode === "by-user" ? (
          <motion.div
            className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Users by Module Count</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-900 text-left border-b border-slate-700">
                      <th className="px-6 py-4 text-gray-300 font-semibold">#</th>
                      <th className="px-6 py-4 text-gray-300 font-semibold">Wallet Address</th>
                      <th className="px-6 py-4 text-gray-300 font-semibold">Modules Completed</th>
                      <th className="px-6 py-4 text-gray-300 font-semibold">Module List</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {submissionsData.userModuleCounts
                      .filter((user) => {
                        if (!searchQuery) return true;
                        return user.walletAddress.toLowerCase().includes(searchQuery.toLowerCase());
                      })
                      .map((user, index) => (
                        <motion.tr
                          key={user.walletAddress}
                          className="hover:bg-slate-700/50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.02 }}
                        >
                          <td className="px-6 py-4">
                            <div className="text-gray-400 font-semibold">{index + 1}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="font-mono text-white font-semibold">
                                {shortenAddress(user.walletAddress)}
                              </div>
                              <button
                                onClick={() => copyToClipboard(user.walletAddress)}
                                className="text-gray-400 hover:text-emerald-400 transition-colors"
                                title="Copy address"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 font-mono">
                              {user.walletAddress}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-2xl font-bold text-emerald-400">{user.moduleCount}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {user.modules.map((moduleId) => {
                                const module = submissionsData.moduleUserCounts.find((m) => m.moduleId === moduleId);
                                return (
                                  <span
                                    key={moduleId}
                                    className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs"
                                  >
                                    {module?.moduleName || moduleId}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : viewMode === "by-module" ? (
          <motion.div
            className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 text-left border-b border-slate-700">
                    <th className="px-6 py-4 text-gray-300 font-semibold">#</th>
                    <th className="px-6 py-4 text-gray-300 font-semibold">Wallet Address</th>
                    {selectedModule === "stylus-foundation" ? (
                      <>
                        <th className="px-6 py-4 text-gray-300 font-semibold">GitHub Repo</th>
                        <th className="px-6 py-4 text-gray-300 font-semibold">Contract Address</th>
                      </>
                    ) : selectedModule === "xcan-advocate" ? (
                      <th className="px-6 py-4 text-gray-300 font-semibold">Status</th>
                    ) : (
                      <>
                        <th className="px-6 py-4 text-gray-300 font-semibold">Chapters</th>
                        {/* <th className="px-6 py-4 text-gray-300 font-semibold">Points</th> */}
                        <th className="px-6 py-4 text-gray-300 font-semibold">Certification</th>
                      </>
                    )}
                    <th className="px-6 py-4 text-gray-300 font-semibold">NFT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {submissionsData.submissions.map((submission, index) => (
                    <motion.tr
                      key={`${submission.walletAddress}-${submission.moduleId}-${index}`}
                      className="hover:bg-slate-700/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.01 }}
                    >
                      <td className="px-6 py-4">
                        <div className="text-gray-400 font-semibold">{(currentPage - 1) * 30 + index + 1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-white font-semibold">
                            {shortenAddress(submission.walletAddress)}
                          </div>
                          <button
                            onClick={() => copyToClipboard(submission.walletAddress)}
                            className="text-gray-400 hover:text-emerald-400 transition-colors"
                            title="Copy address"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-mono">
                          {submission.walletAddress}
                        </div>
                      </td>
                      {submission.type === "foundation" && selectedModule === "stylus-foundation" ? (
                        <>
                          <td className="px-6 py-4">
                            {submission.githubRepo ? (
                              <a
                                href={
                                  submission.githubRepo.startsWith("http")
                                    ? submission.githubRepo
                                    : `https://github.com/${submission.githubRepo}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group"
                              >
                                <span className="truncate max-w-xs">{shortenUrl(submission.githubRepo)}</span>
                                <svg
                                  className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-mono text-teal-400 font-semibold">
                              {submission.contractAddress ? shortenAddress(submission.contractAddress) : "N/A"}
                            </div>
                            {submission.contractAddress && (
                              <div className="text-xs text-gray-500 mt-1 font-mono">
                                {submission.contractAddress}
                              </div>
                            )}
                          </td>
                        </>
                      ) : submission.type === "advocate" && selectedModule === "xcan-advocate" ? (
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                submission.isEligible
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {submission.isEligible ? "Eligible" : "Not Eligible"}
                            </span>
                            {submission.certificationLevelName && (
                              <div className="text-xs text-yellow-400 mt-1">
                                {submission.certificationLevelName}
                              </div>
                            )}
                          </div>
                        </td>
                      ) : submission.type === "module" ? (
                        <>
                          <td className="px-6 py-4">
                            <div className="text-white font-semibold">
                              {submission.completedChaptersCount || 0}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">chapters completed</div>
                          </td>
                          {/* <td className="px-6 py-4">
                            <div className="text-emerald-400 font-bold">
                              {submission.totalPoints || 0}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">points</div>
                          </td> */}
                          <td className="px-6 py-4">
                            {submission.certificationLevelName ? (
                              <div className="space-y-1">
                                {/* <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold">
                                  Level {submission.certificationLevel || 1}
                                </span> */}
                                <div className="text-xs text-yellow-400">
                                  {submission.certificationLevelName}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">Not certified</span>
                            )}
                          </td>
                        </>
                      ) : null}
                      <td className="px-6 py-4">
                        {submission.transactionHash ? (
                          <a
                            href={getTransactionUrl(submission.transactionHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                            title="View transaction on Arbiscan"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            <span className="text-sm">Claimed NFT</span>
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">Not claimed</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {submissionsData.pagination && (
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-t border-slate-700">
                <div className="text-gray-300 text-sm">
                  Showing {(currentPage - 1) * 30 + 1} to {Math.min(currentPage * 30, submissionsData.pagination.totalCount)} of {submissionsData.pagination.totalCount} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={!submissionsData.pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${submissionsData.pagination.hasPrevPage
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-slate-800 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(submissionsData.pagination.totalPages, p + 1))}
                    disabled={!submissionsData.pagination.hasNextPage}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${submissionsData.pagination.hasNextPage
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-slate-800 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900 text-left border-b border-slate-700">
                    <th className="px-6 py-4 text-gray-300 font-semibold">#</th>
                    <th className="px-6 py-4 text-gray-300 font-semibold">Wallet Address</th>
                    <th className="px-6 py-4 text-gray-300 font-semibold">Module</th>
                    <th className="px-6 py-4 text-gray-300 font-semibold">Details</th>
                    <th className="px-6 py-4 text-gray-300 font-semibold">NFT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredSubmissions.map((submission, index) => (
                    <motion.tr
                      key={`${submission.walletAddress}-${submission.moduleId}-${index}`}
                      className="hover:bg-slate-700/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.01 }}
                    >
                      <td className="px-6 py-4">
                        <div className="text-gray-400 font-semibold">{(currentPage - 1) * 30 + index + 1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-white font-semibold">
                            {shortenAddress(submission.walletAddress)}
                          </div>
                          <button
                            onClick={() => copyToClipboard(submission.walletAddress)}
                            className="text-gray-400 hover:text-emerald-400 transition-colors"
                            title="Copy address"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-mono">
                          {submission.walletAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">
                          {submission.type === "foundation"
                            ? "Stylus Foundation"
                            : submission.type === "advocate"
                              ? "XCAN Advocate"
                              : submission.type === "module"
                                ? submission.moduleName
                                : "Unknown Module"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {submission.type === "advocate" ? (
                          <div className="space-y-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                submission.isEligible
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {submission.isEligible ? "Eligible" : "Not Eligible"}
                            </span>
                            {submission.certificationLevelName && (
                              <div className="text-xs text-yellow-400 mt-1">
                                {submission.certificationLevelName}
                              </div>
                            )}
                          </div>
                        ) : submission.type === "foundation" ? (
                          <div className="space-y-1">
                            {submission.githubRepo && (
                              <a
                                href={
                                  submission.githubRepo.startsWith("http")
                                    ? submission.githubRepo
                                    : `https://github.com/${submission.githubRepo}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group text-sm"
                              >
                                <span className="truncate max-w-xs">{shortenUrl(submission.githubRepo)}</span>
                                <svg
                                  className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            )}
                            {submission.contractAddress && (
                              <div className="font-mono text-teal-400 text-sm">
                                {shortenAddress(submission.contractAddress)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-emerald-400 text-sm font-semibold">Completed</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {submission.transactionHash ? (
                          <a
                            href={getTransactionUrl(submission.transactionHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                            title="View transaction on Arbiscan"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            <span className="text-sm">Claimed NFT</span>
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">Not claimed</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {submissionsData.pagination && (
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-t border-slate-700">
                <div className="text-gray-300 text-sm">
                  Showing {(currentPage - 1) * 30 + 1} to {Math.min(currentPage * 30, submissionsData.pagination.totalCount)} of {submissionsData.pagination.totalCount} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={!submissionsData.pagination.hasPrevPage}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${submissionsData.pagination.hasPrevPage
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-slate-800 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(submissionsData.pagination.totalPages, p + 1))}
                    disabled={!submissionsData.pagination.hasNextPage}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${submissionsData.pagination.hasNextPage
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-slate-800 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

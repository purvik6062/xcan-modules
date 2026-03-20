"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Users,
  Layers,
  ClipboardList,
  Copy,
} from "lucide-react";
import { useSubmissions } from "../../../hooks/useSubmissions";
import { NFTBadges } from "../../../components/submissions/NFTBadges";
import {
  StatCard,
  ViewToggle,
  ModuleCard,
  SearchInput,
  DataTable,
  Pagination,
  PageHeader,
  SkeletonStat,
} from "../../../components/submissions";

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
  githubRepo?: string;
  contractAddress?: string;
  // New fields for Arbitrum Stylus
  completedChallenges?: string[];
  nftTransactionHashes?: Array<{
    transactionHash: string;
    levelName?: string;
    level?: number;
    mintedAt?: Date;
  }>;
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

export default function SubmissionsPage() {
  const [selectedModule, setSelectedModule] = useState<string>("web3-basics");
  const [viewMode, setViewMode] = useState<"all" | "by-module" | "by-user">("by-module");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine which module to fetch based on view mode
  const moduleToFetch = useMemo(() => {
    if (viewMode === "by-module") {
      return selectedModule;
    }
    return null;
  }, [viewMode, selectedModule]);

  // Use React Query hook for data fetching with caching
  const {
    data: submissionsData,
    isLoading,
    isFetching,
    error: queryError,
  } = useSubmissions({
    module: moduleToFetch,
    page: currentPage,
    enabled: true,
  });

  const error = queryError ? "Failed to load submissions data" : null;

  // Show loading state when fetching (including background refetches)
  const showLoading = isLoading || (isFetching && !submissionsData);

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

  const SkeletonLoader = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-12 w-64 animate-pulse rounded-lg bg-slate-700" />
          <div className="mx-auto h-6 w-96 animate-pulse rounded-lg bg-slate-700" />
        </div>
        <div className="mb-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonStat key={i} />
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl">
          <div className="p-6">
            <div className="mb-4 h-8 w-48 animate-pulse rounded bg-slate-700" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-12 flex-1 animate-pulse rounded bg-slate-700" />
                  <div className="h-12 flex-1 animate-pulse rounded bg-slate-700" />
                  <div className="h-12 flex-1 animate-pulse rounded bg-slate-700" />
                  <div className="h-12 flex-1 animate-pulse rounded bg-slate-700" />
                  <div className="h-12 w-32 animate-pulse rounded bg-slate-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <p className="text-lg text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!submissionsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <PageHeader
            title="Submissions"
            subtitle="All submissions from Arbitrum Stylus builders"
            icon={ClipboardList}
          />
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 text-center shadow-xl">
            <p className="text-lg text-slate-300">No submissions yet. Be the first to submit!</p>
          </div>
        </div>
      </div>
    );
  }

  const viewToggleOptions = [
    { value: "all", label: "All Submissions" },
    { value: "by-module", label: "By Module" },
    { value: "by-user", label: "By User" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <PageHeader
          title="Submissions"
          subtitle="All submissions from Arbitrum Stylus builders"
          icon={ClipboardList}
        />

        <div className="mb-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <StatCard
            value={submissionsData.totalSubmissions}
            label="Total Modules Completed"
            variant="emerald"
            icon={BookOpen}
            delay={0.1}
          />
          <StatCard
            value={submissionsData.stats.totalNFTsMinted || 0}
            label="Total NFTs Claimed"
            variant="amber"
            icon={Award}
            delay={0.15}
          />
          <StatCard
            value={submissionsData.uniqueUsers}
            label="Total Unique Users"
            variant="blue"
            icon={Users}
            delay={0.2}
          />
          <StatCard
            value={submissionsData.moduleUserCounts.length}
            label="Active Modules"
            variant="indigo"
            icon={Layers}
            delay={0.25}
          />
        </div>

        <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ViewToggle
            value={viewMode}
            onChange={(v) => {
              if (!isFetching) {
                setViewMode(v as "all" | "by-module" | "by-user");
                setCurrentPage(1);
              }
            }}
            options={viewToggleOptions}
            disabled={isFetching}
          />
        </div>

        {(viewMode === "all" || viewMode === "by-user") && (
          <div className="mb-6 max-w-xl">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by wallet address..."
            />
          </div>
        )}

        {viewMode === "by-module" && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="mb-4 text-xl font-semibold text-white sm:text-2xl">Select Module</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {submissionsData.moduleUserCounts.map((module, i) => (
                <ModuleCard
                  key={module.moduleId}
                  module={module}
                  selected={selectedModule === module.moduleId}
                  onClick={() => handleModuleClick(module.moduleId)}
                  delay={0.02 * i}
                />
              ))}
            </div>
          </motion.div>
        )}

        {viewMode === "by-module" && selectedModule && (
          <motion.div
            className="mb-6 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-sm font-medium text-slate-300">
              Showing:{" "}
              <span className="font-semibold text-white">
                {submissionsData.moduleUserCounts.find((m) => m.moduleId === selectedModule)?.moduleName}
              </span>
            </span>
          </motion.div>
        )}

        {viewMode === "by-user" ? (
          <DataTable>
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-white sm:text-2xl">Users by Module Count</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/80 text-left">
                    <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">#</th>
                    <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Wallet Address</th>
                    <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Modules Completed</th>
                    <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Module List</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {submissionsData.userModuleCounts
                    .filter((user) => {
                      if (!searchQuery) return true;
                      return user.walletAddress.toLowerCase().includes(searchQuery.toLowerCase());
                    })
                    .map((user, index) => (
                      <motion.tr
                        key={user.walletAddress}
                        className="transition-colors hover:bg-slate-700/30"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-400">{index + 1}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="font-mono font-semibold text-white">
                              {shortenAddress(user.walletAddress)}
                            </div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(user.walletAddress)}
                              aria-label="Copy address"
                              className="rounded p-1 text-slate-400 transition-colors hover:text-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-1 font-mono text-xs text-slate-500">{user.walletAddress}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-2xl font-bold text-emerald-400">{user.moduleCount}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {user.modules.map((moduleId) => {
                              const mod = submissionsData.moduleUserCounts.find((m) => m.moduleId === moduleId);
                              return (
                                <span
                                  key={moduleId}
                                  className="rounded-full bg-slate-700/80 px-3 py-1 text-xs font-medium text-slate-300"
                                >
                                  {mod?.moduleName || moduleId}
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
          </DataTable>
        ) : viewMode === "by-module" ? (
          <DataTable
            pagination={
              submissionsData.pagination ? (
                <Pagination
                  currentPage={currentPage}
                  totalPages={submissionsData.pagination.totalPages}
                  totalCount={submissionsData.pagination.totalCount}
                  pageSize={30}
                  onPageChange={setCurrentPage}
                  isLoading={isFetching}
                />
              ) : undefined
            }
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/80 text-left">
                  <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">#</th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Wallet Address</th>
                    {selectedModule === "stylus-foundation" ? (
                      <>
                        <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">GitHub Repo</th>
                        <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Contract Address</th>
                      </>
                    ) : selectedModule === "xcan-advocate" ? (
                      <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Status</th>
                    ) : selectedModule === "arbitrum-stylus" ? (
                      <>
                        <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Submissions</th>
                        <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Challenges</th>
                        <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Certification</th>
                      </>
                    ) : (
                      <>
                        <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Chapters</th>
                        <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Certification</th>
                      </>
                    )}
                    <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">NFT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {submissionsData.submissions.map((submission, index) => (
                    <motion.tr
                      key={`${submission.walletAddress}-${submission.moduleId}-${index}`}
                      className="transition-colors hover:bg-slate-700/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.01 }}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-400">{(currentPage - 1) * 30 + index + 1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-mono font-semibold text-white">
                            {shortenAddress(submission.walletAddress)}
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(submission.walletAddress)}
                            aria-label="Copy address"
                            className="rounded p-1 text-slate-400 transition-colors hover:text-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-1 font-mono text-xs text-slate-500">{submission.walletAddress}</div>
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
                              className={`rounded-full px-3 py-1 text-xs font-medium ${submission.isEligible
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-slate-600/50 text-slate-400"
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
                      ) : submission.type === "module" && submission.moduleId === "arbitrum-stylus" ? (
                        <>
                          <td className="px-6 py-4">
                            <div className="text-white font-semibold">
                              {submission.completedChaptersCount || 0}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">submissions</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-emerald-400 font-semibold">
                              {submission.completedChallenges?.length || 0}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">challenges completed</div>
                            {submission.completedChallenges && submission.completedChallenges.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {submission.completedChallenges.map((challengeId, idx) => (
                                  <span
                                    key={challengeId}
                                    className="rounded-full bg-slate-700/80 px-3 py-1 text-xs font-medium text-slate-300"
                                    title={challengeId}
                                  >
                                    {challengeId}
                                  </span>
                                ))}
                                {/* {submission.completedChallenges.length > 3 && (
                                  <span className="px-2 py-1 bg-slate-600 text-gray-400 rounded text-xs">
                                    +{submission.completedChallenges.length - 3}
                                  </span>
                                )} */}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-400">
                                Arbitrum Stylus
                              </span>
                            </div>
                          </td>
                        </>
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
                        {submission.moduleId === "arbitrum-stylus" && submission.nftTransactionHashes ? (
                          <NFTBadges nfts={submission.nftTransactionHashes} />
                        ) : submission.transactionHash ? (
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
          </DataTable>
        ) : (
          <DataTable
            pagination={
              submissionsData.pagination ? (
                <Pagination
                  currentPage={currentPage}
                  totalPages={submissionsData.pagination.totalPages}
                  totalCount={submissionsData.pagination.totalCount}
                  pageSize={30}
                  onPageChange={setCurrentPage}
                  isLoading={isFetching}
                />
              ) : undefined
            }
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/80 text-left">
                  <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">#</th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Wallet Address</th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Module</th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">Details</th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium text-slate-300">NFT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                  {filteredSubmissions.map((submission, index) => (
                    <motion.tr
                      key={`${submission.walletAddress}-${submission.moduleId}-${index}`}
                      className="transition-colors hover:bg-slate-700/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.01 }}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-400">{(currentPage - 1) * 30 + index + 1}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-mono font-semibold text-white">
                            {shortenAddress(submission.walletAddress)}
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(submission.walletAddress)}
                            aria-label="Copy address"
                            className="rounded p-1 text-slate-400 transition-colors hover:text-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus:outline-none"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-1 font-mono text-xs text-slate-500">{submission.walletAddress}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">
                          {submission.type === "foundation"
                            ? "Stylus Foundation"
                            : submission.type === "advocate"
                              ? "Xcan Advocate"
                              : submission.type === "module"
                                ? submission.moduleName
                                : "Unknown Module"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {submission.type === "advocate" ? (
                          <div className="space-y-1">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${submission.isEligible
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-slate-600/50 text-slate-400"
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
                        ) : submission.moduleId === "arbitrum-stylus" ? (
                          <div className="space-y-2">
                            <div className="text-emerald-400 text-sm font-semibold">
                              {submission.completedChaptersCount || 0} Submissions
                            </div>
                            <div className="text-blue-400 text-sm">
                              {submission.completedChallenges?.length || 0} Challenges
                            </div>
                            {(submission as any).githubRepo && (
                              <a
                                href={(submission as any).githubRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group text-sm"
                              >
                                <span className="truncate max-w-xs">{shortenUrl((submission as any).githubRepo)}</span>
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
                          </div>
                        ) : (
                          <div className="text-emerald-400 text-sm font-semibold">Completed</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {submission.moduleId === "arbitrum-stylus" && submission.nftTransactionHashes ? (
                          <NFTBadges nfts={submission.nftTransactionHashes} />
                        ) : submission.transactionHash ? (
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
          </DataTable>
        )}
      </div>
    </div>
  );
}

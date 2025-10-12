"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Submission {
  walletAddress: string;
  githubRepo: string;
  contractAddress: string;
  submittedAt: string;
}

interface LeaderboardData {
  submissions: Submission[];
  totalSubmissions: number;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/leaderboard");
        
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const shortenAddress = (address: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const shortenUrl = (url: string) => {
    if (!url) return "N/A";
    if (url.length <= 50) return url;
    return `${url.slice(0, 47)}...`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading submissions...</p>
        </div>
      </div>
    );
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

  if (!leaderboardData || leaderboardData.submissions.length === 0) {
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
          className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-slate-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl font-bold text-emerald-400">{leaderboardData.totalSubmissions}</div>
            <div className="text-gray-300 mt-2 text-lg">Total Submissions</div>
          </div>
        </motion.div>

        {/* Submissions Table */}
        <motion.div
          className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 text-left border-b border-slate-700">
                  <th className="px-6 py-4 text-gray-300 font-semibold">#</th>
                  <th className="px-6 py-4 text-gray-300 font-semibold">Wallet Address</th>
                  <th className="px-6 py-4 text-gray-300 font-semibold">GitHub Repo</th>
                  <th className="px-6 py-4 text-gray-300 font-semibold">Contract Address</th>
                  <th className="px-6 py-4 text-gray-300 font-semibold">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {leaderboardData.submissions.map((submission, index) => (
                  <motion.tr
                    key={`${submission.walletAddress}-${submission.submittedAt}-${index}`}
                    className="hover:bg-slate-700/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                  >
                    <td className="px-6 py-4">
                      <div className="text-gray-400 font-semibold">{index + 1}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-white font-semibold">
                        {shortenAddress(submission.walletAddress)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        {submission.walletAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {submission.githubRepo ? (
                        <a
                          href={submission.githubRepo.startsWith('http') ? submission.githubRepo : `https://github.com/${submission.githubRepo}`}
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
                        {shortenAddress(submission.contractAddress)}
                      </div>
                      {submission.contractAddress && (
                        <div className="text-xs text-gray-500 mt-1 font-mono">
                          {submission.contractAddress}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">
                        {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(submission.submittedAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

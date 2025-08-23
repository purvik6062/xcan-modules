"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Chapter } from "../../data/web3BasicsChapters";

interface Web3BasicsChapterCardProps {
  chapter: Chapter;
  basePath?: string;
}

export default function Web3BasicsChapterCard({ chapter, basePath = "/learn-web3-basics" }: Web3BasicsChapterCardProps) {
  const availableSections = chapter.sections.filter(
    (section) => section.status === "available"
  );
  const completedSections = 0; // This would come from user progress data
  const progressPercentage =
    availableSections.length > 0
      ? (completedSections / availableSections.length) * 100
      : 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-900 text-green-200";
      case "Intermediate":
        return "bg-yellow-900 text-yellow-200";
      case "Advanced":
        return "bg-red-900 text-red-200";
      default:
        return "bg-gray-900 text-gray-200";
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "web-evolution":
        return "🌐";
      case "wallet-fundamentals":
        return "👛";
      case "crypto-basics":
        return "💰";
      case "blockchain-core":
        return "🧱";
      case "ledger-principles":
        return "📋";
      case "key-security":
        return "🔐";
      case "nft-ownership":
        return "🎨";
      case "defi-trading":
        return "🔄";
      case "theory":
        return "📚";
      case "quiz":
        return "❓";
      default:
        return "📄";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col border border-gray-700"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="text-4xl">{chapter.icon}</div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                chapter.level
              )}`}
            >
              {chapter.level}
            </span>
            {chapter.status === "coming-soon" ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-900 text-orange-200">
                Coming Soon
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                Available
              </span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {chapter.title}
        </h3>

        <p className="text-gray-300 text-sm leading-relaxed">
          {chapter.description}
        </p>
      </div>

      {/* Progress Bar */}
      {chapter.status !== "coming-soon" && (
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-300">
                Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {completedSections}/{availableSections.length} sections
              </span>
              <span className="text-sm font-medium text-blue-400">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="px-6 py-4 flex-1">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          Sections ({availableSections.length})
        </h4>
        <div className="space-y-2">
          {availableSections.slice(0, 3).map((section) => (
            <div key={section.id} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{getSectionIcon(section.type)}</span>
              <span className="text-gray-400 flex-1">{section.title}</span>
              <span className="text-xs text-gray-500">{section.estimatedTime}</span>
            </div>
          ))}
          {availableSections.length > 3 && (
            <div className="text-xs text-gray-500 text-center pt-2">
              +{availableSections.length - 3} more sections
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-700">
        <Link
          href={`${basePath}/${chapter.id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-center block group-hover:shadow-lg"
        >
          {chapter.status === "coming-soon" ? "Coming Soon" : "Start Learning"}
        </Link>
      </div>
    </motion.div>
  );
}

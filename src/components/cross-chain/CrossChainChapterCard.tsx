"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { CrossChainChapter } from "../../data/crossChainChapters";
import { MODULE_THEME_BG_R } from "@/theme/moduleTheme";

interface CrossChainChapterCardProps {
  chapter: CrossChainChapter;
  basePath?: string;
  progressData?: string[];
  isLoading?: boolean;
  ctaTheme?: "blue" | "teal";
}

export default function CrossChainChapterCard({
  chapter,
  basePath = "/learn-cross-chain",
  progressData = [],
  isLoading = false,
  ctaTheme = "blue",
}: CrossChainChapterCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const availableSections = chapter.sections.filter(
    (section) => section.status === "available"
  );
  const completedSections = progressData.length;
  const progressPercentage =
    availableSections.length > 0
      ? (completedSections / availableSections.length) * 100
      : 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-[#1E3A8A]/35 text-[#b7cbff] border border-[#4A7CFF]/30";
      case "Intermediate":
        return "bg-[#1E3A8A]/35 text-[#b7cbff] border border-[#4A7CFF]/30";
      case "Advanced":
        return "bg-[#1E3A8A]/35 text-[#b7cbff] border border-[#4A7CFF]/30";
      default:
        return "bg-gray-900 text-gray-200";
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case "cross-chain-fundamentals":
        return "🌐";
      case "bridge-technology":
        return "🌉";
      case "interoperability":
        return "🔄";
      case "layer-2-solutions":
        return "⚡";
      case "cross-chain-protocols":
        return "🔗";
      case "security-considerations":
        return "🔐";
      case "theory":
        return "📚";
      case "quiz":
        return "❓";
      default:
        return "📄";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden h-full">
        <div className="p-6 border-b border-gray-700">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gray-700 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-6 bg-gray-700 rounded"></div>
                <div className="w-20 h-6 bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="w-3/4 h-6 bg-gray-700 rounded mb-2"></div>
            <div className="w-full h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="animate-pulse">
            <div className="w-24 h-4 bg-gray-700 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-700 rounded"></div>
              <div className="w-full h-4 bg-gray-700 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-700">
          <div className="animate-pulse">
            <div className="w-full h-12 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const cardContent = (
    <motion.div
      whileHover={chapter.status !== "coming-soon" ? { y: -5 } : {}}
      className={`relative bg-gray-800 rounded-xl shadow-lg hover:shadow-[#4A7CFF]/20 transition-all duration-300 overflow-hidden group h-full flex flex-col border border-gray-700 ${chapter.status !== "coming-soon" ? "cursor-pointer" : ""} ${progressPercentage === 100 ? "border-2 border-[#4A7CFF]/60 bg-[#1E3A8A]/15" : ""}`}
    >
      {isNavigating && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
          <motion.div
            className="relative w-24 h-24"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
            <div className="absolute inset-2 rounded-full border-t-4 border-blue-400" />
          </motion.div>
        </div>
      )}
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
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                Coming Soon
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1E3A8A]/35 text-[#b7cbff] border border-[#4A7CFF]/30">
                Available
              </span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#79A5FF] transition-colors">
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
              <div className="w-2 h-2 bg-[#79A5FF] rounded-full"></div>
              <span className="text-sm font-medium text-gray-300">
                Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {completedSections}/{availableSections.length} sections
              </span>
              <span className="text-sm font-medium text-[#79A5FF]">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${MODULE_THEME_BG_R}`}
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
        <div
          className={`w-full ${chapter.status === "coming-soon"
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : `${MODULE_THEME_BG_R} hover:brightness-110 text-white`
            } font-semibold py-3 px-4 rounded-lg transition-all duration-200 text-center block group-hover:shadow-lg`}
        >
          {chapter.status === "coming-soon" ? "Coming Soon" : "Start Learning"}
        </div>
      </div>
    </motion.div>
  );

  if (chapter.status === "coming-soon") {
    return cardContent;
  }

  return (
    <Link
      href={`${basePath}/${chapter.id}`}
      className="block h-full cursor-pointer"
      onClick={() => setIsNavigating(true)}
    >
      {cardContent}
    </Link>
  );
}
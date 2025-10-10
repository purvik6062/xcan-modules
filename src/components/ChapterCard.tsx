"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Chapter } from "../data/defiChapters";

interface ChapterCardProps {
  chapter: Chapter;
  basePath?: string;
  progress?: { completed: number; total: number };
}

export default function ChapterCard({ chapter, basePath = "/learn-defi", progress }: ChapterCardProps) {
  const availableSections = chapter.sections.filter(
    (section) => section.status === "available"
  );
  const completedSections = progress?.completed ?? 0;
  const totalSections = progress?.total ?? availableSections.length;
  const progressPercentage =
    totalSections > 0
      ? (completedSections / totalSections) * 100
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
      case "theory":
        return "📚";
      case "hands-on":
        return "🔧";
      case "code-walkthrough":
        return "💻";
      case "challenge":
        return "🎯";
      case "quiz":
        return "❓";
      default:
        return "📄";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col ${progressPercentage === 100 ? "border-2 border-green-500/60 bg-green-300/10" : "border border-slate-700"}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
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
              <span className="text-sm font-medium text-blue-400">
                {completedSections}/{totalSections}
              </span>
              <span className="text-xs text-gray-400 bg-slate-700 px-2 py-1 rounded-full">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ease-out ${progressPercentage > 0
                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                  : "bg-slate-500"
                  }`}
                style={{
                  width:
                    progressPercentage > 0 ? `${progressPercentage}%` : "4%",
                }}
              />
            </div>
            {progressPercentage > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-800 shadow-sm"></div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-gray-400">
              {progressPercentage > 0 ? "🚀 In Progress" : "⭐ Ready to Start"}
            </span>
            <span className="text-gray-400">
              {totalSections} sections total
            </span>
          </div>
        </div>
      )}

      {/* Content Preview - This will expand to fill available space */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-blue-600">⏱️</span>
            {chapter.duration}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600">📝</span>
            {chapter.sections.length} sections
          </div>
        </div>

        {/* Section Types Preview */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-300 mb-2">
            What you'll learn:
          </p>
          <div className="flex flex-wrap gap-2">
            {chapter.sections.slice(0, 4).map((section) => (
              <div
                key={section.id}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${section.status === "available"
                  ? "bg-blue-900 text-blue-200"
                  : "bg-gray-700 text-gray-400"
                  }`}
              >
                <span>{getSectionIcon(section.type)}</span>
                <span>{section.type.replace("-", " ")}</span>
              </div>
            ))}
            {chapter.sections.length > 4 && (
              <div className="px-2 py-1 rounded-md text-xs bg-gray-700 text-gray-400">
                +{chapter.sections.length - 4} more
              </div>
            )}
          </div>
        </div>

        {/* Badge Preview */}
        {chapter.badge && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-800">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🏆</div>
              <div>
                <p className="text-sm font-medium text-blue-300">
                  Earn: {chapter.badge.title}
                </p>
                <p className="text-xs text-blue-400">
                  {chapter.badge.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Capstone Project Preview */}
        {chapter.capstoneProject && (
          <div className="mb-4 p-3 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-lg border border-emerald-800">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🚀</div>
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  Final Project
                </p>
                <p className="text-xs text-emerald-400">
                  {chapter.capstoneProject.title}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="p-6 pt-0 mt-auto">
        {chapter.status === "available" ? (
          <Link href={`${basePath}/${chapter.id}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full hover:cursor-pointer ${basePath === "/learn-orbit"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                } text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2`}
            >
              {completedSections > 0 ? "Continue Learning" : "Start Chapter"}
              <span className="text-lg">→</span>
            </motion.button>
          </Link>
        ) : (
          <button
            disabled
            className="w-full bg-gray-600 text-gray-400 font-medium py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
          >
            Coming Soon
            <span className="text-lg">🔒</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

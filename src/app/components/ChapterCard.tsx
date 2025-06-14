"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Chapter } from "../data/defiChapters";

interface ChapterCardProps {
  chapter: Chapter;
  basePath?: string;
}

export default function ChapterCard({ chapter, basePath = "/learn-defi" }: ChapterCardProps) {
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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
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
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-slate-700">
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
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Coming Soon
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Available
              </span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {chapter.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {chapter.description}
        </p>
      </div>

      {/* Progress Bar */}
      {chapter.status === "available" && (
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {completedSections}/{availableSections.length}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-700 ease-out ${
                  progressPercentage > 0
                    ? "bg-gradient-to-r from-blue-500 to-blue-600"
                    : "bg-gray-300 dark:bg-slate-500"
                }`}
                style={{
                  width:
                    progressPercentage > 0 ? `${progressPercentage}%` : "4%",
                }}
              />
            </div>
            {progressPercentage > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></div>
            )}
          </div>

          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {progressPercentage > 0 ? "🚀 In Progress" : "⭐ Ready to Start"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {availableSections.length} sections total
            </span>
          </div>
        </div>
      )}

      {/* Content Preview - This will expand to fill available space */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
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
        <div className="mb-4 flex-grow">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What you'll learn:
          </p>
          <div className="flex flex-wrap gap-2">
            {chapter.sections.slice(0, 4).map((section) => (
              <div
                key={section.id}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                  section.status === "available"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                <span>{getSectionIcon(section.type)}</span>
                <span>{section.type.replace("-", " ")}</span>
              </div>
            ))}
            {chapter.sections.length > 4 && (
              <div className="px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                +{chapter.sections.length - 4} more
              </div>
            )}
          </div>
        </div>

        {/* Badge Preview */}
        {chapter.badge && (
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🏆</div>
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Earn: {chapter.badge.title}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {chapter.badge.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Capstone Project Preview */}
        {chapter.capstoneProject && (
          <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🚀</div>
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Capstone: {chapter.capstoneProject.title}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {chapter.capstoneProject.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button - Always at bottom */}
      <div className="p-6 pt-0 mt-auto">
        {chapter.status === "available" ? (
          <Link href={`${basePath}/${chapter.id}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full ${
                basePath === "/learn-orbit" 
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              } text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2`}
            >
              {completedSections > 0 ? "Continue Learning" : "Start Chapter"}
              <span className="text-lg">→</span>
            </motion.button>
          </Link>
        ) : (
          <button
            disabled
            className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-medium py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
          >
            Coming Soon
            <span className="text-lg">🔒</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Chapter } from "../data/defiChapters";
import { MODULE_THEME_BG_R } from "@/theme/moduleTheme";

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
      className={`bg-slate-800 rounded-xl shadow-lg hover:shadow-[#4A7CFF]/20 transition-all duration-300 overflow-hidden group h-full flex flex-col ${progressPercentage === 100 ? "border-2 border-[#4A7CFF]/60 bg-[#1E3A8A]/15" : "border border-slate-700"}`}
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

        <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-[#79A5FF]">
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
              <div
                className="h-2 w-2 rounded-full bg-[#79A5FF]"
              ></div>
              <span className="text-sm font-medium text-gray-300">
                Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium text-[#79A5FF]"
              >
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
                className={`h-2 rounded-full transition-all duration-700 ease-out ${progressPercentage > 0 ? MODULE_THEME_BG_R : "bg-slate-500"}`}
                style={{
                  width:
                    progressPercentage > 0 ? `${progressPercentage}%` : "4%",
                }}
              />
            </div>
            {progressPercentage > 0 && (
              <div
                className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-slate-800 shadow-sm bg-[#4A7CFF]"
              ></div>
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
            <span className="text-[#79A5FF]">⏱️</span>
            {chapter.duration}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#79A5FF]">📝</span>
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
                className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs ${section.status === "available" ? "bg-[#1E3A8A]/35 text-[#b7cbff] ring-1 ring-[#4A7CFF]/30" : "bg-gray-700 text-gray-400"}`}
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
          <div className="mb-4 rounded-lg border border-[#4A7CFF]/30 bg-gradient-to-r from-[#1E3A8A]/30 to-[#4A7CFF]/20 p-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🏆</div>
              <div>
                <p className="text-sm font-medium text-[#b7cbff]">
                  Earn: {chapter.badge.title}
                </p>
                <p className="text-xs text-[#79A5FF]">
                  {chapter.badge.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Capstone Project Preview */}
        {chapter.capstoneProject && (
          <div className="mb-4 rounded-lg border border-[#4A7CFF]/30 bg-gradient-to-r from-[#1E3A8A]/30 to-[#4A7CFF]/20 p-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🚀</div>
              <div>
                <p className="text-sm font-medium text-[#b7cbff]">
                  Final Project
                </p>
                <p className="text-xs text-[#79A5FF]">
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
              className={`w-full hover:cursor-pointer ${MODULE_THEME_BG_R} text-white shadow-sm ring-1 ring-white/10 hover:brightness-110 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2`}
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

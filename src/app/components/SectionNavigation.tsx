"use client";

import { motion } from "framer-motion";
import { Section } from "../data/defiChapters";

interface SectionNavigationProps {
  sections: Section[];
  currentIndex: number;
  completedSections: string[];
  onSectionSelect: (index: number) => void;
}

export default function SectionNavigation({
  sections,
  currentIndex,
  completedSections,
  onSectionSelect,
}: SectionNavigationProps) {
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
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sticky top-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Chapter Sections
      </h3>

      <div className="space-y-2">
        {sections.map((section, index) => {
          const isCompleted = completedSections.includes(section.id);
          const isCurrent = index === currentIndex;
          const isLocked = section.status === "coming-soon";

          return (
            <motion.button
              key={section.id}
              onClick={() => !isLocked && onSectionSelect(index)}
              disabled={isLocked}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                isCurrent
                  ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700"
                  : isCompleted
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                  : isLocked
                  ? "bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 opacity-50 cursor-not-allowed"
                  : "bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
              }`}
              whileHover={!isLocked ? { scale: 1.02 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                      ✓
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      {index + 1}
                    </div>
                  ) : isLocked ? (
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
                      🔒
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 dark:bg-slate-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
                      {index + 1}
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {getSectionIcon(section.type)}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isCurrent
                          ? "text-blue-700 dark:text-blue-300"
                          : isCompleted
                          ? "text-green-700 dark:text-green-300"
                          : isLocked
                          ? "text-gray-400 dark:text-gray-500"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {section.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`capitalize px-2 py-1 rounded-full ${
                        section.type === "theory"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : section.type === "hands-on"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : section.type === "code-walkthrough"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : section.type === "challenge"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                          : section.type === "quiz"
                          ? "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {section.type.replace("-", " ")}
                    </span>

                    <span
                      className={`${
                        isLocked
                          ? "text-gray-400 dark:text-gray-500"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {section.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between mb-2">
            <span>Completed:</span>
            <span className="font-medium">
              {completedSections.length}/
              {sections.filter((s) => s.status === "available").length}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (completedSections.length /
                    sections.filter((s) => s.status === "available").length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

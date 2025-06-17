"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Section } from "../data/defiChapters";

interface SectionNavigationProps {
  sections: Section[];
  currentIndex: number;
  completedSections: string[];
  onSectionSelect: (index: number) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export default function SectionNavigation({
  sections,
  currentIndex,
  completedSections,
  onSectionSelect,
  isCollapsed = false,
  onToggleCollapse,
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

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse(!isCollapsed);
    }
  };

  return (
    <motion.div
      className="bg-slate-800 rounded-2xl shadow-xl sticky top-4 overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: 1,
        x: 0,
        width: isCollapsed ? "4rem" : "auto",
      }}
      transition={{
        duration: 0.6,
        width: { duration: 0.4, ease: "easeInOut" },
      }}
    >
      {/* Header with Hamburger Toggle */}
      <div
        className={`flex items-center p-4 border-b border-slate-600 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && (
          <motion.h3
            initial={{ opacity: 1 }}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="text-lg font-bold text-white"
          >
            Chapter Sections
          </motion.h3>
        )}

        <motion.button
          onClick={handleToggle}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 transition-all duration-200 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isCollapsed ? "Expand Sections" : "Collapse Sections"}
        >
          {/* Hamburger Icon */}
          <div className="relative w-5 h-4 flex flex-col justify-between">
            <motion.span
              animate={{
                rotate: isCollapsed ? 0 : 45,
                y: isCollapsed ? 0 : 6,
                transformOrigin: "center",
              }}
              transition={{ duration: 0.3 }}
              className="block h-0.5 w-full bg-gray-300 rounded-full"
            />
            <motion.span
              animate={{
                opacity: isCollapsed ? 1 : 0,
                x: isCollapsed ? 0 : 10,
              }}
              transition={{ duration: 0.2 }}
              className="block h-0.5 w-full bg-gray-300 rounded-full"
            />
            <motion.span
              animate={{
                rotate: isCollapsed ? 0 : -45,
                y: isCollapsed ? 0 : -6,
                transformOrigin: "center",
              }}
              transition={{ duration: 0.3 }}
              className="block h-0.5 w-full bg-gray-300 rounded-full"
            />
          </div>
        </motion.button>
      </div>

      {/* Expanded Content */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              opacity: { duration: 0.2 },
            }}
            className="p-4"
          >
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
                        ? "bg-blue-900/20 border-2 border-blue-700"
                        : isCompleted
                        ? "bg-green-900/20 border border-green-700 hover:bg-green-900/30"
                        : isLocked
                        ? "bg-slate-700 border border-slate-600 opacity-50 cursor-not-allowed"
                        : "bg-slate-700 border border-slate-600 hover:bg-slate-600"
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
                          <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-gray-300 text-sm">
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
                                ? "text-blue-300"
                                : isCompleted
                                ? "text-green-300"
                                : isLocked
                                ? "text-gray-400"
                                : "text-gray-300"
                            }`}
                          >
                            {section.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`capitalize px-2 py-1 rounded-full ${
                              section.type === "theory"
                                ? "bg-blue-900 text-blue-300"
                                : section.type === "hands-on"
                                ? "bg-green-900 text-green-300"
                                : section.type === "code-walkthrough"
                                ? "bg-purple-900 text-purple-300"
                                : section.type === "challenge"
                                ? "bg-orange-900 text-orange-300"
                                : section.type === "quiz"
                                ? "bg-pink-900 text-pink-300"
                                : "bg-gray-800 text-gray-300"
                            }`}
                          >
                            {section.type.replace("-", " ")}
                          </span>

                          <span
                            className={`${
                              isLocked
                                ? "text-gray-400"
                                : "text-gray-400"
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

            <div className="mt-6 pt-4 border-t border-slate-600">
              <div className="text-sm text-gray-400">
                <div className="flex items-center justify-between mb-2">
                  <span>Completed:</span>
                  <span className="font-medium">
                    {completedSections.length}/
                    {sections.filter((s) => s.status === "available").length}
                  </span>
                </div>

                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (completedSections.length /
                          sections.filter((s) => s.status === "available")
                            .length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed State */}
      <AnimatePresence mode="wait">
        {isCollapsed && (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-2"
          >
            <div className="flex flex-col items-center space-y-3">
              {sections.map((section, index) => {
                const isCompleted = completedSections.includes(section.id);
                const isCurrent = index === currentIndex;
                const isLocked = section.status === "coming-soon";

                return (
                  <motion.button
                    key={section.id}
                    onClick={() => !isLocked && onSectionSelect(index)}
                    disabled={isLocked}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 relative group ${
                      isCurrent
                        ? "bg-blue-500 text-white ring-2 ring-blue-700"
                        : isCompleted
                        ? "bg-green-500 text-white hover:ring-2 hover:ring-green-700"
                        : isLocked
                        ? "bg-gray-400 text-white opacity-50 cursor-not-allowed"
                        : "bg-slate-600 text-gray-300 hover:ring-2 hover:ring-slate-500"
                    }`}
                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                    whileTap={!isLocked ? { scale: 0.9 } : {}}
                  >
                    {isCompleted ? (
                      "✓"
                    ) : isLocked ? (
                      "🔒"
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}

                    {/* Tooltip */}
                    <div className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                      {section.title}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-slate-700"></div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

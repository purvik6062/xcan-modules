"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface LearningDashboardProps {
  chapterId: string;
  sectionId: string;
  concepts?: string[];
  glossary?: { [key: string]: string };
  progressData?: {
    completed: number;
    total: number;
    timeSpent: number;
  };
}

export default function InteractiveLearningDashboard({
  chapterId,
  sectionId,
  concepts = [],
  glossary = {},
  progressData,
}: LearningDashboardProps) {
  const [activeTab, setActiveTab] = useState<"glossary" | "progress">(
    "glossary"
  );

  const tabs = [
    { id: "glossary", label: "Glossary", icon: "📖" },
    { id: "progress", label: "Progress", icon: "📊" },
  ];
  const renderGlossary = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white mb-4">
        Chapter Glossary
      </h4>
      {Object.keys(glossary).length > 0 ? (
        <div className="space-y-3 h-fit">
          {Object.entries(glossary).map(([term, definition]) => (
            <motion.div
              key={term}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-lg p-4 border border-blue-700"
            >
              <h5 className="font-semibold text-blue-100 mb-2 flex items-center gap-2">
                <span className="text-blue-400">💡</span>
                {term}
              </h5>
              <p className="text-sm text-blue-200 leading-relaxed">
                {definition}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <span className="text-4xl mb-2 block">📚</span>
          <p>Glossary terms will be populated as you learn new concepts.</p>
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-white mb-4">
        Your Learning Progress
      </h4>

      {progressData ? (
        <>
          {/* Progress Bar */}
          <div className="bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  (progressData.completed / progressData.total) * 100
                }%`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-900/20 rounded-lg p-4 text-center border border-green-700">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(
                  (progressData.completed / progressData.total) * 100
                )}
                %
              </div>
              <div className="text-sm text-green-200">
                Complete
              </div>
            </div>

            <div className="bg-blue-900/20 rounded-lg p-4 text-center border border-blue-700">
              <div className="text-2xl font-bold text-blue-400">
                {progressData.completed}/{progressData.total}
              </div>
              <div className="text-sm text-blue-200">
                Sections
              </div>
            </div>

            <div className="bg-purple-900/20 rounded-lg p-4 text-center border border-purple-700">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(progressData.timeSpent / 60)}m
              </div>
              <div className="text-sm text-purple-200">
                Time Spent
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-700">
            <h5 className="font-semibold text-yellow-200 mb-3 flex items-center gap-2">
              <span>🏆</span>
              <span>Achievements</span>
            </h5>
            <div className="flex flex-wrap gap-2">
              {progressData.completed > 0 && (
                <span className="bg-yellow-800 text-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
                  First Steps
                </span>
              )}
              {progressData.completed >= 3 && (
                <span className="bg-yellow-800 text-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
                  Getting Started
                </span>
              )}
              {progressData.completed >= 5 && (
                <span className="bg-yellow-800 text-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
                  Making Progress
                </span>
              )}
              {progressData.completed === progressData.total && (
                <span className="bg-yellow-800 text-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
                  Chapter Complete
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <span className="text-4xl mb-2 block">📈</span>
          <p>Progress tracking will appear as you complete sections.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border sticky top-4 border-gray-700 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex bg-gray-700 border-b border-gray-600">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-gray-800 text-white border-b-2 border-blue-500"
                : "text-gray-300 hover:text-white hover:bg-gray-600"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "glossary" && renderGlossary()}
          {activeTab === "progress" && renderProgress()}
        </motion.div>
      </div>
    </div>
  );
}

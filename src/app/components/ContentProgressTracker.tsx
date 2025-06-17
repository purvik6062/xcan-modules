"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ContentProgressTrackerProps {
  sectionId: string;
  totalSubsections: number;
  currentSubsection: number;
  estimatedReadTime: string;
  onNavigate?: (direction: "next" | "previous") => void;
}

export default function ContentProgressTracker({
  sectionId,
  totalSubsections,
  currentSubsection,
  estimatedReadTime,
  onNavigate,
}: ContentProgressTrackerProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    setStartTime(Date.now());
    setReadingProgress(0);
  }, [sectionId, currentSubsection]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getEstimatedMinutes = (): number => {
    const match = estimatedReadTime.match(/(\d+)/);
    return match ? parseInt(match[1]) : 10;
  };

  const progressPercentage = ((currentSubsection + 1) / totalSubsections) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4 min-w-[280px]"
      >
        {/* Section Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Section Progress
            </span>
            <span className="text-sm text-gray-400">
              {currentSubsection + 1} of {totalSubsections}
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Reading Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Reading Progress
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(readingProgress)}%
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
              style={{ width: `${readingProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Time Tracking */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-900/20 rounded-lg p-2">
            <div className="text-xs text-blue-400 font-medium">
              Time Spent
            </div>
            <div className="text-sm font-bold text-blue-200">
              {formatTime(timeSpent)}
            </div>
          </div>

          <div className="bg-purple-900/20 rounded-lg p-2">
            <div className="text-xs text-purple-400 font-medium">
              Est. Time
            </div>
            <div className="text-sm font-bold text-purple-200">
              {estimatedReadTime}
            </div>
          </div>
        </div>

        {/* Navigation Hints */}
        {onNavigate && (
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate("previous")}
              disabled={currentSubsection === 0}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                currentSubsection === 0
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500"
              }`}
            >
              ← Previous
            </button>

            <button
              onClick={() => onNavigate("next")}
              disabled={currentSubsection === totalSubsections - 1}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                currentSubsection === totalSubsections - 1
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Next →
            </button>
          </div>
        )}

        {/* Achievement Indicator */}
        {readingProgress >= 90 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 p-2 bg-green-900/20 rounded-lg border border-green-700"
          >
            <div className="flex items-center gap-2 text-green-300">
              <span className="text-lg">🎉</span>
              <span className="text-xs font-medium">Almost done!</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

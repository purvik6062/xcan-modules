"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "../../data/stylusChapters";
import StylusStoryQuizComponent from "./StylusStoryQuizComponent";

interface StylusContentProps {
  section: Section;
  chapterId: string;
  onComplete: () => void;
}

export default function StylusContent({
  section,
  chapterId,
  onComplete,
}: StylusContentProps) {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="w-full">
      {/* Story-Quiz Content */}
      {["stylus-intro", "stylus-setup", "stylus-constructor", "stylus-storage", "stylus-mapping", "stylus-arrays", "stylus-functions", "stylus-selector", "stylus-events", "stylus-errors", "stylus-call", "stylus-vm", "theory", "quiz"].includes(section.type) && section.content && (
        <StylusStoryQuizComponent
          key={section.id}
          content={section.content}
          onComplete={handleComplete}
        />
      )}

      {/* Default content for other types */}
      {!["stylus-intro", "stylus-setup", "stylus-constructor", "stylus-storage", "stylus-mapping", "stylus-arrays", "stylus-functions", "stylus-selector", "stylus-events", "stylus-errors", "stylus-call", "stylus-vm", "theory", "quiz"].includes(section.type) && (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Content Coming Soon
            </h3>
            <p className="text-gray-300 mb-4">
              This section is currently being developed and will be available soon.
            </p>
          </div>
        </div>
      )}

      {/* Completion Button for non-story content */}
      {!["stylus-intro", "stylus-setup", "stylus-constructor", "stylus-storage", "stylus-mapping", "stylus-arrays", "stylus-functions", "stylus-selector", "stylus-events", "stylus-errors", "stylus-call", "stylus-vm", "theory", "quiz"].includes(section.type) && (
        <div className="mt-12 pt-8 border-t border-gray-600">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Estimated time: {section.estimatedTime}
            </div>

            <motion.button
              onClick={handleComplete}
              disabled={completed}
              className={`px-8 py-4 rounded-lg font-medium transition-all duration-200 ${completed
                ? "bg-green-600 text-white cursor-default"
                : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl"
                }`}
              whileHover={!completed ? { scale: 1.05 } : {}}
              whileTap={!completed ? { scale: 0.95 } : {}}
            >
              {completed ? (
                <span className="hover:cursor-pointer flex items-center gap-2">
                  <span>✓</span>
                  Section Completed!
                </span>
              ) : (
                <span className="hover:cursor-pointer flex items-center gap-2">
                  <span>📝</span>
                  Mark as Complete
                </span>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}


"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CrossChainSection } from "../../data/crossChainChapters";
import ReactMarkdown from "react-markdown";
import StoryQuizComponent from "./StoryQuizComponent";

interface CrossChainContentProps {
  section: CrossChainSection;
  chapterId: string;
  onComplete: () => void;
}

export default function CrossChainContent({
  section,
  chapterId,
  onComplete,
}: CrossChainContentProps) {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="w-full">
      {/* Story + Quiz Content (only if there are questions) */}
      {["cross-chain-fundamentals", "bridge-technology", "interoperability", "layer-2-solutions", "cross-chain-protocols", "security-considerations", "theory", "quiz", "code-example", "hands-on-lab", "real-world-analogy"].includes(section.type) &&
        section.content &&
        Array.isArray(section.content.questions) &&
        section.content.questions.length > 0 && (
          <StoryQuizComponent
            key={section.id}
            content={section.content}
            onComplete={handleComplete}
          />
        )}

      {/* Story-only Content (no questions) */}
      {["cross-chain-fundamentals", "bridge-technology", "interoperability", "layer-2-solutions", "cross-chain-protocols", "security-considerations", "theory", "code-example", "hands-on-lab", "real-world-analogy"].includes(section.type) &&
        section.content &&
        Array.isArray(section.content.questions) &&
        section.content.questions.length === 0 && (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto px-4">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="prose prose-lg max-w-none prose-invert">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-600 pb-2">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold text-purple-300 mb-4 mt-8">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-semibold text-cyan-300 mb-3 mt-6">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-200 text-base leading-7 mb-4">{children}</p>
                      ),
                      strong: ({ children }) => <strong className="text-purple-300 font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="text-cyan-300 italic">{children}</em>,
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300 ml-4">{children}</ul>
                      ),
                      li: ({ children }) => <li className="text-gray-200 leading-6 mb-1">{children}</li>,
                      code: ({ children }) => (
                        <code className="bg-gray-700 text-green-300 px-2 py-1 rounded text-sm font-mono">{children}</code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto my-4">{children}</pre>
                      ),
                    }}
                  >
                    {section.content.story}
                  </ReactMarkdown>
                </div>

                {/* Complete Button */}
                <div className="mt-8 flex justify-end">
                  <motion.button
                    onClick={handleComplete}
                    disabled={completed}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                      completed
                        ? "bg-green-600 text-white cursor-default"
                        : "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
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
            </div>
          </div>
        )}

      {/* Theory Content */}
      {/* {section.type === "theory" && (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📚</span>
                <h3 className="text-xl font-bold text-white">
                  Theoretical Foundation
                </h3>
              </div>
              <div className="text-gray-300">
                <p className="mb-4">
                  This section provides deeper theoretical understanding of the concepts.
                </p>
                <p>
                  Detailed theoretical content for this section is being developed to
                  complement the story-based learning approach.
                </p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Quiz Content placeholder removed: quizzes are delivered via StoryQuizComponent above */}

      {/* Completion Button for non-story content */}
      {!["cross-chain-fundamentals", "bridge-technology", "interoperability", "layer-2-solutions", "cross-chain-protocols", "security-considerations", "theory", "quiz"].includes(section.type) && (
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
                : "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
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
                <span className="flex items-center gap-2">
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
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "../../data/web3BasicsChapters";
import StoryQuizComponent from "./StoryQuizComponent";

interface Web3BasicsContentProps {
  section: Section;
  chapterId: string;
  onComplete: () => void;
}

export default function Web3BasicsContent({
  section,
  chapterId,
  onComplete,
}: Web3BasicsContentProps) {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  return (
    <div className="w-full">
      {/* Story-Quiz Content */}
      {["web3-evolution", "wallet-fundamentals", "crypto-basics", "blockchain-core", "ledger-principles", "key-security", "nft-ownership", "defi-trading", "rust-basics", "rust-ownership", "rust-data-types", "rust-control-flow", "rust-lifetimes", "rust-error-handling", "rust-macros", "theory", "quiz"].includes(section.type) && section.content && (
        <StoryQuizComponent
          key={section.id}
          content={section.content}
          onComplete={handleComplete}
        />
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

      {/* Quiz Content */}
      {section.type === "quiz" && (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold text-white">
                  Knowledge Quiz
                </h3>
              </div>
              <div className="text-gray-300">
                <p className="mb-4">
                  Test your understanding with comprehensive quiz questions.
                </p>
                <p>
                  Interactive quiz components are being developed to reinforce
                  learning through practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Default content for other types */}
      {!["web3-evolution", "wallet-fundamentals", "crypto-basics", "blockchain-core", "ledger-principles", "key-security", "nft-ownership", "defi-trading", "theory", "quiz"].includes(section.type) && (
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
      {!["web3-evolution", "wallet-fundamentals", "crypto-basics", "blockchain-core", "ledger-principles", "key-security", "nft-ownership", "defi-trading", "rust-basics", "rust-ownership", "rust-data-types", "rust-control-flow", "rust-lifetimes", "rust-error-handling", "rust-macros", "theory", "quiz"].includes(section.type) && (
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
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl"
                }`}
              whileHover={!completed ? { scale: 1.05 } : {}}
              whileTap={!completed ? { scale: 0.95 } : {}}
            >
              {completed ? (
                <span className="flex items-center gap-2">
                  <span>✓</span>
                  Section Complete!
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

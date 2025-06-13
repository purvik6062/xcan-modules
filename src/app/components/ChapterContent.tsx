"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "../data/defiChapters";
import CodeEditor from "./CodeEditor";

interface ChapterContentProps {
  section: Section;
  chapterId: string;
  onComplete: () => void;
}

export default function ChapterContent({
  section,
  chapterId,
  onComplete,
}: ChapterContentProps) {
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  // Sample content for demonstration
  const getSampleContent = () => {
    switch (section.id) {
      case "what-is-defi":
        return {
          title: "Understanding Decentralized Finance",
          content: `DeFi represents a paradigm shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on blockchains.

Key characteristics include:
• Accessibility - Open to anyone with an internet connection
• Permissionless - No need for approval from centralized authorities
• Transparency - All transactions are publicly verifiable
• Self-Custody - Users maintain control of their assets`,
          codeExample: `// Simple DeFi interaction example
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');
const tokenAddress = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'; // WETH

async function getTokenBalance(userAddress) {
  const contract = new ethers.Contract(tokenAddress, ['function balanceOf(address) view returns (uint256)'], provider);
  const balance = await contract.balanceOf(userAddress);
  return ethers.utils.formatEther(balance);
}`,
        };
      default:
        return {
          title: "Content Coming Soon",
          content:
            "This section is currently being developed and will be available soon.",
          codeExample: "",
        };
    }
  };

  const content = getSampleContent();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Content Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {content.title}
        </h2>
      </div>

      {/* Content based on section type */}
      {section.type === "theory" && (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📚</span>
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                Learning Content
              </h3>
            </div>
            <div className="text-blue-800 dark:text-blue-200 whitespace-pre-line">
              {content.content}
            </div>
          </div>
        </div>
      )}

      {section.type === "code-walkthrough" && (
        <div className="space-y-8">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💻</span>
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">
                Code Walkthrough
              </h3>
            </div>
            <div className="text-purple-800 dark:text-purple-200 whitespace-pre-line mb-6">
              {content.content}
            </div>
          </div>

          {content.codeExample && (
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                💻 Interactive Code Example
              </h4>
              <CodeEditor
                initialCode={content.codeExample}
                language="javascript"
                readOnly={false}
              />
            </div>
          )}
        </div>
      )}

      {section.type === "hands-on" && (
        <div className="space-y-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔧</span>
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                Hands-On Practice
              </h3>
            </div>
            <div className="text-green-800 dark:text-green-200 whitespace-pre-line">
              {content.content}
            </div>
          </div>

          {content.codeExample && (
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                🛠️ Practice Code
              </h4>
              <CodeEditor
                initialCode={content.codeExample}
                language="javascript"
                readOnly={false}
              />
            </div>
          )}
        </div>
      )}

      {/* Default content for other types */}
      {!["theory", "code-walkthrough", "hands-on"].includes(section.type) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Content Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This section is currently being developed and will be available
            soon.
          </p>
        </div>
      )}

      {/* Completion Button */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-600">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Estimated time: {section.estimatedTime}
          </div>

          <motion.button
            onClick={handleComplete}
            disabled={completed}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              completed
                ? "bg-green-600 text-white cursor-default"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            whileHover={!completed ? { scale: 1.05 } : {}}
            whileTap={!completed ? { scale: 0.95 } : {}}
          >
            {completed ? (
              <span className="flex items-center gap-2">
                <span>✓</span>
                Complete!
              </span>
            ) : (
              "Mark as Complete"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

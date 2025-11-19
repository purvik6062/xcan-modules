"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Section } from "../data/defiChapters";
import CodeEditor from "./CodeEditor";
import GitHubAuthHandler from "./GitHubAuthHandler";

interface ChallengeComponentProps {
  section: Section;
  onComplete: () => void;
}

export default function ChallengeComponent({
  section,
  onComplete,
}: ChallengeComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<
    { passed: boolean; message: string; name: string }[]
  >([]);
  const [pendingCompletion, setPendingCompletion] = useState(false);

  const markChallengeCompleted = () => {
    if (completed) return;
    setCompleted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    onComplete();
  };

  return (
    <GitHubAuthHandler
      onAuthComplete={() => {
        if (pendingCompletion) {
          setPendingCompletion(false);
          markChallengeCompleted();
        }
      }}
      onAuthError={(error) => {
        console.error("GitHub authentication error:", error);
        setPendingCompletion(false);
      }}
    >
      {({ isAuthenticating, hasGithub, triggerAuth }) => {
        const requestCompletion = () => {
          if (completed) return;

          if (hasGithub) {
            markChallengeCompleted();
          } else {
            setPendingCompletion(true);
            triggerAuth();
          }
        };

        const runSimpleTest = () => {
          const results = [
            {
              name: "Code contains function",
              passed: userCode.includes("function"),
              message: "Your code should contain a function definition",
            },
            {
              name: "Uses appropriate syntax",
              passed: userCode.length > 10,
              message: "Your code should be substantial enough",
            },
          ];

          setTestResults(results);

          if (results.every((r) => r.passed)) {
            requestCompletion();
          }
        };

        return (
          <div className="max-w-6xl mx-auto">
            {/* Challenge Header */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 mb-8 border border-orange-200 dark:border-orange-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎯</span>
                <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {section.title}
                </h2>
              </div>

              <p className="text-orange-800 dark:text-orange-200 mb-4">
                Complete this coding challenge to test your understanding of DeFi
                concepts on Arbitrum.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Code Editor */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-300 dark:text-white">
                    Your Solution
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={runSimpleTest}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Test Code
                    </button>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {showSolution ? "Hide" : "Show"} Hint
                    </button>
                  </div>
                </div>

                <div className="h-96 border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
                  <CodeEditor
                    initialCode="// Write your code here\nfunction transferTokens() {\n  // TODO: Implement token transfer\n}"
                    language="javascript"
                    readOnly={false}
                    onChange={(value) => setUserCode(value || "")}
                  />
                </div>
              </div>

              {/* Test Results */}
              <div className="space-y-6">
                {testResults.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-300 dark:text-white mb-4">
                      Test Results
                    </h3>
                    <div className="space-y-2">
                      {testResults.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border ${result.passed
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {result.passed ? "✅" : "❌"}
                            </span>
                            <span
                              className={`font-medium ${result.passed
                                ? "text-green-700 dark:text-green-300"
                                : "text-red-700 dark:text-red-300"
                                }`}
                            >
                              {result.name}
                            </span>
                          </div>
                          <p
                            className={`text-sm mt-1 ${result.passed
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                              }`}
                          >
                            {result.message}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {completed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-center"
                  >
                    <div className="text-3xl mb-2">🎉</div>
                    <h4 className="text-lg font-bold text-green-700 dark:text-green-300 mb-1">
                      Challenge Complete!
                    </h4>
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      Great job! You've successfully completed this challenge.
                    </p>
                  </motion.div>
                )}

                {/* Hints */}
                {showSolution && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                      💡 Hints
                    </h4>
                    <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                      <li>
                        • Use the ethers.js library to interact with smart contracts
                      </li>
                      <li>• ERC-20 contracts have a standard transfer function</li>
                      <li>
                        • Always handle errors when dealing with blockchain
                        transactions
                      </li>
                      <li>
                        • Make sure to parse the amount correctly for the token
                        decimals
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Manual Completion */}
            {!completed && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-600 text-center">
                <p className="text-gray-300 mb-4">
                  Having trouble? You can skip this challenge for now and come back
                  later.
                </p>
                <button
                  onClick={() => {
                    if (!isAuthenticating) {
                      requestCompletion();
                    }
                  }}
                  disabled={isAuthenticating}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-70"
                >
                  {isAuthenticating ? "Connecting GitHub..." : "Skip Challenge"}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </GitHubAuthHandler>
  );
}

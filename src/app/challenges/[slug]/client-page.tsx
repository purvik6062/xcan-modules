"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CodeEditor from "../../components/CodeEditor";
import InstructionsPanel from "../../components/InstructionsPanel";
import TestResults from "../../components/TestResults";
import { Challenge, TestResult } from "../../types/challenge";

export default function ClientChallenge({
  challenge,
  slug,
}: {
  challenge: Challenge;
  slug: string | any;
}) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("instructions"); // instructions, tests
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  // Set the initial code when the component mounts
  useEffect(() => {
    if (challenge) {
      setCode(challenge.startingCode);
    }

    // Check for dark mode preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);

    // Load saved code for the challenge
    const savedCode = localStorage.getItem(`${slug}_code`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [challenge, slug]);

  // Handle editor mounting
  function handleEditorDidMount() {
    setEditorReady(true);
  }

  // Handle code changes
  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
    }
  }

  // Run the tests
  const runTests = () => {
    setIsLoading(true);
    setTestResults([]);
    setOutput("");

    // In a real implementation, this would connect to Arbitrum and execute the code
    // For demonstration, we're simulating with simplified checks
    setTimeout(() => {
      try {
        // IMPORTANT: In a real implementation, we would:
        // 1. Send the code to a backend for safe execution
        // 2. The backend would run the code against Arbitrum Sepolia
        // 3. Return the results securely

        // For the demo, we'll do some simple validation
        const results = challenge.testCases.map((testCase) => {
          // Simple check for type-based expectations
          let passed = false;
          let actual = "Not evaluated (simulation)";

          if (testCase.expectedOutput.type === "bigint") {
            // Check if the code attempts to return a BigInt
            passed =
              code.includes("return") &&
              (code.includes("BigInt") ||
                code.includes("await") ||
                code.includes(".arbBlockNumber()") ||
                code.includes(".arbChainID()") ||
                code.includes(".arbOSVersion()") ||
                code.includes(".getPricesInWei()"));
            actual = `${passed ? "Valid" : "Invalid"} BigInt return`;
          } else if (testCase.expectedOutput.hasProperties) {
            // Check if the code attempts to return an object with required properties
            const props = testCase.expectedOutput.hasProperties;
            passed =
              code.includes("return") &&
              code.includes("[") &&
              props.every(
                (prop: string) =>
                  code.includes(`version[${prop}]`) || code.includes("return [")
              );
            actual = `Array with ${passed ? "valid" : "missing"} properties`;
          } else if (testCase.expectedOutput.value) {
            // Check for specific expected value
            passed =
              code.includes(testCase.expectedOutput.value.toString()) ||
              code.includes(".arbChainID()");
            actual = passed
              ? "Likely correct implementation"
              : "Implementation may not return correct value";
          } else if (testCase.expectedOutput.type === "object") {
            // Check if it returns a transaction receipt
            passed =
              code.includes("return receipt") ||
              (code.includes("return") && code.includes("tx.wait()"));
            actual = passed
              ? "Valid transaction receipt return"
              : "Missing transaction receipt return";
          }

          return {
            description: testCase.description,
            input: JSON.stringify(testCase.input),
            expected: JSON.stringify(testCase.expectedOutput),
            actual,
            passed,
          };
        });

        setTestResults(results);

        // Calculate summary
        const passedCount = results.filter((r) => r.passed).length;
        const totalCount = results.length;

        // Set output message
        if (passedCount === totalCount) {
          setOutput(
            `Tests: ${passedCount}/${totalCount} passed! Note: This is a simulation. In production, your code would be executed against the actual Arbitrum network.`
          );
        } else {
          setOutput(
            `Tests: ${passedCount}/${totalCount} passed. Review your implementation and try again.`
          );
        }
      } catch (error: any) {
        setOutput(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Instructions Panel */}
      <div
        className={`${
          isFullScreen ? "hidden" : "w-2/5 lg:w-1/3"
        } bg-gray-900 text-white flex flex-col overflow-hidden`}
      >
        {/* Challenge title and navigation */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center mb-4">
            <Link
              href="/challenges"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`text-xs px-2 py-1 rounded ${getLevelBadgeStyle(
                challenge.level
              )}`}
            >
              {challenge.level}
            </span>
            <span className="bg-gray-800 rounded px-2 py-1 text-xs text-gray-300">
              {challenge.category}
            </span>
            <span className="bg-blue-900 text-blue-200 rounded px-2 py-1 text-xs">
              {challenge.precompileUsed}
            </span>
            <span className="bg-gray-800 rounded px-2 py-1 text-xs text-gray-300">
              {challenge.points} points
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 px-6 py-3">
          <div className="flex space-x-2">
            <button
              className={`px-3 py-2 rounded-md transition-colors ${
                activeTab === "instructions"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("instructions")}
            >
              Instructions
            </button>
            <button
              className={`px-3 py-2 rounded-md transition-colors ${
                activeTab === "tests"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("tests")}
            >
              Tests
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <p className="text-gray-300 mb-4">{challenge.description}</p>
          </div>

          {activeTab === "instructions" ? (
            <InstructionsPanel instructions={challenge.instructions} />
          ) : (
            <TestResults
              testCases={challenge.testCases}
              testResults={testResults}
              isLoading={isLoading}
              output={output}
              runTests={runTests}
            />
          )}
        </div>
      </div>

      {/* Right Side - Code Editor */}
      <div
        className={`${
          isFullScreen ? "w-full" : "w-3/5 lg:w-2/3"
        } flex flex-col bg-[#1e1e1e]`}
      >
        {/* File tabs */}
        <div className="bg-[#252526] px-4 flex items-center h-10 border-b border-[#3c3c3c]">
          <div className="flex items-center px-3 py-1 bg-[#1e1e1e] text-white text-sm border-t border-l border-r border-[#3c3c3c] rounded-t">
            {slug}.ts
          </div>

          <button
            onClick={toggleFullScreen}
            className="ml-auto text-gray-400 hover:text-white"
            title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          >
            {isFullScreen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          <CodeEditor
            defaultValue={challenge.startingCode}
            value={code}
            onChange={handleEditorChange}
            height="100%"
          />
        </div>

        {/* Bottom Panel */}
        <div className="bg-[#252526] border-t border-[#3c3c3c] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-300">Tests</div>
            <div className="flex space-x-2">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                onClick={() => setCode(challenge.startingCode)}
              >
                Reset
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white flex items-center px-4 py-1 rounded transition-colors"
                onClick={runTests}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Running...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12.0002L9.5 16.5002L19 7.00024"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-[#1e1e1e] p-3 rounded-md h-24 overflow-y-auto text-sm font-mono">
            {output ? (
              <div
                className={
                  output.includes("Error")
                    ? "text-red-400"
                    : output.includes("0/")
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {output}
              </div>
            ) : (
              <div className="text-gray-400">
                {isLoading
                  ? "Running tests..."
                  : "Complete the exercise and submit your solution."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

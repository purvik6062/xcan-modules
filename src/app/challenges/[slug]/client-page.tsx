"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CodeEditor from "../../components/CodeEditor";
import InstructionsPanel from "../../components/InstructionsPanel";
import TestResults from "../../components/TestResults";
import HintsPanel from "../../components/HintsPanel";
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
  const [activeTab, setActiveTab] = useState("instructions"); // instructions, hints, tests
  const [bottomPanelTab, setBottomPanelTab] = useState("tests"); // tests, console
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [verificationStage, setVerificationStage] = useState(0); // 0: none, 1: syntax, 2: execution, 3: analysis

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

  // Run the tests using our API endpoint
  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    setOutput("");
    setVerificationStage(1); // Start with syntax verification

    try {
      // Save the code to localStorage before running tests
      localStorage.setItem(`${slug}_code`, code);

      // Start syntax verification
      setTimeout(() => {
        setVerificationStage(2); // Move to test execution after a brief delay

        // Process code and execute tests
        const executeTests = async () => {
          try {
            // Modify the code to remove export statements for testing
            const modifiedCode = code.replace(
              /export\s+default\s+[^;]+;?/g,
              ""
            );

            // Send the code to our backend API for execution
            const response = await fetch("/api/execute-challenge", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code: modifiedCode,
                slug,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to execute tests");
            }

            const data = await response.json();

            // Move to results analysis
            setVerificationStage(3);

            // Short delay before showing final results
            setTimeout(() => {
              // Update the UI with the test results
              setTestResults(data.testResults);
              setOutput(data.summary);
              setIsLoading(false);

              // If there are console logs, switch to the console tab
              const hasLogs = data.testResults.some(
                (result: TestResult) => result.logs && result.logs.length > 0
              );
              if (hasLogs) {
                setBottomPanelTab("console");
              }
            }, 500);
          } catch (error: any) {
            console.error("Error running tests:", error);
            setOutput(`Error: ${error.message}`);
            setIsLoading(false);
          }
        };

        executeTests();
      }, 1000);
    } catch (error: any) {
      console.error("Error running tests:", error);
      setOutput(`Error: ${error.message}`);
      setIsLoading(false);
    }
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

  // Get default hints if not provided
  const defaultHints = [
    "Check the instructions carefully. What specific precompile address are you supposed to use?",
    "Remember to define the correct ABI for the function you're trying to call.",
    "The return value structure matters. Make sure you're returning exactly what the test expects.",
    "If you're struggling with a specific function, try reading the Arbitrum documentation for that precompile.",
    "Double-check your parameter types. Blockchain functions are very sensitive to exact data types.",
  ];

  // Use challenge hints if available, otherwise use default hints
  const hints = challenge.hints || defaultHints;

  // Collect all logs from test results for display in console tab
  const allLogs = testResults.flatMap((result) => result.logs || []);

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
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
                activeTab === "instructions"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("instructions")}
            >
              Instructions
            </button>

            <button
              className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
                activeTab === "tests"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("tests")}
            >
              Tests
            </button>
            <button
              className={`ml-auto px-3 py-2 rounded-md transition-colors cursor-pointer ${
                activeTab === "hints"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("hints")}
            >
              💡
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
          ) : activeTab === "hints" ? (
            <HintsPanel hints={hints} />
          ) : (
            <TestResults
              testCases={challenge.testCases}
              testResults={testResults}
              isLoading={isLoading}
              output={output}
              runTests={runTests}
              verificationStage={verificationStage}
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
        <div className="flex-1 overflow-hidden h-[60%]">
          <CodeEditor
            defaultValue={challenge.startingCode}
            value={code}
            onChange={handleEditorChange}
            height="100%"
          />
        </div>

        {/* Bottom Panel */}
        <div className="bg-[#252526] border-t border-[#3c3c3c] p-4 h-[40%]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex space-x-4">
              <button
                className={`text-sm font-medium ${
                  bottomPanelTab === "tests"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setBottomPanelTab("tests")}
              >
                Tests
              </button>
              <button
                className={`text-sm font-medium ${
                  bottomPanelTab === "console"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-300"
                } flex items-center`}
                onClick={() => setBottomPanelTab("console")}
              >
                Console
                {allLogs.length > 0 && bottomPanelTab !== "console" && (
                  <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>
            </div>
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

          {bottomPanelTab === "tests" ? (
            <div className="bg-[#1e1e1e] p-3 rounded-md overflow-y-auto h-full max-h-[calc(100%-40px)] text-sm font-mono">
              {output ? (
                <div
                  className={
                    output.includes("Error")
                      ? "text-red-400"
                      : output.includes("❌")
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
          ) : (
            <div className="bg-[#1e1e1e] p-3 rounded-md overflow-y-auto h-full max-h-[calc(100%-40px)]">
              {allLogs.length > 0 ? (
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                  {allLogs.map((log, index) => (
                    <div
                      key={index}
                      className={
                        log.startsWith("ERROR:")
                          ? "text-red-400"
                          : log.startsWith("WARN:")
                          ? "text-yellow-400"
                          : "text-green-400"
                      }
                    >
                      {log}
                    </div>
                  ))}
                </pre>
              ) : (
                <div className="text-gray-400 text-sm">
                  No console output yet. Run your code to see logs here.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import CodeEditor from "../../components/CodeEditor";
import InstructionsPanel from "../../components/InstructionsPanel";
import TestResults from "../../components/TestResults";
import { Challenge, TestResult } from "../../types/challenge";
import { challengesData, challengePreviews } from "../../data/challenges";

export default function ClientChallenge({
  challenge,
  slug,
}: {
  challenge: Challenge;
  slug: string | any;
}) {
  // Find adjacent challenges for navigation
  const { prevChallenge, nextChallenge } = useMemo(() => {
    // Get all challenge slugs sorted by ID
    const sortedChallenges = challengePreviews.sort((a, b) => a.id - b.id).map(c => c.slug);
    
    // Find the index of the current challenge
    const currentIndex = sortedChallenges.indexOf(slug);
    
    // Get previous and next challenges
    const prevChallenge = currentIndex > 0 ? sortedChallenges[currentIndex - 1] : null;
    const nextChallenge = currentIndex < sortedChallenges.length - 1 ? sortedChallenges[currentIndex + 1] : null;
    
    return { prevChallenge, nextChallenge };
  }, [slug]);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("instructions"); // instructions, tests
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    
    // Add click event listener for closing sidebar when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.addEventListener('mousedown', handleClickOutside);
    };
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
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen relative my-3">
      {sidebarOpen && (
        <div 
          ref={sidebarRef}
          className="absolute top-0 left-0 z-10 h-full w-64 bg-white dark:bg-[#152241] border-r border-gray-200 dark:border-gray-700 overflow-y-auto shadow-lg transition-all duration-300 ease-in-out"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Challenge List</h3>
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {Object.entries(challengesData).map(([key, challengeItem]) => (
                <li key={key}>
                  <Link
                    href={`/challenges/${key}`}
                    className={`block px-4 py-2 rounded-md ${slug === key ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'}`}
                  >
                    {challengeItem.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Instructions Panel */}
        <div
          className={`${
            isFullScreen ? "hidden" : "w-2/5 lg:w-1/3"
          } bg-white dark:bg-[#101828] text-gray-900 dark:text-white border-r border-gray-200 dark:border-[#152241] flex flex-col overflow-hidden`}
        >
        {/* Challenge title and navigation */}
        <div className="p-6 border-b border-gray-200 dark:border-[#152241] bg-gray-50 dark:bg-[#0c111e]">
          <div className="flex items-center mb-4">
            <button
              onClick={toggleSidebar}
              className="inline-flex hover:cursor-pointer items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-2"
              aria-label="Show challenge list"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <Link
              href="/challenges"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-2"
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{challenge.title}</h1>
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
        <div className="bg-gray-100 dark:bg-[#0c111e] px-6 py-3 border-b border-gray-200 dark:border-[#152241]">
          <div className="flex space-x-2">
            <button
              className={`hover:cursor-pointer px-3 py-2 rounded-md transition-colors ${
                activeTab === "instructions"
                  ? "bg-white dark:bg-[#152241] text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#152241] hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => setActiveTab("instructions")}
            >
              Instructions
            </button>
            <button
              className={`hover:cursor-pointer px-3 py-2 rounded-md transition-colors ${
                activeTab === "tests"
                  ? "bg-white dark:bg-[#152241] text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#152241] hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => setActiveTab("tests")}
            >
              Tests
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#101828]">
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 mb-4">{challenge.description}</p>
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
        } flex flex-col bg-[#1e1e1e] dark:bg-[#101828]`}
      >
        {/* File tabs */}
        <div className="bg-[#252526] dark:bg-[#0c111e] px-4 flex items-center h-10 border-b border-[#3c3c3c] dark:border-[#152241]">
          <div className="flex items-center px-3 py-1 bg-[#1e1e1e] dark:bg-[#101828] text-white text-sm border-t border-l border-r border-[#3c3c3c] dark:border-[#152241] rounded-t">
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
        <div className="bg-[#252526] dark:bg-[#0c111e] border-t border-[#3c3c3c] dark:border-[#152241] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-300 dark:text-gray-200">Tests</div>
            <div className="flex space-x-2">
              <button
                className="bg-gray-700 hover:cursor-pointer dark:bg-[#152241] hover:bg-gray-600 dark:hover:bg-[#1c2e54] text-white px-3 py-1 rounded text-sm transition-colors"
                onClick={() => setCode(challenge.startingCode)}
              >
                Reset
              </button>
              <button
                className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white flex items-center px-4 py-1 rounded transition-colors neon-border"
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Run Tests
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Challenge Navigation */}
          <div className="flex justify-between mt-4 mb-2">
            {prevChallenge ? (
              <Link
                href={`/challenges/${prevChallenge}`}
                className="bg-gray-700 hover:cursor-pointer dark:bg-[#152241] hover:bg-gray-600 dark:hover:bg-[#1c2e54] text-white flex items-center px-4 py-2 rounded transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Previous Challenge
              </Link>
            ) : (
              <div></div> 
            )}
            
            {nextChallenge ? (
              <Link
                href={`/challenges/${nextChallenge}`}
                className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded transition-colors"
              >
                Next Challenge
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            ) : (
              <div></div> 
            )}
          </div>
          
          <div className="bg-[#101828] p-3 rounded-md h-24 overflow-y-auto text-sm font-mono">
            {output && (
              <div
                className={`mt-4 p-4 rounded-md text-sm border ${
                  output.includes("passed!") || output.includes(`${challenge.testCases.length}/${challenge.testCases.length} passed`)
                    ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/50"
                    : "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/50"
                }`}
              >
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">
                    {output.includes("passed!") || output.includes(`${challenge.testCases.length}/${challenge.testCases.length} passed`) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  {output}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

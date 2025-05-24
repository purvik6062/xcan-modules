"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import CodeEditor from "../../components/CodeEditor";
import InstructionsPanel from "../../components/InstructionsPanel";
import TestResults from "../../components/TestResults";
import HintsPanel from "../../components/HintsPanel";
import SuccessModal from "../../components/SuccessModal";
import { Challenge, TestResult } from "../../types/challenge";
import { challengesData, challengePreviews } from "../../data/challenges";
import { motion, AnimatePresence } from "framer-motion";
import { FiAward, FiZap, FiCpu, FiCode, FiBookOpen, FiHelpCircle, FiTerminal, FiPlayCircle, FiCheck, FiRefreshCw, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize, FiList, FiInfo, FiTarget, FiGift } from "react-icons/fi";
import { GoBeaker, GoFlame, GoPulse, GoTrophy, GoRocket, GoStar, GoLightBulb } from "react-icons/go";
import { FiX } from "react-icons/fi";

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
    const sortedChallenges = challengePreviews
      .sort((a, b) => a.id - b.id)
      .map((c) => c.slug);

    // Find the index of the current challenge
    const currentIndex = sortedChallenges.indexOf(slug);

    // Get previous and next challenges
    const prevChallenge =
      currentIndex > 0 ? sortedChallenges[currentIndex - 1] : null;
    const nextChallenge =
      currentIndex < sortedChallenges.length - 1
        ? sortedChallenges[currentIndex + 1]
        : null;

    return { prevChallenge, nextChallenge };
  }, [slug]);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("instructions"); // instructions, hints, tests
  const [bottomPanelTab, setBottomPanelTab] = useState("tests"); // tests, console
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [verificationStage, setVerificationStage] = useState(0); // 0: none, 1: syntax, 2: execution, 3: analysis
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [showHintPopup, setShowHintPopup] = useState(false);

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
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Show hint popup after 10 seconds if user hasn't submitted code
    const hintTimer = setTimeout(() => {
      if (!codeSubmitted) {
        setShowHintPopup(true);
      }
    }, 10000);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(hintTimer);
    };
  }, [challenge, slug, codeSubmitted]);

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
              setCodeSubmitted(true);
              
              // Check if all tests passed
              const allPassed = data.testResults.every((result: TestResult) => result.passed);
              setAllTestsPassed(allPassed);
              
              // Show success modal if all tests passed
              if (allPassed) {
                setTimeout(() => setShowSuccessModal(true), 1000);
              }

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
  const allLogs = testResults.reduce((logs, result) => {
    // If we've already printed this exact result's logs in another test case, don't duplicate
    if (!result.logs || !result.logs.length) return logs;

    // Use a Set to eliminate duplicates
    const uniqueLogs = new Set([...logs]);
    result.logs.forEach((log) => uniqueLogs.add(log));

    return Array.from(uniqueLogs);
  }, [] as string[]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#070d1b] to-[#102247] text-white">
        <AnimatePresence>
          {sidebarOpen && (
          <motion.div 
            ref={sidebarRef}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ 
              type: "tween", 
              duration: 0.25, 
              ease: "easeOut"
            }}
            className="absolute top-0 left-0 z-10 h-full w-72 bg-[#0e1a35] border-r border-[#1d315e] overflow-y-auto shadow-lg rounded-r-xl"
          >
          <div className="p-5 border-b border-[#1d315e] flex items-center justify-between bg-[#0a142a]">
            <div className="flex items-center">
              <GoTrophy className="text-yellow-400 text-2xl mr-2" />
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Challenge Quest</h3>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:cursor-pointer hover:text-white bg-[#1d315e] hover:bg-[#2a407a] p-2 rounded-full transition-all duration-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {Object.entries(challengesData).map(([key, challengeItem], index) => (
                <li key={key}>
                  <Link
                    href={`/challenges/${key}`}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${slug === key ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-[#152241] text-gray-300'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${slug === key ? 'bg-blue-700' : 'bg-[#1d315e]'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{challengeItem.title}</div>
                      <div className="text-xs opacity-70 mt-1">{challengeItem.category} • {challengeItem.points} pts</div>
                    </div>
                    {slug === key && <FiCheck className="ml-auto text-teal-400" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Instructions Panel */}
        <div
          className={`${
            isFullScreen ? "hidden" : "w-2/5 lg:w-2/5"
          } bg-white dark:bg-[#101828] text-gray-900 dark:text-white border-r border-gray-200 dark:border-[#152241] flex flex-col overflow-hidden`}
        >
        {/* Challenge title and navigation */}
        <div className="p-6 border-b border-gray-200 dark:border-[#152241] bg-gray-50 dark:bg-[#0c111e]">
          <div className="flex items-center mb-4">
            <button
              onClick={toggleSidebar}
              className="inline-flex hover:cursor-pointer items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mr-2 cursor-pointer"
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
              className={`text-xs px-3 py-1.5 rounded-full flex items-center ${getLevelBadgeStyle(
                challenge.level
              )}`}
            >
              {challenge.level === "Beginner" && <GoFlame className="mr-1.5" />}
              {challenge.level === "Intermediate" && <GoPulse className="mr-1.5" />}
              {challenge.level === "Advanced" && <GoBeaker className="mr-1.5" />}
              {challenge.level}
            </span>
            <span className="bg-indigo-900/50 border border-indigo-700 rounded-full px-3 py-1.5 text-xs flex items-center text-indigo-200">
              <FiCpu className="mr-1.5" />
              {challenge.category}
            </span>
            <span className="bg-blue-900/50 border border-blue-700 rounded-full px-3 py-1.5 text-xs flex items-center text-blue-200">
              <FiCode className="mr-1.5" />
              {challenge.precompileUsed}
            </span>
            <span className="bg-purple-900/50 border border-purple-700 rounded-full px-3 py-1.5 text-xs flex items-center text-purple-200">
              <FiAward className="mr-1.5" />
              {challenge.points} XP
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gradient-to-r from-[#0a142a] to-[#0f1d3a] px-6 py-4 border-b border-[#152241]">
          <div className="flex space-x-3">
            <button
              className={`px-4 py-2.5 rounded-md transition-all duration-200 flex items-center cursor-pointer ${
                activeTab === "instructions"
                  ? "bg-blue-700/30 border border-blue-700/50 text-blue-300 shadow-md shadow-blue-900/20"
                  : "text-gray-300 border border-transparent hover:bg-[#152241] hover:text-white"
              }`}
              onClick={() => setActiveTab("instructions")}
            >
              <FiBookOpen className="mr-2 cursor-pointer" />
              Instructions
            </button>

            <button
              className={`px-4 py-2.5 rounded-md transition-all duration-200 flex items-center cursor-pointer ${
                activeTab === "tests"
                  ? "bg-teal-700/30 border border-teal-700/50 text-teal-300 shadow-md shadow-teal-900/20"
                  : "text-gray-300 border border-transparent hover:bg-[#152241] hover:text-white"
              }`}
              onClick={() => setActiveTab("tests")}
            >
              <FiTerminal className="mr-2" />
              Test Cases
            </button>
            
            <button
              className={`ml-auto px-4 py-2.5 rounded-md transition-all duration-200 flex items-center cursor-pointer ${
                activeTab === "hints"
                  ? "bg-yellow-700/30 border border-yellow-700/50 text-yellow-300 shadow-md shadow-yellow-900/20"
                  : "text-gray-300 border border-transparent hover:bg-[#152241] hover:text-white"
              }`}
              onClick={() => setActiveTab("hints")}
            >
              <FiHelpCircle className="mr-2 cursor-pointer" />
              Hints
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0a142a]">
          <div className="mb-6">
            <p className="text-gray-300 mb-4 leading-relaxed">{challenge.description}</p>
            <div className="h-1 w-20 bg-blue-700 rounded-full mt-2 mb-6"></div>
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
          isFullScreen ? "w-full" : "w-3/5 lg:w-3/5"
        } flex flex-col bg-[#0c1425] relative overflow-hidden`}
      >
        {/* Decorative elements for gamified UI */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 right-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-60 h-60 bg-indigo-600 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-700 rounded-full filter blur-3xl"></div>
        </div>
        {/* File tabs with enhanced styling */}
        <div className="bg-gradient-to-r from-[#0c111e] to-[#0f1d3a] px-4 flex items-center h-12 border-b border-[#1c2c52]">
          <div className="flex items-center px-4 py-1.5 bg-[#152241] text-blue-300 text-sm border-t border-l border-r border-[#2c3e69] rounded-t-md shadow-inner shadow-blue-500/10">
            <FiCode className="mr-2 text-blue-400" />
            {slug}.ts
          </div>

          <div className="flex items-center ml-auto space-x-2">
            <button
              onClick={() => setCode(challenge.startingCode)}
              className="flex items-center px-3 py-1.5 bg-[#152241] hover:bg-[#1c2c52] text-gray-300 hover:text-white text-sm rounded-md transition-colors border border-[#2c3e69] cursor-pointer"
              title="Reset Code"
            >
              <FiRefreshCw className="mr-1.5 text-gray-400 cursor-pointer" />
              Reset
            </button>
            
            <button
              onClick={toggleFullScreen}
              className="flex items-center px-3 py-1.5 bg-[#152241] hover:bg-[#1c2c52] text-gray-300 hover:text-white text-sm rounded-md transition-colors border border-[#2c3e69] cursor-pointer"
              title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
            >
              {isFullScreen ? <FiMinimize className="mr-1.5 text-gray-400 cursor-pointer" /> : <FiMaximize className="mr-1.5 text-gray-400 cursor-pointer" />}
              {isFullScreen ? "Exit" : "Expand"}
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 200px)' }}>
          <CodeEditor
            defaultValue={challenge.startingCode}
            value={code}
            onChange={handleEditorChange}
          />
        </div>

        {/* Bottom Panel with enhanced styling */}
        <div className="bg-gradient-to-r from-[#0c111e] to-[#0f1d3a] border-t border-[#1c2c52] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-1">
              <button
                className={`text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer ${
                  bottomPanelTab === "tests"
                    ? "bg-blue-800/30 text-blue-300 border border-blue-700/50"
                    : "text-gray-400 hover:text-gray-300 border border-transparent hover:bg-[#152241]"
                }`}
                onClick={() => setBottomPanelTab("tests")}
              >
                <FiPlayCircle className="mr-2 cursor-pointer" />
                Test Results
              </button>
              <button
                className={`text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer ${
                  bottomPanelTab === "console"
                    ? "bg-purple-800/30 text-purple-300 border border-purple-700/50"
                    : "text-gray-400 hover:text-gray-300 border border-transparent hover:bg-[#152241]"
                }`}
                onClick={() => setBottomPanelTab("console")}
              >
                <FiTerminal className="mr-2 cursor-pointer" />
                Console
                {allLogs.length > 0 && bottomPanelTab !== "console" && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center bg-purple-700 text-white text-xs rounded-full">{allLogs.length}</span>
                )}
              </button>
            </div>
            <button
              className={`bg-gradient-to-r cursor-pointer ${isLoading ? 'from-blue-700 to-indigo-700 animate-pulse' : 'from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500'} text-white flex items-center px-6 py-2.5 rounded-md transition-all duration-300 font-medium shadow-lg shadow-blue-900/30 border border-blue-500/30`}
              onClick={runTests}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  Running Challenge...
                </>
              ) : (
                <>
                  <FiZap className="mr-2 text-xl" />
                  Submit Solution
                </>
              )}
            </button>
          </div>

          <div className="flex justify-between mt-4 mb-2">
            {prevChallenge ? (
              <Link
                href={`/challenges/${prevChallenge}`}
                className="bg-[#152241] hover:bg-[#1c2c52] text-white flex items-center px-5 py-2.5 rounded-md transition-all duration-200 border border-[#2c3e69] shadow-md shadow-blue-900/10 group"
              >
                <FiChevronLeft className="mr-2 group-hover:animate-pulse" />
                Previous Quest
              </Link>
            ) : (
              <div></div> 
            )}
            
            {nextChallenge ? (
              <Link
                href={`/challenges/${nextChallenge}`}
                className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center px-5 py-2.5 rounded-md transition-all duration-200 border border-blue-500/30 shadow-md shadow-blue-900/20 group"
              >
                Next Quest
                <FiChevronRight className="ml-2 group-hover:animate-pulse" />
              </Link>
            ) : (
              <div></div> 
            )}
          </div>

          {bottomPanelTab === "tests" ? (
            <div className="bg-[#0a142a] p-4 rounded-lg overflow-y-auto h-full max-h-[calc(100%-40px)] text-sm font-mono border border-[#1c2c52] shadow-inner shadow-blue-900/10">
              {output ? (
                <div
                  className={
                    output.includes("Error")
                      ? "text-red-400 p-3 border border-red-900/50 bg-red-900/20 rounded-md"
                      : output.includes("❌")
                      ? "text-red-400 p-3 border border-red-900/50 bg-red-900/20 rounded-md"
                      : "text-green-400 p-3 border border-green-900/50 bg-green-900/20 rounded-md"
                  }
                >
                  {/* Add emoji indicators for test results */}
                  {output.includes("Error") && "🚫 "}
                  {output.includes("❌") && !output.includes("Error") && "❌ "}
                  {!output.includes("Error") && !output.includes("❌") && "✅ "}
                  {output}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-blue-400 text-lg">Running tests...</p>
                      <p className="text-gray-500 text-sm mt-2">Evaluating your blockchain magic ✨</p>
                    </div>
                  ) : (
                    <>
                      <FiPlayCircle className="text-4xl text-blue-500 mb-3" />
                      <p className="text-gray-300 mb-2">Ready to test your solution?</p>
                      <p className="text-gray-500 text-sm">Complete the exercise and submit to check your results.</p>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0a142a] p-4 rounded-lg overflow-y-auto h-full max-h-[calc(100%-40px)] border border-[#1c2c52] shadow-inner shadow-purple-900/10">
              {allLogs.length > 0 ? (
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {allLogs.map((log, index) => (
                    <div
                      key={index}
                      className={
                        log.startsWith("ERROR:")
                          ? "text-red-400 py-1 px-2 my-1 border-l-2 border-red-500 bg-red-900/20 rounded-r-md"
                          : log.startsWith("WARN:")
                          ? "text-yellow-400 py-1 px-2 my-1 border-l-2 border-yellow-500 bg-yellow-900/20 rounded-r-md"
                          : "text-green-400 py-1 px-2 my-1 border-l-2 border-green-500 bg-green-900/20 rounded-r-md"
                      }
                    >
                      {/* Add emoji indicators for log types */}
                      {log.startsWith("ERROR:") && "🛑 "}
                      {log.startsWith("WARN:") && "⚠️ "}
                      {!log.startsWith("ERROR:") && !log.startsWith("WARN:") && "🔹 "}
                      {log}
                    </div>
                  ))}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FiTerminal className="text-4xl text-purple-500 mb-3" />
                  <p className="text-gray-300 mb-2">Console Output</p>
                  <p className="text-gray-500 text-sm">No logs yet. Submit your solution to see output here.</p>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
      
      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        challenge={challenge}
      />

      {/* Hint Popup */}
      <AnimatePresence>
        {showHintPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-600 to-amber-600 p-1 rounded-lg shadow-lg z-50"
          >
            <div className="bg-[#0e1a35] p-4 rounded-lg border border-yellow-500/30 max-w-xs">
              <div className="flex items-start mb-3">
                <div className="bg-yellow-600/30 p-2 rounded-full mr-3">
                  <GoLightBulb className="text-yellow-400 text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-yellow-400 font-medium">Need a hint?</h4>
                  <p className="text-gray-300 text-sm mt-1">Stuck on this challenge? Check out the hints tab for guidance!</p>
                </div>
                <button 
                  onClick={() => setShowHintPopup(false)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  <FiX />
                </button>
              </div>
              <button
                onClick={() => {
                  setActiveTab("hints");
                  setShowHintPopup(false);
                }}
                className="w-full cursor-pointer bg-yellow-700/50 hover:bg-yellow-700 text-yellow-300 py-2 rounded-md text-sm font-medium transition-colors"
              >
                View Hints
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

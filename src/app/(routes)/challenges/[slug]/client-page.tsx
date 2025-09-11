"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import CodeEditor from "../../../../components/CodeEditor";
import InstructionsPanel from "../../../../components/InstructionsPanel";
import TestResults from "../../../../components/TestResults";
import HintsPanel from "../../../../components/HintsPanel";
import SuccessModal from "../../../../components/SuccessModal";
import { Challenge, TestResult } from "../../../../types/challenge";
import { challengesData, challengePreviews } from "../../../../data/challenges";
import { motion, AnimatePresence } from "framer-motion";
import { FiAward, FiZap, FiCpu, FiCode, FiBookOpen, FiHelpCircle, FiTerminal, FiPlayCircle, FiCheck, FiRefreshCw, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize, FiList, FiInfo, FiTarget, FiGift } from "react-icons/fi";
import { GoBeaker, GoFlame, GoPulse, GoTrophy, GoRocket, GoStar, GoLightBulb } from "react-icons/go";
import { FiX } from "react-icons/fi";
import { useWalletProtection } from "../../../../hooks/useWalletProtection";

export default function ClientChallenge({
  challenge,
  slug,
}: {
  challenge: Challenge;
  slug: string | any;
}) {
  // Find adjacent challenges for navigation
  const { prevChallenge, nextChallenge } = useMemo(() => {
    const sortedChallenges = challengePreviews
      .sort((a, b) => a.id - b.id)
      .map((c) => c.slug);
    const currentIndex = sortedChallenges.indexOf(slug);
    const prevChallenge = currentIndex > 0 ? sortedChallenges[currentIndex - 1] : null;
    const nextChallenge = currentIndex < sortedChallenges.length - 1 ? sortedChallenges[currentIndex + 1] : null;
    return { prevChallenge, nextChallenge };
  }, [slug]);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("instructions");
  const [bottomPanelTab, setBottomPanelTab] = useState("tests");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [verificationStage, setVerificationStage] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [showHintPopup, setShowHintPopup] = useState(false);
  const { address } = useWalletProtection();
  const [initiatingGithub, setInitiatingGithub] = useState(false);

  // Capture GitHub params from callback and store in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const ghUser = url.searchParams.get("github_username");
    if (ghUser) localStorage.setItem("github_username", ghUser);
  }, []);

  const ensureGitHubAuth = async () => {
    if (!address) return false;
    const existing = typeof window !== "undefined" ? localStorage.getItem("github_username") : null;
    if (existing) return true;
    if (initiatingGithub) return false;
    try {
      setInitiatingGithub(true);
      const returnTo = encodeURIComponent(window.location.href);
      const res = await fetch(`/api/auth/github?wallet_address=${address}&return_to=${returnTo}`);
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
        return false;
      }
    } catch (e) {
      console.error("Failed to start GitHub OAuth", e);
    } finally {
      setInitiatingGithub(false);
    }
    return false;
  };

  useEffect(() => {
    if (challenge) {
      setCode(challenge.startingCode);
    }
    const savedCode = localStorage.getItem(`${slug}_code`);
    if (savedCode) {
      setCode(savedCode);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
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

  function handleEditorDidMount() {
    setEditorReady(true);
  }

  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
    }
  }

  const runTests = async () => {
    // Require GitHub only when submitting solution, if wallet is connected
    // if (address && !localStorage.getItem("github_username")) {
    //   await ensureGitHubAuth();
    //   return;
    // }
    setIsLoading(true);
    setTestResults([]);
    setOutput("");
    setVerificationStage(1);
    try {
      localStorage.setItem(`${slug}_code`, code);
      setTimeout(() => {
        setVerificationStage(2);
        const executeTests = async () => {
          try {
            const modifiedCode = code.replace(/export\s+default\s+[^;]+;?/g, "");
            const response = await fetch("/api/execute-challenge", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: modifiedCode, slug, userAddress: address || null, level: challenge.level, points: challenge.points }),
            });
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to execute tests");
            }
            const data = await response.json();
            console.log("Raw testResults logs:", data.testResults.map((r: any) => r.logs)); // Debug log
            setVerificationStage(3);
            setTimeout(() => {
              setTestResults(data.testResults);
              setOutput(data.summary);
              setIsLoading(false);
              setCodeSubmitted(true);
              const allPassed = data.testResults.every((result: TestResult) => result.passed);
              setAllTestsPassed(allPassed);
              if (allPassed) {
                setTimeout(() => setShowSuccessModal(true), 1000);
              }
              const hasLogs = data.testResults.some((result: TestResult) => result.logs && result.logs.length > 0);
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

  // Load prior results for this challenge and user
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (!address) return;
        const res = await fetch(`/api/execute-challenge?userAddress=${address}&slug=${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.result?.testResults && Array.isArray(data.result.testResults)) {
          setTestResults(data.result.testResults);
          setOutput(data.result.summary || "");
          const allPassed = data.result.testResults.every((r: any) => r.passed);
          setAllTestsPassed(allPassed);
          setCodeSubmitted(true);
        }
      } catch (e) {
        // ignore progress fetch errors in UI
      }
    };
    fetchProgress();
  }, [address, slug]);

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-900 text-green-200";
      case "Intermediate": return "bg-yellow-900 text-yellow-200";
      case "Advanced": return "bg-red-900 text-red-200";
      default: return "bg-gray-900 text-gray-200";
    }
  };

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const defaultHints = [
    "Check the instructions carefully. What specific precompile address are you supposed to use?",
    "Remember to define the correct ABI for the function you're trying to call.",
    "The return value structure matters. Make sure you're returning exactly what the test expects.",
    "If you're struggling with a specific function, try reading the Arbitrum documentation for that precompile.",
    "Double-check your parameter types. Blockchain functions are very sensitive to exact data types.",
  ];
  const hints = challenge.hints || defaultHints;

  const allLogs = testResults.reduce((logs, result) => {
    if (!result.logs || !result.logs.length) return logs;
    result.logs.forEach((log) => logs.push(log));
    return logs;
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
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="absolute top-0 left-0 z-10 h-full w-72 bg-[#0e1a35] border-r border-[#1d315e] overflow-y-auto shadow-lg rounded-r-xl"
          >
            <div className="p-5 border-b border-[#1d315e] flex items-center justify-between bg-[#0a142a]">
              <div className="flex items-center">
                <GoTrophy className="text-yellow-400 text-2xl mr-2" />
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-[#86BEF9] bg-clip-text text-transparent">Challenge Quest</h3>
              </div>
              <button
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-white bg-[#1d315e] hover:bg-[#2a407a] p-2 rounded-full transition-all duration-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {Object.entries(challengesData).map(([key, challengeItem], index) => (
                  <li key={key}>
                    <Link
                      href={`/challenges/${key}`}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${slug === key ? 'bg-gradient-to-r from-blue-900 to-blue-900 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-blue-800 text-gray-300'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${slug === key ? 'bg-blue-[#010335]' : 'bg-[#1d315e]'}`}>
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
        {/* New Vertical Navigation Sidebar */}
        <div className="w-16 bg-[#040e24] border-r border-[#1D315E] flex flex-col items-center py-4 space-y-4">
          {/* Menu Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 bg-[#152241] hover:bg-[#1c2c52] rounded-lg flex items-center justify-center transition-all duration-200 group border border-[#2c3e69] hover:border-blue-500/50 cursor-pointer"
            title="Toggle Challenge List"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Back to Challenges Button */}
          <Link
            href="/challenges"
            className="w-8 h-8 bg-[#152241] hover:bg-[#1c2c52] rounded-lg flex items-center justify-center transition-all duration-200 group border border-[#2c3e69] hover:border-purple-500/50"
            title="Back to Challenges"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>

          {/* Decorative separator */}
          <div className="w-6 h-px bg-gradient-to-r from-transparent via-[#2c3e69] to-transparent"></div>
        </div>

        {/* Left Sidebar - Instructions Panel */}
        <div className={`${isFullScreen ? "hidden" : "w-2/5 lg:w-2/5"} bg-[#101828] text-white border-r border-[#152241] flex flex-col overflow-hidden h-full`}>
          <div className="p-6 border-b border-[#152241] bg-[#0c111e]">
            <div className="flex items-center mb-4">
              <h1 className="text-2xl font-semibold text-gray-100">{challenge.title}</h1>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs text-blue-200 px-3 py-1.5 rounded-full flex items-center ${getLevelBadgeStyle(challenge.level)}`}>
                {challenge.level === "Beginner" && <GoFlame className="mr-1.5" />}
                {challenge.level === "Intermediate" && <GoPulse className="mr-1.5" />}
                {challenge.level === "Advanced" && <GoBeaker className="mr-1.5" />}
                {challenge.level}
              </span>
              <span className="bg-blue-900/50 border border-blue-700 rounded-full px-3 py-1.5 text-xs flex items-center text-blue-200">
                <FiCpu className="mr-1.5" />
                {challenge.category}
              </span>
              <span className="bg-blue-900/50 border border-blue-[#010335] rounded-full px-3 py-1.5 text-xs flex items-center text-blue-200">
                <FiCode className="mr-1.5" />
                {challenge.precompileUsed}
              </span>
              <span className="bg-purple-900/50 border border-purple-700 rounded-full px-3 py-1.5 text-xs flex items-center text-purple-200">
                <FiAward className="mr-1.5" />
                {challenge.points} XP
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#0a142a] to-[#0f1d3a] px-6 py-4 border-b border-[#152241]">
            <div className="flex space-x-3">
              <button className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer ${activeTab === "instructions" ? "bg-blue-[#010335]/30 border border-blue-[#010335]/50 text-blue-300 shadow-md shadow-blue-900/20" : "text-gray-300 border border-transparent hover:bg-[#152241] hover:text-white"}`} onClick={() => setActiveTab("instructions")}>
                <FiBookOpen className="mr-2 cursor-pointer" />
                Instructions
              </button>
              <button className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer ${activeTab === "tests" ? "bg-teal-700/30 border border-teal-700/50 text-teal-300 shadow-md shadow-teal-900/20" : "text-gray-300 border border-transparent hover:bg-[#152241] hover:text-white"}`} onClick={() => setActiveTab("tests")}>
                <FiTerminal className="mr-2" />
                Test Cases
              </button>
              <button className={`ml-auto px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer ${activeTab === "hints" ? "bg-yellow-700/30 border border-yellow-700/50 text-yellow-300 shadow-md shadow-yellow-900/20" : "text-gray-300 border border-transparent hover:bg-[#152241] hover:text-white"}`} onClick={() => setActiveTab("hints")}>
                <FiHelpCircle className="mr-2 cursor-pointer" />
                Hints
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto h-[100vh] p-[1.5rem] bg-[#0a142a]">
            <div className="mb-6">
              <p className="text-gray-300 mb-4 leading-relaxed">{challenge.description}</p>
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
        <div className={`${isFullScreen ? "w-full" : "w-3/5 lg:w-3/5"} flex flex-col bg-[#0c1425] overflow-hidden h-full`}>
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-20 right-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-40 right-20 w-60 h-60 bg-blue-600 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-700 rounded-full filter blur-3xl"></div>
          </div>
          <div className="bg-gradient-to-r from-[#0c111e] to-[#0f1d3a] px-4 flex items-center h-12 border-b border-[#1c2c52]">
            <div className="flex items-center px-4 py-1.5 bg-[#152241] text-blue-300 text-sm border-t border-l border-r border-[#2c3e69] rounded-t-md shadow-inner shadow-blue-500/10">
              <FiCode className="mr-2 text-blue-400" />
              {slug}.ts
            </div>
            <div className="flex items-center ml-auto space-x-2">
              <button onClick={() => setCode(challenge.startingCode)} className="flex items-center px-3 py-1.5 bg-[#152241] hover:bg-[#1c2c52] text-gray-300 hover:text-white text-sm rounded-md transition-colors border border-[#2c3e69] cursor-pointer" title="Reset Code">
                <FiRefreshCw className="mr-1.5 text-gray-400 cursor-pointer" />
                Reset
              </button>
              <button onClick={toggleFullScreen} className="flex items-center px-3 py-1.5 bg-[#152241] hover:bg-[#1c2c52] text-gray-300 hover:text-white text-sm rounded-md transition-colors border border-[#2c3e69] cursor-pointer" title={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
                {isFullScreen ? <FiMinimize className="mr-1.5 text-gray-400 cursor-pointer" /> : <FiMaximize className="mr-1.5 text-gray-400 cursor-pointer" />}
                {isFullScreen ? "Exit" : "Expand"}
              </button>
            </div>
          </div>
          {/* Editor Area with fixed height for 25 lines */}
          <div className="overflow-hidden h-[49vh] 2xl:h-[58vh]">
            <CodeEditor defaultValue={challenge.startingCode} value={code} onChange={handleEditorChange} />
          </div>
          {/* Bottom Panel with fixed height */}
          <div className="bg-gradient-to-r from-[#0c111e] to-[#0f1d3a] border-t border-[#1c2c52] p-4" style={{ height: "200px" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-1">
                <button className={`text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer ${bottomPanelTab === "tests" ? "bg-blue-800/30 text-blue-300 border border-blue-[#010335]/50" : "text-gray-400 hover:text-gray-300 border border-transparent hover:bg-[#152241]"}`} onClick={() => setBottomPanelTab("tests")}>
                  <FiPlayCircle className="mr-2 cursor-pointer" />
                  Test Results
                </button>
                <button className={`text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer ${bottomPanelTab === "console" ? "bg-purple-800/30 text-purple-300 border border-purple-700/50" : "text-gray-400 hover:text-gray-300 border border-transparent hover:bg-[#152241]"}`} onClick={() => setBottomPanelTab("console")}>
                  <FiTerminal className="mr-2 cursor-pointer" />
                  Console
                  {allLogs.length > 0 && bottomPanelTab !== "console" && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center bg-purple-700 text-white text-xs rounded-full">{allLogs.length}</span>
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center gap-3">
                {prevChallenge ? (
                  <Link href={`/challenges/${prevChallenge}`} className="bg-[#152241] hover:bg-[#1c2c52] text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer text-white border border-[#2c3e69] shadow-md shadow-blue-900/10 group">
                    <FiChevronLeft className="mr-2 group-hover:animate-pulse" />
                    Previous Quest
                  </Link>
                ) : (<div></div>)}
                {nextChallenge ? (
                  <Link href={`/challenges/${nextChallenge}`} className="text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer bg-gradient-to-r from-blue-700 to-blue-700 hover:from-blue-600 hover:to-blue-600 text-white border border-blue-500/30 shadow-md shadow-blue-900/20 group">
                    Next Quest
                    <FiChevronRight className="ml-2 group-hover:animate-pulse" />
                  </Link>
                ) : (<div></div>)}
                <button className={`bg-gradient-to-r cursor-pointer text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 flex items-center ${isLoading ? 'from-blue-[#010335] to-blue-700 animate-pulse' : 'from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500'} text-white flex items-center py-2 rounded-md transition-all duration-300 font-medium shadow-lg shadow-blue-900/30 border border-blue-500/30`} onClick={runTests} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
            </div>
            {bottomPanelTab === "tests" ? (
              <div className="bg-[#0a142a] p-4 rounded-lg overflow-y-auto h-full max-h-[calc(100%)] text-sm font-mono border border-[#1c2c52] shadow-inner shadow-blue-900/10">
                {output ? (
                  <div className={output.includes("Error") ? "text-red-400 p-3 border border-red-900/50 bg-red-900/20 rounded-md" : output.includes("❌") ? "text-red-400 p-3 border border-red-900/50 bg-red-900/20 rounded-md" : "text-green-400 p-3 border border-green-900/50 bg-green-900/20 rounded-md"}>
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
                        <p className="text-gray-400 text-sm mt-2">Evaluating your blockchain magic ✨</p>
                      </div>
                    ) : (
                      <>
                        <FiPlayCircle className="text-4xl text-blue-500 mb-3" />
                        <p className="text-gray-300 mb-2">Ready to test your solution?</p>
                        <p className="text-gray-400 text-sm">Complete the exercise and submit to check your results.</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0a142a] p-4 rounded-lg overflow-y-auto h-full max-h-[calc(100%)] border border-[#1c2c52] shadow-inner shadow-purple-900/10">
                {allLogs.length > 0 ? (
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {allLogs.map((log, index) => (
                      <div key={index} className={log.startsWith("ERROR:") ? "text-red-400 py-1 px-2 my-1 border-l-2 border-red-500 bg-red-900/20 rounded-r-md" : log.startsWith("WARN:") ? "text-yellow-400 py-1 px-2 my-1 border-l-2 border-yellow-500 bg-yellow-900/20 rounded-r-md" : "text-green-400 py-1 px-2 my-1 border-l-2 border-green-500 bg-green-900/20 rounded-r-md"}>
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
                    <p className="text-gray-400 text-sm">No logs yet. Submit your solution to see output here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} challenge={challenge} />
      <AnimatePresence>
        {showHintPopup && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-600 to-amber-600 p-1 rounded-lg shadow-lg z-50">
            <div className="bg-[#0e1a35] p-4 rounded-lg border border-yellow-500/30 max-w-xs">
              <div className="flex items-start mb-3">
                <div className="bg-yellow-600/30 p-2 rounded-full mr-3">
                  <GoLightBulb className="text-yellow-400 text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-yellow-400 font-medium">Need a hint?</h4>
                  <p className="text-gray-300 text-sm mt-1">Stuck on this challenge? Check out the hints tab for guidance!</p>
                </div>
                <button onClick={() => setShowHintPopup(false)} className="text-gray-400 hover:text-gray-300 cursor-pointer">
                  <FiX />
                </button>
              </div>
              <button onClick={() => { setActiveTab("hints"); setShowHintPopup(false); }} className="w-full cursor-pointer bg-yellow-700/50 hover:bg-yellow-700 text-yellow-300 py-2 rounded-md text-sm font-medium transition-colors">
                View Hints
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
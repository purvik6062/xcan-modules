"use client";

import { useState, useEffect, useRef, useMemo, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
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
import GitHubAuthHandler from "../../../../components/GitHubAuthHandler";
import toast from "react-hot-toast";

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
  const [clientMounted, setClientMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [verificationStage, setVerificationStage] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [codeSubmitted, setCodeSubmitted] = useState(false);
  const [showHintPopup, setShowHintPopup] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(50);
  const [isResizingPanels, setIsResizingPanels] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const { address } = useWalletProtection();

  useEffect(() => {
    setClientMounted(true);
  }, []);

  useEffect(() => {
    setEditorReady(false);
  }, [slug]);

  useEffect(() => {
    if (!isResizingPanels) return;

    const handleResize = (event: MouseEvent) => {
      if (!workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      const newWidth = ((event.clientX - rect.left) / rect.width) * 100;
      const clampedWidth = Math.min(70, Math.max(30, newWidth));
      setLeftPaneWidth(clampedWidth);
    };

    const stopResize = () => setIsResizingPanels(false);

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResize);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizingPanels]);

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

  function handleEditorChange(value: string | undefined) {
    if (value !== undefined) {
      setCode(value);
    }
  }

  const runTests = async () => {
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
              body: JSON.stringify({
                code: modifiedCode,
                slug,
                userAddress: address || null,
                level: challenge.level,
                points: challenge.points,
              }),
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
  const handleStartResize = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isFullScreen) return;
    setIsResizingPanels(true);
  };

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
    <GitHubAuthHandler
      onAuthComplete={(githubUsername) => {
        runTests();
      }}
      onAuthError={(error) => {
        const msg = error?.toLowerCase().includes("wallet") ? "Connect your wallet first" : (error || "Authentication failed");
        toast.error(msg);
        setOutput(`GitHub authentication failed: ${error}`);
      }}
    >
      {({ isAuthenticating, githubUsername, hasGithub, triggerAuth }) => (
        <div className="relative flex min-h-[100dvh] h-[100dvh] flex-col overflow-hidden bg-gradient-to-br from-[#070d1b] to-[#102247] text-white lg:h-screen lg:min-h-0">
          {clientMounted && !editorReady && (
            <div
              className="absolute inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-[#070d1b]/95 backdrop-blur-sm"
              aria-busy="true"
              aria-label="Loading challenge"
            >
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
              <p className="text-sm font-medium text-blue-100">Loading challenge workspace…</p>
              <p className="max-w-xs px-4 text-center text-xs text-gray-400">Preparing editor and tools</p>
            </div>
          )}
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

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
            {/* Vertical rail */}
            <div className="flex w-full flex-shrink-0 flex-row items-center justify-center gap-3 border-b border-[#1D315E] bg-[#040e24] px-2 py-2 lg:w-16 lg:flex-col lg:justify-start lg:space-y-4 lg:border-b-0 lg:border-r lg:py-4">
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
              <div className="hidden h-px w-6 bg-gradient-to-b from-transparent via-[#2c3e69] to-transparent lg:block"></div>
            </div>

            {/* Main workspace: shared title row + two balanced panes with aligned chrome */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              {/* Full-width challenge header — aligns both columns below */}
              <div
                className={`${isFullScreen ? "hidden" : "flex"} flex-shrink-0 flex-col gap-2 border-b border-[#1c2c52] bg-[#0c111e] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-2.5`}
              >
                <h1 className="min-w-0 text-base font-semibold leading-tight text-gray-100 sm:text-lg lg:truncate lg:text-xl">
                  {challenge.title}
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 sm:justify-end sm:gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] text-blue-200 sm:text-xs ${getLevelBadgeStyle(challenge.level)}`}>
                    {challenge.level === "Beginner" && <GoFlame className="mr-1 h-3 w-3 sm:mr-1.5" />}
                    {challenge.level === "Intermediate" && <GoPulse className="mr-1 h-3 w-3 sm:mr-1.5" />}
                    {challenge.level === "Advanced" && <GoBeaker className="mr-1 h-3 w-3 sm:mr-1.5" />}
                    {challenge.level}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-blue-700 bg-blue-900/50 px-2.5 py-1 text-[11px] text-blue-200 sm:text-xs">
                    <FiCpu className="mr-1 h-3 w-3 sm:mr-1.5" />
                    {challenge.category}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-blue-800 bg-blue-900/50 px-2.5 py-1 text-[11px] text-blue-200 sm:text-xs">
                    <FiCode className="mr-1 h-3 w-3 sm:mr-1.5" />
                    {challenge.precompileUsed}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-purple-700 bg-purple-900/50 px-2.5 py-1 text-[11px] text-purple-200 sm:text-xs">
                    <FiAward className="mr-1 h-3 w-3 sm:mr-1.5" />
                    {challenge.points} XP
                  </span>
                </div>
              </div>

              <div
                ref={workspaceRef}
                className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row"
                style={{ "--left-pane-width": `${leftPaneWidth}%` } as CSSProperties}
              >
                {/* Left — instructions / tests / hints */}
                <div className={`${isFullScreen ? "hidden" : "flex"} w-full max-h-[min(48vh,440px)] min-h-[min(42vh,380px)] flex-col overflow-hidden border-b border-[#1c2c52] bg-[#101828] text-white lg:max-h-none lg:min-h-0 lg:flex-none lg:basis-[var(--left-pane-width)] lg:border-b-0 lg:border-r`}>
                  {/* Same height + style as editor toolbar for visual alignment */}
                  <div className="flex h-12 flex-shrink-0 items-center border-b border-[#1c2c52] bg-gradient-to-r from-[#0c111e] to-[#0f1d3a] px-2 sm:px-3">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 sm:gap-2">
                      <button type="button" className={`flex h-8 shrink-0 cursor-pointer items-center rounded-md px-2.5 text-xs transition-all duration-200 sm:px-3 sm:text-sm ${activeTab === "instructions" ? "border border-blue-500/40 bg-blue-950/40 text-blue-200" : "border border-transparent text-gray-400 hover:bg-[#152241] hover:text-white"}`} onClick={() => setActiveTab("instructions")}>
                        <FiBookOpen className="mr-1.5 h-3.5 w-3.5 sm:mr-2" />
                        Instructions
                      </button>
                      <button type="button" className={`flex h-8 shrink-0 cursor-pointer items-center rounded-md px-2.5 text-xs transition-all duration-200 sm:px-3 sm:text-sm ${activeTab === "tests" ? "border border-teal-600/50 bg-teal-950/30 text-teal-200" : "border border-transparent text-gray-400 hover:bg-[#152241] hover:text-white"}`} onClick={() => setActiveTab("tests")}>
                        <FiTerminal className="mr-1.5 h-3.5 w-3.5 sm:mr-2" />
                        Test Cases
                      </button>
                      <button type="button" className={`ml-auto flex h-8 shrink-0 cursor-pointer items-center rounded-md px-2.5 text-xs transition-all duration-200 sm:px-3 sm:text-sm ${activeTab === "hints" ? "border border-amber-600/50 bg-amber-950/20 text-amber-200" : "border border-transparent text-gray-400 hover:bg-[#152241] hover:text-white"}`} onClick={() => setActiveTab("hints")}>
                        <FiHelpCircle className="mr-1.5 h-3.5 w-3.5 sm:mr-2" />
                        Hints
                      </button>
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto bg-[#0a142a] p-4 sm:p-5">
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

                {!isFullScreen && (
                  <div
                    onMouseDown={handleStartResize}
                    onDoubleClick={() => setLeftPaneWidth(50)}
                    className="group hidden w-2 cursor-col-resize items-stretch justify-center bg-[#0b1630] transition-colors hover:bg-blue-500/25 lg:flex"
                    title="Drag to resize panels (double click to reset)"
                    role="separator"
                    aria-label="Resize challenge panels"
                    aria-orientation="vertical"
                  >
                    <div className="my-2 w-px bg-[#2a3e68] transition-colors group-hover:bg-blue-400/70" />
                  </div>
                )}

                {/* Right — editor + output (balanced with left) */}
                <div className={`relative flex w-full min-h-[40vh] flex-1 flex-col overflow-hidden bg-[#0c1425] lg:min-h-0 ${isFullScreen ? "lg:w-full" : ""}`}>
                  <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute top-20 right-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-40 right-20 w-60 h-60 bg-blue-600 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-700 rounded-full filter blur-3xl"></div>
                  </div>
                  <div className="relative z-[1] flex h-12 flex-shrink-0 items-center border-b border-[#1c2c52] bg-gradient-to-r from-[#0c111e] to-[#0f1d3a] px-2 sm:px-3">
                    <div className="flex min-h-[2rem] min-w-0 flex-1 items-center truncate rounded-md border border-[#2c3e69] bg-[#152241] px-2.5 py-1.5 text-xs text-blue-300 shadow-inner shadow-blue-500/10 sm:px-3 sm:text-sm">
                      <FiCode className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-blue-400 sm:mr-2" />
                      <span className="truncate font-mono">{slug}.ts</span>
                    </div>
                    <div className="ml-2 flex flex-shrink-0 items-center gap-1 sm:ml-3 sm:gap-2">
                      <button onClick={() => setCode(challenge.startingCode)} className="flex cursor-pointer items-center rounded-md border border-[#2c3e69] bg-[#152241] px-2 py-1.5 text-xs text-gray-300 transition-colors hover:bg-[#1c2c52] hover:text-white sm:px-3 sm:text-sm" title="Reset Code">
                        <FiRefreshCw className="mr-1.5 text-gray-400 cursor-pointer" />
                        Reset
                      </button>
                      <button onClick={toggleFullScreen} className="flex cursor-pointer items-center rounded-md border border-[#2c3e69] bg-[#152241] px-2 py-1.5 text-xs text-gray-300 transition-colors hover:bg-[#1c2c52] hover:text-white sm:px-3 sm:text-sm" title={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
                        {isFullScreen ? <FiMinimize className="mr-1 text-gray-400 sm:mr-1.5" /> : <FiMaximize className="mr-1 text-gray-400 sm:mr-1.5" />}
                        <span className="hidden sm:inline">{isFullScreen ? "Exit" : "Expand"}</span>
                      </button>
                    </div>
                  </div>
                  {/* Editor grows to fill space above results; fixed vh removed on lg to avoid gap at column bottom */}
                  <div className="min-h-[min(36vh,280px)] flex-1 overflow-hidden sm:min-h-[38vh] lg:min-h-0 lg:flex-1">
                    <CodeEditor
                      defaultValue={challenge.startingCode}
                      value={code}
                      onChange={handleEditorChange}
                      onEditorReady={() => setEditorReady(true)}
                    />
                  </div>
                  {/* Bottom panel — anchored to bottom of column; min height for toolbar + output */}
                  <div className="relative z-[1] flex min-h-[168px] shrink-0 flex-col overflow-hidden border-t border-[#1c2c52] bg-gradient-to-r from-[#0c111e] to-[#0f1d3a] lg:min-h-0 lg:flex-[0_0_240px]">
                    <div className="flex flex-shrink-0 flex-col gap-2 border-b border-[#1c2c52]/80 px-3 py-2 sm:px-4 lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:py-2">
                      <div className="flex flex-wrap items-center gap-1 lg:gap-2">
                        <button type="button" className={`inline-flex cursor-pointer items-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-3 sm:text-sm ${bottomPanelTab === "tests" ? "border border-blue-600/40 bg-blue-950/40 text-blue-200" : "text-gray-400 hover:bg-[#152241] hover:text-gray-200"}`} onClick={() => setBottomPanelTab("tests")}>
                          <FiPlayCircle className="mr-1.5 h-3.5 w-3.5" />
                          Results
                        </button>
                        <button type="button" className={`inline-flex cursor-pointer items-center rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-3 sm:text-sm ${bottomPanelTab === "console" ? "border border-purple-600/40 bg-purple-950/30 text-purple-200" : "text-gray-400 hover:bg-[#152241] hover:text-gray-200"}`} onClick={() => setBottomPanelTab("console")}>
                          <FiTerminal className="mr-1.5 h-3.5 w-3.5" />
                          Console
                          {allLogs.length > 0 && bottomPanelTab !== "console" && (
                            <span className="ml-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-purple-700 px-1 text-[10px] text-white">{allLogs.length}</span>
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2 lg:min-w-0 lg:flex-nowrap">
                        {prevChallenge ? (
                          <Link href={`/challenges/${prevChallenge}`} className="group inline-flex min-h-[2.25rem] flex-1 cursor-pointer items-center justify-center rounded-md border border-[#2c3e69] bg-[#152241] px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1c2c52] sm:flex-none sm:px-3 sm:text-sm">
                            <FiChevronLeft className="mr-1 h-3.5 w-3.5 group-hover:animate-pulse" />
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">Prev</span>
                          </Link>
                        ) : null}
                        {nextChallenge ? (
                          <Link href={`/challenges/${nextChallenge}`} className="group inline-flex min-h-[2.25rem] flex-1 cursor-pointer items-center justify-center rounded-md border border-blue-500/40 bg-gradient-to-r from-blue-700 to-blue-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:from-blue-600 hover:to-blue-500 sm:flex-none sm:px-3 sm:text-sm">
                            <span className="hidden sm:inline">Next Quest</span>
                            <span className="sm:hidden">Next</span>
                            <FiChevronRight className="ml-1 h-3.5 w-3.5 group-hover:animate-pulse" />
                          </Link>
                        ) : null}
                        <button type="button" className={`inline-flex min-h-[2.25rem] min-w-[8.5rem] flex-1 cursor-pointer items-center justify-center rounded-md border border-emerald-500/30 bg-gradient-to-r px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-200 sm:flex-none sm:min-w-[10rem] sm:px-4 sm:text-sm ${isLoading || isAuthenticating ? "from-slate-600 to-slate-700 animate-pulse" : "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"}`} onClick={triggerAuth} disabled={isLoading || isAuthenticating}>
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Running Challenge...
                            </>
                          ) : isAuthenticating ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Connecting GitHub...
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
                    <div className="flex min-h-0 flex-1 flex-col px-2 pb-2 pt-0 sm:px-3">
                      {bottomPanelTab === "tests" ? (
                        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-[#1c2c52] bg-[#0a142a] p-3 font-mono text-sm shadow-inner shadow-blue-900/10 sm:p-4">
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
                        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-[#1c2c52] bg-[#0a142a] p-3 shadow-inner shadow-purple-900/10 sm:p-4">
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
              </div>
            </div>
          </div>

          <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} challenge={challenge} />
          {clientMounted &&
            createPortal(
              <AnimatePresence>
                {showHintPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.2 }}
                    className="pointer-events-auto fixed bottom-4 right-4 z-[100] rounded-lg bg-gradient-to-r from-yellow-600 to-amber-600 p-1 shadow-lg sm:bottom-6 sm:right-6"
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="hint-toast-title"
                  >
                    <div className="max-w-full rounded-lg border border-yellow-500/30 bg-[#0e1a35] p-4 sm:max-w-xs">
                      <div className="mb-3 flex items-start">
                        <div className="mr-3 rounded-full bg-yellow-600/30 p-2">
                          <GoLightBulb className="text-xl text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <h4 id="hint-toast-title" className="font-medium text-yellow-400">
                            Need a hint?
                          </h4>
                          <p className="mt-1 text-sm text-gray-300">Stuck on this challenge? Check out the hints tab for guidance!</p>
                        </div>
                        <button type="button" onClick={() => setShowHintPopup(false)} className="cursor-pointer text-gray-400 hover:text-gray-300">
                          <FiX />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("hints");
                          setShowHintPopup(false);
                        }}
                        className="w-full cursor-pointer rounded-md bg-yellow-700/50 py-2 text-sm font-medium text-yellow-300 transition-colors hover:bg-yellow-700"
                      >
                        View Hints
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>,
              document.body
            )}
        </div>
      )}
    </GitHubAuthHandler>
  );
}
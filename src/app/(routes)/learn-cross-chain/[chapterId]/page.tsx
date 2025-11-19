"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { crossChainChapters, crossChainQuizQuestions } from "../../../../data/crossChainChapters";
import CrossChainContent from "../../../../components/cross-chain/CrossChainContent";
import ChapterCompletionModal from "../../../../components/cross-chain/ChapterCompletionModal";
import QuizComponent from "../../../../components/QuizComponent";
import { useWalletProtection } from "../../../../hooks/useWalletProtection";
import LearningModuleSidebar from "../../../../components/LearningModuleSidebar";

export default function CrossChainChapterPage() {
  const params = useParams();
  const chapterId = params?.chapterId as string;

  const chapter = crossChainChapters.find((c) => c.id === chapterId);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isReady } = useWalletProtection();
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
    if (localStorage.getItem("github_username")) return true;
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
    const fetchProgress = async () => {
      if (!isReady || !address) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const params = new URLSearchParams({ userAddress: address, module: "cross-chain" });
        const res = await fetch(`/api/challenges?${params.toString()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const chapterCompleted: string[] = data?.chapters?.[chapterId] || [];
          setCompletedSections(chapterCompleted);
        }
      } catch (e) {
        console.error("Failed to fetch progress", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, [chapterId, isReady, address]);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <LearningModuleSidebar currentModuleId="cross-chain" backHref="/learn-cross-chain" />
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/80 p-8 text-center shadow-lg">
              <h1 className="mb-4 text-2xl font-bold text-white">
                Chapter Not Found
              </h1>
              <p className="text-gray-300">
                The Cross-Chain Development chapter you&apos;re looking for doesn&apos;t exist.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSection = chapter.sections[currentSectionIndex];
  const availableSections = chapter.sections.filter(
    (s) => s.status === "available"
  );
  const progress = (completedSections.length / availableSections.length) * 100;

  const handleSectionComplete = async (sectionId: string) => {
    const alreadyCompleted = completedSections.includes(sectionId);
    const updatedCompleted = alreadyCompleted
      ? completedSections
      : [...completedSections, sectionId];

    if (!alreadyCompleted) {
      setCompletedSections(updatedCompleted);
      try {
        await fetch("/api/challenges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress: address, chapterId, sectionId, module: "cross-chain" }),
        });
      } catch (e) {
        console.error("Failed to update progress", e);
      }
    }

    // Check if we're at the last available section
    const currentSectionIndexInAvailable = availableSections.findIndex(s => s.id === currentSection.id);
    const isLastSection = currentSectionIndexInAvailable === availableSections.length - 1;

    if (isLastSection) {
      // Show completion modal when finishing the last section
      setShowCompletionModal(true);
    } else {
      // Auto-advance to next available section
      setCurrentSectionIndex((prevIndex) => {
        // Find the next available section after the current one
        for (let i = prevIndex + 1; i < chapter.sections.length; i++) {
          if (chapter.sections[i].status === "available") {
            return i;
          }
        }
        return prevIndex; // Stay on current if no next available section
      });
    }
  };

  const goToNextSection = () => {
    // Find the next available section after the current one
    for (let i = currentSectionIndex + 1; i < chapter.sections.length; i++) {
      if (chapter.sections[i].status === "available") {
        setCurrentSectionIndex(i);
        break;
      }
    }
  };

  const goToPreviousSection = () => {
    // Find the previous available section before the current one
    for (let i = currentSectionIndex - 1; i >= 0; i--) {
      if (chapter.sections[i].status === "available") {
        setCurrentSectionIndex(i);
        break;
      }
    }
  };

  const hasNextAvailableSection = () => {
    for (let i = currentSectionIndex + 1; i < chapter.sections.length; i++) {
      if (chapter.sections[i].status === "available") {
        return true;
      }
    }
    return false;
  };

  const hasPreviousAvailableSection = () => {
    for (let i = currentSectionIndex - 1; i >= 0; i--) {
      if (chapter.sections[i].status === "available") {
        return true;
      }
    }
    return false;
  };

  // Get next chapter info for the completion modal
  const currentChapterIndex = crossChainChapters.findIndex(ch => ch.id === chapterId);
  const nextChapter = currentChapterIndex < crossChainChapters.length - 1
    ? crossChainChapters[currentChapterIndex + 1]
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <LearningModuleSidebar currentModuleId="cross-chain" backHref="/learn-cross-chain" />
          <div className="flex flex-1 items-center justify-center">
            <motion.div
              className="relative h-24 w-24"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
              <div className="absolute inset-2 rounded-full border-t-4 border-blue-400" />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <LearningModuleSidebar currentModuleId="cross-chain" backHref="/learn-cross-chain" />
        <div className="flex-1">
          {/* Chapter Header with Progress */}
          <div className="border-b border-gray-700 bg-gray-800 p-6">
            <div className="container mx-auto">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-white">{chapter.title}</h1>
                  <p className="text-gray-300">{chapter.description}</p>
                </div>
                <div className="text-right">
                  <div className="mb-1 text-sm text-gray-400">Chapter Progress</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(progress)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full rounded-full bg-gray-700">
                <motion.div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
                <span>{completedSections.length}/{availableSections.length} sections completed</span>
                <span>{chapter.duration}</span>
              </div>
            </div>
          </div>

          {/* Chapter Content */}
          <div className="py-8">
            {currentSection.status === "available" ? (
              <>
                {currentSection.type === "quiz" ? (
                  <QuizComponent
                    questions={(currentSection.content as any)?.questions || crossChainQuizQuestions[chapterId] || []}
                    onComplete={async () => {
                      // Gate quiz attempt completion behind GitHub auth
                      if (address && !localStorage.getItem("github_username")) {
                        await ensureGitHubAuth();
                        return;
                      }
                      handleSectionComplete(currentSection.id);
                    }}
                  />
                ) : (
                  <div className="">
                    <CrossChainContent
                      section={currentSection}
                      chapterId={chapterId}
                      onComplete={() =>
                        handleSectionComplete(currentSection.id)
                      }
                    />

                    {/* Section Navigation */}
                    <div className="mt-8 flex items-center justify-between border-t border-gray-700 pt-6">
                      <button
                        onClick={goToPreviousSection}
                        disabled={!hasPreviousAvailableSection()}
                        className={`ml-4 rounded-lg px-6 py-3 transition-all duration-200 ${!hasPreviousAvailableSection()
                          ? "cursor-not-allowed bg-gray-700 text-gray-500"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                          }`}
                      >
                        ← Previous Section
                      </button>

                      <div className="text-sm text-gray-400">
                        Section {currentSectionIndex + 1} of {chapter.sections.length}
                      </div>

                      <button
                        onClick={goToNextSection}
                        disabled={!hasNextAvailableSection()}
                        className={`mr-4 rounded-lg px-6 py-3 transition-all duration-200 ${!hasNextAvailableSection()
                          ? "cursor-not-allowed bg-gray-700 text-gray-500"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                          }`}
                      >
                        Next Section →
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex min-h-screen items-center justify-center bg-gray-900">
                <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-800 p-8 text-left">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-2xl">🧩</span>
                    <h3 className="text-xl font-bold text-white">
                      Reference Code Template
                    </h3>
                  </div>
                  <p className="mb-4 text-gray-300">
                    Review this minimal template to understand the concept before continuing. You don’t need to run it.
                  </p>
                  <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-200"><code>{`// Approve + Lock (conceptual)
import { ethers } from 'ethers';

const erc20Abi = [
  'function approve(address spender, uint256 amount) returns (bool)'
];
const lockAbi = [
  'function lockTokens(uint256 amount)'
];

async function approveAndLock(signer, token, lock, amountEth) {
  const amount = ethers.parseEther(amountEth);
  const t = new ethers.Contract(token, erc20Abi, signer);
  await (await t.approve(lock, amount)).wait();
  const l = new ethers.Contract(lock, lockAbi, signer);
  await (await l.lockTokens(amount)).wait();
}`}</code></pre>
                </div>
              </div>
            )}
          </div>

          {/* Chapter Completion Modal */}
          <ChapterCompletionModal
            isOpen={showCompletionModal}
            onClose={() => setShowCompletionModal(false)}
            chapterTitle={chapter.title}
            nextChapterId={nextChapter?.id}
            nextChapterTitle={nextChapter?.title}
          />
        </div>
      </div>
    </div>
  );
}
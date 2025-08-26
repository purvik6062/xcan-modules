"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { web3BasicsChapters, quizQuestions } from "../../../../data/web3BasicsChapters";
import Web3BasicsContent from "../../../../components/web3-basics/Web3BasicsContent";
import ChapterCompletionModal from "../../../../components/web3-basics/ChapterCompletionModal";
import QuizComponent from "../../../../components/QuizComponent";
import { useWalletProtection } from "../../../../hooks/useWalletProtection";

export default function Web3BasicsChapterPage() {
  const params = useParams();
  const chapterId = params?.chapterId as string;

  const chapter = web3BasicsChapters.find((c) => c.id === chapterId);
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
        const params = new URLSearchParams({ userAddress: address });
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Chapter Not Found
          </h1>
          <p className="text-gray-300">
            The Web3 Basics chapter you're looking for doesn't exist.
          </p>
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
          body: JSON.stringify({ userAddress: address, chapterId, sectionId }),
        });
      } catch (e) {
        console.error("Failed to update progress", e);
      }
    }

    // Check if all sections of this chapter are completed
    const allSectionsCompleted = availableSections.every(section =>
      updatedCompleted.includes(section.id)
    );

    if (allSectionsCompleted) {
      // Show completion modal immediately when module is finished
      setShowCompletionModal(true);
    } else {
      // Auto-advance to next available section for seamless flow
      setCurrentSectionIndex((prevIndex) => {
        const nextIndex = chapter.sections.findIndex((s, idx) => idx > prevIndex && s.status === "available");
        return nextIndex !== -1 ? nextIndex : prevIndex;
      });
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < chapter.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  // Get next chapter info for the completion modal
  const currentChapterIndex = web3BasicsChapters.findIndex(ch => ch.id === chapterId);
  const nextChapter = currentChapterIndex < web3BasicsChapters.length - 1
    ? web3BasicsChapters[currentChapterIndex + 1]
    : null;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Chapter Header with Progress */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{chapter.title}</h1>
              <p className="text-gray-300">{chapter.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Chapter Progress</div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
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
                questions={quizQuestions[chapterId] || []}
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
                <Web3BasicsContent
                  section={currentSection}
                  chapterId={chapterId}
                  onComplete={() =>
                    handleSectionComplete(currentSection.id)
                  }
                />

                {/* Section Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                  <button
                    onClick={goToPreviousSection}
                    disabled={currentSectionIndex === 0}
                    className={`px-6 py-3 ml-4 rounded-lg transition-all duration-200 ${currentSectionIndex === 0
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                  >
                    ← Previous Section
                  </button>

                  <div className="text-sm text-gray-400">
                    Section {currentSectionIndex + 1} of {availableSections.length}
                  </div>

                  <button
                    onClick={goToNextSection}
                    disabled={currentSectionIndex === availableSections.length - 1}
                    className={`px-6 py-3 mr-4 rounded-lg transition-all duration-200 ${currentSectionIndex === availableSections.length - 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
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
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-300">
                This section is currently under development and will be
                available soon.
              </p>
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
  );
}

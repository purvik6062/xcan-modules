"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { web3BasicsChapters, quizQuestions } from "../../../../data/web3BasicsChapters";
import Web3BasicsContent from "../../../../components/web3-basics/Web3BasicsContent";
import ChapterCompletionModal from "../../../../components/web3-basics/ChapterCompletionModal";
import QuizComponent from "../../../../components/QuizComponent";

export default function Web3BasicsChapterPage() {
  const params = useParams();
  const chapterId = params?.chapterId as string;

  const chapter = web3BasicsChapters.find((c) => c.id === chapterId);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem(`web3-basics-progress-${chapterId}`);
    if (saved) {
      setCompletedSections(JSON.parse(saved));
    }
  }, [chapterId]);

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

  const handleSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId];
      setCompletedSections(newCompleted);
      localStorage.setItem(
        `web3-basics-progress-${chapterId}`,
        JSON.stringify(newCompleted)
      );

      // Check if all sections of this chapter are completed
      const allSectionsCompleted = availableSections.every(section =>
        newCompleted.includes(section.id)
      );

      if (allSectionsCompleted) {
        // Show completion modal after a short delay
        setTimeout(() => {
          setShowCompletionModal(true);
        }, 1000);
      }
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

  // Check if user can access current section (needs previous sections completed for story-quiz type)
  const canAccessSection = (sectionIndex: number) => {
    if (sectionIndex === 0) return true; // First section always accessible

    // For story sections, must complete previous sections
    for (let i = 0; i < sectionIndex; i++) {
      const prevSection = chapter.sections[i];
      if (["web-evolution", "wallet-fundamentals", "crypto-basics", "blockchain-core", "ledger-principles", "key-security", "nft-ownership", "defi-trading"].includes(prevSection.type) && !completedSections.includes(prevSection.id)) {
        return false;
      }
    }
    return true;
  };

  const canAccessChapter = (chapterIndex: number) => {
    if (chapterIndex === 0) return true; // First chapter always accessible

    // Must complete all sections of previous chapter
    const prevChapter = web3BasicsChapters[chapterIndex - 1];
    const prevChapterSections = prevChapter.sections.filter(s => s.status === "available");
    const prevChapterProgress = localStorage.getItem(`web3-basics-progress-${prevChapter.id}`);
    const prevChapterCompleted = prevChapterProgress ? JSON.parse(prevChapterProgress) : [];

    return prevChapterSections.every(section =>
      prevChapterCompleted.includes(section.id)
    );
  };

  const isCurrentSectionAccessible = canAccessSection(currentSectionIndex);

  // Check if current chapter is accessible
  const currentChapterIndex = web3BasicsChapters.findIndex(ch => ch.id === chapterId);
  const isChapterAccessible = canAccessChapter(currentChapterIndex);

  // Get next chapter info for the completion modal
  const nextChapter = currentChapterIndex < web3BasicsChapters.length - 1
    ? web3BasicsChapters[currentChapterIndex + 1]
    : null;

  if (!isChapterAccessible) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Chapter Locked
          </h1>
          <p className="text-gray-300 mb-6">
            You must complete the previous chapter before accessing this content.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Chapter Content */}
      {isCurrentSectionAccessible ? (
        <>
          {currentSection.status === "available" ? (
            <>
              {currentSection.type === "quiz" ? (
                <QuizComponent
                  questions={quizQuestions[chapterId] || []}
                  onComplete={() =>
                    handleSectionComplete(currentSection.id)
                  }
                />
              ) : (
                <Web3BasicsContent
                  section={currentSection}
                  chapterId={chapterId}
                  onComplete={() =>
                    handleSectionComplete(currentSection.id)
                  }
                />
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
        </>
      ) : (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Section Locked
            </h3>
            <p className="text-gray-300 mb-4">
              You must complete previous sections before accessing this content.
            </p>
            <p className="text-sm text-gray-400">
              Complete the story-quiz sections in order to unlock new content.
            </p>
          </div>
        </div>
      )}

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

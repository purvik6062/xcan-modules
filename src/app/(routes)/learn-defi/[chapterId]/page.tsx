"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { defiChapters, quizQuestions } from "../../../../data/defiChapters";
import ChapterContent from "../../../../components/ChapterContent";
import SectionNavigation from "../../../../components/SectionNavigation";
import ProgressBar from "../../../../components/ProgressBar";
import QuizComponent from "../../../../components/QuizComponent";
import ChallengeComponent from "../../../../components/ChallengeComponent";
import InteractiveLearningDashboard from "../../../../components/InteractiveLearningDashboard";
import ContentProgressTracker from "../../../../components/ContentProgressTracker";
import { getChapterGlossary } from "../../../../data/defiGlossary";
import { getTheoryContent } from "../../../../data/defiContent";
import { useWalletProtection } from "../../../../hooks/useWalletProtection";
import LearningModuleSidebar from "../../../../components/LearningModuleSidebar";

export default function ChapterPage() {
  const params = useParams();
  const chapterId = params?.chapterId as string;

  const chapter = defiChapters.find((c) => c.id === chapterId);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentSubSection, setCurrentSubSection] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { address, isReady } = useWalletProtection();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (!isReady || !address) return;
        const params = new URLSearchParams({ userAddress: address, module: "master-defi" });
        console.log("[DeFi] GET /api/challenges", { chapterId, address });
        const res = await fetch(`/api/challenges?${params.toString()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          console.log("[DeFi] GET /api/challenges response", data);
          const chapterCompleted: string[] = data?.chapters?.[chapterId] || [];
          setCompletedSections(chapterCompleted);
        }
      } catch (err) {
        console.warn("[DeFi] GET /api/challenges error", err);
      }
    };
    fetchProgress();
  }, [chapterId, isReady, address]);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <LearningModuleSidebar currentModuleId="defi-arbitrum" backHref="/learn-defi" />
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/90 p-8 text-center shadow-xl">
              <h1 className="mb-4 text-2xl font-bold text-white">Chapter Not Found</h1>
              <p className="text-slate-300">
                The chapter you&apos;re looking for doesn&apos;t exist.
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

  // Get theory content for progress tracking
  const theoryContent =
    currentSection.type === "theory"
      ? getTheoryContent(chapterId, currentSection.id)
      : null;

  // Get chapter-specific glossary and concepts
  const chapterGlossary = getChapterGlossary(chapterId);
  const chapterConcepts = Object.keys(chapterGlossary);

  // Calculate time spent (mock data for now)
  const timeSpentMinutes = completedSections.length * 15;

  const handleSectionComplete = async (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      const newCompleted = [...completedSections, sectionId];
      setCompletedSections(newCompleted);
      try {
        if (!isReady || !address) return;
        console.log("[DeFi] POST /api/challenges", { chapterId, sectionId, address });
        const res = await fetch("/api/challenges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress: address, chapterId, sectionId, module: "master-defi", finalizeChapter: true }),
        });
        const json = await res.json().catch(() => ({}));
        console.log("[DeFi] POST /api/challenges response", { status: res.status, json });
      } catch { }
    }
  };

  const handleNextSection = () => {
    if (currentSectionIndex < chapter.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  // Determine next chapter for navigation on completion
  const currentChapterIndex = defiChapters.findIndex((ch) => ch.id === chapterId);
  const nextChapter =
    currentChapterIndex >= 0 && currentChapterIndex < defiChapters.length - 1
      ? defiChapters[currentChapterIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <LearningModuleSidebar currentModuleId="defi-arbitrum" backHref="/learn-defi" />
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Chapter Header */}
            <motion.div
              className="mb-8 rounded-2xl bg-slate-800 p-4 shadow-xl sm:p-6 lg:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 text-4xl sm:text-5xl">{chapter.icon}</div>
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                      {chapter.title}
                    </h1>
                    <p className="mt-2 text-sm text-gray-300 sm:text-base">
                      {chapter.description}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-left sm:text-right">
                  <div className="text-xs text-gray-400 sm:text-sm">
                    {chapter.level} • {chapter.duration}
                  </div>
                  <div className="text-xs text-gray-400 sm:text-sm">
                    {chapter.sections.length} sections
                  </div>
                </div>
              </div>

              <ProgressBar
                progress={progress}
                completed={completedSections.length}
                total={availableSections.length}
              />
            </motion.div>

            <div className="flex flex-col gap-6 xl:flex-row xl:gap-8">
              {/* Section Navigation */}
              <div
                className={`w-full max-w-full flex-shrink-0 transition-all duration-400 ease-in-out xl:max-w-none ${isSidebarCollapsed ? "xl:w-16" : "xl:w-80"
                  }`}
              >
                <SectionNavigation
                  sections={chapter.sections}
                  currentIndex={currentSectionIndex}
                  completedSections={completedSections}
                  onSectionSelect={setCurrentSectionIndex}
                  isCollapsed={isSidebarCollapsed}
                  onToggleCollapse={setIsSidebarCollapsed}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <motion.div
                  key={currentSection.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-2xl bg-slate-800 shadow-xl"
                >
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="mb-2 text-xl font-bold sm:text-2xl">
                          {currentSection.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-blue-100 sm:gap-4">
                          <span className="capitalize">
                            {currentSection.type.replace("-", " ")}
                          </span>
                          <span>•</span>
                          <span>{currentSection.estimatedTime}</span>
                          <span>•</span>
                          <span>
                            Section {currentSectionIndex + 1} of{" "}
                            {chapter.sections.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 sm:text-right">
                        {currentSection.status === "available" ? (
                          completedSections.includes(currentSection.id) ? (
                            <div className="flex items-center gap-2 bg-green-500 px-3 py-1 rounded-full">
                              <span>✓</span>
                              <span>Completed</span>
                            </div>
                          ) : (
                            <div className="bg-blue-500 px-3 py-1 rounded-full">
                              In Progress
                            </div>
                          )
                        ) : (
                          <div className="bg-orange-500 px-3 py-1 rounded-full">
                            Coming Soon
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-4 sm:p-6 lg:p-8">
                    {currentSection.status === "available" ? (
                      <>
                        {currentSection.type === "quiz" ? (
                          <QuizComponent
                            questions={quizQuestions[chapterId] || []}
                            onComplete={() =>
                              handleSectionComplete(currentSection.id)
                            }
                          />
                        ) : currentSection.type === "challenge" ? (
                          <ChallengeComponent
                            section={currentSection}
                            onComplete={() =>
                              handleSectionComplete(currentSection.id)
                            }
                          />
                        ) : (
                          <ChapterContent
                            section={currentSection}
                            chapterId={chapterId}
                            onComplete={() =>
                              handleSectionComplete(currentSection.id)
                            }
                          />
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔒</div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Coming Soon
                        </h3>
                        <p className="text-gray-300">
                          This section is currently under development and will be
                          available soon.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  <div className="border-t border-slate-700 p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        onClick={handlePreviousSection}
                        disabled={currentSectionIndex === 0}
                        className="hover:cursor-pointer order-2 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 text-gray-300 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 sm:order-1 sm:w-auto"
                      >
                        ← Previous
                      </button>

                      <div className="order-1 text-center text-sm text-gray-400 sm:order-2">
                        {currentSectionIndex + 1} / {chapter.sections.length}
                      </div>

                      <button
                        onClick={handleNextSection}
                        disabled={
                          currentSectionIndex === chapter.sections.length - 1
                        }
                        className="hover:cursor-pointer order-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Chapter Completion Reward */}
                {progress === 100 && chapter.badge && (
                  <motion.div
                    className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-8 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                    <p className="text-lg mb-4">
                      You've completed the {chapter.title} chapter!
                    </p>
                    <div className="bg-white bg-opacity-20 rounded-xl p-4 inline-block">
                      <p className="text-sm text-black mb-1">You've earned:</p>
                      <p className="text-xl text-black font-bold">{chapter.badge.title}</p>
                      <p className="text-sm text-black opacity-90">
                        {chapter.badge.description}
                      </p>
                    </div>
                    {nextChapter && (
                      <div className="mt-6">
                        <Link
                          href={`/learn-defi/${nextChapter.id}`}
                          className="inline-block px-6 py-3 mt-2 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-100 transition-colors"
                        >
                          Continue to Next Chapter →
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Interactive Learning Dashboard - Right Sidebar */}
              <div className="w-full flex-shrink-0 xl:w-80">
                <InteractiveLearningDashboard
                  chapterId={chapterId}
                  sectionId={currentSection.id}
                  concepts={chapterConcepts}
                  glossary={Object.fromEntries(
                    Object.entries(chapterGlossary).map(([key, value]) => [
                      key,
                      value.definition,
                    ])
                  )}
                  progressData={{
                    completed: completedSections.length,
                    total: availableSections.length,
                    timeSpent: timeSpentMinutes,
                  }}
                />

                {/* Content Progress Tracker for theory sections */}
                {/* {currentSection.type === "theory" && theoryContent && (
              <div className="mt-6">
                <ContentProgressTracker
                  sectionId={currentSection.id}
                  totalSubsections={theoryContent.sections.length}
                  currentSubsection={currentSubSection}
                  estimatedReadTime={currentSection.estimatedTime}
                  onNavigate={(direction) => {
                    if (direction === "next") {
                      setCurrentSubSection(
                        Math.min(
                          theoryContent.sections.length - 1,
                          currentSubSection + 1
                        )
                      );
                    } else {
                      setCurrentSubSection(Math.max(0, currentSubSection - 1));
                    }
                  }}
                />
              </div>
            )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

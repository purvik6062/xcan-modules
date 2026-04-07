"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { orbitChapters, quizQuestions } from "../../../../data/orbitChapters";
import { useWalletProtection } from "../../../../hooks/useWalletProtection";
import ChapterContent from "../../../../components/ChapterContent";
import SectionNavigation from "../../../../components/SectionNavigation";
import ProgressBar from "../../../../components/ProgressBar";
import QuizComponent from "../../../../components/QuizComponent";
import ChallengeComponent from "../../../../components/ChallengeComponent";
import DeployChainSection from "../../../../components/DeployChainSection";
import DeployedChainsSection from "../../../../components/DeployedChainsSection";
import LearningModuleSidebar from "../../../../components/LearningModuleSidebar";

export default function OrbitChapterPage() {
  const params = useParams();
  const chapterId = params?.chapterId as string;

  const chapter = orbitChapters.find((c) => c.id === chapterId);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const { address, isReady } = useWalletProtection();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!isReady || !address) return;
      try {
        const params = new URLSearchParams({ userAddress: address, module: "master-orbit" });
        console.log("[Orbit] GET /api/challenges", { chapterId, address });
        const res = await fetch(`/api/challenges?${params.toString()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          console.log("[Orbit] GET /api/challenges response", data);
          const chapterCompleted: string[] = data?.chapters?.[chapterId] || [];
          setCompletedSections(chapterCompleted);
        }
      } catch (e) {
        console.warn("[Orbit] GET /api/challenges error", e);
      }
    };
    load();
  }, [chapterId, address, isReady]);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <LearningModuleSidebar currentModuleId="arbitrum-orbit" backHref="/learn-orbit" />
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/90 p-8 text-center shadow-xl">
              <h1 className="mb-4 text-2xl font-bold text-white">
                Chapter Not Found
              </h1>
              <p className="text-slate-300">
                The Orbit chapter you&apos;re looking for doesn&apos;t exist.
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
  const isChapterComplete =
    availableSections.length > 0 &&
    completedSections.length >= availableSections.length;
  const chapterIndex = orbitChapters.findIndex((c) => c.id === chapterId);
  const nextChapter =
    chapterIndex >= 0 && chapterIndex < orbitChapters.length - 1
      ? orbitChapters[chapterIndex + 1]
      : null;

  // Special handling for production-deployment and hands-on-deployment chapters
  const isProductionDeployment = chapterId === "production-deployment";
  const isHandsOnDeployment = chapterId === "hands-on-deployment";
  const isLastSection = currentSectionIndex === chapter.sections.length - 1;
  const isLastSectionComplete = isLastSection && completedSections.includes(currentSection.id);

  const handleSectionComplete = async (sectionId: string) => {
    const already = completedSections.includes(sectionId);
    const updated = already ? completedSections : [...completedSections, sectionId];
    if (!already) setCompletedSections(updated);

    try {
      if (!isReady || !address) return;
      console.log("[Orbit] POST /api/challenges", { chapterId, sectionId, address });
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: address, chapterId, sectionId, module: "master-orbit", finalizeChapter: true }),
      });
      const json = await res.json().catch(() => ({}));
      console.log("[Orbit] POST /api/challenges response", { status: res.status, json });
    } catch (e) {
      console.warn("[Orbit] POST /api/challenges error", e);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <LearningModuleSidebar currentModuleId="arbitrum-orbit" backHref="/learn-orbit" />
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

            {/* Deployed Chains Section - Only show on hands-on-deployment chapter */}
            {chapterId === "hands-on-deployment" && isReady && address && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <DeployedChainsSection userAddress={address} />
              </motion.div>
            )}

            {/* Chapter Content Layout */}
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

                {/* Capstone Project Preview */}
                {chapter.capstoneProject && (
                  <motion.div
                    className="mt-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">🚀</div>
                      <h3 className="text-lg font-bold mb-2">
                        Final Project
                      </h3>
                      <p className="text-sm opacity-90">
                        {chapter.capstoneProject.title}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <motion.div
                  className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {isChapterComplete && !isProductionDeployment && (
                    <div className="flex flex-col gap-3 border-b border-emerald-700 bg-emerald-900/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 text-sm text-emerald-200 sm:text-base">
                        ✅ Chapter complete! {nextChapter ? "You can continue to the next chapter." : "You've reached the end of this module's chapters."}
                      </div>
                      {nextChapter && (
                        <Link
                          href={`/learn-orbit/${nextChapter.id}`}
                          className="hover:cursor-pointer whitespace-normal rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm text-white transition-colors hover:bg-emerald-700 sm:whitespace-nowrap"
                        >
                          Continue to {nextChapter.title} →
                        </Link>
                      )}
                    </div>
                  )}
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="text-xl font-bold sm:text-2xl">
                          {currentSection.title}
                        </h2>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs opacity-90 sm:gap-4 sm:text-sm">
                          <span>
                            Section {currentSectionIndex + 1} of{" "}
                            {chapter.sections.length}
                          </span>
                          <span>•</span>
                          <span>{currentSection.estimatedTime}</span>
                          <span>•</span>
                          <span className="capitalize">{currentSection.type}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 sm:text-right">
                        {completedSections.includes(currentSection.id) && (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">✅</span>
                            <span className="text-sm">Completed</span>
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
                            chapterId={chapterId}
                          />
                        ) : currentSection.type === "challenge" ? (
                          <ChallengeComponent
                            section={currentSection}
                            onComplete={() =>
                              handleSectionComplete(currentSection.id)
                            }
                          />
                        ) : currentSection.id === "deploy-your-chain" || currentSection.id === "deploy-your-chain-live" ? (
                          <DeployChainSection
                            onComplete={() =>
                              handleSectionComplete(currentSection.id)
                            }
                          />
                        ) : (
                          <ChapterContent
                            key={currentSection.id}
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
                    {/* Special Continue Learning button for production-deployment chapter */}
                    {isProductionDeployment && isLastSectionComplete && nextChapter ? (
                      <div className="flex flex-col gap-4">
                        <div className="bg-emerald-900/30 border border-emerald-700 p-4 rounded-lg">
                          <div className="text-emerald-200 mb-3">
                            ✅ Chapter complete! Continue your learning journey with hands-on deployment.
                          </div>
                          <Link
                            href={`/learn-orbit/${nextChapter.id}`}
                            className="hover:cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold w-full justify-center"
                          >
                            Continue Learning: {nextChapter.title} →
                          </Link>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <button
                            onClick={goToPreviousSection}
                            disabled={currentSectionIndex === 0}
                            className="hover:cursor-pointer order-2 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 text-gray-300 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 sm:order-1 sm:w-auto"
                          >
                            ← Previous
                          </button>

                          <div className="order-1 text-center text-sm text-gray-400 sm:order-2">
                            {currentSectionIndex + 1} / {chapter.sections.length}
                          </div>

                          <button
                            onClick={goToNextSection}
                            disabled={
                              currentSectionIndex === chapter.sections.length - 1
                            }
                            className="hover:cursor-pointer order-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    ) : isHandsOnDeployment && isLastSectionComplete ? (
                      <div className="flex flex-col gap-4">
                        <div className="bg-emerald-900/30 border border-emerald-700 p-4 rounded-lg">
                          <div className="text-emerald-200 mb-3">
                            ✅ Chapter complete! You've successfully completed the hands-on deployment.
                          </div>
                          <Link
                            href="/learn-orbit"
                            className="hover:cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold w-full justify-center"
                          >
                            Continue Learning: Back to Modules →
                          </Link>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <button
                            onClick={goToPreviousSection}
                            disabled={currentSectionIndex === 0}
                            className="hover:cursor-pointer order-2 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 text-gray-300 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 sm:order-1 sm:w-auto"
                          >
                            ← Previous
                          </button>

                          <div className="order-1 text-center text-sm text-gray-400 sm:order-2">
                            {currentSectionIndex + 1} / {chapter.sections.length}
                          </div>

                          <button
                            onClick={goToNextSection}
                            disabled={
                              currentSectionIndex === chapter.sections.length - 1
                            }
                            className="hover:cursor-pointer order-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          onClick={goToPreviousSection}
                          disabled={currentSectionIndex === 0}
                          className="hover:cursor-pointer order-2 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 text-gray-300 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 sm:order-1 sm:w-auto"
                        >
                          ← Previous
                        </button>

                        <div className="order-1 text-center text-sm text-gray-400 sm:order-2">
                          {currentSectionIndex + 1} / {chapter.sections.length}
                        </div>

                        <button
                          onClick={goToNextSection}
                          disabled={
                            currentSectionIndex === chapter.sections.length - 1
                          }
                          className="hover:cursor-pointer order-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
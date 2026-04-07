"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { eigenChapters } from "../../../../data/eigenChapters";
import Web3BasicsContent from "../../../../components/web3-basics/Web3BasicsContent";
import ChapterCompletionModal from "../../../../components/web3-basics/ChapterCompletionModal";
import { useWalletProtection } from "../../../../hooks/useWalletProtection";
import LearningModuleSidebar from "../../../../components/LearningModuleSidebar";
import { MODULE_THEME_BG_R } from "@/theme/moduleTheme";

export default function EigenChapterPage() {
    const params = useParams();
    const chapterId = params?.chapterId as string;

    const chapter = eigenChapters.find((c) => c.id === chapterId);
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
                const res = await fetch(`/api/challenges?${params.toString()}&module=eigen-ai`, { cache: "no-store" });
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
            <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221]">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <LearningModuleSidebar currentModuleId="eigen-ai" backHref="/learn-eigen" />
                    <div className="flex flex-1 items-center justify-center px-6">
                        <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/80 p-8 text-center shadow-lg">
                            <h1 className="mb-4 text-2xl font-bold text-white">
                                Chapter Not Found
                            </h1>
                            <p className="text-gray-300">
                                The Eigen AI chapter you&apos;re looking for doesn&apos;t exist.
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
                    body: JSON.stringify({ userAddress: address, chapterId, sectionId, level: chapter.level, points: chapter.points, module: "eigen-ai" }),
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
                for (let i = prevIndex + 1; i < chapter.sections.length; i++) {
                    if (chapter.sections[i].status === "available") {
                        return i;
                    }
                }
                return prevIndex;
            });
        }
    };

    const goToNextSection = () => {
        for (let i = currentSectionIndex + 1; i < chapter.sections.length; i++) {
            if (chapter.sections[i].status === "available") {
                setCurrentSectionIndex(i);
                break;
            }
        }
    };

    const goToPreviousSection = () => {
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
    const currentChapterIndex = eigenChapters.findIndex(ch => ch.id === chapterId);
    const nextChapter = currentChapterIndex < eigenChapters.length - 1
        ? eigenChapters[currentChapterIndex + 1]
        : null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221]">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <LearningModuleSidebar currentModuleId="eigen-ai" backHref="/learn-eigen" />
                    <div className="flex flex-1 items-center justify-center">
                        <motion.div
                            className="relative h-24 w-24"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                            <div className="absolute inset-0 rounded-full border-4 border-[#4A7CFF]/20" />
                            <div className="absolute inset-2 rounded-full border-t-4 border-[#79A5FF]" />
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221]">
            <div className="flex min-h-screen flex-col lg:flex-row">
                <LearningModuleSidebar currentModuleId="eigen-ai" backHref="/learn-eigen" />
                <div className="flex-1">
                    {/* Chapter Header with Progress */}
                    <div className="border-b border-gray-700 bg-gray-800 p-4 sm:p-6">
                        <div className="container mx-auto">
                            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <h1 className="mb-2 text-2xl font-bold bg-gradient-to-r from-[#79A5FF] via-[#4A7CFF] to-[#1E3A8A] bg-clip-text text-transparent sm:text-3xl">{chapter.title}</h1>
                                    <p className="text-sm text-gray-300 sm:text-base">{chapter.description}</p>
                                </div>
                                <div className="flex-shrink-0 text-left sm:text-right">
                                    <div className="mb-1 text-xs text-gray-400 sm:text-sm">Chapter Progress</div>
                                    <div className="text-xl font-bold text-[#79A5FF] sm:text-2xl">
                                        {Math.round(progress)}%
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-3 w-full rounded-full bg-gray-700">
                                <motion.div
                                    className={`h-3 rounded-full ${MODULE_THEME_BG_R}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            <div className="mt-2 flex flex-col gap-1 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                                <span>{completedSections.length}/{availableSections.length} sections completed</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[#79A5FF]">{chapter.points} points</span>
                                    <span>{chapter.duration}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chapter Content */}
                    <div className="px-4 py-6 sm:px-6 sm:py-8">
                        {currentSection.status === "available" ? (
                            <>
                                <div className="">
                                    <Web3BasicsContent
                                        section={currentSection as any}
                                        chapterId={chapterId}
                                        onComplete={() =>
                                            handleSectionComplete(currentSection.id)
                                        }
                                    />

                                    {/* Section Navigation */}
                                    <div className="mt-8 flex flex-col gap-3 border-t border-gray-700 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                        <button
                                            onClick={goToPreviousSection}
                                            disabled={!hasPreviousAvailableSection()}
                                            className={`order-2 w-full rounded-lg px-4 py-3 text-sm transition-all duration-200 hover:cursor-pointer sm:order-1 sm:w-auto sm:px-6 ${!hasPreviousAvailableSection()
                                                ? "cursor-not-allowed bg-gray-700 text-gray-500"
                                                : "bg-gray-700 text-white hover:bg-gray-600"
                                                }`}
                                        >
                                            ← Previous Section
                                        </button>

                                        <div className="order-1 text-center text-xs text-gray-400 sm:order-2 sm:text-sm">
                                            Section {availableSections.findIndex(s => s.id === currentSection.id) + 1} of {availableSections.length}
                                        </div>

                                        <button
                                            onClick={goToNextSection}
                                            disabled={!hasNextAvailableSection()}
                                            className={`order-3 w-full rounded-lg px-4 py-3 text-sm transition-all duration-200 hover:cursor-pointer sm:w-auto sm:px-6 ${!hasNextAvailableSection()
                                                ? "cursor-not-allowed bg-gray-700 text-gray-500"
                                                : "bg-gray-700 text-white hover:bg-gray-600"
                                                }`}
                                        >
                                            Next Section →
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex min-h-screen items-center justify-center bg-gray-900">
                                <div className="max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 text-center">
                                    <div className="mb-4 text-6xl">🔒</div>
                                    <h3 className="mb-2 text-xl font-bold text-white">
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
                        basePath="/learn-eigen"
                        moduleTitle="Secure AI with Eigen"
                    />
                </div>
            </div>
        </div>
    );
}

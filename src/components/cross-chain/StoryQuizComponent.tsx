"use client";

import { useState, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryContent } from "../../data/crossChainChapters";
import GitHubAuthHandler from "../GitHubAuthHandler";
import toast from "react-hot-toast";
import { StoryQuizMarkdownPanel } from "../StoryQuizMarkdownPanel";

interface StoryQuizComponentProps {
  content: StoryContent;
  onComplete: () => void;
}

export default function StoryQuizComponent({
  content,
  onComplete,
}: StoryQuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [answered, setAnswered] = useState(false);
  const [, startTransition] = useTransition();

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setAnswered(true);
  };

  const handleNextQuestion = useCallback(() => {
    startTransition(() => {
      if (currentQuestion < content.questions.length - 1) {
        setCurrentQuestion((q) => q + 1);
        setAnswered(false);
      } else {
        onComplete();
      }
    });
  }, [currentQuestion, content.questions.length, onComplete, startTransition]);

  // Results popup removed to enable seamless progression

  // Main side-by-side layout
  const question = content.questions[currentQuestion];
  const isAnswered = answered;
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <GitHubAuthHandler
      onAuthComplete={(githubUsername) => {
        handleNextQuestion();
      }}
      onAuthError={(error) => {
        const msg = error?.toLowerCase().includes("wallet") ? "Connect your wallet first" : (error || "Authentication failed");
        toast.error(msg);
      }}
    >
      {({ isAuthenticating, triggerAuth }) => (
        <div className="min-h-screen bg-gray-900">
      <div className="w-full p-4 sm:p-6 lg:p-4">
        {/* Progress Bar */}
        <div className="mb-5 sm:mb-8 lg:mb-4">
          <div className="mb-2 flex items-center justify-between sm:mb-3">
            <span className="text-sm font-medium text-gray-300 lg:text-xs">
              Question {currentQuestion + 1} of {content.questions.length}
            </span>
            <span className="text-sm text-gray-400 lg:text-xs">
              {Math.round(((currentQuestion + (isAnswered ? 1 : 0)) / content.questions.length) * 100)}% complete
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-700 sm:h-3 lg:h-2">
            <motion.div
              className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 sm:h-3 lg:h-2"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestion + (isAnswered ? 1 : 0)) / content.questions.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Side by Side Layout — wider quiz column on laptop (2/5) */}
        <div className="grid grid-cols-1 gap-6 min-h-[480px] lg:grid-cols-5 lg:gap-4 lg:min-h-[min(560px,72vh)]">
          {/* Story Content - Left Side */}
          <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 lg:col-span-3">
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:max-h-[min(72vh,640px)] lg:p-4">
                <StoryQuizMarkdownPanel story={content.story} />
              </div>
            </div>
          </div>

          {/* Quiz Content - Right Side */}
          <div className="h-fit max-h-none overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 lg:sticky lg:top-4 lg:col-span-2 lg:max-h-[min(72vh,640px)] lg:overflow-y-auto">
            <div className="flex h-full flex-col">
              {/* Quiz Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white sm:p-5 lg:p-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl lg:text-lg">🎯</span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold sm:text-xl lg:text-base">Test Your Knowledge</h3>
                    <p className="text-xs text-blue-100 sm:text-sm lg:text-[11px] lg:leading-snug">Answer all questions correctly to proceed</p>
                  </div>
                </div>
              </div>

              {/* Quiz Content */}
              <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-3">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex flex-1 flex-col min-h-[240px] lg:min-h-0"
                  >
                    {/* Question */}
                    <div className="mb-4 rounded-xl border border-gray-600 bg-gray-700 p-4 sm:p-5 sm:mb-6 lg:mb-3 lg:p-3">
                      <h4 className="mb-1.5 text-base font-semibold text-white sm:mb-2 sm:text-lg lg:text-xs lg:uppercase lg:tracking-wide">
                        Question {currentQuestion + 1}
                      </h4>
                      <p className="text-sm leading-snug text-gray-200 sm:text-base lg:text-sm lg:leading-normal">
                        {question.question}
                      </p>
                    </div>

                    {/* Answer Options */}
                    <div className="mb-4 space-y-2 sm:mb-6 sm:space-y-3 lg:mb-3 lg:space-y-2">
                      {question.options.map((option, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={isAnswered}
                          className={`w-full rounded-xl border-2 p-3 text-left transition-colors duration-150 hover:cursor-pointer sm:p-4 lg:p-2.5 ${isAnswered
                            ? index === question.correctAnswer
                              ? "border-green-400 bg-green-900/20 text-green-200"
                              : index === selectedAnswer
                                ? "border-red-400 bg-red-900/20 text-red-200"
                                : "border-gray-600 bg-gray-700 text-gray-400"
                            : "border-gray-600 hover:border-blue-400 hover:bg-gray-700 bg-gray-800 text-gray-200 active:scale-[0.99]"
                            }`}
                        >
                          <div className="flex items-start gap-2.5 sm:items-center sm:gap-3 lg:gap-2">
                            <div
                              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold sm:h-8 sm:w-8 sm:text-sm lg:h-6 lg:w-6 lg:text-[11px] ${isAnswered
                                ? index === question.correctAnswer
                                  ? "border-green-400 bg-green-400 text-gray-400"
                                  : index === selectedAnswer
                                    ? "border-red-400 bg-red-400 text-white"
                                    : "border-gray-500 bg-gray-600"
                                : "border-gray-500 bg-gray-700"
                                }`}
                            >
                              {isAnswered && index === question.correctAnswer && "✓"}
                              {isAnswered &&
                                index === selectedAnswer &&
                                index !== question.correctAnswer &&
                                "✗"}
                              {!isAnswered && String.fromCharCode(65 + index)}
                            </div>
                            <span className="flex-1 text-sm font-medium leading-snug sm:text-base lg:text-xs">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Explanation */}
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl border p-3 sm:p-4 lg:p-2.5 ${isCorrect
                          ? "bg-green-900/20 border-green-500"
                          : "bg-orange-900/20 border-orange-500"
                          }`}
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="text-lg sm:text-xl lg:text-base">{isCorrect ? "🎉" : "💡"}</span>
                          <span
                            className={`text-sm font-bold lg:text-xs ${isCorrect ? "text-green-400" : "text-orange-400"
                              }`}
                          >
                            {isCorrect ? "Correct!" : "Not quite right"}
                          </span>
                        </div>
                        <p
                          className={`text-sm leading-relaxed lg:text-xs ${isCorrect ? "text-green-300" : "text-orange-300"
                            }`}
                        >
                          {question.explanation}
                        </p>
                      </motion.div>
                    )}

                    {/* Next Button */}
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 sm:mt-6 lg:mt-3"
                      >
                        <button
                          type="button"
                          onClick={triggerAuth}
                          disabled={isAuthenticating}
                          className={`flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:cursor-pointer hover:from-blue-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-3 sm:text-base lg:py-2 lg:text-xs ${isAuthenticating ? "animate-pulse" : ""}`}
                        >
                          {isAuthenticating ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Connecting GitHub...
                            </>) : (currentQuestion < content.questions.length - 1 ? "Next Question" : "Complete Section")}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )}
    </GitHubAuthHandler>
  );
}
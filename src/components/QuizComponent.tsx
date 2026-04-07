"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Quiz } from "../data/defiChapters";
import GitHubAuthHandler from "./GitHubAuthHandler";
import toast from "react-hot-toast";

interface QuizComponentProps {
  questions: Quiz[];
  onComplete: () => void;
  chapterId?: string;
}

export default function QuizComponent({
  questions,
  onComplete,
  chapterId,
}: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [pendingCompletion, setPendingCompletion] = useState(false);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setAnswered(false);
  };

  return (
    <GitHubAuthHandler
      onAuthComplete={() => {
        if (pendingCompletion) {
          setPendingCompletion(false);
          onComplete();
        }
      }}
      onAuthError={(error) => {
        const msg = error?.toLowerCase().includes("wallet") ? "Connect your wallet first" : (error || "Authentication failed");
        toast.error(msg);
        setPendingCompletion(false);
      }}
    >
      {({ isAuthenticating, hasGithub, triggerAuth }) => {
        const requestCompletion = () => {
          if (hasGithub) {
            onComplete();
          } else {
            setPendingCompletion(true);
            triggerAuth();
          }
        };

        const ADVANCE_MS = 720;

        const handleAnswerSelect = (answerIndex: number) => {
          if (answered) return;

          const qIndex = currentQuestion;
          const newAnswers = [...selectedAnswers];
          newAnswers[qIndex] = answerIndex;
          setSelectedAnswers(newAnswers);
          setAnswered(true);

          if (advanceTimeoutRef.current) {
            clearTimeout(advanceTimeoutRef.current);
          }

          advanceTimeoutRef.current = setTimeout(() => {
            advanceTimeoutRef.current = null;
            if (qIndex < questions.length - 1) {
              setCurrentQuestion(qIndex + 1);
              setAnswered(false);
              return;
            }

            const correct = newAnswers.reduce((acc, ans, i) => {
              if (ans === questions[i]?.correctAnswer) return acc + 1;
              return acc;
            }, 0);
            const score = Math.round((correct / questions.length) * 100);

            setShowResults(true);
            requestAnimationFrame(() => {
              if (score >= 70) {
                confetti({
                  particleCount: 80,
                  spread: 65,
                  origin: { y: 0.6 },
                });
              }
            });
            requestCompletion();
          }, ADVANCE_MS);
        };

        if (questions.length === 0) {
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❓</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Quiz Coming Soon
              </h3>
              <p className="text-gray-300">
                Quiz questions for this chapter are being prepared.
              </p>
              <button
                onClick={() => {
                  if (!isAuthenticating) {
                    requestCompletion();
                  }
                }}
                disabled={isAuthenticating}
                className="hover:cursor-pointer mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {isAuthenticating ? "Connecting GitHub..." : "Mark as Complete"}
              </button>
            </div>
          );
        }

        if (showResults) {
          const score = calculateScore();
          const passed = score >= 70;

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center lg:py-5"
            >
              <div className={`mb-3 text-5xl lg:mb-2 lg:text-4xl ${passed ? "🎉" : "📚"}`}>
                {passed ? "🎉" : "📚"}
              </div>

              <h3 className="mb-1 text-2xl font-bold text-white lg:text-xl">
                Quiz Complete!
              </h3>

              <div
                className={`mb-3 text-4xl font-bold lg:mb-2 lg:text-3xl ${passed ? "text-green-600" : "text-orange-600"
                  }`}
              >
                {score}%
              </div>

              <p
                className={`mb-5 text-lg lg:mb-4 lg:text-base ${passed
                  ? "text-green-400"
                  : "text-orange-400"
                  }`}
              >
                {passed
                  ? "Excellent work! You've mastered this material."
                  : "Good effort! You can review the material or continue learning."}
              </p>

              <div className="mx-auto mb-6 max-w-3xl space-y-3 text-left lg:mb-5 lg:max-w-4xl lg:space-y-2">
                {questions.map((question, index) => {
                  const isCorrect = selectedAnswers[index] === question.correctAnswer;
                  return (
                    <div
                      key={question.id}
                      className={`rounded-lg border-2 p-3 lg:p-2.5 ${isCorrect
                        ? "border-green-700 bg-green-900/20"
                        : "border-red-700 bg-red-900/20"
                        }`}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className={`text-lg lg:text-base ${isCorrect ? "✅" : "❌"}`}>
                          {isCorrect ? "✅" : "❌"}
                        </span>
                        <span className="text-sm font-medium text-white lg:text-xs">
                          Question {index + 1}
                        </span>
                      </div>
                      <p className="mb-1.5 text-sm text-gray-300 lg:text-xs">
                        {question.question}
                      </p>
                      <p className="text-sm text-gray-200 lg:text-xs">
                        <strong>Correct answer:</strong>{" "}
                        {question.options[question.correctAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="mt-1 text-sm text-gray-300 lg:text-xs">
                          <strong>Your answer:</strong>{" "}
                          {question.options[selectedAnswers[index]]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center gap-3 lg:gap-2">
                {/* <button
                  onClick={restartQuiz}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Retake Quiz
                </button> */}
                <button
                  onClick={() => window.history.back()}
                  className="hover:cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm text-white transition-colors hover:bg-blue-700 lg:px-4 lg:py-2 lg:text-xs"
                >
                  Continue Learning
                </button>
              </div>
            </motion.div>
          );
        }

        const question = questions[currentQuestion];
        const isAnswered = answered;
        const selectedAnswer = selectedAnswers[currentQuestion];
        const isCorrect = selectedAnswer === question.correctAnswer;

        return (
          <div className="mx-auto max-w-2xl lg:max-w-4xl xl:max-w-5xl">
            {/* Progress */}
            <div className="mb-4 lg:mb-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300 lg:text-xs">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-400 lg:text-xs">
                  {Math.round(
                    ((currentQuestion + (isAnswered ? 1 : 0)) / questions.length) * 100
                  )}
                  % complete
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-600 lg:h-1.5">
                <motion.div
                  className="h-2 rounded-full bg-blue-500 lg:h-1.5"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      ((currentQuestion + (isAnswered ? 1 : 0)) / questions.length) * 100
                    }%`,
                  }}
                  transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                className="min-h-[180px] lg:min-h-0"
              >
                <div className="mb-4 rounded-xl bg-blue-900/20 p-4 sm:p-5 lg:mb-3 lg:p-3">
                  <h3 className="text-lg font-bold leading-snug text-white sm:text-xl lg:text-base lg:font-semibold lg:leading-normal">
                    {question.question}
                  </h3>
                </div>

                {/* Answer Options */}
                <div className="mb-4 space-y-2 sm:space-y-3 lg:mb-3 lg:space-y-2">
                  {question.options.map((option, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={isAnswered}
                      className={`w-full rounded-lg border-2 p-3 text-left transition-colors duration-150 sm:p-4 lg:p-2.5 ${isAnswered
                        ? index === question.correctAnswer
                          ? "border-green-500 bg-green-900/20 text-green-300"
                          : index === selectedAnswer
                            ? "border-red-500 bg-red-900/20 text-red-300"
                            : "border-slate-600 bg-slate-700 text-gray-400"
                        : "border-slate-600 hover:border-blue-500 hover:bg-blue-900/20 active:scale-[0.99]"
                        }`}
                    >
                      <div className="flex items-start gap-2.5 sm:items-center sm:gap-3 lg:gap-2">
                        <div
                          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold lg:h-5 lg:w-5 lg:text-xs ${isAnswered
                            ? index === question.correctAnswer
                              ? "border-green-500 bg-green-500 text-white"
                              : index === selectedAnswer
                                ? "border-red-500 bg-red-500 text-white"
                                : "border-gray-600"
                            : "border-gray-600"
                            }`}
                        >
                          {isAnswered && index === question.correctAnswer && "✓"}
                          {isAnswered &&
                            index === selectedAnswer &&
                            index !== question.correctAnswer &&
                            "✗"}
                          {!isAnswered && String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1 text-sm leading-snug sm:text-base lg:text-sm">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Explanation */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg p-3 sm:p-4 lg:p-2.5 ${isCorrect
                      ? "bg-green-900/20 border border-green-700"
                      : "bg-orange-900/20 border border-orange-700"
                      }`}
                    >
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-lg lg:text-base">{isCorrect ? "🎉" : "💡"}</span>
                      <span
                        className={`text-sm font-bold lg:text-xs ${isCorrect
                          ? "text-green-300"
                          : "text-orange-300"
                          }`}
                      >
                        {isCorrect ? "Correct!" : "Not quite right"}
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-relaxed lg:text-xs ${isCorrect
                        ? "text-green-400"
                        : "text-orange-400"
                        }`}
                    >
                      {question.explanation}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        );
      }}
    </GitHubAuthHandler>
  );
}

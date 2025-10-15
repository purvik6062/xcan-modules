"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Quiz } from "../data/defiChapters";

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
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [answered, setAnswered] = useState(false);

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
          onClick={onComplete}
          className="hover:cursor-pointer mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Mark as Complete
        </button>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setAnswered(true);

    // Show feedback for 2 seconds, then move to next question or results
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswered(false);
      } else {
        setShowResults(true);
        // Trigger confetti if they got most questions right
        const score = calculateScore();
        if (score >= 70) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
        onComplete();
      }
    }, 2000);
  };

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

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 70;
    console.log("passed", score);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className={`text-6xl mb-4 ${passed ? "🎉" : "📚"}`}>
          {passed ? "🎉" : "📚"}
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          Quiz Complete!
        </h3>

        <div
          className={`text-4xl font-bold mb-4 ${passed ? "text-green-600" : "text-orange-600"
            }`}
        >
          {score}%
        </div>

        <p
          className={`text-lg mb-6 ${passed
            ? "text-green-400"
            : "text-orange-400"
            }`}
        >
          {passed
            ? "Excellent work! You've mastered this material."
            : "Good effort! You can review the material or continue learning."}
        </p>

        <div className="space-y-4 mb-8">
          {questions.map((question, index) => {
            const isCorrect = selectedAnswers[index] === question.correctAnswer;
            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border-2 ${isCorrect
                  ? "border-green-700 bg-green-900/20"
                  : "border-red-700 bg-red-900/20"
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xl ${isCorrect ? "✅" : "❌"}`}>
                    {isCorrect ? "✅" : "❌"}
                  </span>
                  <span className="font-medium text-white">
                    Question {index + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  {question.question}
                </p>
                <p className="text-sm text-gray-200">
                  <strong>Correct answer:</strong>{" "}
                  {question.options[question.correctAnswer]}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-gray-300 mt-1">
                    <strong>Your answer:</strong>{" "}
                    {question.options[selectedAnswers[index]]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center">
          {/* <button
            onClick={restartQuiz}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retake Quiz
          </button> */}
          <button
            onClick={() => window.history.back()}
            className="hover:cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-400">
            {Math.round((currentQuestion / questions.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(currentQuestion / questions.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-blue-900/20 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {question.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${isAnswered
                  ? index === question.correctAnswer
                    ? "border-green-500 bg-green-900/20 text-green-300"
                    : index === selectedAnswer
                      ? "border-red-500 bg-red-900/20 text-red-300"
                      : "border-slate-600 bg-slate-700 text-gray-400"
                  : "border-slate-600 hover:border-blue-500 hover:bg-blue-900/20"
                  }`}
                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${isAnswered
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
                  <span className="flex-1">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${isCorrect
                ? "bg-green-900/20 border border-green-700"
                : "bg-orange-900/20 border border-orange-700"
                }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{isCorrect ? "🎉" : "💡"}</span>
                <span
                  className={`font-bold ${isCorrect
                    ? "text-green-300"
                    : "text-orange-300"
                    }`}
                >
                  {isCorrect ? "Correct!" : "Not quite right"}
                </span>
              </div>
              <p
                className={`text-sm ${isCorrect
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
}

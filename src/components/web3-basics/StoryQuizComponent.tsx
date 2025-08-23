"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { StoryContent, StoryQuestion } from "../../data/web3BasicsChapters";
import ReactMarkdown from "react-markdown";

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
  const [showResults, setShowResults] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < content.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
    } else {
      setShowResults(true);
      // Trigger confetti if they got all questions right
      const score = calculateScore();
      if (score >= 100) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      onComplete();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    content.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / content.questions.length) * 100);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setAnswered(false);
  };

  // Results screen overlay
  if (showResults) {
    const score = calculateScore();
    const passed = score >= 100; // All questions must be correct to proceed

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto m-4"
        >
          <div className="text-center">
            <div className={`text-6xl mb-4`}>
              {passed ? "🎉" : "📚"}
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              Learning Section Complete!
            </h3>

            <div
              className={`text-4xl font-bold mb-4 ${passed ? "text-green-400" : "text-orange-400"
                }`}
            >
              {score}%
            </div>

            <p
              className={`text-lg mb-6 ${passed ? "text-green-300" : "text-orange-300"
                }`}
            >
              {passed
                ? "Perfect! You've mastered this section and can move on!"
                : "Good try! Review the story and try again to unlock the next section."}
            </p>

            <div className="space-y-4 mb-8 text-left">
              {content.questions.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswer;
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${isCorrect
                      ? "border-green-500 bg-green-900/20"
                      : "border-red-500 bg-red-900/20"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xl`}>
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
                    <div className="mt-2 p-3 bg-gray-800 rounded text-sm text-gray-300">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              {!passed && (
                <button
                  onClick={restartQuiz}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              )}
              {passed && (
                <div className="text-green-400 flex items-center gap-2 font-semibold">
                  <span>🔓</span>
                  <span>Section unlocked! You can now proceed.</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main side-by-side layout
  const question = content.questions[currentQuestion];
  const isAnswered = answered;
  const selectedAnswer = selectedAnswers[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="w-full p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">
              Question {currentQuestion + 1} of {content.questions.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((currentQuestion + (isAnswered ? 1 : 0)) / content.questions.length) * 100)}% complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestion + (isAnswered ? 1 : 0)) / content.questions.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
          {/* Story Content - Left Side */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="p-8 flex-1 overflow-y-auto">
                <div className="prose prose-lg max-w-none prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-p:mb-4 prose-strong:text-blue-300 prose-em:text-cyan-300">
                  <div className="text-gray-200 leading-relaxed font-sans space-y-6">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-600 pb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-semibold text-blue-300 mb-4 mt-8">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-cyan-300 mb-3 mt-6">{children}</h3>,
                        p: ({ children }) => <p className="text-gray-200 text-base leading-7 mb-4">{children}</p>,
                        strong: ({ children }) => <strong className="text-blue-300 font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="text-cyan-300 italic">{children}</em>,
                        hr: () => <hr className="border-gray-600 my-8" />,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300 ml-4">{children}</ul>,
                        li: ({ children }) => <li className="text-gray-200 leading-6 mb-1">{children}</li>,
                        blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 bg-gray-800/50 py-2 rounded-r my-4">{children}</blockquote>,
                        code: ({ children }) => <code className="bg-gray-700 text-green-300 px-2 py-1 rounded text-sm font-mono">{children}</code>,
                        pre: ({ children }) => <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto my-4">{children}</pre>
                      }}
                    >
                      {content.story}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Content - Right Side */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Quiz Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="text-xl font-bold">Test Your Knowledge</h3>
                    <p className="text-blue-100 text-sm">Answer all questions correctly to proceed</p>
                  </div>
                </div>
              </div>

              {/* Quiz Content */}
              <div className="p-6 flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col"
                  >
                    {/* Question */}
                    <div className="bg-gray-700 rounded-xl p-6 mb-6 border border-gray-600">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Question {currentQuestion + 1}
                      </h4>
                      <p className="text-gray-200">
                        {question.question}
                      </p>
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-3 mb-6">
                      {question.options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={isAnswered}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${isAnswered
                            ? index === question.correctAnswer
                              ? "border-green-400 bg-green-900/20 text-green-200"
                              : index === selectedAnswer
                                ? "border-red-400 bg-red-900/20 text-red-200"
                                : "border-gray-600 bg-gray-700 text-gray-400"
                            : "border-gray-600 hover:border-blue-400 hover:bg-gray-700 bg-gray-800 text-gray-200"
                            }`}
                          whileHover={!isAnswered ? { scale: 1.02 } : {}}
                          whileTap={!isAnswered ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${isAnswered
                                ? index === question.correctAnswer
                                  ? "border-green-400 bg-green-400 text-gray-900"
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
                            <span className="flex-1 font-medium">{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Explanation */}
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border ${isCorrect
                          ? "bg-green-900/20 border-green-500"
                          : "bg-orange-900/20 border-orange-500"
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{isCorrect ? "🎉" : "💡"}</span>
                          <span
                            className={`font-bold ${isCorrect ? "text-green-400" : "text-orange-400"
                              }`}
                          >
                            {isCorrect ? "Correct!" : "Not quite right"}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${isCorrect ? "text-green-300" : "text-orange-300"
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
                        className="mt-6"
                      >
                        <button
                          onClick={handleNextQuestion}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium"
                        >
                          {currentQuestion < content.questions.length - 1 ? "Next Question" : "Complete Section"}
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
  );
}

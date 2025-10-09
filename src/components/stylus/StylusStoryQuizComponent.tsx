"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryContent } from "../../data/stylusChapters";
import ReactMarkdown from "react-markdown";
import GitHubAuthHandler from "../GitHubAuthHandler";

interface StylusStoryQuizComponentProps {
  content: StoryContent;
  onComplete: () => void;
}

export default function StylusStoryQuizComponent({
  content,
  onComplete,
}: StylusStoryQuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
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
      onComplete();
    }
  };

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
        console.error("GitHub authentication error:", error);
      }}
    >
      {({ isAuthenticating, triggerAuth }) => (
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
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentQuestion + (isAnswered ? 1 : 0)) / content.questions.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Side by Side Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
              {/* Story Content - Left Side */}
              <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="p-8 flex-1 overflow-y-auto">
                    <div className="prose prose-lg max-w-none prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-p:mb-4 prose-strong:text-pink-300 prose-em:text-rose-300">
                      <div className="text-gray-200 leading-relaxed font-sans space-y-6">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-600 pb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-2xl font-semibold text-pink-300 mb-4 mt-8">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xl font-semibold text-rose-300 mb-3 mt-6">{children}</h3>,
                            p: ({ children }) => <p className="text-gray-200 text-base leading-7 mb-4">{children}</p>,
                            strong: ({ children }) => <strong className="text-pink-300 font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="text-rose-300 italic">{children}</em>,
                            hr: () => <hr className="border-gray-600 my-8" />,
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300 ml-4">{children}</ul>,
                            li: ({ children }) => <li className="text-gray-200 leading-6 mb-1">{children}</li>,
                            blockquote: ({ children }) => <blockquote className="border-l-4 border-pink-500 pl-4 italic text-gray-300 bg-gray-800/50 py-2 rounded-r my-4">{children}</blockquote>,
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
              <div className="h-fit sticky top-6 bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Quiz Header */}
                  <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <h3 className="text-xl font-bold">Test Your Knowledge</h3>
                        <p className="text-pink-100 text-sm">Answer all questions correctly to proceed</p>
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
                                : "border-gray-600 hover:border-pink-400 hover:bg-gray-700 bg-gray-800 text-gray-200"
                                }`}
                              whileHover={!isAnswered ? { scale: 1.02 } : {}}
                              whileTap={!isAnswered ? { scale: 0.98 } : {}}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${isAnswered
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
                              onClick={triggerAuth}
                              disabled={isAuthenticating}
                              className={`w-full flex items-center justify-center cursor-pointer px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-200 font-medium ${isAuthenticating ? 'from-pink-[#010335] to-pink-700 animate-pulse' : ''}`}
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


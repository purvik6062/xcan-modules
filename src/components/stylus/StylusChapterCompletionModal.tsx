"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import Link from "next/link";

interface StylusChapterCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterTitle: string;
  nextChapterId?: string;
  nextChapterTitle?: string;
}

export default function StylusChapterCompletionModal({
  isOpen,
  onClose,
  chapterTitle,
  nextChapterId,
  nextChapterTitle,
}: StylusChapterCompletionModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti when modal opens
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EC4899', '#F43F5E', '#DB2777', '#F59E0B'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto m-4"
      >
        <div className="text-center">
          {/* Celebration Emoji */}
          <div className="text-8xl mb-6">🎉</div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-4">
            Congratulations!
          </h2>

          {/* Chapter Completion Message */}
          <p className="text-xl text-gray-300 mb-6">
            You've successfully completed <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600 font-semibold">{chapterTitle}</span>!
          </p>

          {/* Next Chapter Info */}
          {nextChapterId && nextChapterTitle ? (
            <div className="bg-pink-900/20 border border-pink-500 rounded-xl p-6 mb-8">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold text-pink-400 mb-2">
                Ready for the Next Challenge?
              </h3>
              <p className="text-pink-300 text-sm mb-4">
                Your next adventure awaits: <span className="font-semibold">{nextChapterTitle}</span>
              </p>

              {/* Navigation Button */}
              <Link
                href={`/learn-stylus/${nextChapterId}`}
                onClick={onClose}
                className="inline-block px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-200 font-medium text-lg"
              >
                Continue to Next Chapter →
              </Link>
            </div>
          ) : (
            <div className="bg-green-900/20 border border-green-500 rounded-xl p-6 mb-8">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                Stylus Core Concepts Completed!
              </h3>
              <p className="text-green-300 text-sm">
                Congratulations! You have successfully completed the Stylus Core Concepts module. Explore more modules on our platform.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {nextChapterId ? (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Stay Here
                </button>
                <Link
                  href={`/learn-stylus/${nextChapterId}`}
                  onClick={onClose}
                  className="hover:cursor-pointer px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-colors"
                >
                  Continue Learning
                </Link>
              </>
            ) : (
              <Link
                href="/learn-stylus"
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors"
              >
                Explore More Modules
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}


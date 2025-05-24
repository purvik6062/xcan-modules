
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiZap, FiX, FiCheck, FiStar, FiTrendingUp } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { GoTrophy, GoStar, GoRocket } from 'react-icons/go';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: {
    title: string;
    points: number;
    level: string;
  };
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, challenge }) => {
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && confettiCanvasRef.current) {
      // Get the canvas dimensions
      const canvas = confettiCanvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Create confetti instance with the canvas
      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true,
      });
      
      // Fire confetti when modal opens
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 1000,
        disableForReducedMotion: true
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Fire confetti from multiple positions
        myConfetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.2, 0.4), y: randomInRange(0.3, 0.5) },
          colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'],
        });
        myConfetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.6, 0.8), y: randomInRange(0.3, 0.5) },
          colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'],
        });
      }, 250);

      // Fire initial burst
      myConfetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#F97316'],
      });

      return () => {
        clearInterval(interval);
        myConfetti.reset();
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Canvas for confetti that covers the modal area */}
          <canvas 
            ref={confettiCanvasRef} 
            className="absolute inset-0 z-0 w-full h-full pointer-events-none"
          />
          
          <motion.div
            className="relative w-[95%] max-w-md bg-gradient-to-br from-[#0e1a35] to-[#1c2e54] rounded-2xl overflow-visible shadow-2xl border border-blue-500/30 z-10 mx-auto my-8 sm:my-12 mt-16 sm:mt-20"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/20 rounded-full filter blur-3xl -mr-8 sm:-mr-10 -mt-8 sm:-mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full filter blur-3xl -ml-8 sm:-ml-10 -mb-8 sm:-mb-10"></div>
            
            {/* Trophy icon with glow - positioned to not clip */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 sm:-translate-y-10">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full filter blur-xl opacity-50 scale-150"></div>
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 border-3 sm:border-4 border-yellow-300 relative z-10">
                  <GoTrophy className="text-2xl sm:text-3xl md:text-4xl text-white" />
                </div>
              </div>
            </div>
            
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-white bg-blue-900/30 hover:bg-blue-800/50 rounded-full p-1.5 sm:p-2 transition-colors z-10 cursor-pointer"
              aria-label="Close modal"
            >
              <FiX className="text-lg sm:text-xl cursor-pointer" />
            </button>
            
            {/* Content */}
            <div className="pt-12 sm:pt-14 md:pt-16 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Challenge Completed!</h2>
                <div className="w-16 sm:w-20 md:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 sm:mb-6"></div>
                
                <div className="bg-blue-900/30 border border-blue-700/30 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-300 mb-3 sm:mb-4">{challenge.title}</h3>
                  
                  <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-green-900/30 border border-green-700/50 flex items-center justify-center mb-1 sm:mb-2 shadow-inner shadow-green-900/50">
                        <FiCheck className="text-lg sm:text-xl md:text-2xl text-green-400 " />
                      </div>
                      <span className="text-xs sm:text-sm text-green-300">Completed</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-blue-900/30 border border-blue-700/50 flex items-center justify-center mb-1 sm:mb-2 shadow-inner shadow-blue-900/50">
                        <FiAward className="text-lg sm:text-xl md:text-2xl text-blue-400 " />
                      </div>
                      <span className="text-xs sm:text-sm text-blue-300">{challenge.points} XP</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-purple-900/30 border border-purple-700/50 flex items-center justify-center mb-1 sm:mb-2 shadow-inner shadow-purple-900/50">
                        <GoStar className="text-lg sm:text-xl md:text-2xl text-purple-400 " />
                      </div>
                      <span className="text-xs sm:text-sm text-purple-300">{challenge.level}</span>
                    </div>
                  </div>
                  
                  <div className="text-center bg-blue-950/30 p-2 sm:p-3 rounded-lg border border-blue-800/30">
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 md:mb-4">You've successfully mastered this challenge and earned rewards!</p>
                    
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-yellow-300 mb-1">
                      <GoRocket className="text-xs sm:text-sm md:text-lg animate-pulse cursor-pointer" />
                      <span className="text-xs sm:text-sm">Your blockchain skills are leveling up!</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-lg text-xs sm:text-sm md:text-base font-medium shadow-lg shadow-blue-900/30 flex items-center justify-center mx-auto cursor-pointer"
                  onClick={onClose}
                >
                  <FiZap className="mr-1 sm:mr-2 text-sm sm:text-base cursor-pointer" />
                   Continue Learning
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;

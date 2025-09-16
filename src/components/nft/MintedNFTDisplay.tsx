"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { GlassCard } from "./GlassCard";
import {
  Trophy,
  ExternalLink,
  CheckCircle,
  Sparkles,
  Crown,
} from "lucide-react";
import Image from "next/image";
import { useRef, type MouseEvent, useState } from "react";

interface MintedLevel {
  level: number;
  levelName: string;
  tokenId?: number;
  transactionHash: string;
  metadataUrl: string;
  imageUrl: string;
  mintedAt: Date;
  network: string;
}

interface MintedNFTDisplayProps {
  nft: MintedLevel;
  levelKey: string;
  platform?: string;
}

const LEVEL_NAME_MAP = {
  "web3-basics": "Web3 Basics",
  "core-stylus": "Core Stylus Engineering",
  "zkp-basics": "ZKP Basics",
  "zkp-advanced": "ZKP Advanced",
  "agentic-defi": "Agentic DeFi Basics",
  "agentic-wallets": "Agentic Wallets & Signals",
  "farcaster-miniapps": "Farcaster Miniapps Challenge",
};

export const MintedNFTDisplay = ({ nft, levelKey, platform }: MintedNFTDisplayProps) => {
  const imageCardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // console.log("nft", nft);

  // Motion values for smooth 3D transforms
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring configurations for smooth animations
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const rotateX = useSpring(
    useTransform(y, [-300, 300], [15, -15]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(x, [-300, 300], [-15, 15]),
    springConfig
  );
  const translateZ = useSpring(
    useTransform(x, [-300, 300], [-50, 50]),
    springConfig
  );

  // Enhanced lighting effects
  const lightX = useTransform(x, [-300, 300], [0, 100]);
  const lightY = useTransform(y, [-300, 300], [0, 100]);

  // Parallax effects for different layers
  const imageParallaxX = useTransform(x, [-300, 300], [-10, 10]);
  const imageParallaxY = useTransform(y, [-300, 300], [-10, 10]);

  const handleImageMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!imageCardRef.current) return;

    const wrapper = event.currentTarget;
    const rect = wrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Enhanced mouse tracking with better sensitivity
    const mouseX = (event.clientX - centerX) * 0.8;
    const mouseY = (event.clientY - centerY) * 0.8;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleImageMouseEnter = () => {
    setIsHovered(true);
  };

  const handleImageMouseLeave = () => {
    setIsHovered(false);
    // Smooth return to center
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <GlassCard className="p-12 text-center backdrop-blur-xl bg-slate-800/20 border border-slate-700/30">
        <div className="mb-12 relative">
          {/* 3D Trophy Container */}
          <motion.div
            className="relative inline-block mb-8"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400/80 via-green-500/80 to-teal-500/80 rounded-3xl flex items-center justify-center relative">
              <Trophy className="w-16 h-16 text-white" />
              <div className="absolute inset-0 bg-emerald-400/30 rounded-3xl blur-2xl animate-pulse"></div>
            </div>
            <motion.div
              className="absolute -inset-8"
              animate={{ rotate: 360 }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Sparkles className="absolute top-0 left-1/2 w-8 h-8 text-amber-300" />
              <CheckCircle className="absolute right-0 top-1/2 w-8 h-8 text-indigo-300" />
              <Crown className="absolute left-0 top-1/2 w-8 h-8 text-slate-300" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-5xl font-black bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            🎉 Already Minted! 🎉
          </motion.h2>

          <motion.p
            className="text-slate-100 text-2xl leading-relaxed max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            You have already minted your
            <span className="text-emerald-300 font-bold bg-emerald-400/10 px-3 py-1 rounded-lg mx-2">
              {platform} Achievement Badge!
            </span>
          </motion.p>
        </div>

        {/* Enhanced 3D NFT Image Card */}
        <div
          className="mb-8 flex justify-center"
          style={{ perspective: "1200px" }}
        >
          <motion.div
            className="p-8 cursor-pointer"
            onMouseMove={handleImageMouseMove}
            onMouseEnter={handleImageMouseEnter}
            onMouseLeave={handleImageMouseLeave}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              ref={imageCardRef}
              className="relative bg-slate-700/30 rounded-2xl p-6 max-w-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                z: translateZ,
                boxShadow:
                  "0 8px 32px rgba(16, 185, 129, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)", // Added base glow
              }}
            >
              {/* Enhanced 3D depth layers */}
              <motion.div
                className="absolute inset-0 bg-slate-900/70 rounded-2xl -z-10"
                style={{
                  x: useTransform(x, [-300, 300], [8, -8]),
                  y: useTransform(y, [-300, 300], [8, -8]),
                  rotateX: useTransform(rotateX, (value) => value * 0.5),
                  rotateY: useTransform(rotateY, (value) => value * 0.5),
                }}
              />

              <motion.div
                className="absolute inset-0 bg-slate-800/50 rounded-2xl -z-10"
                style={{
                  x: useTransform(x, [-300, 300], [4, -4]),
                  y: useTransform(y, [-300, 300], [4, -4]),
                  rotateX: useTransform(rotateX, (value) => value * 0.25),
                  rotateY: useTransform(rotateY, (value) => value * 0.25),
                }}
              />

              {/* Dynamic lighting overlay */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: useTransform(
                    [lightX, lightY],
                    ([x, y]: any) =>
                      `radial-gradient(circle at ${50 + x}% ${50 + y
                      }%, rgba(255,255,255,0.15) 0%, transparent 50%)`
                  ),
                }}
              />

              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl opacity-0"
                animate={{
                  opacity: isHovered ? [0, 0.6, 0] : [0, 0.4, 0], // Increased from 0.3 to 0.4
                  background: [
                    "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, transparent 100%)",
                    "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                    "linear-gradient(135deg, transparent 0%, transparent 50%, rgba(255,255,255,0.2) 100%)",
                  ],
                }}
                transition={{
                  duration: isHovered ? 2 : 2.5, // Slightly faster when not hovered
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* NFT Image with enhanced 3D frame effect */}
              <div className="relative overflow-hidden rounded-xl mb-4">
                <motion.div
                  className="relative"
                  style={{
                    x: imageParallaxX,
                    y: imageParallaxY,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Image
                    width={1000}
                    height={1000}
                    src={nft.imageUrl || "/placeholder.svg"}
                    alt="Speedrun Stylus NFT"
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300"
                    style={{
                      transform: isHovered ? "scale(1.05)" : "scale(1.02)", // Changed from scale(1) to scale(1.02)
                    }}
                  />

                  {/* Enhanced holographic overlay */}
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: useTransform(
                        [rotateX, rotateY],
                        ([rx, ry]: any) =>
                          `linear-gradient(${45 + ry}deg, 
                            rgba(16, 185, 129, ${0.15 + Math.abs(rx) * 0.01
                          }) 0%, // Increased from 0.1
                            transparent 30%, 
                            transparent 70%, 
                            rgba(147, 51, 234, ${0.15 + Math.abs(ry) * 0.01
                          }) 100%)` // Increased from 0.1
                      ),
                    }}
                  />

                  {/* Floating particles effect */}
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${10 + i * 10}%`,
                          }}
                          animate={{
                            y: [-10, -30, -10],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </div>

              <motion.h3
                className="text-xl font-bold text-slate-100 mb-2"
                style={{
                  transform: useTransform(
                    [rotateX, rotateY],
                    ([rx, ry]: any) =>
                      `translateZ(20px) rotateX(${rx * 0.1}deg) rotateY(${ry * 0.1
                      }deg)`
                  ),
                }}
              >
                {platform || "Speedrun Stylus"}
              </motion.h3>

              <motion.p
                className="text-slate-300 text-sm mb-4"
                style={{
                  transform: useTransform(
                    [rotateX, rotateY],
                    ([rx, ry]: any) =>
                      `translateZ(15px) rotateX(${rx * 0.05}deg) rotateY(${ry * 0.05
                      }deg)`
                  ),
                }}
              >
                Awarded for completing the {LEVEL_NAME_MAP[levelKey as keyof typeof LEVEL_NAME_MAP]} challenge
              </motion.p>

              <motion.p
                className="text-xs text-slate-400"
                style={{
                  transform: useTransform(
                    [rotateX, rotateY],
                    ([rx, ry]: any) =>
                      `translateZ(10px) rotateX(${rx * 0.02}deg) rotateY(${ry * 0.02
                      }deg)`
                  ),
                }}
              >
                Minted on {new Date(nft.mintedAt).toLocaleDateString()}
              </motion.p>
            </motion.div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href={`https://sepolia.arbiscan.io/tx/${nft.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-6 py-3 rounded-xl transition-all duration-200 border border-blue-500/30 font-medium"
            whileHover={{ scale: 1.05, rotateX: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <ExternalLink className="w-5 h-5" />
            View on Arbiscan
          </motion.a>

          <motion.a
            href={nft.metadataUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 px-6 py-3 rounded-xl transition-all duration-200 border border-purple-500/30 font-medium"
            whileHover={{ scale: 1.05, rotateX: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <ExternalLink className="w-5 h-5" />
            View Metadata
          </motion.a>
        </div>
      </GlassCard>
    </motion.div>
  );
};

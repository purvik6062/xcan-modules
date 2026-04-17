"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
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
import { MODULE_THEME_BG_BR } from "@/theme/moduleTheme";

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
  "web3-basics": "Web3 & Rust Foundations",
  "precompiles-overview": "Core Stylus Engineering",
  "stylus-core-concepts": "Stylus Core Concepts",
  "zkp-basics": "ZKP Basics",
  "zkp-advanced": "ZKP Advanced",
  "agentic-defi": "Agentic DeFi Basics",
  "agentic-wallets": "Agentic Wallets & Signals",
  "farcaster-miniapps": "Farcaster Miniapps Challenge",
};

export const MintedNFTDisplay = ({
  nft,
  levelKey,
  platform,
}: MintedNFTDisplayProps) => {
  const imageCardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

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
    if (!imageCardRef.current || prefersReducedMotion) return;

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
      <GlassCard className="p-6 md:p-8 lg:p-10 backdrop-blur-xl bg-slate-800/20 border border-slate-700/30">
        <div className="mx-auto w-full max-w-6xl relative grid gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] items-center">
          <div className="text-center flex flex-col items-center justify-center h-full">
          {/* 3D Trophy Container */}
          <motion.div
            className="relative inline-block mb-5 md:mb-6"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    scale: [1, 1.03, 1],
                    rotate: [0, 1.5, -1.5, 0],
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }
            }
          >
            <div
              className={`w-24 h-24 md:w-28 md:h-28 ${MODULE_THEME_BG_BR} rounded-3xl flex items-center justify-center relative`}
            >
              <Trophy className="w-12 h-12 md:w-14 md:h-14 text-white" />
              <div className="absolute inset-0 bg-[#12B3A8]/30 rounded-3xl blur-xl animate-pulse"></div>
            </div>
            <motion.div
              className="absolute -inset-6 md:-inset-7"
              // animate={prefersReducedMotion ? undefined : { rotate: 360 }}
              // transition={
              //   prefersReducedMotion
              //     ? undefined
              //     : {
              //         duration: 15,
              //         repeat: Number.POSITIVE_INFINITY,
              //         ease: "linear",
              //       }
              // }
            >
              <Sparkles className="absolute top-0 left-1/2 w-6 h-6 text-amber-300" />
              <CheckCircle className="absolute right-0 top-1/2 w-6 h-6 text-[#79A5FF]" />
              <Crown className="absolute left-0 top-1/2 w-6 h-6 text-slate-300" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#79A5FF] via-[#61d5c8] to-[#12B3A8] bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            🎉 Already Minted! 🎉
          </motion.h2>

          <motion.p
            className="text-slate-100 text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            You have already minted your
            <span className="text-[#79A5FF] font-bold bg-[#12B3A8]/10 px-3 py-1 rounded-lg mx-2">
              {platform} Achievement Badge!
            </span>
          </motion.p>

          {/* Action Buttons */}
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              href={`https://sepolia.arbiscan.io/tx/${nft.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#4A7CFF]/20 hover:bg-[#4A7CFF]/30 text-[#79A5FF] hover:text-[#c7d8ff] px-5 py-2.5 rounded-xl transition-all duration-200 border border-[#4A7CFF]/30 font-medium text-sm md:text-base"
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
              className="inline-flex items-center gap-2 bg-[#12B3A8]/20 hover:bg-[#12B3A8]/30 text-[#7be1d7] hover:text-[#bce9e4] px-5 py-2.5 rounded-xl transition-all duration-200 border border-[#12B3A8]/30 font-medium text-sm md:text-base"
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
          </div>
          {/* Enhanced 3D NFT Image Card */}
          <div
            className="flex justify-center lg:justify-end"
            style={{ perspective: "1200px" }}
          >
          <motion.div
            className="p-2 md:p-3 cursor-pointer w-full max-w-[460px]"
            onMouseMove={handleImageMouseMove}
            onMouseEnter={handleImageMouseEnter}
            onMouseLeave={handleImageMouseLeave}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              ref={imageCardRef}
              className="relative bg-slate-700/30 rounded-2xl p-4 md:p-5 w-full overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                rotateX: prefersReducedMotion ? 0 : rotateX,
                rotateY: prefersReducedMotion ? 0 : rotateY,
                transformStyle: "preserve-3d",
                z: prefersReducedMotion ? 0 : translateZ,
                boxShadow:
                  "0 8px 32px rgba(18, 179, 168, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)",
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
                  opacity: prefersReducedMotion
                    ? 0
                    : isHovered
                      ? [0, 0.6, 0]
                      : [0, 0.25, 0],
                  background: [
                    "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, transparent 100%)",
                    "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                    "linear-gradient(135deg, transparent 0%, transparent 50%, rgba(255,255,255,0.2) 100%)",
                  ],
                }}
                transition={{
                  duration: isHovered ? 2 : 2.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* NFT Image with enhanced 3D frame effect */}
              <div className="relative overflow-hidden rounded-xl mb-4">
                <motion.div
                  className="relative"
                  style={{
                    x: prefersReducedMotion ? 0 : imageParallaxX,
                    y: prefersReducedMotion ? 0 : imageParallaxY,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Image
                    width={1000}
                    height={1000}
                    src={nft.imageUrl || "/placeholder.svg"}
                    alt="Xcan Module NFT"
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300"
                    style={{
                      transform: isHovered ? "scale(1.03)" : "scale(1.01)",
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
                            rgba(18, 179, 168, ${0.15 + Math.abs(rx) * 0.01
                          }) 0%,
                            transparent 30%, 
                            transparent 70%, 
                            rgba(74, 124, 255, ${0.15 + Math.abs(ry) * 0.01
                          }) 100%)`
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
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-[#79A5FF] rounded-full"
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
                            delay: i * 0.28,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </div>

              <motion.h3
                className="text-lg md:text-xl font-bold text-slate-100 mb-2"
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
                className="text-slate-300 text-sm mb-3"
                style={{
                  transform: useTransform(
                    [rotateX, rotateY],
                    ([rx, ry]: any) =>
                      `translateZ(15px) rotateX(${rx * 0.05}deg) rotateY(${ry * 0.05
                      }deg)`
                  ),
                }}
              >
                Awarded for completing the{" "}
                {LEVEL_NAME_MAP[levelKey as keyof typeof LEVEL_NAME_MAP]}{" "}
                challenge
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
        </div>
      </GlassCard>
    </motion.div>
  );
};

"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/nft/GlassCard";
import { Award, Shield, Sparkles, ArrowRight } from "lucide-react";

interface XcanAdvocateHighlightProps {
  className?: string;
}

export function XcanAdvocateHighlight({ className = "" }: XcanAdvocateHighlightProps) {
  const router = useRouter();

  return (
    <GlassCard className={`p-8 sm:p-10 mb-10 ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/80 via-blue-500/80 to-cyan-500/80 flex items-center justify-center relative"
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Award className="w-8 h-8 text-white" />
            <div className="absolute inset-0 bg-indigo-400/20 rounded-2xl blur-lg animate-pulse"></div>
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">
              Xcan Advocate Certification
            </h3>
            <p className="text-gray-300 max-w-2xl">
              Become an Xcan Advocate. Learn, contribute, and mint your certification badge.
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => router.push("/nft/xcan-advocate")}
          className="cursor-pointer px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#5a67d8] hover:to-[#6b46c1] transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          View <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </GlassCard>
  );
}



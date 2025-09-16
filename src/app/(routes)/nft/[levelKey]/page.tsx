"use client";

import { useParams, useRouter } from "next/navigation";
import { useMintedStatus } from "@/hooks/useMintedStatus";
import { MintedNFTDisplay } from "@/components/nft/MintedNFTDisplay";
import { SuccessfulMint } from "@/components/nft/SuccessfulMint";
import { useWalletProtection } from "@/hooks/useWalletProtection";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/nft/GlassCard";
import { FloatingParticles } from "@/components/nft/FloatingParticles";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NFTPage() {
  const { levelKey } = useParams();
  const router = useRouter();
  const { address: userAddress, isWalletConnected, isReady, isLoading: walletLoading } = useWalletProtection();
  const { nfts, isLoading, error } = useMintedStatus(userAddress || null);
  const [justMinted, setJustMinted] = useState(false);

  // Check if this is a just minted NFT (from URL params)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setJustMinted(urlParams.get('justMinted') === 'true');
  }, []);

  // Find the NFT for this levelKey
  const nft = nfts?.find((n) => n.levelKey === levelKey || n.level === parseInt(levelKey as string));

  if (!isReady || walletLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
        <GlassCard className="p-12 text-center">
          <motion.div
            className="relative flex justify-center items-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Loader2 className="w-16 h-16 text-blue-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mt-6 mb-4">Loading...</h2>
          <p className="text-gray-300">Checking wallet connection...</p>
        </GlassCard>
      </div>
    );
  }

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
        <GlassCard className="p-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Wallet Not Connected</h2>
          <p className="text-gray-300 mb-6">Please connect your wallet to view your NFT.</p>
          <Link
            href="/nft/arbitrum-stylus"
            className="inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-6 py-3 rounded-xl transition-all duration-200 border border-blue-500/30 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
        <GlassCard className="p-12 text-center">
          <motion.div
            className="relative flex justify-center items-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Loader2 className="w-16 h-16 text-blue-400" />
            {/* <div className="flex justify-centerabsolute inset-0 w-16 h-16 border-4 border-blue-400/20 rounded-full animate-pulse"></div> */}
          </motion.div>
          <h2 className="text-2xl font-bold text-white mt-6 mb-4">Loading NFT...</h2>
          <p className="text-gray-300">Fetching your minted NFT data...</p>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
        <GlassCard className="p-12 text-center border-red-500/30">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-red-300 mb-4">Error Loading NFT</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <Link
            href="/nft/arbitrum-stylus"
            className="inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-6 py-3 rounded-xl transition-all duration-200 border border-blue-500/30 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </GlassCard>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
        <GlassCard className="p-12 text-center">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">NFT Not Found</h2>
          <p className="text-gray-300 mb-6">
            No NFT found for Level {levelKey}. You may need to mint this level first.
          </p>
          <Link
            href="/nft/arbitrum-stylus"
            className="inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-6 py-3 rounded-xl transition-all duration-200 border border-blue-500/30 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] relative overflow-hidden">
      <FloatingParticles />

      {/* Back button */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/nft/arbitrum-stylus"
          className="inline-flex items-center gap-2 bg-[#0A142A]/80 hover:bg-[#0E1B37]/80 text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-200 border border-gray-700/50 font-medium backdrop-blur-xl"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {justMinted ? (
          <SuccessfulMint mintedNFT={nft} levelKey={levelKey as string} />
        ) : (
          <MintedNFTDisplay nft={nft} levelKey={levelKey as string} />
        )}
      </div>
    </div>
  );
} 
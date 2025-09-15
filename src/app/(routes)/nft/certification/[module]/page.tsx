"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { GlassCard } from "@/components/nft/GlassCard";
import { FloatingParticles } from "@/components/nft/FloatingParticles";
import { nftModules } from "@/data/nftModules";
import { useWalletProtection } from "@/hooks/useWalletProtection";
import { Loader2, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";

export default function CertificationViewPage() {
  const router = useRouter();
  const { module } = useParams();
  const mod = useMemo(() => nftModules.find((m) => m.id === module), [module]);
  const { isReady, isLoading: walletLoading } = useWalletProtection();

  useEffect(() => {
    if (!mod) return;
  }, [mod]);

  if (!isReady || walletLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
        <GlassCard className="p-12 text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading certification...</p>
        </GlassCard>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
        <GlassCard className="p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p className="text-gray-300">Module not found.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] relative overflow-hidden">
      <FloatingParticles />

      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => router.push("/nft")}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-gray-200 px-4 py-2 rounded-xl transition-all duration-200 border border-white/15"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Modules
        </button>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <GlassCard className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${mod.gradient} bg-opacity-20`}>
              <mod.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{mod.title} Certification</h1>
              <p className="text-gray-300">Your minted NFT details</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-2 text-emerald-300 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span>Minted successfully</span>
            </div>
            <p className="text-gray-300 mb-2">You can also see this in your wallet and on-chain via the transaction recorded during minting.</p>
            <button
              onClick={() => router.push(`/nft/modules/${mod.id}`)}
              className="mt-4 cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
            >
              View Module Progress
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}



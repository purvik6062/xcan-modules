"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/nft/GlassCard";
import { FloatingParticles } from "@/components/nft/FloatingParticles";
import { useWalletProtection } from "@/hooks/useWalletProtection";
import { useChainId, useSwitchChain } from "wagmi";
import { Award, CheckCircle, AlertTriangle, Loader2, RefreshCw, Zap, Shield, Rocket, Users, Star } from "lucide-react"; // Added new icons for better visual appeal
import { useMint } from "@/hooks/useMint";

const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

type AdvocateDoc = {
  userAddress: string;
  isEligible?: boolean;
  certification?: Array<{
    imageURL?: string | null;
    metadataURL?: string | null;
    mintedAt?: string | Date | null;
    transactionHash?: string | null;
  }>;
};

export default function XcanAdvocatePage() {
  const { isReady, isLoading, address: userAddress, isWalletConnected } = useWalletProtection();
  const router = useRouter();

  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const isCorrectNetwork = chainId === ARBITRUM_SEPOLIA_CHAIN_ID;

  const { certificationMint, isCertificationMinting } = useMint();
  const [doc, setDoc] = useState<AdvocateDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latestCert = useMemo(() => {
    const entries = doc?.certification || [];
    return entries.length ? entries[entries.length - 1] : null;
  }, [doc]);

  const canClaim = useMemo(() => {
    if (!userAddress || !doc) return false;
    if (doc.userAddress && doc.userAddress.toLowerCase() !== userAddress.toLowerCase()) return false;
    if (latestCert?.mintedAt) return false; // already minted
    return Boolean(doc.isEligible);
  }, [doc, userAddress, latestCert]);

  const handleSwitchNetwork = () => switchChain({ chainId: ARBITRUM_SEPOLIA_CHAIN_ID });

  const fetchStatus = async () => {
    if (!userAddress) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/advocates?userAddress=${userAddress}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load status");
      console.log("data: ", data);
      setDoc(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady && isWalletConnected) {
      fetchStatus();
    }
  }, [isReady, isWalletConnected, userAddress]);

  const onMint = async () => {
    if (!userAddress) return;
    try {
      const minted = await certificationMint("xcan-advocate");
      if (!minted) return;
      const saveRes = await fetch("/api/advocates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress,
          isEligible: true,
          transactionHash: minted.transactionHash,
          metadataURL: minted.metadataUrl,
          imageURL: minted.imageUrl,
        }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || "Failed to persist mint");
      await fetchStatus();
    } catch (e) {
      // error toasts handled in hook
    }
  };

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] relative overflow-hidden">
      <FloatingParticles />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <GlassCard className="p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative ${isCorrectNetwork ? "bg-gradient-to-br from-emerald-400/80 via-green-500/80 to-teal-500/80" : "bg-gradient-to-br from-amber-400/80 via-orange-500/80 to-red-500/80"}`}>
              {isCorrectNetwork ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-white" />
              )}
              <motion.div className={`absolute inset-0 rounded-2xl blur-lg ${isCorrectNetwork ? "bg-emerald-400/20" : "bg-amber-400/20"}`} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">Xcan Advocate Certification</h1>
              <p className="text-gray-300">A verifiable, on-chain badge of honor for key contributors to the Xcan and Arbitrum community.</p>
            </div>
            {!isCorrectNetwork && (
              <motion.button
                onClick={handleSwitchNetwork}
                disabled={isSwitchingChain}
                className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSwitchingChain ? (<><Loader2 className="w-4 h-4 animate-spin" /> Switching...</>) : (<><RefreshCw className="w-4 h-4" /> Switch to Arbitrum Sepolia</>)}
              </motion.button>
            )}
          </div>
          {!isCorrectNetwork && (
            <motion.div className="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/30 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-amber-200 text-sm">Action Required: Please switch to the **Arbitrum Sepolia** network to verify your status and mint your NFT certification.</p>
              </div>
            </motion.div>
          )}
        </GlassCard>

        {/* About Xcan Advocate (Persuasive, key-point style) */}
        <GlassCard className="p-8 mb-8">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-3">
              <h2 className="text-2xl font-bold text-white">The Mark of an Xcan Advocate</h2>
              <ul className="text-gray-300 leading-relaxed space-y-2 list-disc list-inside">
                <li><span className="font-semibold text-white">Lead the movement:</span> Be recognized as a core builder moving the Arbitrum ecosystem forward.</li>
                <li><span className="font-semibold text-white">Prove your impact:</span> On-chain, verifiable recognition for real contributions on Xcan.</li>
                <li><span className="font-semibold text-white">Stand out everywhere:</span> Showcase a credible, soulbound credential across your profiles and apps.</li>
                <li><span className="font-semibold text-white">Unlock opportunities:</span> Early access to future Advocate-only programs, invites, and spotlights.</li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-white mb-3">Key Benefits</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2"><Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" /><span><span className="font-semibold text-white">Verified on-chain credential:</span> Immutable proof of your advocacy and leadership.</span></li>
                  <li className="flex items-start gap-2"><Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" /><span><span className="font-semibold text-white">Exclusive recognition:</span> Priority for future Advocate-only programs and spotlights.</span></li>
                  <li className="flex items-start gap-2"><Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" /><span><span className="font-semibold text-white">Signal of expertise:</span> Instantly communicate credibility to collaborators, teams, and communities.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Certification Status</h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /> Checking eligibility...</div>
          ) : error ? (
            <p className="text-amber-300 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> **Error Loading Status:** {error}. Please try refreshing.</p>
          ) : (
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2 text-sm"><Zap className="w-4 h-4 text-blue-400" /> Connected Wallet: {userAddress ? `${userAddress.slice(0, 8)}...${userAddress.slice(-6)}` : "Wallet Not Connected"}</div>
              {/* <div className="text-sm flex items-center gap-2"><CheckCircle className={`w-4 h-4 ${doc?.isEligible ? "text-emerald-400" : "text-red-400"}`} /> **Eligibility Status:** <span className="font-semibold">{doc?.isEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}</span></div>
              <div className="text-sm flex items-center gap-2"><Shield className={`w-4 h-4 ${doc?.mintedAt ? "text-emerald-400" : "text-gray-400"}`} /> **Mint Status:** <span className="font-semibold">{doc?.mintedAt ? `MINTED on ${new Date(doc.mintedAt).toLocaleDateString()}` : "Available to Claim"}</span></div>
              {doc?.transactionHash && (
                <div className="text-sm">**Transaction Hash:** <a className="text-blue-300 underline hover:text-blue-200 transition" target="_blank" href={`https://sepolia.arbiscan.io/tx/${doc.transactionHash}`}>View on Arbiscan</a></div>
              )}
              {doc?.metadataURL && (
                <div className="text-sm">**NFT Metadata:** <a className="text-blue-300 underline hover:text-blue-200 transition" target="_blank" href={doc.metadataURL}>View Details</a></div>
              )} */}
            </div>
          )}

          <div className="mt-8">
            <motion.button
              disabled={!isCorrectNetwork || !canClaim || loading || isCertificationMinting || !!latestCert?.mintedAt}
              onClick={onMint}
              className="cursor-pointer px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 disabled:from-gray-600 disabled:to-gray-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl disabled:opacity-60 disabled:shadow-none"
              whileHover={{ scale: canClaim && isCorrectNetwork && !latestCert?.mintedAt ? 1.02 : 1 }}
              whileTap={{ scale: canClaim && isCorrectNetwork && !latestCert?.mintedAt ? 0.98 : 1 }}
            >
              {isCertificationMinting ? <><Loader2 className="w-5 h-5 animate-spin" /> Claiming...</> : latestCert?.mintedAt ? <><CheckCircle className="w-5 h-5" /> Certification Minted!</> : <><Award className="w-5 h-5" /> Claim NFT</>}
            </motion.button>
            {doc && latestCert?.mintedAt && (
              <Link
                className="mt-3 inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                href="/nft/certification/xcan-advocate"
              >
                <Star className="w-4 h-4" /> View NFT
              </Link>
            )}
            {!canClaim && doc && !latestCert?.mintedAt && (
              <p className="text-sm text-red-300 mt-3 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> You are currently not eligible for the Xcan Advocate certification.</p>
            )}
            {doc && latestCert?.mintedAt && (
              <p className="text-sm text-emerald-300 mt-3 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Success! You have already minted your Advocate NFT.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
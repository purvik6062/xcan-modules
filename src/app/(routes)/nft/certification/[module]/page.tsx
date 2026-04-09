"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/nft/GlassCard";
import { FloatingParticles } from "@/components/nft/FloatingParticles";
import { nftModules } from "@/data/nftModules";
import { useWalletProtection } from "@/hooks/useWalletProtection";
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Rocket,
  Trophy,
  Sparkles,
  Award,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { SuccessfulMint } from "@/components/nft/SuccessfulMint";
import { MintedNFTDisplay } from "@/components/nft/MintedNFTDisplay";
import Certificate from "@/components/Certificate";
import { handleDownloadPDF } from "@/utils/certificate-pdf";
import { MODULE_THEME_BG_R, MODULE_THEME_GRADIENT_BR } from "@/theme/moduleTheme";

export default function CertificationViewPage() {
  const router = useRouter();
  const { module } = useParams();
  const mod = useMemo(() => {
    const found = nftModules.find((m) => m.id === module);
    if (found) return found;
    if (module === "xcan-advocate") {
      return {
        id: "xcan-advocate",
        title: "Xcan Advocate",
        icon: Award,
        gradient: MODULE_THEME_GRADIENT_BR,
      } as any;
    } else if (module === "stylus-foundation") {
      return {
        id: "stylus-foundation",
        title: "Stylus Foundation",
        icon: Award,
        gradient: MODULE_THEME_GRADIENT_BR,
      } as any;
    }
    return null;
  }, [module]);
  const { isReady, isLoading: walletLoading, address } = useWalletProtection();
  const [nft, setNft] = useState<any | null>(null);
  const [loadingNft, setLoadingNft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const justMinted = searchParams?.get("justMinted") === "true";
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const [certificateLocked, setCertificateLocked] = useState(false);
  const [certificateBusy, setCertificateBusy] = useState(false);
  const [certificateError, setCertificateError] = useState<string | null>(null);
  const [certificateOnChainGenerated, setCertificateOnChainGenerated] =
    useState(false);
  const [patramCertificateLink, setpatramCertificateLink] = useState<
    string | null
  >(null);
  const [certificateGeneratedAt, setCertificateGeneratedAt] = useState<
    string | null
  >(null);
  useEffect(() => {
    const fetchCertification = async () => {
      if (!mod || !address) return;
      setLoadingNft(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/certification/claim/${mod.id}?userAddress=${address}`
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.error || "Failed to load certification");
        if (data?.certification) {
          setNft({
            level: data.certification.level || 1,
            levelName: data.certification.levelName || mod.id,
            tokenId: data.certification.tokenId,
            transactionHash: data.certification.transactionHash || "",
            metadataUrl: data.certification.metadataUrl || "",
            imageUrl: data.certification.imageUrl || "/placeholder.svg",
            mintedAt: new Date(data.certification.mintedAt || Date.now()),
            network: data.certification.network || "",
          });
        } else {
          setNft(null);
        }
      } catch (e: any) {
        setError(e?.message || "Unknown error");
      } finally {
        setLoadingNft(false);
      }
    };
    fetchCertification();
  }, [mod, address]);

  // Check generation status for this module (and poll for on-chain status)
  useEffect(() => {
    if (!mod?.id || !address) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const check = async () => {
      try {
        const res = await fetch(
          `/api/certification/generate/${mod.id}?userAddress=${address}`
        );
        const data = await res.json();
        if (res.ok) {
          setCertificateLocked(Boolean(data.generated));
          if (data.name) setCertificateName(data.name);
          setCertificateOnChainGenerated(
            Boolean(data.certificateOnChainGenerated)
          );
          setpatramCertificateLink(data.patramCertificateLink || null);
          setCertificateGeneratedAt(
            typeof data.certificateGeneratedAt === "string"
              ? data.certificateGeneratedAt
              : null
          );
        }
      } catch {
        // ignore polling errors
      }
    };

    check();
    interval = setInterval(check, 15000); // poll every 15s

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [mod?.id, address]);

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
        <GlassCard className="p-8 overflow-hidden">
          <div className="">
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${mod.gradient} bg-opacity-20`}
                >
                  <mod.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {mod.title} Certification
                  </h1>
                  <p className="text-gray-300">Your minted NFT details</p>
                </div>
              </div>

              {justMinted && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                  <p className="text-emerald-200 text-sm">
                    Mint successful! Your certification NFT is now recorded.
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-amber-300" />
                  <span className="text-gray-300 text-sm">
                    View your minted certification details below.
                  </span>
                </div>

                {loadingNft && (
                  <div className="flex items-center gap-2 text-gray-300 mt-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading NFT...
                  </div>
                )}
                {error && <p className="text-red-400 mt-2">{error}</p>}
                {!loadingNft && !nft && !error && (
                  <p className="text-gray-400 text-sm">
                    No NFT found yet for this certification.
                  </p>
                )}
              </div>

              {/* Certificate panel */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mt-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold">Certificate</p>
                    <p className="text-gray-400 text-sm">
                      Save your name and request an onchain certificate.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCertificate((v) => !v)}
                    className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${MODULE_THEME_BG_R} hover:brightness-110 text-white`}
                  >
                    {showCertificate
                      ? "Hide"
                      : certificateLocked
                        ? "View Certificate"
                        : "Get Certificate"}
                  </button>
                </div>

                {showCertificate && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-300 mb-1">
                          Enter your name
                        </label>
                        <input
                          type="text"
                          value={certificateName}
                          onChange={(e) => setCertificateName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-60"
                          disabled={certificateLocked}
                        />
                      </div>
                      <div className="flex md:justify-end">
                        <button
                          onClick={async () => {
                            if (!mod?.id || !address) return;
                            const trimmed = certificateName.trim();

                            // State 1: first time, save name + request
                            if (!certificateLocked) {
                              if (!trimmed || certificateBusy) return;
                              try {
                                setCertificateError(null);
                                setCertificateBusy(true);

                                const res = await fetch(
                                  `/api/certification/generate/${mod.id}`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      userAddress: address,
                                      name: trimmed,
                                    }),
                                  }
                                );

                                const data = await res.json();
                                if (!res.ok) {
                                  throw new Error(
                                    data?.error ||
                                      "Failed to save certificate name"
                                  );
                                }
                                setCertificateLocked(true);
                                if (
                                  typeof data?.certificateGeneratedAt ===
                                  "string"
                                ) {
                                  setCertificateGeneratedAt(
                                    data.certificateGeneratedAt
                                  );
                                }
                              } catch (e: any) {
                                setCertificateError(
                                  e?.message || "Something went wrong"
                                );
                              } finally {
                                setCertificateBusy(false);
                              }
                            }

                            // State 3: onchain certificate ready -> open patram link
                            if (
                              certificateLocked &&
                              certificateOnChainGenerated &&
                              patramCertificateLink
                            ) {
                              window.open(
                                patramCertificateLink as string,
                                "_blank"
                              );
                            }
                          }}
                          disabled={
                            certificateBusy ||
                            (!certificateLocked && !certificateName.trim()) ||
                            (certificateLocked && !certificateOnChainGenerated) ||
                            (certificateLocked &&
                              certificateOnChainGenerated &&
                              !patramCertificateLink)
                          }
                          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                            !certificateLocked && !certificateName.trim()
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : certificateLocked && !certificateOnChainGenerated
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : "cursor-pointer bg-gradient-to-r from-[#1E3A8A] to-[#4A7CFF] hover:from-[#5a67d8] hover:to-[#6b46c1] text-white"
                          }`}
                        >
                          {certificateBusy ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />{" "}
                              Saving...
                            </>
                          ) : !certificateLocked ? (
                            <>Save name &amp; request onchain certificate</>
                          ) : certificateLocked && !certificateOnChainGenerated ? (
                            <>Onchain certificate request pending...</>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4" />
                              View onchain certificate 
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    {certificateError && (
                      <p className="text-red-400 text-sm">{certificateError}</p>
                    )}
                    {!certificateError &&
                      certificateLocked &&
                      !certificateOnChainGenerated && (
                        <p className="text-amber-300 text-sm">
                          Your request has been submitted. Onchain certificate
                          generation is pending from patram...
                        </p>
                      )}
                   
                    <div className="flex justify-center">
                      <Certificate
                        name={certificateName}
                        title="Certificate of Completion"
                        subtitle={mod.title}
                        moduleRouteKey={mod.id}
                        certificateGeneratedAt={certificateGeneratedAt}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full mt-6">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 h-full">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-[#12B3A8]/20 to-[#4A7CFF]/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-[#4A7CFF]/20 to-[#12B3A8]/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-[#79A5FF]" />
                    <p className="text-gray-300">
                      Your achievement badge preview
                    </p>
                  </div>
                  {nft ? (
                    <MintedNFTDisplay
                      nft={nft}
                      levelKey={mod.id}
                      platform={"Xcan Modules"}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-60 text-gray-400">
                      {loadingNft ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Loading
                          preview...
                        </div>
                      ) : (
                        <span>Minted NFT will appear here once available.</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { GlassCard } from "@/components/nft/GlassCard";
import { FloatingParticles } from "@/components/nft/FloatingParticles";
import { nftModules } from "@/data/nftModules";
import { useWalletProtection } from "@/hooks/useWalletProtection";
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Sparkles,
  Award,
  ExternalLink,
} from "lucide-react";
import { MintedNFTDisplay } from "@/components/nft/MintedNFTDisplay";
import {
  MODULE_THEME_BG_R,
  MODULE_THEME_GRADIENT_BR,
} from "@/theme/moduleTheme";
import { clearDeferredCertNamePrompt } from "@/lib/cert-name-defer";
import ConnectWallet from "@/components/ConnectWallet";

// Certificate is only needed when the user toggles the panel open; keep it
// out of the initial bundle and skip SSR to reduce TTI.
const Certificate = dynamic(() => import("@/components/Certificate"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-10 text-gray-400">
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      Loading certificate...
    </div>
  ),
});

// Shared UI tokens — keep fonts, colors, and radii uniform across the page.
const BACKDROP =
  "min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] relative overflow-hidden";
const SECTION_CARD = "rounded-2xl border border-white/10 bg-white/5 p-6";
const PRIMARY_CTA = `cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all duration-200 ${MODULE_THEME_BG_R} hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100`;
const DISABLED_CTA =
  "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-gray-700 text-gray-400 cursor-not-allowed";
const GHOST_BUTTON =
  "inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 text-gray-200 text-sm font-medium transition-colors duration-200";

type CtaState = "save" | "disabled" | "pending" | "view";

export default function CertificationViewPage() {
  const router = useRouter();
  const { module } = useParams();
  const searchParams = useSearchParams();
  const justMinted = searchParams?.get("justMinted") === "true";

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
    }
    if (module === "stylus-foundation") {
      return {
        id: "stylus-foundation",
        title: "Stylus Foundation",
        icon: Award,
        gradient: MODULE_THEME_GRADIENT_BR,
      } as any;
    }
    return null;
  }, [module]);

  const { isReady, isLoading: walletLoading, address, isWalletConnected } =
    useWalletProtection();

  const [nft, setNft] = useState<any | null>(null);
  const [loadingNft, setLoadingNft] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const [certificateLocked, setCertificateLocked] = useState(false);
  const [certificateBusy, setCertificateBusy] = useState(false);
  const [certificateError, setCertificateError] = useState<string | null>(null);
  const [showNameConfirmModal, setShowNameConfirmModal] = useState(false);
  const [certificateOnChainGenerated, setCertificateOnChainGenerated] =
    useState(false);
  const [patramCertificateLink, setpatramCertificateLink] = useState<
    string | null
  >(null);
  const [certificateGeneratedAt, setCertificateGeneratedAt] = useState<
    string | null
  >(null);

  // Fetch claimed NFT for this module. Aborts in-flight on unmount/deps change.
  useEffect(() => {
    if (!mod || !address) return;
    const controller = new AbortController();

    (async () => {
      setLoadingNft(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/certification/claim/${mod.id}?userAddress=${address}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load certification");
        }
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
        if (e?.name === "AbortError") return;
        setError(e?.message || "Unknown error");
      } finally {
        if (!controller.signal.aborted) setLoadingNft(false);
      }
    })();

    return () => controller.abort();
  }, [mod, address]);

  // Poll generate-status. Stops once the on-chain certificate is ready and
  // pauses while the tab is hidden to save requests.
  useEffect(() => {
    if (!mod?.id || !address) return;
    const done =
      certificateOnChainGenerated && Boolean(patramCertificateLink);

    let interval: ReturnType<typeof setInterval> | null = null;
    const controller = new AbortController();

    const check = async () => {
      try {
        const res = await fetch(
          `/api/certification/generate/${mod.id}?userAddress=${address}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (!res.ok) return;
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
      } catch {
        // ignore polling errors
      }
    };

    const start = () => {
      if (interval) return;
      check();
      interval = setInterval(check, 15000);
    };
    const stop = () => {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    if (!done) {
      if (document.visibilityState === "visible") start();
      document.addEventListener("visibilitychange", onVisibilityChange);
    } else {
      // One final sync to pick up any missed fields, then no more polling.
      check();
    }

    return () => {
      stop();
      controller.abort();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [mod?.id, address, certificateOnChainGenerated, patramCertificateLink]);

  const saveCertificateNameAndRequest = useCallback(async () => {
    if (!mod?.id || !address) return;
    const trimmed = certificateName.trim();
    if (!trimmed || certificateBusy) return;
    try {
      setCertificateError(null);
      setCertificateBusy(true);

      const res = await fetch(`/api/certification/generate/${mod.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: address, name: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save certificate name");
      }
      clearDeferredCertNamePrompt(address);
      setCertificateLocked(true);
      if (typeof data?.certificateGeneratedAt === "string") {
        setCertificateGeneratedAt(data.certificateGeneratedAt);
      }
      setShowNameConfirmModal(false);
    } catch (e: any) {
      setCertificateError(e?.message || "Something went wrong");
    } finally {
      setCertificateBusy(false);
    }
  }, [mod?.id, address, certificateName, certificateBusy]);

  // Derive the CTA state once; keeps the JSX simple and avoids recomputing on
  // every render path.
  const ctaState = useMemo<CtaState>(() => {
    if (!certificateLocked) {
      return certificateName.trim() ? "save" : "disabled";
    }
    if (!certificateOnChainGenerated) return "pending";
    return patramCertificateLink ? "view" : "disabled";
  }, [
    certificateLocked,
    certificateName,
    certificateOnChainGenerated,
    patramCertificateLink,
  ]);

  const handlePrimaryCtaClick = useCallback(() => {
    if (!mod?.id || !address) return;
    if (ctaState === "save") {
      setShowNameConfirmModal(true);
      return;
    }
    if (ctaState === "view" && patramCertificateLink) {
      window.open(patramCertificateLink, "_blank");
    }
  }, [mod?.id, address, ctaState, patramCertificateLink]);

  if (!isWalletConnected || !address) {
    return (
      <div className={`${BACKDROP} flex items-center justify-center`}>
        <FloatingParticles />
        <GlassCard className="p-8 md:p-10 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-white mb-2">
            Connect Wallet to View Certification
          </h2>
          <p className="text-sm text-gray-300 mb-6">
            Connect your wallet to see your certification NFT and certificate
            status.
          </p>
          <div className="flex justify-center">
            <ConnectWallet />
          </div>
        </GlassCard>
      </div>
    );
  }


  if (!isReady || walletLoading) {
    return (
      <div className={`${BACKDROP} flex items-center justify-center`}>
        <FloatingParticles />
        <GlassCard className="p-12 text-center">
          <Loader2 className="w-12 h-12 text-[#79A5FF] animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-300">Loading certification...</p>
        </GlassCard>
      </div>
    );
  }

  if (!mod) {
    return (
      <div className={`${BACKDROP} flex items-center justify-center`}>
        <FloatingParticles />
        <GlassCard className="p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p className="text-sm text-gray-300">Module not found.</p>
        </GlassCard>
      </div>
    );
  }

  const ctaDisabled =
    certificateBusy || ctaState === "disabled" || ctaState === "pending";

  return (
    <div className={BACKDROP}>
      <FloatingParticles />

      <div className="absolute top-8 left-8 z-20">
        <button onClick={() => router.push("/nft")} className={GHOST_BUTTON}>
          <ArrowLeft className="w-5 h-5" /> Back to Modules
        </button>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <GlassCard className="p-8 overflow-hidden">
          <div className="flex-1 space-y-6">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${mod.gradient} bg-opacity-20`}
              >
                <mod.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white leading-tight">
                  {mod.title} Certification
                </h1>
                <p className="text-sm text-gray-300 mt-1">
                  Your minted NFT details
                </p>
              </div>
            </div>

            {justMinted && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-300 shrink-0" />
                <p className="text-emerald-200 text-sm">
                  Mint successful! Your certification NFT is now recorded.
                </p>
              </div>
            )}

            {!loadingNft && !nft && !error && (
              <div className={SECTION_CARD}>
                {/* <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-[#79A5FF]" />
                <span className="text-gray-300 text-sm">
                  View your minted certification details below.
                </span>
              </div>

              {loadingNft && (
                <div className="flex items-center gap-2 text-gray-300 text-sm mt-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading NFT...
                </div>
              )}
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )} */}
                <p className="text-gray-400 text-sm">
                  No NFT found yet for this certification.
                </p>
              </div>
            )}

            {/* Certificate panel */}
            <div className={`${SECTION_CARD} mt-6`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-white font-semibold text-base">
                    Get your certificate here
                  </p>
                </div>
                <button
                  onClick={() => setShowCertificate((v) => !v)}
                  className={PRIMARY_CTA}
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
                  {showNameConfirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                      <div className="w-full max-w-xl rounded-2xl border border-red-500/60 bg-[#1f0b0b] p-5 shadow-2xl">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-red-300 font-semibold text-lg">
                              Recheck your certificate name
                            </p>
                            <p className="text-red-200 text-sm mt-2">
                              This name will be shown on your certificate and
                              cannot be changed later.
                            </p>
                            <p className="text-red-100 text-sm mt-3">
                              Name entered:{" "}
                              <span className="font-semibold">
                                {certificateName.trim()}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setShowNameConfirmModal(false)}
                            disabled={certificateBusy}
                            className="px-4 py-2 rounded-lg border border-white/20 text-gray-200 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-60"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={saveCertificateNameAndRequest}
                            disabled={certificateBusy}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors disabled:opacity-60"
                          >
                            {certificateBusy ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Confirm and Save"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-300 mb-1 font-medium">
                        Enter your name
                      </label>
                      <p className="text-xs text-gray-500 mb-2">
                        Use your correct legal name; it will be shown on this
                        certificate. You can set this here even without a saved
                        profile name.
                      </p>
                      <input
                        type="text"
                        value={certificateName}
                        onChange={(e) => setCertificateName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A7CFF] disabled:opacity-60"
                        disabled={certificateLocked}
                      />
                    </div>
                    <div className="flex md:justify-end">
                      <button
                        onClick={handlePrimaryCtaClick}
                        disabled={ctaDisabled}
                        className={
                          ctaState === "disabled" || ctaState === "pending"
                            ? DISABLED_CTA
                            : PRIMARY_CTA
                        }
                      >
                        {certificateBusy ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : ctaState === "save" ||
                          (ctaState === "disabled" && !certificateLocked) ? (
                          <>Save name &amp; request onchain certificate</>
                        ) : ctaState === "pending" ? (
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

            <div className="w-full mt-6">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 h-full">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-[#12B3A8]/20 to-[#4A7CFF]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-[#4A7CFF]/20 to-[#12B3A8]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-[#79A5FF]" />
                    <p className="text-sm text-gray-300">
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
                    <div className="flex items-center justify-center h-60 text-gray-400 text-sm">
                      {loadingNft ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Loading
                          preview...
                        </div>
                      ) : (
                        <span>
                          Minted NFT will appear here once available.
                        </span>
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

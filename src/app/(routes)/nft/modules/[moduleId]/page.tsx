"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/nft/GlassCard";
import { FloatingParticles } from "@/components/nft/FloatingParticles";
import { nftModules } from "@/data/nftModules";
import { useWalletProtection } from "@/hooks/useWalletProtection";
import { useMint } from "@/hooks/useMint";
import { useMintedStatus } from "@/hooks/useMintedStatus";
import { MintedNFTDisplay } from "@/components/nft/MintedNFTDisplay";
import {
  CheckCircle,
  ArrowLeft,
  Loader2,
  Trophy,
  Target,
  Clock,
  Rocket,
  AlertTriangle,
  Sparkles,
  Download,
} from "lucide-react";
import PromoCodeModal from "../../../../../components/PromoCodeModal";
import Certificate from "@/components/Certificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ModuleDetailPage() {
  const router = useRouter();
  const { moduleId } = useParams();
  const currentModule = useMemo(
    () => nftModules.find((m) => m.id === moduleId),
    [moduleId]
  );
  const {
    isReady,
    isLoading: walletLoading,
    address: userAddress,
    isWalletConnected,
  } = useWalletProtection();
  const { certificationMint, isCertificationMinting } = useMint();
  // Certification claim status via certification-claim GET API
  const [isCheckingClaim, setIsCheckingClaim] = useState(false);
  const [claimedCertification, setClaimedCertification] = useState<any | null>(
    null
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const certificateRef = useRef<HTMLDivElement>(null);
  const [certificateLocked, setCertificateLocked] = useState(false);

  useEffect(() => {
    if (
      currentModule?.database === "postgres" ||
      currentModule?.id === "arbitrum-stylus"
    ) {
      router.replace("/nft/arbitrum-stylus");
    }
  }, [currentModule, router]);

  // Fetch claimed certification (authoritative) for this module
  useEffect(() => {
    const fetchClaimed = async () => {
      if (!currentModule || !userAddress) return;
      setIsCheckingClaim(true);
      try {
        const res = await fetch(
          `/api/certification/claim/${currentModule.id}?userAddress=${userAddress}`
        );
        const data = await res.json();
        if (res.ok) {
          setClaimedCertification(data.certification || null);
          setIsCompleted(data.isCompleted || false);
        } else {
          setClaimedCertification(null);
        }
      } catch (err) {
        // fail silently; UI will still allow mint if other status says completed
        setClaimedCertification(null);
      } finally {
        setIsCheckingClaim(false);
      }
    };
    fetchClaimed();
  }, [currentModule, userAddress]);

  // Check one-time certificate generation flag as soon as module/user is known
  useEffect(() => {
    const check = async () => {
      if (!currentModule?.id || !userAddress) return;
      try {
        const res = await fetch(
          `/api/certification/generate/${currentModule.id}?userAddress=${userAddress}`
        );
        const data = await res.json();
        if (res.ok) {
          setCertificateLocked(Boolean(data.generated));
          if (data.name) setCertificateName(data.name);
        }
      } catch {}
    };
    check();
  }, [currentModule?.id, userAddress]);

  if (!isReady || walletLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] flex items-center justify-center relative overflow-hidden">
        <FloatingParticles />
        <GlassCard className="p-12 text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Preparing module...</p>
        </GlassCard>
      </div>
    );
  }

  if (!currentModule) {
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

  const handleClaim = async () => {
    try {
      setError(null);
      if (!isCompleted) return;

      const minted = await certificationMint(currentModule.id);
      const res = await fetch(`/api/certification/claim/${currentModule.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: userAddress,
          transactionHash: minted?.transactionHash,
          metadataUrl: minted?.metadataUrl,
          imageUrl: minted?.imageUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Mint failed");
      } else {
        setIsPromoOpen(false);
      }

      // Optimistically mark claimed to disable button immediately
      setClaimedCertification({
        level: 1,
        levelName: currentModule.id,
        claimed: true,
        mintedAt: new Date().toISOString(),
        transactionHash: minted?.transactionHash,
        metadataUrl: minted?.metadataUrl,
        imageUrl: minted?.imageUrl,
      });
      router.push(`/nft/certification/${currentModule.id}?justMinted=true`);
    } catch (e: any) {
      setError(e?.message || "Mint failed");
    }
  };

  const alreadyClaimed = Boolean(claimedCertification?.claimed);
  const isClaimDisabled =
    claimedCertification?.claimed ||
    isCertificationMinting ||
    isCheckingClaim ||
    alreadyClaimed;

  const handleDownloadPDF = async () => {
    const node = document.getElementById("certificate");
    if (!node) return;
    // Persist one-time generation before download
    if (
      !certificateLocked &&
      certificateName.trim() &&
      currentModule?.id &&
      userAddress
    ) {
      try {
        await fetch(`/api/certification/generate/${currentModule.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userAddress, name: certificateName.trim() }),
        });
        setCertificateLocked(true);
      } catch {}
    }
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0D1221",
      removeContainer: true,
      onclone: (doc) => {
        const cert = doc.getElementById("certificate") as HTMLElement | null;
        if (cert) {
          cert.style.background =
            "linear-gradient(135deg, #020816 0%, #0D1221 100%)";
          cert.style.borderRadius = "0";
        }
        doc
          .querySelectorAll("[data-pdf-hide]")
          .forEach((el) => ((el as HTMLElement).style.display = "none"));
        const title = doc.querySelector(
          "#certificate h1"
        ) as HTMLElement | null;
        if (title) {
          title.style.background = "";
          // @ts-ignore
          title.style.webkitBackgroundClip = "";
          title.style.backgroundClip = "";
          title.style.color = "#E5E7EB";
          title.style.textShadow = "none";
        }
      },
    });
    const imgData = canvas.toDataURL("image/png");
    // Export as standard A4 landscape
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = 297;
    const pageHeight = 210;
    const scale = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height
    );
    const imgWidth = canvas.width * scale;
    const imgHeight = canvas.height * scale;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
    pdf.setFillColor(13, 18, 33);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight, undefined, "FAST");
    const safeName = (certificateName || "certificate").replace(/\s+/g, "_");
    pdf.save(`${currentModule?.id || "module"}-certificate-${safeName}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221] relative overflow-hidden">
      <FloatingParticles />

      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => router.back()}
          className="cursor-pointer inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-gray-200 px-4 py-2 rounded-xl transition-all duration-200 border border-white/15"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <GlassCard className="p-8 overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Hero and progress */}
            <div className="flex-1 space-y-6">
              <motion.div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center relative bg-gradient-to-br ${currentModule.gradient}`}
                animate={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
              >
                <Rocket className="w-10 h-10 text-white" />
                <div className="absolute inset-0 rounded-2xl blur-xl opacity-30" />
              </motion.div>

              <div>
                <h1 className="text-4xl font-bold text-white">
                  {currentModule.title}
                </h1>
                <p className="text-gray-300 mt-2">
                  {currentModule.description}
                </p>
              </div>

              <div className="flex items-center gap-6 text-gray-300">
                {/* <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{currentModule.duration}</span> */}
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {currentModule.challenges} challenges
                </span>
                <span className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  {currentModule.level}
                </span>
              </div>

              <motion.div
                className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 2,
                        }}
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </motion.div>
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                    <div>
                      <p className="text-white font-semibold">
                        {alreadyClaimed
                          ? "Already Claimed"
                          : isCompleted
                          ? "Module Completed"
                          : "In Progress"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {alreadyClaimed
                          ? "Your certification NFT has been minted."
                          : isCompleted
                          ? "You can claim your certification NFT."
                          : "Complete all required challenges to enable claim."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {alreadyClaimed && (
                      <button
                        onClick={() =>
                          router.push(`/nft/certification/${currentModule.id}`)
                        }
                        className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
                      >
                        View Minted NFT
                      </button>
                    )}
                    {/* {alreadyClaimed && (
                      <button
                        onClick={() => setShowCertificate((v) => !v)}
                        className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                      >
                        {certificateLocked
                          ? "View Certificate"
                          : "Get Certificate"}
                      </button>
                    )} */}
                    <button
                      disabled={isClaimDisabled || !isCompleted}
                      onClick={() => setIsPromoOpen(true)}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isClaimDisabled || !isCompleted
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                      }`}
                    >
                      {alreadyClaimed ? (
                        <>Claimed</>
                      ) : isCertificationMinting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Minting...
                        </>
                      ) : isCheckingClaim ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Checking...
                        </>
                      ) : (
                        <>Claim NFT</>
                      )}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
                {!alreadyClaimed && isCheckingClaim && (
                  <p className="text-gray-400 text-sm mt-3">
                    Validating your claim status...
                  </p>
                )}
                {alreadyClaimed && showCertificate && (
                  <div className="mt-6 space-y-4">
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
                          onClick={handleDownloadPDF}
                          disabled={!certificateName.trim()}
                          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                            !certificateName.trim()
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : "cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                          }`}
                        >
                          <Download className="w-4 h-4" /> Download PDF
                        </button>
                      </div>
                    </div>
                    <div ref={certificateRef} className="flex justify-center">
                      <Certificate
                        name={certificateName}
                        title="Certificate of Completion"
                        subtitle={currentModule?.title}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Interactive panel */}
            <div className="w-full lg:w-[40%]">
              <motion.div
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-blue-300" />
                    <p className="text-gray-300">
                      Track your progress and claim your certification NFT once
                      completed.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-amber-300" />
                    <p className="text-gray-300">
                      Claiming stores proof to prevent duplicate claims.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5 text-purple-300" />
                    <p className="text-gray-300">
                      View the minted NFT on the certification page after
                      success.
                    </p>
                  </div>

                  {isCompleted && !alreadyClaimed && (
                    <motion.p
                      className="text-emerald-300 text-sm"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                      }}
                    >
                      You're ready to claim!
                    </motion.p>
                  )}

                  {/* {(alreadyClaimed && (nft || claimedCertification)) && (
                    <div className="pt-2">
                      <MintedNFTDisplay nft={{ ...(nft || claimedCertification), mintedAt: new Date((nft?.mintedAt || claimedCertification?.mintedAt) as any) as any }} levelKey={currentModule.id} />
                    </div>
                  )} */}
                </div>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      </div>
      <PromoCodeModal
        isOpen={isPromoOpen}
        onClose={() => setIsPromoOpen(false)}
        onMint={handleClaim}
      />
    </div>
  );
}

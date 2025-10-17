"use client";

import { useParams, useRouter } from "next/navigation";
import { useMintedStatus } from "@/hooks/useMintedStatus";
import { MintedNFTDisplay } from "@/components/nft/MintedNFTDisplay";
import { SuccessfulMint } from "@/components/nft/SuccessfulMint";
import { useWalletProtection } from "@/hooks/useWalletProtection";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/nft/GlassCard";
import { FloatingParticles } from "@/components/nft/FloatingParticles";
import { Loader2, ArrowLeft, AlertCircle, Download } from "lucide-react";
import Certificate from "@/components/Certificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";

export default function NFTPage() {
  const { levelKey } = useParams();
  const router = useRouter();
  const {
    address: userAddress,
    isWalletConnected,
    isReady,
    isLoading: walletLoading,
  } = useWalletProtection();
  const { nfts, isLoading, error } = useMintedStatus(userAddress || null);
  const [justMinted, setJustMinted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  const [certificateLocked, setCertificateLocked] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Check if this is a just minted NFT (from URL params)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setJustMinted(urlParams.get("justMinted") === "true");
  }, []);

  // Find the NFT for this levelKey
  const nft = nfts?.find(
    (n) => n.levelKey === levelKey || n.level === parseInt(levelKey as string)
  );

  // Check one-time certificate generation lock for this level
  useEffect(() => {
    const check = async () => {
      if (!userAddress || !levelKey) return;
      try {
        const res = await fetch(
          `/api/certification/generate/arbitrum-stylus?userAddress=${userAddress}&levelKey=${levelKey}`
        );
        const data = await res.json();
        if (res.ok) {
          setCertificateLocked(Boolean(data.generated));
          if (data.name) setCertificateName(data.name);
        }
      } catch {}
    };
    check();
  }, [userAddress, levelKey]);

  const handleDownloadPDF = async () => {
    const node = document.getElementById("certificate");
    if (!node) return;
    if (
      !certificateLocked &&
      certificateName.trim() &&
      userAddress &&
      levelKey
    ) {
      try {
        await fetch(`/api/certification/generate/arbitrum-stylus`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userAddress,
            name: certificateName.trim(),
            levelKey,
          }),
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
        // Ensure background matches the on-screen dark theme and add safe bleed
        const cert = doc.getElementById("certificate") as HTMLElement | null;
        if (cert) {
          cert.style.background =
            "linear-gradient(135deg, #020816 0%, #0D1221 100%)";
          cert.style.borderRadius = "0"; // avoid anti-aliased corners seams
        }
        // Hide elements marked to be skipped for PDF (to avoid thin lines/underlines artifacts)
        doc
          .querySelectorAll("[data-pdf-hide]")
          .forEach((el) => ((el as HTMLElement).style.display = "none"));
        // html2canvas doesn't support background-clip: text well; force solid color
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
    // Export as standard A4 landscape; center image while preserving design
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
    pdf.save(`${levelKey}-certificate-${safeName}.pdf`);
  };

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
          <h2 className="text-2xl font-bold text-white mt-6 mb-4">
            Loading...
          </h2>
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
          <h2 className="text-2xl font-bold text-white mb-4">
            Wallet Not Connected
          </h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to view your NFT.
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
          <h2 className="text-2xl font-bold text-white mt-6 mb-4">
            Loading NFT...
          </h2>
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
          <h2 className="text-2xl font-bold text-red-300 mb-4">
            Error Loading NFT
          </h2>
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
            No NFT found for Level {levelKey}. You may need to mint this level
            first.
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

      <div className="relative z-10 container mx-auto px-4 py-12 space-y-6">
        {justMinted ? (
          <SuccessfulMint mintedNFT={nft} levelKey={levelKey as string} />
        ) : (
          <MintedNFTDisplay nft={nft} levelKey={levelKey as string} />
        )}

        {/* Certificate actions for this level (only if NFT exists) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-white font-semibold">Certificate</p>
              <p className="text-gray-400 text-sm">
                Generate and download your certificate for this level.
              </p>
            </div>
            <button
              onClick={() => setShowCertificate((v) => !v)}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
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
                  subtitle={nft?.levelName || String(levelKey)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

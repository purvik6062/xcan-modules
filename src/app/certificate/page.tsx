"use client";

import { useEffect, useRef, useState } from "react";
import Certificate from "@/components/Certificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

export default function CertificatePage() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [subtitle, setSubtitle] = useState<string | undefined>(undefined);
  const certificateRef = useRef<HTMLDivElement>(null);

  // Prefill optional title/subtitle from URL (e.g., from NFT pages)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const t = params.get("title") || undefined;
    const s = params.get("subtitle") || undefined;
    if (t) setTitle(t);
    if (s) setSubtitle(s);
  }, []);

  // Handle form submit to show preview
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitted(true);
  };

  // Convert certificate DOM to A4 landscape PDF
  const handleDownloadPDF = async () => {
    const node = document.getElementById("certificate");
    if (!node) return;

    // Increase scale for sharper output
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    // jsPDF A4 landscape in mm: 297 x 210
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 297;
    const pageHeight = 210;

    // Fit inside page while preserving aspect ratio (no cropping)
    const ratio = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height
    );
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight, undefined, "FAST");
    pdf.save(`certificate-${name.replace(/\s+/g, "_")}.pdf`);
  };

  const handleBack = () => setSubmitted(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>

        {!submitted ? (
          <div className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6">
            <h1 className="text-2xl font-semibold text-white mb-4">
              Generate Certificate
            </h1>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full cursor-pointer inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg"
              >
                Generate
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div ref={certificateRef} className="flex justify-center">
              <Certificate name={name} title={title} subtitle={subtitle} />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPDF}
                className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Edit Name
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

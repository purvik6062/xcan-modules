"use client";

import Image from "next/image";
import { useMemo } from "react";

interface CertificateProps {
  name: string;
  title?: string;
  subtitle?: string;
  backgroundImageUrl?: string;
  showLogo?: boolean;
}

export default function Certificate({
  name,
  title = "Certificate of Completion",
  subtitle,
  backgroundImageUrl,
  showLogo = true,
}: CertificateProps) {
  const issueDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  return (
    <div
      id="certificate"
      className="relative w-full mx-auto"
      style={{
        // A4 landscape ratio
        aspectRatio: "297 / 210",
        maxWidth: 1122,
        background: "linear-gradient(135deg, #020816 0%, #0D1221 100%)",
        borderRadius: 8,
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.5), inset 0 0 120px rgba(59,130,246,0.08)",
      }}
    >
      {/* Ambient gradient orbs to reduce empty feel */}
      <div
        data-pdf-hide
        className="pointer-events-none absolute -top-10 -left-10 w-72 h-72 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.18) 0%, rgba(2,8,22,0) 70%)",
        }}
      />
      <div
        data-pdf-hide
        className="pointer-events-none absolute -bottom-12 -right-12 w-[22rem] h-[22rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 70% 70%, rgba(99,102,241,0.18) 0%, rgba(2,8,22,0) 70%)",
        }}
      />
      {/* Ornate outer border */}
      <div
        className="absolute inset-0"
        style={{
          border: "3px solid rgba(96,165,250,0.6)",
          borderRadius: 8,
        }}
      />

      {/* Inner decorative border */}
      <div
        className="absolute inset-[8px]"
        style={{
          border: "1px solid rgba(37,99,235,0.6)",
          borderRadius: 4,
        }}
      />

      {/* Corner ornaments */}
      <svg className="absolute top-2 left-2 w-16 h-16" viewBox="0 0 100 100">
        <path
          d="M10,10 L10,40 M10,10 L40,10"
          stroke="#60A5FA"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="15" cy="15" r="3" fill="#38BDF8" />
        <path
          d="M20,20 Q30,25 25,35 Q20,30 20,20"
          fill="#60A5FA"
          opacity="0.3"
        />
      </svg>

      <svg className="absolute top-2 right-2 w-16 h-16" viewBox="0 0 100 100">
        <path
          d="M90,10 L90,40 M90,10 L60,10"
          stroke="#60A5FA"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="85" cy="15" r="3" fill="#38BDF8" />
        <path
          d="M80,20 Q70,25 75,35 Q80,30 80,20"
          fill="#60A5FA"
          opacity="0.3"
        />
      </svg>

      <svg className="absolute bottom-2 left-2 w-16 h-16" viewBox="0 0 100 100">
        <path
          d="M10,90 L10,60 M10,90 L40,90"
          stroke="#60A5FA"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="15" cy="85" r="3" fill="#38BDF8" />
        <path
          d="M20,80 Q30,75 25,65 Q20,70 20,80"
          fill="#60A5FA"
          opacity="0.3"
        />
      </svg>

      <svg
        className="absolute bottom-2 right-2 w-16 h-16"
        viewBox="0 0 100 100"
      >
        <path
          d="M90,90 L90,60 M90,90 L60,90"
          stroke="#60A5FA"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="85" cy="85" r="3" fill="#38BDF8" />
        <path
          d="M80,80 Q70,75 75,65 Q80,70 80,80"
          fill="#60A5FA"
          opacity="0.3"
        />
      </svg>

      {/* Decorative pattern background */}
      <div className="absolute inset-0 opacity-5" data-pdf-hide>
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="cert-pattern"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="40"
                cy="40"
                r="20"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="0.5"
              />
              <circle
                cx="40"
                cy="40"
                r="15"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="0.5"
              />
              <circle
                cx="40"
                cy="40"
                r="10"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cert-pattern)" />
        </svg>
      </div>

      {/* Logo */}
      {showLogo && (
        <div className="relative z-10 w-full flex justify-center pt-8">
          <div
            className="rounded-full p-3 shadow-md"
            style={{
              border: "2px solid rgba(96,165,250,0.6)",
              background:
                "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15) 0%, rgba(2,8,22,0.6) 80%)",
            }}
          >
            <Image src="/XCAN-LOGO.png" alt="XCAN" width={56} height={56} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-14 pb-8">
        <div className="w-full text-center">
          <div className="mb-4">
            <div className="inline-block">
              <h1
                className="text-5xl tracking-wider"
                style={{
                  // background:
                  //   "linear-gradient(90deg, #E5E7EB 0%, #93C5FD 60%, #A5B4FC 100%)",
                  // WebkitBackgroundClip: "text",
                  // backgroundClip: "text",
                  color: "#93C5FD",
                  fontWeight: 800,
                  textShadow: "0 4px 24px rgba(59,130,246,0.25)",
                }}
              >
                {title}
              </h1>
              <div className="flex justify-center gap-2 mt-2">
                <div style={{ width: 60, height: 2, background: "#60A5FA" }} />
                <div style={{ width: 20, height: 2, background: "#38BDF8" }} />
                <div style={{ width: 60, height: 2, background: "#60A5FA" }} />
              </div>
            </div>
          </div>

          <p className="mt-6 text-lg italic" style={{ color: "#C7D2FE" }}>
            This is to certify that
          </p>

          <div className="mt-4 mb-4">
            <div className="inline-block relative">
              <span
                className="inline-block text-4xl px-8 py-2"
                style={{
                  color: "#E5E7EB",
                  fontWeight: 700,
                  fontStyle: "normal",
                }}
              >
                {name || "Your Name"}
              </span>
              <div
                className="w-full absolute bottom-0 left-0"
                data-pdf-hide
                style={{
                  height: 2,
                  background:
                    "linear-gradient(to right, transparent, #60A5FA 20%, #38BDF8 50%, #60A5FA 80%, transparent)",
                }}
              />
            </div>
          </div>

          <p
            className="mt-4 text-base leading-relaxed"
            style={{ color: "#9CA3AF" }}
          >
            has successfully completed the course
            {subtitle && (
              <>
                <br />
                <span
                  className="text-xl font-semibold block mt-2"
                  style={{ color: "#C7D2FE" }}
                >
                  "{subtitle}"
                </span>
              </>
            )}
          </p>

          <p className="mt-1 text-base" style={{ color: "#9CA3AF" }}>
            with outstanding dedication and excellence
          </p>

          <div className="mt-10 flex justify-between items-end px-8">
            {/* <div className="text-center flex-1">
              <div className="mb-2 mx-auto" style={{ width: 160 }}>
                <div
                  style={{ height: 1, background: "#2c1810", marginBottom: 8 }}
                />
              </div>
              <p className="text-sm font-serif" style={{ color: "#5a4a3a" }}>
                Instructor Signature
              </p>
            </div> */}

            <div className="flex-1 flex justify-center">
              <div
                className="inline-flex flex-col items-center px-6 py-2 rounded"
                style={{
                  border: "2px solid rgba(96,165,250,0.5)",
                  background: "rgba(59,130,246,0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#D1D5DB" }}
                  >
                    XCAN - {2025}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="text-center flex-1">
              <div className="mb-2 mx-auto" style={{ width: 160 }}>
                <div
                  style={{ height: 1, background: "#2c1810", marginBottom: 8 }}
                />
              </div>
              <p className="text-sm font-serif" style={{ color: "#5a4a3a" }}>
                Authorized Signatory
              </p>
            </div> */}
          </div>

          {/* Seal */}
          <div className="absolute bottom-8 left-12">
            <Image src="/IconMain.svg" alt="Icon" width={48} height={48} />
          </div>

          {/* Seal */}
          <div className="absolute bottom-8 right-12">
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(56,189,248,0.25) 100%)",
                border: "3px solid rgba(96,165,250,0.6)",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1"
                />
                <path
                  d="M50,30 L55,45 L70,45 L58,55 L63,70 L50,60 L37,70 L42,55 L30,45 L45,45 Z"
                  fill="#60A5FA"
                  opacity="0.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

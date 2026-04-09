"use client";

import { getCertificatePrefixForModuleKey } from "@/lib/certificate-prefix";

interface CertificateProps {
  name: string;
  title?: string;
  subtitle?: string;
  moduleName?: string;
  /** Route module id (e.g. web3-basics) — used for showcase id like W3B-XXX */
  moduleRouteKey?: string;
  /** ISO date from DB (`certificateGeneratedAt`) */
  certificateGeneratedAt?: string | null;
  backgroundImageUrl?: string;
}

function formatIssuedDate(iso: string | null | undefined): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Overlays recipient + course on public/certificate.png.
 * Certificate serial line shows PREFIX-XXX only (masked), never the real DB serial.
 */
export default function Certificate({
  name,
  title,
  subtitle,
  moduleName,
  moduleRouteKey,
  certificateGeneratedAt,
  backgroundImageUrl = "/certificate.png",
}: CertificateProps) {
  const recipientName = name?.trim() || "Recipient Name";
  const courseName =
    moduleName?.trim() || subtitle?.trim() || title?.trim() || "Module Name";

  const contentLeft = "26%";
  const contentWidth = "68%";

  const showcasePrefix = moduleRouteKey?.trim()
    ? getCertificatePrefixForModuleKey(moduleRouteKey)
    : "CERT";

  const issuedLabel = formatIssuedDate(certificateGeneratedAt);

  return (
    <div
      id="certificate"
      className="relative w-full mx-auto overflow-hidden select-none"
      style={{
        aspectRatio: "2000 / 1414",
        maxWidth: 1100,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backgroundImageUrl}
        alt="Certificate background"
        className="absolute inset-0 h-full w-full object-fill"
      />

      {/* Recipient name — aligned with name line on template */}
      <div
        className="absolute flex justify-center px-2"
        style={{
          left: contentLeft,
          width: contentWidth,
          top: "49%",
          transform: "translateY(-50%)",
        }}
      >
        <p
          className="max-w-full truncate text-center font-normal tracking-wide"
          style={{
            fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
            fontSize: "clamp(1.125rem, 2.8vw, 1.875rem)",
            lineHeight: 1.25,
            color: "#1a1a1a",
          }}
        >
          {recipientName}
        </p>
      </div>

      {/* Course / module — aligned with course line on template */}
      <div
        className="absolute flex justify-center px-3"
        style={{
          left: contentLeft,
          width: contentWidth,
          top: "58%",
          transform: "translate(-20%,50%)",
        }}
      >
        <p
          className="max-w-[95%] text-center font-bold leading-snug"
          style={{
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
            fontSize: "clamp(0.8125rem, 1.9vw, 1.125rem)",
            color: "#2c2c2c",
          }}
        >
          {courseName}
        </p>
      </div>

      {/* Date of issuance — left column above printed line (from DB) */}
      {issuedLabel ? (
        <div
          className="absolute flex justify-start"
          style={{
            left: contentLeft,
            width: "40%",
            top: "77.25%",
            transform: "translateX(35%)",
          }}
        >
          <p
            className="text-left font-medium tabular-nums"
            style={{
              fontFamily:
                "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
              fontSize: "clamp(0.7rem, 1.45vw, 0.8rem)",
              color: "#1f2937",
              lineHeight: 1.2,
            }}
          >
            {issuedLabel}
          </p>
        </div>
      ) : null}

      {/* Certificate number — right column above printed line; PREFIX-XXX (masked) */}
      <div
        className="absolute flex justify-end"
        style={{
          left: "54%",
          right: "27.5%",
          top: "77.25%",
        }}
      >
        <p
          className="text-right font-semibold uppercase tabular-nums"
          style={{
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
            fontSize: "clamp(0.7rem, 1.45vw, 0.8rem)",
            color: "#1f2937",
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          <span>{showcasePrefix}</span>
          <span className="font-semibold mx-[0.15em]">-</span>
          <span
            className="font-semibold"
            style={{ letterSpacing: "0.28em" }}
          >
            XXX
          </span>
        </p>
      </div>
    </div>
  );
}

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

  const displayRecipientName =
    recipientName.length > 40 ? `${recipientName.slice(0, 37)}...` : recipientName;
  const recipientNameFontSize =
    displayRecipientName.length > 30
      ? "34px"
      : displayRecipientName.length > 22
      ? "38px"
      : "42px";

  const displayCourseName =
    courseName.length > 44 ? `${courseName.slice(0, 41)}...` : courseName;
  const courseNameFontSize = displayCourseName.length > 34 ? "25px" : "27px";

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
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
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
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
            fontSize: recipientNameFontSize,
            lineHeight: 1.05,
            color: "#1f2937",
            letterSpacing: "0.2px",
          }}
        >
          {displayRecipientName}
        </p>
      </div>

      {/* Course / module — aligned with course line on template */}
      <div
        className="absolute flex justify-center px-3"
        style={{
          left: contentLeft,
          width: contentWidth,
          top: "57.6%",
          transform: "translate(-20%,50%)",
        }}
      >
        <p
          className="max-w-[95%] truncate text-center leading-snug"
          style={{
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
            fontSize: courseNameFontSize,
            color: "#111827",
            lineHeight: 1.04,
            letterSpacing: "0.15px",
            fontWeight: 500,
          }}
        >
          {displayCourseName}
        </p>
      </div>

      {/* Date of issuance — left column above printed line (from DB) */}
      {issuedLabel ? (
        <div
          className="absolute flex justify-start"
          style={{
            left: contentLeft,
            width: "40%",
            top: "76.25%",
            transform: "translateX(35%)",
          }}
        >
          <p
            className="text-left font-medium tabular-nums"
            style={{
              fontFamily:
                "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
              fontSize: "21px",
              color: "#111827",
              lineHeight: 1.2,
              fontWeight: 400,
              letterSpacing: "0.3px",
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
          top: "76.25%",
        }}
      >
        <p
          className="text-right uppercase tabular-nums"
          style={{
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
            fontSize: "21px",
            color: "#111827",
            letterSpacing: "0.3px",
            lineHeight: 1.2,
            fontWeight: 400,
          }}
        >
          <span>{showcasePrefix}</span>
          <span className="mx-[0.15em]">-</span>
          <span
            className=""
            style={{ letterSpacing: "0.28em" }}
          >
            XXX
          </span>
        </p>
      </div>
    </div>
  );
}

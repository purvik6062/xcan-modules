"use client";

interface CertificateProps {
  name: string;
  title?: string;
  subtitle?: string;
  moduleName?: string;
  backgroundImageUrl?: string;
}

export default function Certificate({
  name,
  title,
  subtitle,
  moduleName,
  backgroundImageUrl = "/certificate.png",
}: CertificateProps) {
  const recipientName = name?.trim() || "Recipient Name";
  const courseName =
    moduleName?.trim() || subtitle?.trim() || title?.trim() || "Module Name";

  return (
    <div
      id="certificate"
      className="relative w-full mx-auto overflow-hidden"
      style={{
        aspectRatio: "2000 / 1414",
        maxWidth: 1100,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backgroundImageUrl}
        alt="Certificate background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <div
        className="absolute left-0 w-full px-10 text-center"
        style={{ top: "46%" }}
      >
        <p
          className="text-4xl font-semibold tracking-wide"
          style={{
            color: "#ffffff",
            textShadow: "0 2px 10px rgba(0,0,0,0.45)",
          }}
        >
          {recipientName}
        </p>
      </div>

      <div
        className="absolute left-0 w-full px-10 text-center"
        style={{ top: "62%" }}
      >
        <p
          className="text-2xl font-medium italic"
          style={{
            color: "#ffffff",
            textShadow: "0 2px 8px rgba(0,0,0,0.45)",
          }}
        >
          {courseName}
        </p>
      </div>
    </div>
  );
}

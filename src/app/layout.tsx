// app/layout.tsx
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../providers/Providers";
import ConditionalLayout from "../components/ConditionalLayout";

// Use next/font/google if the font is available on Google Fonts
import { Tektur } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

const tektur = Tektur({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-tektur",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modules (by Xcan)",
  description:
    "Comprehensive learning platform for Arbitrum concepts. Master precompiles, Stylus, DeFi, and cross-chain development through interactive challenges and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${tektur.variable} ${geistMono.variable} flex flex-col min-h-screen antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            <ConditionalLayout>{children}</ConditionalLayout>
          </Providers>
          <Toaster position="top-center" />
        </Suspense>
      </body>
    </html>
  );
}

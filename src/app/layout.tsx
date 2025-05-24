import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { Providers } from "./Providers";

// Use next/font/google if the font is available on Google Fonts
import { Tektur } from "next/font/google";

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
  title: "ArbitrumQuest - Master Arbitrum Development",
  description:
    "Comprehensive learning platform for Arbitrum development. Master precompiles, Stylus, DeFi, and cross-chain development through interactive challenges and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${tektur.variable} ${geistMono.variable} flex flex-col min-h-screen antialiased`}
      >
        <Providers>
          <Navigation />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

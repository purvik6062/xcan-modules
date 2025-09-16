// app/layout.tsx
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Tektur } from "next/font/google";
import "./globals.css";
import Providers from "../providers/Providers";
import ConditionalLayout from "../components/ConditionalLayout";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

// Font configurations
const tektur = Tektur({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-tektur",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Modules (by Xcan) | Arbitrum Learning Platform",
  description:
    "Master Arbitrum development through interactive challenges. Learn precompiles, Stylus, DeFi, and cross-chain concepts with hands-on projects.",
  openGraph: {
    title: "Modules - Arbitrum Learning Platform",
    description: "Comprehensive learning platform for Arbitrum development",
    images: ["/og-image.png"], // Add your OG image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={`
          ${tektur.variable} 
          ${geistMono.variable}
          font-sans 
          antialiased 
          bg-gradient-to-br from-gray-50 to-gray-100
          text-gray-900
          min-h-screen
          flex flex-col
          transition-colors duration-300
        `}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
            </div>
          }
        >
          <Providers>
            <div className="flex-1 flex flex-col">
              <ConditionalLayout>{children}</ConditionalLayout>
            </div>
          </Providers>

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </Suspense>
      </body>
    </html>
  );
}
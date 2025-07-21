"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ConnectWallet from "./ConnectWallet";

export default function ChallengeNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-[#010229] to-[#191F52] py-3 px-2">
      <div className="px-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-white text-2xl font-bold flex items-center"
          >
            <div className="relative">
              <span className="text-3xl font-bold">Modules</span>
              <span className="absolute -bottom-1 right-0 text-[13px] text-gray-300 translate-x-2 translate-y-1">
                (by Inorbit)
              </span>
            </div>
          </Link>

          {/* Desktop navigation - only playground and connect wallet */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/playground"
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    Playground
                  </Link>
                </li>
              </ul>
            </nav>
            <ConnectWallet />
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  href="/playground"
                  className="block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Playground
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ConnectWallet from "./ConnectWallet";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="bg-gradient-to-r from-[#010229] to-[#01056b] py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo (always visible) */}
          <Link
            href="/"
            className="text-white text-2xl font-bold flex items-center pl-2 md:pl-0"
          >
            <div className="relative">
              <span className="text-2xl font-bold">Modules</span>
              <span className="absolute -bottom-1 right-0 text-[13px] text-gray-300 translate-x-2 translate-y-1">
                (by Xcan)
              </span>
            </div>
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            className="md:hidden text-white pr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {/* Desktop navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-4">
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/#modules"
                    className={`text-white hover:text-blue-200 transition-colors ${isActive("/#modules") ? "font-semibold" : ""
                      }`}
                  >
                    Modules
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://inorbit-app.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    University
                  </Link>
                </li>
                <li>
                  <Link
                    href="/playground"
                    className={`text-white hover:text-blue-200 transition-colors ${isActive("/playground") ? "font-semibold" : ""
                      }`}
                  >
                    Playground
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className={`text-white hover:text-blue-200 transition-colors ${isActive("/leaderboard") ? "font-semibold" : ""
                      }`}
                  >
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className={`text-white hover:text-blue-200 transition-colors ${isActive("/profile") ? "font-semibold" : ""
                      }`}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nft"
                    className={`text-white hover:text-blue-200 transition-colors ${isActive("/nft") ? "font-semibold" : ""
                      }`}
                  >
                    NFT
                  </Link>
                </li>
              </ul>
            </nav>
            <div>
              <ConnectWallet />
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div
              className={`rounded-lg p-4 shadow-lg ${pathname === "/"
                ? "bg-[#0a0a2a] bg-opacity-95"
                : "bg-gradient-to-b from-[#010229] to-[#01056b]"
                }`}
            >
              <ul className="flex flex-col space-y-2">
                <li>
                  <Link
                    href="/#modules"
                    className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${isActive("/#modules") ? "bg-blue-700" : ""
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Modules
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learn-defi"
                    className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${isActive("/learn-defi") ? "bg-blue-700" : ""
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Learn DeFi
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://arbitrum-university.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    University
                  </Link>
                </li>
                <li>
                  <Link
                    href="/challenges"
                    className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${isActive("/challenges") ? "bg-blue-700" : ""
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Challenges
                  </Link>
                </li>
                <li>
                  <Link
                    href="/playground"
                    className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${isActive("/playground") ? "bg-blue-700" : ""
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Playground
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${isActive("/leaderboard") ? "bg-blue-700" : ""
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${isActive("/profile") ? "bg-blue-700" : ""
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nft"
                    className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${isActive("/nft") ? "bg-blue-700" : ""
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    NFT
                  </Link>
                </li>
              </ul>
              <div className="mt-4 flex justify-start">
                <ConnectWallet />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

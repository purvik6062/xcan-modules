"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ConnectKitButton } from "connectkit";

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
          <Link
            href="/"
            className="text-white text-2xl font-bold flex items-center"
          >
            <Image 
              src="/ArbQuest.svg" 
              alt="Arbitrum Quest Logo" 
              width={150} 
              height={40} 
              className="h-auto" 
              priority
            />
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
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

          {/* Desktop navigation */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link
                    href="/#modules"
                    className={`text-white hover:text-blue-200 transition-colors ${
                      isActive("/#modules") ? "font-semibold" : ""
                    }`}
                  >
                    Modules
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://arbitrum-university.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    University
                  </Link>
                </li>
                <li>
                  <Link
                    href="/challenges"
                    className={`text-white hover:text-blue-200 transition-colors ${
                      isActive("/challenges") ? "font-semibold" : ""
                    }`}
                  >
                    Challenges
                  </Link>
                </li>
                <li>
                  <Link
                    href="/playground"
                    className={`text-white hover:text-blue-200 transition-colors ${
                      isActive("/playground") ? "font-semibold" : ""
                    }`}
                  >
                    Playground
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leaderboard"
                    className={`text-white hover:text-blue-200 transition-colors ${
                      isActive("/leaderboard") ? "font-semibold" : ""
                    }`}
                  >
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className={`text-white hover:text-blue-200 transition-colors ${
                      isActive("/profile") ? "font-semibold" : ""
                    }`}
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </nav>
            <ConnectKitButton />
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  href="/#modules"
                  className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${
                    isActive("/#modules") ? "bg-blue-700" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Modules
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
                  className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${
                    isActive("/challenges") ? "bg-blue-700" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Challenges
                </Link>
              </li>
              <li>
                <Link
                  href="/playground"
                  className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${
                    isActive("/playground") ? "bg-blue-700" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Playground
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${
                    isActive("/leaderboard") ? "bg-blue-700" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`block text-white hover:bg-blue-700 px-3 py-2 rounded transition-colors ${
                    isActive("/profile") ? "bg-blue-700" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

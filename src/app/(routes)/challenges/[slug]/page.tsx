"use client";
import Link from "next/link";
import ClientChallenge from "./client-page";
import { useParams } from "next/navigation";
import "../../../../styles/gamify.css";
import { challengesData } from "../../../../data/challenges";
import {
  FiSmartphone,
  FiMonitor,
  FiArrowRight,
  FiXCircle,
} from "react-icons/fi";

// Define proper types for our challenge data
interface TestCase {
  input: any[];
  expectedOutput: any;
  description: string;
}

// Add a simple footer for mobile
const MobileFooter = () => (
  <footer className="w-full py-4 text-center text-xs text-blue-300 bg-gradient-to-br from-[#010229] to-[#01056b] border-t border-blue-900 opacity-90">
    © {new Date().getFullYear()} Modules (by Xcan). All rights reserved.
  </footer>
);

export default function ChallengePage() {
  const { slug } = useParams();

  // Get challenge data from the slug
  const challenge = challengesData[slug as string];

  // Mobile under construction message
  const MobileBlock = () => (
    <div className="md:hidden w-full min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#010229] to-[#01056b]">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center mb-6 space-x-6">
          <div className="relative flex flex-col items-center">
            <FiSmartphone className="text-5xl text-blue-400" />
            <FiXCircle className="absolute -top-2 -right-2 text-red-500 text-xl bg-[#010229] rounded-full" />
          </div>
          <FiArrowRight className="text-3xl text-blue-400" />
          <FiMonitor className="text-5xl text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-blue-100 mb-2 text-center">
          Mobile Experience Coming Soon
        </h2>
        <div className="w-24 h-1 bg-blue-500 rounded-full mb-4" />
        <p className="text-blue-200 text-center mb-2 text-base font-medium">
          This page is being upgraded for a great mobile experience.
          <br />
          Please use a desktop or laptop for now.
        </p>
        <p className="text-blue-400 text-center text-sm">
          Switch to a larger device to access all features.
        </p>
      </div>
      <MobileFooter />
    </div>
  );

  if (!challenge) {
    return (
      <>
        <div className="w-full flex flex-col min-h-screen">
          <MobileBlock />
        </div>
        <div className="hidden md:flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-xl bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col items-center">
            <div className="w-full bg-red-900/30 p-4 border-b border-red-900/50 flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 sm:h-12 sm:w-12 text-red-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-lg sm:text-2xl font-bold text-center text-red-200 mb-2">
                Challenge Not Found
              </h2>
            </div>
            <div className="p-4 sm:p-6 w-full">
              <p className="text-gray-300 text-center mb-4 sm:mb-6 text-sm sm:text-base">
                The challenge you&apos;re looking for doesn&apos;t exist or may
                have been removed.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/challenges"
                  className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-md hover:shadow-lg cursor-pointer text-sm sm:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-2 cursor-pointer"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Return to all challenges
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col">
        <MobileBlock />
      </div>
      <div className="hidden md:block">
        <ClientChallenge challenge={challenge} slug={slug} />
      </div>
    </>
  );
}

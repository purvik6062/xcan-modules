"use client";
import Link from "next/link";
import ClientChallenge from "./client-page";
import { useParams } from "next/navigation";
import "../../styles/gamify.css";
import { challengesData } from "../../data/challenges";

// Define proper types for our challenge data
interface TestCase {
  input: any[];
  expectedOutput: any;
  description: string;
}

export default function ChallengePage() {
  const { slug } = useParams();

  // Get challenge data from the slug
  const challenge = challengesData[slug as string];

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-50 dark:bg-red-900/30 p-4 border-b border-red-100 dark:border-red-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-center text-red-800 dark:text-red-200 mb-2">Challenge Not Found</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
              The challenge you&apos;re looking for doesn&apos;t exist or may have
              been removed.
            </p>
            <div className="flex justify-center">
              <Link
                href="/challenges"
                className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-md hover:shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
    );
  }

  // Pass the challenge data to the client component
  return <ClientChallenge challenge={challenge} slug={slug} />;
}

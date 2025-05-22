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

interface Challenge {
  id: number;
  title: string;
  level: string;
  description: string;
  category: string;
  points: number;
  instructions: string;
  testCases: TestCase[];
  startingCode: string;
  solution: string;
  precompileUsed: string;
}

export default function ChallengePage() {
  const { slug } = useParams();

  // Get challenge data from the slug
  const challenge = challengesData[slug as string];

  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Challenge Not Found</h2>
          <p className="mb-4">
            The challenge you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link
            href="/challenges"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
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
    );
  }

  // Pass the challenge data to the client component
  return <ClientChallenge challenge={challenge} slug={slug} />;
}

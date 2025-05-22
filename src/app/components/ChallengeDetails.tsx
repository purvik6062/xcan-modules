"use client";

import { Challenge } from "../types/challenge";
import Link from "next/link";

interface ChallengeDetailsProps {
  challenge: Challenge;
}

export default function ChallengeDetails({ challenge }: ChallengeDetailsProps) {
  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/challenges"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Challenges
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{challenge.title}</h1>
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs px-2 py-1 rounded ${getLevelBadgeStyle(
              challenge.level
            )}`}
          >
            {challenge.level}
          </span>
          <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-xs">
            {challenge.category}
          </span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded px-2 py-1 text-xs">
            {challenge.precompileUsed}
          </span>
          <span className="font-semibold text-sm">
            {challenge.points} points
          </span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {challenge.description}
      </p>
    </div>
  );
}

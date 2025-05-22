"use client";

import { Challenge } from "../types/challenge";

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

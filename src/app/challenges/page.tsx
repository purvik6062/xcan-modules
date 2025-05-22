"use client";
import { useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import ChallengeFilters, { FilterState } from "../components/ChallengeFilters";
import { challengePreviews } from "../data/challenges";
import { ChallengePreview } from "../types/challenge";

// export const metadata = {
//   title: "Arbitrum Precompile Challenges - CodeQuest",
//   description:
//     "Learn how to use Arbitrum precompiles through interactive coding challenges",
// };

export default function ChallengesPage() {
  const [filteredChallenges, setFilteredChallenges] =
    useState<ChallengePreview[]>(challengePreviews);

  // Extract unique categories and precompiles for filters
  const categories = [
    ...new Set(challengePreviews.map((challenge) => challenge.category)),
  ];
  const precompiles = [
    ...new Set(challengePreviews.map((challenge) => challenge.precompileUsed)),
  ];

  // Handle filter changes
  const handleFilterChange = (filters: FilterState) => {
    const filtered = challengePreviews.filter((challenge) => {
      // Check if the challenge level is selected
      const levelMatch =
        filters.levels[challenge.level as keyof FilterState["levels"]];

      // Check if the challenge category is selected
      const categoryMatch = filters.categories[challenge.category];

      // Check if the challenge precompile is selected
      const precompileMatch = filters.precompiles[challenge.precompileUsed];

      return levelMatch && categoryMatch && precompileMatch;
    });

    setFilteredChallenges(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Arbitrum Precompile Challenges
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Learn how to interact with Arbitrum&apos;s precompiles through
            practical coding challenges
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-full text-sm font-medium">
            {filteredChallenges.length} Challenges Available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ChallengeFilters
            categories={categories}
            precompiles={precompiles}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="md:col-span-3">
          {filteredChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  id={challenge.id}
                  title={challenge.title}
                  level={challenge.level}
                  description={challenge.description}
                  slug={challenge.slug}
                  category={challenge.category}
                  points={challenge.points}
                  precompileUsed={challenge.precompileUsed}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-10 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No challenges match your filters
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filter settings to see more challenges.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

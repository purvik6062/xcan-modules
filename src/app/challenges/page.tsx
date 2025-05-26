"use client";
import { useState, useEffect } from "react";
import ChallengeCard from "../components/ChallengeCard";
import ChallengeFilters, { FilterState } from "../components/ChallengeFilters";
import { challengePreviews } from "../data/challenges";
import { ChallengePreview } from "../types/challenge";
import "../styles/gamify.css";

// export const metadata = {
//   title: "Stylus Code Concepts Challenges - CodeQuest",
//   description:
//     "Learn how to use Stylus Code Conceptss through interactive coding challenges",
// };

export default function ChallengesPage() {
  const [filteredChallenges, setFilteredChallenges] =
    useState<ChallengePreview[]>(challengePreviews);
  const [showSidebar, setShowSidebar] = useState(false);

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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section with improved styling */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 bg-[#0D1221] p-6 rounded-lg shadow-md border border-gray-700">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              <span className="text-blue-400">Stylus</span>{" "}
              Code Concepts
            </h1>
            <p className="text-gray-300">
              Learn how to interact with Arbitrum&apos;s precompiles through
              practical coding challenges
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button 
              onClick={toggleSidebar} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center space-x-2 md:hidden cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Filters</span>
            </button>
            <span className="badge-category neon-border">
              {filteredChallenges.length} Challenges Available
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Sidebar for filters - hidden on mobile by default */}
          <div
            className={`${
              showSidebar
                ? "block fixed inset-0 z-40 bg-black bg-opacity-50 md:bg-opacity-0 md:relative md:inset-auto"
                : "hidden md:block"
            } md:col-span-1`}
          >
            <div className="h-full overflow-y-auto bg-[#0D1221] p-5 rounded-lg shadow-lg border border-gray-700 md:border-0 md:shadow-none max-w-xs w-full md:w-auto">
              <div className="flex justify-between items-center mb-4 md:hidden">
                <h3 className="text-lg font-bold text-white">
                  Filters
                </h3>
                <button
                  onClick={toggleSidebar}
                  className=" text-gray-400 hover:text-gray-200"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <ChallengeFilters
                categories={categories}
                precompiles={precompiles}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Challenge Cards with improved styling */}
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
              <div className=" bg-[#0D1221] rounded-lg p-10 text-center shadow-md border border-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium  text-gray-500 mb-2">
                  No challenges match your filters
                </h3>
                <p className=" text-gray-400 mb-4">
                  Try adjusting your filter settings to see more challenges.
                </p>
                <button
                  onClick={() =>
                    handleFilterChange({
                      levels: {
                        Beginner: true,
                        Intermediate: true,
                        Advanced: true,
                      },
                      categories: Object.fromEntries(
                        categories.map((c) => [c, true])
                      ),
                      precompiles: Object.fromEntries(
                        precompiles.map((p) => [p, true])
                      ),
                    })
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

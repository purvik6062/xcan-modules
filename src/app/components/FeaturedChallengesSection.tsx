import Link from "next/link";
import {
  featuredChallenges,
  FeaturedChallenge,
} from "../data/featuredChallenges";

export default function FeaturedChallengesSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Challenges</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get started with these popular challenges from our Arbitrum
            Precompiles module
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredChallenges.map((challenge: FeaturedChallenge) => (
            <Link
              key={challenge.slug}
              href={`/challenges/${challenge.slug}`}
              className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
                  {challenge.title}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    challenge.level === "Beginner"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : challenge.level === "Intermediate"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {challenge.level}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {challenge.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1">
                  {challenge.precompile}
                </div>
                <div className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  Try Challenge →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/challenges"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View All Challenges
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

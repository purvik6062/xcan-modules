"use client";
import { useState, useEffect } from "react";
import ChallengeCard from "../../../components/ChallengeCard";
import ChallengeFilters, { FilterState } from "../../../components/ChallengeFilters";
import { challengePreviews } from "../../../data/challenges";
import { ChallengePreview } from "../../../types/challenge";
import "../../../styles/gamify.css";
import { useWalletProtection } from "../../../hooks/useWalletProtection";
import { useMint } from "../../../hooks/useMint";
import toast from "react-hot-toast";

// export const metadata = {
//   title: "Precompile Playground Challenges - CodeQuest",
//   description:
//     "Learn how to use Precompile Playground through interactive coding challenges",
// };

export default function ChallengesPage() {
  const [filteredChallenges, setFilteredChallenges] =
    useState<ChallengePreview[]>(challengePreviews);
  const [showSidebar, setShowSidebar] = useState(false);
  const { address } = useWalletProtection();
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const { certificationMint, isMinting, isCertificationMinting } = useMint();
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        if (!address) return;
        const res = await fetch(`/api/execute-challenge?userAddress=${address}`);
        if (!res.ok) return;
        const data = await res.json();
        const slugs = data?.progress?.challenges || [];
        if (Array.isArray(slugs)) setCompletedSlugs(slugs);
        try {
          const certRes = await fetch(`/api/certification/claim/precompiles-overview?userAddress=${address}`, { cache: "no-store" });
          if (certRes.ok) {
            const cert = await certRes.json();
            setAlreadyClaimed(Boolean(cert?.claimed));
          }
        } catch { }
      } catch (_) { }
    };
    fetchUserProgress();
  }, [address]);

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

  const allSlugs = challengePreviews.map((c) => c.slug);
  const allCompleted = allSlugs.every((s) => completedSlugs.includes(s));

  const claimNFT = async () => {
    try {
      if (!address) {
        toast.error("Connect your wallet first");
        return;
      }
      if (!allCompleted) {
        toast.error("Complete all challenges to claim certification");
        return;
      }
      const minted = await certificationMint("precompiles-overview");
      await fetch("/api/certification/claim/precompiles-overview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: address,
          transactionHash: minted?.transactionHash,
          metadataUrl: minted?.metadataUrl,
          imageUrl: minted?.imageUrl,
        }),
      });
      toast.success("Certification claimed!");
    } catch (_) {
      // errors handled in mint
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020816] to-[#0D1221]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section with improved styling */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 bg-[#0D1221] p-6 rounded-lg shadow-md border border-gray-700">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              <span className="text-blue-400">Stylus</span>{" "}
              Core Concepts
            </h1>
            <p className="text-gray-300">
              Learn how to interact with Arbitrum&apos;s precompiles through
              practical coding challenges
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col xs:flex-row xs:items-center xs:space-x-3 space-y-2 xs:space-y-0 w-full max-w-xs md:flex-row md:items-center md:space-x-3 md:space-y-0">
            <button
              onClick={toggleSidebar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center space-x-2 md:hidden cursor-pointer w-full xs:w-auto"
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
            <span className="badge-category neon-border whitespace-nowrap text-sm xs:text-base w-full xs:w-auto text-center !px-[12px] !py-[8px] !mt-[6px]">
              {filteredChallenges.length} Challenges Available
            </span>

          </div>
        </div>

        <div className="w-full flex flex-col items-center bg-[#0B1326]/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="absolute -z-10 inset-0 rounded-2xl pointer-events-none" aria-hidden>
            <div className="h-full w-full rounded-2xl opacity-[0.08] bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />
          </div>
          {/* Contextual Text */}
          <div className="text-center">
            {alreadyClaimed ? (
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold">Certification claimed — check your wallet</span>
              </div>
            ) : !allCompleted ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-400 dark:text-gray-400">
                  Finish every challenge to unlock your onchain NFT certificate
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 pb-2">
                  A verifiable onchain credential that showcases your achievement
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-1 text-green-600 dark:text-green-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">All challenges complete</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-400">
                  You’re eligible to claim your NFT certification
                </p>
              </div>
            )}
          </div>

          {/* NFT Claim Button */}
          <button
            onClick={claimNFT}
            disabled={!allCompleted || isCertificationMinting || alreadyClaimed}
            className={`${alreadyClaimed
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700 cursor-default"
              : allCompleted && !isMinting && !isCertificationMinting
                ? "bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-600 hover:via-sky-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-cyan-500/20 ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transform hover:scale-[1.03] active:scale-[0.98]"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60 border border-gray-400/30 dark:border-gray-600/40"
              } px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 w-full xs:w-auto flex items-center justify-center space-x-2 min-h-[40px]`}
          >
            {alreadyClaimed ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Certification Claimed</span>
              </>
            ) : isCertificationMinting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Claiming...</span>
              </>
            ) : allCompleted ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11l7-5 7 5V7l-7-5z" clipRule="evenodd" />
                </svg>
                <span>Claim NFT Certification</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <span>Complete All Challenges</span>
              </>
            )}
          </button>

          {/* Additional Info for Claimed State */}
          {alreadyClaimed && (
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg max-w-sm">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v11l7-5 7 5V7l-7-5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-xs">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    Your achievement is now onchain
                  </p>
                  <p className="text-green-700 dark:text-green-300 mt-1">
                    This NFT is permanent proof of completion
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Sidebar for filters - hidden on mobile by default */}
          <div
            className={`${showSidebar
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
                    completed={completedSlugs.includes(challenge.slug)}
                  />
                ))}
              </div>
            ) : (
              <div className=" bg-[#0D1221] rounded-lg p-10 text-center shadow-md border border-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
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
                <h3 className="text-lg font-medium  text-gray-400 mb-2">
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

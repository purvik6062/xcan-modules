"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAccount } from "wagmi";

// Types for the profile data
interface ProfileData {
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  joinDate: string;
  userAddress: string;
  level: string;
  points: number;
  totalChallengesCompleted: number;
  totalSectionsCompleted: number;
  totalModulesCompleted: number;
  totalMinted: number;
  completedModules: Array<{
    id: string;
    name: string;
    completedAt: string;
  }>;
  completedChallenges: Array<{
    id: string;
    moduleId: string;
    moduleName: string;
    title: string;
    completedOn: string;
    points: number;
    level: string;
  }>;
  levelDistribution: Record<string, number>;
  mintedNFTs: Array<{
    level: number;
    levelKey: string;
    levelName: string;
    transactionHash: string;
    metadataUrl: string;
    imageUrl: string;
    mintedAt: string;
    network: string;
  }>;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview"); // overview, challenges, modules, nfts
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/profile?address=${address}`);

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        console.log("user data: ", data);
        setUserData(data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [address]);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show connect wallet state
  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-blue-500 text-6xl mb-4">🔗</div>
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-4">Please connect your wallet to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-500 text-6xl mb-4">👤</div>
            <h2 className="text-xl font-bold mb-2">No Profile Data</h2>
            <p className="text-gray-400 mb-4">No profile data found for this address</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalPoints = userData.points;
  const completedCount = userData.totalChallengesCompleted;
  const beginnerCount = userData.levelDistribution.Beginner || 0;
  const intermediateCount = userData.levelDistribution.Intermediate || 0;
  const advancedCount = userData.levelDistribution.Advanced || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="lg:col-span-1">
          <div className=" bg-[#0A142A] rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center text-center">
              <Image
                width={128}
                height={128}
                src={userData.avatar}
                alt={userData.username}
                className="w-32 h-32 rounded-full mb-4"
              />
              <h1 className="text-2xl font-bold">{userData.username}</h1>
              {/* <p className=" text-gray-300">
                {userData.fullName}
              </p> */}
              <p className="text-sm  text-gray-400 mt-1">
                Member since {userData.joinDate}
              </p>

              <div className="mt-6 w-full">
                <div className="flex justify-between mb-2">
                  <span className=" text-gray-300">
                    Level:
                  </span>
                  <span
                    className={`font-medium ${userData.level === "Beginner"
                      ? "text-green-600"
                      : userData.level === "Intermediate"
                        ? "text-yellow-600"
                        : "text-red-600"
                      }`}
                  >
                    {userData.level}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className=" text-gray-300">
                    Points:
                  </span>
                  <span className="font-medium">{userData.points}</span>
                </div>
                {/* <div className="flex justify-between mb-2">
                  <span className=" text-gray-300">
                    Rank:
                  </span>
                  <span className="font-medium">#{userData.rank}</span>
                </div> */}
                {/* <div className="flex justify-between">
                  <span className=" text-gray-300">
                    Current Streak:
                  </span>
                  <span className="font-medium">{userData.streak} days 🔥</span>
                </div> */}
              </div>

              {/* <button className="mt-6 w-full cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
                Edit Profile
              </button> */}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-6 border-b  border-gray-700">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  className={`inline-block cursor-pointer py-4 px-4 border-b-2 font-medium text-sm ${activeTab === "overview"
                    ? "  text-blue-300 border-blue-300"
                    : "text-gray-400 hover:text-gray-400 hover:border-gray-300 border-transparent"
                    }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
              </li>
              <li className="mr-2">
                <button
                  className={`inline-block cursor-pointer py-4 px-4 border-b-2 font-medium text-sm ${activeTab === "challenges"
                    ? "  text-blue-300 border-blue-300"
                    : "text-gray-400 hover:text-gray-400 hover:border-gray-300 border-transparent"
                    }`}
                  onClick={() => setActiveTab("challenges")}
                >
                  Challenges
                </button>
              </li>
              <li className="mr-2">
                <button
                  className={`inline-block cursor-pointer py-4 px-4 border-b-2 font-medium text-sm ${activeTab === "modules"
                    ? " text-blue-300 border-blue-300"
                    : "text-gray-400 hover:text-gray-400 hover:border-gray-300 border-transparent"
                    }`}
                  onClick={() => setActiveTab("modules")}
                >
                  Modules
                </button>
              </li>
              <li>
                <button
                  className={`inline-block cursor-pointer py-4 px-4 border-b-2 font-medium text-sm ${activeTab === "nfts"
                    ? " text-blue-300 border-blue-300"
                    : "text-gray-400 hover:text-gray-400 hover:border-gray-300 border-transparent"
                    }`}
                  onClick={() => setActiveTab("nfts")}
                >
                  NFTs
                </button>
              </li>
            </ul>
          </div>

          {/* Tab content */}
          <div>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-4">
                    <div className="text-3xl font-bold text-blue-300">
                      {totalPoints}
                    </div>
                    <div className="text-sm text-gray-300">
                      Total Points
                    </div>
                  </div>
                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-4">
                    <div className="text-3xl font-bold text-green-300">
                      {completedCount}
                    </div>
                    <div className="text-sm text-gray-300">
                      Challenges
                    </div>
                  </div>
                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-4">
                    <div className="text-3xl font-bold text-purple-300">
                      {userData.totalSectionsCompleted}
                    </div>
                    <div className="text-sm text-gray-300">
                      Sections
                    </div>
                  </div>
                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-4">
                    <div className="text-3xl font-bold text-pink-300">
                      {userData.totalModulesCompleted}
                    </div>
                    <div className="text-sm text-gray-300">
                      Modules
                    </div>
                  </div>
                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-4">
                    <div className="text-3xl font-bold text-yellow-300">
                      {userData.totalMinted}
                    </div>
                    <div className="text-sm text-gray-300">
                      NFTs
                    </div>
                  </div>
                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-4">
                    <div className="text-3xl font-bold text-cyan-300">
                      {userData.completedModules.length}
                    </div>
                    <div className="text-sm text-gray-300">
                      Completed
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-3">Completed Modules</h3>
                    {userData.completedModules.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {userData.completedModules.map((module) => (
                          <div key={module.id} className="bg-[#1a2332] rounded-lg p-3 flex items-center justify-between">
                            <div>
                              <div className="font-medium text-white">{module.name}</div>
                              <div className="text-xs text-gray-400">{module.completedAt}</div>
                            </div>
                            <div className="text-green-400">✓</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        No modules completed yet
                      </div>
                    )}
                  </div>
                </div>

                <div className=" bg-[#0A142A] rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4">Challenge Progress</h2>
                  <div className="flex h-10 mb-4">
                    {beginnerCount > 0 && (
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(beginnerCount / completedCount) * 100}%`,
                        }}
                        title={`${beginnerCount} Beginner Challenges`}
                      ></div>
                    )}
                    {intermediateCount > 0 && (
                      <div
                        className="h-full bg-yellow-500"
                        style={{
                          width: `${(intermediateCount / completedCount) * 100
                            }%`,
                        }}
                        title={`${intermediateCount} Intermediate Challenges`}
                      ></div>
                    )}
                    {advancedCount > 0 && (
                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: `${(advancedCount / completedCount) * 100}%`,
                        }}
                        title={`${advancedCount} Advanced Challenges`}
                      ></div>
                    )}
                  </div>
                  <div className="flex text-sm justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span>Beginner ({beginnerCount})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                      <span>Intermediate ({intermediateCount})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                      <span>Advanced ({advancedCount})</span>
                    </div>
                  </div>
                </div>

                {/* <div className=" bg-[#0A142A] rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4">Minted NFTs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {userData.mintedNFTs.map((nft) => (
                      <div key={nft.level} className="bg-[#1a2332] rounded-lg p-4 text-center">
                        <div className="mb-2">
                          <Image
                            src={nft.imageUrl}
                            alt={nft.levelName}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-lg mx-auto"
                          />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{nft.levelName}</h3>
                        <p className="text-xs text-gray-400 mb-2">Level {nft.level}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(nft.mintedAt).toLocaleDateString()}
                        </p>
                        <a
                          href={`https://sepolia.arbiscan.io/tx/${nft.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-xs mt-1 block"
                        >
                          View Transaction
                        </a>
                      </div>
                    ))}
                    {userData.mintedNFTs.length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <div className="text-gray-500 text-4xl mb-2">🎨</div>
                        <p className="text-gray-400">No NFTs minted yet</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Complete challenges to mint your first NFT!
                        </p>
                      </div>
                    )}
                  </div>
                </div> */}

                <div className=" bg-[#0A142A] rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {userData.completedChallenges
                      .slice(0, 5)
                      .map((challenge) => (
                        <div key={challenge.id} className="flex items-start">
                          <div className="flex-shrink-0 bg-green-900 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium">
                              <span className="text-gray-400">{challenge.moduleName}:</span>{" "}
                              <span className="text-white">{challenge.title}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {challenge.completedOn} • {challenge.points} points
                            </div>
                          </div>
                        </div>
                      ))}
                    {userData.completedChallenges.length === 0 && (
                      <div className="text-center py-4 text-gray-400">
                        No challenges completed yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Challenges Tab */}
            {activeTab === "challenges" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Completed Challenges ({userData.completedChallenges.length})</h2>
                <div className="space-y-4 mb-8">
                  {userData.completedChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className=" bg-[#0A142A] rounded-lg shadow-md p-4 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          {challenge.title}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {challenge.moduleName}
                        </div>
                        <div className="flex items-center mt-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded mr-2 ${challenge.level === "Beginner"
                              ? "  bg-green-900 text-green-200"
                              : challenge.level === "Intermediate"
                                ? "  bg-yellow-900 text-yellow-200"
                                : "  bg-red-900 text-red-200"
                              }`}
                          >
                            {challenge.level}
                          </span>
                          <span className="text-sm text-gray-400">
                            {challenge.completedOn}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-300">
                          {challenge.points} pts
                        </div>
                        <div className="text-xs text-green-400">✓ Completed</div>
                      </div>
                    </div>
                  ))}
                  {userData.completedChallenges.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-500 text-6xl mb-4">📚</div>
                      <h3 className="text-xl font-bold mb-2">No Challenges Completed</h3>
                      <p className="text-gray-400">
                        Start learning to complete your first challenge!
                      </p>
                    </div>
                  )}
                </div>

                {/* <h2 className="text-xl font-bold mb-4">In Progress</h2>
                <div className="space-y-4">
                  {userData.inProgressChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className=" bg-[#0A142A] rounded-lg shadow-md p-4"
                    >
                      <div className="flex justify-between mb-2">
                        <Link
                          href={`/challenges/${challenge.slug}`}
                          className="font-medium hover:text-blue-300 hover:underline"
                        >
                          {challenge.title}
                        </Link>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${challenge.level === "Beginner"
                            ? "  bg-green-900 text-green-200"
                            : challenge.level === "Intermediate"
                              ? "  bg-yellow-900 text-yellow-200"
                              : "  bg-red-900 text-red-200"
                            }`}
                        >
                          {challenge.level}
                        </span>
                      </div>
                      <div className="w-full bg-[#0A142A] rounded-full h-2.5">
                        <div
                          className="bg-blue-300 h-2.5 rounded-full"
                          style={{ width: `${challenge.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-right mt-1 text-sm text-gray-400">
                        {challenge.progress}% complete
                      </div>
                    </div>
                  ))}
                </div> */}
              </div>
            )}

            {/* Modules Tab */}
            {activeTab === "modules" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Learning Modules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#0A142A] rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2 text-green-400">Completed</h3>
                    <div className="text-3xl font-bold">{userData.totalModulesCompleted}</div>
                    <div className="text-sm text-gray-400">modules completed</div>
                  </div>
                  <div className="bg-[#0A142A] rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-2 text-blue-400">In Progress</h3>
                    <div className="text-3xl font-bold">{6 - userData.totalModulesCompleted}</div>
                    <div className="text-sm text-gray-400">modules available</div>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-3">Completed Modules</h3>
                <div className="space-y-3 mb-6">
                  {userData.completedModules.map((module) => (
                    <div
                      key={module.id}
                      className="bg-[#0A142A] rounded-lg shadow-md p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div className="bg-green-900 p-2 rounded-full mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{module.name}</h4>
                          <p className="text-sm text-gray-400">Completed on {module.completedAt}</p>
                        </div>
                      </div>
                      <div className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Complete
                      </div>
                    </div>
                  ))}
                  {userData.completedModules.length === 0 && (
                    <div className="text-center py-12 bg-[#0A142A] rounded-lg">
                      <div className="text-gray-500 text-6xl mb-4">🎯</div>
                      <h3 className="text-xl font-bold mb-2">No Modules Completed</h3>
                      <p className="text-gray-400 mb-4">
                        Complete all challenges in a module to mark it as complete!
                      </p>
                      <Link
                        href="/"
                        className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                      >
                        Browse Modules
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* NFTs Tab */}
            {activeTab === "nfts" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Your Minted NFTs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.mintedNFTs.map((nft) => (
                    <div key={nft.level} className="bg-[#0A142A] rounded-lg shadow-md p-6">
                      <div className="text-center mb-4">
                        <Image
                          src={nft.imageUrl}
                          alt={nft.levelName}
                          width={120}
                          height={120}
                          className="w-30 h-30 rounded-lg mx-auto"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="font-bold text-lg mb-2">{nft.levelName}</h3>
                        <p className="text-sm text-gray-400 mb-2">Level {nft.level}</p>
                        <p className="text-xs text-gray-500 mb-4">
                          Minted on {new Date(nft.mintedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <div className="space-y-2">
                          <a
                            href={`https://sepolia.arbiscan.io/tx/${nft.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
                          >
                            View Transaction
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                  {userData.mintedNFTs.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-500 text-6xl mb-4">🎨</div>
                      <h3 className="text-xl font-bold mb-2">No NFTs Minted Yet</h3>
                      <p className="text-gray-400 mb-4">
                        Complete challenges to mint your first NFT and showcase your achievements!
                      </p>
                      <Link
                        href="/challenges"
                        className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
                      >
                        Start Challenges
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

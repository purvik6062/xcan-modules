"use client";

import { useState } from "react";
import Link from "next/link";

// This is a client component to manage the user profile state

// Mock user data
const userData = {
  username: "codeExplorer",
  fullName: "Alex Johnson",
  email: "alex@example.com",
  avatar:
    "https://api.dicebear.com/7.x/bottts/svg?seed=codeExplorer&backgroundColor=c1e5c1",
  joinDate: "May 15, 2025",
  level: "Intermediate",
  points: 285,
  rank: 12,
  streak: 8,
  completedChallenges: [
    {
      id: 1,
      title: "L1 Fee Calculation",
      completedOn: "May 16, 2025",
      points: 10,
      level: "Beginner",
      slug: "l1-fee-calculation",
    },
    {
      id: 2,
      title: "Block Number Check",
      completedOn: "May 17, 2025",
      points: 15,
      level: "Beginner",
      slug: "block-number-check",
    },
    {
      id: 3,
      title: "Chain ID Verification",
      completedOn: "May 20, 2025",
      points: 15,
      level: "Beginner",
      slug: "chain-id-verification",
    },
    {
      id: 4,
      title: "Gas Price Components",
      completedOn: "May 25, 2025",
      points: 25,
      level: "Intermediate",
      slug: "gas-price-components",
    },
  ],
  inProgressChallenges: [
    {
      id: 5,
      title: "ArbOS Version",
      progress: 60,
      level: "Intermediate",
      slug: "arbos-version",
    },
    {
      id: 7,
      title: "L2-to-L1 Message Sending",
      progress: 25,
      level: "Intermediate",
      slug: "l2-to-l1-message",
    },
  ],
  achievements: [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first challenge",
      date: "May 16, 2025",
      icon: "🏆",
    },
    {
      id: 2,
      name: "Quick Learner",
      description: "Complete 3 challenges in a week",
      date: "May 20, 2025",
      icon: "🚀",
    },
    {
      id: 3,
      name: "Consistent Coder",
      description: "Achieve a 7-day streak",
      date: "May 22, 2025",
      icon: "📅",
    },
  ],
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview"); // overview, challenges, achievements

  // Calculate stats
  const totalPoints = userData.points;
  const completedCount = userData.completedChallenges.length;
  const beginnerCount = userData.completedChallenges.filter(
    (c) => c.level === "Beginner"
  ).length;
  const intermediateCount = userData.completedChallenges.filter(
    (c) => c.level === "Intermediate"
  ).length;
  const advancedCount = userData.completedChallenges.filter(
    (c) => c.level === "Advanced"
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile sidebar */}
        <div className="lg:col-span-1">
          <div className=" bg-[#0A142A] rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center text-center">
              <img
                src={userData.avatar}
                alt={userData.username}
                className="w-32 h-32 rounded-full mb-4"
              />
              <h1 className="text-2xl font-bold">{userData.username}</h1>
              <p className=" text-gray-300">
                {userData.fullName}
              </p>
              <p className="text-sm  text-gray-400 mt-1">
                Member since {userData.joinDate}
              </p>

              <div className="mt-6 w-full">
                <div className="flex justify-between mb-2">
                  <span className=" text-gray-300">
                    Level:
                  </span>
                  <span
                    className={`font-medium ${
                      userData.level === "Beginner"
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
                <div className="flex justify-between mb-2">
                  <span className=" text-gray-300">
                    Rank:
                  </span>
                  <span className="font-medium">#{userData.rank}</span>
                </div>
                <div className="flex justify-between">
                  <span className=" text-gray-300">
                    Current Streak:
                  </span>
                  <span className="font-medium">{userData.streak} days 🔥</span>
                </div>
              </div>

              <button className="mt-6 w-full cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
                Edit Profile
              </button>
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
                  className={`inline-block cursor-pointer py-4 px-4 border-b-2 font-medium text-sm ${
                    activeTab === "overview"
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
                  className={`inline-block cursor-pointer py-4 px-4 border-b-2 font-medium text-sm ${
                    activeTab === "challenges"
                      ? "  text-blue-300 border-blue-300"
                      : "text-gray-400 hover:text-gray-400 hover:border-gray-300 border-transparent"
                  }`}
                  onClick={() => setActiveTab("challenges")}
                >
                  Challenges
                </button>
              </li>
              <li>
                <button
                  className={`inline-block cursor-pointer py-4 px-4 border-b-2 font-medium text-sm ${
                    activeTab === "achievements"
                      ? " text-blue-300 border-blue-300"
                      : "text-gray-400 hover:text-gray-400 hover:border-gray-300 border-transparent"
                  }`}
                  onClick={() => setActiveTab("achievements")}
                >
                  Achievements
                </button>
              </li>
            </ul>
          </div>

          {/* Tab content */}
          <div>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-4">
                    <div className="text-3xl font-bold text-blue-300">
                      {totalPoints}
                    </div>
                    <div className=" text-gray-300">
                      Total Points
                    </div>
                  </div>
                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-4">
                    <div className="text-3xl font-bold text-blue-300">
                      {completedCount}
                    </div>
                    <div className=" text-gray-300">
                      Completed Challenges
                    </div>
                  </div>
                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-4">
                    <div className="text-3xl font-bold text-blue-300">
                      {userData.achievements.length}
                    </div>
                    <div className=" text-gray-300">
                      Achievements
                    </div>
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
                          width: `${
                            (intermediateCount / completedCount) * 100
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

                <div className=" bg-[#0A142A] rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {userData.completedChallenges
                      .slice(0, 3)
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
                              Completed{" "}
                              <Link
                                href={`/challenges/${challenge.slug}`}
                                className="text-blue-300 hover:underline"
                              >
                                {challenge.title}
                              </Link>
                            </div>
                            <div className="text-xs text-gray-400">
                              {challenge.completedOn}
                            </div>
                          </div>
                        </div>
                      ))}

                    {userData.achievements.slice(0, 2).map((achievement) => (
                      <div key={achievement.id} className="flex items-start">
                        <div className="flex-shrink-0 bg-yellow-900 p-2 rounded-full">
                          <span className="text-xl">{achievement.icon}</span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">
                            Earned achievement:{" "}
                            <span className="font-semibold">
                              {achievement.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {achievement.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Challenges Tab */}
            {activeTab === "challenges" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Completed Challenges</h2>
                <div className="space-y-4 mb-8">
                  {userData.completedChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className=" bg-[#0A142A] rounded-lg shadow-md p-4 flex justify-between items-center"
                    >
                      <div>
                        <Link
                          href={`/challenges/${challenge.slug}`}
                          className="font-medium hover:text-blue-300 hover:underline"
                        >
                          {challenge.title}
                        </Link>
                        <div className="flex items-center mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded mr-2 ${
                              challenge.level === "Beginner"
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
                        <div className="font-bold">
                          {challenge.points} points
                        </div>
                        <div className="text-xs text-green-600">Completed</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="text-xl font-bold mb-4">In Progress</h2>
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
                          className={`text-xs px-2 py-0.5 rounded ${
                            challenge.level === "Beginner"
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
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Your Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className=" bg-[#0A142A] rounded-lg shadow-md p-6 flex items-center"
                    >
                      <div className="flex-shrink-0  bg-yellow-900 p-3 rounded-full text-center">
                        <span className="text-2xl">{achievement.icon}</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold">{achievement.name}</h3>
                        <p className="text-sm  text-gray-300">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Earned on {achievement.date}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Locked achievements */}
                  <div className="bg-[#0A142A] rounded-lg shadow-md p-6 flex items-center opacity-50">
                    <div className="flex-shrink-0  bg-[#0A142A] p-3 rounded-full text-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold">Code Master</h3>
                      <p className="text-sm  text-gray-300">
                        Complete 10 advanced challenges
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Locked</p>
                    </div>
                  </div>

                  <div className=" bg-[#0A142A] rounded-lg shadow-md p-6 flex items-center opacity-50">
                    <div className="flex-shrink-0 bg-[#0A142A] p-3 rounded-full text-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold">Speed Demon</h3>
                      <p className="text-sm  text-gray-300">
                        Complete 5 challenges in a single day
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Locked</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

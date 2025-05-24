import Link from "next/link";

export const metadata = {
  title: "Leaderboard - CodeQuest",
  description: "See the top performers on CodeQuest",
};

// This would typically come from an API or database
const leaderboardData = [
  {
    id: 1,
    username: "codeMaster",
    points: 450,
    completedChallenges: 18,
    level: "Advanced",
    rank: 1,
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=codeMaster&backgroundColor=b6e3f4,c0aede",
  },
  {
    id: 2,
    username: "algorithmQueen",
    points: 420,
    completedChallenges: 17,
    level: "Advanced",
    rank: 2,
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=algorithmQueen&backgroundColor=d1d4f9",
  },
  {
    id: 3,
    username: "jsNinja",
    points: 395,
    completedChallenges: 16,
    level: "Advanced",
    rank: 3,
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=jsNinja&backgroundColor=c0aede",
  },
  {
    id: 4,
    username: "debugHero",
    points: 370,
    completedChallenges: 15,
    level: "Intermediate",
    rank: 4,
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=debugHero&backgroundColor=ffdfbf",
  },
  {
    id: 5,
    username: "syntaxSlayer",
    points: 350,
    completedChallenges: 14,
    level: "Intermediate",
    rank: 5,
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=syntaxSlayer&backgroundColor=ffd5dc",
  },
  {
    id: 6,
    username: "codeWizard",
    points: 325,
    completedChallenges: 13,
    level: "Intermediate",
    rank: 6,
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=codeWizard&backgroundColor=c1e5c1",
  },
  {
    id: 7,
    username: "techExplorer",
    points: 300,
    completedChallenges: 12,
    level: "Intermediate",
    rank: 7,
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=techExplorer&backgroundColor=d1d4f9",
  },
  {
    id: 8,
    username: "bugHunter",
    points: 280,
    completedChallenges: 11,
    level: "Intermediate",
    rank: 8,
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=bugHunter&backgroundColor=b6e3f4",
  },
  {
    id: 9,
    username: "devCoder",
    points: 260,
    completedChallenges: 10,
    level: "Beginner",
    rank: 9,
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=devCoder&backgroundColor=c0aede",
  },
  {
    id: 10,
    username: "newProgrammer",
    points: 240,
    completedChallenges: 9,
    level: "Beginner",
    rank: 10,
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=newProgrammer&backgroundColor=ffdfbf",
  },
];

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-6 py-3 text-gray-300 font-semibold">
                  Rank
                </th>
                <th className="px-6 py-3 text-gray-300 font-semibold">
                  User
                </th>
                <th className="px-6 py-3 text-gray-300 font-semibold">
                  Level
                </th>
                <th className="px-6 py-3 text-gray-300 font-semibold">
                  Challenges
                </th>
                <th className="px-6 py-3 text-gray-300 font-semibold">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {leaderboardData.map((user) => (
                <tr
                  key={user.id}
                  className={`
                    ${user.rank <= 3 ? "bg-blue-900/20" : ""}
                    hover:bg-gray-700/50 transition-colors
                  `}
                >
                  <td className="px-6 py-4">
                    <div
                      className={`
                      ${
                        user.rank === 1
                          ? "bg-yellow-400 text-yellow-900"
                          : user.rank === 2
                          ? "bg-gray-300 text-gray-700"
                          : user.rank === 3
                          ? "bg-amber-600 text-amber-100"
                          : "bg-gray-700 text-gray-300"
                      }
                      w-8 h-8 rounded-full flex items-center justify-center font-bold
                    `}
                    >
                      {user.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt={user.username}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.level === "Beginner"
                          ? "bg-green-900 text-green-200"
                          : user.level === "Intermediate"
                          ? "bg-yellow-900 text-yellow-200"
                          : "bg-red-900 text-red-200"
                      }`}
                    >
                      {user.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.completedChallenges} solved
                  </td>
                  <td className="px-6 py-4 font-bold">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">How Points are Calculated</h2>
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <p className="mb-4">
            Points are awarded based on the difficulty of challenges completed
            and the efficiency of your solutions.
          </p>

          <h3 className="text-lg font-semibold mb-2">Challenge Points:</h3>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Beginner Challenges: 10-15 points</li>
            <li>Intermediate Challenges: 25-30 points</li>
            <li>Advanced Challenges: 45-50 points</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Bonus Points:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Optimal Solution: +5 points</li>
            <li>First Attempt Success: +3 points</li>
            <li>Daily Streak: +2 points per day</li>
            <li>Weekly Challenges: +10 points</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

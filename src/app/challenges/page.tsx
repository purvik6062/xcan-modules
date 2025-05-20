import Link from "next/link";

export const metadata = {
  title: "Arbitrum Precompile Challenges - CodeQuest",
  description:
    "Learn how to use Arbitrum precompiles through interactive coding challenges",
};

// List of Arbitrum precompile challenges
const challenges = [
  {
    id: 1,
    title: "L1 Fee Calculation",
    level: "Beginner",
    description:
      "Calculate L1 fee for a transaction using current base fee per gas",
    slug: "l1-fee-calculation",
    category: "Gas",
    points: 10,
    precompileUsed: "ArbGasInfo",
  },
  {
    id: 2,
    title: "Block Number Check",
    level: "Beginner",
    description: "Retrieve the current Arbitrum block number",
    slug: "block-number-check",
    category: "System",
    points: 15,
    precompileUsed: "ArbSys",
  },
  {
    id: 3,
    title: "Chain ID Verification",
    level: "Beginner",
    description: "Verify the Chain ID of Arbitrum Sepolia",
    slug: "chain-id-verification",
    category: "System",
    points: 15,
    precompileUsed: "ArbSys",
  },
  {
    id: 4,
    title: "OS Version Checker",
    level: "Beginner",
    description: "Get the current version of Arbitrum OS",
    slug: "os-version-checker",
    category: "System",
    points: 20,
    precompileUsed: "ArbSys",
  },
  {
    id: 5,
    title: "L2-to-L1 Message Sending",
    level: "Intermediate",
    description: "Send a message from L2 to L1 using ArbSys",
    slug: "l2-to-l1-message",
    category: "Messaging",
    points: 30,
    precompileUsed: "ArbSys",
  },
  {
    id: 6,
    title: "Retryable Ticket Creation",
    level: "Intermediate",
    description: "Create a retryable ticket to execute a transaction",
    slug: "retryable-ticket-creation",
    category: "Retryables",
    points: 35,
    precompileUsed: "ArbRetryableTx",
  },
  {
    id: 7,
    title: "Address Table Management",
    level: "Intermediate",
    description: "Register and manage addresses in the ArbAddressTable",
    slug: "address-table-management",
    category: "Storage",
    points: 30,
    precompileUsed: "ArbAddressTable",
  },
  {
    id: 8,
    title: "L1 Block Information",
    level: "Advanced",
    description: "Retrieve data about the latest confirmed L1 block",
    slug: "l1-block-info",
    category: "System",
    points: 40,
    precompileUsed: "ArbSys",
  },
  {
    id: 9,
    title: "Retryable Ticket Lifecycle",
    level: "Advanced",
    description: "Manage the complete lifecycle of retryable tickets",
    slug: "retryable-lifecycle",
    category: "Retryables",
    points: 45,
    precompileUsed: "ArbRetryableTx",
  },
  {
    id: 10,
    title: "Storage and Gas Optimization",
    level: "Advanced",
    description: "Optimize gas usage when working with Arbitrum storage",
    slug: "storage-gas-optimization",
    category: "Gas",
    points: 50,
    precompileUsed: "ArbGasInfo & ArbAddressTable",
  },
];

export default function ChallengesPage() {
  const categories = [
    ...new Set(challenges.map((challenge) => challenge.category)),
  ];

  const precompiles = [
    ...new Set(challenges.map((challenge) => challenge.precompileUsed)),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        Arbitrum Precompile Challenges
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Learn how to interact with Arbitrum's precompiles through practical
        coding challenges
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="sticky top-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Difficulty</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Beginner</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Intermediate</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Advanced</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Precompiles</h3>
              <div className="space-y-2">
                {precompiles.map((precompile) => (
                  <label key={precompile} className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>{precompile}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/challenges/${challenge.slug}`}
                className="block border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{challenge.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
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
                <div className="flex justify-between items-center text-sm">
                  <div className="flex space-x-2">
                    <span className="bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                      {challenge.category}
                    </span>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded px-2 py-1">
                      {challenge.precompileUsed}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {challenge.points} points
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

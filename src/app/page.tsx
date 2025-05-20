import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Master Arbitrum Precompiles
          </h2>
          <p className="mb-4">
            Learn how to build on Arbitrum by mastering its precompiles through
            interactive coding challenges. Write, test, and execute code
            directly in your browser while building your web3 development
            skills.
          </p>
          <div className="mt-6">
            <Link
              href="/challenges"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start Coding
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Web3 Focused</h3>
            <p>
              Solve real-world smart contract integration challenges using
              Arbitrum's powerful precompiles.
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Learn L2 Development</h3>
            <p>
              Master Arbitrum-specific concepts like gas optimization, L1-L2
              messaging, and retryable tickets.
            </p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Progressive Learning</h3>
            <p>
              Start with beginner-friendly challenges and advance to complex
              cross-chain application development.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Featured Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "L1 Fee Calculation",
                level: "Beginner",
                description:
                  "Calculate L1 fee for a transaction using current base fee per gas",
                slug: "l1-fee-calculation",
                precompile: "ArbGasInfo",
              },
              {
                title: "Block Number Check",
                level: "Beginner",
                description: "Retrieve the current Arbitrum block number",
                slug: "block-number-check",
                precompile: "ArbSys",
              },
              {
                title: "Retryable Ticket Creation",
                level: "Intermediate",
                description:
                  "Create a retryable ticket to execute a transaction",
                slug: "retryable-ticket-creation",
                precompile: "ArbRetryableTx",
              },
            ].map((challenge) => (
              <Link
                key={challenge.slug}
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
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {challenge.description}
                </p>
                <div className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded px-2 py-1 inline-block">
                  {challenge.precompile}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

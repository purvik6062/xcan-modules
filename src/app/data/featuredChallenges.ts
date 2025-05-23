// Type definition for a featured challenge
export interface FeaturedChallenge {
  title: string;
  level: string;
  description: string;
  slug: string;
  precompile: string;
}

// Featured challenges data
export const featuredChallenges: FeaturedChallenge[] = [
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
    description: "Create a retryable ticket to execute a transaction",
    slug: "retryable-ticket-creation",
    precompile: "ArbRetryableTx",
  },
];

export default featuredChallenges;

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database/client";
import { userChallenges } from "@/lib/database/schema";
import { ReviewAction, ChallengeId } from "@/lib/database/schema";
import { eq, and, or } from "drizzle-orm";

// Define all certification levels with their required challenges
const CERTIFICATION_LEVELS = {
  "web3-basics": {
    name: "Web3 Basics with Stylus",
    description: "Complete challenges 1-3 to earn your first NFT badge",
    requiredChallenges: [
      ChallengeId.SIMPLE_COUNTER_EXAMPLE,
      ChallengeId.SIMPLE_NFT_EXAMPLE,
      ChallengeId.VENDING_MACHINE,
    ],
    level: 1,
  },
  "core-stylus": {
    name: "Core Stylus Engineering",
    description: "Complete challenges 1-5 to earn your second NFT badge",
    requiredChallenges: [
      ChallengeId.SIMPLE_COUNTER_EXAMPLE,
      ChallengeId.SIMPLE_NFT_EXAMPLE,
      ChallengeId.VENDING_MACHINE,
      ChallengeId.MULTISIG_WALLET,
      ChallengeId.UNISWAP_V2_STYLUS,
    ],
    level: 2,
  },
  "zkp-basics": {
    name: "ZKP Basics with Stylus",
    description: "Complete challenges 6-8 to earn your third NFT badge",
    requiredChallenges: [
      ChallengeId.ZKP_AGE,
      ChallengeId.ZKP_BALANCE,
      ChallengeId.ZKP_PASSWORD,
    ],
    level: 3,
  },
  "zkp-advanced": {
    name: "ZKP Advanced with Stylus",
    description: "Complete challenges 6-11 to earn your fourth NFT badge",
    requiredChallenges: [
      ChallengeId.ZKP_AGE,
      ChallengeId.ZKP_BALANCE,
      ChallengeId.ZKP_PASSWORD,
      ChallengeId.ZKP_LOCATION,
      ChallengeId.ZKP_MODEL,
      ChallengeId.ZKP_PUBLIC_DOC_VERIFIER,
    ],
    level: 4,
  },
  "agentic-defi": {
    name: "Agentic DeFi Basics",
    description: "Complete challenge 12 to earn your fifth NFT badge",
    requiredChallenges: [ChallengeId.VIBEKIT_SETUP],
    level: 5,
  },
  "agentic-wallets": {
    name: "Agentic Wallets & Signals",
    description: "Complete challenges 12-14 to earn your sixth NFT badge",
    requiredChallenges: [
      ChallengeId.VIBEKIT_SETUP,
      ChallengeId.VIBEKIT_BASIC_AGENTS,
      ChallengeId.VIBEKIT_ADVANCED_AGENTS,
    ],
    level: 6,
  },
  "farcaster-miniapps": {
    name: "Farcaster Miniapps with Stylus",
    description: "Complete challenge 15 to earn your final NFT badge",
    requiredChallenges: [ChallengeId.FARCASTER_MINIAPPS],
    level: 7,
  },
};

export async function POST(request: NextRequest) {
  try {
    const { userAddress } = await request.json();

    if (!userAddress) {
      return NextResponse.json(
        { error: "User address is required" },
        { status: 400 }
      );
    }

    // Query the database to check if user has completed all challenges
    const completedChallenges = await db
      .select({
        challengeId: userChallenges.challengeId,
        reviewAction: userChallenges.reviewAction,
        submittedAt: userChallenges.submittedAt,
        githubUsername: userChallenges.githubUsername,
      })
      .from(userChallenges)
      .where(
        and(
          or(
            eq(userChallenges.userAddress, userAddress),
            eq(userChallenges.userAddress, userAddress.toLowerCase())
          ),
          eq(userChallenges.reviewAction, "ACCEPTED")
        )
      );

    const completedChallengeIds = completedChallenges.map((c) => c.challengeId);

    // Get githubUsername from the most recent accepted challenge (if any)
    let githubUsername = null;
    if (completedChallenges.length > 0) {
      const sorted = [...completedChallenges].sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      githubUsername =
        sorted.find((c) => c.githubUsername)?.githubUsername || null;
    }

    // Check eligibility for each certification level
    const certificationEligibility = Object.entries(CERTIFICATION_LEVELS).map(
      ([key, level]) => {
        const hasAllRequiredChallenges = level.requiredChallenges.every(
          (challengeId) => completedChallengeIds.includes(challengeId)
        );

        const completedRequiredChallenges = level.requiredChallenges.filter(
          (challengeId) => completedChallengeIds.includes(challengeId)
        ).length;

        return {
          levelKey: key,
          name: level.name,
          description: level.description,
          level: level.level,
          isEligible: hasAllRequiredChallenges,
          completedRequiredChallenges,
          requiredChallenges: level.requiredChallenges.length,
          challengeDetails: level.requiredChallenges.map((challengeId) => ({
            id: challengeId,
            completed: completedChallengeIds.includes(challengeId),
            details:
              completedChallenges.find((c) => c.challengeId === challengeId) ||
              null,
          })),
        };
      }
    );

    // Find the highest level the user is eligible for
    const eligibleLevels = certificationEligibility.filter(
      (level) => level.isEligible
    );
    const highestEligibleLevel =
      eligibleLevels.length > 0
        ? eligibleLevels.reduce((prev, current) =>
            prev.level > current.level ? prev : current
          )
        : null;

    const eligibilityData = {
      userAddress: userAddress,
      totalCompletedChallenges: completedChallenges.length,
      githubUsername,
      certificationLevels: certificationEligibility,
      highestEligibleLevel,
      // For backward compatibility, keep the first level as the default
      isEligible: certificationEligibility[0]?.isEligible || false,
      completedRequiredChallenges:
        certificationEligibility[0]?.completedRequiredChallenges || 0,
      requiredChallenges: certificationEligibility[0]?.requiredChallenges || 0,
      challengeDetails: certificationEligibility[0]?.challengeDetails || [],
    };

    return NextResponse.json(eligibilityData);
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return NextResponse.json(
      { error: "Failed to check eligibility" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Use POST method with userAddress in the body" },
    { status: 405 }
  );
}

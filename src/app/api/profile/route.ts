import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get("address");

    if (!userAddress) {
      return NextResponse.json(
        { error: "User address is required" },
        { status: 400 }
      );
    }

    const { client, db } = await connectToDatabase();

    // Fetch data from all collections in parallel
    const [userData, mintedNFTData, web3BasicsData, coreStylusData] =
      await Promise.all([
        // User collection
        db.collection("users").findOne({ address: userAddress }),

        // Minted NFT collection
        db
          .collection("minted-nft")
          .findOne({ userAddress: userAddress.toLowerCase() }),

        // Web3 Basics challenges collection
        db
          .collection("challenges-web3-basics")
          .findOne({ userAddress: userAddress.toLowerCase() }),

        // Core Stylus challenges collection
        db
          .collection("challenges-core-stylus")
          .findOne({ userAddress: userAddress.toLowerCase() }),
      ]);

    // Calculate user stats
    const totalMinted = mintedNFTData?.totalMinted || 0;
    const completedWeb3Chapters = Array.isArray(
      web3BasicsData?.completedChapters
    )
      ? web3BasicsData.completedChapters.length
      : 0;
    const completedCoreStylusChallenges = Array.isArray(
      coreStylusData?.challenges
    )
      ? coreStylusData.challenges.length
      : 0;

    // Calculate total points (you can adjust this scoring system)
    // New schema-based point calculations
    const web3Points = Array.isArray(web3BasicsData?.completedChapters)
      ? web3BasicsData.completedChapters.reduce(
          (
            sum: number,
            chapter: { id: string; level?: string; points?: number }
          ) => sum + (Number(chapter.points) || 0),
          0
        )
      : 0;

    const coreStylusPoints = Array.isArray(coreStylusData?.challenges)
      ? coreStylusData.challenges.reduce((sum: number, challengeId: string) => {
          const result = coreStylusData?.results?.[challengeId];
          return sum + (Number(result?.points) || 0);
        }, 0)
      : 0;
    const nftPoints = totalMinted * 25; // 25 points per NFT level
    const totalPoints = web3Points + coreStylusPoints;
    // const totalPoints = web3Points + coreStylusPoints + nftPoints;

    // Determine user level based on total points
    let level = "Beginner";
    if (totalPoints >= 200) level = "Advanced";
    else if (totalPoints >= 100) level = "Intermediate";

    // Calculate rank (this would need to be calculated against all users)
    // For now, we'll use a placeholder
    const rank = 1; // This should be calculated based on total points across all users

    // Calculate streak (this would need to be tracked in the database)
    // For now, we'll use a placeholder
    const streak = 0;

    // Build completed challenges array
    type CompletedChallenge = {
      id: string;
      title: string;
      completedOn: string;
      points: number;
      level: string;
      slug: string;
      module: string;
    };
    const completedChallenges: CompletedChallenge[] = [];

    // Add Web3 Basics challenges
    if (Array.isArray(web3BasicsData?.completedChapters)) {
      web3BasicsData.completedChapters.forEach(
        (chapter: { id: string; level?: string; points?: number }) => {
          const chapterId = chapter.id;
          completedChallenges.push({
            id: `web3-${chapterId}`,
            title: `Web3 Basics: ${chapterId
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}`,
            completedOn: web3BasicsData.updatedAt
              ? new Date(web3BasicsData.updatedAt).toLocaleDateString()
              : "Unknown",
            points: Number(chapter.points) || 0,
            level: chapter.level || "Beginner",
            slug: `web3-basics/${chapterId}`,
            module: "web3-basics",
          });
        }
      );
    }

    // Add Core Stylus challenges
    if (Array.isArray(coreStylusData?.challenges)) {
      coreStylusData.challenges.forEach((challengeId: string) => {
        const challengeResult = coreStylusData.results?.[challengeId];
        completedChallenges.push({
          id: `core-${challengeId}`,
          title: challengeId
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          completedOn: challengeResult?.completedAt
            ? new Date(challengeResult.completedAt).toLocaleDateString()
            : "Unknown",
          points: Number(challengeResult?.points) || 0,
          level: challengeResult?.level || "Beginner",
          slug: `challenges/${challengeId}`,
          module: "core-stylus",
        });
      });
    }

    // Build achievements array based on completed milestones
    const achievements = [];

    if (completedChallenges.length >= 1) {
      achievements.push({
        id: 1,
        name: "First Steps",
        description: "Complete your first challenge",
        date: completedChallenges[0]?.completedOn || "Unknown",
        icon: "🏆",
      });
    }

    if (completedChallenges.length >= 3) {
      achievements.push({
        id: 2,
        name: "Quick Learner",
        description: "Complete 3 challenges",
        date: completedChallenges[2]?.completedOn || "Unknown",
        icon: "🚀",
      });
    }

    if (totalMinted >= 1) {
      achievements.push({
        id: 3,
        name: "NFT Collector",
        description: "Mint your first NFT",
        date: mintedNFTData?.lastMintedAt
          ? new Date(mintedNFTData.lastMintedAt).toLocaleDateString()
          : "Unknown",
        icon: "🎨",
      });
    }

    if (totalMinted >= 4) {
      achievements.push({
        id: 4,
        name: "Master Collector",
        description: "Mint all available NFT levels",
        date: mintedNFTData?.lastMintedAt
          ? new Date(mintedNFTData.lastMintedAt).toLocaleDateString()
          : "Unknown",
        icon: "👑",
      });
    }

    // Build in-progress challenges (challenges that are started but not completed)
    type InProgressChallenge = {
      id: string;
      title: string;
      progress: number;
      level: string;
      slug: string;
    };
    const inProgressChallenges: InProgressChallenge[] = [];

    // You can add logic here to determine which challenges are in progress
    // For now, we'll leave this empty as the current data doesn't show partial progress

    // Build profile data
    const profileData = {
      username: userData?.socialHandles?.githubUsername || "Anonymous",
      fullName: userData?.socialHandles?.githubUsername || "Anonymous User",
      email: userData?.isEmailVisible ? "user@example.com" : "Hidden",
      avatar: userData?.socialHandles?.githubUsername
        ? `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.socialHandles.githubUsername}&backgroundColor=c1e5c1`
        : "https://api.dicebear.com/7.x/bottts/svg?seed=anonymous&backgroundColor=c1e5c1",
      joinDate: userData?.createdAt
        ? new Date(userData.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Unknown",
      level,
      points: totalPoints,
      rank,
      streak,
      completedChallenges,
      inProgressChallenges,
      achievements,
      // Additional data for the UI
      totalMinted,
      completedWeb3Chapters,
      completedCoreStylusChallenges,
      mintedNFTs: mintedNFTData?.mintedLevels || [],
      userAddress: userAddress.toLowerCase(),
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}

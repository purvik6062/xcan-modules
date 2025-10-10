import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";

// Module configuration with display names
const MODULE_CONFIG = {
  "challenges-web3-basics": { name: "Web3 Basics", id: "web3-basics" },
  "challenges-stylus-core-concepts": { name: "Stylus Core Concepts", id: "stylus-core-concepts" },
  "challenges-precompiles-overview": { name: "Precompile Playground", id: "precompiles-overview" },
  "challenges-cross-chain": { name: "Cross-Chain Development", id: "cross-chain" },
  "challenges-master-defi": { name: "Master DeFi on Arbitrum", id: "master-defi" },
  "challenges-orbit-chain": { name: "Master Arbitrum Orbit", id: "master-orbit" },
} as const;

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

    const { db } = await connectToDatabase();
    const normalizedAddress = userAddress.toLowerCase();

    // Projection for optimal performance - only fetch needed fields
    const projection = {
      _id: 0,
      chapters: 1,
      completedChapters: 1,
      isCompleted: 1,
      updatedAt: 1,
    };

    // Fetch all module data in parallel for maximum performance
    const [userData, mintedNFTData, ...moduleDataArray] = await Promise.all([
      // User collection
      db.collection("users").findOne(
        { address: userAddress },
        { projection: { _id: 0, address: 1, socialHandles: 1, createdAt: 1, isEmailVisible: 1 } }
      ),

      // Minted NFT collection
      db.collection("minted-nft").findOne(
        { userAddress: normalizedAddress },
        { projection: { _id: 0, totalMinted: 1, mintedLevels: 1, lastMintedAt: 1 } }
      ),

      // All learning module collections
      ...Object.keys(MODULE_CONFIG).map(collectionName =>
        db.collection(collectionName).findOne(
          { userAddress: normalizedAddress },
          { projection }
        )
      ),
    ]);

    // Map module data with collection names for reference
    const collectionNames = Object.keys(MODULE_CONFIG);
    const moduleData = moduleDataArray.map((data, index) => ({
      collectionName: collectionNames[index],
      moduleName: MODULE_CONFIG[collectionNames[index] as keyof typeof MODULE_CONFIG].name,
      moduleId: MODULE_CONFIG[collectionNames[index] as keyof typeof MODULE_CONFIG].id,
      data,
    }));

    // Aggregate statistics efficiently
    let totalChallengesCompleted = 0;
    let totalSectionsCompleted = 0;
    let totalModulesCompleted = 0;
    let totalPoints = 0;

    const completedModules: Array<{ id: string; name: string; completedAt: string }> = [];
    const allCompletedChapters: Array<{
      id: string;
      moduleId: string;
      moduleName: string;
      title: string;
      completedOn: string;
      points: number;
      level: string;
    }> = [];

    // Process each module's data
    moduleData.forEach(({ collectionName, moduleName, moduleId, data }) => {
      if (!data) return;

      console.log(`Processing ${moduleName}:`, {
        completedChaptersCount: data.completedChapters?.length || 0,
        chaptersKeys: data.chapters ? Object.keys(data.chapters) : [],
        isCompleted: data.isCompleted
      });

      // Count completed challenges (chapters) - this should be the completedChapters array length
      if (Array.isArray(data.completedChapters)) {
        totalChallengesCompleted += data.completedChapters.length;

        // Sum points from completed chapters
        data.completedChapters.forEach((chapter: { id?: string; level?: string; points?: number }) => {
          if (!chapter.id) return; // Skip if chapter.id is undefined
          
          const points = Number(chapter.points) || 0;
          totalPoints += points;

          // Add to completed chapters list
          allCompletedChapters.push({
            id: `${moduleId}-${chapter.id}`,
            moduleId,
            moduleName,
            title: chapter.id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            completedOn: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "Unknown",
            points,
            level: chapter.level || "Beginner",
          });
        });
      }

      // Count total sections completed - sum all arrays inside chapters object
      if (data.chapters && typeof data.chapters === 'object') {
        let moduleSections = 0;
        Object.values(data.chapters).forEach((sections) => {
          if (Array.isArray(sections)) {
            moduleSections += sections.length;
            totalSectionsCompleted += sections.length;
          }
        });
        console.log(`${moduleName} sections:`, moduleSections);
      }

      // Check if module is completed
      if (data.isCompleted === true) {
        totalModulesCompleted += 1;
        completedModules.push({
          id: moduleId,
          name: moduleName,
          completedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "Unknown",
        });
      }
    });

    const totalMinted = mintedNFTData?.totalMinted || 0;

    console.log('Final totals:', {
      totalChallengesCompleted,
      totalSectionsCompleted,
      totalModulesCompleted,
      totalPoints,
      totalMinted
    });

    // Determine user level based on total points
    let level = "Beginner";
    if (totalPoints >= 200) level = "Advanced";
    else if (totalPoints >= 100) level = "Intermediate";

    // Sort completed chapters by date (most recent first)
    allCompletedChapters.sort((a, b) => {
      const dateA = new Date(a.completedOn).getTime();
      const dateB = new Date(b.completedOn).getTime();
      return dateB - dateA;
    });

    // Calculate level distribution
    const levelDistribution = allCompletedChapters.reduce((acc, chapter) => {
      acc[chapter.level] = (acc[chapter.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Build profile data with all the requested metrics
    const profileData = {
      // User info
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
      userAddress: normalizedAddress,

      // Core statistics
      level,
      points: totalPoints,
      totalChallengesCompleted,
      totalSectionsCompleted,
      totalModulesCompleted,
      totalMinted,

      // Detailed data
      completedModules,
      completedChallenges: allCompletedChapters,
      levelDistribution,
      mintedNFTs: mintedNFTData?.mintedLevels || [],
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

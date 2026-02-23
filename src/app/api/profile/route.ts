import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import { getAllModuleData } from "@/lib/database/module-collections";
import { addressMatchQuery } from "@/lib/utils/address";

// Module configuration with display names and IDs
const MODULE_CONFIG = {
  "web3-basics": { name: "Web3 Basics", id: "web3-basics" },
  "stylus-core-concepts": { name: "Stylus Core Concepts", id: "stylus-core-concepts" },
  "precompiles-overview": { name: "Precompile Playground", id: "precompiles-overview" },
  "cross-chain": { name: "Cross-Chain Development", id: "cross-chain" },
  "master-defi": { name: "Master DeFi on Arbitrum", id: "master-defi" },
  "master-orbit": { name: "Master Arbitrum Orbit", id: "master-orbit" },
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

    // Fetch all data in parallel for maximum performance
    const [userData, mintedNFTData, allModulesData] = await Promise.all([
      // User collection - case-insensitive address match
      db.collection("users").findOne(
        { address: addressMatchQuery(userAddress) },
        { projection: { _id: 0, address: 1, socialHandles: 1, createdAt: 1, isEmailVisible: 1 } }
      ),

      // Minted NFT collection - case-insensitive address match
      db.collection("minted-nft").findOne(
        { userAddress: addressMatchQuery(userAddress) },
        { projection: { _id: 0, totalMinted: 1, mintedLevels: 1, lastMintedAt: 1 } }
      ),

      // All learning module data - case-insensitive address match
      getAllModuleData(db, userAddress),
    ]);

    // Process module data
    const moduleData = Object.entries(allModulesData).map(([moduleId, data]) => {
      const moduleConfig = MODULE_CONFIG[moduleId as keyof typeof MODULE_CONFIG];
      return {
        moduleId,
        moduleName: moduleConfig?.name || moduleId,
        data,
      };
    });

    // Aggregate statistics - allCompletedChapters is the single source of truth
    let totalSectionsCompleted = 0;
    let totalModulesCompleted = 0;

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

    // Helper to normalize chapter to { id, level, points } (handles both string and object formats)
    const normalizeChapter = (chapter: string | { id?: string; level?: string; points?: number }) => {
      if (typeof chapter === "string") {
        return { id: chapter, level: "Beginner" as const, points: 0 };
      }
      return {
        id: chapter.id ?? "",
        level: chapter.level || "Beginner",
        points: Number(chapter.points) || 0,
      };
    };

    // Process each module's data
    moduleData.forEach(({ moduleId, moduleName, data }) => {
      if (!data) return;

      console.log(`Processing ${moduleName}:`, {
        completedChaptersCount: data.completedChapters?.length || 0,
        chaptersKeys: data.chapters ? Object.keys(data.chapters) : [],
        isCompleted: data.isCompleted
      });

      // Process completedChapters (handles both string and object formats)
      if (Array.isArray(data.completedChapters)) {
        data.completedChapters.forEach((chapter: string | { id?: string; level?: string; points?: number }) => {
          const { id, level, points } = normalizeChapter(chapter);
          if (!id) return;

          allCompletedChapters.push({
            id: `${moduleId}-${id}`,
            moduleId,
            moduleName,
            title: id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            completedOn: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "Unknown",
            points,
            level,
          });
        });
      }

      // Process challenges/results (e.g. precompiles-overview uses this structure)
      const challenges = data.challenges;
      const results = data.results;
      if (Array.isArray(challenges) && results && typeof results === "object") {
        challenges.forEach((challengeId: string) => {
          const result = results[challengeId];
          const points = result ? Number(result.points) || 0 : 0;
          const level = result?.level || "Beginner";
          const rawCompletedAt = result?.completedAt;
          const completedAt = rawCompletedAt
            ? (() => {
                const dateStr =
                  typeof rawCompletedAt === "string"
                    ? rawCompletedAt
                    : (rawCompletedAt as { $date?: string })?.$date;
                return dateStr
                  ? new Date(dateStr).toLocaleDateString()
                  : new Date(rawCompletedAt as Date).toLocaleDateString();
              })()
            : data.updatedAt
              ? new Date(data.updatedAt).toLocaleDateString()
              : "Unknown";

          allCompletedChapters.push({
            id: `${moduleId}-${challengeId}`,
            moduleId,
            moduleName,
            title: challengeId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            completedOn: completedAt,
            points,
            level,
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

    // Collect minted NFTs from user-modules certifications (claimed certs with mintedAt)
    const userModulesNFTs: Array<{
      level: number;
      levelKey: string;
      levelName: string;
      transactionHash: string;
      metadataUrl: string;
      imageUrl: string;
      mintedAt: string;
      network: string;
    }> = [];

    moduleData.forEach(({ moduleId, moduleName, data }) => {
      const certs = data?.certification;
      if (!Array.isArray(certs)) return;
      certs
        .filter((c: any) => c?.claimed === true || c?.mintedAt != null)
        .forEach((c: any) => {
          const mintedAt = c?.mintedAt;
          const mintedAtStr =
            typeof mintedAt === "string"
              ? mintedAt
              : mintedAt?.$date
                ? String(mintedAt.$date)
                : mintedAt
                  ? new Date(mintedAt).toISOString()
                  : new Date().toISOString();
          userModulesNFTs.push({
            level: c?.level ?? 0,
            levelKey: moduleId,
            levelName: c?.levelName ?? moduleName,
            transactionHash: c?.transactionHash ?? "",
            metadataUrl: c?.metadataUrl ?? "",
            imageUrl: c?.imageUrl ?? "",
            mintedAt: mintedAtStr,
            network: "arbitrum-sepolia",
          });
        });
    });

    const userModulesMintedCount = userModulesNFTs.length;

    // Combine: minted-nft collection count + user-modules certification count
    const totalMinted =
      (mintedNFTData?.totalMinted || 0) + userModulesMintedCount;

    // Single source of truth: derive totals from allCompletedChapters
    const totalChallengesCompleted = allCompletedChapters.length;
    const totalPoints = allCompletedChapters.reduce((sum, c) => sum + c.points, 0);

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
        ? `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(userData.socialHandles.githubUsername)}&backgroundColor=c1e5c1&size=128`
        : "https://api.dicebear.com/7.x/bottts/png?seed=anonymous&backgroundColor=c1e5c1&size=128",
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
      mintedNFTs: [
        ...(mintedNFTData?.mintedLevels || []).map((nft: any) => ({
          ...nft,
          mintedAt:
            typeof nft.mintedAt === "string"
              ? nft.mintedAt
              : nft.mintedAt?.$date
                ? String(nft.mintedAt.$date)
                : nft.mintedAt
                  ? new Date(nft.mintedAt).toISOString()
                  : "",
        })),
        ...userModulesNFTs,
      ].sort(
        (a, b) =>
          new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime()
      ),
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

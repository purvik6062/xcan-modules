import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/database/mongodb";
import {
  ModuleId,
  normalizeModuleId,
} from "../../../lib/database/module-collections";

// Module configuration with display names
const MODULE_CONFIG: Record<string, { name: string; id: string }> = {
  "web3-basics": { name: "Web3 Basics", id: "web3-basics" },
  "stylus-core-concepts": {
    name: "Stylus Core Concepts",
    id: "stylus-core-concepts",
  },
  "precompiles-overview": {
    name: "Precompile Playground",
    id: "precompiles-overview",
  },
  "cross-chain": { name: "Cross-Chain Development", id: "cross-chain" },
  "master-defi": { name: "Master DeFi on Arbitrum", id: "master-defi" },
  "master-orbit": { name: "Master Arbitrum Orbit", id: "master-orbit" },
  "stylus-foundation": { name: "Stylus Foundation", id: "stylus-foundation" },
};

const ALL_MODULE_IDS: ModuleId[] = [
  "web3-basics",
  "stylus-core-concepts",
  "precompiles-overview",
  "cross-chain",
  "master-defi",
  "master-orbit",
];

interface FoundationSubmission {
  walletAddress: string;
  githubRepo?: string;
  contractAddress?: string;
  moduleId: "stylus-foundation";
  transactionHash?: string;
}

interface ModuleSubmission {
  walletAddress: string;
  moduleId: ModuleId;
  moduleName: string;
  isCompleted: boolean;
  transactionHash?: string;
  completedChaptersCount?: number;
  totalPoints?: number;
  certificationLevel?: string;
  certificationLevelName?: string;
  updatedAt?: string;
}

interface UserModuleCount {
  walletAddress: string;
  moduleCount: number;
  modules: string[];
}

interface ModuleUserCount {
  moduleId: string;
  moduleName: string;
  userCount: number;
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("module");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 30;
    const skip = (page - 1) * limit;

    // Fetch foundation-users submissions with optimized projection including certification
    const foundationSubmissions = await db
      .collection("foundation-users")
      .find(
        {},
        {
          projection: {
            walletAddress: 1,
            githubRepo: 1,
            contractAddress: 1,
            certification: 1,
            _id: 0,
          },
        }
      )
      .toArray();

    // Transform foundation submissions - only include completed ones
    const foundationData: FoundationSubmission[] = foundationSubmissions
      .map((user: any) => {
        // Foundation users are considered completed if they exist
        const certification = Array.isArray(user.certification)
          ? user.certification[0]
          : user.certification;
        const transactionHash = certification?.transactionHash;

        return {
          walletAddress: user.walletAddress?.toLowerCase() || "",
          githubRepo: user.githubRepo,
          contractAddress: user.contractAddress,
          moduleId: "stylus-foundation" as const,
          transactionHash,
        };
      })
      .filter((s) => s.walletAddress); // Only include valid submissions

    // Fetch user-modules submissions with optimized projection
    // Only fetch userAddress and modules data
    const userModulesDocs = await db
      .collection("user-modules")
      .find(
        {},
        {
          projection: {
            userAddress: 1,
            modules: 1,
            updatedAt: 1,
            _id: 0,
          },
        }
      )
      .toArray();

    // Transform user-modules submissions - only include completed modules
    const moduleSubmissions: ModuleSubmission[] = [];
    const userModuleCountsMap = new Map<
      string,
      { count: number; modules: string[] }
    >();

    userModulesDocs.forEach((doc: any) => {
      const userAddress = (doc.userAddress || "").toLowerCase();
      const modules = doc.modules || {};
      const userModules: string[] = [];

      // Process each module for this user
      ALL_MODULE_IDS.forEach((moduleId) => {
        const moduleData = modules[moduleId];
        // Only include completed modules
        if (moduleData && moduleData.isCompleted === true) {
          const moduleConfig = MODULE_CONFIG[moduleId];
          const moduleName = moduleConfig?.name || moduleId;

          // Get transaction hash and certification details
          const certification = Array.isArray(moduleData.certification)
            ? moduleData.certification.find((c: any) => c.claimed === true) ||
              moduleData.certification[0]
            : moduleData.certification;
          const transactionHash = certification?.transactionHash;
          const certificationLevel = certification?.level;
          const certificationLevelName = certification?.levelName;

          // Calculate completed chapters count
          const completedChaptersCount = Array.isArray(
            moduleData.completedChapters
          )
            ? moduleData.completedChapters.length
            : 0;

          // Calculate total points from completed chapters
          const totalPoints = Array.isArray(moduleData.completedChapters)
            ? moduleData.completedChapters.reduce(
                (sum: number, chapter: any) => {
                  return sum + (Number(chapter.points) || 0);
                },
                0
              )
            : 0;

          moduleSubmissions.push({
            walletAddress: userAddress,
            moduleId,
            moduleName,
            isCompleted: true,
            transactionHash,
            completedChaptersCount,
            totalPoints,
            certificationLevel,
            certificationLevelName,
            updatedAt: moduleData.updatedAt || doc.updatedAt,
          });

          userModules.push(moduleId);
        }
      });

      // Track module count per user (only completed)
      if (userModules.length > 0) {
        userModuleCountsMap.set(userAddress, {
          count: userModules.length,
          modules: userModules,
        });
      }
    });

    // Calculate module counts per user (including foundation)
    const allUserModuleCounts: UserModuleCount[] = [];
    const processedUsers = new Set<string>();

    // Add foundation users
    foundationData.forEach((submission) => {
      const address = submission.walletAddress.toLowerCase();
      if (!processedUsers.has(address)) {
        const existing = userModuleCountsMap.get(address) || {
          count: 0,
          modules: [],
        };
        allUserModuleCounts.push({
          walletAddress: address,
          moduleCount: existing.count + 1,
          modules: [...existing.modules, "stylus-foundation"],
        });
        processedUsers.add(address);
      }
    });

    // Add user-modules users
    userModuleCountsMap.forEach((data, address) => {
      if (!processedUsers.has(address)) {
        allUserModuleCounts.push({
          walletAddress: address,
          moduleCount: data.count,
          modules: data.modules,
        });
        processedUsers.add(address);
      }
    });

    // Calculate user count per module using aggregation for efficiency (only completed)
    const moduleUserCounts: ModuleUserCount[] = [];

    // Count foundation users (all are considered completed)
    const foundationCount = foundationData.length;
    moduleUserCounts.push({
      moduleId: "stylus-foundation",
      moduleName:
        MODULE_CONFIG["stylus-foundation"]?.name || "Stylus Foundation",
      userCount: foundationCount,
    });

    // Count users per module from user-modules collection (only completed)
    for (const moduleId of ALL_MODULE_IDS) {
      const count = await db.collection("user-modules").countDocuments({
        [`modules.${moduleId}.isCompleted`]: true,
      });

      moduleUserCounts.push({
        moduleId,
        moduleName: MODULE_CONFIG[moduleId]?.name || moduleId,
        userCount: count,
      });
    }

    // Combine all submissions
    const allSubmissions = [
      ...foundationData.map((s) => ({
        ...s,
        type: "foundation" as const,
      })),
      ...moduleSubmissions.map((s) => ({
        ...s,
        type: "module" as const,
      })),
    ];

    // Filter by module if specified
    let filteredSubmissions = allSubmissions;
    if (moduleId && moduleId !== "all") {
      filteredSubmissions = allSubmissions.filter(
        (s) => s.moduleId === moduleId
      );
    }

    // Apply pagination
    const totalCount = filteredSubmissions.length;
    const paginatedSubmissions = filteredSubmissions.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalCount / limit);

    // Group submissions by module
    const submissionsByModule: Record<string, any[]> = {};
    allSubmissions.forEach((submission) => {
      const modId = submission.moduleId;
      if (!submissionsByModule[modId]) {
        submissionsByModule[modId] = [];
      }
      submissionsByModule[modId].push(submission);
    });

    return NextResponse.json({
      success: true,
      submissions: paginatedSubmissions,
      submissionsByModule,
      totalSubmissions: totalCount,
      uniqueUsers: processedUsers.size,
      userModuleCounts: allUserModuleCounts.sort(
        (a, b) => b.moduleCount - a.moduleCount
      ),
      moduleUserCounts: moduleUserCounts.sort(
        (a, b) => b.userCount - a.userCount
      ),
      pagination: {
        page,
        limit,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      stats: {
        totalFoundationSubmissions: foundationData.length,
        totalModuleSubmissions: moduleSubmissions.length,
        averageModulesPerUser:
          allUserModuleCounts.length > 0
            ? allUserModuleCounts.reduce((sum, u) => sum + u.moduleCount, 0) /
              allUserModuleCounts.length
            : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching submissions data:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions data" },
      { status: 500 }
    );
  }
}

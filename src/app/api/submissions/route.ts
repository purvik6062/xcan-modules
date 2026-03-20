import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/database/mongodb";
import { db as pgDb } from "../../../lib/database/client";
import { userChallenges } from "../../../lib/database/schema";
import { eq } from "drizzle-orm";
import type { ModuleId } from "../../../lib/database/module-collections";

// ─── Module configuration ────────────────────────────────────────────────────
const MODULE_CONFIG: Record<string, { name: string; id: string }> = {
  "web3-basics": { name: "Web3 & Rust Foundations", id: "web3-basics" },
  "stylus-core-concepts": { name: "Stylus Core Concepts", id: "stylus-core-concepts" },
  "precompiles-overview": { name: "Precompile Playground", id: "precompiles-overview" },
  "cross-chain": { name: "Cross-Chain Development", id: "cross-chain" },
  "master-defi": { name: "Master DeFi on Arbitrum", id: "master-defi" },
  "master-orbit": { name: "Master Arbitrum Orbit", id: "master-orbit" },
  "stylus-foundation": { name: "Stylus Foundation", id: "stylus-foundation" },
  "xcan-advocate": { name: "Xcan Advocate", id: "xcan-advocate" },
  "arbitrum-stylus": { name: "Arbitrum Stylus", id: "arbitrum-stylus" },
};

const ALL_MODULE_IDS: ModuleId[] = [
  "web3-basics",
  "stylus-core-concepts",
  "precompiles-overview",
  "cross-chain",
  "master-defi",
  "master-orbit",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const now = () => performance.now();

// ─── Types ───────────────────────────────────────────────────────────────────
interface FoundationSubmission {
  walletAddress: string;
  githubRepo?: string;
  contractAddress?: string;
  moduleId: "stylus-foundation";
  transactionHash?: string;
}

interface AdvocateSubmission {
  walletAddress: string;
  moduleId: "xcan-advocate";
  isEligible?: boolean;
  transactionHash?: string;
  certificationLevel?: string;
  certificationLevelName?: string;
}

interface ModuleSubmission {
  walletAddress: string;
  moduleId: ModuleId | "arbitrum-stylus";
  moduleName: string;
  isCompleted: boolean;
  transactionHash?: string;
  completedChaptersCount?: number;
  totalPoints?: number;
  certificationLevel?: string;
  certificationLevelName?: string;
  updatedAt?: string;
  githubRepo?: string;
  contractAddress?: string;
  completedChallenges?: string[];
  nftTransactionHashes?: Array<{
    transactionHash: string;
    levelName?: string;
    level?: number;
    mintedAt?: Date;
  }>;
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

// ─── GET handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const timings: Record<string, number> = {};
  const t0 = now();

  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("module");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 30;
    const skip = (page - 1) * limit;

    // ── 1. Connect to DB ──────────────────────────────────────────────────
    const tDb0 = now();
    const { db } = await connectToDatabase();
    timings["db_connect_ms"] = Math.round(now() - tDb0);

    // ── 2. Parallel DB fetches with targeted projections ──────────────────
    const tFetch0 = now();

    // Build a tight projection for user-modules: only fetch fields we need
    // We need: isCompleted, certification, completedChapters (for count & points), updatedAt
    // We do NOT need: chapters (huge arrays of section strings)
    const umProjection: Record<string, 0 | 1> = { _id: 0, userAddress: 1, updatedAt: 1 };
    for (const mid of ALL_MODULE_IDS) {
      umProjection[`modules.${mid}.isCompleted`] = 1;
      umProjection[`modules.${mid}.certification`] = 1;
      umProjection[`modules.${mid}.completedChapters`] = 1;
      umProjection[`modules.${mid}.updatedAt`] = 1;
    }

    const [
      foundationSubmissions,
      advocatesSubmissions,
      userModulesDocs,
      arbitrumStylusSubmissions,
      mintedNFTs,
    ] = await Promise.all([
      // Foundation users — only need walletAddress, githubRepo, contractAddress, certification
      db.collection("foundation-users")
        .find({}, {
          projection: {
            walletAddress: 1, githubRepo: 1, contractAddress: 1, certification: 1, _id: 0,
          },
        })
        .toArray(),

      // Advocates — only eligible ones
      db.collection("advocates")
        .find({ isEligible: true }, {
          projection: {
            userAddress: 1, isEligible: 1, certification: 1, _id: 0,
          },
        })
        .toArray(),

      // User-modules — with tight projection (no chapters arrays)
      db.collection("user-modules")
        .find({}, { projection: umProjection })
        .toArray(),

      // Arbitrum Stylus from PostgreSQL (with error handling)
      (async () => {
        try {
          return await pgDb
            .select({
              userAddress: userChallenges.userAddress,
              challengeId: userChallenges.challengeId,
              githubRepoUrl: userChallenges.githubRepoUrl,
              deployedContractAddress: userChallenges.deployedContractAddress,
              submittedAt: userChallenges.submittedAt,
            })
            .from(userChallenges)
            .where(eq(userChallenges.reviewAction, "ACCEPTED"));
        } catch (error) {
          console.error("[Submissions API] PostgreSQL error:", error);
          return [];
        }
      })(),

      // Minted NFTs
      db.collection("minted-nft")
        .find({}, { projection: { userAddress: 1, mintedLevels: 1, _id: 0 } })
        .toArray(),
    ]);

    timings["db_fetch_ms"] = Math.round(now() - tFetch0);

    // ── 3. Process all data (single-pass where possible) ──────────────────
    const tProc0 = now();

    // ── 3a. Foundation submissions ──
    const foundationData: FoundationSubmission[] = [];
    let foundationNFTCount = 0;

    for (let i = 0; i < foundationSubmissions.length; i++) {
      const user: any = foundationSubmissions[i];
      const wallet = (user.walletAddress || "").toLowerCase();
      if (!wallet) continue;

      const cert = Array.isArray(user.certification) ? user.certification[0] : user.certification;
      foundationData.push({
        walletAddress: wallet,
        githubRepo: user.githubRepo,
        contractAddress: user.contractAddress,
        moduleId: "stylus-foundation",
        transactionHash: cert?.transactionHash,
      });

      // Count NFTs in same pass
      if (Array.isArray(user.certification)) {
        for (let j = 0; j < user.certification.length; j++) {
          if (user.certification[j]?.claimed === true) foundationNFTCount++;
        }
      } else if (user.certification?.claimed === true) {
        foundationNFTCount++;
      }
    }

    // ── 3b. Advocates submissions ──
    const advocatesData: AdvocateSubmission[] = [];
    let advocateNFTCount = 0;

    for (let i = 0; i < advocatesSubmissions.length; i++) {
      const adv: any = advocatesSubmissions[i];
      const wallet = (adv.userAddress || "").toLowerCase();
      if (!wallet || !adv.isEligible) continue;

      const cert = Array.isArray(adv.certification)
        ? (adv.certification.find((c: any) => c.claimed === true) || adv.certification[0])
        : adv.certification;

      advocatesData.push({
        walletAddress: wallet,
        moduleId: "xcan-advocate",
        isEligible: true,
        transactionHash: cert?.transactionHash,
        certificationLevel: cert?.level,
        certificationLevelName: cert?.levelName,
      });

      // Count NFTs in same pass
      if (Array.isArray(adv.certification)) {
        for (let j = 0; j < adv.certification.length; j++) {
          if (adv.certification[j]?.claimed === true) advocateNFTCount++;
        }
      } else if (adv.certification?.claimed === true) {
        advocateNFTCount++;
      }
    }

    // ── 3c. Arbitrum Stylus — group by user (single pass) ──
    // Build a Map: address → { challenges, githubRepo, contractAddress, latestSubmittedAt }
    const arbUsersMap = new Map<string, {
      challenges: any[];
      githubRepo?: string;
      contractAddress?: string;
      latestSubmittedAt?: Date;
    }>();

    for (let i = 0; i < arbitrumStylusSubmissions.length; i++) {
      const sub: any = arbitrumStylusSubmissions[i];
      const addr = (sub.userAddress || "").toLowerCase();
      if (!addr) continue;

      let entry = arbUsersMap.get(addr);
      if (!entry) {
        entry = { challenges: [] };
        arbUsersMap.set(addr, entry);
      }
      entry.challenges.push(sub);
      if (sub.githubRepoUrl && !entry.githubRepo) entry.githubRepo = sub.githubRepoUrl;
      if (sub.deployedContractAddress && !entry.contractAddress) entry.contractAddress = sub.deployedContractAddress;
      if (sub.submittedAt) {
        const d = new Date(sub.submittedAt);
        if (!entry.latestSubmittedAt || d > entry.latestSubmittedAt) entry.latestSubmittedAt = d;
      }
    }

    // Build an index of minted NFTs by address for O(1) lookup (replaces O(n) .find())
    const mintedNFTByAddress = new Map<string, any>();
    let mintedNFTCount = 0;
    for (let i = 0; i < mintedNFTs.length; i++) {
      const nft: any = mintedNFTs[i];
      const addr = (nft.userAddress || "").toLowerCase();
      if (addr) mintedNFTByAddress.set(addr, nft);
      if (Array.isArray(nft.mintedLevels)) mintedNFTCount += nft.mintedLevels.length;
    }

    // Build Arbitrum Stylus submissions
    const arbitrumStylusData: ModuleSubmission[] = [];
    let arbitrumStylusChallengeCompletions = 0;

    arbUsersMap.forEach((data, userAddress) => {
      // O(1) lookup instead of O(n) scan
      const mintedNFT = mintedNFTByAddress.get(userAddress);

      const nftTransactionHashes = mintedNFT?.mintedLevels
        ?.filter((level: any) => level.transactionHash)
        ?.map((level: any) => ({
          transactionHash: level.transactionHash,
          levelName: level.levelName,
          level: level.level,
          mintedAt: level.mintedAt,
        })) || [];

      // Unique challenge IDs — use Set for O(1) dedup
      const uniqueChallenges = new Set<string>();
      for (let i = 0; i < data.challenges.length; i++) {
        uniqueChallenges.add(String(data.challenges[i].challengeId));
      }

      arbitrumStylusChallengeCompletions += data.challenges.length;

      arbitrumStylusData.push({
        walletAddress: userAddress,
        moduleId: "arbitrum-stylus",
        moduleName: MODULE_CONFIG["arbitrum-stylus"]?.name || "Arbitrum Stylus",
        isCompleted: true,
        transactionHash: nftTransactionHashes[0]?.transactionHash,
        completedChaptersCount: data.challenges.length,
        updatedAt: data.latestSubmittedAt?.toISOString(),
        githubRepo: data.githubRepo,
        contractAddress: data.contractAddress,
        completedChallenges: Array.from(uniqueChallenges),
        nftTransactionHashes,
        certificationLevel: "arbitrum-stylus",
        certificationLevelName: "Arbitrum Stylus",
      });
    });

    // ── 3d. User-modules — single pass ──
    const moduleSubmissions: ModuleSubmission[] = [];
    // Per-user module tracking (Map for O(1) merge)
    const userModuleCountsMap = new Map<string, { count: number; modules: string[] }>();
    // Per-module user counts (computed in-memory instead of 6 separate countDocuments queries)
    const moduleUserCountMap = new Map<string, number>();
    let userModuleNFTCount = 0;

    for (let i = 0; i < userModulesDocs.length; i++) {
      const doc: any = userModulesDocs[i];
      const userAddress = (doc.userAddress || "").toLowerCase();
      const modules = doc.modules || {};
      const userModules: string[] = [];

      for (let j = 0; j < ALL_MODULE_IDS.length; j++) {
        const modId = ALL_MODULE_IDS[j];
        const moduleData = modules[modId];
        if (!moduleData || moduleData.isCompleted !== true) continue;

        const moduleConfig = MODULE_CONFIG[modId];
        const moduleName = moduleConfig?.name || modId;

        // Get certification (find claimed first, fallback to first)
        const cert = Array.isArray(moduleData.certification)
          ? (moduleData.certification.find((c: any) => c.claimed === true) || moduleData.certification[0])
          : moduleData.certification;

        // Count chapters and points in a single loop
        let completedChaptersCount = 0;
        let totalPoints = 0;
        if (Array.isArray(moduleData.completedChapters)) {
          completedChaptersCount = moduleData.completedChapters.length;
          for (let k = 0; k < moduleData.completedChapters.length; k++) {
            totalPoints += Number(moduleData.completedChapters[k]?.points) || 0;
          }
        }

        moduleSubmissions.push({
          walletAddress: userAddress,
          moduleId: modId,
          moduleName,
          isCompleted: true,
          transactionHash: cert?.transactionHash,
          completedChaptersCount,
          totalPoints,
          certificationLevel: cert?.level,
          certificationLevelName: cert?.levelName,
          updatedAt: moduleData.updatedAt || doc.updatedAt,
        });

        userModules.push(modId);

        // Increment per-module user count (replaces 6 countDocuments queries)
        moduleUserCountMap.set(modId, (moduleUserCountMap.get(modId) || 0) + 1);

        // Count NFTs in same pass
        if (Array.isArray(moduleData.certification)) {
          for (let k = 0; k < moduleData.certification.length; k++) {
            if (moduleData.certification[k]?.claimed === true) userModuleNFTCount++;
          }
        } else if (moduleData.certification?.claimed === true) {
          userModuleNFTCount++;
        }
      }

      if (userModules.length > 0) {
        userModuleCountsMap.set(userAddress, { count: userModules.length, modules: userModules });
      }
    }

    // ── 3e. Build per-user module counts (merge all sources with Map) ──
    // Use a single Map for O(1) lookups instead of repeated .find() scans
    const mergedUserMap = new Map<string, { count: number; modules: string[] }>();

    // Seed from user-modules data
    userModuleCountsMap.forEach((data, addr) => {
      mergedUserMap.set(addr, { count: data.count, modules: [...data.modules] });
    });

    // Merge foundation users
    for (let i = 0; i < foundationData.length; i++) {
      const addr = foundationData[i].walletAddress;
      const entry = mergedUserMap.get(addr);
      if (entry) {
        if (!entry.modules.includes("stylus-foundation")) {
          entry.count++;
          entry.modules.push("stylus-foundation");
        }
      } else {
        mergedUserMap.set(addr, { count: 1, modules: ["stylus-foundation"] });
      }
    }

    // Merge advocates
    for (let i = 0; i < advocatesData.length; i++) {
      const addr = advocatesData[i].walletAddress;
      const entry = mergedUserMap.get(addr);
      if (entry) {
        if (!entry.modules.includes("xcan-advocate")) {
          entry.count++;
          entry.modules.push("xcan-advocate");
        }
      } else {
        mergedUserMap.set(addr, { count: 1, modules: ["xcan-advocate"] });
      }
    }

    // Merge Arbitrum Stylus users
    arbitrumStylusData.forEach((sub) => {
      const addr = sub.walletAddress;
      const entry = mergedUserMap.get(addr);
      if (entry) {
        if (!entry.modules.includes("arbitrum-stylus")) {
          entry.count++;
          entry.modules.push("arbitrum-stylus");
        }
      } else {
        mergedUserMap.set(addr, { count: 1, modules: ["arbitrum-stylus"] });
      }
    });

    // Convert merged map to sorted array
    const allUserModuleCounts: UserModuleCount[] = [];
    mergedUserMap.forEach((data, addr) => {
      allUserModuleCounts.push({ walletAddress: addr, moduleCount: data.count, modules: data.modules });
    });
    allUserModuleCounts.sort((a, b) => b.moduleCount - a.moduleCount);

    // ── 3f. Build per-module user counts (from in-memory data, no extra DB queries) ──
    const moduleUserCounts: ModuleUserCount[] = [];

    // Foundation
    moduleUserCounts.push({
      moduleId: "stylus-foundation",
      moduleName: MODULE_CONFIG["stylus-foundation"]?.name || "Stylus Foundation",
      userCount: foundationData.length,
    });

    // Learning modules — from the counter map (replaces 6 countDocuments queries)
    for (let i = 0; i < ALL_MODULE_IDS.length; i++) {
      const modId = ALL_MODULE_IDS[i];
      moduleUserCounts.push({
        moduleId: modId,
        moduleName: MODULE_CONFIG[modId]?.name || modId,
        userCount: moduleUserCountMap.get(modId) || 0,
      });
    }

    // Advocates
    moduleUserCounts.push({
      moduleId: "xcan-advocate",
      moduleName: MODULE_CONFIG["xcan-advocate"]?.name || "Xcan Advocate",
      userCount: advocatesData.length,
    });

    // Arbitrum Stylus
    moduleUserCounts.push({
      moduleId: "arbitrum-stylus",
      moduleName: MODULE_CONFIG["arbitrum-stylus"]?.name || "Arbitrum Stylus",
      userCount: arbitrumStylusData.length,
    });

    moduleUserCounts.sort((a, b) => b.userCount - a.userCount);

    // ── 3g. Total NFTs minted ──
    const totalNFTsMinted = mintedNFTCount + foundationNFTCount + advocateNFTCount + userModuleNFTCount;

    // ── 3h. Combine all submissions ──
    const allSubmissions: Array<
      (FoundationSubmission & { type: "foundation" }) |
      (AdvocateSubmission & { type: "advocate" }) |
      (ModuleSubmission & { type: "module" })
    > = [];

    for (let i = 0; i < foundationData.length; i++) {
      allSubmissions.push({ ...foundationData[i], type: "foundation" });
    }
    for (let i = 0; i < advocatesData.length; i++) {
      allSubmissions.push({ ...advocatesData[i], type: "advocate" });
    }
    for (let i = 0; i < moduleSubmissions.length; i++) {
      allSubmissions.push({ ...moduleSubmissions[i], type: "module" });
    }
    for (let i = 0; i < arbitrumStylusData.length; i++) {
      allSubmissions.push({ ...arbitrumStylusData[i], type: "module" });
    }

    // ── 3i. Filter & paginate ──
    let filteredSubmissions = allSubmissions;
    if (moduleId && moduleId !== "all") {
      filteredSubmissions = allSubmissions.filter((s) => s.moduleId === moduleId);
    }

    const totalCount = filteredSubmissions.length;
    const paginatedSubmissions = filteredSubmissions.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalCount / limit);

    // ── Total modules completed ──
    const totalModulesCompleted =
      foundationData.length + moduleSubmissions.length + arbitrumStylusChallengeCompletions;

    timings["processing_ms"] = Math.round(now() - tProc0);

    // ── 4. Build response ──
    const totalMs = Math.round(now() - t0);
    timings["total_ms"] = totalMs;

    console.log(
      `[Submissions API] total=${totalMs}ms | connect=${timings.db_connect_ms}ms | fetch=${timings.db_fetch_ms}ms | processing=${timings.processing_ms}ms | submissions=${allSubmissions.length} | users=${mergedUserMap.size}`
    );

    const response = NextResponse.json({
      success: true,
      submissions: paginatedSubmissions,
      totalSubmissions: totalModulesCompleted,
      uniqueUsers: mergedUserMap.size,
      userModuleCounts: allUserModuleCounts,
      moduleUserCounts,
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
        totalAdvocatesSubmissions: advocatesData.length,
        totalModuleSubmissions: moduleSubmissions.length,
        totalArbitrumStylusSubmissions: arbitrumStylusData.length,
        totalNFTsMinted,
        nftBreakdown: {
          mintedNFTCollection: mintedNFTCount,
          foundationUsers: foundationNFTCount,
          advocates: advocateNFTCount,
          userModules: userModuleNFTCount,
        },
        averageModulesPerUser:
          allUserModuleCounts.length > 0
            ? allUserModuleCounts.reduce((sum, u) => sum + u.moduleCount, 0) / allUserModuleCounts.length
            : 0,
      },
    });
    response.headers.set("Server-Timing",
      `db_connect;dur=${timings.db_connect_ms}, db_fetch;dur=${timings.db_fetch_ms}, processing;dur=${timings.processing_ms}, total;dur=${totalMs}`
    );

    return response;
  } catch (error) {
    const totalMs = Math.round(now() - t0);
    console.error(`[Submissions API] ERROR after ${totalMs}ms:`, error);
    return NextResponse.json(
      { error: "Failed to fetch submissions data" },
      { status: 500 }
    );
  }
}

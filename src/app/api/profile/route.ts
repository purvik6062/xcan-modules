import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import { addressMatchQuery } from "@/lib/utils/address";

// ─── Module configuration ────────────────────────────────────────────────────
const MODULE_CONFIG: Record<string, { name: string; id: string }> = {
  "web3-basics": { name: "Web3 & Rust Foundations", id: "web3-basics" },
  "stylus-core-concepts": { name: "Stylus Core Concepts", id: "stylus-core-concepts" },
  "precompiles-overview": { name: "Precompile Playground", id: "precompiles-overview" },
  "cross-chain": { name: "Cross-Chain Development", id: "cross-chain" },
  "master-defi": { name: "Master DeFi on Arbitrum", id: "master-defi" },
  "master-orbit": { name: "Master Arbitrum Orbit", id: "master-orbit" },
};

const MODULE_IDS = Object.keys(MODULE_CONFIG);

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** High-resolution timer (ms) */
const now = () => performance.now();

/** Format a BSON / string / Date into locale date string */
function toDateString(value: unknown): string {
  if (!value) return "Unknown";
  if (typeof value === "string") return new Date(value).toLocaleDateString();
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "object" && value !== null && "$date" in value) {
    return new Date((value as { $date: string }).$date).toLocaleDateString();
  }
  return new Date(value as any).toLocaleDateString();
}

/** Format a BSON / string / Date into ISO string */
function toISOString(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value !== null && "$date" in value) {
    return String((value as { $date: string }).$date);
  }
  return new Date(value as any).toISOString();
}

// ─── GET handler ─────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const timings: Record<string, number> = {};
  const t0 = now();

  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get("address");

    if (!userAddress) {
      return NextResponse.json({ error: "User address is required" }, { status: 400 });
    }

    // ── 1. Connect to DB ──────────────────────────────────────────────────
    const tDb0 = now();
    const { db } = await connectToDatabase();
    timings["db_connect_ms"] = Math.round(now() - tDb0);

    const addressQuery = addressMatchQuery(userAddress);

    // ── 2. Parallel DB fetches (only project what we need) ────────────────
    const tFetch0 = now();

    // Build the projection for user-modules: only the fields we actually use
    // We need: completedChapters, isCompleted, updatedAt, certification,
    //          challenges, results, and chapters (for section-count only)
    const moduleProjection: Record<string, 0 | 1> = { _id: 0 };
    for (const mid of MODULE_IDS) {
      moduleProjection[`modules.${mid}.completedChapters`] = 1;
      moduleProjection[`modules.${mid}.isCompleted`] = 1;
      moduleProjection[`modules.${mid}.updatedAt`] = 1;
      moduleProjection[`modules.${mid}.certification`] = 1;
      moduleProjection[`modules.${mid}.challenges`] = 1;
      moduleProjection[`modules.${mid}.results`] = 1;
      moduleProjection[`modules.${mid}.chapters`] = 1;
    }

    const [userData, mintedNFTData, userModulesDoc] = await Promise.all([
      // User profile (lightweight)
      db.collection("users").findOne(
        { address: addressQuery },
        { projection: { _id: 0, address: 1, socialHandles: 1, createdAt: 1, isEmailVisible: 1 } }
      ),

      // Minted NFTs (lightweight)
      db.collection("minted-nft").findOne(
        { userAddress: addressQuery },
        { projection: { _id: 0, totalMinted: 1, mintedLevels: 1, lastMintedAt: 1 } }
      ),

      // All module data — projected to only the fields we need
      db.collection("user-modules").findOne(
        { userAddress: addressQuery },
        { projection: moduleProjection }
      ),
    ]);

    timings["db_fetch_ms"] = Math.round(now() - tFetch0);

    // ── 3. Process module data (single pass) ──────────────────────────────
    const tProc0 = now();

    const modules = userModulesDoc?.modules ?? {};

    // Pre-allocate arrays with reasonable capacity
    const allCompletedChapters: Array<{
      id: string;
      moduleId: string;
      moduleName: string;
      title: string;
      completedOn: string;
      points: number;
      level: string;
    }> = [];
    const completedModules: Array<{ id: string; name: string; completedAt: string }> = [];
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

    let totalSectionsCompleted = 0;
    let totalModulesCompleted = 0;
    let totalPoints = 0;

    // Level distribution counters (using Map for O(1) lookup)
    const levelDist = new Map<string, number>();

    // Single pass over all modules
    for (const moduleId of MODULE_IDS) {
      const data = modules[moduleId];
      if (!data) continue;

      const config = MODULE_CONFIG[moduleId];
      const moduleName = config.name;
      const updatedAtStr = toDateString(data.updatedAt);

      // ── completedChapters ──
      const cc = data.completedChapters;
      if (Array.isArray(cc)) {
        for (let i = 0; i < cc.length; i++) {
          const chapter = cc[i];
          let id: string, level: string, points: number;

          if (typeof chapter === "string") {
            id = chapter; level = "Beginner"; points = 0;
          } else {
            id = chapter?.id ?? ""; level = chapter?.level || "Beginner"; points = Number(chapter?.points) || 0;
          }
          if (!id) continue;

          totalPoints += points;
          levelDist.set(level, (levelDist.get(level) || 0) + 1);

          allCompletedChapters.push({
            id: `${moduleId}-${id}`,
            moduleId,
            moduleName,
            title: id.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
            completedOn: updatedAtStr,
            points,
            level,
          });
        }
      }

      // ── challenges / results (precompiles-overview style) ──
      const challs = data.challenges;
      const results = data.results;
      if (Array.isArray(challs) && results && typeof results === "object") {
        for (let i = 0; i < challs.length; i++) {
          const challengeId = challs[i];
          const result = results[challengeId];
          const points = result ? Number(result.points) || 0 : 0;
          const level = result?.level || "Beginner";
          const completedAt = toDateString(result?.completedAt ?? data.updatedAt);

          totalPoints += points;
          levelDist.set(level, (levelDist.get(level) || 0) + 1);

          allCompletedChapters.push({
            id: `${moduleId}-${challengeId}`,
            moduleId,
            moduleName,
            title: challengeId.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
            completedOn: completedAt,
            points,
            level,
          });
        }
      }

      // ── section count (just count array lengths, don't care about values) ──
      const chapters = data.chapters;
      if (chapters && typeof chapters === "object") {
        const vals = Object.values(chapters);
        for (let i = 0; i < vals.length; i++) {
          if (Array.isArray(vals[i])) {
            totalSectionsCompleted += (vals[i] as any[]).length;
          }
        }
      }

      // ── module completion ──
      if (data.isCompleted === true) {
        totalModulesCompleted++;
        completedModules.push({
          id: moduleId,
          name: moduleName,
          completedAt: updatedAtStr,
        });
      }

      // ── certification NFTs ──
      const certs = data.certification;
      if (Array.isArray(certs)) {
        for (let i = 0; i < certs.length; i++) {
          const c = certs[i];
          if (c?.claimed !== true && c?.mintedAt == null) continue;
          userModulesNFTs.push({
            level: c?.level ?? 0,
            levelKey: moduleId,
            levelName: c?.levelName ?? moduleName,
            transactionHash: c?.transactionHash ?? "",
            metadataUrl: c?.metadataUrl ?? "",
            imageUrl: c?.imageUrl ?? "",
            mintedAt: toISOString(c?.mintedAt),
            network: "arbitrum-sepolia",
          });
        }
      }
    }

    // ── Sort completed chapters by date (most recent first) ──
    allCompletedChapters.sort((a, b) => {
      const da = new Date(a.completedOn).getTime();
      const db2 = new Date(b.completedOn).getTime();
      // If both dates are NaN (Unknown), preserve order
      if (isNaN(da) && isNaN(db2)) return 0;
      if (isNaN(da)) return 1;
      if (isNaN(db2)) return -1;
      return db2 - da;
    });

    // ── Level distribution as plain object ──
    const levelDistribution: Record<string, number> = {};
    levelDist.forEach((count, level) => { levelDistribution[level] = count; });

    // ── Combine NFTs: minted-nft collection + user-modules certifications ──
    const mintedNFTLevels = mintedNFTData?.mintedLevels;
    const combinedNFTs: typeof userModulesNFTs = [];

    if (Array.isArray(mintedNFTLevels)) {
      for (let i = 0; i < mintedNFTLevels.length; i++) {
        const nft = mintedNFTLevels[i];
        combinedNFTs.push({
          ...nft,
          mintedAt: toISOString(nft.mintedAt),
        });
      }
    }
    // Append user-modules NFTs
    for (let i = 0; i < userModulesNFTs.length; i++) {
      combinedNFTs.push(userModulesNFTs[i]);
    }
    // Sort combined NFTs by date (most recent first)
    combinedNFTs.sort((a, b) =>
      new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime()
    );

    const totalMinted = (mintedNFTData?.totalMinted || 0) + userModulesNFTs.length;

    timings["processing_ms"] = Math.round(now() - tProc0);

    // ── 4. Determine user level ──
    let level = "Beginner";
    if (totalPoints >= 200) level = "Advanced";
    else if (totalPoints >= 100) level = "Intermediate";

    // ── 5. Build profile response ──
    const normalizedAddress = userAddress.toLowerCase();
    const ghUsername = userData?.socialHandles?.githubUsername;

    const profileData = {
      // User info
      username: ghUsername || "Anonymous",
      fullName: ghUsername || "Anonymous User",
      email: userData?.isEmailVisible ? "user@example.com" : "Hidden",
      avatar: ghUsername
        ? `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(ghUsername)}&backgroundColor=c1e5c1&size=128`
        : "https://api.dicebear.com/7.x/bottts/png?seed=anonymous&backgroundColor=c1e5c1&size=128",
      joinDate: userData?.createdAt
        ? new Date(userData.createdAt).toLocaleDateString("en-US", {
          month: "long", day: "numeric", year: "numeric",
        })
        : "Unknown",
      userAddress: normalizedAddress,

      // Core statistics
      level,
      points: totalPoints,
      totalChallengesCompleted: allCompletedChapters.length,
      totalSectionsCompleted,
      totalModulesCompleted,
      totalMinted,

      // Detailed data
      completedModules,
      completedChallenges: allCompletedChapters,
      levelDistribution,
      mintedNFTs: combinedNFTs,
    };

    const totalMs = Math.round(now() - t0);
    timings["total_ms"] = totalMs;

    console.log(`[Profile API] address=${normalizedAddress} | total=${totalMs}ms | connect=${timings.db_connect_ms}ms | fetch=${timings.db_fetch_ms}ms | processing=${timings.processing_ms}ms | challenges=${allCompletedChapters.length} | sections=${totalSectionsCompleted} | modules=${totalModulesCompleted} | points=${totalPoints} | nfts=${totalMinted}`);

    const response = NextResponse.json(profileData);
    // Expose timings via response header for client-side debugging
    response.headers.set("Server-Timing",
      `db_connect;dur=${timings.db_connect_ms}, db_fetch;dur=${timings.db_fetch_ms}, processing;dur=${timings.processing_ms}, total;dur=${totalMs}`
    );
    return response;

  } catch (error) {
    const totalMs = Math.round(now() - t0);
    console.error(`[Profile API] ERROR after ${totalMs}ms:`, error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}

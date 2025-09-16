import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import { web3BasicsChapters } from "@/data/web3BasicsChapters";
import { crossChainChapters } from "@/data/crossChainChapters";
import { defiChapters } from "@/data/defiChapters";
import { orbitChapters } from "@/data/orbitChapters";

type UserChallengesDoc = {
  userAddress: string;
  // Map of chapterId to array of completed section ids
  chapters: { [chapterId: string]: string[] };
  // convenience list of fully completed chapter ids
  // For cross-chain module we store objects with level/points. Keep type broad.
  completedChapters: any[];
  // Whether the entire module is completed (all chapters fully done)
  updatedAt: Date;
  isCompleted?: boolean;
  certification?: {
    claimed: boolean;
    claimedAt: Date;
    transactionHash: string;
    metadataUrl: string;
    imageUrl: string;
  };
};

function computeProgress(chaptersCompletedSections: {
  [chapterId: string]: string[];
}, currentModule: string = "web3-basics") {
  const progressByChapter: Record<
    string,
    { completedSectionIds: string[]; totalSections: number; percent: number }
  > = {};

  const chapters = currentModule === "cross-chain"
    ? crossChainChapters
    : currentModule === "master-defi"
    ? defiChapters
    : currentModule === "master-orbit"
    ? orbitChapters
    : web3BasicsChapters;

  for (const chapter of chapters) {
    const availableSections = chapter.sections.filter(
      (s) => s.status === "available"
    );
    const completedSectionIds = chaptersCompletedSections[chapter.id] || [];
    const totalSections = availableSections.length;
    const percent =
      totalSections > 0
        ? (completedSectionIds.length / totalSections) * 100
        : 0;
    progressByChapter[chapter.id] = {
      completedSectionIds,
      totalSections,
      percent,
    };
  }

  return progressByChapter;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = (searchParams.get("userAddress") || "").toLowerCase();
    const currentModule = searchParams.get("module") || "web3-basics";
    
    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing userAddress" },
        { status: 400 }
      );
    }

    const collectionName = currentModule === "cross-chain"
      ? "challenges-cross-chain"
      : currentModule === "master-defi"
      ? "challenges-master-defi"
      : currentModule === "master-orbit"
      ? "challenges-orbit-chain"
      : "challenges-web3-basics";

    const { db } = await connectToDatabase();
    const collection = db.collection<UserChallengesDoc>(collectionName);

    const doc = await collection.findOne({ userAddress });
    const chapters = doc?.chapters || {};
    const completedChapters = doc?.completedChapters || [];
    const isCompleted = Boolean(doc?.isCompleted);
    const certification = doc?.certification || null;

    const progressByChapter = computeProgress(chapters, currentModule);

    return NextResponse.json({
      userAddress,
      chapters,
      completedChapters,
      progressByChapter,
      isCompleted,
      certification,
    });
  } catch (error) {
    console.error("GET /api/challenges error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userAddress: string = (body.userAddress || "").toLowerCase();
    const chapterId: string = body.chapterId;
    const sectionId: string = body.sectionId;
    const currentModule: string = body.module || "web3-basics";
    const finalizeChapter: boolean = Boolean(body.finalizeChapter);
    
    if (!userAddress || !chapterId || !sectionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const collectionName = currentModule === "cross-chain"
      ? "challenges-cross-chain"
      : currentModule === "master-defi"
      ? "challenges-master-defi"
      : currentModule === "master-orbit"
      ? "challenges-orbit-chain"
      : "challenges-web3-basics";

    const { db } = await connectToDatabase();
    const collection = db.collection<UserChallengesDoc>(collectionName);

    const existing = await collection.findOne({ userAddress });
    const chapters = existing?.chapters || {};
    const chapterCompleted = new Set<string>(chapters[chapterId] || []);
    chapterCompleted.add(sectionId);
    chapters[chapterId] = Array.from(chapterCompleted);

    // Recompute completedChapters
    const completedChapters: any[] = [];
    const chaptersDataForModule = currentModule === "cross-chain"
      ? crossChainChapters
      : currentModule === "master-defi"
      ? defiChapters
      : currentModule === "master-orbit"
      ? orbitChapters
      : web3BasicsChapters;
    
    for (const ch of chaptersDataForModule) {
      const availableSections = ch.sections.filter((s) => s.status === "available");
      
      // If client asked to finalize a chapter, backfill its completed sections to all available
      if (finalizeChapter && ch.id === chapterId) {
        chapters[chapterId] = availableSections.map((s) => s.id);
      }

      // IMPORTANT: compute done AFTER potentially applying finalizeChapter update above
      const done = new Set(chapters[ch.id] || []);

      if (
        availableSections.length > 0 &&
        availableSections.every((s) => done.has(s.id))
      ) {
        if (currentModule === "cross-chain" || currentModule === "master-defi" || currentModule === "master-orbit") {
          // Enrich with level and points for Cross-Chain and Master DeFi
          const level: string = (ch as any).level || "Beginner";
          const points = level === "Advanced" ? 30 : level === "Intermediate" ? 20 : 10;
          completedChapters.push({ id: ch.id, level, points });
        } else {
          completedChapters.push(ch.id);
        }
      }
    }

    // Check if all 6 chapters are completed for Web3 Basics
    const isCompleted = completedChapters.length >= 6;

    const doc: UserChallengesDoc = {
      userAddress,
      chapters,
      completedChapters,
      isCompleted: false,
      updatedAt: new Date(),
    };

    // Determine if module is fully completed (all chapters complete)
    const chaptersData2 = currentModule === "cross-chain"
      ? crossChainChapters
      : currentModule === "master-defi"
      ? defiChapters
      : currentModule === "master-orbit"
      ? orbitChapters
      : web3BasicsChapters;

    const allChapterIds = chaptersData2.map((c) => c.id);
    const allSectionsCompleted = allChapterIds.every((cid) => {
      const available = chaptersData2.find((c) => c.id === cid)!.sections.filter((s) => s.status === "available").map((s) => s.id);
      const done = new Set(chapters[cid] || []);
      return available.length > 0 && available.every((sid) => done.has(sid));
    });

    doc.isCompleted = allSectionsCompleted;

    const updateResult = await collection.updateOne(
      { userAddress },
      { $set: doc },
      { upsert: true }
    );

    const progressByChapter = computeProgress(chapters, currentModule);

    return NextResponse.json({
      userAddress,
      chapters,
      completedChapters,
      progressByChapter,
      isCompleted: doc.isCompleted,
    });
  } catch (error) {
    console.error("POST /api/challenges error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

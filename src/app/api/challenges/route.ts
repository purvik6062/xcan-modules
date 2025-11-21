import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import {
  getModuleData,
  updateModuleData,
  normalizeModuleId,
  MODULE_ID_MAP,
  type ModuleIdentifier,
} from "@/lib/database/module-collections";
import { web3BasicsChapters } from "@/data/web3BasicsChapters";
import { crossChainChapters } from "@/data/crossChainChapters";
import { defiChapters } from "@/data/defiChapters";
import { orbitChapters } from "@/data/orbitChapters";
import { stylusChapters } from "@/data/stylusChapters";

function computeProgress(
  chaptersCompletedSections: {
    [chapterId: string]: string[];
  },
  currentModule: string = "web3-basics"
) {
  const progressByChapter: Record<
    string,
    { completedSectionIds: string[]; totalSections: number; percent: number }
  > = {};

  const chapters =
    currentModule === "cross-chain"
      ? crossChainChapters
      : currentModule === "master-defi"
      ? defiChapters
      : currentModule === "master-orbit"
      ? orbitChapters
      : currentModule === "stylus-core-concepts"
      ? stylusChapters
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

    if (!MODULE_ID_MAP[currentModule]) {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const moduleData = await getModuleData(
      db,
      userAddress,
      currentModule as ModuleIdentifier
    );

    const chapters = moduleData?.chapters || {};
    const completedChapters = moduleData?.completedChapters || [];
    let isCompleted = Boolean(moduleData?.isCompleted);

    // Special case for orbit module: enable NFT minting after completing first chapter
    if (currentModule === "master-orbit" && completedChapters.length >= 1) {
      isCompleted = true;
    }

    const certification = moduleData?.certification || null;
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

    if (!MODULE_ID_MAP[currentModule]) {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Get existing module data
    const existing = await getModuleData(
      db,
      userAddress,
      currentModule as ModuleIdentifier
    );
    const chapters = existing?.chapters || {};
    const chapterCompleted = new Set<string>(chapters[chapterId] || []);
    chapterCompleted.add(sectionId);
    chapters[chapterId] = Array.from(chapterCompleted);

    // Recompute completedChapters
    const completedChapters: any[] = [];
    const chaptersDataForModule =
      currentModule === "cross-chain"
        ? crossChainChapters
        : currentModule === "master-defi"
        ? defiChapters
        : currentModule === "master-orbit"
        ? orbitChapters
        : currentModule === "stylus-core-concepts"
        ? stylusChapters
        : web3BasicsChapters;

    for (const ch of chaptersDataForModule) {
      const availableSections = ch.sections.filter(
        (s) => s.status === "available"
      );

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
        if (
          currentModule === "cross-chain" ||
          currentModule === "master-defi" ||
          currentModule === "master-orbit" ||
          currentModule === "stylus-core-concepts"
        ) {
          // Enrich with level and points for Cross-Chain, Master DeFi, and Stylus
          const level: string = (ch as any).level || "Beginner";
          const points =
            level === "Advanced" ? 30 : level === "Intermediate" ? 20 : 10;
          completedChapters.push({ id: ch.id, level, points });
        } else {
          completedChapters.push(ch.id);
        }
      }
    }

    // Check if all chapters are completed for the current module
    const totalChaptersInModule = chaptersDataForModule.length;
    let isCompleted = completedChapters.length >= totalChaptersInModule;

    // Special case for orbit module: enable NFT minting after completing first chapter
    if (currentModule === "master-orbit" && completedChapters.length >= 1) {
      isCompleted = true;
    }

    // Update module data in unified collection
    await updateModuleData(
      db,
      userAddress,
      currentModule as ModuleIdentifier,
      {
        chapters,
        completedChapters,
        isCompleted,
        createdAt: existing?.createdAt || new Date(),
        // Preserve existing certification if any
        ...(existing?.certification
          ? { certification: existing.certification }
          : {}),
        // Preserve special fields for precompiles-overview
        ...(existing?.challenges ? { challenges: existing.challenges } : {}),
        ...(existing?.results ? { results: existing.results } : {}),
      },
      { upsert: true }
    );

    const progressByChapter = computeProgress(chapters, currentModule);

    return NextResponse.json({
      userAddress,
      chapters,
      completedChapters,
      progressByChapter,
      isCompleted,
    });
  } catch (error) {
    console.error("POST /api/challenges error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

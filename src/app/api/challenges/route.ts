import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import { web3BasicsChapters } from "@/data/web3BasicsChapters";

type UserChallengesDoc = {
  userAddress: string;
  // Map of chapterId to array of completed section ids
  chapters: { [chapterId: string]: string[] };
  // convenience list of fully completed chapter ids
  completedChapters: string[];
  updatedAt: Date;
};

function computeProgress(chaptersCompletedSections: {
  [chapterId: string]: string[];
}) {
  const progressByChapter: Record<
    string,
    { completedSectionIds: string[]; totalSections: number; percent: number }
  > = {};

  for (const chapter of web3BasicsChapters) {
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
    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing userAddress" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection<UserChallengesDoc>("challenges-web3-basics");

    const doc = await collection.findOne({ userAddress });
    const chapters = doc?.chapters || {};
    const completedChapters = doc?.completedChapters || [];

    const progressByChapter = computeProgress(chapters);

    return NextResponse.json({
      userAddress,
      chapters,
      completedChapters,
      progressByChapter,
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
    if (!userAddress || !chapterId || !sectionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection<UserChallengesDoc>("challenges-web3-basics");

    const existing = await collection.findOne({ userAddress });
    const chapters = existing?.chapters || {};
    const chapterCompleted = new Set<string>(chapters[chapterId] || []);
    chapterCompleted.add(sectionId);
    chapters[chapterId] = Array.from(chapterCompleted);

    // Recompute completedChapters
    const completedChapters: string[] = [];
    for (const ch of web3BasicsChapters) {
      const availableSections = ch.sections.filter(
        (s) => s.status === "available"
      );
      const done = new Set(chapters[ch.id] || []);
      if (
        availableSections.length > 0 &&
        availableSections.every((s) => done.has(s.id))
      ) {
        completedChapters.push(ch.id);
      }
    }

    const doc: UserChallengesDoc = {
      userAddress,
      chapters,
      completedChapters,
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { userAddress },
      { $set: doc },
      { upsert: true }
    );

    const progressByChapter = computeProgress(chapters);

    return NextResponse.json({
      userAddress,
      chapters,
      completedChapters,
      progressByChapter,
    });
  } catch (error) {
    console.error("POST /api/challenges error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

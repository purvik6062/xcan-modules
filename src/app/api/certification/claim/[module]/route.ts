import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await context.params;
    const body = await request.json();
    const userAddress: string = (body.userAddress || "").toLowerCase();
    const transactionHash: string | undefined = body.transactionHash;
    const metadataUrl: string | undefined = body.metadataUrl;
    const imageUrl: string | undefined = body.imageUrl;

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing userAddress" },
        { status: 400 }
      );
    }

    const collectionName =
    module === "precompiles-overview"
    ? "challenges-precompiles-overview"
    : module === "web3-basics"
    ? "challenges-web3-basics"
    : module === "stylus-core-concepts"
    ? "challenges-stylus-core-concepts"
    : module === "master-defi"
    ? "challenges-master-defi"
    : module === "master-orbit"
    ? "challenges-orbit-chain"
    : module === "cross-chain"
    ? "challenges-cross-chain"
        : null;

    if (!collectionName) {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }

    const { client, db } = await connectToDatabase();
    const collection = db.collection(collectionName);

    const baseSetOnInsert =
      collectionName === "challenges-precompiles-overview"
        ? { createdAt: new Date(), challenges: [], results: {} }
        : { createdAt: new Date(), chapters: {}, completedChapters: [] };

    const update: any = {
      $set: {
        userAddress,
        updatedAt: new Date(),
        certification: [
          {
            level: 1,
            levelName: module,
            claimed: true,
            mintedAt: new Date(),
            ...(transactionHash ? { transactionHash } : {}),
            ...(metadataUrl ? { metadataUrl } : {}),
            ...(imageUrl ? { imageUrl } : {}),
          },
        ],
      },
      $setOnInsert: baseSetOnInsert,
    };

    await collection.updateOne({ userAddress }, update, { upsert: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Claim certification (dynamic) error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await context.params;
    const { searchParams } = new URL(request.url);
    const userAddress = (searchParams.get("userAddress") || "").toLowerCase();

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing userAddress" },
        { status: 400 }
      );
    }

    // Validate module against possible certification levelNames
    const validModules = [
      "web3-basics",
      "precompiles-overview",
      "stylus-core-concepts",
      "arbitrum-orbit",
      "defi-arbitrum",
      "cross-chain",
      "xcan-advocate",
    ];
    if (!validModules.includes(module)) {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }

    const collectionName =
      module === "precompiles-overview"
        ? "challenges-precompiles-overview"
        : module === "web3-basics"
        ? "challenges-web3-basics"
        : module === "stylus-core-concepts"
        ? "challenges-stylus-core-concepts"
        : module === "master-defi"
        ? "challenges-master-defi"
        : module === "master-orbit"
        ? "challenges-orbit-chain"
        : module === "cross-chain"
        ? "challenges-cross-chain"
        : module === "xcan-advocate"
        ? "advocates"
        : null;

    if (!collectionName) {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName); // Updated collection name
    const doc = await collection.findOne(
      { userAddress },
      { projection: { _id: 0, certification: 1, isCompleted: 1 } }
    );

    // Find certification matching the requested module
    const certifications = Array.isArray(doc?.certification)
      ? doc.certification
      : [];
    const matchingCertification = certifications.find(
      (cert: any) => cert.levelName === module
    );
    console.log("matchingCertification", matchingCertification);
    console.log("certifications", certifications);
    console.log("module", module);
    

    return NextResponse.json({
      claimed: Boolean(matchingCertification?.claimed),
      certification: matchingCertification || null,
      isCompleted: Boolean(doc?.isCompleted),
  });
  } catch (error: any) {
    console.error("Get certification (dynamic) error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";

// One-time certificate generation per module per address
// POST: mark as generated with optional display name
// GET: check if generated

const MODULE_TO_COLLECTION: Record<string, string> = {
  "precompiles-overview": "challenges-precompiles-overview",
  "web3-basics": "challenges-web3-basics",
  "stylus-core-concepts": "challenges-stylus-core-concepts",
  "master-defi": "challenges-master-defi",
  "master-orbit": "challenges-orbit-chain",
  "cross-chain": "challenges-cross-chain",
};

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

    const levelKey = searchParams.get("levelKey") || undefined;
    const collectionName = MODULE_TO_COLLECTION[module];
    if (!collectionName) {
      // Special case: arbitrum-stylus uses minted-nft with multiple levels
      if (module === "arbitrum-stylus") {
        const { db } = await connectToDatabase();
        const collection = db.collection("minted-nft");
        const doc = await collection.findOne(
          { userAddress },
          { projection: { _id: 0, certificates: 1 } }
        );
        const certs: any[] = Array.isArray(doc?.certificates)
          ? (doc as any).certificates
          : [];
        const matched = levelKey
          ? certs.find((c: any) => c?.levelKey === levelKey)
          : undefined;
        return NextResponse.json({
          generated: Boolean(matched),
          name: matched?.name || null,
        });
      }
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);
    const doc = await collection.findOne(
      { userAddress },
      { projection: { _id: 0, certificateGenerated: 1, certificateName: 1 } }
    );
    return NextResponse.json({
      generated: Boolean(doc?.certificateGenerated),
      name: doc?.certificateName || null,
    });
  } catch (error: any) {
    console.error("Certificate generate GET error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await context.params;
    const body = await request.json();
    const userAddress: string = (body.userAddress || "").toLowerCase();
    const displayName: string | undefined = body.name;
    const levelKey: string | undefined = body.levelKey;

    if (!userAddress || !displayName) {
      return NextResponse.json(
        { error: "Missing userAddress or name" },
        { status: 400 }
      );
    }

    const collectionName = MODULE_TO_COLLECTION[module];
    if (!collectionName) {
      if (module === "arbitrum-stylus") {
        const { db } = await connectToDatabase();
        const collection = db.collection("minted-nft");
        if (!levelKey) {
          return NextResponse.json(
            { error: "Missing levelKey" },
            { status: 400 }
          );
        }
        // ensure that user minted this level
        const existing = await collection.findOne(
          { userAddress, "mintedLevels.levelKey": levelKey },
          { projection: { _id: 0, certificates: 1 } }
        );
        if (!existing) {
          return NextResponse.json(
            { error: "Level not minted" },
            { status: 403 }
          );
        }
        const already = Array.isArray((existing as any).certificates)
          ? (existing as any).certificates.some(
              (c: any) => c?.levelKey === levelKey
            )
          : false;
        if (already) {
          return NextResponse.json({ success: true, already: true });
        }
        await collection.updateOne(
          { userAddress },
          {
            $set: { updatedAt: new Date() },
            // Use $addToSet with $each to avoid TS array typing complaints and prevent duplicates
            $addToSet: {
              certificates: {
                $each: [
                  { levelKey, name: displayName, generatedAt: new Date() },
                ],
              },
            },
          } as any,
          { upsert: true }
        );
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);

    // Only set if not already generated
    const existing = await collection.findOne(
      { userAddress },
      { projection: { certificateGenerated: 1 } }
    );
    if (existing?.certificateGenerated) {
      return NextResponse.json({ success: true, already: true });
    }

    await collection.updateOne(
      { userAddress },
      {
        $set: {
          certificateGenerated: true,
          certificateName: displayName,
          certificateGeneratedAt: new Date(),
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Certificate generate POST error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

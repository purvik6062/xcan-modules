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
      module === "core-stylus"
        ? "challenges-core-stylus"
        : module === "web3-basics"
        ? "challenges-web3-basics"
        : null;

    if (!collectionName) {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);

    const baseSetOnInsert =
      collectionName === "challenges-core-stylus"
        ? { createdAt: new Date(), challenges: [], results: {} }
        : { createdAt: new Date(), chapters: {}, completedChapters: [] };

    const update: any = {
      $set: {
        userAddress,
        updatedAt: new Date(),
        certification: {
          claimed: true,
          claimedAt: new Date(),
          ...(transactionHash ? { transactionHash } : {}),
          ...(metadataUrl ? { metadataUrl } : {}),
          ...(imageUrl ? { imageUrl } : {}),
        },
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

    const collectionName =
      module === "core-stylus"
        ? "challenges-core-stylus"
        : module === "web3-basics"
        ? "challenges-web3-basics"
        : null;
        
    if (!collectionName) {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);
    const doc = await collection.findOne(
      { userAddress },
      { projection: { _id: 0, certification: 1 } }
    );

    return NextResponse.json({
      claimed: Boolean(doc?.certification?.claimed),
      certification: doc?.certification || null,
    });
  } catch (error: any) {
    console.error("Get certification (dynamic) error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";

export async function POST(request: NextRequest) {
  try {
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

    const { db } = await connectToDatabase();
    const collection = db.collection("foundation-users");

    // Update the certification for this user
    const update: any = {
      $set: {
        walletAddress: userAddress,
        updatedAt: new Date(),
        certification: [
          {
            level: 1,
            levelName: "stylus-foundation",
            claimed: true,
            mintedAt: new Date(),
            ...(transactionHash ? { transactionHash } : {}),
            ...(metadataUrl ? { metadataUrl } : {}),
            ...(imageUrl ? { imageUrl } : {}),
          },
        ],
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    };

    await collection.updateOne({ walletAddress: userAddress }, update, { upsert: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Claim stylus-foundation certification error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = (searchParams.get("userAddress") || "");

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing userAddress" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("foundation-users");
    
    // Check if user exists in foundation-users collection
    const doc = await collection.findOne(
      { walletAddress: userAddress },
      { projection: { _id: 0, walletAddress: 1} }
    );

    console.log("doc", doc);

    // If user exists in foundation-users collection, they have completed the challenge
    const isCompleted = Boolean(doc?.walletAddress);

    // Find certification matching the requested module
    const certifications = Array.isArray(doc?.certification)
      ? doc.certification
      : [];
    const matchingCertification = certifications.find(
      (cert: any) => cert.levelName === "stylus-foundation"
    );

    return NextResponse.json({
      claimed: Boolean(matchingCertification?.claimed),
      certification: matchingCertification || null,
      isCompleted: isCompleted,
    });
  } catch (error: any) {
    console.error("Get stylus-foundation certification error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}


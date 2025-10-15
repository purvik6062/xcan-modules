import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";

// Collection: advocates

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddressRaw = searchParams.get("userAddress") || "";
    const userAddress = userAddressRaw.toLowerCase();

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing userAddress" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("advocates");

    const doc = await collection.findOne(
      { userAddress: RegExp(`^${userAddress}$`, "i") },
      { projection: { _id: 0 } }
    );

    // If not found, return a default structure with eligibility false and empty certification list
    const response = doc || {
      userAddress,
      isEligible: false,
      certification: [],
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("GET /api/advocates error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userAddress: string = (body.userAddress || "").toLowerCase();
    const isEligible: boolean | undefined = body.isEligible;
    const transactionHash: string | undefined = body.transactionHash;
    const metadataURL: string | undefined = body.metadataURL;
    const imageURL: string | undefined = body.imageURL;

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing userAddress" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection("advocates");

    // Build update to support certification array entries
    const baseUpdate: any = {
      $set: {
        userAddress,
        updatedAt: new Date(),
        ...(typeof isEligible === "boolean" ? { isEligible } : {}),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    };

    // If a mint payload is provided, push a new certification entry
    if (transactionHash || metadataURL || imageURL) {
      baseUpdate.$push = {
        certification: {
          imageURL: imageURL || null,
          metadataURL: metadataURL || null,
          transactionHash: transactionHash || null,
          claimed: true,
          level: 1,
          levelName: "xcan-advocate",
          mintedAt: new Date(),
        },
      };
    }

    await collection.updateOne({ userAddress }, baseUpdate, { upsert: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/advocates error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

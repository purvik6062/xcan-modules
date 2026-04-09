import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import { addressMatchQuery } from "@/lib/utils/address";

function normalizeCertificateName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, 80);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = (searchParams.get("wallet_address") || "").toLowerCase();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const users = db.collection("users");
    const user = await users.findOne(
      { address: addressMatchQuery(walletAddress) },
      { projection: { _id: 0, certificateName: 1 } }
    );

    return NextResponse.json({
      certificateName: normalizeCertificateName(user?.certificateName) || null,
    });
  } catch (error) {
    console.error("Error fetching certificate name:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate name" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const walletAddress = String(body?.walletAddress || "").toLowerCase();
    const certificateName = normalizeCertificateName(body?.name);

    if (!walletAddress || !certificateName) {
      return NextResponse.json(
        { error: "Wallet address and name are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const users = db.collection("users");
    const now = new Date();

    await users.updateOne(
      { address: addressMatchQuery(walletAddress) },
      {
        $set: {
          certificateName,
          updatedAt: now,
        },
        $setOnInsert: {
          address: walletAddress,
          createdAt: now,
          isEmailVisible: false,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, certificateName });
  } catch (error) {
    console.error("Error storing certificate name:", error);
    return NextResponse.json(
      { error: "Failed to store certificate name" },
      { status: 500 }
    );
  }
}

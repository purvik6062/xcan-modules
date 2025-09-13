import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get("wallet_address");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  try {
    // Check if user exists and has GitHub username
    const { client, db } = await connectToDatabase();
    const collection = db.collection("users");

    const user = await collection.findOne(
      { address: walletAddress },
      { projection: { "socialHandles.githubUsername": 1 } }
    );

    if (!user) {
      return NextResponse.json({ hasGithub: false, githubUsername: null });
    }

    const githubUsername = user.socialHandles?.githubUsername || null;
    const hasGithub = !!githubUsername;

    return NextResponse.json({
      hasGithub,
      githubUsername,
    });
  } catch (error) {
    console.error("Error checking GitHub username:", error);
    return NextResponse.json(
      { error: "Failed to check GitHub username" },
      { status: 500 }
    );
  }
}

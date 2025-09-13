import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, githubUsername } = await req.json();

    if (!walletAddress || !githubUsername) {
      return NextResponse.json(
        { error: "Wallet address and GitHub username are required" },
        { status: 400 }
      );
    }

    const { client, db } = await connectToDatabase();
    const collection = db.collection("users");

    // Check if user exists
    const existingUser = await collection.findOne({ address: walletAddress });

    if (!existingUser) {
      // Create new user with GitHub username
      await collection.insertOne({
        address: walletAddress,
        isEmailVisible: false,
        createdAt: new Date(),
        socialHandles: {
          githubUsername: githubUsername,
          githubConnectedAt: new Date(),
        },
      });
    } else {
      // Update existing user with GitHub username
      await collection.updateOne(
        { address: walletAddress },
        {
          $set: {
            "socialHandles.githubUsername": githubUsername,
            "socialHandles.githubConnectedAt": new Date(),
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      githubUsername,
    });
  } catch (error) {
    console.error("Error storing GitHub username:", error);
    return NextResponse.json(
      { error: "Failed to store GitHub username" },
      { status: 500 }
    );
  }
}

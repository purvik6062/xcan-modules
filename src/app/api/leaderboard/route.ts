import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/database/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const foundationUsersCollection = db.collection("foundation-users");

    // Fetch users with only the required fields
    const users = await foundationUsersCollection
      .find(
        {},
        {
          projection: {
            walletAddress: 1,
            githubRepo: 1,
            contractAddress: 1,
            submittedAt: 1,
            _id: 0,
          },
        }
      )
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      submissions: users,
      totalSubmissions: users.length,
    });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}


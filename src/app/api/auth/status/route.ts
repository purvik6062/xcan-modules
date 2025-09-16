import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import { AuthTokenClaims, PrivyClient } from "@privy-io/server-auth";

const privyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_SECRET!
);

export async function GET(req: NextRequest) {
  try {
    // Get request wallet address from header
    const requestWalletAddress = req.headers.get("x-wallet-address");
    if (!requestWalletAddress) {
      return NextResponse.json(
        { error: "No wallet address provided in request" },
        { status: 400 }
      );
    }

    // For now, we'll skip Privy token verification to simplify the flow
    // In production, you should implement proper token verification

    // Connect to database and check GitHub connection status
    const { client, db } = await connectToDatabase();
    const collection = db.collection("users");

    const user = await collection.findOne({
      address: requestWalletAddress,
    });

    if (!user) {
      return NextResponse.json({
        walletConnected: true,
        githubConnected: false,
        githubUsername: null,
        fullyAuthenticated: false,
      });
    }

    const isFullyAuthenticated = user.socialHandles.githubUsername !== null;

    return NextResponse.json({
      walletConnected: true,
      githubConnected: user.githubConnected || false,
      githubUsername: user.githubUsername || null,
      fullyAuthenticated: isFullyAuthenticated,
    });
  } catch (error) {
    console.error("Error checking auth status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

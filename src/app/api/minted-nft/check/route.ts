import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get("address");
    const level = searchParams.get("level");

    if (!userAddress) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const { client, db } = await connectToDatabase();
    const collection = db.collection("minted-nft");

    const existingUser = await collection.findOne({
      userAddress: userAddress.toLowerCase(),
    });

    if (!existingUser) {
      return NextResponse.json({
        hasMinted: false,
        nft: null,
        nfts: [],
        totalMinted: 0,
      });
    }

    if (level) {
      // Check for specific level
      const hasMintedThisLevel = existingUser.mintedLevels?.some(
        (mintedLevel: any) => mintedLevel.level === parseInt(level)
      );

      const specificLevelNFT = existingUser.mintedLevels?.find(
        (mintedLevel: any) => mintedLevel.level === parseInt(level)
      );

      await client.close();

      return NextResponse.json({
        hasMinted: hasMintedThisLevel,
        nft: specificLevelNFT || null,
        nfts: existingUser.mintedLevels || [],
        totalMinted: existingUser.totalMinted || 0,
      });
    } else {
      // Get all minted NFTs for the user
      await client.close();

      return NextResponse.json({
        hasMinted: existingUser.totalMinted > 0,
        nfts: existingUser.mintedLevels || [],
        totalMinted: existingUser.totalMinted || 0,
        lastMintedAt: existingUser.lastMintedAt,
        githubUsername: existingUser.githubUsername,
      });
    }
  } catch (error) {
    console.error("Error checking minted NFT:", error);
    return NextResponse.json(
      { error: "Failed to check minted status" },
      { status: 500 }
    );
  }
}

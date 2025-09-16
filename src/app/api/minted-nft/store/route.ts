import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import { MintedNFT } from "@/components/nft/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userAddress,
      transactionHash,
      metadataUrl,
      imageUrl,
      githubUsername,
      levelName,
      level,
      levelKey,
    } = body;

    if (
      !userAddress ||
      !transactionHash ||
      !metadataUrl ||
      !imageUrl ||
      !levelName ||
      level === undefined ||
      level === null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { client, db } = await connectToDatabase();
    const collection = db.collection("minted-nft");

    // Check if user already has a document
    const existingUser = await collection.findOne({
      userAddress: userAddress.toLowerCase(),
    });

    if (existingUser) {
      // Check if this specific level has already been minted
      const hasMintedThisLevel = existingUser.mintedLevels?.some(
        (mintedLevel: any) => mintedLevel.level === level
      );

      if (hasMintedThisLevel) {
        return NextResponse.json(
          { error: `User has already minted NFT for level ${level}` },
          { status: 409 }
        );
      }

      // Add the new level to the existing user's minted levels
      const newMintedLevel = {
        level: level,
        levelKey: levelKey,
        levelName: levelName,
        transactionHash,
        metadataUrl,
        imageUrl,
        mintedAt: new Date(),
        network: "arbitrum-sepolia",
      };

      const updatedUser = await collection.findOneAndUpdate(
        { userAddress: userAddress.toLowerCase() },
        {
          $push: { mintedLevels: newMintedLevel as any },
          $inc: { totalMinted: 1 },
          $set: {
            lastMintedAt: new Date(),
            ...(githubUsername && !existingUser.githubUsername
              ? { githubUsername }
              : {}),
          },
        },
        { returnDocument: "after" }
      );

      return NextResponse.json({
        success: true,
        nft: updatedUser?.value || null,
      });
    } else {
      // Create new user document with first minted level

      const newMintedLevel = {
        level: level,
        levelKey: levelKey,
        levelName: levelName,
        transactionHash,
        metadataUrl,
        imageUrl,
        mintedAt: new Date(),
        network: "arbitrum-sepolia",
      };

      const mintedNFT: MintedNFT = {
        userAddress: userAddress.toLowerCase(),
        mintedLevels: [newMintedLevel],
        totalMinted: 1,
        lastMintedAt: new Date(),
        ...(githubUsername ? { githubUsername } : {}),
      };

      const result = await collection.insertOne(mintedNFT);

      return NextResponse.json({
        success: true,
        nft: { ...mintedNFT, _id: result.insertedId },
      });
    }
  } catch (error) {
    console.error("Error storing minted NFT:", error);
    return NextResponse.json(
      { error: "Failed to store minted NFT" },
      { status: 500 }
    );
  }
}

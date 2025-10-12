import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/database/mongodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userAddress = searchParams.get("userAddress");

    if (!userAddress) {
      return NextResponse.json(
        { error: "User address is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const deployedChainsCollection = db.collection("deployed-orbit-chains");

    // Fetch all deployed chains for this user
    const deployedChains = await deployedChainsCollection
      .find({ userAddress: userAddress })
      .sort({ createdAt: -1 })
      .toArray();

    // Transform the data to include only the fields we want to show
    const transformedChains = deployedChains.map((chain) => ({
      deploymentId: chain.deploymentId,
      chainName: chain.chainName,
      chainId: chain.chainId,
      chainAddress: chain.chainAddress,
      deploymentTxHash: chain.deploymentTxHash,
      rpcUrl: chain.rpcUrl || "http://localhost:8449",
      explorerUrl: chain.explorerUrl || "http://localhost:8448",
      status: chain.status,
      createdAt: chain.createdAt,
      parentChainId: chain.parentChainId,
    }));

    return NextResponse.json({
      success: true,
      chains: transformedChains,
      count: transformedChains.length,
    });
  } catch (error) {
    console.error("Error fetching deployed chains:", error);
    return NextResponse.json(
      { error: "Failed to fetch deployed chains" },
      { status: 500 }
    );
  }
}


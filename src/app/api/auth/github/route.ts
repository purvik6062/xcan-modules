import { NextRequest, NextResponse } from "next/server";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/github/callback`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get("wallet_address");
  const returnTo = searchParams.get("return_to");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Wallet address is required" },
      { status: 400 }
    );
  }

  // Store wallet address and return URL in state for callback
  const state = Buffer.from(
    JSON.stringify({ walletAddress, returnTo })
  ).toString("base64");

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    GITHUB_REDIRECT_URI
  )}&scope=read:user&state=${state}`;

  return NextResponse.json({ authUrl: githubAuthUrl });
}

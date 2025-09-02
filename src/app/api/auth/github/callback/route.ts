import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/connectDB";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI =
  process.env.GITHUB_REDIRECT_URI ||
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/github/callback`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/error?error=${error}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/error?error=missing_params`
    );
  }

  try {
    // Decode state to get wallet address and return URL
    const stateData = JSON.parse(Buffer.from(state, "base64").toString());
    const walletAddress = stateData.walletAddress;
    const returnTo = stateData.returnTo as string | undefined;

    if (!walletAddress) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/error?error=invalid_state`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
          redirect_uri: GITHUB_REDIRECT_URI,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub token error:", tokenData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/error?error=token_error`
      );
    }

    const accessToken = tokenData.access_token;

    // Get user information from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const userData = await userResponse.json();

    if (userResponse.status !== 200) {
      console.error("GitHub user error:", userData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/error?error=user_error`
      );
    }

    // Store GitHub username in database
    let client;
    try {
      client = await connectDB();
      const db = client.db();
      const collection = db.collection("users");

      // Update user document with GitHub username
      await collection.updateOne(
        { address: walletAddress },
        {
          $set: {
            socialHandles: {
              githubUsername: userData.login,
              githubConnectedAt: new Date(),
            },
          },
        },
        { upsert: true }
      );

      // Redirect back to the originating page with GitHub info in query params
      const fallback = process.env.NEXT_PUBLIC_BASE_URL;
      const redirectBase = returnTo || fallback;
      if (!redirectBase) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/error?error=invalid_redirect`
        );
      }
      const target = new URL(redirectBase);
      target.searchParams.set("github_id", String(userData.id));
      target.searchParams.set("github_username", userData.login);
      return NextResponse.redirect(target.toString());
    } finally {
      if (client) {
        await client.close();
      }
    }
  } catch (error) {
    console.error("GitHub callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/error?error=server_error`
    );
  }
}

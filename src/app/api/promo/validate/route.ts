import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import { addressMatchQuery } from "@/lib/utils/address";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body?.code || "").trim();
    const userAddress = String(body?.userAddress || "").trim();
    const expected = process.env.PROMO_CODE?.trim();

    if (!expected) {
      return NextResponse.json(
        { message: "Promo code not configured" },
        { status: 500 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { message: "Promo code is required" },
        { status: 400 }
      );
    }

    if (code !== expected) {
      return NextResponse.json(
        { message: "Invalid promo code" },
        { status: 401 }
      );
    }

    // If user address is provided, store that they've verified the promo code in MongoDB
    if (userAddress && userAddress.startsWith("0x") && userAddress.length === 42) {
      try {
        const { db } = await connectToDatabase();
        await db.collection("user-modules").updateOne(
          { userAddress: addressMatchQuery(userAddress) },
          {
            $set: {
              promoCodeVerified: true,
              promoCodeVerifiedAt: new Date(),
              updatedAt: new Date(),
            },
            $setOnInsert: {
              userAddress: userAddress.toLowerCase(),
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
      } catch (dbErr) {
        // Don't fail the request if DB write fails — code was still valid
        console.error("Failed to store promo code verification in MongoDB:", dbErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

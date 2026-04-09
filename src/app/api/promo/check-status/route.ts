import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import { addressMatchQuery } from "@/lib/utils/address";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get("userAddress")?.trim();

    if (!userAddress) {
      return NextResponse.json({ verified: false }, { status: 200 });
    }

    const { db } = await connectToDatabase();

    const doc = await db
      .collection("user-modules")
      .findOne(
        { userAddress: addressMatchQuery(userAddress) },
        { projection: { promoCodeVerified: 1 } }
      );

    const verified = Boolean(doc?.promoCodeVerified);
    return NextResponse.json({ verified });
  } catch (e) {
    console.error("promo/check-status error", e);
    return NextResponse.json({ verified: false }, { status: 200 });
  }
}

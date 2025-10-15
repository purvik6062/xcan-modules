import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body?.code || "").trim();
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

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

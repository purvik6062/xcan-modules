import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import {
  getModuleData,
  normalizeModuleId,
  MODULE_ID_MAP,
  type ModuleIdentifier,
} from "@/lib/database/module-collections";
import {
  ensureModuleCertificateRecord,
  getGlobalCertificateName,
  normalizeCertificateName,
  setGlobalCertificateName,
  getModuleCertificateCount,
  formatCertificateId,
} from "@/lib/certification/ensure-module-certificate";

function toCertificateIssuedAtIso(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (typeof value === "object" && value !== null && "$date" in (value as any)) {
    const d = new Date((value as { $date: string }).$date);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
}

// One-time certificate generation per module per address
// POST: mark as generated with optional display name
// GET: check if generated

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await context.params;
    const { searchParams } = new URL(request.url);
    const userAddress = (searchParams.get("userAddress") || "").toLowerCase();

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing userAddress" },
        { status: 400 }
      );
    }

    const levelKey = searchParams.get("levelKey") || undefined;

    // Special case: arbitrum-stylus uses minted-nft with multiple levels
    if (module === "arbitrum-stylus") {
      const { db } = await connectToDatabase();
      const collection = db.collection("minted-nft");
      const doc = await collection.findOne(
        { userAddress },
        { projection: { _id: 0, certificates: 1 } }
      );
      const certs: any[] = Array.isArray(doc?.certificates)
        ? (doc as any).certificates
        : [];
      const matched = levelKey
        ? certs.find((c: any) => c?.levelKey === levelKey)
        : undefined;
      return NextResponse.json({
        generated: Boolean(matched),
        name: matched?.name || null,
      });
    }

    if (!MODULE_ID_MAP[module]) {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }
    const moduleId = normalizeModuleId(module as ModuleIdentifier);

    const { db } = await connectToDatabase();
    const moduleData = await getModuleData(db, userAddress, moduleId);
    const globalCertificateName = await getGlobalCertificateName(db, userAddress);
    const moduleCertificateCount = await getModuleCertificateCount(db, moduleId);
    const certificateId =
      moduleData?.certificateId ||
      (typeof moduleData?.certificateNumber === "number"
        ? formatCertificateId(moduleId, moduleData.certificateNumber)
        : null);

    return NextResponse.json({
      generated: Boolean(moduleData?.certificateGenerated),
      name:
        normalizeCertificateName(moduleData?.certificateName) ||
        globalCertificateName ||
        null,
      globalCertificateName,
      certificateGeneratedAt: toCertificateIssuedAtIso(
        moduleData?.certificateGeneratedAt
      ),
      certificateOnChainGenerated: Boolean(
        moduleData?.certificateOnChainGenerated
      ),
      patramCertificateLink: moduleData?.pataramCertificateLink || null,
      certificateNumber: moduleData?.certificateNumber || null,
      certificateId,
      moduleCertificateCount,
    });
  } catch (error: any) {
    console.error("Certificate generate GET error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await context.params;
    const body = await request.json();
    const userAddress: string = (body.userAddress || "").toLowerCase();
    const inputDisplayName = normalizeCertificateName(body.name);
    const levelKey: string | undefined = body.levelKey;

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing userAddress" },
        { status: 400 }
      );
    }

    // Special case: arbitrum-stylus uses minted-nft with multiple levels
    if (module === "arbitrum-stylus") {
      const { db } = await connectToDatabase();
      const globalCertificateName = await getGlobalCertificateName(db, userAddress);
      const displayName = inputDisplayName || globalCertificateName || "";
      if (!displayName) {
        return NextResponse.json(
          { error: "Please set your certificate name first" },
          { status: 400 }
        );
      }
      if (inputDisplayName) {
        await setGlobalCertificateName(db, userAddress, displayName);
      }
      const collection = db.collection("minted-nft");
      if (!levelKey) {
        return NextResponse.json(
          { error: "Missing levelKey" },
          { status: 400 }
        );
      }
      const existing = await collection.findOne(
        { userAddress, "mintedLevels.levelKey": levelKey },
        { projection: { _id: 0, certificates: 1 } }
      );
      if (!existing) {
        return NextResponse.json(
          { error: "Level not minted" },
          { status: 403 }
        );
      }
      const already = Array.isArray((existing as any).certificates)
        ? (existing as any).certificates.some(
            (c: any) => c?.levelKey === levelKey
          )
        : false;
      if (already) {
        return NextResponse.json({ success: true, already: true });
      }
      await collection.updateOne(
        { userAddress },
        {
          $set: { updatedAt: new Date() },
          $addToSet: {
            certificates: {
              $each: [{ levelKey, name: displayName, generatedAt: new Date() }],
            },
          },
        } as any,
        { upsert: true }
      );
      return NextResponse.json({ success: true });
    }

    if (!MODULE_ID_MAP[module]) {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }
    const moduleId = normalizeModuleId(module as ModuleIdentifier);

    const { db } = await connectToDatabase();
    const result = await ensureModuleCertificateRecord(db, userAddress, moduleId, {
      explicitName: inputDisplayName || undefined,
    });

    if (result.status === "skipped_no_name") {
      return NextResponse.json(
        { error: "Please set your certificate name first" },
        { status: 400 }
      );
    }

    const moduleCertificateCount = await getModuleCertificateCount(db, moduleId);

    if (result.status === "already") {
      return NextResponse.json({
        success: true,
        already: true,
        certificateNumber: result.certificateNumber,
        certificateId: result.certificateId,
        certificateGeneratedAt: toCertificateIssuedAtIso(
          result.certificateGeneratedAt
        ),
        moduleCertificateCount,
      });
    }

    return NextResponse.json({
      success: true,
      certificateNumber: result.certificateNumber,
      certificateId: result.certificateId,
      certificateGeneratedAt: result.certificateGeneratedAt.toISOString(),
      moduleCertificateCount: result.certificateNumber,
    });
  } catch (error: any) {
    console.error("Certificate generate POST error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

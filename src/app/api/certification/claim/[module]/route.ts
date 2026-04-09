import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongodb";
import {
  getModuleData,
  upsertCertification,
  updateModuleField,
  normalizeModuleId,
  MODULE_ID_MAP,
  type ModuleIdentifier,
} from "@/lib/database/module-collections";
import { ensureModuleCertificateRecord } from "@/lib/certification/ensure-module-certificate";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ module: string }> }
) {
  try {
    const { module } = await context.params;
    const body = await request.json();
    const userAddress: string = (body.userAddress || "").toLowerCase();
    const transactionHash: string | undefined = body.transactionHash;
    const metadataUrl: string | undefined = body.metadataUrl;
    const imageUrl: string | undefined = body.imageUrl;

    if (!userAddress) {
      return NextResponse.json(
        { error: "Missing userAddress" },
        { status: 400 }
      );
    }

    if (!MODULE_ID_MAP[module]) {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }
    const moduleId = normalizeModuleId(module as ModuleIdentifier);

    const { db } = await connectToDatabase();

    // Get existing module data to preserve structure
    const existing = await getModuleData(db, userAddress, moduleId);

    // Prepare certification entry
    const certificationEntry = {
      level: 1,
      levelName: module,
      claimed: true,
      mintedAt: new Date(),
      ...(transactionHash ? { transactionHash } : {}),
      ...(metadataUrl ? { metadataUrl } : {}),
      ...(imageUrl ? { imageUrl } : {}),
    };

    // Upsert certification (update if exists, add if new)
    await upsertCertification(db, userAddress, moduleId, certificationEntry, {
      upsert: true,
    });

    // After mint: same Patram-ready fields as manual generate (uses global certificateName).
    const certInit = await ensureModuleCertificateRecord(db, userAddress, moduleId);

    // Ensure base structure exists for precompiles-overview
    if (moduleId === "precompiles-overview" && !existing) {
      await updateModuleField(db, userAddress, moduleId, "challenges", [], {
        upsert: true,
      });
      await updateModuleField(
        db,
        userAddress,
        moduleId,
        "results",
        {},
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      certificateInit:
        certInit.status === "created"
          ? {
              created: true,
              certificateId: certInit.certificateId,
              certificateNumber: certInit.certificateNumber,
            }
          : certInit.status === "already"
            ? { created: false, already: true }
            : {
                created: false,
                deferred: true,
                message:
                  "Name not set yet; user can save it on the module certification page.",
              },
    });
  } catch (error: any) {
    console.error("Claim certification (dynamic) error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

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

    // Validate module using the authoritative MODULE_ID_MAP
    if (!MODULE_ID_MAP[module] && module !== "xcan-advocate") {
      return NextResponse.json(
        { error: "Unsupported module" },
        { status: 400 }
      );
    }

    // Special case: xcan-advocate uses advocates collection
    if (module === "xcan-advocate") {
      const { db } = await connectToDatabase();
      const collection = db.collection("advocates");
      const doc = await collection.findOne(
        { userAddress: userAddress },
        { projection: { _id: 0, certification: 1, isCompleted: 1 } }
      );

      const certifications = Array.isArray(doc?.certification)
        ? doc.certification
        : [];
      const matchingCertification = certifications.find(
        (cert: any) => cert.levelName === module
      );

      return NextResponse.json({
        claimed: Boolean(matchingCertification?.claimed),
        certification: matchingCertification || null,
        isCompleted: Boolean(doc?.isCompleted),
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

    // Find certification matching the requested module
    const certifications = Array.isArray(moduleData?.certification)
      ? moduleData.certification
      : [];
    const matchingCertification = certifications.find(
      (cert: any) => cert.levelName === module || cert.levelName === moduleId
    );

    return NextResponse.json({
      claimed: Boolean(matchingCertification?.claimed),
      certification: matchingCertification || null,
      isCompleted: Boolean(moduleData?.isCompleted),
    });
  } catch (error: any) {
    console.error("Get certification (dynamic) error", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

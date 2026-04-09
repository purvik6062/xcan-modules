import type { Db } from "mongodb";
import { addressMatchQuery } from "@/lib/utils/address";
import {
  getModuleData,
  updateModuleField,
  normalizeModuleId,
  type ModuleIdentifier,
} from "@/lib/database/module-collections";
import { getCertificatePrefixFromCanonicalModuleId } from "@/lib/certificate-prefix";

export function normalizeCertificateName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, 80);
}

async function getModuleCertificateCount(db: Db, moduleId: string) {
  const counters = db.collection("certificate-counters");
  const doc = await counters.findOne(
    { moduleId },
    { projection: { _id: 0, sequence: 1 } }
  );
  return Number(doc?.sequence || 0);
}

async function allocateModuleCertificateNumber(db: Db, moduleId: string) {
  const counters = db.collection("certificate-counters");
  const now = new Date();
  const result = await counters.findOneAndUpdate(
    { moduleId },
    {
      $inc: { sequence: 1 },
      $set: { updatedAt: now },
      $setOnInsert: { moduleId, createdAt: now },
    },
    { upsert: true, returnDocument: "after" }
  );
  return Number((result as any)?.sequence || 0);
}

function formatCertificateId(moduleId: string, certificateNumber: number) {
  const prefix = getCertificatePrefixFromCanonicalModuleId(moduleId);
  const padded = String(Math.max(0, Number(certificateNumber) || 0)).padStart(
    3,
    "0"
  );
  return `${prefix}-${padded}`;
}

export async function getGlobalCertificateName(
  db: Db,
  userAddress: string
): Promise<string | null> {
  const users = db.collection("users");
  const user = await users.findOne(
    { address: addressMatchQuery(userAddress) },
    { projection: { _id: 0, certificateName: 1 } }
  );
  return normalizeCertificateName(user?.certificateName) || null;
}

/** Legacy: name saved only on another module before global `users.certificateName` existed */
async function getCertificateNameFromSiblingModules(
  db: Db,
  userAddress: string,
  skipCanonicalModuleId: string
): Promise<string | null> {
  const doc = await db.collection("user-modules").findOne(
    { userAddress: addressMatchQuery(userAddress) },
    { projection: { modules: 1 } }
  );
  const modules = doc?.modules;
  if (!modules || typeof modules !== "object") return null;
  for (const [mid, data] of Object.entries(modules)) {
    if (mid === skipCanonicalModuleId) continue;
    const n = normalizeCertificateName((data as { certificateName?: string })?.certificateName);
    if (n) return n;
  }
  return null;
}

export async function setGlobalCertificateName(
  db: Db,
  userAddress: string,
  certificateName: string
) {
  const users = db.collection("users");
  const now = new Date();
  await users.updateOne(
    { address: addressMatchQuery(userAddress) },
    {
      $set: { certificateName, updatedAt: now },
      $setOnInsert: {
        address: userAddress,
        createdAt: now,
        isEmailVisible: false,
      },
    },
    { upsert: true }
  );
}

export type EnsureModuleCertificateResult =
  | {
      status: "already";
      certificateNumber: number | null;
      certificateId: string | null;
      certificateGeneratedAt: Date | null;
    }
  | {
      status: "created";
      certificateNumber: number;
      certificateId: string;
      certificateGeneratedAt: Date;
    }
  | { status: "skipped_no_name" };

/**
 * One-time per module: set certificateName, certificateNumber, Patram placeholders.
 * Called from manual "generate" and automatically after certification NFT claim (mint).
 */
export async function ensureModuleCertificateRecord(
  db: Db,
  userAddress: string,
  moduleId: ModuleIdentifier,
  options: { explicitName?: string } = {}
): Promise<EnsureModuleCertificateResult> {
  const canonicalId = normalizeModuleId(moduleId);
  const existing = await getModuleData(db, userAddress, canonicalId);

  if (existing?.certificateGenerated) {
    const certNum = existing?.certificateNumber;
    const certificateId =
      existing?.certificateId ||
      (typeof certNum === "number"
        ? formatCertificateId(canonicalId, certNum)
        : null);
    let at: Date | null = null;
    const raw = existing?.certificateGeneratedAt;
    if (raw instanceof Date && !Number.isNaN(raw.getTime())) at = raw;
    else if (typeof raw === "string") {
      const d = new Date(raw);
      at = Number.isNaN(d.getTime()) ? null : d;
    } else if (
      raw &&
      typeof raw === "object" &&
      "$date" in (raw as { $date: string })
    ) {
      const d = new Date((raw as { $date: string }).$date);
      at = Number.isNaN(d.getTime()) ? null : d;
    }
    return {
      status: "already",
      certificateNumber: typeof certNum === "number" ? certNum : null,
      certificateId,
      certificateGeneratedAt: at,
    };
  }

  const globalName = await getGlobalCertificateName(db, userAddress);
  const explicit = normalizeCertificateName(options.explicitName);
  const siblingName = await getCertificateNameFromSiblingModules(
    db,
    userAddress,
    canonicalId
  );
  const displayName =
    explicit ||
    normalizeCertificateName(existing?.certificateName) ||
    globalName ||
    siblingName ||
    "";

  if (!displayName) {
    return { status: "skipped_no_name" };
  }

  if (explicit) {
    await setGlobalCertificateName(db, userAddress, displayName);
  } else if (!globalName && siblingName && displayName === siblingName) {
    await setGlobalCertificateName(db, userAddress, displayName);
  }

  const certificateNumber = await allocateModuleCertificateNumber(
    db,
    canonicalId
  );
  const certificateId = formatCertificateId(canonicalId, certificateNumber);
  const certificateGeneratedAt = new Date();

  await updateModuleField(
    db,
    userAddress,
    canonicalId,
    "certificateGenerated",
    true,
    { upsert: true }
  );
  await updateModuleField(
    db,
    userAddress,
    canonicalId,
    "certificateName",
    displayName,
    { upsert: true }
  );
  await updateModuleField(
    db,
    userAddress,
    canonicalId,
    "certificateGeneratedAt",
    certificateGeneratedAt,
    { upsert: true }
  );
  await updateModuleField(
    db,
    userAddress,
    canonicalId,
    "certificateOnChainGenerated",
    false,
    { upsert: true }
  );
  await updateModuleField(
    db,
    userAddress,
    canonicalId,
    "pataramCertificateLink",
    null,
    { upsert: true }
  );
  await updateModuleField(
    db,
    userAddress,
    canonicalId,
    "certificateNumber",
    certificateNumber,
    { upsert: true }
  );
  await updateModuleField(
    db,
    userAddress,
    canonicalId,
    "certificateId",
    certificateId,
    { upsert: true }
  );

  return {
    status: "created",
    certificateNumber,
    certificateId,
    certificateGeneratedAt,
  };
}

export { getModuleCertificateCount, formatCertificateId };

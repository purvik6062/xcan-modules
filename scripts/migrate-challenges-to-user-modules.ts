import { WithId, Document } from "mongodb";
import { connectToDatabase, closeDatabase } from "../src/lib/database/mongodb";
import {
  COLLECTION_TO_MODULE_ID,
  ModuleId,
} from "../src/lib/database/module-collections";

type ChallengeDoc = WithId<Document> & {
  userAddress?: string;
  address?: string;
  walletAddress?: string;
};

/**
 * Derive the user address from a legacy challenge document.
 * Adjust this function if your legacy schema uses a different field name.
 */
function extractUserAddress(doc: ChallengeDoc): string | null {
  const addr =
    doc.userAddress || doc.address || doc.walletAddress || (doc as any).wallet;

  if (!addr || typeof addr !== "string") return null;
  return addr.toLowerCase();
}

/**
 * Build the module payload from a legacy challenge document.
 * Strips out Mongo's _id and any known top-level user identity fields so
 * only module-related data is stored under modules.<moduleId>.
 */
function buildModuleData(doc: ChallengeDoc, collectionName: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, userAddress, address, walletAddress, wallet, ...rest } =
    doc as any;

  return {
    ...rest,
    migratedFrom: collectionName,
    migratedAt: new Date(),
  };
}

async function migrateCollection(
  collectionName: string,
  moduleId: ModuleId
): Promise<{ processed: number; migrated: number; skipped: number }> {
  const { db } = await connectToDatabase();

  const cursor = db.collection<ChallengeDoc>(collectionName).find({});

  let processed = 0;
  let migrated = 0;
  let skipped = 0;

  // Use a session-less, per-document upsert into user-modules
  for await (const doc of cursor) {
    processed += 1;

    const userAddress = extractUserAddress(doc);
    if (!userAddress) {
      skipped += 1;
      console.warn(
        `[${collectionName}] Skipping document without user address:`,
        doc._id?.toString?.() ?? doc._id
      );
      continue;
    }

    // Check if this user already has data for this moduleId in user-modules.
    // If so, we SKIP to avoid overwriting existing progress and keep only unique data.
    const existing = await db.collection("user-modules").findOne(
      { userAddress },
      {
        projection: {
          [`modules.${moduleId}`]: 1,
        },
      }
    );

    if (existing?.modules && (existing.modules as any)[moduleId]) {
      skipped += 1;
      console.log(
        `[${collectionName}] Skipping user ${userAddress} for module "${moduleId}" because it already exists in user-modules.`
      );
      continue;
    }

    const moduleData = buildModuleData(doc, collectionName);

    await db.collection("user-modules").updateOne(
      { userAddress },
      {
        $set: {
          [`modules.${moduleId}`]: {
            ...moduleData,
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userAddress,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    migrated += 1;
  }

  return { processed, migrated, skipped };
}

async function main() {
  console.log(
    "Starting migration from legacy challenge collections to user-modules..."
  );

  // Only migrate the known challenge collections listed in COLLECTION_TO_MODULE_ID
  const entries = Object.entries(COLLECTION_TO_MODULE_ID);

  const totals = {
    processed: 0,
    migrated: 0,
    skipped: 0,
  };

  try {
    for (const [collectionName, moduleId] of entries) {
      console.log(
        `\nMigrating collection "${collectionName}" to module "${moduleId}"...`
      );

      const { processed, migrated, skipped } = await migrateCollection(
        collectionName,
        moduleId
      );

      totals.processed += processed;
      totals.migrated += migrated;
      totals.skipped += skipped;

      console.log(
        `Finished "${collectionName}": processed=${processed}, migrated=${migrated}, skipped=${skipped}`
      );
    }
  } catch (err) {
    console.error("Migration failed with error:", err);
  } finally {
    await closeDatabase();
  }

  console.log("\nMigration complete.");
  console.log(
    `Totals: processed=${totals.processed}, migrated=${totals.migrated}, skipped=${totals.skipped}`
  );
}

// Run if executed directly via ts-node / node (after transpilation)
// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();

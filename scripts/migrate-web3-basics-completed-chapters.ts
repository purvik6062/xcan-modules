import "dotenv/config";
import { connectToDatabase, closeDatabase } from "../src/lib/database/mongodb";
import { web3BasicsChapters } from "../src/data/web3BasicsChapters";

// Build lookup: chapter id -> { level, points }
const chapterLookup = new Map(
  web3BasicsChapters.map((ch) => [ch.id, { level: ch.level, points: ch.points }])
);

/**
 * Convert completedChapters from string format to object format with level and points.
 * String entries are looked up in web3BasicsChapters; unknown ids get level="Beginner", points=0.
 */
function migrateCompletedChapters(completedChapters: unknown[]): Array<{ id: string; level: string; points: number }> {
  return completedChapters.map((entry) => {
    if (typeof entry === "string") {
      const meta = chapterLookup.get(entry);
      return {
        id: entry,
        level: meta?.level ?? "Beginner",
        points: meta?.points ?? 0,
      };
    }
    // Already object format - ensure level and points exist
    const obj = entry as { id?: string; level?: string; points?: number };
    const meta = obj.id ? chapterLookup.get(obj.id) : null;
    return {
      id: obj.id ?? "",
      level: obj.level ?? meta?.level ?? "Beginner",
      points: obj.points ?? meta?.points ?? 0,
    };
  });
}

/**
 * Check if completedChapters needs migration (has any string entries)
 */
function needsMigration(completedChapters: unknown[]): boolean {
  return completedChapters.some((entry) => typeof entry === "string");
}

async function main() {
  console.log("Starting migration: web3-basics completedChapters (string -> object with level, points)...\n");

  const { db } = await connectToDatabase();
  const collection = db.collection("user-modules");

  const cursor = collection.find({
    "modules.web3-basics": { $exists: true },
    "modules.web3-basics.completedChapters": { $exists: true },
  });

  let processed = 0;
  let migrated = 0;
  let skipped = 0;

  for await (const doc of cursor) {
    processed += 1;
    const web3Module = (doc.modules as Record<string, unknown>)?.["web3-basics"] as
      | { completedChapters?: unknown[] }
      | undefined;

    const completedChapters = web3Module?.completedChapters ?? [];
    if (!Array.isArray(completedChapters) || completedChapters.length === 0) {
      skipped += 1;
      continue;
    }

    if (!needsMigration(completedChapters)) {
      skipped += 1;
      continue;
    }

    const migratedChapters = migrateCompletedChapters(completedChapters);

    await collection.updateOne(
      { _id: doc._id },
      {
        $set: {
          "modules.web3-basics.completedChapters": migratedChapters,
          "modules.web3-basics.updatedAt": new Date(),
          updatedAt: new Date(),
        },
      }
    );

    migrated += 1;
    console.log(
      `Migrated user ${(doc.userAddress as string) ?? doc._id}: ${completedChapters.length} chapters`
    );
  }

  await closeDatabase();

  console.log("\nMigration complete.");
  console.log(`Processed: ${processed}, Migrated: ${migrated}, Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DATABASE_NAME = "inorbit_modules";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    // Check if the connection is still alive
    try {
      await cachedClient.db("admin").admin().ping();
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      // Connection is dead, reset cache and reconnect
      console.log("MongoDB connection lost, reconnecting...");
      cachedClient = null;
      cachedDb = null;
    }
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  const db = client.db(DATABASE_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await closeDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDatabase();
  process.exit(0);
});

import { MongoClient, Db } from "mongodb";

let db: Db;

export async function connectDB(uri: string): Promise<Db> {
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db("foodo_pos");
  console.log("MongoDB connected");
  return db;
}

export function getDB(): Db {
  if (!db) throw new Error("DB not initialized");
  return db;
}
import { MongoClient, Db } from "mongodb";

let db: Db;
let client: MongoClient;

export async function connectDB(uri: string): Promise<Db> {
  if (db) {
    return db;
  }
  
  client = new MongoClient(uri);
  await client.connect();
  db = client.db("foodo_pos");
  console.log("MongoDB connected");
  return db;
}

export function getDB(): Db {
  if (!db) throw new Error("DB not initialized");
  return db;
}
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;
export const client = new MongoClient(uri);

export async function connectDB() {
  await client.connect();
  console.log("MongoDB connected");
}

export const db = client.db("foodo_pos");
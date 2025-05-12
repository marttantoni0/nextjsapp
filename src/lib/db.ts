import { MongoClient, ServerApiVersion, Collection, Document } from "mongodb";
import "server-only";

if (!process.env.DB_URI) {
  throw new Error("Mongo URI not found!");
}

const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function getDB(dbName: string) {
  try {
    await client.connect();
    console.log(">>>>Connected to DB<<<<");
    return client.db(dbName);
  } catch (err) {
    console.error("Error connecting to DB:", err);
    return null;
  }
}

// ✅ Función genérica para tipar los documentos que devuelve la colección
export async function getCollection<T extends Document = Document>(
  collectionName: string
): Promise<Collection<T>> {
  const db = await getDB("next_blog_db");
  if (!db) {
    throw new Error("No database connection.");
  }

  return db.collection<T>(collectionName);
}

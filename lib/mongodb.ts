import { MongoClient, ServerApiVersion } from 'mongodb';

// Use environment variables for the connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://1barmoshe1:<db_password>@main.fybre.mongodb.net/?retryWrites=true&w=majority&appName=main";
const dbName = process.env.MONGODB_DB || 'portfolio';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connection pool
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  };

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect();
  }
  
  clientPromise = globalWithMongo._mongoClientPromise || client.connect();
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper function to get a database instance
export async function getDatabase(customDbName?: string) {
  const client = await clientPromise;
  return client.db(customDbName || dbName);
}

// Helper function to get a collection
export async function getCollection(collectionName: string, customDbName?: string) {
  const db = await getDatabase(customDbName);
  return db.collection(collectionName);
} 
// MongoDB database connection - handles all our data storage
// This connects to MongoDB Atlas (cloud database) to store user presentations and history

import { MongoClient, ServerApiVersion } from 'mongodb';

// Get the database connection string from environment variables
const uri = process.env.MONGODB_URI;

// Make sure we have a database URL - can't work without it
if (!uri) {
  throw new Error('MONGODB_URI environment variable is not defined.');
}

// Create a MongoDB client with modern settings
// These settings ensure we're using the latest, most stable version
const client = new MongoClient(uri as string, {
  serverApi: {
    version: ServerApiVersion.v1,  // Use the stable API version
    strict: true,                  // Strict mode prevents deprecated features
    deprecationErrors: true,       // Show warnings about old code
  }
});

// Cache the database connection so we don't reconnect every time
// This is important for serverless functions that run frequently
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

// Connect to the database - reuses existing connection if available
export async function connectToDatabase() {
  // If a cached client already exists, return it immediately.
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If no client is cached, establish a new connection.
  try {
    await client.connect(); // Establish the connection to the MongoDB cluster.
    const db = client.db('snap2slides_db'); // Connect to a specific database (you can change 'snap2slides_db' in Atlas).

    // Cache the newly established connection and database instance.
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    throw new Error('Database connection failed. Check MongoDB URI and network access configuration.');
  }
}
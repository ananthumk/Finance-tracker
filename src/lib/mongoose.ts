import mongoose from "mongoose";

const mongo_url = process.env.MONGODB_URL || "";

if (!mongo_url) {
  throw new Error("Please define MONGODB_URL in your environment variables");
}

// Prevent model recompilation in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongo_url).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;
export { mongoose }; // ✅ optional but useful

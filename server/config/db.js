import mongoose from "mongoose";
let pending;
export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing");
  if (!pending) {
    pending = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    }).finally(() => { pending = undefined; });
  }
  return pending;
}

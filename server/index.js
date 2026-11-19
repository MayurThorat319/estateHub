
import "dotenv/config";
import dns from "node:dns";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

try {
  await connectDB();

  app.listen(process.env.PORT || 5000, "127.0.0.1", () => {
    console.log("MongoDB Atlas connected successfully");
    console.log("EstateHub API ready on port 5000");
  });
} catch (err) {
  console.error("Database connection failed:", err.message);
  process.exit(1);
}

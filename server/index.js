import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { connectDB } from "./config/db.js";
import resourcesRouter from "./routes/resources.js";
import statsRouter from "./routes/stats.js";
const app = express();
const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(helmet());
app.use(cors({ origin: origin.split(",").map((x) => x.trim()) }));
app.use(express.json({ limit: "100kb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.get("/api/health", (req, res) => res.json({ data: { status: "ok" } }));
app.use("/api/stats", statsRouter);
app.use("/api", resourcesRouter);
app.use((req, res) => res.status(404).json({ message: "Not found" }));
app.use((err, req, res, next) => {
  if (err.name === "ValidationError")
    return res.status(400).json({
      message: Object.values(err.errors)
        .map((e) => e.message)
        .join("; "),
    });
  if (err.name === "CastError")
    return res.status(400).json({ message: "Invalid value" });
  console.error(err);
  res.status(500).json({ message: "Unexpected server error" });
});
try {
  await connectDB();
  app.listen(process.env.PORT || 5000, () =>
    console.log(
      `EstateHub API http://localhost:${process.env.PORT || 5000}/api`,
    ),
  );
} catch (err) {
  console.error("Database connection failed:", err.message);
  process.exit(1);
}

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { connectDB } from "./config/db.js";
import resourcesRouter from "./routes/resources.js";
import statsRouter from "./routes/stats.js";
import operationsRouter from "./routes/operations.js";
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
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
app.use("/api", async (req, res, next) => {
  res.set("Cache-Control", "no-store");
  try { await connectDB(); next(); }
  catch (err) { console.error("Database connection failed:", err.message); res.status(503).json({ message: "Database unavailable" }); }
});
app.get("/api/health", (req, res) => res.json({ data: { status: "ok" } }));
app.use("/api/stats", statsRouter);
app.use("/api", operationsRouter);
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
export default app;

import { Router } from "express";
import { Property, Activity } from "../models/index.js";
const router = Router();
router.get("/", async (req, res) => {
  const [properties, activities] = await Promise.all([
    Property.find().lean(),
    Activity.find().lean(),
  ]);
  const sellCount = properties.filter((p) => p.listing !== "Rent").length,
    rentCount = properties.length - sellCount,
    total = properties.length;
  const sellPercent = total ? Math.round((100 * sellCount) / total) : 0;
  const now = new Date();
  const weekly = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (day) => ({ day, rent: 0, sell: 0 }),
  );
  const monthly = Array(12).fill(0);
  let revenue = 0;
  for (const a of activities) {
    const date = new Date(a.date || a.createdAt);
    if (Number.isNaN(date.valueOf())) continue;
    if (a.type === "Sell") {
      revenue += Number(a.amount) || 0;
      if (date.getFullYear() === now.getFullYear())
        monthly[date.getMonth()] += Number(a.amount) || 0;
    }
    const diff = (now - date) / 86400000;
    if (diff >= 0 && diff < 7) {
      const index = (date.getDay() + 6) % 7;
      weekly[index][a.type === "Rent" ? "rent" : "sell"]++;
    }
  }
  res.json({
    data: {
      sellCount,
      rentCount,
      sellPercent,
      rentPercent: total ? 100 - sellPercent : 0,
      revenue,
      weekly,
      monthly,
    },
  });
});
export default router;

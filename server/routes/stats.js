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
  // Count real listings by their MongoDB creation timestamp, not demo activities.
  const period = ["week", "month", "year"].includes(req.query.period)
    ? req.query.period : "week";
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const startOfWeek = new Date(currentYear, currentMonth, now.getDate() - (now.getDay() + 6) % 7);
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const startOfYear = new Date(currentYear, 0, 1);
  const start = period === "week" ? startOfWeek : period === "month" ? startOfMonth : startOfYear;
  const end = period === "week"
    ? new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 7)
    : period === "month" ? new Date(currentYear, currentMonth + 1, 1)
    : new Date(currentYear + 1, 0, 1);
  const labels = period === "week"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : period === "month"
      ? Array.from({ length: Math.ceil(new Date(currentYear, currentMonth + 1, 0).getDate() / 7) }, (_, i) => `Week ${i + 1}`)
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const breakdown = labels.map((label) => ({ label, rent: 0, sell: 0 }));
  for (const property of properties) {
    const date = new Date(property.createdAt);
    if (Number.isNaN(date.valueOf()) || date < start || date >= end || date > now) continue;
    const index = period === "week"
      ? Math.floor((new Date(date.getFullYear(), date.getMonth(), date.getDate()) - startOfWeek) / 86400000)
      : period === "month" ? Math.floor((date.getDate() - 1) / 7) : date.getMonth();
    if (breakdown[index]) breakdown[index][property.listing === "Rent" ? "rent" : "sell"] += 1;
  }
  res.json({
    data: {
      breakdown: { period, start: start.toISOString(), end: end.toISOString(), buckets: breakdown },
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

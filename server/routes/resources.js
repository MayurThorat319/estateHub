import { Router } from "express";
import mongoose from "mongoose";
import { resources } from "../models/index.js";
const router = Router();
const writableFields = {
  properties: [
    "name",
    "location",
    "price",
    "listing",
    "type",
    "status",
    "image",
  ],
  agents: ["name", "sales", "rent", "amount", "avatar"],
  enquiries: ["name", "property", "request", "city", "status"],
  appointments: ["date", "time", "title", "with", "city"],
  messages: ["from", "message"],
  notifications: ["message", "read"],
  activities: [
    "type",
    "name",
    "agent",
    "property",
    "city",
    "availability",
    "price",
    "amount",
    "date",
  ],
};
const select = (req) => resources[req.params.resource];
const pick = (body, name) =>
  Object.fromEntries(
    writableFields[name]
      .filter((key) => Object.hasOwn(body, key))
      .map((key) => [key, body[key]]),
  );
router.param("resource", (req, res, next, name) =>
  resources[name]
    ? next()
    : res.status(404).json({ message: "Unknown resource" }),
);
router.get("/:resource", async (req, res) => {
  const result = await select(req)
    .find()
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
  res.json({ data: result });
});
router.post("/:resource", async (req, res) => {
  const record = await select(req).create(pick(req.body, req.params.resource));
  res.status(201).json({ data: record });
});
router.patch("/notifications/read-all", async (req, res) => {
  const result = await resources.notifications.updateMany(
    { read: false },
    { $set: { read: true } },
  );
  res.json({ data: { modified: result.modifiedCount } });
});
router.get("/:resource/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid ID" });
  const result = await select(req).findById(req.params.id).lean();
  if (!result) return res.status(404).json({ message: "Record not found" });
  res.json({ data: result });
});
const update = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid ID" });
  const result = await select(req).findByIdAndUpdate(
    req.params.id,
    { $set: pick(req.body, req.params.resource) },
    { new: true, runValidators: true },
  );
  if (!result) return res.status(404).json({ message: "Record not found" });
  res.json({ data: result });
};
router.put("/:resource/:id", update);
router.patch("/:resource/:id", update);
router.delete("/:resource/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid ID" });
  const result = await select(req).findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: "Record not found" });
  res.json({ data: { deleted: true } });
});
export default router;

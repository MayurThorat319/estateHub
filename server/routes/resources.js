import { Router } from "express";
import mongoose from "mongoose";
import { resources, Activity, Notification, Agent } from "../models/index.js";
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
    "agentId",
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
async function propertyAgent(body) {
  if (!Object.hasOwn(body, "agentId")) return {};
  if (body.agentId == null || body.agentId === "") return { agentId: null, agentName: "" };
  if (!mongoose.isValidObjectId(body.agentId)) return { error: "Invalid agent ID" };
  const agent = await Agent.findById(body.agentId).select("name").lean();
  return agent ? { agentId: agent._id, agentName: agent.name } : { error: "Selected agent does not exist" };
}
router.post("/:resource", async (req, res) => {
  const payload = pick(req.body, req.params.resource);
  let agentName = "";
  if (req.params.resource === "properties") {
    const assignment = await propertyAgent(req.body);
    if (assignment.error) return res.status(400).json({ message: assignment.error });
    if (Object.hasOwn(assignment, "agentId")) payload.agentId = assignment.agentId;
    agentName = assignment.agentName || "";
  }
  const record = await select(req).create(payload);
  if (req.params.resource === "properties") {
    await Activity.create({ action:"Property added", agent:agentName, agentId:record.agentId, type:record.listing,name:record.name,property:record.type,city:record.location,price:String(record.price) });
    await Notification.create({ message:`New ${record.listing.toLowerCase()} property added: ${record.name}` });
  }
  if (req.params.resource === "enquiries") await Notification.create({ message:`New inquiry from ${record.name} about ${record.property || "a property"}` });
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
  const payload = pick(req.body, req.params.resource);
  let agentName;
  if (req.params.resource === "properties") {
    const assignment = await propertyAgent(req.body);
    if (assignment.error) return res.status(400).json({ message: assignment.error });
    if (Object.hasOwn(assignment, "agentId")) payload.agentId = assignment.agentId;
    agentName = assignment.agentName;
  }
  const result = await select(req).findByIdAndUpdate(
    req.params.id,
    { $set: payload },
    { new: true, runValidators: true },
  );
  if (!result) return res.status(404).json({ message: "Record not found" });
  if (req.params.resource === "properties") {
    if (agentName === undefined && result.agentId) agentName = (await Agent.findById(result.agentId).select("name").lean())?.name || "";
    await Activity.create({action:"Property updated",agent:agentName || "",agentId:result.agentId,type:result.listing,name:result.name,property:result.type,city:result.location,price:String(result.price)});
  }
  if (req.params.resource === "enquiries" && req.body.status) await Notification.create({message:`Inquiry for ${result.property || "property"} changed to ${result.status}`});
  res.json({ data: result });
};
router.put("/:resource/:id", update);
router.patch("/:resource/:id", update);
router.delete("/:resource/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid ID" });
  const result = await select(req).findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ message: "Record not found" });
  if (req.params.resource === "properties") {
    const agentName = result.agentId ? (await Agent.findById(result.agentId).select("name").lean())?.name || "" : "";
    await Activity.create({action:"Property deleted",agent:agentName,agentId:result.agentId,type:result.listing,name:result.name,property:result.type,city:result.location,price:String(result.price)});
  }
  res.json({ data: { deleted: true } });
});
export default router;

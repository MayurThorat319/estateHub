import { Router } from "express";
import mongoose from "mongoose";
import { Activity, Agent, Appointment, Notification } from "../models/index.js";
const router = Router();
router.get("/top-agents", async (req,res) => {
  const [agents, results] = await Promise.all([
    Agent.find().lean(),
    Activity.aggregate([
      { $match: { action: "Transaction completed", agentId: { $ne: null } } },
      { $group: { _id: "$agentId", sales: { $sum: { $cond: [{ $eq: ["$type", "Sell"] }, 1, 0] } }, rent: { $sum: { $cond: [{ $eq: ["$type", "Rent"] }, 1, 0] } }, amount: { $sum: "$amount" } } }
    ])
  ]);
  const byId = new Map(results.map(item => [String(item._id),item]));
  const ranked = agents.map(a => {
    const t=byId.get(String(a._id)) || {sales:0,rent:0,amount:0};
    return {_id:a._id,name:a.name,avatar:a.avatar,sales:t.sales,rent:t.rent,totalAmount:t.amount};
  }).sort((a,b) => b.totalAmount-a.totalAmount || b.sales+b.rent-a.sales-a.rent || a.name.localeCompare(b.name));
  res.json({data:ranked});
});
router.post("/transactions", async (req,res) => {
  const {agentId,propertyName,type,amount,city="",propertyType=""}=req.body;
  if (!mongoose.isValidObjectId(agentId)) return res.status(400).json({message:"Choose a valid agent"});
  const agent=await Agent.findById(agentId);
  if (!agent) return res.status(404).json({message:"Agent not found"});
  if (!["Rent","Sell"].includes(type) || !String(propertyName||"").trim() || !Number.isFinite(Number(amount)) || Number(amount)<=0)
    return res.status(400).json({message:"Enter a property name, transaction type and positive amount"});
  const record=await Activity.create({action:"Transaction completed",type,name:String(propertyName).trim(),agent:agent.name,agentId:agent._id,property:String(propertyType),city:String(city),price:new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(amount)),amount:Number(amount),availability:"Completed"});
  await Notification.create({message:`${agent.name} completed a ${type.toLowerCase()} transaction: ${record.name}`});
  res.status(201).json({data:record});
});
router.post("/calendar",async(req,res)=>{
  const {date,time,title,with:contact="",city=""}=req.body;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date)) || Number.isNaN(new Date(`${date}T00:00:00`).valueOf()) || !String(time||"").trim() || !String(title||"").trim())
    return res.status(400).json({message:"Enter a valid date, time and appointment title"});
  const record=await Appointment.create({date,time,title,with:contact,city});
  await Notification.create({message:`Appointment scheduled: ${record.title} on ${record.date} at ${record.time}`});
  res.status(201).json({data:record});
});
router.delete("/calendar/:id",async(req,res)=>{
  if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message:"Invalid appointment ID"});
  const appointment=await Appointment.findByIdAndDelete(req.params.id);
  if(!appointment) return res.status(404).json({message:"Appointment not found"});
  await Notification.create({message:`Appointment cancelled: ${appointment.title} (${appointment.date})`});
  res.json({data:{deleted:true}});
});
export default router;

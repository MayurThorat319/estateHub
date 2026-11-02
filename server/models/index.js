import mongoose from "mongoose";
const opts = { timestamps: true };
const required = { type: String, required: true, trim: true };
const propertySchema = new mongoose.Schema(
  {
    name: required,
    location: required,
    price: { type: Number, required: true, min: 1 },
    listing: { type: String, enum: ["Rent", "Sell"], default: "Sell" },
    type: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Office", "Warehouse", "Plot"],
      default: "Apartment",
    },
    status: {
      type: String,
      enum: ["Available", "Selling Fast", "Upcoming", "Sold", "Rented"],
      default: "Available",
    },
    image: { type: String, default: "" },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
  },
  opts,
);
const agentSchema = new mongoose.Schema(
  {
    name: required,
    sales: { type: Number, default: 0, min: 0 },
    rent: { type: Number, default: 0, min: 0 },
    amount: { type: String, default: "₹0" },
    avatar: { type: String, default: "" },
  },
  opts,
);
const enquirySchema = new mongoose.Schema(
  {
    name: required,
    property: { type: String, default: "" },
    request: required,
    city: { type: String, default: "" },
    status: {
      type: String,
      enum: ["New", "Follow-up", "Closed"],
      default: "New",
    },
  },
  opts,
);
const appointmentSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    time: required,
    title: required,
    with: { type: String, default: "" },
    city: { type: String, default: "" },
  },
  opts,
);
const messageSchema = new mongoose.Schema(
  { from: required, message: required },
  opts,
);
const notificationSchema = new mongoose.Schema(
  { message: required, read: { type: Boolean, default: false } },
  opts,
);
const activitySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Rent", "Sell"], required: true },
    name: required,
    agent: { type: String, default: "" },
    property: { type: String, default: "" },
    city: { type: String, default: "" },
    availability: { type: String, default: "" },
    price: { type: String, default: "" },
    amount: { type: Number, default: 0, min: 0 },
    action: { type: String, default: "Legacy record" },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
    date: { type: Date, default: Date.now },
  },
  opts,
);
export const Property = mongoose.model("Property", propertySchema);
export const Agent = mongoose.model("Agent", agentSchema);
export const Enquiry = mongoose.model("Enquiry", enquirySchema);
export const Appointment = mongoose.model("Appointment", appointmentSchema);
export const Message = mongoose.model("Message", messageSchema);
export const Notification = mongoose.model("Notification", notificationSchema);
export const Activity = mongoose.model("Activity", activitySchema);
export const resources = {
  properties: Property,
  agents: Agent,
  enquiries: Enquiry,
  appointments: Appointment,
  messages: Message,
  notifications: Notification,
  activities: Activity,
};

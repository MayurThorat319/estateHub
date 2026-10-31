import "dotenv/config";
import { connectDB } from "./config/db.js";
import {
  Property,
  Agent,
  Enquiry,
  Appointment,
  Message,
  Notification,
  Activity,
} from "./models/index.js";
await connectDB();
const fixtures = [
  [
    Property,
    [
      {
        name: "EV City",
        location: "Navi Mumbai",
        price: 8500000,
        listing: "Sell",
        type: "Apartment",
        status: "Available",
        image:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900",
      },
      {
        name: "Malibu West",
        location: "Kopar Khairane",
        price: 7200000,
        listing: "Sell",
        type: "House",
        status: "Selling Fast",
      },
      {
        name: "Garden View Home",
        location: "Navi Mumbai",
        price: 45000,
        listing: "Rent",
        type: "House",
        status: "Available",
      },
    ],
  ],
  [
    Agent,
    [
      {
        name: "Aarav Mehta",
        sales: 10,
        rent: 8,
        amount: "₹4,902",
        avatar: "AM",
      },
      { name: "Priya Shah", sales: 8, rent: 7, amount: "₹3,390", avatar: "PS" },
    ],
  ],
  [
    Enquiry,
    [
      {
        name: "Aditi Joshi",
        property: "EV City",
        request: "2 BHK site visit",
        city: "Navi Mumbai",
        status: "New",
      },
    ],
  ],
  [
    Appointment,
    [
      {
        date: "2026-11-02",
        time: "11:00 AM",
        title: "EV City site visit",
        with: "Aditi Joshi",
        city: "Navi Mumbai",
      },
    ],
  ],
  [
    Message,
    [
      {
        from: "Priya Shah",
        message: "Can we schedule a site visit in Navi Mumbai?",
      },
    ],
  ],
  [
    Notification,
    [{ message: "Example: New enquiry for EV City", read: false }],
  ],
  [
    Activity,
    [
      {
        type: "Sell",
        name: "EV City",
        agent: "Aarav Mehta",
        property: "Apartment",
        city: "Navi Mumbai",
        availability: "Available",
        price: "₹85,00,000",
        amount: 8500000,
        date: new Date(),
      },
    ],
  ],
];
for (const [Model, records] of fixtures) {
  if ((await Model.countDocuments()) === 0) {
    await Model.insertMany(records);
    console.log("Seeded example records:", Model.modelName);
  }
}
console.log(
  "Sample seed complete. Records are DEMO data, not real transactions.",
);
process.exit(0);

import { useEffect, useState } from "react";
import "./PropertyForm.css";
const blank = {
  name: "",
  location: "",
  price: "",
  listing: "Sell",
  type: "Apartment",
  status: "Available",
  image: "",
  agentId: "",
};
export default function PropertyForm({
  initial,
  onSave,
  onClose,
  busy,
  error,
  activeView,
  agents = [],
}) {
  const [data, setData] = useState(blank);
  useEffect(
    () =>
      setData(
        initial
          ? { ...blank, ...initial, agentId: initial.agentId || "" }
          : { ...blank, listing: activeView === "Rent" ? "Rent" : "Sell" },
      ),
    [initial, activeView],
  );
  function change(e) {
    setData((p) => ({ ...p, [e.target.name]: e.target.value }));
  }
  return (
    <form
      className="project-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...data, price: Number(data.price) });
      }}
    >
      <div className="form-heading">
        <div>
          <h3>{initial ? "Edit Property" : "Add New Property"}</h3>
          <p>Saved to MongoDB via the API.</p>
        </div>
        <button
          className="close-form"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="form-fields">
        <input
          name="name"
          value={data.name}
          onChange={change}
          placeholder="Property name"
          required
        />
        <input
          name="location"
          value={data.location}
          onChange={change}
          placeholder="Location"
          required
        />
        <input
          name="price"
          type="number"
          min="1"
          value={data.price}
          onChange={change}
          placeholder="Price in INR"
          required
        />
        <select name="agentId" value={data.agentId || ""} onChange={change} aria-label="Assigned agent (optional)">
          <option value="">No agent assigned (optional)</option>
          {agents.map((agent) => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
        </select>
        <select name="listing" value={data.listing} onChange={change}>
          <option>Sell</option>
          <option>Rent</option>
        </select>
        <select name="type" value={data.type} onChange={change}>
          {["Apartment", "House", "Villa", "Office", "Warehouse", "Plot"].map(
            (v) => (
              <option key={v}>{v}</option>
            ),
          )}
        </select>
        <select name="status" value={data.status} onChange={change}>
          {["Available", "Selling Fast", "Upcoming", "Sold", "Rented"].map(
            (v) => (
              <option key={v}>{v}</option>
            ),
          )}
        </select>
        <input
          name="image"
          type="url"
          value={data.image || ""}
          onChange={change}
          placeholder="Image URL (optional)"
        />
        <button className="add-button" type="submit" disabled={busy}>
          {busy ? "Saving..." : "Save Property"}
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

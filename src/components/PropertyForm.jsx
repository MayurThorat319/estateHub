import { useEffect, useRef, useState } from "react";
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
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
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
    <dialog
      ref={dialogRef}
      className="property-dialog"
      aria-labelledby="property-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
    >
      <form
        className="property-dialog-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (busy) return;
          onSave({ ...data, price: Number(data.price) });
        }}
      >
        <header className="property-dialog-header">
          <h2 id="property-dialog-title">
            {initial ? "Edit Property" : "Add Property"}
          </h2>
          <p>
            {initial
              ? "Update the details of this listing."
              : "Enter the details for your new listing."}
          </p>
          <button
            className="property-dialog-close"
            type="button"
            disabled={busy}
            onClick={onClose}
            aria-label="Close property dialog"
          >
            ×
          </button>
        </header>
        <div className="property-dialog-body">
          {error && (
            <p className="property-dialog-error" role="alert">
              {error}
            </p>
          )}
          <div className="property-dialog-fields">
            <label className="property-field">
              <span>
                Property name <span className="property-required">*</span>
              </span>
              <input
                name="name"
                autoFocus
                value={data.name}
                onChange={change}
                placeholder="Property name"
                required
              />
            </label>
            <label className="property-field">
              <span>
                Location <span className="property-required">*</span>
              </span>
              <input
                name="location"
                value={data.location}
                onChange={change}
                placeholder="Location"
                required
              />
            </label>
            <label className="property-field">
              <span>
                Price (₹) <span className="property-required">*</span>
              </span>
              <input
                name="price"
                type="number"
                min="1"
                value={data.price}
                onChange={change}
                placeholder="Price in INR"
                required
              />
            </label>
            <label className="property-field">
              <span>Assigned agent</span>
              <select
                name="agentId"
                value={data.agentId || ""}
                onChange={change}
                aria-label="Assigned agent (optional)"
              >
                <option value="">No agent assigned (optional)</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="property-field">
              <span>Listing purpose</span>
              <select name="listing" value={data.listing} onChange={change}>
                <option>Sell</option>
                <option>Rent</option>
              </select>
            </label>
            <label className="property-field">
              <span>Property type</span>
              <select name="type" value={data.type} onChange={change}>
                {[
                  "Apartment",
                  "House",
                  "Villa",
                  "Office",
                  "Warehouse",
                  "Plot",
                ].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label className="property-field">
              <span>Status</span>
              <select name="status" value={data.status} onChange={change}>
                {[
                  "Available",
                  "Selling Fast",
                  "Upcoming",
                  "Sold",
                  "Rented",
                ].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label className="property-field property-field-wide">
              <span>Image URL (optional)</span>
              <input
                name="image"
                type="url"
                value={data.image || ""}
                onChange={change}
                placeholder="Image URL (optional)"
              />
            </label>
          </div>
        </div>
        <footer className="property-dialog-footer">
          <button
            className="property-cancel"
            type="button"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            className="add-button property-save"
            type="submit"
            disabled={busy}
          >
            {busy ? "Saving..." : initial ? "Save Changes" : "Add Property"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}

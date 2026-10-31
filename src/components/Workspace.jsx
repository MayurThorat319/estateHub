import { useState } from "react";
import { api } from "../services/api";
import "./Workspace.css";
export default function Workspace({
  activeView,
  enquiries,
  agents,
  messages,
  onRefresh,
}) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function send(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setBusy(true);
    setError("");
    try {
      await api.post("/messages", { from: "Admin", message: draft.trim() });
      setDraft("");
      await onRefresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="workspace-panel panel">
      <div className="section-heading">
        <h2>{activeView}</h2>
        <span className="filter-label">Live records · India</span>
      </div>
      {activeView === "Inquiry" && (
        <div className="workspace-list">
          {enquiries.map((item) => (
            <article className="workspace-entry" key={item._id}>
              <div>
                <strong>{item.name}</strong>
                <p>
                  {item.request} · {item.property}
                </p>
                <small>
                  {item.city} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString("en-IN")}
                </small>
              </div>
              <select
                aria-label="Inquiry status"
                value={item.status}
                onChange={async (e) => {
                  try {
                    await api.patch(`/enquiries/${item._id}`, {
                      status: e.target.value,
                    });
                    await onRefresh();
                  } catch (e) {
                    setError(e.message);
                  }
                }}
              >
                <option>New</option>
                <option>Follow-up</option>
                <option>Closed</option>
              </select>
            </article>
          ))}
          {!enquiries.length && <p>No inquiries yet.</p>}
        </div>
      )}
      {activeView === "Agent" && (
        <div className="workspace-list">
          {agents.map((agent) => (
            <article className="workspace-entry" key={agent._id}>
              <div className="agent-avatar">
                {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="workspace-grow">
                <strong>{agent.name}</strong>
                <p>
                  {agent.sales} sales · {agent.rent} rentals
                </p>
              </div>
              <strong>{agent.amount || "₹0"}</strong>
            </article>
          ))}
          {!agents.length && <p>No agents yet.</p>}
        </div>
      )}
      {activeView === "Chat" && (
        <>
          <div className="workspace-list">
            {messages.map((msg) => (
              <article className="workspace-entry" key={msg._id}>
                <div>
                  <strong>{msg.from}</strong>
                  <p>{msg.message}</p>
                  <small>
                    {new Date(msg.createdAt).toLocaleString("en-IN")}
                  </small>
                </div>
              </article>
            ))}
            {!messages.length && <p>No messages yet.</p>}
          </div>
          <form className="chat-compose" onSubmit={send}>
            <input
              aria-label="New message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message..."
            />
            <button type="submit" disabled={busy} className="add-button">
              Send
            </button>
          </form>
        </>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}

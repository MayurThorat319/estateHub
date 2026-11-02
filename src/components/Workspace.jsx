import { formatINR } from "../utils/money";
import { useState } from "react";
import { api } from "../services/api";
import "./Workspace.css";
import "./AgentActions.css";
export default function Workspace({
  activeView,
  enquiries,
  agents,
  messages,
  onRefresh,
}) {
  const [draft, setDraft] = useState("");
  const [agentName,setAgentName]=useState("");
  const [transaction,setTransaction]=useState({agentId:"",propertyName:"",type:"Sell",amount:""});
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
  async function createAgent(e){e.preventDefault();setBusy(true);setError('');try{await api.post('/agents',{name:agentName.trim()});setAgentName('');await onRefresh()}catch(e){setError(e.message)}finally{setBusy(false)}}
  async function recordTransaction(e){e.preventDefault();setBusy(true);setError('');try{await api.post('/transactions',transaction);setTransaction({agentId:'',propertyName:'',type:'Sell',amount:''});await onRefresh()}catch(e){setError(e.message)}finally{setBusy(false)}}
  const money = formatINR;
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
      {activeView === "Agent" && (<>
        <form className="agent-action-form" onSubmit={createAgent}><strong>Add agent</strong><input required value={agentName} onChange={e=>setAgentName(e.target.value)} placeholder="Full agent name"/><button className="add-button" disabled={busy} type="submit">Add</button></form>
        <form className="agent-action-form" onSubmit={recordTransaction}><strong>Record completed sale / rental</strong><select required value={transaction.agentId} onChange={e=>setTransaction({...transaction,agentId:e.target.value})}><option value="">Choose agent</option>{agents.map(a=><option key={a._id} value={a._id}>{a.name}</option>)}</select><select value={transaction.type} onChange={e=>setTransaction({...transaction,type:e.target.value})}><option value="Sell">Sell</option><option value="Rent">Rent</option></select><input required value={transaction.propertyName} placeholder="Property name" onChange={e=>setTransaction({...transaction,propertyName:e.target.value})}/><input required type="number" min="1" step="any" value={transaction.amount} placeholder="Completed value (₹)" onChange={e=>setTransaction({...transaction,amount:e.target.value})}/><button type="submit" disabled={busy||!agents.length} className="add-button">Record Transaction</button></form>
        <p className="agent-explainer">Ranked by completed transaction value. Adding property listings does not increase agent sales.</p>
        <div className="workspace-list">
          {agents.map((agent) => (
            <article className="workspace-entry" key={agent._id}>
              <div className="agent-avatar">
                {agent.avatar || agent.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="workspace-grow">
                <strong>{agent.name}</strong>
                <p>
                  {agent.sales} completed sales · {agent.rent} completed rentals
                </p>
              </div>
              <strong>{money(agent.totalAmount)}</strong>
            </article>
          ))}
          {!agents.length && <p>No agents yet. Add an agent above.</p>}
        </div></> 
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

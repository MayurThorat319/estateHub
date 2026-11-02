import { formatActivityAmount } from "../utils/money";
import { useMemo, useRef, useState } from "react";
import "./RecentActivities.css";
export default function RecentActivities({activities=[]}) {
 const viewport=useRef(null);
 const [filter,setFilter]=useState("all");
 const [sort,setSort]=useState("newest");
 const filtered=useMemo(()=>activities.filter(a=>filter==="all" || (filter==="transaction" ? a.action==="Transaction completed" : a.action?.startsWith("Property"))).sort((a,b)=>sort==="newest" ? new Date(b.date||b.createdAt)-new Date(a.date||a.createdAt) : new Date(a.date||a.createdAt)-new Date(b.date||b.createdAt)),[activities,filter,sort]);
 const fmt=v=>v?new Date(v).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}):"—";
 return <section className="activities-section" id="activities"><div className="section-heading"><h2>Recent Activities</h2><div className="activity-controls">
 <select aria-label="Filter activities" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All activities</option><option value="property">Property changes</option><option value="transaction">Transactions</option></select>
 <select aria-label="Activity order" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option></select>
 <button type="button" aria-label="Scroll left" onClick={()=>viewport.current?.scrollBy({left:-320,behavior:"smooth"})}>‹</button><button type="button" aria-label="Scroll right" onClick={()=>viewport.current?.scrollBy({left:320,behavior:"smooth"})}>›</button></div></div>
 <div className="table-wrapper" ref={viewport} tabIndex={0}><table className="activity-table"><thead><tr><th>Date</th><th>Action</th><th>Listing</th><th>Agent</th><th>Type</th><th>City</th><th>Amount / Price</th></tr></thead><tbody>{filtered.map(a=><tr key={a._id}><td>{fmt(a.date||a.createdAt)}</td><td>{a.action||"Legacy record"}</td><td>{a.name}</td><td>{a.agent||"—"}</td><td><span className={`type-tag ${String(a.type).toLowerCase()}`}>{a.type}</span></td><td>{a.city||"—"}</td><td>{formatActivityAmount(a)}</td></tr>)}{!filtered.length && <tr><td colSpan="7" className="eh-empty-cell">No activities in this category yet.</td></tr>}</tbody></table></div></section>;
}

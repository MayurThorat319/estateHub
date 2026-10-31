import {useState} from 'react';
import ProjectCard from './ProjectCard';
import './RightSidebar.css';
export default function RightSidebar({theme,setTheme,openUtility,setOpenUtility,notifications,appointments,compactRows,setCompactRows,showPrices,setShowPrices,filteredProjects,deleteProject,onEditProject,onMarkRead,activeView}) {
const [appointmentDate,setAppointmentDate]=useState(new Date().toISOString().slice(0,10));
return (<>      {/* RIGHT SIDEBAR */}
      <aside className="right-sidebar">
        <div className="quick-actions">
          <button type="button" title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} aria-pressed={theme === "dark"}
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}>{theme === "light" ? "☾" : "☀"}</button>
          <button type="button" title="Notifications" aria-label="Notifications" aria-expanded={openUtility === "Notifications"}
            onClick={() => setOpenUtility((v) => v === "Notifications" ? null : "Notifications")}>♧{notifications.some(n=>!n.read) && <i className="notification-dot" />}</button>
          <button type="button" title="Appointments" aria-label="Appointments" aria-expanded={openUtility === "Calendar"}
            onClick={() => setOpenUtility((v) => v === "Calendar" ? null : "Calendar")}>▦</button>
          <button type="button" title="Settings" aria-label="Settings" aria-expanded={openUtility === "Settings"}
            onClick={() => setOpenUtility((v) => v === "Settings" ? null : "Settings")}>⚙</button>
        </div>
        {openUtility && <section className="utility-popover" aria-label={`${openUtility} panel`}>
          <div className="utility-title"><strong>{openUtility}</strong><button type="button" onClick={() => setOpenUtility(null)} aria-label="Close panel">×</button></div>
          {openUtility === "Notifications" && <><div className="utility-items">{notifications.map(n => <p key={n._id} className={n.read ? "" : "unread"}>{n.message}</p>)}</div>
            <button className="utility-action" type="button" onClick={onMarkRead}>Mark all as read</button></>}
          {openUtility === "Calendar" && <><label className="utility-label">Appointments for <input type="date" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} /></label>
            <div className="utility-items">{appointments.filter(a => a.date === appointmentDate).map(a => <p key={a._id}><strong>{a.time} IST</strong> · {a.title}<small>{a.with} · {a.city}</small></p>)}
              {!appointments.some(a=>a.date===appointmentDate) && <p>No appointments on this date.</p>}</div></>}
          {openUtility === "Settings" && <div className="settings-options">
            <label><span>Dark mode</span><input type="checkbox" checked={theme === "dark"} onChange={e=>setTheme(e.target.checked?"dark":"light")}/></label>
            <label><span>Compact list</span><input type="checkbox" checked={compactRows} onChange={e=>setCompactRows(e.target.checked)}/></label>
            <label><span>Show prices</span><input type="checkbox" checked={showPrices} onChange={e=>setShowPrices(e.target.checked)}/></label>
            <p>Currency: INR (₹) · Time zone: IST</p></div>}
          {openUtility === "Profile" && <div className="utility-items"><p><strong>Robin Peter</strong><small>Admin profile · India</small></p><p>Role: Property Manager</p><p>Dashboard: EstateHub</p></div>}
        </section>}

        <div className="latest-heading">
          <h2>{activeView === "Rent" ? "Rental Listings" : activeView === "Sell" ? "Sale Listings" : "Latest"}</h2>
          <span>{filteredProjects.length} Properties</span>
        </div>

        <div className="latest-list" aria-label="Latest properties">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={deleteProject} onEdit={onEditProject}
            />
          ))}

          {filteredProjects.length === 0 && (
            <p className="empty-message">No matching properties found.</p>
          )}
        </div>
      </aside>
</>);
}

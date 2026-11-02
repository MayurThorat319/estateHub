import {useState} from 'react';
import {api} from '../services/api';
import ProjectCard from './ProjectCard';
import './RightSidebar.css';
import './Calendar.css';
export default function RightSidebar({theme,setTheme,openUtility,setOpenUtility,notifications,appointments,compactRows,setCompactRows,showPrices,setShowPrices,filteredProjects,deleteProject,onEditProject,onMarkRead,activeView,onRefresh}) {
const [appointmentDate,setAppointmentDate]=useState(new Date().toLocaleDateString('en-CA'));
const [eventTitle,setEventTitle]=useState('');
const [eventTime,setEventTime]=useState('10:00');
const [eventWith,setEventWith]=useState('');
const [eventCity,setEventCity]=useState('');
const [calendarBusy,setCalendarBusy]=useState(false);
const [calendarError,setCalendarError]=useState('');
async function addEvent(e){e.preventDefault();setCalendarBusy(true);setCalendarError('');try{await api.post('/calendar',{date:appointmentDate,time:eventTime,title:eventTitle.trim(),with:eventWith.trim(),city:eventCity.trim()});setEventTitle('');setEventWith('');setEventCity('');await onRefresh();}catch(err){setCalendarError(err.message)}finally{setCalendarBusy(false)}}
async function removeEvent(id){if(!window.confirm('Cancel this appointment?'))return;setCalendarError('');try{await api.delete(`/calendar/${id}`);await onRefresh()}catch(err){setCalendarError(err.message)}}
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
          {openUtility === "Notifications" && <><div className="utility-items">{notifications.map(n => <p key={n._id} className={n.read ? "" : "unread"}>{n.message}<small>{new Date(n.createdAt).toLocaleString("en-IN")}</small></p>)}{!notifications.length && <p>No notifications yet.</p>}</div>
            <button className="utility-action" type="button" onClick={onMarkRead}>Mark all as read</button></>}
          {openUtility === "Calendar" && <><label className="utility-label">Appointments for <input type="date" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} /></label>
            <div className="utility-items">{appointments.filter(a => a.date === appointmentDate).sort((a,b)=>a.time.localeCompare(b.time)).map(a => <p key={a._id} className="calendar-entry"><strong>{a.time}</strong> · {a.title}<small>{a.with || 'No contact'} · {a.city || 'No city'}</small><button type="button" onClick={()=>removeEvent(a._id)}>Cancel</button></p>)}
              {!appointments.some(a=>a.date===appointmentDate) && <p>No appointments on this date.</p>}</div>
            <form className="calendar-form" onSubmit={addEvent}><strong>Schedule appointment</strong><input required placeholder="Appointment title" value={eventTitle} onChange={e=>setEventTitle(e.target.value)}/><input required type="time" value={eventTime} onChange={e=>setEventTime(e.target.value)}/><input placeholder="Contact name" value={eventWith} onChange={e=>setEventWith(e.target.value)}/><input placeholder="City" value={eventCity} onChange={e=>setEventCity(e.target.value)}/><button disabled={calendarBusy} type="submit" className="utility-action">{calendarBusy?'Saving…':'Add Appointment'}</button></form>
            {calendarError && <p className="calendar-error" role="alert">{calendarError}</p>}</>}
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

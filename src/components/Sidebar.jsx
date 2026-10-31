import './Sidebar.css';
export default function Sidebar({activeView,setActiveView,setOpenUtility}) {
return (<>      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">⌂</div>
          <div>
            <h2>EstateHub</h2>
            <span>Property Solution</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {[["Dashboard","▦"],["Rent","⌂"],["Sell","◆"],["Inquiry","♧"],["Agent","◉"],["Chat","●"]].map(([view, icon]) => (
            <button key={view} type="button" className={`nav-link ${activeView === view ? "active" : ""}`}
              onClick={() => { setActiveView(view); setOpenUtility(null); }} aria-current={activeView === view ? "page" : undefined}>
              <span aria-hidden="true">{icon}</span>{view}
            </button>
          ))}
        </nav>

        <div className="profile-card">
          <div className="profile-avatar">RP</div>
          <h3>Robin Peter</h3>
          <p>Level 6</p>
          <button type="button" className="profile-button" onClick={() => setOpenUtility("Profile")}>View Profile →</button>
        </div>
      </aside>

</>);
}

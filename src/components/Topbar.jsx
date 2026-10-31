import "./Topbar.css";
export default function Topbar({
  activeView,
  search,
  setSearch,
  showForm,
  onToggleForm,
}) {
  return (
    <header className="topbar">
      <div className="welcome">
        <h1>
          {activeView === "Dashboard" ? "EstateHub Dashboard" : activeView}
        </h1>
        <p>
          {new Date().toLocaleDateString("en-IN", { dateStyle: "full" })} ·
          EstateHub · India
        </p>
      </div>
      <div className="topbar-actions">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties..."
          />
        </div>
        <button type="button" className="add-button" onClick={onToggleForm}>
          {showForm ? "− Close" : "+ Add Property"}
        </button>
      </div>
    </header>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import PropertyForm from "./components/PropertyForm";
import Workspace from "./components/Workspace";
import DashboardContent from "./components/DashboardContent";
import RightSidebar from "./components/RightSidebar";
import { api } from "./services/api";
import "./styles/layout.css";
const emptySummary = {
  sellCount: 0,
  rentCount: 0,
  sellPercent: 0,
  rentPercent: 0,
  revenue: 0,
  weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    rent: 0,
    sell: 0,
  })),
  monthly: Array(12).fill(0),
};
export default function App() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("estatehub-theme") === "dark" ? "dark" : "light",
  );
  useEffect(() => localStorage.setItem("estatehub-theme", theme), [theme]);
  const [projects, setProjects] = useState([]),
    [agents, setAgents] = useState([]),
    [activities, setActivities] = useState([]),
    [enquiries, setEnquiries] = useState([]),
    [messages, setMessages] = useState([]),
    [appointments, setAppointments] = useState([]),
    [notifications, setNotifications] = useState([]),
    [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true),
    [apiError, setApiError] = useState(""),
    [busy, setBusy] = useState(false),
    [formError, setFormError] = useState(""),
    [editing, setEditing] = useState(null);
  const [search, setSearch] = useState(""),
    [activeView, setActiveView] = useState("Dashboard"),
    [showForm, setShowForm] = useState(false),
    [openUtility, setOpenUtility] = useState(null),
    [compactRows, setCompactRows] = useState(false),
    [showPrices, setShowPrices] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const [p, a, ac, e, m, ap, n, st] = await Promise.all(
        [
          "/properties",
          "/agents",
          "/activities",
          "/enquiries",
          "/messages",
          "/appointments",
          "/notifications",
          "/stats",
        ].map((path) => api.get(path)),
      );
      setProjects(p);
      setAgents(a);
      setActivities(ac);
      setEnquiries(e);
      setMessages(m);
      setAppointments(ap);
      setNotifications(n);
      setSummary(st);
      setApiError("");
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          `${p.name} ${p.location} ${p.type || ""}`
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          (activeView !== "Rent" || p.listing === "Rent") &&
          (activeView !== "Sell" || p.listing !== "Rent"),
      ),
    [projects, search, activeView],
  );
  async function saveProject(data) {
    setBusy(true);
    setFormError("");
    try {
      if (editing) await api.put(`/properties/${editing._id}`, data);
      else await api.post("/properties", data);
      setShowForm(false);
      setEditing(null);
      await refresh();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function deleteProject(id) {
    if (!window.confirm("Delete this property permanently?")) return;
    try {
      await api.delete(`/properties/${id}`);
      await refresh();
    } catch (e) {
      setApiError(e.message);
    }
  }
  function editProject(project) {
    setFormError("");
    setEditing(project);
    setShowForm(true);
    window.requestAnimationFrame(() => {
      document.querySelector(".project-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  async function markRead() {
    try {
      await api.patch("/notifications/read-all", {});
      await refresh();
    } catch (e) {
      setApiError(e.message);
    }
  }
  return (
    <div
      className={`dashboard theme-${theme} ${compactRows ? "compact-rows" : ""} ${!showPrices ? "hide-prices" : ""}`}
    >
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        setOpenUtility={setOpenUtility}
      />
      <main className="dashboard-main" id="dashboard">
        <Topbar
          activeView={activeView}
          search={search}
          setSearch={setSearch}
          showForm={showForm}
          onToggleForm={() => {
            setEditing(null);
            setFormError("");
            setShowForm((v) => !v);
          }}
        />
        {apiError && (
          <div className="api-error" role="alert">
            Backend connection: {apiError}{" "}
            <button onClick={refresh}>Retry</button>
          </div>
        )}
        {loading && (
          <p className="empty-message">Loading EstateHub records...</p>
        )}
        {showForm && (
          <PropertyForm
            initial={editing}
            activeView={activeView}
            onSave={saveProject}
            onClose={() => {
              setShowForm(false);
              setEditing(null);
              setFormError("");
            }}
            busy={busy}
            error={formError}
          />
        )}
        {["Inquiry", "Agent", "Chat"].includes(activeView) ? (
          <Workspace
            activeView={activeView}
            enquiries={enquiries}
            agents={agents}
            messages={messages}
            onRefresh={refresh}
          />
        ) : (
          <>
            <DashboardContent
              summary={summary}
              agents={agents}
              activities={activities}
            />
          </>
        )}
      </main>
      <RightSidebar
        theme={theme}
        setTheme={setTheme}
        openUtility={openUtility}
        setOpenUtility={setOpenUtility}
        notifications={notifications}
        appointments={appointments}
        compactRows={compactRows}
        setCompactRows={setCompactRows}
        showPrices={showPrices}
        setShowPrices={setShowPrices}
        filteredProjects={filteredProjects}
        deleteProject={deleteProject}
        onEditProject={editProject}
        onMarkRead={markRead}
        activeView={activeView}
      />
    </div>
  );
}

import "./styles/theme.css";

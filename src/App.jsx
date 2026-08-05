import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutGrid, Kanban, Users, Plus, Search, ChevronLeft, ChevronRight, ArrowLeft,
  CalendarDays, CircleDollarSign, Briefcase, Clock, X, Trash2, Megaphone,
  MapPin, Truck, HardHat, ClipboardCheck, BarChart3, FolderKanban, CheckCircle2, Circle,
  Cloud, CloudOff, RotateCcw, Receipt, Send, Zap
} from "lucide-react";

// ---------- Design tokens ----------
const T = {
  ink: "#1B1E2A",
  inkSoft: "#2A2E40",
  paper: "#F3F5F8",
  card: "#FFFFFF",
  line: "#E3E7EE",
  accent: "#4038EF",
  accentSoft: "#ECEBFE",
  textDim: "#6B7180",
  green: "#16A34A",
  amber: "#B45309",
  red: "#B91C1C",
};

const CLIENT_COLORS = ["#FF6B5E", "#FFB020", "#12B5A5", "#8B5CF6", "#3B82F6", "#EC4899"];

const STATUSES = [
  { id: "briefing", label: "Briefing", color: "#8A93A6" },
  { id: "progress", label: "In progress", color: "#3B82F6" },
  { id: "review", label: "Client review", color: "#F59E0B" },
  { id: "delivered", label: "Delivered", color: "#16A34A" },
];

const SERVICES = ["Activation", "Event", "Brand", "Social", "Content", "SEO", "Web", "Paid media", "Email"];
const BUDGET_CATS = ["Production", "Talent & manpower", "Venue", "Logistics", "Creatives", "Contingency"];
const CHECK_GROUPS = ["Permits & clearances", "Logistics", "Equipment", "Run of show"];

const VENDOR_STATUSES = [
  { id: "canvassing", label: "Canvassing", color: "#8A93A6" },
  { id: "po", label: "PO issued", color: "#3B82F6" },
  { id: "partial", label: "Partially paid", color: "#F59E0B" },
  { id: "paid", label: "Fully paid", color: "#16A34A" },
];
const MANPOWER_STATUSES = [
  { id: "pending", label: "Pending", color: "#F59E0B" },
  { id: "confirmed", label: "Confirmed", color: "#16A34A" },
];
const INVOICE_STATUSES = [
  { id: "draft", label: "Draft", color: "#8A93A6" },
  { id: "sent", label: "Sent", color: "#3B82F6" },
  { id: "paid", label: "Paid", color: "#16A34A" },
];

// ---------- Seed data ----------
const seedClients = [
  { id: "c1", name: "Harvest & Co.", industry: "Food & beverage", color: CLIENT_COLORS[0], retainer: 4500, email: "accounting@harvestandco.example" },
  { id: "c2", name: "Northwind Travel", industry: "Tourism", color: CLIENT_COLORS[2], retainer: 3200, email: "billing@northwindtravel.example" },
  { id: "c3", name: "Lumen Clinics", industry: "Healthcare", color: CLIENT_COLORS[3], retainer: 6000, email: "finance@lumenclinics.example" },
];

const seedTeam = [
  { id: "t1", name: "Ana Reyes", role: "Account manager" },
  { id: "t2", name: "Miguel Cruz", role: "Designer" },
  { id: "t3", name: "Joy Santos", role: "Events lead" },
  { id: "t4", name: "Paolo Lim", role: "Production coordinator" },
];

const seedProjects = [
  {
    id: "p1", clientId: "c1", name: "Mall Sampling Tour — Leg 1", service: "Activation", type: "activation",
    budget: 18500, due: "2026-08-22", venue: "Activity Center, Metro Mall North", startDate: "2026-08-22", endDate: "2026-08-23",
    report: { attendance: "", samples: "", leads: "", notes: "" },
  },
  {
    id: "p2", clientId: "c3", name: "Wellness Fair Booth", service: "Event", type: "activation",
    budget: 9800, due: "2026-09-05", venue: "City Convention Hall", startDate: "2026-09-05", endDate: "2026-09-06",
    report: { attendance: "", samples: "", leads: "", notes: "" },
  },
  {
    id: "p3", clientId: "c2", name: "Summer Escapes Campaign", service: "Paid media", type: "digital",
    budget: 7200, due: "2026-08-14", venue: "", startDate: "", endDate: "",
    report: { attendance: "", samples: "", leads: "", notes: "" },
  },
  {
    id: "p4", clientId: "c1", name: "Q3 Social Calendar", service: "Social", type: "digital",
    budget: 2500, due: "2026-08-21", venue: "", startDate: "", endDate: "",
    report: { attendance: "", samples: "", leads: "", notes: "" },
  },
];

const seedTasks = [
  { id: "k1", projectId: "p1", title: "Booth design KV + fabrication specs", assignee: "t2", status: "review", due: "2026-08-08" },
  { id: "k2", projectId: "p1", title: "Sampling mechanics & script", assignee: "t3", status: "progress", due: "2026-08-10" },
  { id: "k3", projectId: "p2", title: "Health screening flow with client", assignee: "t3", status: "briefing", due: "2026-08-18" },
  { id: "k4", projectId: "p3", title: "Ad set restructure + copy", assignee: "t1", status: "progress", due: "2026-08-05" },
  { id: "k5", projectId: "p4", title: "August content grid (24 posts)", assignee: "t2", status: "progress", due: "2026-08-07" },
];

const seedBudgetItems = [
  { id: "b1", projectId: "p1", category: "Production", label: "Booth fabrication (3x3)", planned: 5500, actual: 5200 },
  { id: "b2", projectId: "p1", category: "Talent & manpower", label: "Brand ambassadors x4, 2 days", planned: 2400, actual: 0 },
  { id: "b3", projectId: "p1", category: "Venue", label: "Mall activity center rental", planned: 4800, actual: 4800 },
  { id: "b4", projectId: "p1", category: "Logistics", label: "Trucking + ingress crew", planned: 1500, actual: 0 },
  { id: "b5", projectId: "p1", category: "Creatives", label: "Collaterals printing", planned: 1200, actual: 980 },
  { id: "b6", projectId: "p1", category: "Contingency", label: "Contingency (10%)", planned: 1800, actual: 0 },
  { id: "b7", projectId: "p2", category: "Production", label: "Booth setup + backdrop", planned: 3200, actual: 0 },
  { id: "b8", projectId: "p2", category: "Talent & manpower", label: "Nurses x2 + emcee", planned: 2600, actual: 0 },
];

const seedVendors = [
  { id: "v1", projectId: "p1", name: "BuildRight Fabrication", service: "Booth fabrication", quote: 5500, status: "po" },
  { id: "v2", projectId: "p1", name: "PrintHub", service: "Collaterals & signage", quote: 1200, status: "paid" },
  { id: "v3", projectId: "p1", name: "MoveFast Logistics", service: "Trucking & ingress", quote: 1500, status: "canvassing" },
  { id: "v4", projectId: "p2", name: "SoundStage AV", service: "Sound & lights", quote: 1800, status: "canvassing" },
];

const seedManpower = [
  { id: "m1", projectId: "p1", name: "Kris Dela Cruz", role: "Team lead / emcee", rate: 180, callTime: "07:00", status: "confirmed" },
  { id: "m2", projectId: "p1", name: "Bea Tan", role: "Brand ambassador", rate: 120, callTime: "08:00", status: "confirmed" },
  { id: "m3", projectId: "p1", name: "Marco Uy", role: "Brand ambassador", rate: 120, callTime: "08:00", status: "pending" },
  { id: "m4", projectId: "p2", name: "Nina Flores", role: "Registration staff", rate: 110, callTime: "07:30", status: "pending" },
];

const seedChecklist = [
  { id: "cl1", projectId: "p1", group: "Permits & clearances", label: "Mall admin permit + insurance COI", done: true },
  { id: "cl2", projectId: "p1", group: "Permits & clearances", label: "Barangay / LGU activity permit", done: false },
  { id: "cl3", projectId: "p1", group: "Logistics", label: "Ingress schedule confirmed (Aug 21, 10PM)", done: true },
  { id: "cl4", projectId: "p1", group: "Logistics", label: "Egress + booth pullout plan", done: false },
  { id: "cl5", projectId: "p1", group: "Equipment", label: "Chillers x2 + extension cords", done: false },
  { id: "cl6", projectId: "p1", group: "Equipment", label: "Sampling kits (2,000 pcs) delivered", done: false },
  { id: "cl7", projectId: "p1", group: "Run of show", label: "Hourly program flow approved by client", done: false },
  { id: "cl8", projectId: "p1", group: "Run of show", label: "Emcee spiels + game mechanics", done: false },
  { id: "cl9", projectId: "p2", group: "Permits & clearances", label: "Venue contract signed", done: true },
];

const seedInvoices = [
  { id: "i1", number: "INV-2026-041", clientId: "c1", projectId: "p1", desc: "Mall Sampling Tour — Leg 1 (50% downpayment)", amount: 9250, issueDate: "2026-07-20", dueDate: "2026-08-04", status: "sent" },
  { id: "i2", number: "INV-2026-042", clientId: "c3", projectId: "", desc: "Monthly retainer — July 2026", amount: 6000, issueDate: "2026-07-01", dueDate: "2026-07-16", status: "paid" },
];

// ---------- Persistent storage ----------
// All board data is kept in ONE shared key so the whole team sees the same board.
const STORAGE_KEY = "agency-pm:board:v1";

// Storage adapter:
// - Inside Claude artifacts: uses window.storage (shared, whole team sees one board)
// - Self-hosted (e.g. GitHub Pages): falls back to browser localStorage (saved per device)
const detectStorageMode = () => {
  if (typeof window === "undefined") return "none";
  if (window.storage) return "claude";
  try {
    window.localStorage.setItem("__sb_test", "1");
    window.localStorage.removeItem("__sb_test");
    return "local";
  } catch (e) {
    return "none";
  }
};
const storageRead = async (mode) => {
  if (mode === "claude") {
    const res = await window.storage.get(STORAGE_KEY, true);
    return res ? res.value : null;
  }
  if (mode === "local") return window.localStorage.getItem(STORAGE_KEY);
  return null;
};
const storageWrite = async (mode, json) => {
  if (mode === "claude") {
    const res = await window.storage.set(STORAGE_KEY, json, true);
    return !!res;
  }
  if (mode === "local") { window.localStorage.setItem(STORAGE_KEY, json); return true; }
  return false;
};
const seedBundle = () => ({
  clients: seedClients, projects: seedProjects, tasks: seedTasks,
  budgetItems: seedBudgetItems, vendors: seedVendors, manpower: seedManpower, checklist: seedChecklist,
  invoices: seedInvoices,
});

// ---------- Helpers ----------
const uid = () => Math.random().toString(36).slice(2, 9);
const money = (n) => "$" + Number(n || 0).toLocaleString();
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const daysLeft = (d) => {
  if (!d) return null;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return Math.round((new Date(d + "T00:00:00") - now) / 86400000);
};
const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// ---------- Shared styles ----------
const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "9px 12px", fontSize: 14,
  border: `1px solid ${T.line}`, borderRadius: 9, outline: "none", background: "#FBFCFE", color: T.ink,
};
const labelStyle = { fontSize: 11.5, fontWeight: 700, color: T.textDim, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 };
const btnPrimary = {
  background: T.accent, color: "#fff", border: "none", borderRadius: 9,
  padding: "9px 16px", fontSize: 13.5, fontWeight: 700, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 7,
};
const btnGhost = {
  background: "transparent", border: `1px solid ${T.line}`, borderRadius: 8,
  padding: "6px 8px", cursor: "pointer", color: T.textDim, display: "inline-flex", alignItems: "center", gap: 5,
};
const cardStyle = { background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: 18 };
const sectionTitle = { margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.8 };
const th = { textAlign: "left", fontSize: 11, fontWeight: 800, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.7, padding: "8px 10px", borderBottom: `1px solid ${T.line}`, whiteSpace: "nowrap" };
const td = { fontSize: 13.5, color: T.ink, padding: "10px", borderBottom: `1px solid ${T.line}`, verticalAlign: "middle" };

// ---------- Small UI pieces ----------
const Avatar = ({ name, size = 26 }) => (
  <div title={name} style={{
    width: size, height: size, borderRadius: "50%", background: T.inkSoft, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 700, letterSpacing: 0.5, flexShrink: 0,
  }}>{initials(name)}</div>
);

const StatusPill = ({ list, value, onChange }) => {
  const s = list.find((x) => x.id === value) || list[0];
  return (
    <select value={value} onChange={onChange} style={{
      fontSize: 12, fontWeight: 700, color: s.color, background: `${s.color}18`,
      border: `1px solid ${s.color}40`, borderRadius: 999, padding: "4px 10px", cursor: "pointer", outline: "none",
    }}>
      {list.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
    </select>
  );
};

const DueTag = ({ due }) => {
  const dl = daysLeft(due);
  if (dl === null) return null;
  const late = dl < 0, soon = dl >= 0 && dl <= 3;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600, color: late ? T.red : soon ? T.amber : T.textDim }}>
      <Clock size={12} />
      {late ? `${-dl}d overdue` : dl === 0 ? "Today" : fmtDate(due)}
    </span>
  );
};

const Chip = ({ color, children }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600,
    color: T.ink, background: "#F0F2F6", border: `1px solid ${T.line}`, borderRadius: 999, padding: "3px 10px",
  }}>
    {color && <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />}
    {children}
  </span>
);

const TypeBadge = ({ type }) => (
  <span style={{
    fontSize: 10.5, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase",
    color: type === "activation" ? "#7C2D92" : T.accent,
    background: type === "activation" ? "#F5E8FA" : T.accentSoft,
    borderRadius: 6, padding: "3px 8px",
  }}>{type === "activation" ? "Activation / Event" : "Digital"}</span>
);

const Empty = ({ text }) => <div style={{ fontSize: 13, color: T.textDim, padding: "14px 0" }}>{text}</div>;

const Modal = ({ title, onClose, children }) => (
  <div onClick={onClose} style={{
    position: "fixed", inset: 0, background: "rgba(20,22,32,0.45)", zIndex: 50,
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
  }}>
    <div onClick={(e) => e.stopPropagation()} style={{
      background: "#fff", borderRadius: 14, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto",
      padding: 22, boxShadow: "0 24px 60px rgba(20,22,32,0.25)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: T.ink }}>{title}</h3>
        <button onClick={onClose} aria-label="Close" style={btnGhost}><X size={16} /></button>
      </div>
      {children}
    </div>
  </div>
);

// ---------- Main app ----------
export default function AgencyPM() {
  const [view, setView] = useState("overview");
  const [openProjectId, setOpenProjectId] = useState(null);
  const [projTab, setProjTab] = useState("budget");

  const [clients, setClients] = useState(seedClients);
  const [team] = useState(seedTeam);
  const [projects, setProjects] = useState(seedProjects);
  const [tasks, setTasks] = useState(seedTasks);
  const [budgetItems, setBudgetItems] = useState(seedBudgetItems);
  const [vendors, setVendors] = useState(seedVendors);
  const [manpower, setManpower] = useState(seedManpower);
  const [checklist, setChecklist] = useState(seedChecklist);
  const [invoices, setInvoices] = useState(seedInvoices);

  const [clientFilter, setClientFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [taskAdded, setTaskAdded] = useState(0); // counts tasks added in current modal session
  // ---------- Storage sync ----------
  const [loaded, setLoaded] = useState(false);
  const [storageMode, setStorageMode] = useState("none"); // claude | local | none
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [resetArm, setResetArm] = useState(false);
  const saveTimer = useRef(null);

  const applyBundle = (d) => {
    if (d.clients) setClients(d.clients);
    if (d.projects) setProjects(d.projects);
    if (d.tasks) setTasks(d.tasks);
    if (d.budgetItems) setBudgetItems(d.budgetItems);
    if (d.vendors) setVendors(d.vendors);
    if (d.manpower) setManpower(d.manpower);
    if (d.checklist) setChecklist(d.checklist);
    if (d.invoices) setInvoices(d.invoices);
  };

  useEffect(() => {
    (async () => {
      const mode = detectStorageMode();
      setStorageMode(mode);
      if (mode === "none") { setLoaded(true); return; } // no storage available — in-memory only
      try {
        const raw = await storageRead(mode);
        if (raw) applyBundle(JSON.parse(raw));
        else await storageWrite(mode, JSON.stringify(seedBundle())); // first run — seed the board
      } catch (err) {
        // e.g. Claude storage throws on a missing key — treat as first run
        try {
          await storageWrite(mode, JSON.stringify(seedBundle()));
        } catch (e2) {
          console.error("Storage unavailable:", e2);
          setStorageMode("none");
        }
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded || storageMode === "none") return;
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const ok = await storageWrite(storageMode, JSON.stringify({
          clients, projects, tasks, budgetItems, vendors, manpower, checklist, invoices,
        }));
        setSaveState(ok ? "saved" : "error");
      } catch (err) {
        console.error("Save failed:", err);
        setSaveState("error");
      }
    }, 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [clients, projects, tasks, budgetItems, vendors, manpower, checklist, invoices, loaded, storageMode]);

  const resetAll = async () => {
    if (!resetArm) { setResetArm(true); setTimeout(() => setResetArm(false), 4000); return; }
    setResetArm(false);
    const fresh = seedBundle();
    applyBundle(fresh);
    setOpenProjectId(null);
    if (storageMode !== "none") {
      try { await storageWrite(storageMode, JSON.stringify(fresh)); } catch (e) { console.error(e); }
    }
  };
  const openModal = (kind, preset = {}) => { setForm(preset); setModal(kind); setTaskAdded(0); };
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const clientById = (id) => clients.find((c) => c.id === id);
  const projectById = (id) => projects.find((p) => p.id === id);
  const memberById = (id) => team.find((t) => t.id === id);
  const openProject = openProjectId ? projectById(openProjectId) : null;

  // ---------- Filtered data ----------
  const visibleProjects = useMemo(() =>
    projects.filter((p) =>
      (clientFilter === "all" || p.clientId === clientFilter) &&
      (!search || p.name.toLowerCase().includes(search.toLowerCase()))
    ), [projects, clientFilter, search]);

  const visibleTasks = useMemo(() =>
    tasks.filter((t) => {
      const p = projectById(t.projectId);
      if (!p) return false;
      if (clientFilter !== "all" && p.clientId !== clientFilter) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }), [tasks, projects, clientFilter, search]);

  // ---------- Mutations ----------
  const moveTask = (id, dir) => setTasks((ts) => ts.map((t) => {
    if (t.id !== id) return t;
    const i = STATUSES.findIndex((s) => s.id === t.status);
    return { ...t, status: STATUSES[Math.min(Math.max(i + dir, 0), STATUSES.length - 1)].id };
  }));
  const deleteTask = (id) => setTasks((ts) => ts.filter((t) => t.id !== id));

  const addProject = () => {
    if (!form.name || !form.clientId) return;
    const type = (form.service === "Activation" || form.service === "Event") ? "activation" : "digital";
    const p = {
      id: uid(), name: form.name, clientId: form.clientId, service: form.service || "Content",
      type, budget: Number(form.budget) || 0, due: form.due || "",
      venue: form.venue || "", startDate: form.startDate || "", endDate: form.endDate || "",
      report: { attendance: "", samples: "", leads: "", notes: "" },
    };
    setProjects((ps) => [...ps, p]);
    setModal(null);
    if (type === "activation") { setOpenProjectId(p.id); setView("projects"); setProjTab("budget"); }
  };

  const addTask = (andClose) => {
    if (!form.title || !form.projectId) return;
    setTasks((ts) => [...ts, { id: uid(), title: form.title, projectId: form.projectId, assignee: form.assignee || team[0].id, status: "briefing", due: form.due || "" }]);
    setTaskAdded((n) => n + 1);
    if (andClose) { setModal(null); setTaskAdded(0); }
    else setForm((f) => ({ ...f, title: "", due: "" })); // clear title & due, keep project & assignee
  };

  const addClient = () => {
    if (!form.name) return;
    setClients((cs) => [...cs, { id: uid(), name: form.name, industry: form.industry || "—", color: CLIENT_COLORS[cs.length % CLIENT_COLORS.length], retainer: Number(form.retainer) || 0, email: form.email || "" }]);
    setModal(null);
  };

  const addBudgetItem = () => {
    if (!form.label) return;
    setBudgetItems((xs) => [...xs, { id: uid(), projectId: openProjectId, category: form.category || BUDGET_CATS[0], label: form.label, planned: Number(form.planned) || 0, actual: Number(form.actual) || 0 }]);
    setModal(null);
  };
  const updateBudgetActual = (id, val) => setBudgetItems((xs) => xs.map((x) => x.id === id ? { ...x, actual: Number(val) || 0 } : x));
  const deleteBudgetItem = (id) => setBudgetItems((xs) => xs.filter((x) => x.id !== id));

  const addVendor = () => {
    if (!form.name) return;
    setVendors((xs) => [...xs, { id: uid(), projectId: openProjectId, name: form.name, service: form.service || "", quote: Number(form.quote) || 0, status: "canvassing" }]);
    setModal(null);
  };
  const setVendorStatus = (id, status) => setVendors((xs) => xs.map((x) => x.id === id ? { ...x, status } : x));
  const deleteVendor = (id) => setVendors((xs) => xs.filter((x) => x.id !== id));

  const addManpower = () => {
    if (!form.name) return;
    setManpower((xs) => [...xs, { id: uid(), projectId: openProjectId, name: form.name, role: form.role || "", rate: Number(form.rate) || 0, callTime: form.callTime || "", status: "pending" }]);
    setModal(null);
  };
  const setManpowerStatus = (id, status) => setManpower((xs) => xs.map((x) => x.id === id ? { ...x, status } : x));
  const deleteManpower = (id) => setManpower((xs) => xs.filter((x) => x.id !== id));

  const addCheckItem = () => {
    if (!form.label) return;
    setChecklist((xs) => [...xs, { id: uid(), projectId: openProjectId, group: form.group || CHECK_GROUPS[0], label: form.label, done: false }]);
    setModal(null);
  };
  const toggleCheck = (id) => setChecklist((xs) => xs.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  const deleteCheck = (id) => setChecklist((xs) => xs.filter((x) => x.id !== id));

  const updateReport = (pid, k, v) => setProjects((ps) => ps.map((p) => p.id === pid ? { ...p, report: { ...p.report, [k]: v } } : p));

  // ---------- Billing ----------
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const plusDays = (iso, n) => {
    const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const monthLabel = () => new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const nextInvNumber = (existing) => {
    const yr = new Date().getFullYear();
    const nums = existing.map((i) => {
      const m = i.number.match(/INV-(\d{4})-(\d+)/);
      return m && Number(m[1]) === yr ? Number(m[2]) : 0;
    });
    return `INV-${yr}-${String(Math.max(0, ...nums) + 1).padStart(3, "0")}`;
  };
  const invOverdue = (inv) => inv.status === "sent" && daysLeft(inv.dueDate) !== null && daysLeft(inv.dueDate) < 0;

  const addInvoice = () => {
    if (!form.clientId || !form.amount) return;
    setInvoices((xs) => [...xs, {
      id: uid(), number: nextInvNumber(xs), clientId: form.clientId, projectId: form.projectId || "",
      desc: form.desc || "Professional services", amount: Number(form.amount) || 0,
      issueDate: todayISO(), dueDate: form.dueDate || plusDays(todayISO(), 15), status: "draft",
    }]);
    setModal(null);
  };
  const setInvoiceStatus = (id, status) => setInvoices((xs) => xs.map((x) => x.id === id ? { ...x, status } : x));
  const deleteInvoice = (id) => setInvoices((xs) => xs.filter((x) => x.id !== id));

  // Auto-generate this month's retainer invoices for every client with a retainer,
  // skipping clients already invoiced for the current month.
  const generateRetainerInvoices = () => {
    const label = monthLabel();
    setInvoices((xs) => {
      const additions = clients
        .filter((c) => c.retainer > 0 && !xs.some((i) => i.clientId === c.id && i.desc.includes(label)))
        .map((c, idx) => ({
          id: uid(),
          number: (() => { const base = nextInvNumber(xs); const m = base.match(/INV-(\d{4})-(\d+)/); return `INV-${m[1]}-${String(Number(m[2]) + idx).padStart(3, "0")}`; })(),
          clientId: c.id, projectId: "",
          desc: `Monthly retainer — ${label}`, amount: c.retainer,
          issueDate: todayISO(), dueDate: plusDays(todayISO(), 15), status: "draft",
        }));
      return [...xs, ...additions];
    });
  };

  // Opens the user's email app with a pre-filled invoice email, then marks the invoice as sent.
  const sendInvoice = (inv) => {
    const c = clientById(inv.clientId);
    const p = inv.projectId ? projectById(inv.projectId) : null;
    const subject = `${inv.number} — ${inv.desc}`;
    const body = [
      `Hi ${c?.name || "there"} team,`,
      ``,
      `Please find the details of your invoice below:`,
      ``,
      `Invoice no.: ${inv.number}`,
      `Description: ${inv.desc}${p ? ` (${p.name})` : ""}`,
      `Amount due: ${money(inv.amount)}`,
      `Issue date: ${fmtDate(inv.issueDate)}`,
      `Due date: ${fmtDate(inv.dueDate)}`,
      ``,
      `Kindly settle on or before the due date. Let us know if you need any supporting documents.`,
      ``,
      `Thank you,`,
      `Creative Studio`,
    ].join("\n");
    const mailto = `mailto:${encodeURIComponent(c?.email || "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
    setInvoiceStatus(inv.id, "sent");
  };

  // ---------- Derived ----------
  const openTasks = tasks.filter((t) => t.status !== "delivered");
  const overdue = openTasks.filter((t) => { const d = daysLeft(t.due); return d !== null && d < 0; });
  const dueThisWeek = openTasks.filter((t) => { const d = daysLeft(t.due); return d !== null && d >= 0 && d <= 7; });
  const upcomingEvents = projects.filter((p) => p.type === "activation" && daysLeft(p.startDate) !== null && daysLeft(p.startDate) >= 0)
    .sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
  const pipeline = projects.reduce((s, p) => s + (p.budget || 0), 0);

  const projectProgress = (pid) => {
    const pt = tasks.filter((t) => t.projectId === pid);
    const pc = checklist.filter((c) => c.projectId === pid);
    const total = pt.length + pc.length;
    if (!total) return 0;
    const done = pt.filter((t) => t.status === "delivered").length + pc.filter((c) => c.done).length;
    return Math.round((done / total) * 100);
  };

  const projBudget = (pid) => {
    const items = budgetItems.filter((b) => b.projectId === pid);
    return {
      planned: items.reduce((s, b) => s + b.planned, 0),
      actual: items.reduce((s, b) => s + b.actual, 0),
    };
  };

  const payables = (pid) => vendors.filter((v) => v.projectId === pid && v.status !== "paid").reduce((s, v) => s + v.quote, 0);

  // ---------- Overview ----------
  const StatCard = ({ icon: Icon, label, value, sub }) => (
    <div style={{ ...cardStyle, padding: "16px 18px", flex: 1, minWidth: 155 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.textDim, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.7 }}>
        <Icon size={14} /> {label}
      </div>
      <div style={{ fontSize: 25, fontWeight: 800, color: T.ink, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 2 }}>{sub}</div>}
    </div>
  );

  const Overview = () => (
    <div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={Briefcase} label="Active projects" value={projects.length} sub={`${projects.filter((p) => p.type === "activation").length} activations · ${projects.filter((p) => p.type === "digital").length} digital`} />
        <StatCard icon={CalendarDays} label="Next event" value={upcomingEvents[0] ? fmtDate(upcomingEvents[0].startDate) : "—"} sub={upcomingEvents[0] ? upcomingEvents[0].name : "No upcoming events"} />
        <StatCard icon={Kanban} label="Open tasks" value={openTasks.length} sub={`${overdue.length} overdue · ${dueThisWeek.length} due this week`} />
        <StatCard icon={CircleDollarSign} label="Pipeline" value={money(pipeline)} sub="all active project budgets" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 16 }}>
        {/* Event countdown */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Event countdown</h3>
          {upcomingEvents.length === 0 && <Empty text="No upcoming activations or events." />}
          {upcomingEvents.map((p) => {
            const c = clientById(p.clientId);
            const dl = daysLeft(p.startDate);
            const readiness = projectProgress(p.id);
            const pending = checklist.filter((x) => x.projectId === p.id && !x.done).length;
            return (
              <div key={p.id} onClick={() => { setOpenProjectId(p.id); setView("projects"); setProjTab("checklist"); }}
                style={{ padding: "12px 0", borderTop: `1px solid ${T.line}`, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", minWidth: 0 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 11, background: `${c?.color}20`, color: c?.color,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 17, fontWeight: 800, lineHeight: 1 }}>{dl}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase" }}>days</span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: T.textDim, display: "flex", alignItems: "center", gap: 5 }}>
                        <MapPin size={11} /> {p.venue || "Venue TBD"} · {c?.name}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{readiness}% ready</div>
                    <div style={{ fontSize: 11.5, color: pending ? T.amber : T.green, fontWeight: 700 }}>
                      {pending ? `${pending} checklist items open` : "Checklist clear"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deadlines */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Upcoming & overdue tasks</h3>
          {[...overdue, ...dueThisWeek].length === 0 && <Empty text="Nothing due in the next 7 days." />}
          {[...overdue, ...dueThisWeek].sort((a, b) => (a.due || "").localeCompare(b.due || "")).map((t) => {
            const p = projectById(t.projectId);
            const c = p && clientById(p.clientId);
            return (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: `1px solid ${T.line}` }}>
                <Avatar name={memberById(t.assignee)?.name || "?"} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: T.textDim }}>{c?.name} · {p?.name}</div>
                </div>
                <DueTag due={t.due} />
              </div>
            );
          })}
        </div>

        {/* Budget watch */}
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Activation budget watch</h3>
          {projects.filter((p) => p.type === "activation").map((p) => {
            const b = projBudget(p.id);
            const pct = b.planned ? Math.round((b.actual / b.planned) * 100) : 0;
            const pay = payables(p.id);
            return (
              <div key={p.id} onClick={() => { setOpenProjectId(p.id); setView("projects"); setProjTab("budget"); }}
                style={{ padding: "11px 0", borderTop: `1px solid ${T.line}`, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
                  <span style={{ fontWeight: 700 }}>{p.name}</span>
                  <span style={{ color: T.textDim }}>{money(b.actual)} / {money(b.planned)}</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: "#EDF0F4", marginTop: 8 }}>
                  <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, borderRadius: 4, background: pct > 100 ? T.red : pct > 85 ? "#F59E0B" : T.green, transition: "width .3s" }} />
                </div>
                <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 5 }}>
                  {pct}% of budget spent{pay > 0 ? ` · ${money(pay)} unpaid to vendors` : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ---------- Board ----------
  const Board = () => (
    <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, alignItems: "flex-start" }}>
      {STATUSES.map((s) => {
        const col = visibleTasks.filter((t) => t.status === s.id);
        return (
          <div key={s.id} style={{ minWidth: 256, width: 256, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: s.color }} />
              <span style={{ fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.6 }}>{s.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.textDim, background: "#EDF0F4", borderRadius: 999, padding: "1px 8px" }}>{col.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.length === 0 && <div style={{ border: `1.5px dashed ${T.line}`, borderRadius: 12, padding: 14, fontSize: 12.5, color: T.textDim, textAlign: "center" }}>No tasks here</div>}
              {col.map((t) => {
                const p = projectById(t.projectId);
                const c = p && clientById(p.clientId);
                const first = t.status === STATUSES[0].id, last = t.status === STATUSES[STATUSES.length - 1].id;
                return (
                  <div key={t.id} style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 12, padding: "11px 12px 11px 14px", position: "relative", boxShadow: "0 1px 2px rgba(20,22,32,0.04)" }}>
                    <span style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 4, borderRadius: "0 4px 4px 0", background: c?.color || T.line }} />
                    <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.35 }}>{t.title}</div>
                    <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 3 }}>{c?.name} · {p?.name}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <Avatar name={memberById(t.assignee)?.name || "?"} size={22} />
                        <DueTag due={t.due} />
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button style={{ ...btnGhost, padding: "3px 5px", opacity: first ? 0.35 : 1 }} disabled={first} onClick={() => moveTask(t.id, -1)} aria-label="Move back"><ChevronLeft size={14} /></button>
                        <button style={{ ...btnGhost, padding: "3px 5px", opacity: last ? 0.35 : 1 }} disabled={last} onClick={() => moveTask(t.id, 1)} aria-label="Move forward"><ChevronRight size={14} /></button>
                        <button style={{ ...btnGhost, padding: "3px 5px" }} onClick={() => deleteTask(t.id)} aria-label="Delete task"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ---------- Projects list ----------
  const ProjectsList = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
      {visibleProjects.map((p) => {
        const c = clientById(p.clientId);
        const b = projBudget(p.id);
        const prog = projectProgress(p.id);
        return (
          <div key={p.id} onClick={() => { setOpenProjectId(p.id); setProjTab(p.type === "activation" ? "budget" : "tasks"); }}
            style={{ ...cardStyle, cursor: "pointer", padding: 0, overflow: "hidden" }}>
            <div style={{ height: 6, background: c?.color }} />
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.3 }}>{p.name}</div>
                <TypeBadge type={p.type} />
              </div>
              <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 3 }}>{c?.name} · {p.service}</div>
              {p.type === "activation" && (
                <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={12} /> {p.venue || "Venue TBD"} · {fmtDate(p.startDate)}{p.endDate && p.endDate !== p.startDate ? `–${fmtDate(p.endDate)}` : ""}
                </div>
              )}
              <div style={{ height: 5, borderRadius: 4, background: "#EDF0F4", marginTop: 12 }}>
                <div style={{ height: "100%", width: `${prog}%`, borderRadius: 4, background: prog === 100 ? T.green : T.accent }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textDim, marginTop: 6 }}>
                <span>{prog}% complete</span>
                <span>{p.type === "activation" ? `${money(b.actual)} / ${money(b.planned || p.budget)}` : money(p.budget)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ---------- Project detail ----------
  const TabBtn = ({ id, icon: Icon, label, count }) => (
    <button onClick={() => setProjTab(id)} style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", fontSize: 13, fontWeight: 700,
      border: "none", borderRadius: 9, cursor: "pointer",
      background: projTab === id ? T.ink : "transparent", color: projTab === id ? "#fff" : T.textDim,
    }}>
      <Icon size={14} /> {label}
      {count !== undefined && <span style={{ fontSize: 11, fontWeight: 800, background: projTab === id ? "rgba(255,255,255,0.2)" : "#EDF0F4", borderRadius: 999, padding: "1px 7px" }}>{count}</span>}
    </button>
  );

  const AddRowBtn = ({ label, onClick }) => (
    <button style={{ ...btnGhost, marginTop: 12, fontSize: 12.5, fontWeight: 700 }} onClick={onClick}><Plus size={13} /> {label}</button>
  );

  const ProjectDetail = ({ p }) => {
    const c = clientById(p.clientId);
    const pTasks = tasks.filter((t) => t.projectId === p.id);
    const pBudget = budgetItems.filter((b) => b.projectId === p.id);
    const pVendors = vendors.filter((v) => v.projectId === p.id);
    const pMan = manpower.filter((m) => m.projectId === p.id);
    const pCheck = checklist.filter((x) => x.projectId === p.id);
    const b = projBudget(p.id);
    const variance = (p.budget || b.planned) - b.actual;
    const isAct = p.type === "activation";

    return (
      <div>
        <button onClick={() => setOpenProjectId(null)} style={{ ...btnGhost, marginBottom: 14, fontSize: 13, fontWeight: 700 }}>
          <ArrowLeft size={14} /> All projects
        </button>

        <div style={{ ...cardStyle, padding: 0, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ height: 6, background: c?.color }} />
          <div style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>{p.name}</h2>
                <TypeBadge type={p.type} />
              </div>
              <div style={{ fontSize: 13, color: T.textDim, marginTop: 4, display: "flex", gap: 14, flexWrap: "wrap" }}>
                <span>{c?.name} · {p.service}</span>
                {isAct && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><MapPin size={12} /> {p.venue || "Venue TBD"}</span>}
                {isAct && <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><CalendarDays size={12} /> {fmtDate(p.startDate)}{p.endDate && p.endDate !== p.startDate ? ` – ${fmtDate(p.endDate)}` : ""}</span>}
              </div>
            </div>
            {isAct && (
              <div style={{ display: "flex", gap: 20, textAlign: "right" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.7 }}>Spent / Budget</div>
                  <div style={{ fontSize: 17, fontWeight: 800 }}>{money(b.actual)} <span style={{ color: T.textDim, fontWeight: 600, fontSize: 14 }}>/ {money(p.budget || b.planned)}</span></div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: T.textDim, textTransform: "uppercase", letterSpacing: 0.7 }}>Remaining</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: variance < 0 ? T.red : T.green }}>{money(variance)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {isAct && <TabBtn id="budget" icon={CircleDollarSign} label="Budget" count={pBudget.length} />}
          {isAct && <TabBtn id="vendors" icon={Truck} label="Vendors" count={pVendors.length} />}
          {isAct && <TabBtn id="manpower" icon={HardHat} label="Manpower" count={pMan.length} />}
          {isAct && <TabBtn id="checklist" icon={ClipboardCheck} label="Checklist" count={pCheck.filter((x) => !x.done).length} />}
          <TabBtn id="tasks" icon={Kanban} label="Tasks" count={pTasks.length} />
          {isAct && <TabBtn id="report" icon={BarChart3} label="Post-event report" />}
        </div>

        {/* Budget tab */}
        {projTab === "budget" && (
          <div style={cardStyle}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                <thead><tr>
                  <th style={th}>Category</th><th style={th}>Line item</th>
                  <th style={{ ...th, textAlign: "right" }}>Planned</th>
                  <th style={{ ...th, textAlign: "right" }}>Actual</th>
                  <th style={{ ...th, textAlign: "right" }}>Variance</th><th style={th} />
                </tr></thead>
                <tbody>
                  {BUDGET_CATS.map((cat) => pBudget.filter((x) => x.category === cat).map((x, i) => (
                    <tr key={x.id}>
                      <td style={{ ...td, fontSize: 12, fontWeight: 700, color: T.textDim }}>{i === 0 ? cat : ""}</td>
                      <td style={td}>{x.label}</td>
                      <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>{money(x.planned)}</td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <input type="number" value={x.actual || ""} placeholder="0"
                          onChange={(e) => updateBudgetActual(x.id, e.target.value)}
                          style={{ ...inputStyle, width: 92, padding: "5px 8px", textAlign: "right", fontSize: 13 }} />
                      </td>
                      <td style={{ ...td, textAlign: "right", fontWeight: 700, color: x.planned - x.actual < 0 ? T.red : T.green }}>{money(x.planned - x.actual)}</td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <button style={{ ...btnGhost, padding: "3px 5px" }} onClick={() => deleteBudgetItem(x.id)} aria-label="Delete line"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  )))}
                  <tr>
                    <td style={{ ...td, fontWeight: 800, borderBottom: "none" }} colSpan={2}>Total</td>
                    <td style={{ ...td, textAlign: "right", fontWeight: 800, borderBottom: "none" }}>{money(b.planned)}</td>
                    <td style={{ ...td, textAlign: "right", fontWeight: 800, borderBottom: "none", paddingRight: 18 }}>{money(b.actual)}</td>
                    <td style={{ ...td, textAlign: "right", fontWeight: 800, borderBottom: "none", color: b.planned - b.actual < 0 ? T.red : T.green }}>{money(b.planned - b.actual)}</td>
                    <td style={{ borderBottom: "none" }} />
                  </tr>
                </tbody>
              </table>
            </div>
            {pBudget.length === 0 && <Empty text="No budget lines yet. Break the budget into line items so you can track planned vs. actual." />}
            <AddRowBtn label="Add budget line" onClick={() => openModal("budgetItem")} />
          </div>
        )}

        {/* Vendors tab */}
        {projTab === "vendors" && (
          <div style={cardStyle}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                <thead><tr>
                  <th style={th}>Vendor</th><th style={th}>Service</th>
                  <th style={{ ...th, textAlign: "right" }}>Quote</th><th style={th}>Status</th><th style={th} />
                </tr></thead>
                <tbody>
                  {pVendors.map((v) => (
                    <tr key={v.id}>
                      <td style={{ ...td, fontWeight: 700 }}>{v.name}</td>
                      <td style={td}>{v.service}</td>
                      <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>{money(v.quote)}</td>
                      <td style={td}><StatusPill list={VENDOR_STATUSES} value={v.status} onChange={(e) => setVendorStatus(v.id, e.target.value)} /></td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <button style={{ ...btnGhost, padding: "3px 5px" }} onClick={() => deleteVendor(v.id)} aria-label="Delete vendor"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pVendors.length === 0 && <Empty text="No vendors yet. Track fabricators, printers, AV, catering, and their payment status here." />}
            {payables(p.id) > 0 && (
              <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: T.amber }}>
                {money(payables(p.id))} still unpaid across {pVendors.filter((v) => v.status !== "paid").length} vendor(s)
              </div>
            )}
            <AddRowBtn label="Add vendor" onClick={() => openModal("vendor")} />
          </div>
        )}

        {/* Manpower tab */}
        {projTab === "manpower" && (
          <div style={cardStyle}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                <thead><tr>
                  <th style={th}>Name</th><th style={th}>Role</th>
                  <th style={{ ...th, textAlign: "right" }}>Rate / day</th>
                  <th style={th}>Call time</th><th style={th}>Status</th><th style={th} />
                </tr></thead>
                <tbody>
                  {pMan.map((m) => (
                    <tr key={m.id}>
                      <td style={td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={m.name} size={24} /><span style={{ fontWeight: 700 }}>{m.name}</span></div></td>
                      <td style={td}>{m.role}</td>
                      <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>{money(m.rate)}</td>
                      <td style={td}>{m.callTime || "—"}</td>
                      <td style={td}><StatusPill list={MANPOWER_STATUSES} value={m.status} onChange={(e) => setManpowerStatus(m.id, e.target.value)} /></td>
                      <td style={{ ...td, textAlign: "right" }}>
                        <button style={{ ...btnGhost, padding: "3px 5px" }} onClick={() => deleteManpower(m.id)} aria-label="Remove person"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pMan.length === 0 && <Empty text="No manpower listed. Add brand ambassadors, emcees, crew — with call times and rates." />}
            {pMan.length > 0 && (
              <div style={{ marginTop: 12, fontSize: 13, color: T.textDim }}>
                Daily manpower cost: <b style={{ color: T.ink }}>{money(pMan.reduce((s, m) => s + m.rate, 0))}</b> · {pMan.filter((m) => m.status === "confirmed").length}/{pMan.length} confirmed
              </div>
            )}
            <AddRowBtn label="Add person" onClick={() => openModal("manpower")} />
          </div>
        )}

        {/* Checklist tab */}
        {projTab === "checklist" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {CHECK_GROUPS.map((g) => {
              const items = pCheck.filter((x) => x.group === g);
              return (
                <div key={g} style={cardStyle}>
                  <h3 style={{ ...sectionTitle, display: "flex", justifyContent: "space-between" }}>
                    <span>{g}</span>
                    <span style={{ color: items.length && items.every((x) => x.done) ? T.green : T.textDim }}>
                      {items.filter((x) => x.done).length}/{items.length}
                    </span>
                  </h3>
                  {items.length === 0 && <Empty text="Nothing here yet." />}
                  {items.map((x) => (
                    <div key={x.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 0", borderTop: `1px solid ${T.line}` }}>
                      <button onClick={() => toggleCheck(x.id)} aria-label="Toggle done" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: x.done ? T.green : "#C1C7D2", display: "flex" }}>
                        {x.done ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                      </button>
                      <span style={{ flex: 1, fontSize: 13.5, color: x.done ? T.textDim : T.ink, textDecoration: x.done ? "line-through" : "none" }}>{x.label}</span>
                      <button style={{ ...btnGhost, padding: "2px 4px", border: "none" }} onClick={() => deleteCheck(x.id)} aria-label="Delete item"><Trash2 size={12} /></button>
                    </div>
                  ))}
                  <AddRowBtn label="Add item" onClick={() => openModal("check", { group: g })} />
                </div>
              );
            })}
          </div>
        )}

        {/* Tasks tab */}
        {projTab === "tasks" && (
          <div style={cardStyle}>
            {pTasks.length === 0 && <Empty text="No tasks for this project yet." />}
            {pTasks.map((t) => {
              const first = t.status === STATUSES[0].id, last = t.status === STATUSES[STATUSES.length - 1].id;
              const s = STATUSES.find((x) => x.id === t.status);
              return (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: `1px solid ${T.line}` }}>
                  <Avatar name={memberById(t.assignee)?.name || "?"} size={24} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: s.color, fontWeight: 700 }}>{s.label}</div>
                  </div>
                  <DueTag due={t.due} />
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={{ ...btnGhost, padding: "3px 5px", opacity: first ? 0.35 : 1 }} disabled={first} onClick={() => moveTask(t.id, -1)} aria-label="Move back"><ChevronLeft size={14} /></button>
                    <button style={{ ...btnGhost, padding: "3px 5px", opacity: last ? 0.35 : 1 }} disabled={last} onClick={() => moveTask(t.id, 1)} aria-label="Move forward"><ChevronRight size={14} /></button>
                  </div>
                </div>
              );
            })}
            <AddRowBtn label="Add task" onClick={() => openModal("task", { projectId: p.id })} />
          </div>
        )}

        {/* Report tab */}
        {projTab === "report" && (
          <div style={cardStyle}>
            <h3 style={sectionTitle}>Post-event report</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 14 }}>
              {[
                ["attendance", "Attendance / foot traffic"],
                ["samples", "Samples distributed"],
                ["leads", "Leads / sign-ups captured"],
              ].map(([k, label]) => (
                <div key={k}>
                  <label style={labelStyle}>{label}</label>
                  <input style={inputStyle} type="number" value={p.report[k]} placeholder="0"
                    onChange={(e) => updateReport(p.id, k, e.target.value)} />
                </div>
              ))}
            </div>
            <label style={labelStyle}>Highlights, issues & learnings</label>
            <textarea style={{ ...inputStyle, minHeight: 110, resize: "vertical", fontFamily: "inherit" }}
              value={p.report.notes} placeholder="What worked, what to fix next leg, client feedback…"
              onChange={(e) => updateReport(p.id, "notes", e.target.value)} />
            <div style={{ marginTop: 14, fontSize: 13, color: T.textDim }}>
              Final spend: <b style={{ color: T.ink }}>{money(b.actual)}</b> vs budget {money(p.budget || b.planned)}
              {p.report.samples && b.actual > 0 ? <> · cost per sample: <b style={{ color: T.ink }}>{"$" + (b.actual / Number(p.report.samples)).toFixed(2)}</b></> : null}
              {p.report.leads && b.actual > 0 ? <> · cost per lead: <b style={{ color: T.ink }}>{"$" + (b.actual / Number(p.report.leads)).toFixed(2)}</b></> : null}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ---------- Clients ----------
  const Clients = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
      {clients.map((c) => {
        const cp = projects.filter((p) => p.clientId === c.id);
        const ct = tasks.filter((t) => cp.some((p) => p.id === t.projectId) && t.status !== "delivered");
        return (
          <div key={c.id} style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
            <div style={{ height: 6, background: c.color }} />
            <div style={{ padding: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{c.name}</div>
              <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 2 }}>{c.industry}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <Chip>{cp.length} project{cp.length !== 1 ? "s" : ""}</Chip>
                <Chip>{ct.length} open task{ct.length !== 1 ? "s" : ""}</Chip>
                {c.retainer > 0 && <Chip>{money(c.retainer)}/mo</Chip>}
              </div>
              {cp.length > 0 && (
                <div style={{ marginTop: 14, borderTop: `1px solid ${T.line}` }}>
                  {cp.map((p) => (
                    <div key={p.id} onClick={() => { setOpenProjectId(p.id); setView("projects"); setProjTab(p.type === "activation" ? "budget" : "tasks"); }}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", fontSize: 13, cursor: "pointer" }}>
                      <span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: 8 }}>{p.name}</span>
                      <span style={{ color: T.textDim, fontSize: 12, flexShrink: 0 }}>{projectProgress(p.id)}% · {fmtDate(p.due)}</span>
                    </div>
                  ))}
                </div>
              )}
              <button style={{ ...btnGhost, marginTop: 12, fontSize: 12.5, fontWeight: 700 }} onClick={() => openModal("project", { clientId: c.id })}>
                <Plus size={13} /> New project
              </button>
            </div>
          </div>
        );
      })}
      <button onClick={() => openModal("client")} style={{
        border: "1.5px dashed #C7CDD8", borderRadius: 14, background: "transparent", cursor: "pointer",
        minHeight: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8, color: T.textDim, fontSize: 13.5, fontWeight: 700,
      }}>
        <Plus size={20} /> Add client
      </button>
    </div>
  );

  // ---------- Billing ----------
  const Billing = () => {
    const outstanding = invoices.filter((i) => i.status === "sent").reduce((s, i) => s + i.amount, 0);
    const overdueAmt = invoices.filter(invOverdue).reduce((s, i) => s + i.amount, 0);
    const drafts = invoices.filter((i) => i.status === "draft");
    const paidThisYear = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
    const visInvoices = invoices
      .filter((i) => (clientFilter === "all" || i.clientId === clientFilter) &&
        (!search || i.desc.toLowerCase().includes(search.toLowerCase()) || i.number.toLowerCase().includes(search.toLowerCase())))
      .sort((a, b) => (b.issueDate || "").localeCompare(a.issueDate || ""));
    const retainerClients = clients.filter((c) => c.retainer > 0);
    const label = monthLabel();
    const pendingRetainers = retainerClients.filter((c) => !invoices.some((i) => i.clientId === c.id && i.desc.includes(label)));

    return (
      <div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
          <StatCard icon={Receipt} label="Outstanding" value={money(outstanding)} sub={`${invoices.filter((i) => i.status === "sent").length} invoice(s) awaiting payment`} />
          <StatCard icon={Clock} label="Overdue" value={money(overdueAmt)} sub={overdueAmt ? "follow up with clients" : "nothing overdue"} />
          <StatCard icon={Send} label="Drafts ready" value={drafts.length} sub="review, then send in one click" />
          <StatCard icon={CircleDollarSign} label="Collected" value={money(paidThisYear)} sub="all paid invoices" />
        </div>

        {/* Retainer auto-billing */}
        <div style={{ ...cardStyle, marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 14 }}>
              <Zap size={15} color={T.accent} /> Retainer billing — {label}
            </div>
            <div style={{ fontSize: 12.5, color: T.textDim, marginTop: 3 }}>
              {pendingRetainers.length
                ? `${pendingRetainers.length} of ${retainerClients.length} retainer client(s) not yet invoiced this month: ${pendingRetainers.map((c) => c.name).join(", ")}`
                : `All ${retainerClients.length} retainer client(s) invoiced for ${label}.`}
            </div>
          </div>
          <button style={{ ...btnPrimary, opacity: pendingRetainers.length ? 1 : 0.5 }} disabled={!pendingRetainers.length} onClick={generateRetainerInvoices}>
            <Zap size={14} /> Generate {pendingRetainers.length || ""} retainer invoice{pendingRetainers.length !== 1 ? "s" : ""}
          </button>
        </div>

        {/* Invoice table */}
        <div style={cardStyle}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
              <thead><tr>
                <th style={th}>Invoice</th><th style={th}>Client</th><th style={th}>Description</th>
                <th style={{ ...th, textAlign: "right" }}>Amount</th><th style={th}>Due</th><th style={th}>Status</th><th style={th} />
              </tr></thead>
              <tbody>
                {visInvoices.map((inv) => {
                  const c = clientById(inv.clientId);
                  const od = invOverdue(inv);
                  return (
                    <tr key={inv.id}>
                      <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>{inv.number}</td>
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: c?.color, flexShrink: 0 }} />
                          <span>{c?.name}</span>
                        </div>
                      </td>
                      <td style={{ ...td, maxWidth: 220 }}>{inv.desc}</td>
                      <td style={{ ...td, textAlign: "right", fontWeight: 700 }}>{money(inv.amount)}</td>
                      <td style={{ ...td, whiteSpace: "nowrap", color: od ? T.red : T.ink, fontWeight: od ? 700 : 400 }}>
                        {fmtDate(inv.dueDate)}{od ? ` · ${-daysLeft(inv.dueDate)}d late` : ""}
                      </td>
                      <td style={td}>
                        <StatusPill list={INVOICE_STATUSES} value={inv.status} onChange={(e) => setInvoiceStatus(inv.id, e.target.value)} />
                      </td>
                      <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                        {inv.status !== "paid" && (
                          <button style={{ ...btnGhost, fontSize: 12, fontWeight: 700, color: T.accent, borderColor: `${T.accent}50`, marginRight: 5 }}
                            onClick={() => sendInvoice(inv)} title={c?.email ? `Email to ${c.email}` : "No client email set"}>
                            <Send size={12} /> {inv.status === "draft" ? "Send" : "Re-send"}
                          </button>
                        )}
                        <button style={{ ...btnGhost, padding: "3px 5px" }} onClick={() => deleteInvoice(inv.id)} aria-label="Delete invoice"><Trash2 size={13} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {visInvoices.length === 0 && <Empty text="No invoices yet. Generate retainer invoices above or create one manually." />}
          <div style={{ marginTop: 12, fontSize: 12, color: T.textDim }}>
            "Send" opens a pre-filled email to the client's billing address in your mail app, then marks the invoice as sent. Mark it paid once payment lands.
          </div>
        </div>
      </div>
    );
  };

  // ---------- Nav ----------
  const NavBtn = ({ id, icon: Icon, label }) => (
    <button onClick={() => { setView(id); setOpenProjectId(null); }} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
      background: view === id ? "rgba(255,255,255,0.10)" : "transparent",
      color: view === id ? "#fff" : "#A6ACBE", border: "none", borderRadius: 9,
      padding: "10px 12px", fontSize: 13.5, fontWeight: 700, cursor: "pointer",
    }}>
      <Icon size={16} /> {label}
    </button>
  );

  const isActProject = form.service === "Activation" || form.service === "Event";

  if (!loaded) {
    return (
      <div style={{
        minHeight: "100vh", background: T.paper, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 14,
        fontFamily: "'Avenir Next','Segoe UI',system-ui,-apple-system,sans-serif",
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Megaphone size={22} color="#fff" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.textDim }}>Loading your board…</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.paper, fontFamily: "'Avenir Next','Segoe UI',system-ui,-apple-system,sans-serif", color: T.ink }}>
      {/* Sidebar */}
      <aside style={{ width: 208, background: T.ink, padding: "20px 14px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "2px 8px 18px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Megaphone size={16} color="#fff" />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>Creative Studio</div>
            <div style={{ color: "#8A90A4", fontSize: 10.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Agency PM</div>
          </div>
        </div>
        <NavBtn id="overview" icon={LayoutGrid} label="Overview" />
        <NavBtn id="projects" icon={FolderKanban} label="Projects" />
        <NavBtn id="board" icon={Kanban} label="Task board" />
        <NavBtn id="clients" icon={Users} label="Clients" />
        <NavBtn id="billing" icon={Receipt} label="Billing" />
        <div style={{ marginTop: "auto", padding: "14px 8px 4px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ color: "#8A90A4", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Team</div>
          {team.map((m) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
              <Avatar name={m.name} size={24} />
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#E7E9F0", fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
                <div style={{ color: "#8A90A4", fontSize: 10.5 }}>{m.role}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 6, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 700, color: storageMode !== "none" ? (saveState === "error" ? "#FCA5A5" : "#8DE0A8") : "#C9CEDB" }}>
              {storageMode !== "none" ? <Cloud size={13} /> : <CloudOff size={13} />}
              {storageMode === "none"
                ? "Preview mode — changes not saved"
                : saveState === "saving" ? "Saving…"
                : saveState === "error" ? "Save failed — retrying on next change"
                : storageMode === "claude" ? "Saved · shared with your team" : "Saved on this device"}
            </div>
            <button onClick={resetAll} style={{
              marginTop: 9, display: "inline-flex", alignItems: "center", gap: 6,
              background: resetArm ? "rgba(252,165,165,0.15)" : "transparent",
              border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7, padding: "5px 9px",
              fontSize: 11, fontWeight: 700, color: resetArm ? "#FCA5A5" : "#A6ACBE", cursor: "pointer",
            }}>
              <RotateCcw size={12} /> {resetArm ? "Click again to confirm reset" : "Reset board to sample data"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "22px 26px", minWidth: 0 }}>
        {!openProject && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
            <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800, letterSpacing: -0.3 }}>
              {view === "overview" ? "Overview" : view === "board" ? "Task board" : view === "projects" ? "Projects" : view === "billing" ? "Billing" : "Clients"}
            </h1>
            <div style={{ flex: 1 }} />
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: T.textDim }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" style={{ ...inputStyle, width: 170, paddingLeft: 32, background: "#fff" }} />
            </div>
            <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} style={{ ...inputStyle, width: "auto", background: "#fff" }}>
              <option value="all">All clients</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button style={btnPrimary} onClick={() => openModal(view === "board" ? "task" : view === "billing" ? "invoice" : "project")}>
              <Plus size={15} /> {view === "board" ? "New task" : view === "billing" ? "New invoice" : "New project"}
            </button>
          </div>
        )}

        {openProject ? <ProjectDetail p={openProject} /> : (
          <>
            {view === "overview" && <Overview />}
            {view === "board" && <Board />}
            {view === "projects" && <ProjectsList />}
            {view === "clients" && <Clients />}
            {view === "billing" && <Billing />}
          </>
        )}
      </main>

      {/* ---------- Modals ---------- */}
      {modal === "project" && (
        <Modal title="New project" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div><label style={labelStyle}>Project name</label>
              <input style={inputStyle} value={form.name || ""} onChange={set("name")} placeholder="e.g., Grand Launch Activation — Leg 2" autoFocus /></div>
            <div><label style={labelStyle}>Client</label>
              <select style={inputStyle} value={form.clientId || ""} onChange={set("clientId")}>
                <option value="">Select client…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Service</label>
                <select style={inputStyle} value={form.service || "Activation"} onChange={set("service")}>
                  {SERVICES.map((s) => <option key={s}>{s}</option>)}
                </select></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Total budget ($)</label>
                <input style={inputStyle} type="number" value={form.budget || ""} onChange={set("budget")} placeholder="0" /></div>
            </div>
            {isActProject ? (
              <>
                <div><label style={labelStyle}>Venue</label>
                  <input style={inputStyle} value={form.venue || ""} onChange={set("venue")} placeholder="e.g., Activity Center, Metro Mall" /></div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}><label style={labelStyle}>Event start</label>
                    <input style={inputStyle} type="date" value={form.startDate || ""} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value, due: e.target.value }))} /></div>
                  <div style={{ flex: 1 }}><label style={labelStyle}>Event end</label>
                    <input style={inputStyle} type="date" value={form.endDate || ""} onChange={set("endDate")} /></div>
                </div>
              </>
            ) : (
              <div><label style={labelStyle}>Due date</label>
                <input style={inputStyle} type="date" value={form.due || ""} onChange={set("due")} /></div>
            )}
            <button style={{ ...btnPrimary, justifyContent: "center" }} onClick={addProject}>Create project</button>
          </div>
        </Modal>
      )}

      {modal === "task" && (
        <Modal title="New task" onClose={() => { setModal(null); setTaskAdded(0); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {taskAdded > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#15803D" }}>
                <CheckCircle2 size={15} /> {taskAdded} task{taskAdded > 1 ? "s" : ""} added — add another below or click Done
              </div>
            )}
            <div><label style={labelStyle}>Task</label>
              <input style={inputStyle} value={form.title || ""} onChange={set("title")} placeholder="e.g., Finalize booth KV" autoFocus /></div>
            <div><label style={labelStyle}>Project</label>
              <select style={inputStyle} value={form.projectId || ""} onChange={set("projectId")}>
                <option value="">Select project…</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{clientById(p.clientId)?.name} — {p.name}</option>)}
              </select></div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Assignee</label>
                <select style={inputStyle} value={form.assignee || team[0].id} onChange={set("assignee")}>
                  {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Due date</label>
                <input style={inputStyle} type="date" value={form.due || ""} onChange={set("due")} /></div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...btnPrimary, flex: 1, justifyContent: "center", background: T.inkSoft }} onClick={() => addTask(false)}>
                <Plus size={14} /> Add & add another
              </button>
              <button style={{ ...btnPrimary, flex: 1, justifyContent: "center" }} onClick={() => addTask(true)}>
                {taskAdded > 0 ? "Done" : "Add task"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === "client" && (
        <Modal title="New client" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div><label style={labelStyle}>Client name</label>
              <input style={inputStyle} value={form.name || ""} onChange={set("name")} autoFocus /></div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Industry</label>
                <input style={inputStyle} value={form.industry || ""} onChange={set("industry")} /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Retainer ($/mo)</label>
                <input style={inputStyle} type="number" value={form.retainer || ""} onChange={set("retainer")} placeholder="0" /></div>
            </div>
            <div><label style={labelStyle}>Billing email</label>
              <input style={inputStyle} type="email" value={form.email || ""} onChange={set("email")} placeholder="accounting@client.com" /></div>
            <button style={{ ...btnPrimary, justifyContent: "center" }} onClick={addClient}>Add client</button>
          </div>
        </Modal>
      )}

      {modal === "budgetItem" && (
        <Modal title="Add budget line" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div><label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category || BUDGET_CATS[0]} onChange={set("category")}>
                {BUDGET_CATS.map((c) => <option key={c}>{c}</option>)}
              </select></div>
            <div><label style={labelStyle}>Line item</label>
              <input style={inputStyle} value={form.label || ""} onChange={set("label")} placeholder="e.g., LED wall rental" autoFocus /></div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Planned ($)</label>
                <input style={inputStyle} type="number" value={form.planned || ""} onChange={set("planned")} placeholder="0" /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Actual ($)</label>
                <input style={inputStyle} type="number" value={form.actual || ""} onChange={set("actual")} placeholder="0" /></div>
            </div>
            <button style={{ ...btnPrimary, justifyContent: "center" }} onClick={addBudgetItem}>Add line</button>
          </div>
        </Modal>
      )}

      {modal === "vendor" && (
        <Modal title="Add vendor" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div><label style={labelStyle}>Vendor name</label>
              <input style={inputStyle} value={form.name || ""} onChange={set("name")} placeholder="e.g., BuildRight Fabrication" autoFocus /></div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Service</label>
                <input style={inputStyle} value={form.service || ""} onChange={set("service")} placeholder="e.g., Booth fabrication" /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Quote ($)</label>
                <input style={inputStyle} type="number" value={form.quote || ""} onChange={set("quote")} placeholder="0" /></div>
            </div>
            <button style={{ ...btnPrimary, justifyContent: "center" }} onClick={addVendor}>Add vendor</button>
          </div>
        </Modal>
      )}

      {modal === "manpower" && (
        <Modal title="Add manpower" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div><label style={labelStyle}>Name</label>
              <input style={inputStyle} value={form.name || ""} onChange={set("name")} autoFocus /></div>
            <div><label style={labelStyle}>Role</label>
              <input style={inputStyle} value={form.role || ""} onChange={set("role")} placeholder="e.g., Brand ambassador, emcee, setup crew" /></div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Rate / day ($)</label>
                <input style={inputStyle} type="number" value={form.rate || ""} onChange={set("rate")} placeholder="0" /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Call time</label>
                <input style={inputStyle} type="time" value={form.callTime || ""} onChange={set("callTime")} /></div>
            </div>
            <button style={{ ...btnPrimary, justifyContent: "center" }} onClick={addManpower}>Add person</button>
          </div>
        </Modal>
      )}

      {modal === "invoice" && (
        <Modal title="New invoice" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div><label style={labelStyle}>Client</label>
              <select style={inputStyle} value={form.clientId || ""} onChange={set("clientId")}>
                <option value="">Select client…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
            <div><label style={labelStyle}>Project (optional)</label>
              <select style={inputStyle} value={form.projectId || ""} onChange={set("projectId")}>
                <option value="">Not linked to a project</option>
                {projects.filter((p) => !form.clientId || p.clientId === form.clientId).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select></div>
            <div><label style={labelStyle}>Description</label>
              <input style={inputStyle} value={form.desc || ""} onChange={set("desc")} placeholder="e.g., Activation production — 50% balance" autoFocus /></div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>Amount ($)</label>
                <input style={inputStyle} type="number" value={form.amount || ""} onChange={set("amount")} placeholder="0" /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Due date</label>
                <input style={inputStyle} type="date" value={form.dueDate || ""} onChange={set("dueDate")} /></div>
            </div>
            <div style={{ fontSize: 12, color: T.textDim }}>Invoice number is assigned automatically. Leave the due date blank for net-15 terms.</div>
            <button style={{ ...btnPrimary, justifyContent: "center" }} onClick={addInvoice}>Create draft invoice</button>
          </div>
        </Modal>
      )}

      {modal === "check" && (
        <Modal title="Add checklist item" onClose={() => setModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div><label style={labelStyle}>Group</label>
              <select style={inputStyle} value={form.group || CHECK_GROUPS[0]} onChange={set("group")}>
                {CHECK_GROUPS.map((g) => <option key={g}>{g}</option>)}
              </select></div>
            <div><label style={labelStyle}>Item</label>
              <input style={inputStyle} value={form.label || ""} onChange={set("label")} placeholder="e.g., Secure fire safety clearance" autoFocus /></div>
            <button style={{ ...btnPrimary, justifyContent: "center" }} onClick={addCheckItem}>Add item</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

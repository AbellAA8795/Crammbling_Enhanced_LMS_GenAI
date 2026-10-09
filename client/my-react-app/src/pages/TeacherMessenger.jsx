import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTeacherTheme, ThemeToggle } from "./TeacherTheme";
import TeacherLogout from "./TeacherLogout";

/* ---------------------------------------------------------
   Icons
--------------------------------------------------------- */
const Icon = {
  Menu: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>),
  Close: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>),
  Dashboard: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>),
  Classroom: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M22 10 12 5 2 10l10 5 10-5z" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Chatbot: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Personalized: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" /></svg>),
  GroupMessage: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" /><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" /></svg>),
  User: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="7" r="4" /></svg>),
  Logout: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" /><line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" /></svg>),
  Bell: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>),
  Search: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" /></svg>),
  Chevron: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" {...p}><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Edit: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Trash: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Alert: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" /><circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" /></svg>),
  Users: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" /><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" /></svg>),
  Paperclip: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M21 12.5 12.5 21a4.95 4.95 0 0 1-7-7L14 5.5a3.5 3.5 0 0 1 5 5L10.5 19a2 2 0 0 1-3-3L15 8.5" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Send: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M22 2 11 13" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
};

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
function initialsFor(name) {
  return String(name || "").split(" ").map((w) => w[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
}

const BADGE_COLORS = ["#3B82F6", "#F59E0B", "#22C55E", "#16A34A", "#EF4444", "#8B5CF6"];
function colorForString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return BADGE_COLORS[h % BADGE_COLORS.length];
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function withAlpha(color, alpha) {
  if (!color) return `rgba(0,0,0,0)`;
  if (color.startsWith("var(")) return `color-mix(in srgb, ${color} ${parseInt(alpha, 16) || 20}%, transparent)`;
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const a = Math.round((parseInt(alpha, 16) / 255) * 100);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a / 100})`;
}

/* ---------------------------------------------------------
   Data
--------------------------------------------------------- */
const TEACHER = { name: "Prof. Reyes", department: "Department of Computer Science", id: "t1" };
const ME = TEACHER.id;

const STUDENT_DIRECTORY = [
  { id: "s1", name: "Maya K.", email: "maya.k@univ.edu" },
  { id: "s2", name: "Alex Chen", email: "alex.chen@univ.edu" },
  { id: "s3", name: "Priya N.", email: "priya.n@univ.edu" },
  { id: "s4", name: "Owen T.", email: "owen.t@univ.edu" },
  { id: "s5", name: "Riley P.", email: "riley.p@univ.edu" },
  { id: "s6", name: "Devon M.", email: "devon.m@univ.edu" },
  { id: "s7", name: "Sam W.", email: "sam.w@univ.edu" },
  { id: "s8", name: "Kai L.", email: "kai.l@univ.edu" },
  { id: "s9", name: "Jules B.", email: "jules.b@univ.edu" },
  { id: "s10", name: "Jordan P.", email: "jordan.p@univ.edu" },
  { id: "s11", name: "Casey R.", email: "casey.r@univ.edu" },
  { id: "s12", name: "Taylor M.", email: "taylor.m@univ.edu" },
];

const INITIAL_GROUPS = [
  {
    id: "g1", name: "CS240 — Section A", type: "classroom", color: "#3B82F6", picture: null,
    members: [
      { id: ME, name: "Prof. Reyes", role: "admin", email: "reyes@univ.edu" },
      { id: "s1", name: "Maya K.", role: "member", email: "maya.k@univ.edu" },
      { id: "s2", name: "Alex Chen", role: "member", email: "alex.chen@univ.edu" },
      { id: "s3", name: "Priya N.", role: "member", email: "priya.n@univ.edu" },
      { id: "s4", name: "Owen T.", role: "member", email: "owen.t@univ.edu" },
    ],
    messages: [
      { id: "msg1", senderId: "s1", senderName: "Maya K.", text: "Will the midterm cover chapter 6?", time: "09:12" },
      { id: "msg2", senderId: ME, senderName: "Prof. Reyes", text: "Yes, chapters 1–6 are all fair game.", time: "09:14" },
    ],
    materials: [
      { id: "mat1", title: "Chapter 5 Slides — Graph Traversals", kind: "Slides", addedBy: "Prof. Reyes" },
    ],
    tasks: [],
  },
  {
    id: "g2", name: "MATH210 — Section B", type: "classroom", color: "#22C55E", picture: null,
    members: [
      { id: ME, name: "Prof. Reyes", role: "admin", email: "reyes@univ.edu" },
      { id: "s6", name: "Devon M.", role: "member", email: "devon.m@univ.edu" },
      { id: "s7", name: "Sam W.", role: "member", email: "sam.w@univ.edu" },
    ],
    messages: [
      { id: "msg3", senderId: ME, senderName: "Prof. Reyes", text: "Grades for Assignment 2 are posted.", time: "08:30" },
    ],
    materials: [],
    tasks: [],
  },
  {
    id: "g3", name: "PHYS101 — Section C", type: "classroom", color: "#F59E0B", picture: null,
    members: [
      { id: ME, name: "Prof. Reyes", role: "admin", email: "reyes@univ.edu" },
      { id: "s8", name: "Kai L.", role: "member", email: "kai.l@univ.edu" },
      { id: "s9", name: "Jules B.", role: "member", email: "jules.b@univ.edu" },
    ],
    messages: [],
    materials: [],
    tasks: [],
  },
];

/* ---------------------------------------------------------
   Shared small components
--------------------------------------------------------- */
function Avatar({ name, size = 40, color, avatarUrl, onClick }) {
  const c = color || colorForString(name);
  const style = {
    width: size, height: size,
    fontSize: Math.max(10, size * 0.36),
    backgroundColor: withAlpha(c, "33"),
    color: c,
    border: `1px solid ${withAlpha(c, "4D")}`,
  };
  const cls = "shrink-0 flex items-center justify-center font-semibold rounded-xl overflow-hidden";
  const inner = avatarUrl ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" /> : initialsFor(name);
  if (!onClick) return <div className={cls} style={style}>{inner}</div>;
  return <button type="button" onClick={onClick} className={`${cls} transition-all hover:scale-105 active:scale-95`} style={style} title={name}>{inner}</button>;
}

function Badge({ color = "var(--tt-ac)", children }) {
  return (
    <span className="text-xs font-semibold py-1 px-2.5 rounded-full shrink-0"
      style={{ color, border: `1px solid ${color}`, backgroundColor: "transparent" }}>
      {children}
    </span>
  );
}

function ConfirmDialog({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", confirmTone = "danger", onConfirm, onCancel }) {
  const tone = confirmTone === "danger" ? "var(--tt-err, #EF4444)" : "var(--tt-ac, #3B82F6)";
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onCancel?.(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const modal = (
    <div style={{ position: "fixed", inset: 0, zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onCancel} style={{ position: "absolute", inset: 0, backgroundColor: "var(--tt-overlay, rgba(0,0,0,0.6))" }} />
      <div role="dialog" aria-modal="true" style={{ position: "relative", width: "100%", maxWidth: 440, backgroundColor: "var(--tt-bg1, #18181B)", color: "var(--tt-tx0, #FAFAFA)", border: "1px solid var(--tt-bd0, #27272A)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16, zIndex: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 40, height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: `color-mix(in srgb, ${tone} 15%, transparent)`, color: tone }}>
            <Icon.Alert style={{ width: 20, height: 20 }} />
          </div>
          <div style={{ minWidth: 0, flex: 1, paddingTop: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>{title}</span>
          </div>
        </div>
        {message && <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--tt-tx1, #A1A1AA)", margin: 0 }}>{message}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button type="button" onClick={onCancel} style={{ fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 8, color: "var(--tt-tx1, #A1A1AA)", background: "transparent", border: "none", cursor: "pointer" }}>{cancelLabel}</button>
          <button type="button" onClick={onConfirm} autoFocus style={{ fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 8, backgroundColor: tone, color: "#FFFFFF", border: "none", cursor: "pointer" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

/* ---------------------------------------------------------
   Sidebar
--------------------------------------------------------- */
const NAV_ITEMS = [
  { key: "dashboard",    label: "Dashboard",     icon: Icon.Dashboard,    path: "/teacher" },
  { key: "classroom",    label: "Classroom",     icon: Icon.Classroom,    path: "/teacher/classroom" },
  { key: "chatbot",      label: "Chatbot",       icon: Icon.Chatbot,      path: "/teacher/chatbot" },
  { key: "personalized", label: "Personalized",  icon: Icon.Personalized, path: "/teacher/personalized" },
  { key: "groupmsg",     label: "Group Message", icon: Icon.GroupMessage, path: "/teacher/messenger" },
];

function Sidebar({ activePage, onNavigate, onCloseMobile, onLogout }) {
  return (
    <div className="flex flex-col h-full w-72 shrink-0"
      style={{ backgroundColor: "var(--tt-bg2)", borderRight: `1px solid var(--tt-bd0)` }}>
      <div className="flex justify-end md:hidden px-3 pt-3">
        <button onClick={onCloseMobile} aria-label="Close menu" style={{ color: "var(--tt-tx1)" }}>
          <Icon.Close className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: `1px solid var(--tt-bd0)` }}>
          <div className="w-11 h-11 flex items-center justify-center shrink-0 rounded-xl"
            style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-ac)" }}>
            <Icon.Classroom className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-semibold tracking-wide truncate" style={{ color: "var(--tt-tx0)" }}>Faculty Portal</span>
            <span className="text-xs truncate" style={{ color: "var(--tt-tx2)" }}>{TEACHER.department}</span>
          </div>
        </div>

        <div className="px-6 pt-6 pb-3">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>Navigation</span>
        </div>

        <nav className="flex flex-col px-3 gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === activePage;
            const IconCmp = item.icon;
            return (
              <button key={item.key} onClick={() => onNavigate(item.key)}
                className="flex items-center gap-3 px-3.5 py-3 text-left rounded-xl transition-colors duration-150"
                style={{
                  backgroundColor: isActive ? "var(--tt-bg3)" : "transparent",
                  color: isActive ? "var(--tt-tx0)" : "var(--tt-tx1)",
                }}>
                <IconCmp className="w-5 h-5 shrink-0" style={{ color: isActive ? "var(--tt-ac)" : "var(--tt-tx1)" }} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col p-3 gap-1" style={{ borderTop: `1px solid var(--tt-bd0)`, backgroundColor: "var(--tt-bg2)" }}>
        <button onClick={() => onNavigate("profile")}
          className="flex items-center gap-3 px-3.5 py-3 text-left rounded-xl transition-colors"
          style={{ color: "var(--tt-tx1)" }}>
          <Icon.User className="w-5 h-5" />
          <span className="text-sm">My Profile</span>
        </button>
        <button onClick={onLogout} className="flex items-center gap-3 px-3.5 py-3 text-left rounded-xl transition-colors"
          style={{ color: "var(--tt-tx1)" }}>
          <Icon.Logout className="w-5 h-5" />
          <span className="text-sm">Sign out</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Create classroom modal
--------------------------------------------------------- */
function CreateGroupModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const field = "w-full text-sm py-3 px-4 outline-none rounded-lg";
  const inputStyle = { backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)" };

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
  }

  const modal = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0" style={{ backgroundColor: "var(--tt-overlay)" }} onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-md p-6 flex flex-col gap-4 rounded-2xl"
        style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>New classroom</span>
          <button type="button" onClick={onClose} style={{ color: "var(--tt-tx1)" }}><Icon.Close className="w-5 h-5" /></button>
        </div>

        <p className="text-sm" style={{ color: "var(--tt-tx2)" }}>
          Group Message is for classroom announcements, files, and Q&amp;A.
        </p>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>Class name</span>
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. CS240 — Section A" className={field} style={inputStyle} />
        </label>

        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="text-sm font-semibold py-2.5 px-4 rounded-lg"
            style={{ color: "var(--tt-tx1)" }}>Cancel</button>
          <button type="submit" disabled={!name.trim()}
            className="text-sm font-semibold py-2.5 px-5 rounded-lg disabled:opacity-40"
            style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>Create</button>
        </div>
      </form>
    </div>
  );
  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

/* ---------------------------------------------------------
   Add member modal
--------------------------------------------------------- */
function AddMemberModal({ existingMemberIds, onClose, onAdd }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDENT_DIRECTORY.filter((s) => {
      if (existingMemberIds.includes(s.id)) return false;
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    }).slice(0, 8);
  }, [query, existingMemberIds]);

  const field = "w-full text-sm py-3 px-4 pl-10 outline-none rounded-lg";
  const inputStyle = { backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)" };

  const modal = (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0" style={{ backgroundColor: "var(--tt-overlay)" }} onClick={onClose} />
      <div className="relative w-full max-w-md p-6 flex flex-col gap-4 rounded-2xl"
        style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>Add member</span>
          <button type="button" onClick={onClose} style={{ color: "var(--tt-tx1)" }}><Icon.Close className="w-5 h-5" /></button>
        </div>

        <p className="text-sm" style={{ color: "var(--tt-tx2)" }}>
          Search students by name or Gmail to add them to this classroom.
        </p>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--tt-tx2)" }}>
            <Icon.Search className="w-4 h-4" />
          </span>
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or Gmail…" className={field} style={inputStyle} />
        </div>

        <div className="flex flex-col max-h-72 overflow-y-auto rounded-xl"
          style={{ border: `1px solid var(--tt-bd0)`, backgroundColor: "var(--tt-bg2)" }}>
          {results.length === 0 && (
            <p className="text-sm px-4 py-6 text-center" style={{ color: "var(--tt-tx2)" }}>
              {query ? `No students match "${query}".` : "No more students to add."}
            </p>
          )}
          {results.map((s, idx) => (
            <button key={s.id} type="button" onClick={() => onAdd(s)}
              className="flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{ borderTop: idx === 0 ? "none" : `1px solid var(--tt-bd0)` }}>
              <Avatar name={s.name} size={36} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold block truncate" style={{ color: "var(--tt-tx0)" }}>{s.name}</span>
                <span className="text-xs block truncate mt-0.5" style={{ color: "var(--tt-tx2)" }}>{s.email}</span>
              </div>
              <span className="text-xs font-semibold shrink-0" style={{ color: "var(--tt-ac)" }}>Add</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="text-sm font-semibold py-2.5 px-4 rounded-lg"
            style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>Done</button>
        </div>
      </div>
    </div>
  );
  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

/* ---------------------------------------------------------
   Image cropper
--------------------------------------------------------- */
function ImageCropperModal({ src, aspect = 1, title = "Adjust image", onSave, onClose }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const dragStart = useRef(null);
  const imgRef = useRef(null);
  const CROP_W = 260;
  const CROP_H = Math.round(CROP_W / aspect);
  const OUT_W = 512;
  const OUT_H = Math.round(OUT_W / aspect);
  const baseScale = natural.w && natural.h ? Math.max(CROP_W / natural.w, CROP_H / natural.h) : 1;
  const dispW = natural.w * baseScale * scale;
  const dispH = natural.h * baseScale * scale;

  function handleImgLoad(e) { const img = e.currentTarget; setNatural({ w: img.naturalWidth, h: img.naturalHeight }); }
  function onPointerDown(e) { e.preventDefault(); setDragging(true); dragStart.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }; e.currentTarget.setPointerCapture?.(e.pointerId); }
  function onPointerMove(e) {
    if (!dragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.sx;
    const dy = e.clientY - dragStart.current.sy;
    setOffset({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
  }
  function onPointerUp(e) { setDragging(false); dragStart.current = null; e.currentTarget.releasePointerCapture?.(e.pointerId); }

  function handleSave() {
    const img = imgRef.current;
    if (!img || !natural.w) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUT_W; canvas.height = OUT_H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, OUT_W, OUT_H);
    const k = OUT_W / CROP_W;
    const imgLeft = (CROP_W - dispW) / 2 + offset.x;
    const imgTop = (CROP_H - dispH) / 2 + offset.y;
    ctx.drawImage(img, imgLeft * k, imgTop * k, dispW * k, dispH * k);
    onSave(canvas.toDataURL("image/jpeg", 0.92));
  }
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
        <div className="flex justify-between items-center px-5 py-4" style={{ borderBottom: `1px solid var(--tt-bd0)` }}>
          <span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>{title}</span>
          <button onClick={onClose} style={{ color: "var(--tt-tx1)" }}><Icon.Close className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-col items-center gap-4 p-5">
          <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
            className="relative overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none touch-none"
            style={{ width: CROP_W, height: CROP_H }}>
            <img ref={imgRef} src={src} alt="" draggable={false} onLoad={handleImgLoad}
              className="absolute pointer-events-none select-none"
              style={{ width: dispW, height: dispH, left: (CROP_W - dispW) / 2 + offset.x, top: (CROP_H - dispH) / 2 + offset.y, maxWidth: "none" }} />
          </div>
          <div className="w-full flex items-center gap-3">
            <span className="text-xs font-semibold" style={{ color: "var(--tt-tx2)" }}>Zoom</span>
            <input type="range" min="1" max="4" step="0.01" value={scale}
              onChange={(e) => setScale(Number(e.target.value))} className="flex-1" />
            <button type="button" onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}
              className="text-xs font-semibold" style={{ color: "var(--tt-tx2)" }}>Reset</button>
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose} className="flex-1 text-sm font-semibold py-2.5 rounded-lg"
            style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)`, background: "transparent" }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 text-sm font-semibold py-2.5 rounded-lg"
            style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Group detail modal
--------------------------------------------------------- */
function GroupDetailModal({ group, tab, onTabChange, onClose, onAddMember, onPromote, onKick, onChangePicture }) {
  if (!group) return null;

  const tabDefs = [
    { key: "members", label: "Members", count: group.members.length },
    { key: "materials", label: "Materials", count: group.materials?.length || 0 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>

        <div className="flex justify-between items-center p-4 gap-3" style={{ borderBottom: `1px solid var(--tt-bd0)` }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative group/av shrink-0">
              <Avatar name={group.name} size={44} color={group.color} avatarUrl={group.picture} />
              <button onClick={onChangePicture}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/av:opacity-100 transition-opacity"
                style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)", border: `1px solid var(--tt-bg1)` }}
                aria-label="Change picture">
                <Icon.Edit style={{ width: 10, height: 10 }} />
              </button>
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold block truncate" style={{ color: "var(--tt-tx0)" }}>{group.name}</span>
              <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>Classroom details</span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--tt-tx1)" }}><Icon.Close className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 px-4" style={{ borderBottom: `1px solid var(--tt-bd0)` }}>
          {tabDefs.map((t) => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => onTabChange(t.key)}
                className="flex items-center gap-1 py-3 px-3 text-sm font-semibold whitespace-nowrap transition-colors"
                style={{
                  color: active ? "var(--tt-ac)" : "var(--tt-tx1)",
                  borderBottom: `2px solid ${active ? "var(--tt-ac)" : "transparent"}`,
                  marginBottom: "-1px",
                }}>
                {t.label}
                {typeof t.count === "number" && <span className="text-xs opacity-70">({t.count})</span>}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tab === "members" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--tt-tx2)" }}>
                  Members ({group.members.length})
                </span>
                <button onClick={onAddMember} className="text-xs font-semibold"
                  style={{ color: "var(--tt-ac)" }}>+ Add member</button>
              </div>
              {group.members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)` }}>
                  <Avatar name={m.name} size={36} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold block truncate" style={{ color: "var(--tt-tx0)" }}>{m.name}</span>
                    {m.email && <span className="text-xs block truncate mt-0.5" style={{ color: "var(--tt-tx2)" }}>{m.email}</span>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge color={m.role === "admin" ? "var(--tt-ac)" : "var(--tt-tx2)"}>{m.role.toUpperCase()}</Badge>
                    {m.role !== "admin" && m.id !== ME && (
                      <>
                        <button onClick={() => onPromote(m.id)}
                          className="text-xs font-semibold py-1 px-2 rounded"
                          style={{ color: "var(--tt-warn)", border: `1px solid var(--tt-warn)` }}>Make admin</button>
                        <button onClick={() => onKick(m.id, m.name)}
                          className="p-1.5 rounded-lg"
                          style={{ color: "var(--tt-err)", border: `1px solid var(--tt-bd0)` }} title="Remove">
                          <Icon.Close className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "materials" && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--tt-tx2)" }}>
                Lesson materials
              </span>
              {(group.materials || []).length === 0 && (
                <p className="text-sm py-6 text-center" style={{ color: "var(--tt-tx2)" }}>No materials posted yet.</p>
              )}
              {(group.materials || []).map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)` }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge color="var(--tt-ok)">{m.kind}</Badge>
                    <span className="text-sm truncate" style={{ color: "var(--tt-tx1)" }}>{m.title}</span>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: "var(--tt-tx2)" }}>{m.addedBy}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Image viewer
--------------------------------------------------------- */
function ImageViewerModal({ file, onClose }) {
  if (!file) return null;
  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/85" onClick={onClose} />
      <div className="relative z-10 flex flex-col items-center gap-3 max-w-full max-h-full">
        <img src={file.url} alt={file.name} className="max-w-[92vw] max-h-[75vh] object-contain rounded-lg" />
        <div className="flex items-center gap-3 rounded-xl px-3 py-2"
          style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
          <span className="text-sm truncate max-w-[40vw]" style={{ color: "var(--tt-tx1)" }}>{file.name}</span>
          <a href={file.url} download={file.name}
            className="text-xs font-semibold py-1.5 px-3 rounded"
            style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>Save</a>
          <button onClick={onClose} className="text-xs font-semibold" style={{ color: "var(--tt-tx2)" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Main
--------------------------------------------------------- */
export default function TeacherMessenger() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [, , teacherThemeStyle] = useTeacherTheme();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [activeGroupId, setActiveGroupId] = useState(INITIAL_GROUPS[0]?.id || null);
  const [openPanel, setOpenPanel] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [confirmKick, setConfirmKick] = useState(null);
  const [viewerFile, setViewerFile] = useState(null);
  const [gcPictureTarget, setGcPictureTarget] = useState(null);

  const fileInputRef = useRef(null);
  const gcFileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || null;

  useEffect(() => {
    if (activeGroup?.messages?.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeGroup?.messages]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setShowCreateGroup(false);
        setShowAddMember(false);
        setConfirmKick(null);
        setOpenPanel(null);
        setViewerFile(null);
        setGcPictureTarget(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleNavClick(key) {
    setMobileNavOpen(false);
    if (key === "groupmsg") return;
    const item = NAV_ITEMS.find((i) => i.key === key);
    if (item) navigate(item.path);
  }

  
  function updateActiveGroup(fn) {
    setGroups((prev) => prev.map((g) => (g.id === activeGroupId ? fn(g) : g)));
  }

  const visibleGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) =>
      g.name.toLowerCase().includes(q) ||
      g.messages.some((m) => (m.text || "").toLowerCase().includes(q))
    );
  }, [groups, searchQuery]);

  function createGroup(name) {
    const id = `g${Date.now()}`;
    const fresh = {
      id, name, type: "classroom", color: colorForString(name), picture: null,
      members: [{ id: ME, name: TEACHER.name, role: "admin", email: "reyes@univ.edu" }],
      messages: [], materials: [], tasks: [],
    };
    setGroups((prev) => [fresh, ...prev]);
    setActiveGroupId(id);
    setShowCreateGroup(false);
  }

  function addMember(student) {
    if (!activeGroup) return;
    if (activeGroup.members.some((m) => m.id === student.id)) return;
    updateActiveGroup((g) => ({
      ...g,
      members: [...g.members, { id: student.id, name: student.name, role: "member", email: student.email }],
    }));
  }

  function promoteToAdmin(memberId) {
    updateActiveGroup((g) => ({
      ...g,
      members: g.members.map((m) => (m.id === memberId ? { ...m, role: "admin" } : m)),
    }));
  }

  function performKick(memberId) {
    if (!activeGroup) return;
    updateActiveGroup((g) => ({
      ...g,
      members: g.members.filter((m) => m.id !== memberId),
    }));
    setConfirmKick(null);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!messageText.trim() || !activeGroup) return;
    updateActiveGroup((g) => ({
      ...g,
      messages: [...g.messages, { id: `msg${Date.now()}`, senderId: ME, senderName: TEACHER.name, text: messageText.trim(), time: "Now" }],
    }));
    setMessageText("");
  }

  function attachFiles(fileList) {
    if (!activeGroup) return;
    const MAX_FILE = 25 * 1024 * 1024;
    const picked = Array.from(fileList || []);
    const accepted = picked.filter((f) => f.size <= MAX_FILE);
    if (accepted.length < picked.length) alert("Some files were skipped because they are larger than 25 MB.");
    if (!accepted.length) return;
    const stamp = Date.now();
    const entries = accepted.map((f, i) => ({
      id: `f${stamp}_${i}`,
      name: f.name,
      size: formatSize(f.size),
      type: f.type,
      url: URL.createObjectURL(f),
      uploadedBy: TEACHER.name,
    }));
    updateActiveGroup((g) => ({
      ...g,
      messages: [...g.messages, ...entries.map((f) => ({ id: `msg${f.id}`, senderId: ME, senderName: TEACHER.name, text: "", file: f, time: "Now" }))],
    }));
  }

  function pickGcPicture(groupId) {
    setGcPictureTarget({ groupId, src: null });
    setTimeout(() => gcFileInputRef.current?.click(), 0);
  }

  function handleGcFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !gcPictureTarget) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setGcPictureTarget((prev) => (prev ? { ...prev, src: String(reader.result || "") } : null));
    reader.readAsDataURL(file);
  }

  function saveGcPicture(url) {
    if (!gcPictureTarget) return;
    const gid = gcPictureTarget.groupId;
    setGroups((prev) => prev.map((g) => (g.id === gid ? { ...g, picture: url } : g)));
    setGcPictureTarget(null);
  }

  return (
    <div style={teacherThemeStyle} className="flex h-screen w-full overflow-hidden">
      <input ref={gcFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleGcFileChange} />

      <div className="hidden md:flex h-full shrink-0">
        <Sidebar activePage="groupmsg" onNavigate={handleNavClick} onCloseMobile={() => {}} onLogout={() => setShowLogoutConfirm(true)} />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar activePage="groupmsg" onNavigate={handleNavClick} onCloseMobile={() => setMobileNavOpen(false)} onLogout={() => { setMobileNavOpen(false); setShowLogoutConfirm(true); }} />
          <div className="flex-1 bg-black/60" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: "var(--tt-bg0)" }}>
        <div className="shrink-0 flex flex-wrap justify-between items-center gap-4 py-4 px-5 sm:px-10"
          style={{ backgroundColor: "var(--tt-bg1)", borderBottom: `1px solid var(--tt-bd0)` }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden" style={{ color: "var(--tt-tx1)" }}
              onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
              <Icon.Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>{TEACHER.name}</span>
              <span className="text-xs mt-0.5" style={{ color: "var(--tt-tx2)" }}>{TEACHER.department}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <ThemeToggle />
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl"
              style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}
              onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
              <Icon.Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--tt-ac)" }} />
              {notifOpen && (
                <div className="absolute right-0 top-14 z-50 w-72 p-4 text-left rounded-xl"
                  style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)` }}>
                  <span className="text-sm font-semibold block mb-2" style={{ color: "var(--tt-tx0)" }}>Notifications</span>
                  <span className="text-sm block" style={{ color: "var(--tt-tx1)" }}>
                    New message in CS240 — Section A.
                  </span>
                </div>
              )}
            </button>
            <button
              onClick={() => navigate("/teacher/profile")}
              title="My Profile"
              aria-label="My Profile"
              className="w-10 h-10 flex items-center justify-center shrink-0 rounded-xl"
              style={{ border: "1px solid var(--tt-bd0)", backgroundColor: "var(--tt-bg3)", color: "var(--tt-ac)" }}
            >
              <Icon.User className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col px-5 sm:px-10 py-5">
          <div className="flex flex-col sm:flex-row flex-1 min-h-0 gap-4">
            <div className="flex flex-col w-full sm:w-80 shrink-0 rounded-2xl p-4 gap-3"
              style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>Classrooms</span>
                <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>{visibleGroups.length}</span>
              </div>

              <button onClick={() => setShowCreateGroup(true)}
                className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg"
                style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
                <Icon.Plus className="w-4 h-4" />
                New classroom
              </button>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--tt-tx2)" }}>
                  <Icon.Search className="w-4 h-4" />
                </span>
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search classrooms…"
                  className="w-full text-sm py-2.5 pl-10 pr-3 outline-none rounded-lg"
                  style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)" }} />
              </div>

              <div className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto">
                {visibleGroups.length === 0 && (
                  <p className="text-sm py-6 text-center" style={{ color: "var(--tt-tx2)" }}>
                    {searchQuery ? `No classrooms match "${searchQuery}".` : "No classrooms yet."}
                  </p>
                )}
                {visibleGroups.map((g) => {
                  const active = g.id === activeGroupId;
                  const lastMsg = g.messages[g.messages.length - 1];
                  return (
                    <button key={g.id} onClick={() => setActiveGroupId(g.id)}
                      className="flex items-center gap-3 p-3 text-left rounded-xl transition-colors"
                      style={{ backgroundColor: active ? "var(--tt-bg3)" : "transparent" }}>
                      <Avatar name={g.name} size={36} color={g.color} avatarUrl={g.picture} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold block truncate" style={{ color: "var(--tt-tx0)" }}>{g.name}</span>
                        <span className="text-xs truncate block mt-0.5" style={{ color: "var(--tt-tx2)" }}>
                          {lastMsg ? (lastMsg.text || (lastMsg.file ? `📎 ${lastMsg.file.name}` : "")) : "No messages yet"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-3">
              {!activeGroup ? (
                <div className="flex flex-col items-center justify-center flex-1 rounded-2xl p-10 gap-2"
                  style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
                  <span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>No classroom selected</span>
                  <p className="text-sm" style={{ color: "var(--tt-tx2)" }}>Pick a classroom from the list to view messages.</p>
                </div>
              ) : (
                <>
                  <div className="shrink-0 flex flex-wrap justify-between items-center gap-3 rounded-2xl p-4"
                    style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative group/av shrink-0">
                        <Avatar name={activeGroup.name} size={44} color={activeGroup.color} avatarUrl={activeGroup.picture}
                          onClick={() => setOpenPanel("members")} />
                        <button onClick={(e) => { e.stopPropagation(); pickGcPicture(activeGroup.id); }}
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover/av:opacity-100 transition-opacity"
                          style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)", border: `1px solid var(--tt-bg1)` }}
                          aria-label="Change picture">
                          <Icon.Edit style={{ width: 10, height: 10 }} />
                        </button>
                      </div>
                      <div className="min-w-0">
                        <span className="text-base font-semibold block truncate" style={{ color: "var(--tt-tx0)" }}>
                          {activeGroup.name}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <Badge color="var(--tt-ac)">Classroom</Badge>
                          <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>
                            {activeGroup.members.length} member{activeGroup.members.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setOpenPanel("members")}
                      className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg"
                      style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>
                      <Icon.Users className="w-4 h-4" />
                      Members
                    </button>
                  </div>

                  <div className="flex flex-col flex-1 min-h-0 rounded-2xl p-4 gap-3"
                    style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
                    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pr-1">
                      {activeGroup.messages.length === 0 && (
                        <p className="text-sm py-8 text-center" style={{ color: "var(--tt-tx2)" }}>
                          No messages yet — start the conversation.
                        </p>
                      )}
                      {activeGroup.messages.map((m) => {
                        const mine = m.senderId === ME;
                        return (
                          <div key={m.id} className={`flex items-start gap-3 ${mine ? "justify-end" : "justify-start"}`}>
                            {!mine && <Avatar name={m.senderName} size={32} />}
                            <div className={`flex flex-col gap-1 min-w-0 max-w-[80%] ${mine ? "items-end" : "items-start"}`}>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold" style={{ color: mine ? "var(--tt-tx2)" : "var(--tt-ac)" }}>
                                  {m.senderName}
                                </span>
                                <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>{m.time}</span>
                              </div>
                              <div className="text-sm whitespace-pre-wrap leading-relaxed py-3 px-4 rounded-2xl"
                                style={mine
                                  ? { backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }
                                  : { backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)`, color: "var(--tt-tx0)" }}>
                                {m.file && (
                                  m.file.type?.startsWith("image/") ? (
                                    <button type="button" onClick={() => setViewerFile(m.file)}
                                      className="block mb-2" aria-label={`View ${m.file.name}`}>
                                      <img src={m.file.url} alt={m.file.name} className="max-w-full max-h-56 object-contain rounded-lg" />
                                    </button>
                                  ) : (
                                    <a href={m.file.url} download={m.file.name}
                                      className="flex items-center gap-2 mb-2 underline underline-offset-2">
                                      <Icon.Paperclip className="w-4 h-4 shrink-0" />
                                      <span className="truncate">{m.file.name}</span>
                                      <span className="opacity-70 text-xs shrink-0">{m.file.size}</span>
                                    </a>
                                  )
                                )}
                                {m.text}
                              </div>
                            </div>
                            {mine && <Avatar name={m.senderName} size={32} />}
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={sendMessage}
                      className="shrink-0 flex items-end gap-2 pt-3"
                      style={{ borderTop: `1px solid var(--tt-bd0)` }}>
                      <input ref={fileInputRef} type="file" multiple className="hidden"
                        onChange={(e) => { attachFiles(e.target.files); e.target.value = ""; }} />
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="shrink-0 p-3 rounded-xl"
                        style={{ color: "var(--tt-tx2)", border: `1px solid var(--tt-bd0)` }}
                        aria-label="Attach files">
                        <Icon.Paperclip className="w-5 h-5" />
                      </button>
                      <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage(e);
                          }
                        }}
                        rows={1}
                        placeholder={`Message ${activeGroup.name}…`}
                        className="flex-1 resize-none text-sm py-3 px-4 outline-none max-h-40 rounded-xl"
                        style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)" }} />
                      <button type="submit" disabled={!messageText.trim()}
                        className="shrink-0 flex items-center gap-2 text-sm font-semibold py-3 px-5 rounded-xl disabled:opacity-40"
                        style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
                        <span className="hidden sm:inline">Send</span>
                        <Icon.Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {openPanel && activeGroup && (
        <GroupDetailModal
          group={activeGroup}
          tab={openPanel}
          onTabChange={setOpenPanel}
          onClose={() => setOpenPanel(null)}
          onAddMember={() => setShowAddMember(true)}
          onPromote={promoteToAdmin}
          onKick={(id, name) => setConfirmKick({ id, name })}
          onChangePicture={() => pickGcPicture(activeGroup.id)}
        />
      )}

      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} onCreate={createGroup} />
      )}

      {showAddMember && activeGroup && (
        <AddMemberModal
          existingMemberIds={activeGroup.members.map((m) => m.id)}
          onClose={() => setShowAddMember(false)}
          onAdd={addMember}
        />
      )}

      {confirmKick && (
        <ConfirmDialog
          title="Remove member"
          message={`Are you sure you want to remove ${confirmKick.name} from "${activeGroup?.name}"? This cannot be undone.`}
          confirmLabel="Remove"
          confirmTone="danger"
          onConfirm={() => performKick(confirmKick.id)}
          onCancel={() => setConfirmKick(null)}
        />
      )}

      {viewerFile && <ImageViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

      {gcPictureTarget?.src && (
        <ImageCropperModal
          src={gcPictureTarget.src}
          aspect={1}
          title="Adjust group picture"
          onSave={saveGcPicture}
          onClose={() => setGcPictureTarget(null)}
        />
      )}
      {showLogoutConfirm && (
        <TeacherLogout onClose={() => setShowLogoutConfirm(false)} />
      )}
    </div>
  );
}
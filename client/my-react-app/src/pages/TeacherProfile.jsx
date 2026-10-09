import React, { useRef, useState } from "react";
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
  Edit: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" {...p}><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Camera: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="13" r="4" /></svg>),
  Mail: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Phone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Clock: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Globe: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" /><path d="M12 3a15.3 15.3 0 0 1 0 18 15.3 15.3 0 0 1 0-18z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Book: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>),
  Users: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" /><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" /></svg>),
  Grid: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>),
  Info: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" strokeLinecap="round" /><circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none" /></svg>),
};

/* ---------------------------------------------------------
   Storage
--------------------------------------------------------- */
const PROFILE_KEY = "teacher_profile_data";

const DEFAULT_PROFILE = {
  name: "Prof. Reyes",
  email: "reyes@univ.edu",
  department: "Department of Computer Science",
  title: "Associate Professor",
  bio: "Teaching data structures, algorithms, and discrete mathematics. Office hours: Tue & Thu 2–4 PM.",
  avatarUrl: null,
  coverUrl: null,
  coverColor: "#3B82F6",
  officeHours: "Tue & Thu, 2:00 PM – 4:00 PM",
  phone: "",
  website: "",
  location: "Manila, Philippines",
  joined: "2019",
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_PROFILE;
}

function saveProfile(data) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(data)); } catch {}
}

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
function initialsOf(name) {
  return String(name || "").split(" ").map((w) => w[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
}

/* ---------------------------------------------------------
   Sample data
--------------------------------------------------------- */
const TEACHING_CLASSES = [
  { id: "cls_cs240",   code: "CS240",   name: "Data Structures & Algorithms", students: 42, section: "Section A" },
  { id: "cls_math210", code: "MATH210", name: "Discrete Mathematics",         students: 36, section: "Section B" },
  { id: "cls_phys101", code: "PHYS101", name: "Intro to Physics",             students: 28, section: "Section C" },
];

const RECENT_POSTS = [
  { id: "p1", time: "2 hours ago", text: "Reminder: Midterm covers chapters 1–6.",        classCode: "CS240" },
  { id: "p2", time: "Yesterday",   text: "Grades for Assignment 2 are posted.",            classCode: "MATH210" },
  { id: "p3", time: "3 days ago",  text: "New lecture slides on graph traversal are up.", classCode: "CS240" },
];

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
            <span className="text-xs truncate" style={{ color: "var(--tt-tx2)" }}>Department of Computer Science</span>
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
          style={{ color: "var(--tt-tx1)", backgroundColor: activePage === "profile" ? "var(--tt-bg3)" : "transparent" }}>
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
   Info row
--------------------------------------------------------- */
function InfoRow({ icon: IconCmp, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2">
      <span style={{ color: "var(--tt-tx2)" }}><IconCmp className="w-4 h-4" /></span>
      <span className="text-sm" style={{ color: "var(--tt-tx1)" }}>
        <span style={{ color: "var(--tt-tx2)" }}>{label} · </span>{value}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------
   Main
--------------------------------------------------------- */
export default function TeacherProfile() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [, , teacherThemeStyle] = useTeacherTheme();

  const [profile, setProfile] = useState(loadProfile);
  const [draft, setDraft] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [tab, setTab] = useState("about");

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  function handleNavClick(key) {
    setMobileNavOpen(false);
    if (key === "profile") return;
    const item = NAV_ITEMS.find((i) => i.key === key);
    if (item) navigate(item.path);
  }

  
function handleSave() {
  setProfile(draft);
  saveProfile(draft);
  setEditing(false);
  setSavedAt(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
  setTimeout(() => setSavedAt(null), 2600);
}

  function handleCancel() {
    setDraft(profile);
    setEditing(false);
  }

  function startEditing() {
    setDraft(profile);
    setEditing(true);
  }

  function pickImage(file, key) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((d) => ({ ...d, [key]: String(reader.result || "") }));
    reader.readAsDataURL(file);
  }

  const field = "w-full text-sm py-3 px-4 outline-none rounded-lg";
  const inputStyle = { backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)" };
  const Label = ({ children }) => (
    <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>{children}</span>
  );

  const display = editing ? draft : profile;

  return (
    <div style={teacherThemeStyle} className="flex h-screen w-full overflow-hidden">
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar activePage="profile" onNavigate={handleNavClick} onCloseMobile={() => {}} onLogout={() => setShowLogoutConfirm(true)} />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar activePage="profile" onNavigate={handleNavClick} onCloseMobile={() => setMobileNavOpen(false)} onLogout={() => { setMobileNavOpen(false); setShowLogoutConfirm(true); }} />
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
              <span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>{display.name}</span>
              <span className="text-xs mt-0.5" style={{ color: "var(--tt-tx2)" }}>{display.department}</span>
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
                  <span className="text-sm block" style={{ color: "var(--tt-tx1)" }}>5 submissions awaiting your review.</span>
                </div>
              )}
            </button>
            <button
              onClick={() => navigate("/teacher/profile")}
              title="My Profile"
              aria-label="My Profile"
              className="w-10 h-10 flex items-center justify-center shrink-0 rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--tt-bd0)", backgroundColor: "var(--tt-bg3)", color: "var(--tt-ac)" }}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold">{initialsOf(profile.name)}</span>
              )}
            </button>
          </div>
        </div>

        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">

            {/* Profile header card */}
            <div className="rounded-2xl overflow-hidden mb-5"
              style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>

              <div className="relative h-40 sm:h-56"
                style={{
                  background: display.coverUrl
                    ? `url(${display.coverUrl}) center/cover no-repeat`
                    : `linear-gradient(135deg, ${display.coverColor || "var(--tt-ac)"} 0%, color-mix(in srgb, ${display.coverColor || "var(--tt-ac)"} 55%, black) 100%)`,
                }}>
                {editing && (
                  <button onClick={() => coverInputRef.current?.click()}
                    className="absolute top-4 right-4 flex items-center gap-2 text-xs font-semibold py-2 px-3 rounded-lg"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.3)" }}>
                    <Icon.Camera className="w-4 h-4" />
                    Edit cover
                  </button>
                )}
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { pickImage(e.target.files?.[0], "coverUrl"); e.target.value = ""; }} />
              </div>

              <div className="px-5 sm:px-8 pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 sm:-mt-16">
                <div className="flex items-end gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4"
                      style={{ borderColor: "var(--tt-bg1)", backgroundColor: "var(--tt-bg3)" }}>
                      {display.avatarUrl ? (
                        <img src={display.avatarUrl} alt={display.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-bold"
                          style={{ color: "var(--tt-ac)" }}>
                          {initialsOf(display.name)}
                        </div>
                      )}
                    </div>
                    {editing && (
                      <button onClick={() => avatarInputRef.current?.click()}
                        className="absolute bottom-1 right-1 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)", border: `3px solid var(--tt-bg1)` }}>
                        <Icon.Camera className="w-4 h-4" />
                      </button>
                    )}
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => { pickImage(e.target.files?.[0], "avatarUrl"); e.target.value = ""; }} />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:pb-2">
                  {!editing ? (
                    <button onClick={startEditing}
                      className="flex items-center gap-2 text-sm font-semibold py-2.5 px-5 rounded-lg"
                      style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
                      <Icon.Edit className="w-4 h-4" />
                      Edit profile
                    </button>
                  ) : (
                    <>
                      <button onClick={handleCancel}
                        className="text-sm font-semibold py-2.5 px-4 rounded-lg"
                        style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>
                        Cancel
                      </button>
                      <button onClick={handleSave}
                        className="flex items-center gap-2 text-sm font-semibold py-2.5 px-5 rounded-lg"
                        style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
                        <Icon.Check className="w-4 h-4" />
                        Save changes
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--tt-tx0)" }}>{display.name}</h1>
                <p className="text-sm mt-1" style={{ color: "var(--tt-tx1)" }}>{display.title}</p>
                <p className="text-sm" style={{ color: "var(--tt-tx2)" }}>{display.department}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm" style={{ color: "var(--tt-tx1)" }}>
                  <span><strong style={{ color: "var(--tt-tx0)" }}>{TEACHING_CLASSES.length}</strong> classes</span>
                  <span><strong style={{ color: "var(--tt-tx0)" }}>{TEACHING_CLASSES.reduce((n, c) => n + c.students, 0)}</strong> students</span>
                  <span>Joined <strong style={{ color: "var(--tt-tx0)" }}>{display.joined}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-1 px-5 sm:px-8 overflow-x-auto" style={{ borderTop: `1px solid var(--tt-bd0)` }}>
                {[
                  { key: "about",   label: "About",   icon: Icon.Info },
                  { key: "posts",   label: "Posts",   icon: Icon.Grid },
                  { key: "classes", label: "Classes", icon: Icon.Book },
                ].map((t) => {
                  const active = tab === t.key;
                  const IconCmp = t.icon;
                  return (
                    <button key={t.key} onClick={() => setTab(t.key)}
                      className="flex items-center gap-2 py-3.5 px-4 text-sm font-semibold whitespace-nowrap transition-colors"
                      style={{
                        color: active ? "var(--tt-ac)" : "var(--tt-tx1)",
                        borderBottom: `2px solid ${active ? "var(--tt-ac)" : "transparent"}`,
                        marginBottom: "-1px",
                      }}>
                      <IconCmp className="w-4 h-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            {tab === "about" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 flex flex-col gap-5">
                  <div className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
                    style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
                    <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>Intro</span>
                    {editing ? (
                      <textarea rows={4} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                        className={field + " resize-none"} style={inputStyle} />
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--tt-tx1)" }}>
                        {profile.bio || "No intro yet."}
                      </p>
                    )}
                    <div className="flex flex-col">
                      <InfoRow icon={Icon.Mail}  label="Email"        value={profile.email} />
                      <InfoRow icon={Icon.Phone} label="Phone"        value={profile.phone} />
                      <InfoRow icon={Icon.Clock} label="Office hours" value={profile.officeHours} />
                      <InfoRow icon={Icon.Globe} label="Website"      value={profile.website} />
                      <InfoRow icon={Icon.Users} label="Location"     value={profile.location} />
                    </div>
                  </div>

                  <div className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
                    style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
                    <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>Recent activity</span>
                    <div className="flex flex-col">
                      {RECENT_POSTS.map((p, idx) => (
                        <div key={p.id} className="flex items-start gap-3 py-3"
                          style={{ borderTop: idx === 0 ? "none" : `1px solid var(--tt-bd0)` }}>
                          <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl"
                            style={{ backgroundColor: "var(--tt-bg3)", color: "var(--tt-ac)" }}>
                            <Icon.Grid className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm block" style={{ color: "var(--tt-tx0)" }}>{p.text}</span>
                            <span className="text-xs block mt-1" style={{ color: "var(--tt-tx2)" }}>{p.classCode} · {p.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
                    style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
                    <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>Details</span>
                    {editing ? (
                      <div className="flex flex-col gap-3">
                        <label className="flex flex-col gap-2"><Label>Full name</Label>
                          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={field} style={inputStyle} /></label>
                        <label className="flex flex-col gap-2"><Label>Email</Label>
                          <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={field} style={inputStyle} /></label>
                        <label className="flex flex-col gap-2"><Label>Title</Label>
                          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={field} style={inputStyle} /></label>
                        <label className="flex flex-col gap-2"><Label>Department</Label>
                          <input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} className={field} style={inputStyle} /></label>
                        <label className="flex flex-col gap-2"><Label>Office hours</Label>
                          <input value={draft.officeHours} onChange={(e) => setDraft({ ...draft, officeHours: e.target.value })} className={field} style={inputStyle} /></label>
                        <label className="flex flex-col gap-2"><Label>Phone</Label>
                          <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className={field} style={inputStyle} placeholder="+1 555 0100" /></label>
                        <label className="flex flex-col gap-2"><Label>Website</Label>
                          <input value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} className={field} style={inputStyle} placeholder="https://…" /></label>
                        <label className="flex flex-col gap-2"><Label>Location</Label>
                          <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className={field} style={inputStyle} /></label>
                        <label className="flex flex-col gap-2"><Label>Cover color</Label>
                          <input type="color" value={draft.coverColor || "#3B82F6"}
                            onChange={(e) => setDraft({ ...draft, coverColor: e.target.value })}
                            className="w-12 h-10 rounded-lg cursor-pointer"
                            style={{ border: `1px solid var(--tt-bd1)`, background: "transparent" }} /></label>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <InfoRow icon={Icon.Mail}  label="Email"    value={profile.email} />
                        <InfoRow icon={Icon.Phone} label="Phone"    value={profile.phone} />
                        <InfoRow icon={Icon.Clock} label="Office"   value={profile.officeHours} />
                        <InfoRow icon={Icon.Globe} label="Website"  value={profile.website} />
                        <InfoRow icon={Icon.Users} label="Location" value={profile.location} />
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl p-5 sm:p-6 flex flex-col gap-3"
                    style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
                    <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>Account</span>
                    <div className="flex flex-col">
                      <InfoRow icon={Icon.User} label="Role"    value="Teacher" />
                      <InfoRow icon={Icon.Info} label="Account" value={`TCH-${initialsOf(profile.name)}-0001`} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "posts" && (
              <div className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
                style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
                <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>All recent activity</span>
                <div className="flex flex-col">
                  {RECENT_POSTS.map((p, idx) => (
                    <div key={p.id} className="flex items-start gap-4 py-4"
                      style={{ borderTop: idx === 0 ? "none" : `1px solid var(--tt-bd0)` }}>
                      <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl"
                        style={{ backgroundColor: "var(--tt-bg3)", color: "var(--tt-ac)" }}>
                        <Icon.Grid className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm block" style={{ color: "var(--tt-tx0)" }}>{p.text}</span>
                        <span className="text-xs block mt-1" style={{ color: "var(--tt-tx2)" }}>{p.classCode} · {p.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "classes" && (
              <div className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
                style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
                <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>Classes I teach</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TEACHING_CLASSES.map((c) => (
                    <button key={c.id} onClick={() => navigate("/teacher/classroom")}
                      className="flex flex-col text-left p-5 rounded-2xl transition-colors"
                      style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold" style={{ color: "var(--tt-ac)" }}>{c.code}</span>
                        <Icon.Book className="w-4 h-4" style={{ color: "var(--tt-tx2)" }} />
                      </div>
                      <span className="text-sm font-semibold truncate" style={{ color: "var(--tt-tx0)" }}>{c.name}</span>
                      <span className="text-xs mt-1" style={{ color: "var(--tt-tx2)" }}>{c.section}</span>
                      <div className="flex items-center gap-2 mt-3">
                        <Icon.Users className="w-3.5 h-3.5" style={{ color: "var(--tt-tx2)" }} />
                        <span className="text-xs" style={{ color: "var(--tt-tx1)" }}>{c.students} students</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {savedAt && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] px-4 py-2.5 rounded-xl"
          style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-ok)`, color: "var(--tt-tx0)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
          <span className="text-sm font-semibold">Profile saved at {savedAt}</span>
        </div>
      )}
      {showLogoutConfirm && (
        <TeacherLogout onClose={() => setShowLogoutConfirm(false)} />
      )}
    </div>
  );
}
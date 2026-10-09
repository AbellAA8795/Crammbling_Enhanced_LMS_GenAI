import React, { useState } from "react";
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
};

/* ---------------------------------------------------------
   Sample data
--------------------------------------------------------- */
const TEACHER = { name: "Prof. Reyes", department: "Department of Computer Science" };

const CLASSES = [
  { id: "cls_cs240",   code: "CS240",   name: "Data Structures & Algorithms" },
  { id: "cls_math210", code: "MATH210", name: "Discrete Mathematics" },
  { id: "cls_phys101", code: "PHYS101", name: "Intro to Physics" },
];

const SAMPLE_QUIZZES = [
  { id: "q1", title: "Dijkstra & Shortest Paths", cls: "CS240",   questions: 12, due: "Mar 23", status: "Published" },
  { id: "q2", title: "Strong Induction Drill",    cls: "MATH210", questions: 10, due: "Mar 27", status: "Draft" },
  { id: "q3", title: "Kinematics Fundamentals",   cls: "PHYS101", questions: 8,  due: "Mar 24", status: "Published" },
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
   Reusable pieces
--------------------------------------------------------- */
function Panel({ title, action, children }) {
  return (
    <div className="flex flex-col gap-5 p-6 rounded-2xl"
      style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
      {(title || action) && (
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>{title}</span>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function Badge({ color = "var(--tt-ac)", children }) {
  return (
    <span className="text-xs font-semibold py-1 px-2.5 rounded-full shrink-0"
      style={{ color, border: `1px solid ${color}`, backgroundColor: "transparent" }}>
      {children}
    </span>
  );
}

/* ---------------------------------------------------------
   Forms
--------------------------------------------------------- */
function CreateQuizForm({ field, inputStyle, Label, onToast }) {
  const [title, setTitle] = useState("");
  const [cls, setCls] = useState(CLASSES[0].code);
  const [questions, setQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("Medium");
  const [topics, setTopics] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onToast(`Quiz "${title}" created for ${cls} (${questions} questions, ${difficulty}).`);
    setTitle(""); setTopics("");
  }

  return (
    <Panel title="New quiz">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <Label>Title</Label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Graph Traversals Drill" className={field} style={inputStyle} />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="flex flex-col gap-2">
            <Label>Class</Label>
            <select value={cls} onChange={(e) => setCls(e.target.value)} className={field} style={inputStyle}>
              {CLASSES.map((c) => (<option key={c.id} value={c.code}>{c.code} — {c.name}</option>))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <Label>Number of questions</Label>
            <input type="number" min="1" max="100" value={questions} onChange={(e) => setQuestions(e.target.value)} className={field} style={inputStyle} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Difficulty</Label>
          <div className="flex gap-3">
            {["Easy", "Medium", "Hard"].map((d) => {
              const active = difficulty === d;
              return (
                <button key={d} type="button" onClick={() => setDifficulty(d)}
                  className="flex-1 text-sm font-semibold py-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: active ? "var(--tt-bg3)" : "var(--tt-bg1)",
                    border: `1px solid ${active ? "var(--tt-ac)" : "var(--tt-bd1)"}`,
                    color: active ? "var(--tt-ac)" : "var(--tt-tx1)",
                  }}>
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <Label>Topics (comma-separated)</Label>
          <input value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="e.g. Dijkstra, BFS, Topological Sort" className={field} style={inputStyle} />
        </label>

        <button type="submit" disabled={!title.trim()}
          className="mt-2 text-sm font-semibold py-3.5 rounded-lg disabled:opacity-40"
          style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
          Create quiz
        </button>
      </form>
    </Panel>
  );
}

function SetDeadlineForm({ field, inputStyle, Label, onToast }) {
  const [cls, setCls] = useState(CLASSES[0].code);
  const [assignment, setAssignment] = useState("");
  const [due, setDue] = useState("");
  const [time, setTime] = useState("23:59");
  const [notify, setNotify] = useState(true);

  function submit(e) {
    e.preventDefault();
    if (!assignment.trim() || !due) return;
    onToast(`Deadline set for "${assignment}" in ${cls}: ${due} ${time}${notify ? " (students notified)" : ""}.`);
    setAssignment(""); setDue("");
  }

  return (
    <Panel title="Set deadline">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="flex flex-col gap-2">
            <Label>Class</Label>
            <select value={cls} onChange={(e) => setCls(e.target.value)} className={field} style={inputStyle}>
              {CLASSES.map((c) => (<option key={c.id} value={c.code}>{c.code} — {c.name}</option>))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <Label>Assignment</Label>
            <input value={assignment} onChange={(e) => setAssignment(e.target.value)} placeholder="e.g. Assignment 5: Graphs" className={field} style={inputStyle} />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="flex flex-col gap-2">
            <Label>Due date</Label>
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={field} style={inputStyle} />
          </label>
          <label className="flex flex-col gap-2">
            <Label>Due time</Label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={field} style={inputStyle} />
          </label>
        </div>

        <button type="button" onClick={() => setNotify((v) => !v)} className="flex items-center gap-3 text-left py-1">
          <div className="w-11 h-6 flex items-center px-0.5 rounded-full transition-colors"
            style={{ backgroundColor: notify ? "var(--tt-ac)" : "var(--tt-bg3)", justifyContent: notify ? "flex-end" : "flex-start" }}>
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#FFFFFF" }} />
          </div>
          <span className="text-sm" style={{ color: "var(--tt-tx1)" }}>Notify students about this deadline</span>
        </button>

        <button type="submit" disabled={!assignment.trim() || !due}
          className="mt-2 text-sm font-semibold py-3.5 rounded-lg disabled:opacity-40"
          style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
          Set deadline
        </button>
      </form>
    </Panel>
  );
}

/* ---------------------------------------------------------
   Main
--------------------------------------------------------- */
export default function TeacherPersonalized() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [, , teacherThemeStyle] = useTeacherTheme();

  const [tab, setTab] = useState("quiz");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toast, setToast] = useState("");

  const inputStyle = { backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)" };
  const field = "w-full text-sm py-3 px-4 outline-none rounded-lg transition-colors";
  const Label = ({ children }) => (
    <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>{children}</span>
  );

  function handleNavClick(key) {
    setMobileNavOpen(false);
    if (key === "profile") return navigate("/teacher/profile");
    if (key === "personalized") return;
    const item = NAV_ITEMS.find((i) => i.key === key);
    if (item) navigate(item.path);
  }

  
  function onToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  return (
    <div style={teacherThemeStyle} className="flex h-screen w-full overflow-hidden">
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar activePage="personalized" onNavigate={handleNavClick} onCloseMobile={() => {}} onLogout={() => setShowLogoutConfirm(true)} />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar activePage="personalized" onNavigate={handleNavClick} onCloseMobile={() => setMobileNavOpen(false)} onLogout={() => { setMobileNavOpen(false); setShowLogoutConfirm(true); }} />
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
                  <span className="text-sm block" style={{ color: "var(--tt-tx1)" }}>5 submissions awaiting your review.</span>
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

        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-10 flex flex-col gap-8">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--tt-tx0)" }}>Personalized</h1>
              <p className="text-sm mt-1.5" style={{ color: "var(--tt-tx2)" }}>
                Create quizzes and manage assignment deadlines for your classes.
              </p>
            </div>

            <div className="flex items-center gap-2" style={{ borderBottom: `1px solid var(--tt-bd0)` }}>
              {[{ id: "quiz", label: "Create quiz" }, { id: "deadline", label: "Set deadline" }].map((t) => {
                const active = tab === t.id;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className="py-3 px-5 text-sm font-semibold rounded-t-lg transition-colors"
                    style={{
                      color: active ? "var(--tt-ac)" : "var(--tt-tx1)",
                      borderBottom: `2px solid ${active ? "var(--tt-ac)" : "transparent"}`,
                      marginBottom: "-1px",
                    }}>
                    {t.label}
                  </button>
                );
              })}
            </div>

            {tab === "quiz"
              ? <CreateQuizForm field={field} inputStyle={inputStyle} Label={Label} onToast={onToast} />
              : <SetDeadlineForm field={field} inputStyle={inputStyle} Label={Label} onToast={onToast} />}

            <Panel title="Your quizzes">
              <div className="flex flex-col -mx-6">
                {SAMPLE_QUIZZES.map((q, idx) => (
                  <div key={q.id} className="flex items-center justify-between gap-3 px-6 py-4"
                    style={{ borderTop: idx === 0 ? "none" : `1px solid var(--tt-bd0)` }}>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold truncate block" style={{ color: "var(--tt-tx0)" }}>{q.title}</span>
                      <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>
                        {q.cls} · {q.questions} questions · Due {q.due}
                      </span>
                    </div>
                    <Badge color={q.status === "Published" ? "var(--tt-ok)" : "var(--tt-warn)"}>{q.status}</Badge>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] px-4 py-2.5 rounded-xl"
          style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)`, color: "var(--tt-tx0)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
      {showLogoutConfirm && (
        <TeacherLogout onClose={() => setShowLogoutConfirm(false)} />
      )}
    </div>
  );
}
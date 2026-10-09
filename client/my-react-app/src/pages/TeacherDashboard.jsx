import React, { useEffect, useMemo, useState } from "react";
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
  Search: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" /></svg>),
  Refresh: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 16H3v5" strokeLinecap="round" strokeLinejoin="round" /></svg>),
};

/* ---------------------------------------------------------
   Sample data
--------------------------------------------------------- */
const TEACHER = { name: "Prof. Reyes", department: "Department of Computer Science" };

const SUMMARY = {
  totalStudents: 128,
  totalClasses: 4,
  totalAssignments: 18,
  totalSubmissions: 287,
  expectedSubmissions: 342,
  pendingGrading: 55,
  averageScore: 82,
};

const CLASSES = [
  { id: "cs240",   code: "CS240",   name: "Data Structures & Algorithms", section: "Section A", students: 42, submitted: 38, expected: 42, pendingGrading: 12, averageScore: 84, nextDeadline: "Mar 23" },
  { id: "math210", code: "MATH210", name: "Discrete Mathematics",         section: "Section B", students: 36, submitted: 33, expected: 36, pendingGrading: 18, averageScore: 79, nextDeadline: "Mar 27" },
  { id: "phys101", code: "PHYS101", name: "Intro to Physics",              section: "Section C", students: 28, submitted: 27, expected: 28, pendingGrading: 9,  averageScore: 86, nextDeadline: "Mar 24" },
  { id: "study",   code: "STUDY",   name: "Peer Study Hall",               section: "Open",      students: 22, submitted: 21, expected: 22, pendingGrading: 16, averageScore: 88, nextDeadline: "Apr 02" },
];

const SUBMISSIONS_TO_GRADE = [
  { id: "s1", student: "Maya K.",   studentId: "s1", assignment: "Assignment 3: Dijkstra Implementation", cls: "CS240",   classId: "cls_cs240",   itemId: "cw1",   submittedAt: "2 hours ago", attachments: 2 },
  { id: "s2", student: "Devon M.",  studentId: "s6", assignment: "Assignment 4: Strong Induction Proofs", cls: "MATH210", classId: "cls_math210", itemId: "cw_m1", submittedAt: "5 hours ago", attachments: 1 },
  { id: "s3", student: "Kai L.",    studentId: "s9", assignment: "Quiz 1: 1D Motion",                     cls: "PHYS101", classId: "cls_phys101", itemId: "cw_p1", submittedAt: "Yesterday",   attachments: 0 },
  { id: "s4", student: "Alex Chen", studentId: "s2", assignment: "Assignment 3: Dijkstra Implementation", cls: "CS240",   classId: "cls_cs240",   itemId: "cw1",   submittedAt: "Yesterday",   attachments: 3 },
  { id: "s5", student: "Riley P.",  studentId: "s7", assignment: "Assignment 4: Strong Induction Proofs", cls: "MATH210", classId: "cls_math210", itemId: "cw_m1", submittedAt: "2 days ago",  attachments: 1 },
];

const UPCOMING_DEADLINES = [
  { id: "d1", title: "Assignment 3: Dijkstra Implementation",  cls: "CS240",   due: "Mon, Mar 23", time: "11:59 PM", submitted: 38, expected: 42 },
  { id: "d2", title: "Quiz 1: 1D Motion",                       cls: "PHYS101", due: "Tue, Mar 24", time: "10:00 AM", submitted: 27, expected: 28 },
  { id: "d3", title: "Assignment 4: Strong Induction Proofs",  cls: "MATH210", due: "Fri, Mar 27", time: "11:59 PM", submitted: 33, expected: 36 },
];

const RECENT_ACTIVITY = [
  { id: "a1", text: "Maya K. submitted Assignment 3",  cls: "CS240",   time: "2h ago" },
  { id: "a2", text: "Grades posted for Assignment 2",  cls: "MATH210", time: "5h ago" },
  { id: "a3", text: "New announcement posted",         cls: "CS240",   time: "Yesterday" },
  { id: "a4", text: "Devon M. joined the class",       cls: "MATH210", time: "Yesterday" },
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
    <div className="flex flex-col gap-5 p-6 rounded-2xl min-w-0"
      style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>{title}</span>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function StatCard({ label, value, sublabel, tone = "var(--tt-tx0)" }) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl"
      style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
      <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>{label}</span>
      <span className="text-4xl font-semibold leading-none tabular-nums tracking-tight" style={{ color: tone }}>{value}</span>
      <span className="text-sm" style={{ color: "var(--tt-tx2)" }}>{sublabel}</span>
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "var(--tt-ac)" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--tt-bg3)" }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium tabular-nums w-10 text-right" style={{ color: "var(--tt-tx2)" }}>{pct}%</span>
    </div>
  );
}

/* Small reusable filter input */
function SearchInput({ value, onChange, placeholder, width = 200 }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--tt-tx2)" }}>
        <Icon.Search className="w-4 h-4" />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-sm py-2 pl-9 pr-3 outline-none rounded-lg"
        style={{
          width,
          backgroundColor: "var(--tt-bg3)",
          border: `1px solid var(--tt-bd1)`,
          color: "var(--tt-tx0)",
        }}
      />
    </div>
  );
}

function SelectFilter({ value, onChange, options, allLabel = "All" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm py-2 pl-3 pr-8 outline-none rounded-lg cursor-pointer"
      style={{
        backgroundColor: "var(--tt-bg3)",
        border: `1px solid var(--tt-bd1)`,
        color: "var(--tt-tx0)",
      }}
    >
      <option value="all">{allLabel}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

/* ---------------------------------------------------------
   Dashboard tab
--------------------------------------------------------- */
function DashboardTab({ onGrade }) {
  const [refreshing, setRefreshing] = useState(false);
  const [, setRefreshTick] = useState(0);

  const [classQuery, setClassQuery] = useState("");
  const [classSort, setClassSort] = useState("name");
  const [submissionQuery, setSubmissionQuery] = useState("");
  const [deadlineClass, setDeadlineClass] = useState("all");
  const [activityClass, setActivityClass] = useState("all");

  const submissionRate = Math.round((SUMMARY.totalSubmissions / SUMMARY.expectedSubmissions) * 100);

  const classOptions = useMemo(() => {
    const set = new Set();
    UPCOMING_DEADLINES.forEach((d) => set.add(d.cls));
    RECENT_ACTIVITY.forEach((a) => set.add(a.cls));
    return Array.from(set).sort();
  }, []);

  const filteredClasses = useMemo(() => {
    const q = classQuery.trim().toLowerCase();
    const list = q
      ? CLASSES.filter((c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.section.toLowerCase().includes(q))
      : CLASSES;
    const sorted = [...list];
    if (classSort === "students") sorted.sort((a, b) => b.students - a.students);
    else if (classSort === "pending") sorted.sort((a, b) => b.pendingGrading - a.pendingGrading);
    else if (classSort === "average") sorted.sort((a, b) => b.averageScore - a.averageScore);
    else sorted.sort((a, b) => a.code.localeCompare(b.code));
    return sorted;
  }, [classQuery, classSort]);

  const filteredSubmissions = useMemo(() => {
    const q = submissionQuery.trim().toLowerCase();
    if (!q) return SUBMISSIONS_TO_GRADE;
    return SUBMISSIONS_TO_GRADE.filter((s) =>
      s.student.toLowerCase().includes(q) ||
      s.cls.toLowerCase().includes(q) ||
      s.assignment.toLowerCase().includes(q));
  }, [submissionQuery]);

  const filteredDeadlines = useMemo(() => {
    if (deadlineClass === "all") return UPCOMING_DEADLINES;
    return UPCOMING_DEADLINES.filter((d) => d.cls === deadlineClass);
  }, [deadlineClass]);

  const filteredActivity = useMemo(() => {
    if (activityClass === "all") return RECENT_ACTIVITY;
    return RECENT_ACTIVITY.filter((a) => a.cls === activityClass);
  }, [activityClass]);

  function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    // Mock fetch — replace with a real API call when wiring the backend.
    setTimeout(() => {
      setRefreshTick((t) => t + 1);
      setRefreshing(false);
    }, 900);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header + refresh */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--tt-tx0)" }}>Overview</h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--tt-tx2)" }}>
            Summary of your classes, students, and pending work this term.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg disabled:opacity-60"
          style={{
            color: "var(--tt-tx1)",
            border: `1px solid var(--tt-bd0)`,
            backgroundColor: "transparent",
            cursor: refreshing ? "wait" : "pointer",
          }}
        >
          <Icon.Refresh className={"w-4 h-4 " + (refreshing ? "animate-spin" : "")} />
          <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Total Students"
          value={SUMMARY.totalStudents}
          sublabel={`Across ${SUMMARY.totalClasses} active classes`}
          tone="var(--tt-ac)"
        />
        <StatCard
          label="Submission Rate"
          value={`${submissionRate}%`}
          sublabel={`${SUMMARY.totalSubmissions} of ${SUMMARY.expectedSubmissions} submissions received`}
          tone="var(--tt-ok)"
        />
        <StatCard
          label="Pending Grading"
          value={SUMMARY.pendingGrading}
          sublabel="Submissions awaiting review"
          tone="var(--tt-warn)"
        />
        <StatCard
          label="Average Score"
          value={`${SUMMARY.averageScore}%`}
          sublabel="Across all graded work this term"
          tone="var(--tt-tx0)"
        />
      </div>

      {/* Class Overview */}
      <Panel
        title="Class Overview"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <SearchInput value={classQuery} onChange={setClassQuery} placeholder="Search classes…" width={200} />
            <select
              value={classSort}
              onChange={(e) => setClassSort(e.target.value)}
              className="text-sm py-2 pl-3 pr-8 outline-none rounded-lg cursor-pointer"
              style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)" }}
            >
              <option value="name">Sort: Class</option>
              <option value="students">Sort: Students</option>
              <option value="pending">Sort: Pending</option>
              <option value="average">Sort: Average</option>
            </select>
          </div>
        }
      >
        <div className="overflow-auto tt-scroll -mx-6" style={{ maxHeight: 380 }}>
          <table className="w-full min-w-[780px] table-fixed">
            <colgroup>
              <col style={{ width: "30%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <thead>
              <tr style={{ borderBottom: `1px solid var(--tt-bd0)` }}>
                <th className="py-3 pl-6 pr-4 text-left text-xs font-semibold uppercase tracking-wider sticky top-0 z-10" style={{ color: "var(--tt-tx2)", backgroundColor: "var(--tt-bg1)" }}>Class</th>
                <th className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider sticky top-0 z-10" style={{ color: "var(--tt-tx2)", backgroundColor: "var(--tt-bg1)" }}>Students</th>
                <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider sticky top-0 z-10" style={{ color: "var(--tt-tx2)", backgroundColor: "var(--tt-bg1)" }}>Submissions</th>
                <th className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider sticky top-0 z-10" style={{ color: "var(--tt-tx2)", backgroundColor: "var(--tt-bg1)" }}>Pending</th>
                <th className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider sticky top-0 z-10" style={{ color: "var(--tt-tx2)", backgroundColor: "var(--tt-bg1)" }}>Average</th>
                <th className="py-3 pl-4 pr-6 text-right text-xs font-semibold uppercase tracking-wider sticky top-0 z-10" style={{ color: "var(--tt-tx2)", backgroundColor: "var(--tt-bg1)" }}>Next Due</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm" style={{ color: "var(--tt-tx2)" }}>
                    No classes match "{classQuery}".
                  </td>
                </tr>
              )}
              {filteredClasses.map((c) => (
                <tr key={c.id} className="transition-colors" style={{ borderBottom: `1px solid var(--tt-bd0)` }}>
                  <td className="py-4 pl-6 pr-4">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>{c.code}</span>
                        <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>· {c.section}</span>
                      </div>
                      <span className="text-sm truncate" style={{ color: "var(--tt-tx1)" }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-medium tabular-nums" style={{ color: "var(--tt-tx0)" }}>{c.students}</td>
                  <td className="py-4 px-4">
                    <ProgressBar value={c.submitted} max={c.expected} />
                    <span className="text-xs mt-1.5 block tabular-nums" style={{ color: "var(--tt-tx2)" }}>
                      {c.submitted} of {c.expected} students
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold tabular-nums"
                      style={{ color: c.pendingGrading > 15 ? "var(--tt-warn)" : "var(--tt-tx1)" }}>
                      {c.pendingGrading}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-medium tabular-nums" style={{ color: "var(--tt-tx0)" }}>{c.averageScore}%</td>
                  <td className="py-4 pl-4 pr-6 text-right text-sm tabular-nums" style={{ color: "var(--tt-tx1)" }}>{c.nextDeadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Submissions */}
        <div className="lg:col-span-2 min-w-0">
          <Panel
            title="Submissions to Grade"
            action={<SearchInput value={submissionQuery} onChange={setSubmissionQuery} placeholder="Search submissions…" width={220} />}
          >
            <div className="flex flex-col -mx-6 overflow-y-auto overflow-x-hidden tt-scroll" style={{ maxHeight: 480 }}>
              {filteredSubmissions.length === 0 ? (
                <p className="text-sm px-6 py-8 text-center" style={{ color: "var(--tt-tx2)" }}>
                  No submissions match "{submissionQuery}".
                </p>
              ) : (
                filteredSubmissions.map((s, idx) => (
                  <div key={s.id} className="flex items-start gap-4 px-6 py-4"
                    style={{ borderTop: idx === 0 ? "none" : `1px solid var(--tt-bd0)` }}>
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center text-sm font-semibold rounded-xl"
                      style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx1)" }}>
                      {s.student.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate" style={{ color: "var(--tt-tx0)" }}>{s.student}</span>
                        <span className="text-xs shrink-0" style={{ color: "var(--tt-tx2)" }}>· {s.cls}</span>
                      </div>
                      <span className="text-sm block truncate mt-0.5" style={{ color: "var(--tt-tx1)" }}>{s.assignment}</span>
                      <span className="text-xs block mt-1" style={{ color: "var(--tt-tx2)" }}>
                        {s.submittedAt} · {s.attachments} file{s.attachments === 1 ? "" : "s"}
                      </span>
                    </div>
                    <button onClick={() => onGrade && onGrade(s)}
                      className="shrink-0 text-sm font-semibold px-3.5 py-2 rounded-lg"
                      style={{ color: "var(--tt-ac)", border: `1px solid var(--tt-ac)`, backgroundColor: "transparent", cursor: "pointer" }}>
                      Grade
                    </button>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 min-w-0">
          <Panel
            title="Upcoming Deadlines"
            action={<SelectFilter value={deadlineClass} onChange={setDeadlineClass} options={classOptions} allLabel="All classes" />}
          >
            <div className="flex flex-col -mx-6 overflow-y-auto overflow-x-hidden tt-scroll" style={{ maxHeight: 280 }}>
              {filteredDeadlines.length === 0 ? (
                <p className="text-sm px-6 py-8 text-center" style={{ color: "var(--tt-tx2)" }}>
                  No deadlines for this class.
                </p>
              ) : (
                filteredDeadlines.map((d, idx) => (
                  <div key={d.id} className="flex flex-col gap-2.5 px-6 py-4"
                    style={{ borderTop: idx === 0 ? "none" : `1px solid var(--tt-bd0)` }}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold truncate" style={{ color: "var(--tt-tx0)" }}>{d.title}</span>
                      <span className="text-sm font-medium shrink-0 tabular-nums" style={{ color: "var(--tt-tx1)" }}>{d.due}</span>
                    </div>
                    <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>{d.cls} · {d.time}</span>
                    <ProgressBar value={d.submitted} max={d.expected} />
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel
            title="Recent Activity"
            action={<SelectFilter value={activityClass} onChange={setActivityClass} options={classOptions} allLabel="All classes" />}
          >
            <div className="flex flex-col -mx-6 overflow-y-auto overflow-x-hidden tt-scroll" style={{ maxHeight: 280 }}>
              {filteredActivity.length === 0 ? (
                <p className="text-sm px-6 py-8 text-center" style={{ color: "var(--tt-tx2)" }}>
                  No activity for this class.
                </p>
              ) : (
                filteredActivity.map((a, idx) => (
                  <div key={a.id} className="flex items-start gap-3 px-6 py-3.5"
                    style={{ borderTop: idx === 0 ? "none" : `1px solid var(--tt-bd0)` }}>
                    <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: "var(--tt-ac)" }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm block" style={{ color: "var(--tt-tx1)" }}>{a.text}</span>
                      <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>{a.cls} · {a.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Main
--------------------------------------------------------- */
export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [, , teacherThemeStyle] = useTeacherTheme();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const today = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    []
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setNotifOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleNavClick(key) {
    setMobileNavOpen(false);
    if (key === "classroom")    return navigate("/teacher/classroom");
    if (key === "chatbot")      return navigate("/teacher/chatbot");
    if (key === "personalized") return navigate("/teacher/personalized");
    if (key === "groupmsg")     return navigate("/teacher/messenger");
    if (key === "profile")      return navigate("/teacher/profile");
    setActiveNav(key);
  }

  
  function handleGradeClick(submission) {
    navigate("/teacher/classroom", {
      state: {
        openClassId: submission.classId,
        tab: "classwork",
        gradeTarget: { studentId: submission.studentId, itemId: submission.itemId },
      },
    });
  }

  return (
    <div style={teacherThemeStyle} className="flex h-screen w-full overflow-hidden">
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar activePage={activeNav} onNavigate={handleNavClick} onCloseMobile={() => {}} onLogout={() => setShowLogoutConfirm(true)} />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar activePage={activeNav} onNavigate={handleNavClick} onCloseMobile={() => setMobileNavOpen(false)} onLogout={() => { setMobileNavOpen(false); setShowLogoutConfirm(true); }} />
          <div className="flex-1 bg-black/50" onClick={() => setMobileNavOpen(false)} />
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
              <span className="text-xs mt-0.5" style={{ color: "var(--tt-tx2)" }}>{today}</span>
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
                    5 submissions awaiting your review.
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

        <main className="flex-1 min-h-0 overflow-y-auto tt-scroll">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-10">
            <DashboardTab onGrade={handleGradeClick} />
          </div>
        </main>
      </div>
      {showLogoutConfirm && (
        <TeacherLogout onClose={() => setShowLogoutConfirm(false)} />
      )}
    </div>
  );
}
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
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
  Logout: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" /><line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" /></svg>),
  Bell: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>),
  Copy: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="9" y="9" width="13" height="13" rx="1" /><path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" /></svg>),
  Back: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Stream: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" /><line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" /><line x1="4" y1="18" x2="14" y2="18" strokeLinecap="round" /></svg>),
  Classwork: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M4 6h11M4 12h11M4 18h7" strokeLinecap="round" /><path d="M20 6l-3 3-3-3" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  People: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeLinecap="round" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" /></svg>),
  Grades: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 3l9 4-9 4-9-4 9-4z" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 11v5c3 3 11 3 14 0v-5" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Comment: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Folder: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" /></svg>),
  Assignment: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="4" width="18" height="18" rx="1" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>),
  Quiz: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.1 1.2-1.1 2.2" strokeLinecap="round" /><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" /></svg>),
  Question: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.1 1.2-1.1 2.2" strokeLinecap="round" /></svg>),
  Material: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>),
  Attach: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M21 12.5 12.5 21a4.95 4.95 0 0 1-7-7L14 5.5a3.5 3.5 0 0 1 5 5L10.5 19a2 2 0 0 1-3-3L15 8.5" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Link: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  File: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Calendar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>),
  Clock: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Users: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" /><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" /></svg>),
  User: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="7" r="4" /></svg>),
  Eye: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" /></svg>),
  Edit: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" {...p}><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Chevron: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Download: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" /><polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" /></svg>),
  Sheet: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>),
  Alert: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" /><circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" /></svg>),
  Trash: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Bold: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Italic: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><line x1="19" y1="4" x2="10" y2="4" strokeLinecap="round" /><line x1="14" y1="20" x2="5" y2="20" strokeLinecap="round" /><line x1="15" y1="4" x2="9" y2="20" strokeLinecap="round" /></svg>),
  Underline: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M6 4v6a6 6 0 0 0 12 0V4" strokeLinecap="round" /><line x1="4" y1="20" x2="20" y2="20" strokeLinecap="round" /></svg>),
  ListBullet: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><line x1="9" y1="6" x2="20" y2="6" strokeLinecap="round" /><line x1="9" y1="12" x2="20" y2="12" strokeLinecap="round" /><line x1="9" y1="18" x2="20" y2="18" strokeLinecap="round" /><circle cx="4.5" cy="6" r="1" fill="currentColor" /><circle cx="4.5" cy="12" r="1" fill="currentColor" /><circle cx="4.5" cy="18" r="1" fill="currentColor" /></svg>),
  GroupMessage: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" /><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" /></svg>),
};

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  const kb = bytes / 1024;
  if (kb < 1) return `${bytes} B`;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function hostnameOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return url; }
}

function isHtmlEmpty(html) {
  if (!html) return true;
  const stripped = String(html)
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
  return stripped.length === 0;
}

function isoFromDue(due) {
  if (!due) return "";
  const d = new Date(due);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function timeFromDue(due) {
  if (!due) return "";
  const d = new Date(due);
  if (isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function displayDueDate(due) {
  if (!due) return "";
  const d = new Date(due);
  if (isNaN(d.getTime())) return due;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function displayDueTime(due) {
  if (!due) return "";
  if (!/T\d{2}:\d{2}/.test(String(due))) return "";
  const d = new Date(due);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function displayDue(due) {
  if (!due) return "";
  const d = new Date(due);
  if (isNaN(d.getTime())) return due;
  const hasTime = typeof due === "string" && /T\d{2}:\d{2}/.test(due);
  const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  if (!hasTime) return dateStr;
  return `${dateStr} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

function studentEmail(s) {
  if (s?.email) return s.email;
  const handle = String(s?.name || "").toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return handle ? `${handle}@univ.edu` : "";
}

function nowTimestamp() {
  return new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime || "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function buildGradesTable(cls) {
  const gradedWork = cls.classwork.filter((c) => c.type !== "material");

  const header = [
    "Student",
    ...gradedWork.map((i) => i.title),
    "Earned / Possible",
    "Overall %",
  ];

  const subHeader = [
    "",
    ...gradedWork.map((i) => (i.points == null ? "(ungraded)" : `/${i.points}`)),
    "",
    "",
  ];

  const rows = cls.students.map((s) => {
    let earned = 0, possible = 0;

    const cells = gradedWork.map((item) => {
      const g = item.grades?.[s.id];
      if (g != null && item.points != null) {
        earned += g;
        possible += item.points;
      }
      return g != null ? String(g) : "";
    });

    const overallPoints = possible > 0 ? `${earned} / ${possible}` : "";
    const overallPct = possible > 0 ? `${Math.round((earned / possible) * 100)}%` : "—";

    return [s.name, ...cells, overallPoints, overallPct];
  });

  const avgRow = ["Class Average"];
  gradedWork.forEach((item) => {
    let sum = 0, count = 0;
    cls.students.forEach((s) => {
      const g = item.grades?.[s.id];
      if (g != null) { sum += g; count += 1; }
    });
    avgRow.push(count ? (sum / count).toFixed(1) : "");
  });

  let totalPct = 0, counted = 0;
  cls.students.forEach((s) => {
    let earned = 0, possible = 0;
    gradedWork.forEach((item) => {
      const g = item.grades?.[s.id];
      if (g != null && item.points != null) {
        earned += g;
        possible += item.points;
      }
    });
    if (possible > 0) {
      totalPct += (earned / possible) * 100;
      counted += 1;
    }
  });

  avgRow.push("");
  avgRow.push(counted > 0 ? `${Math.round(totalPct / counted)}%` : "—");

  return [header, subHeader, ...rows, avgRow];
}

function toCsv(rows) {
  return rows.map((row) => row.map((cell) => {
    const str = String(cell ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  }).join(",")).join("\r\n");
}

function toTsv(rows) {
  return rows.map((row) => row.map((cell) => String(cell ?? "").replace(/\t/g, " ").replace(/\n/g, " ")).join("\t")).join("\n");
}

/* ---------------------------------------------------------
   Data
--------------------------------------------------------- */
const TEACHER = { name: "Prof. Reyes", department: "Department of Computer Science", id: "t1" };
const CLASS_COLORS = ["#1967d2", "#188038", "#d93025", "#e37400", "#9334e6", "#00838f", "#c5221f", "#3949ab"];

function colorForString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return CLASS_COLORS[h % CLASS_COLORS.length];
}
function initialsFor(name) {
  return String(name || "").split(" ").map((w) => w[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
}
function makeClassCode() {
  const a = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

const SAMPLE_SUBMISSIONS = {
  s1: { submittedAt: "Mar 22, 10:14 AM", privateComment: "Hi Prof., I wasn't sure about the edge case on line 42 — the graph with a negative-weight edge. I left a TODO comment there.", text: "Implemented using a min-heap as discussed. All sample tests pass.", files: [{ name: "dijkstra.py", size: 3421, type: "text/x-python" }, { name: "test_output.txt", size: 890, type: "text/plain" }] },
  s2: { submittedAt: "Mar 22, 11:32 AM", privateComment: "Could I get an extension on the writeup? I only finished the code portion.", text: "Used a Fibonacci heap variant for the priority queue.", files: [{ name: "solution.cpp", size: 5120, type: "text/x-c++src" }] },
  s3: { submittedAt: "Mar 23, 09:02 AM", privateComment: "I collaborated with Maya on this — we both worked through the algorithm together.", text: "Wrote up my solution in the attached PDF.", files: [{ name: "writeup.pdf", size: 128000, type: "application/pdf" }, { name: "tests.py", size: 2114, type: "text/x-python" }] },
  s5: { submittedAt: "Mar 21, 08:45 PM", privateComment: "Ran out of time to add tests, but the implementation follows the pseudocode from class exactly.", files: [{ name: "heap_impl.py", size: 2890, type: "text/x-python" }] },
  s6: { submittedAt: "Mar 25, 03:12 PM", text: "Completed all 8 problems.", files: [{ name: "proofs.pdf", size: 96000, type: "application/pdf" }] },
  s8: { submittedAt: "Mar 26, 09:00 AM", privateComment: "Problem 6 was tricky — I'm not confident in my induction step there.", files: [{ name: "solutions.pdf", size: 84000, type: "application/pdf" }] },
  s9: { submittedAt: "Mar 23, 10:00 AM", text: "1D motion quiz answers, with reasoning.", files: [{ name: "answers.pdf", size: 42000, type: "application/pdf" }] },
  s10: { submittedAt: "Mar 23, 10:12 AM", privateComment: "Sorry for the late submission, I was sick yesterday.", files: [{ name: "solutions.txt", size: 1200, type: "text/plain" }] },
};

const INITIAL_CLASSES = [
  {
    id: "cls_cs240", name: "Data Structures & Algorithms", section: "CS240 — Section A",
    subject: "CS240", room: "Room 304", code: "alg0k2", color: "#1967d2", owner: "Prof. Reyes",
    teachers: [{ id: "t1", name: "Prof. Reyes", email: "reyes@univ.edu" }],
    students: [
      { id: "s1", name: "Maya K.", email: "maya.k@univ.edu" },
      { id: "s2", name: "Alex Chen", email: "alex.chen@univ.edu" },
      { id: "s3", name: "Priya N.", email: "priya.n@univ.edu" },
      { id: "s4", name: "Owen T.", email: "owen.t@univ.edu" },
      { id: "s5", name: "Riley P.", email: "riley.p@univ.edu" },
    ],
    classwork: [
      { id: "cw1", type: "assignment", title: "Assignment 3: Dijkstra Implementation", description: "<p>Implement shortest path with a min-heap.</p>", due: "Mar 23", points: 100, posted: "Mar 18", lockAfterDue: true, grades: { s1: 92, s2: null, s3: null, s4: null, s5: 88 }, submissions: { s1: true, s2: true, s3: true, s4: false, s5: true }, attachments: [{ kind: "file", name: "starter-code.zip", size: 24576, type: "application/zip" }], assignedTo: "all" },
      { id: "cw2", type: "quiz", title: "Quiz 2: Balanced Tree Rotations", description: "<p>Covers AVL and Red-Black rotations.</p>", due: "Mar 20", points: 40, posted: "Mar 16", lockAfterDue: false, grades: { s1: 38, s2: 35, s3: null, s4: null, s5: 40 }, submissions: { s1: true, s2: true, s3: false, s4: false, s5: true }, attachments: [], assignedTo: ["s1", "s2", "s5"] },
      { id: "cw3", type: "material", title: "Chapter 5 Slides — Graph Traversals", description: "<p>BFS, DFS, and topological sort reference deck.</p>", posted: "Mar 15", grades: {}, submissions: {}, attachments: [{ kind: "link", title: "BFS & DFS Reference", url: "https://example.com/graph-traversals" }], assignedTo: "all" },
    ],
    stream: [
      { id: "p1", type: "announcement", author: "Prof. Reyes", time: "Mar 19", text: "Reminder: Midterm covers chapters 1–6.", comments: [{ id: "c1", author: "Maya K.", text: "Will graph algorithms be on it?", time: "Mar 19" }], attachments: [] },
      { id: "p2", type: "assignment", author: "Prof. Reyes", time: "Mar 18", text: "Assignment 3 is now live.", classworkId: "cw1", comments: [], attachments: [] },
    ],
    drafts: [],
  },
  {
    id: "cls_math210", name: "Discrete Mathematics", section: "MATH210 — Section B",
    subject: "MATH210", room: "Hall C", code: "dsc7t4", color: "#188038", owner: "Prof. Reyes",
    teachers: [{ id: "t1", name: "Prof. Reyes", email: "reyes@univ.edu" }],
    students: [
      { id: "s6", name: "Devon M.", email: "devon.m@univ.edu" },
      { id: "s7", name: "Riley P.", email: "riley.p@univ.edu" },
      { id: "s8", name: "Sam W.", email: "sam.w@univ.edu" },
    ],
    classwork: [
      { id: "cw_m1", type: "assignment", title: "Assignment 4: Strong Induction Proofs", description: "<p>Problems 1–8 from the handout.</p>", due: "Mar 27", points: 60, posted: "Mar 20", lockAfterDue: false, grades: { s6: null, s7: null, s8: 55 }, submissions: { s6: true, s7: false, s8: true }, attachments: [], assignedTo: "all" },
    ],
    stream: [{ id: "p_m1", type: "announcement", author: "Prof. Reyes", time: "Mar 17", text: "Grades for Assignment 2 are posted.", comments: [], attachments: [] }],
    drafts: [],
  },
  {
    id: "cls_phys101", name: "Intro to Physics", section: "PHYS101 — Section C",
    subject: "PHYS101", room: "Lab 2", code: "phy9x1", color: "#e37400", owner: "Prof. Reyes",
    teachers: [{ id: "t1", name: "Prof. Reyes", email: "reyes@univ.edu" }],
    students: [
      { id: "s9", name: "Kai L.", email: "kai.l@univ.edu" },
      { id: "s10", name: "Jules B.", email: "jules.b@univ.edu" },
    ],
    classwork: [
      { id: "cw_p1", type: "quiz", title: "Quiz 1: 1D Motion", description: "<p>20 minutes, closed book.</p>", due: "Mar 24", points: 25, posted: "Mar 18", lockAfterDue: false, grades: { s9: null, s10: 22 }, submissions: { s9: true, s10: true }, attachments: [], assignedTo: "all" },
    ],
    stream: [],
    drafts: [],
  },
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
    <div className="flex flex-col h-full w-72 shrink-0" style={{ backgroundColor: "var(--tt-bg2)", borderRight: `1px solid var(--tt-bd0)` }}>
      <div className="flex justify-end md:hidden px-3 pt-3">
        <button onClick={onCloseMobile} aria-label="Close menu" style={{ color: "var(--tt-tx1)" }}><Icon.Close className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto tt-scroll">
        <div className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: `1px solid var(--tt-bd0)` }}>
          <div className="w-11 h-11 flex items-center justify-center shrink-0 rounded-xl" style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-ac)" }}>
            <Icon.Classroom className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-semibold tracking-wide truncate" style={{ color: "var(--tt-tx0)" }}>Faculty Portal</span>
            <span className="text-xs truncate" style={{ color: "var(--tt-tx2)" }}>{TEACHER.department}</span>
          </div>
        </div>
        <div className="px-6 pt-6 pb-3"><span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>Navigation</span></div>
        <nav className="flex flex-col px-3 gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === activePage;
            const IconCmp = item.icon;
            return (
              <button key={item.key} onClick={() => onNavigate(item.key)}
                className="flex items-center gap-3 px-3.5 py-3 text-left rounded-xl transition-colors duration-150"
                style={{ backgroundColor: isActive ? "var(--tt-bg3)" : "transparent", color: isActive ? "var(--tt-tx0)" : "var(--tt-tx1)" }}>
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
        <button onClick={onLogout} className="flex items-center gap-3 px-3.5 py-3 text-left rounded-xl transition-colors" style={{ color: "var(--tt-tx1)" }}>
          <Icon.Logout className="w-5 h-5" />
          <span className="text-sm">Sign out</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Avatar / ClassBanner / AttachmentChips / AssignedBadge
--------------------------------------------------------- */
function Avatar({ name, size = 40 }) {
  const color = colorForString(name);
  return (
    <div className="shrink-0 flex items-center justify-center font-semibold rounded-xl overflow-hidden"
      style={{ width: size, height: size, fontSize: Math.max(12, size * 0.4), backgroundColor: color, color: "#FFFFFF" }} title={name}>
      {initialsFor(name)}
    </div>
  );
}

function ClassBanner({ color, name, section, tall = false }) {
  return (
    <div className={`relative w-full overflow-hidden ${tall ? "h-32 sm:h-40" : "h-24"}`}
      style={{ background: `linear-gradient(135deg, ${color} 0%, color-mix(in srgb, ${color} 62%, black) 100%)` }}>
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <span className={`font-semibold truncate ${tall ? "text-2xl sm:text-3xl" : "text-lg"}`}>{name}</span>
        {section && <span className="text-sm opacity-90 truncate mt-0.5">{section}</span>}
      </div>
    </div>
  );
}

function AttachmentChips({ attachments, onRemove }) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((a, i) => (
        <div key={i} className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-lg max-w-[260px]"
          style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)`, color: "var(--tt-tx0)" }}>
          <span className="shrink-0" style={{ color: a.kind === "link" ? "var(--tt-ac)" : "var(--tt-tx2)" }}>
            {a.kind === "link" ? <Icon.Link className="w-4 h-4" /> : <Icon.File className="w-4 h-4" />}
          </span>
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-medium truncate">{a.kind === "link" ? (a.title || hostnameOf(a.url)) : a.name}</span>
            <span className="text-[10px] truncate" style={{ color: "var(--tt-tx2)" }}>{a.kind === "link" ? hostnameOf(a.url) : formatBytes(a.size)}</span>
          </div>
          {onRemove && (
            <button type="button" onClick={() => onRemove(i)} className="shrink-0 rounded p-0.5 hover:opacity-80"
              style={{ color: "var(--tt-tx2)" }} aria-label="Remove attachment">
              <Icon.Close className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function AssignedBadge({ assignedTo, total }) {
  const isAll = assignedTo === "all" || !Array.isArray(assignedTo);
  const count = isAll ? total : (assignedTo || []).length;
  const IconCmp = isAll ? Icon.Users : Icon.User;
  const label = isAll ? "All students" : `${count} student${count === 1 ? "" : "s"}`;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>
      <IconCmp className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

/* ---------------------------------------------------------
   Confirm dialog
--------------------------------------------------------- */
function ConfirmDialog({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", confirmTone = "danger", onConfirm, onCancel }) {
  const tone = confirmTone === "danger" ? "var(--tt-err, #EF4444)" : "var(--tt-ac, #3B82F6)";
  React.useEffect(() => {
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
            <span style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)" }}>{title}</span>
          </div>
        </div>
        {message && (<p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--tt-tx1, #A1A1AA)", margin: 0 }}>{message}</p>)}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button type="button" onClick={onCancel} style={{ fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 8, color: "var(--tt-tx1, #A1A1AA)", backgroundColor: "transparent", border: "none", cursor: "pointer" }}>{cancelLabel}</button>
          <button type="button" onClick={onConfirm} autoFocus style={{ fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 8, backgroundColor: tone, color: "var(--tt-onac, #FFFFFF)", border: "none", cursor: "pointer" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

/* ---------------------------------------------------------
   Link modal
--------------------------------------------------------- */
function LinkModal({ onClose, onInsert }) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const urlRef = useRef(null);

  useEffect(() => { urlRef.current?.focus(); }, []);

  function submit(e) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    const safe = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    onInsert({ kind: "link", url: safe, title: text.trim() || hostnameOf(safe) });
  }

  const modal = (
    <div style={{ position: "fixed", inset: 0, zIndex: 10002, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "var(--tt-overlay, rgba(0,0,0,0.6))" }} />
      <form onSubmit={submit} style={{ position: "relative", width: "100%", maxWidth: 480, backgroundColor: "var(--tt-bg1, #18181B)", color: "var(--tt-tx0, #FAFAFA)", border: "1px solid var(--tt-bd0, #27272A)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16, zIndex: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Add link</span>
          <button type="button" onClick={onClose} style={{ color: "var(--tt-tx1, #A1A1AA)", background: "transparent", border: "none", padding: 4, cursor: "pointer" }}>
            <Icon.Close style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tt-tx2, #71717A)" }}>URL</span>
          <input
            ref={urlRef}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            style={{ width: "100%", fontSize: 14, padding: "12px 16px", outline: "none", borderRadius: 8, backgroundColor: "var(--tt-bg3, #27272A)", border: "1px solid var(--tt-bd1, #3F3F46)", color: "var(--tt-tx0, #FAFAFA)" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tt-tx2, #71717A)" }}>Display text <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span></span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={url ? hostnameOf(url) : "Link"}
            style={{ width: "100%", fontSize: 14, padding: "12px 16px", outline: "none", borderRadius: 8, backgroundColor: "var(--tt-bg3, #27272A)", border: "1px solid var(--tt-bd1, #3F3F46)", color: "var(--tt-tx0, #FAFAFA)" }}
          />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button type="button" onClick={onClose} style={{ fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 8, color: "var(--tt-tx1, #A1A1AA)", backgroundColor: "transparent", border: "none", cursor: "pointer" }}>Cancel</button>
          <button type="submit" disabled={!url.trim()} style={{ fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 8, backgroundColor: "var(--tt-ac, #3B82F6)", color: "var(--tt-onac, #FFFFFF)", border: "none", cursor: url.trim() ? "pointer" : "not-allowed", opacity: url.trim() ? 1 : 0.4 }}>Add</button>
        </div>
      </form>
    </div>
  );
  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

/* ---------------------------------------------------------
   Rich text editor
--------------------------------------------------------- */
function RichTextEditor({ value, onChange, placeholder, colorScheme }) {
  const ref = useRef(null);
  const [active, setActive] = useState({ bold: false, italic: false, underline: false, bullet: false });

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || "")) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const refreshActive = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.commonAncestorContainer)) return;

    let bold = false, italic = false, underline = false, bullet = false;
    try { bold = document.queryCommandState("bold"); } catch {}
    try { italic = document.queryCommandState("italic"); } catch {}
    try { underline = document.queryCommandState("underline"); } catch {}
    try { bullet = document.queryCommandState("insertUnorderedList"); } catch {}
    setActive({ bold, italic, underline, bullet });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", refreshActive);
    return () => document.removeEventListener("selectionchange", refreshActive);
  }, [refreshActive]);

  function exec(cmd) {
    ref.current?.focus();
    document.execCommand(cmd, false, null);
    onChange(ref.current.innerHTML);
    requestAnimationFrame(refreshActive);
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
      const k = e.key.toLowerCase();
      if (k === "b") { e.preventDefault(); exec("bold"); return; }
      if (k === "i") { e.preventDefault(); exec("italic"); return; }
      if (k === "u") { e.preventDefault(); exec("underline"); return; }
    }
  }

  const isEmpty =
    !value || value === "" || value === "<br>" ||
    value === "<div><br></div>" || value === "<p><br></p>";

  const Btn = ({ title, active: isActive, onPress, children }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onPress}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      className={
        "flex items-center justify-center w-[30px] h-[30px] rounded-md " +
        "border transition-all duration-150 " +
        (isActive
          ? "bg-[var(--tt-ac)] border-[var(--tt-ac)] text-[var(--tt-onac)] " +
            "shadow-[0_0_0_2px_color-mix(in_srgb,var(--tt-ac)_25%,transparent)]"
          : "bg-transparent border-transparent text-[var(--tt-tx1)] " +
            "hover:bg-[var(--tt-bg3)] hover:text-[var(--tt-tx0)]")
      }
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg border border-[var(--tt-bd1)] bg-[var(--tt-bg3)] overflow-hidden">
      <div className="flex gap-0.5 p-1.5 border-b border-[var(--tt-bd0)] bg-[var(--tt-bg2)]">
        <Btn title="Bold (Ctrl+B)" active={active.bold} onPress={() => exec("bold")}>
          <Icon.Bold className="w-4 h-4" />
        </Btn>
        <Btn title="Italic (Ctrl+I)" active={active.italic} onPress={() => exec("italic")}>
          <Icon.Italic className="w-4 h-4" />
        </Btn>
        <Btn title="Underline (Ctrl+U)" active={active.underline} onPress={() => exec("underline")}>
          <Icon.Underline className="w-4 h-4" />
        </Btn>

        <div className="w-px mx-1 my-1 bg-[var(--tt-bd0)]" />

        <Btn title="Bullet list" active={active.bullet} onPress={() => exec("insertUnorderedList")}>
          <Icon.ListBullet className="w-4 h-4" />
        </Btn>
      </div>

      <div className="relative">
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            onChange(e.currentTarget.innerHTML);
            refreshActive();
          }}
          onKeyUp={refreshActive}
          onMouseUp={refreshActive}
          onFocus={refreshActive}
          onKeyDown={handleKeyDown}
          className={
            "tt-rte min-h-[96px] px-4 py-3 text-sm leading-relaxed " +
            "text-[var(--tt-tx0)] outline-none " +
            (colorScheme === "dark" ? "[color-scheme:dark]" : "[color-scheme:light]")
          }
        />

        {isEmpty && (
          <span className="absolute top-3 left-4 text-sm text-[var(--tt-tx2)] pointer-events-none">
            {placeholder}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   File preview modal
--------------------------------------------------------- */
function FilePreviewModal({ file, student, onClose }) {
  const isImage = /^image\//.test(file.type || "");
  const isText = /^text\//.test(file.type || "") || /\.(txt|py|js|cpp|c|java|md|json|html|css)$/i.test(file.name);

  const modal = (
    <div style={{ position: "fixed", inset: 0, zIndex: 10003, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "var(--tt-overlay, rgba(0,0,0,0.7))" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 900, maxHeight: "92vh", display: "flex", flexDirection: "column", backgroundColor: "var(--tt-bg1, #18181B)", color: "var(--tt-tx0, #FAFAFA)", border: "1px solid var(--tt-bd0, #27272A)", borderRadius: 16, zIndex: 1, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--tt-bd0, #27272A)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <Icon.File style={{ width: 18, height: 18, color: "var(--tt-ac, #3B82F6)", flexShrink: 0 }} />
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</span>
              <span style={{ fontSize: 11, color: "var(--tt-tx2, #71717A)" }}>{formatBytes(file.size)}{file.type ? ` · ${file.type}` : ""}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button onClick={() => downloadFile(file.name, `Mock file: ${file.name}`, file.type || "application/octet-stream")}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, color: "var(--tt-tx1, #A1A1AA)", border: "1px solid var(--tt-bd0, #27272A)", backgroundColor: "transparent", cursor: "pointer" }}>
              <Icon.Download style={{ width: 14, height: 14 }} />
              Download
            </button>
            <button onClick={onClose} style={{ color: "var(--tt-tx1, #A1A1AA)", background: "transparent", border: "none", padding: 4, cursor: "pointer" }} aria-label="Close">
              <Icon.Close style={{ width: 20, height: 20 }} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: 24, backgroundColor: "var(--tt-bg0, #09090B)" }}>
          <div style={{
            maxWidth: 760, margin: "0 auto", padding: 32, borderRadius: 12,
            backgroundColor: "var(--tt-bg1, #18181B)",
            border: "1px solid var(--tt-bd0, #27272A)",
            minHeight: 400,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
          }}>
            <div style={{
              width: 88, height: 88, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 20, backgroundColor: "var(--tt-bg3, #27272A)", color: "var(--tt-ac, #3B82F6)",
            }}>
              <Icon.File style={{ width: 44, height: 44 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textAlign: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)" }}>{file.name}</span>
              <span style={{ fontSize: 13, color: "var(--tt-tx2, #71717A)" }}>
                {isImage ? "Image" : isText ? "Text document" : "Binary document"} · {formatBytes(file.size)}
              </span>
              <span style={{ fontSize: 12, color: "var(--tt-tx2, #71717A)", marginTop: 4 }}>
                Submitted by {student.name}
              </span>
            </div>
            <div style={{
              marginTop: 8, padding: "10px 16px", borderRadius: 8,
              backgroundColor: "var(--tt-bg2, #1F1F23)",
              border: "1px dashed var(--tt-bd1, #3F3F46)",
              fontSize: 12, color: "var(--tt-tx2, #71717A)",
              maxWidth: 460, textAlign: "center",
            }}>
              In-app preview will appear here when the file content is available.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

/* ---------------------------------------------------------
   Class card / Create class modal / Student picker
--------------------------------------------------------- */
function ClassCard({ cls, onOpen }) {
  return (
    <button onClick={() => onOpen(cls.id)} className="group flex flex-col text-left overflow-hidden rounded-2xl transition-all duration-200 hover:shadow-lg"
      style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
      <ClassBanner color={cls.color} name={cls.name} section={cls.section} />
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold truncate" style={{ color: "var(--tt-tx0)" }}>{cls.name}</p>
          <p className="text-sm truncate mt-1" style={{ color: "var(--tt-tx1)" }}>{cls.section}</p>
          <p className="text-sm truncate mt-1" style={{ color: "var(--tt-tx2)" }}>{cls.owner}</p>
        </div>
        <Icon.Folder className="w-7 h-7 shrink-0 mt-0.5" style={{ color: cls.color }} />
      </div>
    </button>
  );
}

function CreateClassModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [room, setRoom] = useState("");
  const field = "w-full text-sm py-3 px-4 outline-none rounded-lg";
  const inputStyle = { backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)" };
  const Label = ({ children }) => (<span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>{children}</span>);
  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), section: section.trim() || "—", subject: subject.trim() || "GENERAL", room: room.trim() || "" });
  }
  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0" style={{ backgroundColor: "var(--tt-overlay)" }} onClick={onClose} />
      <form onSubmit={submit} className="relative w-full max-w-lg p-6 flex flex-col gap-4 rounded-2xl" style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>Create Class</span>
          <button type="button" onClick={onClose} style={{ color: "var(--tt-tx1)" }}><Icon.Close className="w-5 h-5" /></button>
        </div>
        <label className="flex flex-col gap-2"><Label>Class name (required)</Label><input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Linear Algebra" className={field} style={inputStyle} /></label>
        <label className="flex flex-col gap-2"><Label>Section</Label><input value={section} onChange={(e) => setSection(e.target.value)} placeholder="e.g. Section A" className={field} style={inputStyle} /></label>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-2"><Label>Subject</Label><input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. MATH210" className={field} style={inputStyle} /></label>
          <label className="flex flex-col gap-2"><Label>Room</Label><input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Room 304" className={field} style={inputStyle} /></label>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button type="button" onClick={onClose} className="text-sm font-semibold py-2.5 px-4 rounded-lg" style={{ color: "var(--tt-tx1)" }}>Cancel</button>
          <button type="submit" disabled={!name.trim()} className="text-sm font-semibold py-2.5 px-5 rounded-lg disabled:opacity-40" style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>Create</button>
        </div>
      </form>
    </div>
  );
  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

function StudentPicker({ students, mode, setMode, selectedIds, setSelectedIds }) {
  const allSelected = selectedIds.length === students.length && students.length > 0;
  function toggle(id) { setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]); }
  const tabStyle = (active) => ({ backgroundColor: active ? "var(--tt-bg3)" : "transparent", border: `1px solid ${active ? "var(--tt-ac)" : "var(--tt-bd1)"}`, color: active ? "var(--tt-ac)" : "var(--tt-tx1)" });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>Assign to</span>
        {mode === "select" && students.length > 0 && (
          <button type="button" onClick={() => setSelectedIds(allSelected ? [] : students.map((s) => s.id))} className="text-xs font-semibold" style={{ color: "var(--tt-ac)" }}>
            {allSelected ? "Clear all" : "Select all"}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setMode("all")} className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors" style={tabStyle(mode === "all")}><Icon.Users className="w-4 h-4" />All students</button>
        <button type="button" onClick={() => setMode("select")} className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors" style={tabStyle(mode === "select")}><Icon.User className="w-4 h-4" />Select students</button>
      </div>
      {mode === "select" && (
        <>
          <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>{selectedIds.length} of {students.length} selected</span>
          <div className="rounded-xl max-h-56 overflow-y-auto tt-scroll" style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)` }}>
            {students.length === 0 && (<p className="text-sm px-4 py-4" style={{ color: "var(--tt-tx2)" }}>No students enrolled in this class yet.</p>)}
            {students.map((s, idx) => {
              const checked = selectedIds.includes(s.id);
              return (
                <button type="button" key={s.id} onClick={() => toggle(s.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors" style={{ borderTop: idx === 0 ? "none" : `1px solid var(--tt-bd0)` }}>
                  <span className="shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors" style={{ backgroundColor: checked ? "var(--tt-ac)" : "transparent", border: `1.5px solid ${checked ? "var(--tt-ac)" : "var(--tt-bd1)"}`, color: "var(--tt-onac)" }}>
                    {checked && <Icon.Check className="w-3 h-3" />}
                  </span>
                  <Avatar name={s.name} size={28} />
                  <div className="min-w-0 flex flex-col">
                    <span className="text-sm truncate" style={{ color: "var(--tt-tx0)" }}>{s.name}</span>
                    <span className="text-xs truncate" style={{ color: "var(--tt-tx2)" }}>{studentEmail(s)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Create / Edit post modal
--------------------------------------------------------- */
const POST_TYPES = [
  { id: "announcement", label: "Announcement", icon: Icon.Stream },
  { id: "assignment",   label: "Assignment",   icon: Icon.Assignment },
  { id: "quiz",         label: "Quiz",         icon: Icon.Quiz },
  { id: "question",     label: "Question",     icon: Icon.Question },
  { id: "material",     label: "Material",     icon: Icon.Material },
];

function CreatePostModal({ cls, editing, editingDraftId, onClose, onCreate, onSave, onSaveDraft }) {
  const isEdit = !!editing;
  const isDraft = !!editingDraftId;

  const [type, setType] = useState(editing?.type || "announcement");
  const [text, setText] = useState(editing?.text || "");
  const [title, setTitle] = useState(editing?.title || "");
  const [description, setDescription] = useState(editing?.description || "");
  const [due, setDue] = useState(editing?.due ? isoFromDue(editing.due) : "");
  const [dueTime, setDueTime] = useState(editing?.due ? timeFromDue(editing.due) : "");
  const [lockAfterDue, setLockAfterDue] = useState(!!editing?.lockAfterDue);
  const [pointsMode, setPointsMode] = useState(editing?.points == null ? (editing?.points === null && editing?.title ? "ungraded" : "graded") : "graded");
  const [points, setPoints] = useState(editing?.points != null ? String(editing.points) : "100");
  const [attachments, setAttachments] = useState(editing?.attachments || []);
  const [assignMode, setAssignMode] = useState(Array.isArray(editing?.assignedTo) ? "select" : "all");
  const [selectedIds, setSelectedIds] = useState(Array.isArray(editing?.assignedTo) ? editing.assignedTo : []);
  const [linkOpen, setLinkOpen] = useState(false);

  const fileInputRef = useRef(null);
  const [mode] = useTeacherTheme();
  const colorScheme = mode === "light" ? "light" : "dark";

  const field = "w-full text-sm py-3 px-4 outline-none rounded-lg";
  const inputStyle = { backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)", colorScheme };

  function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    setAttachments((prev) => [...prev, ...files.map((f) => ({ kind: "file", name: f.name, size: f.size, type: f.type }))]);
  }
  function removeAttachment(idx) { setAttachments((prev) => prev.filter((_, i) => i !== idx)); }

  const pointsNum = points === "" ? null : Number(points);
  const pointsInvalid = pointsMode === "graded" && pointsNum != null && (Number.isNaN(pointsNum) || pointsNum < 0 || pointsNum > 100);

  function buildFields() {
    const assignedTo = assignMode === "all" ? "all" : selectedIds;
    let dueCombined = "";
    if (due) dueCombined = dueTime ? `${due}T${dueTime}` : `${due}T23:59`;

    if (type === "announcement") {
      return { type, text, attachments, assignedTo, isAnnouncement: true };
    }
    let parsedPoints = null;
    if (type !== "material" && pointsMode === "graded") {
      parsedPoints = points === "" ? 100 : Math.max(0, Math.min(100, Number(points)));
    }
    // ▼▼▼ ADDED: force clear the due field when type is Material ▼▼▼
    if (type === "material") dueCombined = "";
    // ▲▲▲ END OF ADDED LINE ▲▲▲
    return {
      type,
      text: (description || "").replace(/<[^>]+>/g, "").trim(),
      title: title.trim(),
      description,
      due: dueCombined,
      points: parsedPoints,
      lockAfterDue: !!dueCombined && lockAfterDue,
      attachments,
      assignedTo,
      isAnnouncement: false,
    };
  }

  function isValidFor(action) {
    if (type === "announcement") {
      const hasBody = !isHtmlEmpty(text) || attachments.length > 0;
      const hasAssignee = assignMode === "all" || selectedIds.length > 0;
      return hasBody && hasAssignee;
    }
    if (!title.trim()) return false;
    if (assignMode !== "all" && selectedIds.length === 0) return false;
    if (action === "post" && pointsInvalid) return false;
    return true;
  }

  function handlePost(e) {
    e?.preventDefault?.();
    if (!isValidFor("post")) return;
    const fields = buildFields();
    if (isEdit && !isDraft) onSave(fields);
    else onCreate(fields);
  }

  function handleSaveDraft(e) {
    e?.preventDefault?.();
    if (!isValidFor("draft")) return;
    const fields = buildFields();
    onSaveDraft(fields, editingDraftId || null);
  }

  const canPost = isValidFor("post");
  const canDraft = isValidFor("draft");
  const showDraftButton = !isEdit || isDraft;

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-4">
      <div className="absolute inset-0" style={{ backgroundColor: "var(--tt-overlay)" }} onClick={onClose} />
      <form onSubmit={handlePost} className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto tt-scroll rounded-2xl" style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
        <div className="flex justify-between items-center px-6 py-5 sticky top-0 z-10" style={{ backgroundColor: "var(--tt-bg1)", borderBottom: `1px solid var(--tt-bd0)` }}>
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>{isEdit ? `Edit post in ${cls.name}` : `Post to ${cls.name}`}</span>
            {isDraft && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--tt-warn)", border: `1px solid var(--tt-warn)` }}>DRAFT</span>
            )}
          </div>
          <button type="button" onClick={onClose} style={{ color: "var(--tt-tx1)" }}><Icon.Close className="w-5 h-5" /></button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <div className={`grid grid-cols-2 sm:grid-cols-5 gap-3 ${isEdit ? "opacity-60" : ""}`}>
            {POST_TYPES.map((t) => {
              const active = type === t.id;
              const IconCmp = t.icon;
              return (
                <button key={t.id} type="button" onClick={() => { if (!isEdit) setType(t.id); }} disabled={isEdit}
                  className="flex flex-col items-center gap-2 py-4 text-sm font-semibold transition-all rounded-xl disabled:cursor-not-allowed"
                  style={{ backgroundColor: active ? "var(--tt-bg3)" : "var(--tt-bg1)", border: `1px solid ${active ? "var(--tt-ac)" : "var(--tt-bd1)"}`, color: active ? "var(--tt-ac)" : "var(--tt-tx1)" }}>
                  <IconCmp className="w-5 h-5" />{t.label}
                </button>
              );
            })}
          </div>

          {type === "announcement" ? (
            <RichTextEditor value={text} onChange={setText} placeholder="Announce something to your class…" colorScheme={colorScheme} />
          ) : (
            <>
              <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className={field} style={inputStyle} />

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>
                  Instructions <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span>
                </span>
                <RichTextEditor value={description} onChange={setDescription} placeholder="Provide instructions…" colorScheme={colorScheme} />
              </div>

              {/* ▼▼▼ CHANGED: wrapped in {type !== "material" && (<> ... </>)}
                   so the date/time/lock controls are hidden when Material is selected ▼▼▼ */}
              {type !== "material" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>Due date</span>
                      <div className="relative">
                        <input type="date" value={due} onChange={(e) => { setDue(e.target.value); if (!e.target.value) setDueTime(""); }}
                          className={field + " pr-11"} style={{ ...inputStyle, color: due ? "var(--tt-tx0)" : "transparent" }} />
                        {!due && (<span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--tt-tx2)", pointerEvents: "none", fontSize: 14 }}>No due date</span>)}
                        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--tt-tx2)" }}>
                          <Icon.Calendar className="w-4 h-4" />
                        </span>
                      </div>
                    </label>

                    {due && (
                      <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>
                          Due time <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span>
                        </span>
                        <div className="relative">
                          <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className={field + " pr-11"} style={inputStyle} />
                          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--tt-tx2)" }}>
                            <Icon.Clock className="w-4 h-4" />
                          </span>
                        </div>
                      </label>
                    )}
                  </div>

                  {due && (
                    <button type="button" onClick={() => setLockAfterDue((v) => !v)} className="flex items-center gap-3 text-left py-1">
                      <span className="shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors" style={{ backgroundColor: lockAfterDue ? "var(--tt-ac)" : "transparent", border: `1.5px solid ${lockAfterDue ? "var(--tt-ac)" : "var(--tt-bd1)"}`, color: "var(--tt-onac)" }}>
                        {lockAfterDue && <Icon.Check className="w-3 h-3" />}
                      </span>
                      <span className="text-sm" style={{ color: "var(--tt-tx1)" }}>Lock submissions after the due date</span>
                    </button>
                  )}
                </>
              )}
              {/* ▲▲▲ END OF CHANGE ▲▲▲ */}

              {type !== "material" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>Points</span>
                    <select value={pointsMode} onChange={(e) => setPointsMode(e.target.value)} className={field} style={inputStyle}>
                      <option value="graded">Graded (100 points)</option>
                      <option value="ungraded">Ungraded</option>
                    </select>
                  </label>
                  {pointsMode === "graded" && (
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>Max score</span>
                      <input type="number" min="0" max="100" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="100"
                        className={field + " tt-no-spin"}
                        style={{ ...inputStyle, border: pointsInvalid ? "1px solid var(--tt-err, #EF4444)" : inputStyle.border }} />
                      {pointsInvalid && (<span style={{ fontSize: 11, color: "var(--tt-err, #EF4444)", fontWeight: 500 }}>Max score must be between 0 and 100.</span>)}
                    </label>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex flex-col gap-3 pt-1">
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--tt-tx2)" }}>Attachments</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors" style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>
                <Icon.Attach className="w-4 h-4" />Attach file
              </button>
              <button type="button" onClick={() => setLinkOpen(true)} className="flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors" style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>
                <Icon.Link className="w-4 h-4" />Add link
              </button>
            </div>
            <AttachmentChips attachments={attachments} onRemove={removeAttachment} />
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
          </div>

          <StudentPicker students={cls.students} mode={assignMode} setMode={setAssignMode} selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
        </div>

        <div className="flex justify-end gap-2 px-6 py-5 sticky bottom-0" style={{ backgroundColor: "var(--tt-bg1)", borderTop: `1px solid var(--tt-bd0)` }}>
          <button type="button" onClick={onClose} className="text-sm font-semibold py-2.5 px-4 rounded-lg" style={{ color: "var(--tt-tx1)" }}>Cancel</button>
          {showDraftButton && (
            <button type="button" onClick={handleSaveDraft} disabled={!canDraft}
              className="text-sm font-semibold py-2.5 px-5 rounded-lg disabled:opacity-40"
              style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)`, backgroundColor: "transparent" }}>
              Save as draft
            </button>
          )}
          <button type="submit" disabled={!canPost} className="text-sm font-semibold py-2.5 px-5 rounded-lg disabled:opacity-40" style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
            {isEdit && !isDraft ? "Save changes" : "Post"}
          </button>
        </div>
      </form>

      {linkOpen && (
        <LinkModal onClose={() => setLinkOpen(false)} onInsert={(link) => { setAttachments((prev) => [...prev, link]); setLinkOpen(false); }} />
      )}
    </div>
  );

  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

/* ---------------------------------------------------------
   Classwork detail modal
--------------------------------------------------------- */
function ClassworkDetailModal({ cls, item, onClose, onEdit, onDelete, onGrade }) {
  const initialsOf = (name) => String(name || "").split(" ").map((w) => w[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
  const AVATAR_COLORS = ["#1967d2", "#188038", "#d93025", "#e37400", "#9334e6", "#00838f", "#c5221f", "#3949ab"];
  const colorFor = (s) => { let h = 0; for (let i = 0; i < (s || "").length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return AVATAR_COLORS[h % AVATAR_COLORS.length]; };
  const Avatar = ({ name, size = 40 }) => (
    <div style={{ width: size, height: size, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.max(11, size * 0.4), fontWeight: 600, borderRadius: 10, backgroundColor: colorFor(name), color: "#FFFFFF", overflow: "hidden" }} title={name}>
      {initialsOf(name)}
    </div>
  );
  const formatBytesLocal = (bytes) => { if (!bytes && bytes !== 0) return ""; const kb = bytes / 1024; if (kb < 1) return `${bytes} B`; if (kb < 1024) return `${kb.toFixed(0)} KB`; return `${(kb / 1024).toFixed(1)} MB`; };
  const hostOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; } };

  const Ico = {
    Close: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>),
    Trash: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>),
    Edit: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
    Calendar: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>),
    Quiz: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.1 1.2-1.1 2.2" strokeLinecap="round" /><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" /></svg>),
    Question: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.1 1.2-1.1 2.2" strokeLinecap="round" /></svg>),
    Material: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>),
    Assignment: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="4" width="18" height="18" rx="1" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>),
    Users: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" /><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" /></svg>),
    User: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="7" r="4" /></svg>),
    File: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
    Link: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  };

  const total = cls.students.length;
  const submissionsMap = item.submissions || {};
  const gradesMap = item.grades || {};
  const submittedCount = Object.values(submissionsMap).filter(Boolean).length;
  const gradedCount = Object.values(gradesMap).filter((g) => g != null).length;
  const isMaterial = item.type === "material";

  const assigned = item.assignedTo === "all" || !Array.isArray(item.assignedTo)
    ? cls.students : cls.students.filter((s) => (item.assignedTo || []).includes(s.id));

  const typeLabel = { assignment: "Assignment", quiz: "Quiz", question: "Question", material: "Material" }[item.type] || item.type;
  const TypeIcon = item.type === "quiz" ? Ico.Quiz : item.type === "material" ? Ico.Material : item.type === "question" ? Ico.Question : Ico.Assignment;
  const attachments = item.attachments || [];

  const modal = (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "var(--tt-overlay, rgba(0,0,0,0.6))" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 800, height: "90vh", display: "flex", flexDirection: "column", backgroundColor: "var(--tt-bg1, #18181B)", color: "var(--tt-tx0, #FAFAFA)", border: "1px solid var(--tt-bd0, #27272A)", borderRadius: 16, zIndex: 1, overflow: "hidden" }}>

        {/* ───── FIXED HEADER ───── */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--tt-bd0, #27272A)" }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)" }}>Classwork</span>
          <button onClick={onClose} style={{ color: "var(--tt-tx1, #A1A1AA)", background: "transparent", border: "none", padding: 4, cursor: "pointer" }} aria-label="Close"><Ico.Close style={{ width: 20, height: 20 }} /></button>
        </div>

        {/* ───── FIXED MIDDLE (title, description, chips, attachments) ─────
             flexShrink: 0 means it never scrolls and never shrinks.
             If it gets too tall for the viewport, give the "attachments" wrapper
             a maxHeight + overflow so it can scroll on its own. ───── */}
        <div className="tt-scroll" style={{ flexShrink: 0, maxHeight: "40vh", overflowY: "auto", padding: 24, paddingBottom: 16, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "var(--tt-bg3, #27272A)", color: "var(--tt-ac, #3B82F6)", flexShrink: 0 }}>
              <TypeIcon style={{ width: 20, height: 20 }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--tt-tx2, #71717A)", display: "block" }}>{typeLabel}</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)", display: "block", marginTop: 2 }}>{item.title}</span>
              <span style={{ fontSize: 12, color: "var(--tt-tx2, #71717A)", display: "block", marginTop: 2 }}>Posted {item.posted}{item.due ? ` · Due ${displayDue(item.due)}` : " · No due date"}</span>
            </div>
          </div>

          {item.description && (
            <div className="tt-rte-post"
              style={{ fontSize: 14, lineHeight: 1.6, borderRadius: 12, padding: 16, backgroundColor: "var(--tt-bg2, #1F1F23)", border: "1px solid var(--tt-bd0, #27272A)", color: "var(--tt-tx1, #A1A1AA)" }}
              dangerouslySetInnerHTML={{ __html: item.description }} />
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {item.due && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, color: "var(--tt-tx1, #A1A1AA)", border: "1px solid var(--tt-bd0, #27272A)" }}>
                <Ico.Calendar style={{ width: 14, height: 14 }} />Due {displayDue(item.due)}
              </span>
            )}
            {item.points != null && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, color: "var(--tt-tx1, #A1A1AA)", border: "1px solid var(--tt-bd0, #27272A)" }}>{item.points} pts</span>
            )}
            {item.points == null && item.type !== "material" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, color: "var(--tt-tx2, #71717A)", border: "1px solid var(--tt-bd0, #27272A)" }}>Ungraded</span>
            )}
            {item.lockAfterDue && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, color: "var(--tt-warn, #F59E0B)", border: "1px solid var(--tt-warn, #F59E0B)" }}>Locks after due</span>
            )}
            {(() => {
              const isAll = item.assignedTo === "all" || !Array.isArray(item.assignedTo);
              const count = isAll ? total : (item.assignedTo || []).length;
              const BadgeIcon = isAll ? Ico.Users : Ico.User;
              const label = isAll ? "All students" : `${count} student${count === 1 ? "" : "s"}`;
              return (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, color: "var(--tt-tx1, #A1A1AA)", border: "1px solid var(--tt-bd0, #27272A)" }}>
                  <BadgeIcon style={{ width: 14, height: 14 }} />{label}
                </span>
              );
            })()}
          </div>

          {attachments.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tt-tx2, #71717A)" }}>Attachments</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {attachments.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, maxWidth: 260, backgroundColor: "var(--tt-bg2, #1F1F23)", border: "1px solid var(--tt-bd0, #27272A)", color: "var(--tt-tx0, #FAFAFA)" }}>
                    <span style={{ flexShrink: 0, color: a.kind === "link" ? "var(--tt-ac, #3B82F6)" : "var(--tt-tx2, #71717A)" }}>
                      {a.kind === "link" ? <Ico.Link style={{ width: 16, height: 16 }} /> : <Ico.File style={{ width: 16, height: 16 }} />}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 12, fontWeight: 500, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.kind === "link" ? (a.title || hostOf(a.url)) : a.name}</span>
                      <span style={{ fontSize: 10, color: "var(--tt-tx2, #71717A)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.kind === "link" ? hostOf(a.url) : formatBytesLocal(a.size)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ───── FIXED SUBMISSIONS HEADER + SCROLLABLE LIST ───── */}
        {!isMaterial && (
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", borderTop: "1px solid var(--tt-bd0, #27272A)", padding: "16px 24px 0" }}>
            {/* This header row is fixed, doesn't scroll */}
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)" }}>Submissions</span>
              <span style={{ fontSize: 12, color: "var(--tt-tx2, #71717A)" }}>{submittedCount}/{total} submitted · {gradedCount}/{total} graded</span>
            </div>

            {/* ONLY this list scrolls */}
            <div className="tt-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", borderRadius: 12, border: "1px solid var(--tt-bd0, #27272A)", marginBottom: 16 }}>
              {assigned.length === 0 && <p style={{ fontSize: 14, color: "var(--tt-tx2, #71717A)", padding: "16px", margin: 0 }}>No students assigned.</p>}
              {assigned.map((s, idx) => {
                const submitted = !!submissionsMap[s.id];
                const g = gradesMap[s.id];
                const sub = SAMPLE_SUBMISSIONS[s.id];
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", backgroundColor: idx % 2 === 0 ? "var(--tt-bg1, #18181B)" : "var(--tt-bg2, #1F1F23)", borderTop: idx === 0 ? "none" : "1px solid var(--tt-bd0, #27272A)" }}>
                    <Avatar name={s.name} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)", display: "block" }}>{s.name}</span>
                      <span style={{ fontSize: 11, color: "var(--tt-tx2, #71717A)", display: "block", marginTop: 1 }}>{studentEmail(s)}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: submitted ? "var(--tt-ok, #22C55E)" : "var(--tt-tx2, #71717A)" }}>{submitted ? "Submitted" : "Not submitted"}</span>
                        {submitted && sub?.privateComment && (
                          <span title="Student left a private comment" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 999, color: "var(--tt-ac, #3B82F6)", border: "1px solid color-mix(in srgb, var(--tt-ac, #3B82F6) 40%, transparent)", backgroundColor: "color-mix(in srgb, var(--tt-ac, #3B82F6) 10%, transparent)" }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 11, height: 11 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Comment
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      {item.points == null ? (
                        <span style={{ fontSize: 11, color: "var(--tt-tx2, #71717A)" }}>Ungraded</span>
                      ) : g != null ? (
                        <>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)", display: "block" }}>{g} / {item.points}</span>
                          <span style={{ fontSize: 10, color: "var(--tt-tx2, #71717A)" }}>Graded</span>
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: "var(--tt-tx2, #71717A)" }}>—</span>
                      )}
                    </div>
                    <button onClick={() => onGrade(s)} style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, color: "var(--tt-ac, #3B82F6)", border: "1px solid var(--tt-ac, #3B82F6)", backgroundColor: "transparent", cursor: "pointer" }}>
                      {g != null ? "Edit grade" : "Grade"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───── FIXED FOOTER ───── */}
        <div style={{ flexShrink: 0, display: "flex", justifyContent: "space-between", gap: 8, padding: "20px 24px", borderTop: "1px solid var(--tt-bd0, #27272A)" }}>
          <button onClick={onDelete} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 8, color: "var(--tt-err, #EF4444)", border: "1px solid var(--tt-err, #EF4444)", backgroundColor: "transparent", cursor: "pointer" }}>
            <Ico.Trash style={{ width: 16, height: 16 }} />Delete
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 8, color: "var(--tt-tx1, #A1A1AA)", backgroundColor: "transparent", border: "none", cursor: "pointer" }}>Close</button>
            <button onClick={onEdit} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 8, backgroundColor: "var(--tt-ac, #3B82F6)", color: "var(--tt-onac, #FFFFFF)", border: "none", cursor: "pointer" }}>
              <Ico.Edit style={{ width: 16, height: 16 }} />Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

/* ---------------------------------------------------------
   Grade modal
--------------------------------------------------------- */
function GradeModal({ item, student, submissionMeta, onClose, onSave }) {
  const [grade, setGrade] = useState(item.grades?.[student.id] ?? "");
  const [comment, setComment] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  const submitted = !!item.submissions?.[student.id];
  const work = submissionMeta;
  const maxPoints = item.points;

  const trimmedGrade = String(grade).trim();
  const gradeNum = trimmedGrade === "" ? null : Number(trimmedGrade);
  const gradeIsNaN = gradeNum != null && Number.isNaN(gradeNum);
  const tooHigh = maxPoints != null && gradeNum != null && !gradeIsNaN && gradeNum > maxPoints;
  const tooLow = gradeNum != null && !gradeIsNaN && gradeNum < 0;
  const hasError = gradeIsNaN || tooHigh || tooLow;
  const canSubmit = gradeNum != null && !gradeIsNaN && !hasError;

  const initialsOf = (name) => String(name || "").split(" ").map((w) => w[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
  const AVATAR_COLORS = ["#1967d2", "#188038", "#d93025", "#e37400", "#9334e6", "#00838f", "#c5221f", "#3949ab"];
  const colorFor = (s) => { let h = 0; for (let i = 0; i < (s || "").length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return AVATAR_COLORS[h % AVATAR_COLORS.length]; };
  const Avatar = ({ name, size = 40 }) => (
    <div style={{ width: size, height: size, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.max(11, size * 0.4), fontWeight: 600, borderRadius: 10, backgroundColor: colorFor(name), color: "#FFFFFF", overflow: "hidden" }} title={name}>
      {initialsOf(name)}
    </div>
  );
  const formatBytesLocal = (bytes) => { if (!bytes && bytes !== 0) return ""; const kb = bytes / 1024; if (kb < 1) return `${bytes} B`; if (kb < 1024) return `${kb.toFixed(0)} KB`; return `${(kb / 1024).toFixed(1)} MB`; };

  const Ico = {
    Close: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>),
    File: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
    Warn: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" /><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" /></svg>),
    Eye: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" /></svg>),
  };

  function submit(e) { e.preventDefault(); if (!canSubmit) return; onSave(student.id, gradeNum, comment.trim()); }

  const inputStyle = { width: "100%", fontSize: 14, padding: "12px 16px", outline: "none", borderRadius: 8, backgroundColor: "var(--tt-bg3, #27272A)", border: "1px solid var(--tt-bd1, #3F3F46)", color: "var(--tt-tx0, #FAFAFA)" };
  const scoreInputStyle = { ...inputStyle, border: hasError ? "1px solid var(--tt-err, #EF4444)" : "1px solid var(--tt-bd1, #3F3F46)", boxShadow: hasError ? "0 0 0 3px color-mix(in srgb, var(--tt-err, #EF4444) 18%, transparent)" : "none" };

  const modal = (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", overflowY: "auto" }}>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "var(--tt-overlay, rgba(0,0,0,0.6))" }} />
       <form onSubmit={submit} className="tt-scroll" style={{ position: "relative", width: "100%", maxWidth: 640, backgroundColor: "var(--tt-bg1, #18181B)", color: "var(--tt-tx0, #FAFAFA)", border: "1px solid var(--tt-bd0, #27272A)", borderRadius: 16, zIndex: 1, flexShrink: 0 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--tt-bd0, #27272A)" }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)" }}>Grade Submission</span>
          <button type="button" onClick={onClose} style={{ color: "var(--tt-tx1, #A1A1AA)", background: "transparent", border: "none", padding: 4, cursor: "pointer" }}><Ico.Close style={{ width: 20, height: 20 }} /></button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 12, backgroundColor: "var(--tt-bg2, #1F1F23)", border: "1px solid var(--tt-bd0, #27272A)" }}>
            <Avatar name={student.name} size={44} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)", display: "block" }}>{student.name}</span>
              <span style={{ fontSize: 12, color: "var(--tt-tx2, #71717A)", display: "block", marginTop: 1 }}>{studentEmail(student)}</span>
              <span style={{ fontSize: 14, color: "var(--tt-tx2, #71717A)", display: "block", marginTop: 2 }}>{item.title}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999, flexShrink: 0, color: submitted ? "var(--tt-ok, #22C55E)" : "var(--tt-tx2, #71717A)", border: `1px solid ${submitted ? "var(--tt-ok, #22C55E)" : "var(--tt-bd0, #27272A)"}` }}>
              {submitted ? "Submitted" : "Not submitted"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tt-tx2, #71717A)" }}>Student's work</span>

            {!submitted && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 12, fontSize: 13, backgroundColor: "color-mix(in srgb, var(--tt-warn, #F59E0B) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--tt-warn, #F59E0B) 40%, transparent)", color: "var(--tt-tx1, #A1A1AA)" }}>
                <Ico.Warn style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1, color: "var(--tt-warn, #F59E0B)" }} />
                <span>This student hasn't submitted anything yet. You can still enter a grade if you need to.</span>
              </div>
            )}

            {submitted && !work && (
              <div style={{ padding: 16, borderRadius: 12, fontSize: 14, backgroundColor: "var(--tt-bg2, #1F1F23)", border: "1px dashed var(--tt-bd1, #3F3F46)", color: "var(--tt-tx2, #71717A)" }}>
                A submission was received, but no preview is available.
              </div>
            )}

            {submitted && work && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, borderRadius: 12, backgroundColor: "var(--tt-bg2, #1F1F23)", border: "1px solid var(--tt-bd0, #27272A)" }}>
                {work.submittedAt && (<span style={{ fontSize: 12, color: "var(--tt-tx2, #71717A)" }}>Submitted {work.submittedAt}</span>)}

                {work.privateComment && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: 10, backgroundColor: "color-mix(in srgb, var(--tt-ac, #3B82F6) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--tt-ac, #3B82F6) 35%, transparent)" }}>
                    <span style={{ flexShrink: 0, marginTop: 1, color: "var(--tt-ac, #3B82F6)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tt-ac, #3B82F6)", display: "block" }}>Student's private comment</span>
                      <p style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "var(--tt-tx0, #FAFAFA)", margin: "4px 0 0 0" }}>{work.privateComment}</p>
                    </div>
                  </div>
                )}

                {work.text && (<p style={{ fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.6, color: "var(--tt-tx1, #A1A1AA)", margin: 0 }}>{work.text}</p>)}

                {work.files && work.files.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {work.files.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, backgroundColor: "var(--tt-bg1, #18181B)", border: "1px solid var(--tt-bd0, #27272A)" }}>
                        <Ico.File style={{ width: 18, height: 18, color: "var(--tt-ac, #3B82F6)", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--tt-tx0, #FAFAFA)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
                          <span style={{ fontSize: 10, color: "var(--tt-tx2, #71717A)", display: "block" }}>{formatBytesLocal(f.size)}</span>
                        </div>
                        <button type="button" onClick={() => setPreviewFile(f)} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 6, color: "var(--tt-ac, #3B82F6)", border: "1px solid var(--tt-ac, #3B82F6)", backgroundColor: "transparent", cursor: "pointer" }}>
                          <Ico.Eye style={{ width: 13, height: 13 }} />
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tt-tx2, #71717A)" }}>
              {maxPoints != null ? `Score (out of ${maxPoints})` : "Score (ungraded item)"}
            </span>
            <input type="number" min="0" max={maxPoints ?? undefined} value={grade} onChange={(e) => setGrade(e.target.value)} autoFocus className="tt-no-spin" style={scoreInputStyle} />
            {tooHigh && (<span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--tt-err, #EF4444)" }}><Ico.Warn style={{ width: 14, height: 14, flexShrink: 0 }} />Score can't go above {maxPoints} (max points).</span>)}
            {tooLow && (<span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--tt-err, #EF4444)" }}><Ico.Warn style={{ width: 14, height: 14, flexShrink: 0 }} />Score can't be negative.</span>)}
            {gradeIsNaN && (<span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "var(--tt-err, #EF4444)" }}><Ico.Warn style={{ width: 14, height: 14, flexShrink: 0 }} />Please enter a valid number.</span>)}
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--tt-tx2, #71717A)" }}>Your private comment (optional)</span>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="Feedback for the student…" style={{ ...inputStyle, resize: "none" }} />
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "20px 24px", borderTop: "1px solid var(--tt-bd0, #27272A)" }}>
          <button type="button" onClick={onClose} style={{ fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 8, color: "var(--tt-tx1, #A1A1AA)", backgroundColor: "transparent", border: "none", cursor: "pointer" }}>Cancel</button>
          <button type="submit" disabled={!canSubmit} style={{ fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 8, backgroundColor: "var(--tt-ac, #3B82F6)", color: "var(--tt-onac, #FFFFFF)", border: "none", cursor: canSubmit ? "pointer" : "not-allowed", opacity: canSubmit ? 1 : 0.4 }}>Save Grade</button>
        </div>
      </form>

      {previewFile && (
        <FilePreviewModal file={previewFile} student={student} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );

  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}

/* ---------------------------------------------------------
   Stream tab
--------------------------------------------------------- */
function StreamTab({ cls, onCreatePost, onEditPost, onAddComment }) {
  const [commentDraft, setCommentDraft] = useState({});
  const [openComments, setOpenComments] = useState({});

  function toggleComments(postId) { setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] })); }
  function sendComment(postId) {
    const draft = (commentDraft[postId] || "").trim();
    if (!draft) return;
    onAddComment(postId, draft);
    setCommentDraft((prev) => ({ ...prev, [postId]: "" }));
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <button onClick={onCreatePost} className="flex items-center gap-4 p-5 text-left rounded-2xl transition-colors" style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
        <Avatar name={TEACHER.name} size={44} />
        <span className="text-sm" style={{ color: "var(--tt-tx2)" }}>Announce something to your class…</span>
      </button>

      {cls.stream.length === 0 && (
        <div className="p-10 text-center text-sm rounded-2xl" style={{ color: "var(--tt-tx2)", border: `1px dashed var(--tt-bd1)` }}>No posts yet.</div>
      )}

      {cls.stream.map((p) => {
        const cw = p.classworkId ? cls.classwork.find((c) => c.id === p.classworkId) : null;
        const draft = commentDraft[p.id] || "";
        const attachments = p.attachments && p.attachments.length > 0 ? p.attachments : (cw && cw.attachments) || [];
        const assignedTo = cw?.assignedTo ?? p.assignedTo ?? "all";
        const isOpen = !!openComments[p.id];
        const commentCount = p.comments.length;
        return (
          <div key={p.id} className="flex flex-col rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
            <div className="flex items-start gap-4 p-5">
              <Avatar name={p.author} size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>{p.author}</span>
                  <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>{p.time}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: "var(--tt-ac)", border: `1px solid var(--tt-ac)` }}>{p.type.toUpperCase()}</span>
                  <button onClick={() => onEditPost({ post: p, item: cw })} className="ml-auto flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors" style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>
                    <Icon.Edit className="w-3.5 h-3.5" />Edit
                  </button>
                </div>
                {p.type === "announcement" ? (
                  <div
                    className="tt-rte-post text-sm mt-3 leading-relaxed"
                    style={{ color: "var(--tt-tx1)" }}
                    dangerouslySetInnerHTML={{ __html: p.text }}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap mt-3 leading-relaxed" style={{ color: "var(--tt-tx1)" }}>{p.text}</p>
                )}
                {attachments.length > 0 && (<div className="mt-3"><AttachmentChips attachments={attachments} /></div>)}
                {cw && (
                  <div className="mt-4 p-4 flex flex-col gap-2 rounded-xl" style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)` }}>
                    <div className="flex items-center gap-3">
                      {cw.type === "quiz" ? <Icon.Quiz className="w-5 h-5" style={{ color: "var(--tt-ac)" }} /> : cw.type === "material" ? <Icon.Material className="w-5 h-5" style={{ color: "var(--tt-ac)" }} /> : <Icon.Assignment className="w-5 h-5" style={{ color: "var(--tt-ac)" }} />}
                      <span className="text-sm font-semibold truncate" style={{ color: "var(--tt-tx0)" }}>{cw.title}</span>
                    </div>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs" style={{ color: "var(--tt-tx2)" }}>
                      {cw.due && <span>Due {displayDue(cw.due)}</span>}
                      {cw.points != null && <span>{cw.points} pts</span>}
                      <AssignedBadge assignedTo={assignedTo} total={cls.students.length} />
                    </div>
                  </div>
                )}
                <button onClick={() => toggleComments(p.id)} className="flex items-center gap-2 mt-4 text-sm font-semibold py-1.5 px-2.5 rounded-lg transition-colors" style={{ color: "var(--tt-tx1)" }}>
                  <Icon.Comment className="w-4 h-4" />{commentCount} comment{commentCount === 1 ? "" : "s"}
                  <Icon.Chevron className="w-3.5 h-3.5 transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                {isOpen && (
                  <div className="mt-3 pt-3 flex flex-col gap-3" style={{ borderTop: `1px solid var(--tt-bd0)` }}>
                    {commentCount === 0 && <p className="text-xs" style={{ color: "var(--tt-tx2)" }}>No comments yet — be the first.</p>}
                    {p.comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-3">
                        <Avatar name={c.author} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>{c.author}</span>
                            <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>{c.time}</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap mt-1" style={{ color: "var(--tt-tx1)" }}>{c.text}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 mt-1">
                      <Avatar name={TEACHER.name} size={32} />
                      <input value={draft} onChange={(e) => setCommentDraft((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendComment(p.id); } }}
                        placeholder="Add class comment… (press Enter to post)"
                        className="flex-1 text-sm py-2.5 px-4 outline-none rounded-lg"
                        style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)" }} />
                      <button onClick={() => sendComment(p.id)} disabled={!draft.trim()} className="text-sm font-semibold px-4 py-2.5 rounded-lg disabled:opacity-40" style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>Post</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   Classwork tab
--------------------------------------------------------- */
function ClassworkTab({ cls, onCreatePost, onOpenItem, onEditDraft, onDiscardDraft }) {
  const items = cls.classwork;
  const drafts = cls.drafts || [];
  const [draftsOpen, setDraftsOpen] = useState(true);

  function typeLabel(type) {
    return type === "quiz" ? "Quiz" : type === "question" ? "Question" : type === "material" ? "Material" : "Assignment";
  }

  const Meta = ({ children, tone = "var(--tt-tx2)", border = "var(--tt-bd0)" }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 999, color: tone, border: `1px solid ${border}`, whiteSpace: "nowrap" }}>{children}</span>
  );

  const DraftIcon = (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 3v13M6 10l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 20h16" strokeLinecap="round" /></svg>);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <button onClick={onCreatePost} className="self-start flex items-center gap-2 text-sm font-semibold py-2.5 px-5 rounded-lg" style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
        <Icon.Plus className="w-4 h-4" />Create
      </button>

      {drafts.length > 0 && (
        <div className="flex flex-col rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}>
          <button onClick={() => setDraftsOpen((v) => !v)} className="flex items-center gap-3 px-4 py-3 text-left transition-colors"
            style={{ borderBottom: draftsOpen ? `1px solid var(--tt-bd0)` : "none" }}>
            <div className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--tt-warn) 15%, transparent)", color: "var(--tt-warn)" }}>
              <DraftIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold block" style={{ color: "var(--tt-tx0)" }}>Drafts</span>
              <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>{drafts.length} unsaved {drafts.length === 1 ? "post" : "posts"}</span>
            </div>
            <Icon.Chevron className="w-4 h-4 transition-transform" style={{ color: "var(--tt-tx1)", transform: draftsOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>

          {draftsOpen && (
            <div>
              {drafts.map((d, idx) => (
                <div key={d.id} className="flex items-center gap-4 p-4 transition-colors"
                  style={{ borderTop: idx === 0 ? "none" : `1px solid var(--tt-bd0)` }}>
                  <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--tt-bg3)", color: "var(--tt-tx2)" }}>
                    {d.type === "quiz" ? <Icon.Quiz className="w-5 h-5" /> :
                     d.type === "question" ? <Icon.Question className="w-5 h-5" /> :
                     d.type === "material" ? <Icon.Material className="w-5 h-5" /> :
                     d.type === "announcement" ? <Icon.Stream className="w-5 h-5" /> :
                     <Icon.Assignment className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold truncate block" style={{ color: "var(--tt-tx0)" }}>
                      {d.title || "(Untitled draft)"}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <Meta>{typeLabel(d.type)}</Meta>
                      <Meta tone="var(--tt-warn)" border="color-mix(in srgb, var(--tt-warn) 40%, transparent)">Draft</Meta>
                      {d.savedAt && <Meta>Saved {d.savedAt}</Meta>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => onDiscardDraft(d.id)} className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                      style={{ color: "var(--tt-err)", border: `1px solid var(--tt-bd0)` }}>
                      <Icon.Trash className="w-3.5 h-3.5" />
                      Discard
                    </button>
                    <button onClick={() => onEditDraft(d)} className="flex items-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                      style={{ color: "var(--tt-ac)", border: `1px solid var(--tt-ac)` }}>
                      <Icon.Edit className="w-3.5 h-3.5" />
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {items.length === 0 && drafts.length === 0 && (
        <div className="p-10 text-center text-sm rounded-2xl" style={{ color: "var(--tt-tx2)", border: `1px dashed var(--tt-bd1)` }}>
          No classwork yet.
        </div>
      )}

      {items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const graded = Object.values(item.grades || {}).filter((g) => g != null).length;
            const submitted = Object.values(item.submissions || {}).filter(Boolean).length;
            const total = cls.students.length;
            const attachmentCount = (item.attachments || []).length;
            const dueDate = displayDueDate(item.due);
            const dueTime = displayDueTime(item.due);

            return (
              <button type="button" key={item.id} onClick={() => onOpenItem(item)} className="flex items-start gap-4 p-4 rounded-2xl transition-colors text-left"
                style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)` }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--tt-bg2)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--tt-bg1)")}>
                <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl" style={{ backgroundColor: "var(--tt-bg3)", color: "var(--tt-ac)" }}>
                  {item.type === "quiz" ? <Icon.Quiz className="w-5 h-5" /> : item.type === "question" ? <Icon.Question className="w-5 h-5" /> : item.type === "material" ? <Icon.Material className="w-5 h-5" /> : <Icon.Assignment className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold block truncate" style={{ color: "var(--tt-tx0)" }} title={item.title}>{item.title}</span>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <Meta>{typeLabel(item.type)}</Meta>
                    <Meta>Posted {item.posted}</Meta>
                    {dueDate && <Meta tone="var(--tt-tx1)"><Icon.Calendar className="w-3.5 h-3.5" />{dueDate}</Meta>}
                    {dueTime && <Meta tone="var(--tt-tx1)"><Icon.Clock className="w-3.5 h-3.5" />{dueTime}</Meta>}
                    {attachmentCount > 0 && <Meta><Icon.Attach className="w-3.5 h-3.5" />{attachmentCount} file{attachmentCount === 1 ? "" : "s"}</Meta>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-sm flex-wrap justify-end max-w-[280px]">
                  <AssignedBadge assignedTo={item.assignedTo} total={total} />
                  {item.type !== "material" && (
                    <>
                      <span style={{ color: submitted === total ? "var(--tt-ok)" : "var(--tt-tx2)", whiteSpace: "nowrap" }}>{submitted}/{total} submitted</span>
                      <span style={{ color: "var(--tt-tx2)" }}>·</span>
                      <span style={{ color: graded === total ? "var(--tt-ok)" : "var(--tt-warn)", whiteSpace: "nowrap" }}>{graded}/{total} graded</span>
                    </>
                  )}
                  {item.points != null && <span className="font-semibold" style={{ color: "var(--tt-tx1)", whiteSpace: "nowrap" }}>{item.points} pts</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   People tab
--------------------------------------------------------- */
function PeopleTab({ cls, onRemoveStudent }) {
  const [confirmRemove, setConfirmRemove] = useState(null);
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: `2px solid var(--tt-ac)` }}>
          <span className="text-base font-semibold" style={{ color: "var(--tt-ac)" }}>Teachers</span>
        </div>
        {cls.teachers.map((t) => {
          const isMe = t.id === TEACHER.id;
          return (
            <div key={t.id} className="flex items-center gap-4 py-2.5">
              <Avatar name={t.name} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base truncate" style={{ color: "var(--tt-tx0)" }}>{t.name}</span>
                  {isMe && (<span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ color: "var(--tt-ac)", border: `1px solid var(--tt-ac)` }}>You</span>)}
                </div>
                <span className="text-sm block truncate mt-0.5" style={{ color: "var(--tt-tx2)" }}>{t.email}</span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: `2px solid var(--tt-ac)` }}>
          <span className="text-base font-semibold" style={{ color: "var(--tt-ac)" }}>Students</span>
          <span className="text-sm" style={{ color: "var(--tt-tx2)" }}>{cls.students.length} students</span>
        </div>
        {cls.students.length === 0 && <p className="text-sm py-3" style={{ color: "var(--tt-tx2)" }}>No students enrolled yet.</p>}
        {cls.students.map((s) => (
          <div key={s.id} className="flex items-center gap-4 py-2.5">
            <Avatar name={s.name} size={44} />
            <div className="min-w-0 flex-1">
              <span className="text-base block truncate" style={{ color: "var(--tt-tx0)" }}>{s.name}</span>
              <span className="text-sm block truncate mt-0.5" style={{ color: "var(--tt-tx2)" }}>{studentEmail(s)}</span>
            </div>
            <button onClick={() => setConfirmRemove(s)} className="shrink-0 p-2 rounded-lg transition-opacity opacity-60 hover:opacity-100"
              style={{ color: "var(--tt-err)", border: `1px solid var(--tt-bd0)` }} title={`Remove ${s.name} from this class`}>
              <Icon.Close className="w-4 h-4" />
            </button>
          </div>
        ))}
      </section>

      {confirmRemove && (
        <ConfirmDialog
          title="Remove student"
          message={`Are you sure you want to remove ${confirmRemove.name} from ${cls.name}? Their grades and submissions for this class will also be removed. This cannot be undone.`}
          confirmLabel="Remove student" confirmTone="danger"
          onConfirm={() => { onRemoveStudent(confirmRemove.id); setConfirmRemove(null); }}
          onCancel={() => setConfirmRemove(null)}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Grades tab
--------------------------------------------------------- */
function GradesTab({ cls }) {
  const gradedWork = cls.classwork.filter((c) => c.type !== "material");
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState("");
  const exportWrapRef = useRef(null);

  useEffect(() => {
    function onClickAway(e) { if (exportWrapRef.current && !exportWrapRef.current.contains(e.target)) setExportOpen(false); }
    if (exportOpen) document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [exportOpen]);

  function studentTotal(studentId) {
    let earned = 0, possible = 0;
    gradedWork.forEach((item) => {
      const g = item.grades[studentId];
      if (g != null && item.points != null) { earned += g; possible += item.points; }
    });
    return { earned, possible, pct: possible ? Math.round((earned / possible) * 100) : 0 };
  }

  function columnAverage(item) {
    let sum = 0, count = 0;
    cls.students.forEach((s) => {
      const g = item.grades?.[s.id];
      if (g != null) { sum += g; count += 1; }
    });
    return count ? { avg: sum / count, count, max: item.points } : null;
  }
  function classOverallAverage() {
    let totalPct = 0, counted = 0;
    cls.students.forEach((s) => {
      const t = studentTotal(s.id);
      if (t.possible > 0) { totalPct += t.pct; counted += 1; }
    });
    return counted ? Math.round(totalPct / counted) : null;
  }

  function handleDownloadCsv() {
    const rows = buildGradesTable(cls);
    const csv = toCsv(rows);
    downloadFile(`${cls.name} — Grades.csv`, csv, "text/csv;charset=utf-8;");
    setExportOpen(false); setToast("CSV downloaded. Import it into Google Sheets.");
    setTimeout(() => setToast(""), 2600);
  }
  async function handleCopyForSheets() {
    const rows = buildGradesTable(cls);
    const tsv = toTsv(rows);
    try { await navigator.clipboard.writeText(tsv); setToast("Copied! Paste it into any Google Sheet."); }
    catch { setToast("Couldn't access clipboard — try Download CSV instead."); }
    setExportOpen(false); setTimeout(() => setToast(""), 2600);
  }

  const overallAvg = classOverallAverage();

  return (
    <div className="max-w-full flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col">
          <span className="text-base font-semibold" style={{ color: "var(--tt-tx0)" }}>Grades</span>
          <span className="text-xs mt-0.5" style={{ color: "var(--tt-tx2)" }}>Read-only view. Open a classwork item to grade submissions.</span>
        </div>
        <div className="relative" ref={exportWrapRef}>
          <button onClick={() => setExportOpen((v) => !v)} disabled={gradedWork.length === 0}
            className="flex items-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg disabled:opacity-40"
            style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>
            <Icon.Sheet className="w-4 h-4" />Export to Google Sheets
            <Icon.Chevron className="w-3.5 h-3.5" style={{ transform: exportOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .15s" }} />
          </button>
          {exportOpen && (
            <div className="absolute right-0 mt-2 z-30 w-72 p-1.5 rounded-xl" style={{ backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)`, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
              <button onClick={handleDownloadCsv} className="w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--tt-bg2)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Icon.Download className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--tt-ac)" }} />
                <div className="flex flex-col min-w-0"><span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>Download as CSV</span><span className="text-xs mt-0.5" style={{ color: "var(--tt-tx2)" }}>Save a .csv file to import into Sheets</span></div>
              </button>
              <button onClick={handleCopyForSheets} className="w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left"
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--tt-bg2)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Icon.Copy className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--tt-ac)" }} />
                <div className="flex flex-col min-w-0"><span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>Copy for Google Sheets</span><span className="text-xs mt-0.5" style={{ color: "var(--tt-tx2)" }}>Paste directly into a new sheet</span></div>
              </button>
            </div>
          )}
        </div>
      </div>

      {gradedWork.length === 0 ? (
        <div className="p-10 text-center text-sm rounded-2xl" style={{ color: "var(--tt-tx2)", border: `1px dashed var(--tt-bd1)` }}>
          No gradable work yet. Create an assignment or quiz in the Classwork tab.
        </div>
      ) : (
        <div
          className="tt-scroll rounded-2xl"
          style={{
            border: `1px solid var(--tt-bd0)`,
            maxHeight: "calc(100vh - 260px)",
            overflow: "auto",
            position: "relative",
          }}>
          <table className="w-full min-w-[720px]" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                <th
                  className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: "var(--tt-tx2)",
                    backgroundColor: "var(--tt-bg2)",
                    position: "sticky",
                    top: 0,
                    left: 0,
                    zIndex: 3,
                    borderBottom: `1px solid var(--tt-bd0)`,
                    minWidth: 220,
                  }}>
                  Student
                </th>
                {gradedWork.map((item) => (
                  <th
                    key={item.id}
                    className="text-center px-4 py-4 text-xs font-semibold uppercase tracking-wider"
                    style={{
                      color: "var(--tt-tx2)",
                      backgroundColor: "var(--tt-bg2)",
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      borderBottom: `1px solid var(--tt-bd0)`,
                      minWidth: 120,
                    }}>
                    <div className="truncate max-w-[140px] mx-auto">{item.title}</div>
                    <div className="text-[11px] font-normal normal-case mt-1">{item.points == null ? "(ungraded)" : `/ ${item.points}`}</div>
                  </th>
                ))}
                <th
                  className="text-center px-4 py-4 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: "var(--tt-tx2)",
                    backgroundColor: "var(--tt-bg2)",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    borderBottom: `1px solid var(--tt-bd0)`,
                    minWidth: 100,
                  }}>
                  Overall
                </th>
              </tr>
            </thead>
            <tbody>
              {cls.students.map((s, idx) => {
                const total = studentTotal(s.id);
                return (
                  <tr key={s.id}>
                    <td
                      className="px-5 py-4"
                      style={{
                        backgroundColor: "var(--tt-bg1)",
                        position: "sticky",
                        left: 0,
                        zIndex: 1,
                        borderBottom: idx === cls.students.length - 1 ? "none" : `1px solid var(--tt-bd0)`,
                      }}>
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} size={32} />
                        <div className="min-w-0 flex flex-col">
                          <span className="text-sm truncate" style={{ color: "var(--tt-tx0)" }}>{s.name}</span>
                          <span className="text-xs truncate" style={{ color: "var(--tt-tx2)" }}>{studentEmail(s)}</span>
                        </div>
                      </div>
                    </td>
                    {gradedWork.map((item) => {
                      const g = item.grades[s.id];
                      const submitted = item.submissions[s.id];
                      return (
                        <td key={item.id} className="px-4 py-4 text-center"
                          style={{ borderBottom: idx === cls.students.length - 1 ? "none" : `1px solid var(--tt-bd0)` }}>
                          <span className="text-sm font-semibold" style={{ color: g != null ? "var(--tt-tx0)" : "var(--tt-tx2)" }}>
                            {item.points == null ? "—" : g != null ? g : (submitted ? "—" : "–")}
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 text-center"
                      style={{ borderBottom: idx === cls.students.length - 1 ? "none" : `1px solid var(--tt-bd0)` }}>
                      <span className="text-sm font-semibold" style={{ color: total.possible ? "var(--tt-tx0)" : "var(--tt-tx2)" }}>
                        {total.possible ? `${total.pct}%` : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td
                  className="px-5 py-4"
                  style={{
                    backgroundColor: "var(--tt-bg2)",
                    position: "sticky",
                    left: 0,
                    bottom: 0,
                    zIndex: 3,
                    borderTop: `2px solid var(--tt-ac)`,
                  }}>
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 10, backgroundColor: "color-mix(in srgb, var(--tt-ac) 15%, transparent)", color: "var(--tt-ac)",
                    }}>
                      <Icon.Grades style={{ width: 16, height: 16 }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: "var(--tt-ac)" }}>Class Average</span>
                  </div>
                </td>
                {gradedWork.map((item) => {
                  const col = columnAverage(item);
                  return (
                    <td key={item.id} className="px-4 py-4 text-center"
                      style={{ backgroundColor: "var(--tt-bg2)", position: "sticky", bottom: 0, zIndex: 2, borderTop: `2px solid var(--tt-ac)` }}>
                      {item.points == null ? (
                        <span className="text-sm" style={{ color: "var(--tt-tx2)" }}>—</span>
                      ) : col ? (
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold" style={{ color: "var(--tt-ac)" }}>
                            {col.avg.toFixed(1)}
                          </span>
                          <span className="text-[10px]" style={{ color: "var(--tt-tx2)" }}>
                            {Math.round((col.avg / col.max) * 100)}% · {col.count} graded
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm" style={{ color: "var(--tt-tx2)" }}>—</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-4 py-4 text-center"
                  style={{ backgroundColor: "var(--tt-bg2)", position: "sticky", bottom: 0, zIndex: 2, borderTop: `2px solid var(--tt-ac)` }}>
                  <span className="text-sm font-bold" style={{ color: "var(--tt-ac)" }}>
                    {overallAvg != null ? `${overallAvg}%` : "—"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] px-4 py-2.5 rounded-xl"
          style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)`, color: "var(--tt-tx0)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Class detail
--------------------------------------------------------- */
function ClassDetail({ cls, onBack, onUpdate, initialTab, gradeTarget, onGradeTargetHandled }) {
  const [editingDraft, setEditingDraft] = useState(null);
  const [confirmDiscardDraft, setConfirmDiscardDraft] = useState(null);
  const [tab, setTab] = useState(initialTab || "stream");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [editingTarget, setEditingTarget] = useState(null);
  const [grading, setGrading] = useState(null);
  const [copied, setCopied] = useState(false);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);

  const TABS = [
    { key: "stream",    label: "Stream",    icon: Icon.Stream },
    { key: "classwork", label: "Classwork", icon: Icon.Classwork },
    { key: "people",    label: "People",    icon: Icon.People },
    { key: "grades",    label: "Grades",    icon: Icon.Grades },
  ];

  function copyCode() { try { navigator.clipboard?.writeText(cls.code); } catch {} setCopied(true); setTimeout(() => setCopied(false), 1500); }

  function createPost(fields) {
    const id = `p_${Date.now()}`;
    let classworkId = null;
    const nextClasswork = [...cls.classwork];
    if (fields.type !== "announcement") {
      classworkId = `cw_${Date.now()}`;
      nextClasswork.unshift({
        id: classworkId, type: fields.type, title: fields.title,
        description: fields.description || "", due: fields.due || "",
        points: fields.points ?? null, posted: "Now",
        lockAfterDue: fields.lockAfterDue || false,
        grades: {}, submissions: {},
        attachments: fields.attachments || [],
        assignedTo: fields.assignedTo || "all",
      });
    }
    const nextStream = [{
      id, type: fields.type, author: TEACHER.name, time: "Now",
      text: fields.type === "announcement" ? fields.text : ((fields.description || "").replace(/<[^>]+>/g, "").trim() || fields.title),
      classworkId, comments: [],
      attachments: fields.attachments || [],
      assignedTo: fields.assignedTo || "all",
    }, ...cls.stream];
    onUpdate({ ...cls, classwork: nextClasswork, stream: nextStream });
    setShowCreatePost(false);
  }

  function updatePost(fields) {
    if (!editingTarget) return;
    const { post, item } = editingTarget;
    let nextClasswork = cls.classwork;
    if (item) {
      nextClasswork = cls.classwork.map((c) => c.id === item.id ? {
        ...c,
        title: fields.title ?? c.title,
        description: fields.description ?? c.description,
        due: fields.due ?? c.due,
        points: fields.points ?? c.points,
        lockAfterDue: fields.lockAfterDue ?? c.lockAfterDue,
        attachments: fields.attachments ?? c.attachments,
        assignedTo: fields.assignedTo ?? c.assignedTo,
      } : c);
    }
    let nextStream = cls.stream;
    if (post) {
      nextStream = cls.stream.map((p) => p.id === post.id ? {
        ...p,
        text: fields.type === "announcement" ? fields.text : ((fields.description || "").replace(/<[^>]+>/g, "").trim()),
        attachments: fields.attachments ?? p.attachments,
        assignedTo: fields.assignedTo ?? p.assignedTo,
      } : p);
    }
    onUpdate({ ...cls, classwork: nextClasswork, stream: nextStream });
    setEditingTarget(null); setViewingItem(null);
  }

  function deleteItem(item) {
    const linkedPost = cls.stream.find((p) => p.classworkId === item.id) || null;
    onUpdate({
      ...cls,
      classwork: cls.classwork.filter((c) => c.id !== item.id),
      stream: linkedPost ? cls.stream.filter((p) => p.id !== linkedPost.id) : cls.stream,
    });
    setViewingItem(null);
  }

  function addComment(postId, text) {
    onUpdate({
      ...cls,
      stream: cls.stream.map((p) => p.id === postId ? { ...p, comments: [...p.comments, { id: `c_${Date.now()}`, author: TEACHER.name, text, time: "Now" }] } : p),
    });
  }

  function removeStudent(studentId) {
    onUpdate({
      ...cls,
      students: cls.students.filter((s) => s.id !== studentId),
      classwork: cls.classwork.map((c) => {
        const nextGrades = { ...(c.grades || {}) };
        const nextSubs = { ...(c.submissions || {}) };
        delete nextGrades[studentId]; delete nextSubs[studentId];
        const nextAssigned = Array.isArray(c.assignedTo) ? c.assignedTo.filter((id) => id !== studentId) : c.assignedTo;
        return { ...c, grades: nextGrades, submissions: nextSubs, assignedTo: nextAssigned };
      }),
    });
  }

  function saveDraft(fields, draftId) {
    const draft = {
      ...fields,
      id: draftId || `draft_${Date.now()}`,
      savedAt: nowTimestamp(),
    };

    const nextDrafts = draftId
      ? (cls.drafts || []).map((d) => d.id === draftId ? draft : d)
      : [draft, ...(cls.drafts || [])];

    onUpdate({ ...cls, drafts: nextDrafts });
    setShowCreatePost(false);
    setEditingDraft(null);
  }

  function discardDraft(draftId) {
    onUpdate({ ...cls, drafts: (cls.drafts || []).filter((d) => d.id !== draftId) });
    setConfirmDiscardDraft(null);
    if (editingDraft?.id === draftId) setEditingDraft(null);
  }

  function publishDraft(draftId, fields) {
    const id = `p_${Date.now()}`;
    onUpdate((prev) => {
      let classworkId = null;
      const nextClasswork = [...prev.classwork];

      if (fields.type !== "announcement") {
        classworkId = `cw_${Date.now()}`;
        nextClasswork.unshift({
          id: classworkId, type: fields.type, title: fields.title,
          description: fields.description || "", due: fields.due || "",
          points: fields.points ?? null, posted: "Now",
          lockAfterDue: fields.lockAfterDue || false,
          grades: {}, submissions: {},
          attachments: fields.attachments || [],
          assignedTo: fields.assignedTo || "all",
        });
      }

      const nextStream = [{
        id, type: fields.type, author: TEACHER.name, time: "Now",
        text: fields.type === "announcement"
          ? fields.text
          : ((fields.description || "").replace(/<[^>]+>/g, "").trim() || fields.title),
        classworkId, comments: [],
        attachments: fields.attachments || [],
        assignedTo: fields.assignedTo || "all",
      }, ...prev.stream];

      return {
        ...prev,
        classwork: nextClasswork,
        stream: nextStream,
        drafts: (prev.drafts || []).filter((d) => d.id !== draftId),
      };
    });
    setEditingDraft(null);
  }

  function saveGrade(itemId, studentId, grade) {
    onUpdate({ ...cls, classwork: cls.classwork.map((c) => c.id === itemId ? { ...c, grades: { ...(c.grades || {}), [studentId]: grade } } : c) });
    setViewingItem((prev) => prev && prev.id === itemId ? { ...prev, grades: { ...(prev.grades || {}), [studentId]: grade } } : prev);
    setGrading(null);
  }

  function targetToFormData(target) {
    const { post, item } = target;
    const type = post?.type || item?.type || "announcement";
    return {
      type,
      text: post?.text || "",
      title: item?.title || "",
      description: item?.description || "",
      due: item?.due || "",
      points: item?.points ?? null,
      lockAfterDue: item?.lockAfterDue ?? false,
      attachments: (item?.attachments && item.attachments.length > 0) ? item.attachments : (post?.attachments || []),
      assignedTo: item?.assignedTo ?? post?.assignedTo ?? "all",
    };
  }

  useEffect(() => {
    if (!gradeTarget) return;
    const item = cls.classwork.find((c) => c.id === gradeTarget.itemId);
    const student = cls.students.find((s) => s.id === gradeTarget.studentId);
    if (item && student) setGrading({ item, student });
    onGradeTargetHandled && onGradeTargetHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeTarget]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0 relative">
        <ClassBanner color={cls.color} name={cls.name} section={cls.section} tall />
        <button onClick={onBack} className="absolute top-4 left-4 flex items-center gap-2 text-sm font-semibold py-2.5 px-3.5 rounded-xl" style={{ backgroundColor: "rgba(0,0,0,0.35)", color: "#FFFFFF" }}>
          <Icon.Back className="w-4 h-4" />All classes
        </button>
        <div className="absolute top-4 right-4">
          <button onClick={copyCode} className="flex items-center gap-2 text-sm font-semibold py-2.5 px-3.5 rounded-xl" style={{ backgroundColor: "rgba(0,0,0,0.35)", color: "#FFFFFF" }}>
            <Icon.Copy className="w-4 h-4" />{copied ? "Copied!" : cls.code}
          </button>
        </div>
      </div>

      <div className="shrink-0" style={{ backgroundColor: "var(--tt-bg1)", borderBottom: `1px solid var(--tt-bd0)` }}>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-8 py-5">
          <span className="text-sm" style={{ color: "var(--tt-tx1)" }}><span style={{ color: "var(--tt-tx2)" }}>Room · </span>{cls.room || "—"}</span>
          <span className="text-sm" style={{ color: "var(--tt-tx1)" }}><span style={{ color: "var(--tt-tx2)" }}>Subject · </span>{cls.subject}</span>
          <span className="text-sm" style={{ color: "var(--tt-tx1)" }}><span style={{ color: "var(--tt-tx2)" }}>Owner · </span>{cls.owner}</span>
          <span className="text-sm" style={{ color: "var(--tt-tx1)" }}><span style={{ color: "var(--tt-tx2)" }}>Students · </span>{cls.students.length}</span>
        </div>
        <div className="flex items-center gap-2 px-8 overflow-x-auto">
          {TABS.map((t) => {
            const active = tab === t.key;
            const IconCmp = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className="flex items-center gap-2 py-4 px-4 text-sm font-semibold whitespace-nowrap transition-colors"
                style={{ color: active ? "var(--tt-ac)" : "var(--tt-tx1)", borderBottom: `2px solid ${active ? "var(--tt-ac)" : "transparent"}`, marginBottom: "-1px" }}>
                <IconCmp className="w-4 h-4" />{t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto tt-scroll">
        <div className="px-8 py-8">
          {tab === "stream" && <StreamTab cls={cls} onCreatePost={() => setShowCreatePost(true)} onAddComment={addComment} onEditPost={(target) => setEditingTarget(target)} />}
          {tab === "classwork" && <ClassworkTab cls={cls} onCreatePost={() => setShowCreatePost(true)} onOpenItem={(item) => setViewingItem(item)} onEditDraft={(draft) => setEditingDraft(draft)} onDiscardDraft={(id) => setConfirmDiscardDraft(id)} />}
          {tab === "people" && <PeopleTab cls={cls} onRemoveStudent={removeStudent} />}
          {tab === "grades" && <GradesTab cls={cls} />}
        </div>
      </div>

      {showCreatePost && (<CreatePostModal cls={cls} onClose={() => setShowCreatePost(false)} onCreate={createPost} onSaveDraft={saveDraft} />)}

      {viewingItem && !editingTarget && (
        <ClassworkDetailModal
          cls={cls} item={viewingItem}
          onClose={() => setViewingItem(null)}
          onEdit={() => { const post = cls.stream.find((p) => p.classworkId === viewingItem.id) || null; setEditingTarget({ post, item: viewingItem }); setViewingItem(null); }}
          onDelete={() => setConfirmDeleteItem(viewingItem)}
          onGrade={(student) => setGrading({ item: viewingItem, student })}
        />
      )}

      {confirmDeleteItem && (
        <ConfirmDialog
          title="Delete classwork"
          message={`Are you sure you want to delete "${confirmDeleteItem.title}"? This will also remove its stream post and any grades tied to it. This cannot be undone.`}
          confirmLabel="Delete" confirmTone="danger"
          onConfirm={() => { deleteItem(confirmDeleteItem); setConfirmDeleteItem(null); }}
          onCancel={() => setConfirmDeleteItem(null)}
        />
      )}

      {confirmDiscardDraft && (
        <ConfirmDialog
          title="Discard draft"
          message={`Are you sure you want to discard this draft? This can't be undone.`}
          confirmLabel="Discard"
          confirmTone="danger"
          onConfirm={() => discardDraft(confirmDiscardDraft)}
          onCancel={() => setConfirmDiscardDraft(null)}
        />
      )}

      {grading && (
        <GradeModal
          item={grading.item} student={grading.student}
          submissionMeta={SAMPLE_SUBMISSIONS[grading.student.id]}
          onClose={() => setGrading(null)}
          onSave={(studentId, grade) => saveGrade(grading.item.id, studentId, grade)}
        />
      )}

      {editingTarget && (
        <CreatePostModal
          key={`edit-${editingTarget.post?.id || editingTarget.item?.id || "x"}`}
          cls={cls} editing={targetToFormData(editingTarget)}
          onClose={() => setEditingTarget(null)}
          onSave={updatePost}
          onSaveDraft={saveDraft}
        />
      )}

      {editingDraft && (
        <CreatePostModal
          key={`edit-draft-${editingDraft.id}`}
          cls={cls}
          editing={editingDraft}
          editingDraftId={editingDraft.id}
          onClose={() => setEditingDraft(null)}
          onCreate={(fields) => publishDraft(editingDraft.id, fields)}
          onSaveDraft={saveDraft}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Class list
--------------------------------------------------------- */
function ClassList({ classes, onOpen, onCreate }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--tt-tx0)" }}>Classes</h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--tt-tx2)" }}>{classes.length} active classes</p>
        </div>
        <button onClick={onCreate} className="flex items-center gap-2 text-sm font-semibold py-2.5 px-5 rounded-lg" style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
          <Icon.Plus className="w-4 h-4" />Create class
        </button>
      </div>
      {classes.length === 0 ? (
        <div className="p-12 text-center text-sm rounded-2xl" style={{ color: "var(--tt-tx2)", border: `1px dashed var(--tt-bd1)` }}>No classes yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((c) => (<ClassCard key={c.id} cls={c} onOpen={onOpen} />))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Main
--------------------------------------------------------- */
export default function TeacherClassroom(props) {
  return <TeacherClassroomInner {...props} />;
}

function TeacherClassroomInner({ onNavigate } = {}) {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const [, , teacherThemeStyle] = useTeacherTheme();
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [activeClassId, setActiveClassId] = useState(null);
  const [classInitialTab, setClassInitialTab] = useState(null);
  const [gradeTarget, setGradeTarget] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeClass = classes.find((c) => c.id === activeClassId) || null;

  useEffect(() => {
    const st = location.state;
    if (st?.openClassId) {
      setActiveClassId(st.openClassId);
      setClassInitialTab(st.tab || "classwork");
      setGradeTarget(st.gradeTarget || null);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    function onKeyDown(e) { if (e.key === "Escape") { setNotifOpen(false); setShowCreateClass(false); } }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

function handleNavClick(key) {
  setMobileNavOpen(false);
  if (key === "dashboard")    return navigate("/teacher");
  if (key === "chatbot")      return navigate("/teacher/chatbot");
  if (key === "personalized") return navigate("/teacher/personalized");
  if (key === "groupmsg")     return navigate("/teacher/messenger");
  if (key === "profile")      return navigate("/teacher/profile");
  if (key === "classroom")    { handleBackToClasses(); return; }
}
  function handleBackToClasses() { setActiveClassId(null); setClassInitialTab(null); setGradeTarget(null); }

  function createClass({ name, section, subject, room }) {
    const id = `cls_${Date.now()}`;
    const fresh = {
      id, name, section, subject, room,
      code: makeClassCode(), color: colorForString(name), owner: TEACHER.name,
      teachers: [{ id: TEACHER.id, name: TEACHER.name, email: "reyes@univ.edu" }],
      students: [], classwork: [], stream: [], drafts: [],
    };
    setClasses((prev) => [fresh, ...prev]);
    setShowCreateClass(false);
    setActiveClassId(id);
  }
  function updateClass(updated) {
    if (typeof updated === "function") {
      setClasses((prev) => prev.map((c) => (c.id === activeClassId ? updated(c) : c)));
    } else {
      setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    }
  }

  const today = useMemo(() => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }), []);

  return (
    <div style={teacherThemeStyle} className="flex h-screen w-full overflow-hidden">

      <div className="hidden md:flex h-full shrink-0">
        <Sidebar activePage="classroom" onNavigate={handleNavClick} onCloseMobile={() => {}} onLogout={() => setShowLogoutConfirm(true)} />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar activePage="classroom" onNavigate={handleNavClick} onCloseMobile={() => setMobileNavOpen(false)} onLogout={() => { setMobileNavOpen(false); setShowLogoutConfirm(true); }} />
          <div className="flex-1 bg-black/60" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: "var(--tt-bg0)" }}>
        <div className="shrink-0 flex flex-wrap justify-between items-center gap-4 py-4 px-5 sm:px-10" style={{ backgroundColor: "var(--tt-bg1)", borderBottom: `1px solid var(--tt-bd0)` }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden" style={{ color: "var(--tt-tx1)" }} onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
              <Icon.Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>{TEACHER.name}</span>
              <span className="text-xs mt-0.5" style={{ color: "var(--tt-tx2)" }}>{today}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <ThemeToggle />
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl" style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }} onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
              <Icon.Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--tt-ac)" }} />
              {notifOpen && (
                <div className="absolute right-0 top-14 z-50 w-72 p-4 text-left rounded-xl" style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)` }}>
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

        <main className={activeClass ? "flex-1 min-h-0 flex flex-col overflow-hidden" : "flex-1 min-h-0 overflow-y-auto tt-scroll"}>
          {activeClass ? (
            <ClassDetail
              key={activeClass.id} cls={activeClass}
              onBack={handleBackToClasses}
              onUpdate={updateClass}
              initialTab={classInitialTab}
              gradeTarget={gradeTarget}
              onGradeTargetHandled={() => setGradeTarget(null)}
            />
          ) : (
            <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-10">
              <ClassList
                classes={classes}
                onOpen={(id) => { setActiveClassId(id); setClassInitialTab("stream"); setGradeTarget(null); }}
                onCreate={() => setShowCreateClass(true)}
              />
            </div>
          )}
        </main>
      </div>

      {showCreateClass && (<CreateClassModal onClose={() => setShowCreateClass(false)} onCreate={createClass} />)}
      {showLogoutConfirm && (
        <TeacherLogout onClose={() => setShowLogoutConfirm(false)} />
      )}
    </div>
  );
}
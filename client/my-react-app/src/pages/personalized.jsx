import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Chatbot from "./chatbot";
import GroupCollab from "./group_collab";
import QuizArena from "./QuizArena";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import Settings from "../components/Settings";
import { useTheme, withAlpha, CloseIcon, MenuIcon } from "./Theme";
/* ---------------------------------------------------------
   Static assets (kept identical to the original design)
--------------------------------------------------------- */
const IMG = {
  logo: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/ec7p6crg_expires_30_days.png",
  dashboard: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/5fuik1xz_expires_30_days.png",
  chatbot: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/2ordxy0o_expires_30_days.png",
  group: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/tda70phj_expires_30_days.png",
  quiz: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/dni61l44_expires_30_days.png",
  personalized: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/z60zmihq_expires_30_days.png",
  settings: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/ojko43i5_expires_30_days.png",
  logout: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/cxrmfyil_expires_30_days.png",
  search: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/l374rm3u_expires_30_days.png",
  streak: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/75egjh7r_expires_30_days.png",
  xp: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/5hwd9ufw_expires_30_days.png",
  avatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/24khomt6_expires_30_days.png",
  hubIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/ryzi2kba_expires_30_days.png",
  clock: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/50isa1qk_expires_30_days.png",
  check: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/u3zd0qhx_expires_30_days.png",
  calendarTab: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/0kcswrj5_expires_30_days.png",
  quizForgeTab: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/oubb9ti2_expires_30_days.png",
  sprintTab: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/4ke3d5js_expires_30_days.png",
  calendarIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/lhzjyh8p_expires_30_days.png",
  prevArrow: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/hnkk3889_expires_30_days.png",
  nextArrow: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/py62xyav_expires_30_days.png",
  eventDot: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/bi6sg43f_expires_30_days.png",
  bellIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/i86vafzp_expires_30_days.png",
  ev1: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/xd9y4nrv_expires_30_days.png",
  ev1chk: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/pmysgfxh_expires_30_days.png",
  ev2: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/y1x3dc80_expires_30_days.png",
  ev2chk: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/txk0p8gq_expires_30_days.png",
  ev3: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/713c52uj_expires_30_days.png",
  ev3chk: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/m1cakd00_expires_30_days.png",
  plus: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/xvwh25cv_expires_30_days.png",
  qfStatus: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/0r9a3jrv_expires_30_days.png",
  qfFocus: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/615g27gg_expires_30_days.png",
  qfDeadline: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/9mqptpx1_expires_30_days.png",
  qfTomes: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/hy6z3inn_expires_30_days.png",
  qfDropIllustration: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/996h3nro_expires_30_days.png",
  qfUpload: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/2u08hvxx_expires_30_days.png",
  qfDrive: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/ywhzu783_expires_30_days.png",
  qfFile1: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/lodr58w5_expires_30_days.png",
  qfFile2: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/wvklp9ow_expires_30_days.png",
  qfFile3: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/ys8868kf_expires_30_days.png",
  qfForge: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/vbjib90o_expires_30_days.png",
  qfReindex: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/luu0k9gp_expires_30_days.png",
  qfLink: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/3m3f2aso_expires_30_days.png",
  sbLogs: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/tD9ysWtmXJ/uqxqdc14_expires_30_days.png",
  sbIngest: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/tD9ysWtmXJ/sc17bayy_expires_30_days.png",
  sbFilterIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/tD9ysWtmXJ/umwf30no_expires_30_days.png",
  sbGroupIcon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/tD9ysWtmXJ/zciy72c2_expires_30_days.png",
  sbAddQuest: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/tD9ysWtmXJ/6oy0fwc1_expires_30_days.png",
  sbBurndown: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/tD9ysWtmXJ/fdr3gczg_expires_30_days.png",
  menu:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%232CD4D9' stroke-width='2' stroke-linecap='round'><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='18' x2='21' y2='18'/></svg>",
  close:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23BBC9C9' stroke-width='2' stroke-linecap='round'><line x1='4' y1='4' x2='20' y2='20'/><line x1='20' y1='4' x2='4' y2='20'/></svg>",
};

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

// Fixed "today" so the demo data (Algo Bounds Review, CS240 Midterm, etc.)
// lines up exactly like the original static design.
const TODAY = new Date(2027, 2, 19); // March 19, 2027
const keyFor = (y, m, d) => `${y}-${m}-${d}`;

const TYPE_STYLES = {
  review: { dot: "var(--t-ac)", bg: "var(--t-ac)", text: "var(--t-onac)" },
  exam: { dot: "var(--t-err)", bg: "var(--t-err)", text: "var(--t-onerr)" },
  group: { dot: "var(--t-ok)", bg: "var(--t-ok)", text: "var(--t-onok)" },
};

// Badge color is driven by the column/status a quest sits in, so a quest's
// badge automatically re-colors itself as it's moved through the sprint.
const BADGE_COLOR_BY_COLUMN = {
  backlog: "var(--t-err)", // red
  active: "var(--t-ac2)", // cyan (unchanged)
  done: "var(--t-ok2)", // green
};

const SPRINT_STATUS_OPTIONS = [
  { id: "backlog", label: "Backlog" },
  { id: "active", label: "Active Raid" },
  { id: "done", label: "Completed" },
];

function isQuestUrgent(dueOrMeta) {
  if (!dueOrMeta) return false;
  const s = dueOrMeta.toLowerCase();
  return s.includes("tomorrow") || s.includes("today") || s.includes("overdue");
}

const INITIAL_EVENTS = [
  { id: "e1", year: 2027, month: 2, day: 13, label: "Discrete Math Prep", type: "review" },
  { id: "e2", year: 2027, month: 2, day: 19, label: "Algo Bounds Review", type: "review" },
  { id: "e3", year: 2027, month: 2, day: 20, label: "CS240 Midterm", type: "exam" },
  { id: "e4", year: 2027, month: 2, day: 23, label: "Graph Traversal Sprint", type: "group" },
];

const INITIAL_UPCOMING = [
  {
    id: "u1",
    img: IMG.ev1,
    chk: IMG.ev1chk,
    title: "Algorithm Bounds Review",
    subject: "CS240",
    subjectColor: "var(--t-ac)",
    meta: "Tomorrow • 14:00 (45 mins) • Big-O Analysis",
    status: "SCHEDULED",
    statusColor: "var(--t-ac)",
  },
  {
    id: "u2",
    img: IMG.ev2,
    chk: IMG.ev2chk,
    title: "Discrete Math Midterm",
    subject: "MATH210",
    subjectColor: "var(--t-err)",
    meta: "Fri, Mar 20 • 10:00 • Hall B (80 min instance)",
    status: "URGENT",
    statusColor: "var(--t-err)",
  },
  {
    id: "u3",
    img: IMG.ev3,
    chk: IMG.ev3chk,
    title: "Graph Traversal Group Sprint",
    subject: "CS240",
    subjectColor: "var(--t-ok)",
    meta: "Mon, Mar 23 • 16:30 • Voice Room #4",
    status: "GROUP",
    statusColor: "var(--t-ok)",
  },
];

// Graduation cap for the CLASSROOM sidebar entry, drawn inline so we don't
// need a new hosted asset (same icon the Dashboard and Classroom use).
const CLASSROOM_ICON =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='15' viewBox='0 0 24 24' fill='none' stroke='%232CD4D9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 10 12 5 2 10l10 5 10-5z'/><path d='M6 12v5c3 3 9 3 12 0v-5'/></svg>";

const NAV_ITEMS = [
  { key: "dashboard", label: "DASHBOARD", icon: IMG.dashboard, iconClass: "w-[18px] h-[15px]" },
  { key: "classroom", label: "CLASSROOM", icon: CLASSROOM_ICON, iconClass: "w-[18px] h-[15px]" },
  { key: "chatbot", label: "CHATBOT", icon: IMG.chatbot, iconClass: "w-[18px] h-[15px]" },
  { key: "group", label: "GROUP COLLAB", icon: IMG.group, iconClass: "w-5 h-2.5" },
  { key: "personalized", label: "PERSONALIZED", icon: IMG.personalized, iconClass: "w-[18px] h-[13px]" },
];

const SUBTABS = [
  { key: "calendar", label: "STUDY CALENDAR", icon: IMG.calendarTab, iconClass: "w-[13px] h-[15px]" },
  { key: "quizforge", label: "QUIZ FORGE", icon: IMG.quizForgeTab, iconClass: "w-[15px] h-[15px]" },
  { key: "sprint", label: "STUDY SPRINT BOARD", icon: IMG.sprintTab, iconClass: "w-[13px] h-3" },
];

const SUBJECT_FILTERS = ["All Subjects", "CS240", "MATH210"];

const INITIAL_FORGE_FOLDERS = [
  { id: "fo1", name: "CS240", parentId: null },
  { id: "fo2", name: "Discrete Math", parentId: null },
];

const INITIAL_FORGE_FILES = [
  {
    id: "f1",
    folderId: "fo1",
    name: "Data_Structures_Midterm_Mastery.pdf",
    icon: IMG.qfFile1,
    chunks: 42,
    size: "3.2 MB",
    status: "Indexed",
  },
  {
    id: "f2",
    folderId: "fo1",
    name: "Algo_Lecture_5_Graph_Traversals.pdf",
    icon: IMG.qfFile2,
    chunks: 24,
    size: "1.8 MB",
    status: "Indexed",
  },
  {
    id: "f3",
    folderId: "fo2",
    name: "Discrete_Math_Logic_Gates.docx",
    icon: IMG.qfFile3,
    chunks: 18,
    size: "950 KB",
    status: "Indexed",
  },
];

const INITIAL_SPRINT_COLUMNS = [
  {
    id: "backlog",
    title: "BACKLOG / QUEST LOG",
    dot: "var(--t-err)",
    cards: [
      { id: "c1", subject: "CS240", subjectColor: "var(--t-ac2)", meta: "45m", title: "Review Red-Black Tree Rotation Rules", desc: "Double rotations and recoloring edge cases." },
      { id: "c2", subject: "DISCRETE MATH", subjectColor: "var(--t-warn)", meta: "60m", title: "Proof by Induction Practice Set #4", desc: "Strong induction formulations for recurrences." },
      { id: "c3", subject: "ALGORITHMS", subjectColor: "var(--t-ok2)", meta: "30m", title: "Dijkstra Shortest Path Time Complexity", desc: "Min-Heap vs Fibonacci Heap bounds." },
    ],
  },
  {
    id: "active",
    title: "IN SPRINT / ACTIVE RAIDS",
    dot: "var(--t-ac2)",
    cards: [
      { id: "c4", subject: "CS240", subjectColor: "var(--t-ac2)", progress: 75, title: "CS240 Algorithm Bounds Review", due: "Due tomorrow", xp: 250 },
      { id: "c5", subject: "QUIZ PREP", subjectColor: "var(--t-warn)", meta: "Target 90%", title: "Tree Rebalance 10-Question Drill", desc: "AVL factor recalculation & zig-zag cases." },
      { id: "c6", subject: "PVP SPARRING", subjectColor: "var(--t-ok2)", meta: "Fri 16:30", title: "Clan Match with @EnderKnight", desc: "Graph Coloring Duel (Live session)." },
    ],
  },
  {
    id: "done",
    title: "COMPLETED / CONQUERED",
    dot: "var(--t-ok2)",
    cards: [
      { id: "c9", title: "Extract CS240 Chapter 4 Slides", xp: 100 },
      { id: "c10", title: "Stack & Queue Array Implementation", xp: 90 },
      { id: "c11", title: "Set Theory & Venn Quiz", xp: 150 },
      { id: "c12", title: "Syllabus Ingestion: Discrete Math", xp: 60 },
    ],
  },
];
function buildMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = startOffset + daysInMonth;
  const totalWeeks = Math.ceil(totalCells / 7);

  const cursor = new Date(year, month, 1 - startOffset);
  const weeks = [];
  for (let w = 0; w < totalWeeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push({
        date: new Date(cursor),
        inMonth: cursor.getMonth() === month,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateForInput(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function parseDateFromInput(str) {
  if (!str) return null;
  const parts = str.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

function formatDateLabel(d) {
  return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const RRULE_DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const capitalize = (s) => s.charAt(0) + s.slice(1).toLowerCase();

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

// "Due today" / "Due tomorrow" / "Due Mar 23" / "Overdue" for a YYYY-MM-DD string.
function dueTextFor(dateStr) {
  const d = parseDateFromInput(dateStr);
  if (!d) return "";
  const diff = Math.round((d - TODAY) / 86400000);
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `Due ${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/* ---------------------------------------------------------
   Study events <-> Google Calendar
   The new-event form mirrors Google Calendar's event fields
   (title, date, all-day, start/end, repeat, location, guests,
   Meet, notification, description, colour) so an event maps
   1:1 onto a Google Calendar API `events.insert` body.
--------------------------------------------------------- */
const DEFAULT_EVENT = {
  label: "",
  subject: "CS240",
  type: "review",
  date: formatDateForInput(TODAY),
  allDay: false,
  startTime: "09:00",
  endTime: "10:00",
  repeat: "none",
  location: "",
  meet: false,
  guests: [],
  reminder: "30",
  description: "",
  addToGoogle: false,
};

// Google Calendar colour ids: 7 Peacock, 11 Tomato, 10 Basil.
const GOOGLE_COLOR_ID = { review: "7", exam: "11", group: "10" };

function repeatOptions(date) {
  const d = date || TODAY;
  return [
    { key: "none", label: "Does not repeat", rrule: null },
    { key: "daily", label: "Daily", rrule: "RRULE:FREQ=DAILY" },
    { key: "weekly", label: `Weekly on ${FULL_DAYS[d.getDay()]}`, rrule: `RRULE:FREQ=WEEKLY;BYDAY=${RRULE_DAYS[d.getDay()]}` },
    { key: "monthly", label: `Monthly on day ${d.getDate()}`, rrule: "RRULE:FREQ=MONTHLY" },
    { key: "yearly", label: `Annually on ${capitalize(MONTH_NAMES[d.getMonth()])} ${d.getDate()}`, rrule: "RRULE:FREQ=YEARLY" },
    { key: "weekdays", label: "Every weekday (Monday to Friday)", rrule: "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR" },
  ];
}

// Does a repeating event starting on `start` land on day `d`?
function occursOn(repeat, start, d) {
  if (repeat === "daily") return true;
  if (repeat === "weekdays") return d.getDay() >= 1 && d.getDay() <= 5;
  if (repeat === "weekly") return d.getDay() === start.getDay();
  if (repeat === "monthly") return d.getDate() === start.getDate();
  if (repeat === "yearly") return d.getMonth() === start.getMonth() && d.getDate() === start.getDate();
  return false;
}

function evDate(ev) {
  return ev.date ? parseDateFromInput(ev.date) : new Date(ev.year, ev.month, ev.day);
}

function googleTimes(ev) {
  const d = evDate(ev);
  const allDay = ev.allDay ?? !ev.startTime;
  if (allDay) return { allDay: true, start: formatDateForInput(d), end: formatDateForInput(addDays(d, 1)) };
  const day = formatDateForInput(d);
  return { allDay: false, start: `${day}T${ev.startTime}:00`, end: `${day}T${ev.endTime || ev.startTime}:00` };
}

// Body for Google Calendar API  events.insert  (pass conferenceDataVersion=1 when `meet` is on).
function toGoogleEvent(ev) {
  const t = googleTimes(ev);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const rule = repeatOptions(evDate(ev)).find((o) => o.key === (ev.repeat || "none"))?.rrule;
  const mins = ev.reminder == null || ev.reminder === "none" ? null : Number(ev.reminder);
  const body = {
    summary: ev.label,
    description: [ev.description, ev.subject ? `Subject: ${ev.subject}` : ""].filter(Boolean).join("\n\n"),
    location: ev.location || undefined,
    colorId: GOOGLE_COLOR_ID[ev.type],
    start: t.allDay ? { date: t.start } : { dateTime: t.start, timeZone: tz },
    end: t.allDay ? { date: t.end } : { dateTime: t.end, timeZone: tz },
    recurrence: rule ? [rule] : undefined,
    attendees: (ev.guests || []).map((email) => ({ email })),
    reminders: { useDefault: false, overrides: mins == null ? [] : [{ method: "popup", minutes: mins }] },
  };
  if (ev.meet) {
    body.conferenceData = { createRequest: { requestId: `pz-${ev.id || Date.now()}`, conferenceSolutionKey: { type: "hangoutsMeet" } } };
  }
  return body;
}

// Pre-filled "create event" page on calendar.google.com (works without signing in to anything here).
function googleCalendarUrl(ev) {
  const t = googleTimes(ev);
  const compact = (s) => s.replace(/[-:]/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.label || "Study event",
    dates: `${compact(t.start)}/${compact(t.end)}`,
  });
  const details = [ev.description, ev.subject ? `Subject: ${ev.subject}` : ""].filter(Boolean).join("\n\n");
  const rule = repeatOptions(evDate(ev)).find((o) => o.key === (ev.repeat || "none"))?.rrule;
  if (details) params.set("details", details);
  if (ev.location) params.set("location", ev.location);
  if (rule) params.set("recur", rule);
  if (ev.guests && ev.guests.length) params.set("add", ev.guests.join(","));
  params.set("ctz", Intl.DateTimeFormat().resolvedOptions().timeZone);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// One-line summary shown under an event in "Upcoming Study Events".
function buildEventMeta(ev, date) {
  const rep = repeatOptions(date).find((o) => o.key === ev.repeat);
  const guests = ev.guests ? ev.guests.length : 0;
  return [
    `${SHORT_DAYS[date.getDay()]}, ${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`,
    ev.allDay ? "All day" : `${ev.startTime}\u2013${ev.endTime}`,
    rep && rep.key !== "none" ? rep.label : null,
    ev.location || null,
    ev.meet ? "Google Meet" : null,
    guests ? `${guests} ${guests === 1 ? "guest" : "guests"}` : null,
  ]
    .filter(Boolean)
    .join(" \u2022 ");
}

/* ---------------------------------------------------------
   Main component
--------------------------------------------------------- */
export default function CrammblingDashboard({ onNavigateToChatbot, onNavigateToGroup, onNavigateToDashboard } = {}) {
  const navigate = useNavigate();
  const [theme, setTheme, rootThemeStyle] = useTheme(); // shared with chatbot + group collab
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false); // desktop drawer: pushed to the side
  const [activeNav, setActiveNav] = useState("personalized");
  const [activeSubTab, setActiveSubTab] = useState("calendar");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [filterOpen, setFilterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(2027, 2, 1)); // month being viewed
  const [selectedDate, setSelectedDate] = useState(null); // date picked on the calendar grid
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [upcoming, setUpcoming] = useState(INITIAL_UPCOMING);
  const [completed, setCompleted] = useState({});
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ ...DEFAULT_EVENT });
  const [notifOpen, setNotifOpen] = useState(false);
  const [openEventMenuId, setOpenEventMenuId] = useState(null);
  const [forgeFiles, setForgeFiles] = useState(INITIAL_FORGE_FILES);
  const [forgeStatusMap, setForgeStatusMap] = useState({});
  const [forgeFolders, setForgeFolders] = useState(INITIAL_FORGE_FOLDERS);
  const [activeFolder, setActiveFolder] = useState(null); // null = My Library (root), else the open folder id
  const [arenaFile, setArenaFile] = useState(null); // file handed to Quiz Arena by "Forge Quiz"
  const [isDragging, setIsDragging] = useState(false);
  const [driveSyncing, setDriveSyncing] = useState(false);
  const [showRepoLink, setShowRepoLink] = useState(false);
  const [repoLinkValue, setRepoLinkValue] = useState("");
  const [repoLinks, setRepoLinks] = useState([]);
  const [sprintColumns, setSprintColumns] = useState(INITIAL_SPRINT_COLUMNS);
  const [sprintView, setSprintView] = useState("kanban");
  const [sprintSubjectFilter, setSprintSubjectFilter] = useState("ALL SUBJECTS");
  const [sprintFilterOpen, setSprintFilterOpen] = useState(false);
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverInfo, setDragOverInfo] = useState(null);
  const [addingColumnId, setAddingColumnId] = useState(null);
  const [addingText, setAddingText] = useState("");
  const [addingBadge, setAddingBadge] = useState("");
  const [autoIngesting, setAutoIngesting] = useState(false);
  const [syncingCalendar, setSyncingCalendar] = useState(false);
  const [showSprintLogs, setShowSprintLogs] = useState(false);
  const [showQuickTask, setShowQuickTask] = useState(false);
  const [quickTaskText, setQuickTaskText] = useState("");
  const [quickTaskBadge, setQuickTaskBadge] = useState("");
  const [addingDue, setAddingDue] = useState(formatDateForInput(TODAY));
  const [quickTaskDue, setQuickTaskDue] = useState(formatDateForInput(TODAY));

  const fileInputRef = useRef(null);

  /* Esc clears/closes open panels */
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setFilterOpen(false);
        setSettingsOpen(false);
        setShowAddEvent(false);
        setNotifOpen(false);
        setOpenEventMenuId(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const eventsByKey = useMemo(() => {
    const map = {};
    const add = (k, ev) => {
      if (!map[k]) map[k] = [];
      map[k].push(ev);
    };
    const rangeStart = weeks[0][0].date;
    const rangeEnd = weeks[weeks.length - 1][6].date;
    events.forEach((ev) => {
      add(keyFor(ev.year, ev.month, ev.day), ev);
      if (ev.repeat && ev.repeat !== "none") {
        const start = new Date(ev.year, ev.month, ev.day);
        for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
          if (d <= start) continue;
          if (occursOn(ev.repeat, start, d)) add(keyFor(d.getFullYear(), d.getMonth(), d.getDate()), ev);
        }
      }
    });
    return map;
  }, [events, weeks]);

  function goPrevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }
  function goNextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }
  function goToday() {
    setViewDate(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  }

  function toggleComplete(id) {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function removeCalendarEntry(id) {
    setUpcoming((prev) => prev.filter((u) => u.id !== id));
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setCompleted((prev) => {
      const { [id]: _drop, ...rest } = prev;
      return rest;
    });
  }

  function deleteUpcoming(id) {
    removeCalendarEntry(id);
    // The Sprint Board task stays; it just loses its calendar link.
    setSprintColumns((prev) =>
      prev.map((c) => ({ ...c, cards: c.cards.map((cd) => (cd.eventId === id ? { ...cd, eventId: null } : cd)) }))
    );
  }

  function formatSize(bytes) {
    if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return Math.max(1, Math.round(bytes / 1024)) + " KB";
  }

  // Drops/selections are only simulated locally (per the brief, nothing needs
  // to persist yet) — files get a fake "Indexing…" pass, then flip to "Indexed".
  function addFilesToForge(fileList) {
    const filesArr = Array.from(fileList || []);
    if (!filesArr.length) return;
    const icons = [IMG.qfFile1, IMG.qfFile2, IMG.qfFile3];
    const newEntries = filesArr.map((f, i) => ({
      id: `f${Date.now()}_${i}`,
      folderId: forgeFolders.some((fo) => fo.id === activeFolder) ? activeFolder : null,
      name: f.name,
      icon: icons[i % icons.length],
      chunks: Math.max(6, Math.round(f.size / 20000)),
      size: formatSize(f.size),
      status: "Indexing…",
      rawSize: f.size,
      text: null,
    }));
    setForgeFiles((prev) => [...newEntries, ...prev]);
    // Read the file right away and save its text for Quiz Arena. Plain-text files are
    // read for real; PDF/Word/PowerPoint need the AI backend, so Quiz Arena uses sample notes.
    filesArr.forEach((f, i) => {
      const id = newEntries[i].id;
      const isText = ["txt", "md", "markdown", "csv"].includes(f.name.split(".").pop().toLowerCase());
      const reading = isText ? f.text().catch(() => null) : Promise.resolve(null);
      Promise.all([reading, new Promise((r) => setTimeout(r, 350))]).then(([text]) => {
        setForgeFiles((prev) => prev.map((it) => (it.id === id ? { ...it, text, status: "Indexed" } : it)));
      });
    });
  }

  function handleForgeDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    addFilesToForge(e.dataTransfer.files);
  }

  function handleForgeFileInput(e) {
    addFilesToForge(e.target.files);
    e.target.value = "";
  }

  function forgeQuiz(id) {
    if (forgeStatusMap[id] === "forging") return;
    const f = forgeFiles.find((x) => x.id === id);
    if (!f) return;
    // Quiz Arena's only entrance: "Forge Quiz". The arena generates the flashcards itself.
    setArenaFile({ name: f.name, size: f.rawSize, text: f.text });
    setActiveNav("quiz");
  }

  // ---- filing system ----
  function createFolder(name) {
    const n = name.trim();
    if (!n) return;
    const id = `fo${Date.now()}`;
    // New folders are created inside whichever folder is currently open.
    const parentId = forgeFolders.some((fo) => fo.id === activeFolder) ? activeFolder : null;
    setForgeFolders((prev) => [...prev, { id, name: n, parentId }]);
  }

  function renameFolder(id, name) {
    const n = name.trim();
    if (!n) return;
    setForgeFolders((prev) => prev.map((fo) => (fo.id === id ? { ...fo, name: n } : fo)));
  }

  // Deleting a folder removes its subfolders too, but never deletes files:
  // they move up into the deleted folder's parent (or My Library).
  function deleteFolder(id) {
    const target = forgeFolders.find((fo) => fo.id === id);
    if (!target) return;
    const gone = new Set([id]);
    let grew = true;
    while (grew) {
      grew = false;
      forgeFolders.forEach((fo) => {
        if (fo.parentId && gone.has(fo.parentId) && !gone.has(fo.id)) {
          gone.add(fo.id);
          grew = true;
        }
      });
    }
    const parent = target.parentId || null;
    setForgeFolders((prev) => prev.filter((fo) => !gone.has(fo.id)));
    setForgeFiles((prev) => prev.map((it) => (gone.has(it.folderId) ? { ...it, folderId: parent } : it)));
    setActiveFolder((cur) => (gone.has(cur) ? parent : cur));
  }

  function moveFile(fileId, folderId) {
    setForgeFiles((prev) => prev.map((it) => (it.id === fileId ? { ...it, folderId: folderId || null } : it)));
  }

  function syncDrive() {
    if (driveSyncing) return;
    setDriveSyncing(true);
    setTimeout(() => setDriveSyncing(false), 1500);
  }

  function addRepoLink(e) {
    e.preventDefault();
    if (!repoLinkValue.trim()) return;
    setRepoLinks((prev) => [...prev, repoLinkValue.trim()]);
    setRepoLinkValue("");
    setShowRepoLink(false);
  }

  /* ---------------- Sprint board (drag & drop) ---------------- */
  function handleCardDragStart(e, colId, cardId) {
    setDraggedCard({ colId, cardId });
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", cardId);
    } catch (_) { }
  }

  function handleCardDragOver(e, colId, index) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverInfo({ colId, index });
  }

  function handleColumnDragOver(e, colId) {
    e.preventDefault();
    setDragOverInfo((prev) => (prev && prev.colId === colId ? prev : { colId, index: Infinity }));
  }

  function handleCardDrop(e, targetColId) {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedCard) return;
    setSprintColumns((prev) => {
      const source = prev.find((c) => c.id === draggedCard.colId);
      const card = source?.cards.find((c) => c.id === draggedCard.cardId);
      if (!card) return prev;
      const withoutCard = prev.map((c) =>
        c.id === draggedCard.colId ? { ...c, cards: c.cards.filter((cd) => cd.id !== card.id) } : c
      );
      const targetCol = withoutCard.find((c) => c.id === targetColId);
      let insertIndex =
        dragOverInfo && dragOverInfo.colId === targetColId ? dragOverInfo.index : targetCol.cards.length;
      insertIndex = Math.min(insertIndex, targetCol.cards.length);
      return withoutCard.map((c) => {
        if (c.id !== targetColId) return c;
        const newCards = [...c.cards];
        newCards.splice(insertIndex, 0, card);
        return { ...c, cards: newCards };
      });
    });
    setDraggedCard(null);
    setDragOverInfo(null);
  }

  function handleDragEnd() {
    setDraggedCard(null);
    setDragOverInfo(null);
  }

  function addCardToColumn(colId, title, extra = {}) {
    if (!title.trim()) return;
    setSprintColumns((prev) =>
      prev.map((c) =>
        c.id === colId
          ? {
            ...c,
            cards: [
              ...c.cards,
              { id: `c${Date.now()}`, title: title.trim(), subject: "NEW QUEST", meta: "", ...extra },
            ],
          }
          : c
      )
    );
  }

  function deleteCard(colId, cardId) {
    const card = sprintColumns.find((c) => c.id === colId)?.cards.find((cd) => cd.id === cardId);
    if (card?.eventId) removeCalendarEntry(card.eventId);
    setSprintColumns((prev) =>
      prev.map((c) => (c.id === colId ? { ...c, cards: c.cards.filter((cd) => cd.id !== cardId) } : c))
    );
  }

  function editCard(colId, cardId, updates) {
    const card = sprintColumns.find((c) => c.id === colId)?.cards.find((cd) => cd.id === cardId);
    if (card?.eventId) {
      if (updates.title) {
        setEvents((prev) => prev.map((e) => (e.id === card.eventId ? { ...e, label: updates.title } : e)));
      }
      setUpcoming((prev) =>
        prev.map((u) =>
          u.id === card.eventId
            ? {
              ...u,
              ...(updates.title ? { title: updates.title } : {}),
              ...(updates.subject !== undefined ? { subject: updates.subject || "TASK" } : {}),
            }
            : u
        )
      );
    }
    setSprintColumns((prev) =>
      prev.map((c) =>
        c.id === colId
          ? { ...c, cards: c.cards.map((cd) => (cd.id === cardId ? { ...cd, ...updates } : cd)) }
          : c
      )
    );
  }

  // Wipes every quest on the board and the calendar entries that were created for them.
  function clearAllQuests() {
    const ids = new Set(sprintColumns.flatMap((c) => c.cards.map((cd) => cd.eventId).filter(Boolean)));
    setSprintColumns((prev) => prev.map((c) => ({ ...c, cards: [] })));
    setUpcoming((prev) => prev.filter((u) => !ids.has(u.id)));
    setEvents((prev) => prev.filter((e) => !ids.has(e.id)));
    setCompleted((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => !ids.has(k))));
  }

  // A new sprint task always gets a due date, and that due date lands on the Study Calendar.
  function addQuest({ colId = "backlog", title, subject = "", dueStr }) {
    const t = title.trim();
    if (!t) return;
    const due = parseDateFromInput(dueStr);
    const sub = subject.trim().toUpperCase();
    let eventId = null;
    if (due) {
      eventId = `u${Date.now()}`;
      setUpcoming((prev) => [
        {
          id: eventId,
          img: IMG.ev1,
          chk: IMG.ev1chk,
          title: t,
          subject: sub || "TASK",
          subjectColor: "var(--t-ac2)",
          meta: `${SHORT_DAYS[due.getDay()]}, ${SHORT_MONTHS[due.getMonth()]} ${due.getDate()} \u2022 Due \u2022 Sprint Board task`,
          status: "TASK",
          statusColor: "var(--t-ac2)",
        },
        ...prev,
      ]);
      setEvents((prev) => [
        ...prev,
        { id: eventId, year: due.getFullYear(), month: due.getMonth(), day: due.getDate(), label: t, type: "review", subject: sub, allDay: true },
      ]);
    }
    addCardToColumn(colId, t, {
      ...(sub ? { subject: sub } : {}),
      ...(due ? { dueDate: formatDateForInput(due), eventId } : {}),
    });
  }

  function moveCardToColumn(cardId, fromColId, toColId) {
    if (fromColId === toColId) return;
    setSprintColumns((prev) => {
      const source = prev.find((c) => c.id === fromColId);
      const card = source?.cards.find((cd) => cd.id === cardId);
      if (!card) return prev;
      const withoutCard = prev.map((c) =>
        c.id === fromColId ? { ...c, cards: c.cards.filter((cd) => cd.id !== cardId) } : c
      );
      return withoutCard.map((c) => (c.id === toColId ? { ...c, cards: [...c.cards, card] } : c));
    });
  }

  function submitAddCard(e) {
    e.preventDefault();
    addQuest({ colId: addingColumnId, title: addingText, subject: addingBadge, dueStr: addingDue });
    setAddingColumnId(null);
    setAddingText("");
    setAddingBadge("");
  }

  function runAutoIngest() {
    if (autoIngesting) return;
    setAutoIngesting(true);
    setTimeout(() => {
      addQuest({ colId: "backlog", title: "Auto-ingested: New drill from latest slides", dueStr: formatDateForInput(addDays(TODAY, 3)) });
      setAutoIngesting(false);
    }, 1400);
  }

  function syncCalendar() {
    if (syncingCalendar) return;
    setSyncingCalendar(true);
    setTimeout(() => setSyncingCalendar(false), 1400);
  }

  function submitQuickTask(e) {
    e.preventDefault();
    addQuest({ colId: "backlog", title: quickTaskText, subject: quickTaskBadge, dueStr: quickTaskDue });
    setQuickTaskText("");
    setQuickTaskBadge("");
    setShowQuickTask(false);
  }

  const filteredUpcoming = upcoming.filter((u) => {
    return subjectFilter === "All Subjects" || u.subject === subjectFilter;
  });

  function submitNewEvent(e) {
    e.preventDefault();
    if (!newEvent.label.trim()) return;
    const id = `u${Date.now()}`;
    const colorMap = { review: "var(--t-ac)", exam: "var(--t-err)", group: "var(--t-ok)" };
    const statusMap = { review: "SCHEDULED", exam: "URGENT", group: "GROUP" };
    // Fall back to the calendar's selected day, then to TODAY, if the
    // date field was ever left empty.
    const chosenDate = parseDateFromInput(newEvent.date) || selectedDate || TODAY;
    const label = newEvent.label.trim();
    const subject = newEvent.subject.trim();

    setUpcoming((prev) => [
      {
        id,
        img: IMG.ev1,
        chk: IMG.ev1chk,
        title: label,
        subject,
        subjectColor: colorMap[newEvent.type],
        meta: buildEventMeta(newEvent, chosenDate),
        status: statusMap[newEvent.type],
        statusColor: colorMap[newEvent.type],
      },
      ...prev,
    ]);
    setEvents((prev) => [
      ...prev,
      {
        ...newEvent,
        id,
        label,
        subject,
        year: chosenDate.getFullYear(),
        month: chosenDate.getMonth(),
        day: chosenDate.getDate(),
      },
    ]);
    // New calendar events also land as a quest in the Sprint Board backlog, due on the event date.
    addCardToColumn("backlog", label, {
      subject: subject.toUpperCase(),
      dueDate: formatDateForInput(chosenDate),
      eventId: id,
    });
    setNewEvent({ ...DEFAULT_EVENT });
    setSelectedDate(null);
    setShowAddEvent(false);
  }

  function openAddEventForDate(date) {
    setSelectedDate(date);
    setNewEvent((p) => ({ ...p, date: formatDateForInput(date) }));
    setShowAddEvent(true);
  }

  function handleConfirmLogout() {
    setShowLogoutConfirm(false);
    // TODO: clear auth/session state here once real auth is wired up
    navigate("/");
  }

  // Self-sufficient fallback: if nothing external is controlling navigation
  // (onNavigateToChatbot not passed in), swap the whole page for the target page
  // instead of nesting it inside this page's own sidebar/topbar.
  if (activeNav === "dashboard" && !onNavigateToDashboard) {
    return <Dashboard />;
  }

  if (activeNav === "chatbot" && !onNavigateToChatbot) {
    return <Chatbot onNavigate={(key) => setActiveNav(key === "chatbot" ? "personalized" : key)} />;
  }

  if (activeNav === "group" && !onNavigateToGroup) {
    return <GroupCollab onNavigate={(key) => setActiveNav(key === "group" ? "personalized" : key)} />;
  }

  return (
    <div style={rootThemeStyle} className="flex flex-col bg-[var(--t-bg0)] min-h-screen">
      <style>{`
        @keyframes pzPop { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes pzMenu { from { opacity: 0; transform: translateY(-6px) scale(.97); } to { opacity: 1; transform: none; } }
        @keyframes pzShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        @keyframes pzPulse { 0%,100% { box-shadow: 0 0 0 0 var(--pz-glow); } 50% { box-shadow: 0 0 22px 2px var(--pz-glow); } }
        @keyframes pzLaunch { to { transform: translateY(-40px) scale(.9); opacity: 0; } }
        .pz-date { color-scheme: inherit; }
        .pz-date::-webkit-calendar-picker-indicator { cursor: pointer; opacity: .7; transition: opacity .15s; }
        .pz-date::-webkit-calendar-picker-indicator:hover { opacity: 1; }
        @media (prefers-reduced-motion: reduce) { .pz-anim { animation: none !important; } }
      `}</style>
      <div className="self-stretch bg-[var(--t-bg0)] min-h-screen relative">
        <div className="flex items-start self-stretch relative">
          {/* Mobile sidebar backdrop */}
          {mobileNavOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
          )}

          {/* ---------------- SIDEBAR ---------------- */}
          <div
            style={{ backgroundImage: "var(--t-grad-side)" }}
            className={`bg-[var(--t-bg0)] w-64 shrink-0 z-50 flex flex-col h-screen
              fixed inset-y-0 left-0 transition-transform duration-300 ease-out
              ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}
              ${navCollapsed ? "lg:-translate-x-full" : "lg:translate-x-0"}`}
          >
            <div className="flex justify-end lg:hidden px-3 pt-3">
              <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="self-stretch flex-1 overflow-y-auto">
              <div className="flex items-center self-stretch bg-[color-mix(in_srgb,_var(--t-bg2)_45%,_transparent)] py-[13px]">
                <img src={IMG.logo} className="w-9 h-9 ml-4 mr-3 object-fill" />
                <div className="w-[127px]">
                  <div
                    className="flex flex-col items-start self-stretch"
                    style={{ boxShadow: "0px 2px 4px color-mix(in srgb, var(--t-ac) 30%, transparent)" }}
                  >
                    <span className="text-[color:var(--t-ac)] text-[17px] font-bold">CRAMMBLING</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start self-stretch pt-[21px] pl-5">
                <span className="text-[color:var(--t-tx2)] text-[11px] font-bold mb-[9px]">NAVIGATION BAR</span>
              </div>

              <nav className="flex flex-col self-stretch px-3 gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = activeNav === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (item.key === "dashboard") {
                          setActiveNav("dashboard");
                          if (onNavigateToDashboard) {
                            onNavigateToDashboard();
                          }
                        } else if (item.key === "chatbot" && onNavigateToChatbot) {
                          setActiveNav("chatbot");
                          onNavigateToChatbot();
                        } else if (item.key === "group" && onNavigateToGroup) {
                          setActiveNav("group");
                          onNavigateToGroup();
                        } else if (item.key === "classroom") {
                          // Classroom is a real route (/classroom) — leave this page
                          // for it instead of showing the "coming soon" placeholder.
                          setActiveNav("classroom");
                          navigate("/classroom");
                        } else {
                          setActiveNav(item.key);
                        }
                        setMobileNavOpen(false);
                      }}
                      className={`flex items-center self-stretch py-[9px] text-left border border-solid transition-all duration-150 active:scale-[0.98]
                        ${active ? "bg-[var(--t-bg3)] border-[#00000000]" : "border-[#00000000] hover:bg-[var(--t-bg2)]"}`}
                      style={active ? { boxShadow: "0px 0px 15px color-mix(in srgb, var(--t-ac) 15%, transparent)" } : undefined}
                    >
                      <img src={item.icon} className={`${item.iconClass} ml-[13px] mr-3 object-fill`} />
                      <span className={`text-xs font-bold ${active ? "text-[color:var(--t-ac)]" : "text-[color:var(--t-tx1)]"}`}>
                        {item.label}
                      </span>
                      {active && (
                        <div className="flex-1 flex justify-end pr-4">
                          <div
                            className="bg-[var(--t-ac)] w-1.5 h-1.5 rounded-full"
                            style={{ boxShadow: "0px 0px 6px var(--t-ac)" }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-col self-stretch bg-[color-mix(in_srgb,_var(--t-bg2)_45%,_transparent)] p-3 gap-1">
              <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]"
              >
                <img src={IMG.settings} className="w-[15px] h-[15px] mx-3 object-fill" />
                <span className="text-[color:var(--t-tx1)] text-[11px]">SETTINGS</span>
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]"
              >
                <img src={IMG.logout} className="w-3.5 h-3.5 mx-3 object-fill" />
                <span className="text-[color:var(--t-tx1)] text-[11px]">LOGOUT</span>
              </button>
            </div>
          </div>

          {/* Desktop drawer handle — pushes the navigation bar to the side and back */}
          <button
            onClick={() => setNavCollapsed((v) => !v)}
            aria-label={navCollapsed ? "Open navigation bar" : "Push navigation bar aside"}
            title={navCollapsed ? "Open navigation" : "Push navigation aside"}
            className="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[55] w-5 h-16 items-center justify-center bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] border-l-0 text-[color:var(--t-ac)] hover:bg-[var(--t-ac)] hover:text-[color:var(--t-onac)] hover:shadow-[0_0_14px_color-mix(in srgb, var(--t-ac) 40%, transparent)] transition-all duration-300 active:scale-95"
            style={{ left: navCollapsed ? 0 : 256 }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: navCollapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s" }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* ---------------- MAIN ---------------- */}
          <div style={{ backgroundImage: "var(--t-grad-main)" }} className={`flex-1 bg-[var(--t-bg1)] pb-16 min-w-0 transition-[margin] duration-300 ease-out ${navCollapsed ? "lg:ml-0" : "lg:ml-64"}`}>
            {/* Top bar */}
            <div className="sticky top-0 z-30 backdrop-blur flex flex-wrap justify-between items-center gap-3 self-stretch bg-[color-mix(in_srgb,_var(--t-bg0)_40%,_transparent)] py-3 px-4 sm:px-6 mb-8 lg:mb-[72px]">
              <div className="flex flex-1 min-w-0 items-center gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setNavCollapsed(false);
                    setMobileNavOpen(true);
                  }}
                  className={`shrink-0 ${navCollapsed ? "" : "lg:hidden"}`}
                  aria-label="Open menu"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="flex shrink-0 items-center bg-[var(--t-bg3)] py-[5px] px-[13px] gap-[5px] border border-solid border-[color:var(--t-bd0)]">
                  <img src={IMG.streak} className="w-3 h-3.5 object-fill" />
                  <span className="text-[color:var(--t-warn)] text-[11px] font-bold hidden xs:inline">14 STREAK</span>
                </div>
                <div className="flex shrink-0 items-center bg-[var(--t-bg3)] py-[5px] px-[13px] gap-[5px] border border-solid border-[color:var(--t-bd0)]">
                  <img src={IMG.xp} className="w-[15px] h-[13px] object-fill" />
                  <span className="text-[color:var(--t-ac)] text-[11px] font-bold hidden xs:inline">3,420 XP</span>
                </div>

                <button className="relative shrink-0" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
                  <img src={IMG.avatar} className="w-8 h-8 object-fill" />
                  {notifOpen && (
                    <div className="absolute right-0 top-10 z-50 w-56 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] p-3 text-left shadow-lg">
                      <span className="text-[color:var(--t-tx0)] text-xs font-bold block mb-2">Notifications</span>
                      <span className="text-[color:var(--t-tx2)] text-[11px] block">
                        CS240 Midterm is coming up on Mar 20.
                      </span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setSettingsOpen(true)}
                  className="flex flex-col shrink-0 items-start px-1 sm:px-2"
                  aria-label="Profile / Settings"
                >
                  <div
                    className="flex flex-col items-center bg-[var(--t-ac)] py-[5px] px-[7px] border border-solid border-[color:var(--t-bd0)]"
                    style={{ boxShadow: "0px 1px 2px #0000000D" }}
                  >
                    <span className="text-[color:var(--t-onac)] text-sm font-bold">CP</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="self-stretch relative">
              <div
                className="self-stretch absolute top-[-56px] lg:top-[-72px] right-0 left-0 pb-[1px]"
                style={{ background: "linear-gradient(180deg, var(--t-bg2), color-mix(in srgb, var(--t-bg3) 55%, var(--t-bg2)), var(--t-bg1))" }}
              >

              </div>

              <div className="flex flex-col self-stretch px-4 sm:px-6 lg:px-10 gap-6">
                {activeNav === "quiz" ? (
                  // QuizArena brings its own side padding (same as this container),
                  // so cancel this container's padding to avoid doubling it.
                  <div className="-mx-4 sm:-mx-6 lg:-mx-10 self-stretch">
                    <QuizArena where="Personalized" file={arenaFile} onBack={() => { setActiveNav("personalized"); setActiveSubTab("quizforge"); }} />
                  </div>
                ) : activeNav !== "personalized" ? (
                  <ComingSoon nav={NAV_ITEMS.find((n) => n.key === activeNav)?.label} onBack={() => setActiveNav("personalized")} />
                ) : (
                  <>
                    {/* Hero card */}
                    <div
                      className="flex flex-col self-stretch bg-[#FFFFFF00] p-4 sm:p-[25px] gap-4"
                      style={{ boxShadow: "0px 8px 10px #0000001A" }}
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2 self-stretch">
                        <div className="flex flex-wrap shrink-0 items-center gap-x-2.5">
                          <span className="text-[color:var(--t-tx2)] text-[11px]">CRAMMBLING</span>
                          <span className="text-[color:var(--t-tx2)] text-[11px]">/</span>
                          <span className="text-[color:var(--t-tx2)] text-[11px]">PERSONAL</span>
                          <span className="text-[color:var(--t-tx2)] text-[11px]">/</span>
                          <span className="text-[color:var(--t-tx0)] text-[11px] font-bold">STUDY HUB</span>
                        </div>
                        <div className="flex shrink-0 items-center bg-[var(--t-bg3)] py-[5px] px-[13px] gap-2 border border-solid border-[color:var(--t-bd0)]">
                          <div className="bg-[var(--t-ok)] w-1.5 h-1.5" />
                          <span className="text-[color:var(--t-ok)] text-[11px]">ACTIVE</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center self-stretch py-1 gap-4">
                        <img src={IMG.hubIcon} className="w-12 h-12 object-fill shrink-0" />
                        <div className="flex-1 min-w-[220px]">
                          <div className="flex flex-col items-start self-stretch">
                            <span className="text-[color:var(--t-tx0)] text-2xl sm:text-3xl font-bold">
                              PERSONAL STUDY WORKSPACE
                            </span>
                          </div>
                          <div className="flex flex-col self-stretch pt-1">
                            <span className="text-[color:var(--t-tx2)] text-sm">
                              Synchronized academic revisions, exam checkpoints, and active syllabus ingestion.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-start self-stretch pt-[17px] gap-x-3 gap-y-2">
                        <div className="flex shrink-0 items-center gap-1.5">
                          <div className="bg-[var(--t-ac)] w-1.5 h-1.5" />
                          <span className="text-[color:var(--t-ac)] text-[11px]">Active Semester</span>
                        </div>
                        <span className="text-[color:var(--t-bd0)] text-[11px] hidden sm:inline">•</span>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <img src={IMG.clock} className="w-3 h-[11px] object-fill" />
                          <span className="text-[color:var(--t-tx1)] text-[11px]">Next: CS240 Midterm (2d)</span>
                        </div>
                        <span className="text-[color:var(--t-bd0)] text-[11px] hidden sm:inline">•</span>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <img src={IMG.check} className="w-2.5 h-2.5 object-fill" />
                          <span className="text-[color:var(--t-ok)] text-[11px]">2 Syllabi Ingested</span>
                        </div>
                      </div>
                    </div>

                    {/* Sub tabs + filter */}
                    <div className="flex flex-wrap justify-between items-center gap-3 self-stretch">
                      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
                        {SUBTABS.map((tab) => {
                          const active = activeSubTab === tab.key;
                          return (
                            <button
                              key={tab.key}
                              onClick={() => setActiveSubTab(tab.key)}
                              className={`flex shrink-0 items-center py-2 px-3 sm:px-4 gap-2 border-b-2 transition-all duration-150 active:scale-95
                                ${active ? "border-[color:var(--t-ac)]" : "border-transparent hover:border-[color:var(--t-bd0)]"}`}
                            >
                              <img src={tab.icon} className={`${tab.iconClass} object-fill`} />
                              <span className={`text-xs font-bold whitespace-nowrap ${active ? "text-[color:var(--t-ac)]" : "text-[color:var(--t-tx1)]"}`}>
                                {tab.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="relative shrink-0">
                        <button
                          onClick={() => setFilterOpen((v) => !v)}
                          className="flex flex-col items-start bg-[var(--t-bg3)] py-[5px] px-[11px] border border-solid border-[color:var(--t-bd0)] hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-95"
                        >
                          <span className="text-[color:var(--t-tx2)] text-xs">Filter: {subjectFilter}</span>
                        </button>
                        {filterOpen && (
                          <div className="absolute right-0 mt-1 z-40 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] min-w-[160px]">
                            {SUBJECT_FILTERS.map((s) => (
                              <button
                                key={s}
                                onClick={() => {
                                  setSubjectFilter(s);
                                  setFilterOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-2 text-xs hover:bg-[var(--t-bg3)] ${subjectFilter === s ? "text-[color:var(--t-ac)]" : "text-[color:var(--t-tx1)]"
                                  }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {activeSubTab === "calendar" && (
                      <div className="flex flex-col self-stretch gap-6">
                        {/* Calendar card */}
                        <div
                          className="flex flex-col self-stretch bg-[var(--t-bg1)] p-4 sm:p-[21px] gap-4 border border-solid border-[color:var(--t-bd0)]"
                          style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
                        >
                          <div className="flex flex-wrap justify-between items-start gap-3 self-stretch pb-[13px]">
                            <div className="flex items-center gap-3">
                              <img src={IMG.calendarIcon} className="w-8 h-8 object-fill" />
                              <div>
                                <div className="flex flex-col items-start self-stretch">
                                  <span className="text-[color:var(--t-tx0)] text-lg font-bold">
                                    {MONTH_NAMES[month]} {year}
                                  </span>
                                </div>
                                <div className="flex flex-col items-start self-stretch">
                                  <span className="text-[color:var(--t-tx2)] text-[11px]">Academic Schedule</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center">
                              <button
                                onClick={goPrevMonth}
                                aria-label="Previous month"
                                className="w-7 h-7 mr-[7px] flex items-center justify-center hover:opacity-75 transition-all duration-150 hover:scale-110 active:scale-90"
                              >
                                <img src={IMG.prevArrow} className="w-7 h-7 object-fill" />
                              </button>
                              <button
                                onClick={goToday}
                                className="flex flex-col shrink-0 items-start bg-[var(--t-bg3)] py-1 px-[13px] mr-[9px] border border-solid border-[color:var(--t-bd0)] hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-95"
                              >
                                <span className="text-[color:var(--t-ac)] text-xs font-bold">TODAY</span>
                              </button>
                              <button
                                onClick={goNextMonth}
                                aria-label="Next month"
                                className="w-7 h-7 mr-[7px] flex items-center justify-center hover:opacity-75 transition-all duration-150 hover:scale-110 active:scale-90"
                              >
                                <img src={IMG.nextArrow} className="w-7 h-7 object-fill" />
                              </button>
                              <button
                                onClick={() => openAddEventForDate(selectedDate || TODAY)}
                                className="flex shrink-0 items-center bg-[var(--t-ac)] py-1 px-3 gap-1 hover:opacity-90 transition-all duration-150 active:scale-95"
                              >
                                <img src={IMG.eventDot} className="w-2 h-2 object-fill" />
                                <span className="text-[color:var(--t-onac)] text-xs font-bold">EVENT</span>
                              </button>
                            </div>
                          </div>

                          <div className="self-stretch bg-[var(--t-bg0)] p-[1px] border border-solid border-[color:var(--t-bd0)] overflow-x-auto">
                            <div className="min-w-[560px]">
                              <div className="flex items-center self-stretch bg-[var(--t-bg3)] py-2">
                                {WEEKDAYS.map((wd) => (
                                  <div key={wd} className="flex flex-1 flex-col items-center">
                                    <span className="text-[color:var(--t-tx2)] text-[11px] font-bold">{wd}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="self-stretch">
                                {weeks.map((week, wIdx) => (
                                  <div key={wIdx} className="flex items-stretch self-stretch">
                                    {week.map((cell, dIdx) => {
                                      const k = keyFor(cell.date.getFullYear(), cell.date.getMonth(), cell.date.getDate());
                                      const dayEvents = eventsByKey[k] || [];
                                      const isToday = isSameDay(cell.date, TODAY);
                                      const isSelected = selectedDate && isSameDay(cell.date, selectedDate);
                                      const bgTint = dayEvents.length
                                        ? isToday
                                          ? "bg-[color-mix(in_srgb,_var(--t-ac)_20%,_transparent)]"
                                          : "bg-[color-mix(in_srgb,_var(--t-bg3)_30%,_transparent)]"
                                        : "";
                                      return (
                                        <div
                                          key={dIdx}
                                          onClick={() => setSelectedDate(cell.date)}
                                          role="button"
                                          aria-label={`Select ${cell.date.toDateString()}`}
                                          className={`group relative flex flex-1 flex-col items-start pt-[9px] px-[9px] pb-3 min-h-[90px] cursor-pointer transition-colors ${bgTint} ${!cell.inMonth ? "opacity-40" : ""
                                            }`}
                                          style={
                                            isToday
                                              ? { boxShadow: "0px 0px 10px color-mix(in srgb, var(--t-ac) 25%, transparent)" }
                                              : isSelected
                                                ? { boxShadow: "inset 0px 0px 0px 2px var(--t-ac2)" }
                                                : undefined
                                          }
                                        >
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openAddEventForDate(cell.date);
                                            }}
                                            aria-label={`Add a study event on ${cell.date.toDateString()}`}
                                            className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90 transition-all duration-150 z-10"
                                          >
                                            +
                                          </button>
                                          <div className="flex items-center self-stretch justify-between">
                                            <span
                                              className={`text-xs font-bold ${isToday
                                                ? "text-[color:var(--t-ac)]"
                                                : cell.inMonth
                                                  ? "text-[color:var(--t-tx0)]"
                                                  : "text-[color:var(--t-bd1)]"
                                                }`}
                                            >
                                              {String(cell.date.getDate()).padStart(2, "0")}
                                              {isToday ? " TODAY" : ""}
                                            </span>
                                            {isToday && <div className="bg-[var(--t-ac)] w-2 h-2 shrink-0" />}
                                          </div>
                                          <div className="flex flex-col items-start gap-1 mt-2 w-full">
                                            {dayEvents.map((ev) => {
                                              const st = TYPE_STYLES[ev.type];
                                              return (
                                                <div
                                                  key={ev.id}
                                                  title={`${ev.label}${!ev.allDay && ev.startTime ? ` \u2022 ${ev.startTime}\u2013${ev.endTime}` : ""}`}
                                                  className="flex flex-col items-start py-1 px-1.5 w-full truncate"
                                                  style={{ backgroundColor: st.bg }}
                                                >
                                                  <span
                                                    className="text-[10px] sm:text-[11px] font-bold truncate w-full"
                                                    style={{ color: st.text }}
                                                  >
                                                    {!ev.allDay && ev.startTime ? `${ev.startTime} ` : ""}{ev.label}
                                                  </span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center self-stretch py-1 gap-x-6 gap-y-2">
                            <div className="flex shrink-0 items-center gap-2">
                              <div className="bg-[var(--t-ac)] w-2.5 h-2.5" />
                              <span className="text-[color:var(--t-tx0)] text-[11px] font-bold">Study Review</span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <div className="bg-[var(--t-err)] w-2.5 h-2.5" />
                              <span className="text-[color:var(--t-tx0)] text-[11px] font-bold">Exam Checkpoint</span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <div className="bg-[var(--t-ok)] w-2.5 h-2.5" />
                              <span className="text-[color:var(--t-tx0)] text-[11px] font-bold">Group Session</span>
                            </div>
                          </div>
                        </div>

                        {/* Upcoming events card */}
                        <div
                          className="flex flex-col self-stretch bg-[var(--t-bg1)] p-4 sm:p-[21px] gap-4 border border-solid border-[color:var(--t-bd0)]"
                          style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
                        >
                          <div className="flex justify-between items-start self-stretch pb-[13px]">
                            <div className="flex shrink-0 items-center gap-2.5">
                              <img src={IMG.bellIcon} className="w-[15px] h-4 object-fill" />
                              <span className="text-[color:var(--t-tx0)] text-lg font-bold">UPCOMING STUDY EVENTS</span>
                            </div>
                            <span className="text-[color:var(--t-tx2)] text-xs">{filteredUpcoming.length} Scheduled</span>
                          </div>

                          <div className="self-stretch">
                            {filteredUpcoming.length === 0 && (
                              <div className="text-[color:var(--t-tx2)] text-xs py-6 text-center">
                                No events match this filter or search.
                              </div>
                            )}
                            {filteredUpcoming.map((u) => {
                              const isDone = completed[u.id];
                              return (
                                <div
                                  key={u.id}
                                  className={`flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 self-stretch bg-[var(--t-bg2)] p-4 sm:p-[17px] mb-2.5 border border-solid border-[color:var(--t-bd0)] ${isDone ? "opacity-60" : ""
                                    }`}
                                  style={isDone ? { filter: "grayscale(1)" } : undefined}
                                >
                                  <div className="flex items-center min-w-0 flex-1 gap-4">
                                    <img src={u.img} className="w-10 h-10 object-fill shrink-0" />
                                    <div className="flex flex-1 min-w-0 flex-col gap-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span
                                          className={`text-[color:var(--t-tx0)] text-sm font-bold truncate ${isDone ? "line-through" : ""
                                            }`}
                                        >
                                          {u.title}
                                        </span>
                                        <div
                                          className="flex flex-col shrink-0 items-start py-[3px] px-[9px] border border-solid"
                                          style={{
                                            backgroundColor: withAlpha(u.subjectColor, "33"),
                                            borderColor: withAlpha(u.subjectColor, "4D"),
                                          }}
                                        >
                                          <span className="text-[10px] font-bold" style={{ color: u.subjectColor }}>
                                            {u.subject}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-start self-stretch">
                                        <span className="text-[color:var(--t-tx1)] text-xs truncate">{u.meta}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-[13px]">
                                    <div
                                      className="flex flex-col shrink-0 items-start py-[5px] px-[11px] border border-solid"
                                      style={{
                                        backgroundColor: withAlpha(u.statusColor, "1A"),
                                        borderColor: u.statusColor,
                                      }}
                                    >
                                      <span className="text-[11px] font-bold" style={{ color: u.statusColor }}>
                                        {u.status}
                                      </span>
                                    </div>
                                    <div className="relative shrink-0">
                                      <button
                                        onClick={() => setOpenEventMenuId((cur) => (cur === u.id ? null : u.id))}
                                        aria-label="Event options"
                                        className="w-8 h-8 flex items-center justify-center text-[color:var(--t-tx1)] text-lg leading-none tracking-widest hover:text-[color:var(--t-tx0)] hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-90"
                                      >
                                        •••
                                      </button>
                                      {openEventMenuId === u.id && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setOpenEventMenuId(null)}
                                          />
                                          <div
                                            className="pz-anim absolute right-0 top-10 z-50 w-56 bg-[color-mix(in_srgb,_var(--t-mbg)_95%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] p-1.5 flex flex-col gap-1"
                                            style={{ boxShadow: "0 14px 36px rgba(0,0,0,0.6), 0 0 24px color-mix(in srgb, var(--t-glow) 30%, transparent)", animation: "pzMenu .16s ease-out" }}
                                          >
                                            <button
                                              onClick={() => {
                                                toggleComplete(u.id);
                                                setOpenEventMenuId(null);
                                              }}
                                              className="group/mi flex items-center gap-2.5 w-full text-left p-1.5 border border-solid border-transparent text-[color:var(--t-tx1)] hover:bg-[color-mix(in_srgb,_var(--t-ac)_10%,_transparent)] hover:border-[color:color-mix(in_srgb,_var(--t-ac)_30%,_transparent)] hover:text-[color:var(--t-ac)] active:scale-[0.98] transition-all duration-150"
                                            >
                                              <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-solid border-[color:color-mix(in_srgb,_var(--t-ac)_30%,_transparent)] bg-[color-mix(in_srgb,_var(--t-ac)_13%,_transparent)] text-[color:var(--t-ac)] group-hover/mi:bg-[var(--t-ac)] group-hover/mi:text-[color:var(--t-onac)] transition-colors">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                  {isDone ? <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /> : <polyline points="5 12 10 17 19 7" />}
                                                </svg>
                                              </span>
                                              <span className="text-xs font-bold whitespace-nowrap">{isDone ? "Mark as not done" : "Mark as done"}</span>
                                            </button>
                                            {events.some((x) => x.id === u.id) && (
                                              <button
                                                onClick={() => {
                                                  const ev = events.find((x) => x.id === u.id);
                                                  window.open(googleCalendarUrl(ev), "_blank", "noopener,noreferrer");
                                                  setOpenEventMenuId(null);
                                                }}
                                                className="group/mi flex items-center gap-2.5 w-full text-left p-1.5 border border-solid border-transparent text-[color:var(--t-tx1)] hover:bg-[color-mix(in_srgb,_var(--t-ac)_10%,_transparent)] hover:border-[color:color-mix(in_srgb,_var(--t-ac)_30%,_transparent)] hover:text-[color:var(--t-ac)] active:scale-[0.98] transition-all duration-150"
                                              >
                                                <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-solid border-[color:color-mix(in_srgb,_var(--t-ac)_30%,_transparent)] bg-[color-mix(in_srgb,_var(--t-ac)_13%,_transparent)] text-[color:var(--t-ac)] group-hover/mi:bg-[var(--t-ac)] group-hover/mi:text-[color:var(--t-onac)] transition-colors">
                                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                                    <path d="M16 2v4M8 2v4M3 10h18" />
                                                  </svg>
                                                </span>
                                                <span className="text-xs font-bold whitespace-nowrap">Add to Google Calendar</span>
                                              </button>
                                            )}
                                            <div className="h-px bg-[var(--t-mbd)] mx-1" />
                                            <button
                                              onClick={() => {
                                                deleteUpcoming(u.id);
                                                setOpenEventMenuId(null);
                                              }}
                                              className="group/mi flex items-center gap-2.5 w-full text-left p-1.5 border border-solid border-transparent text-[color:var(--t-err)] hover:bg-[color-mix(in_srgb,_var(--t-err)_10%,_transparent)] hover:border-[color:color-mix(in_srgb,_var(--t-err)_30%,_transparent)] active:scale-[0.98] transition-all duration-150"
                                            >
                                              <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-solid border-[color:color-mix(in_srgb,_var(--t-err)_30%,_transparent)] bg-[color-mix(in_srgb,_var(--t-err)_13%,_transparent)] text-[color:var(--t-err)] group-hover/mi:bg-[var(--t-err)] group-hover/mi:text-[color:var(--t-onerr)] transition-colors">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                  <polyline points="3 6 5 6 21 6" />
                                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                  <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                </svg>
                                              </span>
                                              <span className="text-xs font-bold whitespace-nowrap">Delete event</span>
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            <button
                              onClick={() => openAddEventForDate(selectedDate || TODAY)}
                              className="flex justify-center items-center self-stretch bg-[var(--t-bg3)] py-[13px] mt-1 gap-[7px] border border-solid border-[color:var(--t-bd0)] w-full hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.98]"
                            >
                              <img src={IMG.plus} className="w-2.5 h-2.5 object-fill" />
                              <span className="text-[color:var(--t-tx1)] text-xs font-bold">+ NEW STUDY EVENT</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSubTab === "quizforge" && (
                      <QuizForgePanel
                        files={forgeFiles}
                        forgeStatusMap={forgeStatusMap}
                        onForge={forgeQuiz}
                        folders={forgeFolders}
                        activeFolder={activeFolder}
                        setActiveFolder={setActiveFolder}
                        onCreateFolder={createFolder}
                        onRenameFolder={renameFolder}
                        onDeleteFolder={deleteFolder}
                        onMoveFile={moveFile}
                        isDragging={isDragging}
                        setIsDragging={setIsDragging}
                        fileInputRef={fileInputRef}
                        onDrop={handleForgeDrop}
                        onFileInputChange={handleForgeFileInput}
                        driveSyncing={driveSyncing}
                        onSyncDrive={syncDrive}
                        showRepoLink={showRepoLink}
                        setShowRepoLink={setShowRepoLink}
                        repoLinkValue={repoLinkValue}
                        setRepoLinkValue={setRepoLinkValue}
                        onAddRepoLink={addRepoLink}
                        repoLinks={repoLinks}
                      />
                    )}
                    {activeSubTab === "sprint" && (
                      <SprintBoardPanel
                        columns={sprintColumns}
                        view={sprintView}
                        setView={setSprintView}
                        subjectFilter={sprintSubjectFilter}
                        setSubjectFilter={setSprintSubjectFilter}
                        filterOpen={sprintFilterOpen}
                        setFilterOpen={setSprintFilterOpen}
                        draggedCard={draggedCard}
                        dragOverInfo={dragOverInfo}
                        onCardDragStart={handleCardDragStart}
                        onCardDragOver={handleCardDragOver}
                        onColumnDragOver={handleColumnDragOver}
                        onCardDrop={handleCardDrop}
                        onDragEnd={handleDragEnd}
                        addingColumnId={addingColumnId}
                        setAddingColumnId={setAddingColumnId}
                        addingText={addingText}
                        setAddingText={setAddingText}
                        addingBadge={addingBadge}
                        setAddingBadge={setAddingBadge}
                        onSubmitAddCard={submitAddCard}
                        onDeleteCard={deleteCard}
                        onEditCard={editCard}
                        onMoveCard={moveCardToColumn}
                        autoIngesting={autoIngesting}
                        onAutoIngest={runAutoIngest}
                        syncingCalendar={syncingCalendar}
                        onSyncCalendar={syncCalendar}
                        showSprintLogs={showSprintLogs}
                        setShowSprintLogs={setShowSprintLogs}
                        showQuickTask={showQuickTask}
                        setShowQuickTask={setShowQuickTask}
                        quickTaskText={quickTaskText}
                        setQuickTaskText={setQuickTaskText}
                        quickTaskBadge={quickTaskBadge}
                        setQuickTaskBadge={setQuickTaskBadge}
                        onSubmitQuickTask={submitQuickTask}
                        addingDue={addingDue}
                        setAddingDue={setAddingDue}
                        quickTaskDue={quickTaskDue}
                        setQuickTaskDue={setQuickTaskDue}
                        onClearAll={clearAllQuests}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings drawer — shared by every page */}
        <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} onThemeChange={setTheme} />

        {/* Add event modal */}
        {showAddEvent && (
          <NewEventModal
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            onClose={() => setShowAddEvent(false)}
            onSubmit={submitNewEvent}
          />
        )}

        {/* Logout confirmation — same popup as the Dashboard */}
        {showLogoutConfirm && (
          <LogoutConfirmModal onConfirm={handleConfirmLogout} onCancel={() => setShowLogoutConfirm(false)} />
        )}
      </div>
    </div>
  );
}

const EVENT_TYPES = [
  { key: "review", label: "Study Review", color: "var(--t-ac)", icon: "📖" },
  { key: "exam", label: "Exam Checkpoint", color: "var(--t-err)", icon: "🎯" },
  { key: "group", label: "Group Session", color: "var(--t-ok)", icon: "👥" },
];

const REMINDER_OPTIONS = [
  { v: "none", label: "No notification" },
  { v: "10", label: "10 minutes before" },
  { v: "30", label: "30 minutes before" },
  { v: "60", label: "1 hour before" },
  { v: "1440", label: "1 day before" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fromMin = (n) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

function NewEventModal({ newEvent, setNewEvent, onClose, onSubmit }) {
  const [launching, setLaunching] = useState(false);
  const [guestInput, setGuestInput] = useState("");
  const [guestError, setGuestError] = useState("");
  const set = (patch) => setNewEvent((p) => ({ ...p, ...patch }));

  const picked = parseDateFromInput(newEvent.date);
  const timeInvalid = !newEvent.allDay && !!newEvent.startTime && !!newEvent.endTime && newEvent.endTime <= newEvent.startTime;
  const hasDetails =
    !!newEvent.location.trim() || !!newEvent.description.trim() || newEvent.guests.length > 0 || newEvent.meet;

  const checks = [!!newEvent.label.trim(), !!newEvent.date && !timeInvalid, !!newEvent.subject.trim(), hasDetails];
  const done = checks.filter(Boolean).length;
  const pct = (done / checks.length) * 100;
  const complete = done === checks.length;
  const barColor = pct < 50 ? "var(--t-warn)" : pct < 100 ? "var(--t-ac2)" : "var(--t-ok)";
  const typeDef = EVENT_TYPES.find((t) => t.key === newEvent.type) || EVENT_TYPES[0];

  const left = picked ? Math.round((picked - TODAY) / 86400000) : null;
  const dueHint = left === null ? null : left < 0 ? "In the past" : left === 0 ? "Today" : left === 1 ? "Tomorrow" : `In ${left} days`;
  const repeats = repeatOptions(picked || TODAY);

  function quickDate(offset) {
    const d = new Date(TODAY);
    d.setDate(d.getDate() + offset);
    set({ date: formatDateForInput(d) });
  }

  // Like Google Calendar: moving the start moves the end so the duration is kept.
  function changeStart(v) {
    if (!v) return;
    const prev = toMin(newEvent.endTime) - toMin(newEvent.startTime);
    const dur = prev > 0 ? prev : 60;
    set({ startTime: v, endTime: fromMin(Math.min(toMin(v) + dur, 23 * 60 + 59)) });
  }

  function addGuest() {
    const parts = guestInput.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const bad = parts.find((p) => !EMAIL_RE.test(p));
    if (bad) {
      setGuestError(`"${bad}" isn't a valid email address`);
      return;
    }
    set({ guests: [...new Set([...newEvent.guests, ...parts.map((p) => p.toLowerCase())])] });
    setGuestInput("");
    setGuestError("");
  }

  function submit(e) {
    e.preventDefault();
    if (!newEvent.label.trim() || launching || timeInvalid) return;
    // Open Google Calendar right away (inside the click) so the browser doesn't block the tab.
    if (newEvent.addToGoogle) window.open(googleCalendarUrl(newEvent), "_blank", "noopener,noreferrer");
    setLaunching(true);
    setTimeout(() => onSubmit({ preventDefault() { } }), 450);
  }

  const field =
    "w-full bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2.5 px-3 text-left outline-none transition-all duration-200 placeholder:text-[color:var(--t-ph)] focus:border-[color:var(--t-ac)] focus:shadow-[0_0_14px_color-mix(in srgb, var(--t-ac) 20%, transparent)] focus:bg-[var(--t-in1)]";
  const sectionLabel = "flex items-center gap-1.5 text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider text-left uppercase";

  const Label = ({ children, ok, optional }) => (
    <span className={sectionLabel}>
      <span
        className="inline-flex items-center justify-center w-3 h-3 rounded-full text-[8px] leading-none transition-all duration-300"
        style={{
          backgroundColor: ok ? "var(--t-ok)" : "transparent",
          border: `1px solid ${ok ? "var(--t-ok)" : "var(--t-mbd2)"}`,
          color: "var(--t-mbg)",
          transform: ok ? "scale(1.15)" : "scale(1)",
        }}
      >
        {ok ? "✓" : ""}
      </span>
      {children}
      {optional && <span className="normal-case tracking-normal font-normal text-[color:var(--t-ph)]">(optional)</span>}
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <form
        onSubmit={submit}
        className="pz-anim relative bg-[color-mix(in_srgb,_var(--t-mbg)_95%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-lg max-h-[94vh] overflow-y-auto"
        style={{
          boxShadow: `0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${withAlpha(typeDef.color, "22")}`,
          animation: launching ? "pzLaunch .45s ease-in forwards" : "pzPop .28s cubic-bezier(.2,.9,.3,1.2)",
        }}
      >
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${typeDef.color}, var(--t-warn), ${typeDef.color})` }} />

        {/* header */}
        <div className="flex justify-between items-start px-5 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center text-base border border-solid transition-colors duration-300"
              style={{ backgroundColor: withAlpha(typeDef.color, "22"), borderColor: withAlpha(typeDef.color, "55") }}
            >
              {typeDef.icon}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[color:var(--t-tx0)] text-sm font-bold tracking-wide">NEW STUDY EVENT</span>
              <span className="text-[color:var(--t-mtx)] text-[11px]">
                {complete ? "All set — ready to launch!" : `${done} of ${checks.length} details filled in`}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-xl leading-none hover:text-[color:var(--t-ac2)] hover:rotate-90 transition-all duration-200" aria-label="Close">
            ×
          </button>
        </div>

        {/* progress bar */}
        <div className="px-5 pb-4">
          <div className="relative h-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 transition-all duration-500 ease-out overflow-hidden"
              style={{ width: `${pct}%`, backgroundColor: barColor, boxShadow: `0 0 10px ${withAlpha(barColor, "99")}` }}
            >
              {pct > 0 && (
                <div
                  className="pz-anim absolute inset-y-0 w-1/3"
                  style={{ background: "linear-gradient(90deg, transparent, #ffffff88, transparent)", animation: "pzShimmer 1.8s linear infinite" }}
                />
              )}
            </div>
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-[color:var(--t-ph)]">
            <span>Progress</span>
            <span className="font-bold transition-colors duration-500" style={{ color: barColor }}>
              {Math.round(pct)}%
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-5 pb-5">
          {/* Title */}
          <label className="flex flex-col gap-1.5">
            <Label ok={checks[0]}>Title</Label>
            <input autoFocus value={newEvent.label} onChange={(e) => set({ label: e.target.value })} placeholder="Add title" className={`${field} !text-sm font-bold`} />
          </label>

          {/* Type (maps to the Google Calendar event colour) */}
          <div className="flex flex-col gap-1.5">
            <span className={sectionLabel}>Type</span>
            <div className="grid grid-cols-3 gap-1.5">
              {EVENT_TYPES.map((t) => {
                const active = newEvent.type === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => set({ type: t.key })}
                    className="flex flex-col items-center gap-0.5 py-2 px-1 border border-solid text-[10px] font-bold transition-all duration-150 active:scale-95"
                    style={{
                      backgroundColor: active ? withAlpha(t.color, "26") : "var(--t-in0)",
                      borderColor: active ? t.color : "var(--t-mbd)",
                      color: active ? t.color : "var(--t-mtx)",
                      boxShadow: active ? `0 0 12px ${withAlpha(t.color, "44")}` : "none",
                    }}
                  >
                    <span className="text-sm leading-none">{t.icon}</span>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* When: date, all-day, start/end, repeat */}
          <div className="flex flex-col gap-2 p-3 border border-solid border-[color:var(--t-mbd)] bg-[color-mix(in_srgb,_var(--t-in0)_55%,_transparent)]">
            <Label ok={checks[1]}>When</Label>
            <input type="date" value={newEvent.date} onChange={(e) => set({ date: e.target.value })} className={`${field} pz-date`} />
            <div className="flex items-center flex-wrap gap-1.5 min-h-[22px]">
              {[
                ["Today", 0],
                ["Tomorrow", 1],
                ["Next week", 7],
              ].map(([label, off]) => {
                const d = new Date(TODAY);
                d.setDate(d.getDate() + off);
                const active = newEvent.date === formatDateForInput(d);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => quickDate(off)}
                    className={`text-[10px] font-bold py-0.5 px-2 border border-solid transition-all duration-150 active:scale-95 ${active ? "bg-[color-mix(in_srgb,_var(--t-ac)_20%,_transparent)] border-[color:var(--t-ac)] text-[color:var(--t-ac)]" : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-ac2)]"
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
              {dueHint && (
                <span className="ml-auto text-[10px] font-bold" style={{ color: left < 0 ? "var(--t-err)" : left <= 1 ? "var(--t-warn)" : "var(--t-ok2)" }}>
                  ⏳ {dueHint}
                </span>
              )}
            </div>

            <label className="flex items-center gap-2 text-[color:var(--t-tx1)] text-xs cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={newEvent.allDay}
                onChange={(e) => set({ allDay: e.target.checked })}
                className="accent-[var(--t-ac)] w-3.5 h-3.5"
              />
              All day
            </label>

            {!newEvent.allDay && (
              <div className="flex flex-col gap-1">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <input type="time" aria-label="Start time" value={newEvent.startTime} onChange={(e) => changeStart(e.target.value)} className={`${field} pz-date`} />
                  <span className="text-[color:var(--t-mtx)] text-xs">–</span>
                  <input type="time" aria-label="End time" value={newEvent.endTime} onChange={(e) => set({ endTime: e.target.value })} className={`${field} pz-date`} />
                </div>
                {timeInvalid && <span className="text-[10px] font-bold text-[color:var(--t-err)]">End time must be after the start time.</span>}
              </div>
            )}

            <select value={newEvent.repeat} onChange={(e) => set({ repeat: e.target.value })} aria-label="Repeat" className={field}>
              {repeats.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <label className="flex flex-col gap-1.5">
            <Label ok={checks[2]}>Subject</Label>
            <input value={newEvent.subject} onChange={(e) => set({ subject: e.target.value })} placeholder="e.g. CS240" className={field} />
            {newEvent.subject.trim() && (
              <span className="self-start">
                <Badge color={typeDef.color}>{newEvent.subject.trim().toUpperCase()}</Badge>
              </span>
            )}
          </label>

          {/* Google Calendar-style details */}
          <div className="flex flex-col gap-3 p-3 border border-solid border-[color:var(--t-mbd)] bg-[color-mix(in_srgb,_var(--t-in0)_55%,_transparent)]">
            <Label ok={checks[3]} optional>Details</Label>

            <label className="flex flex-col gap-1">
              <span className="text-[color:var(--t-mtx)] text-[11px]">📍 Location</span>
              <input value={newEvent.location} onChange={(e) => set({ location: e.target.value })} placeholder="Add location" className={field} />
            </label>

            <div className="flex flex-col gap-1">
              <span className="text-[color:var(--t-mtx)] text-[11px]">👥 Guests</span>
              <div className="flex gap-2">
                <input
                  value={guestInput}
                  onChange={(e) => { setGuestInput(e.target.value); setGuestError(""); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addGuest();
                    }
                  }}
                  placeholder="Add guests (email)"
                  className={field}
                />
                <button type="button" onClick={addGuest} className="shrink-0 text-[11px] font-bold px-3 border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-colors active:scale-95">
                  Add
                </button>
              </div>
              {guestError && <span className="text-[10px] font-bold text-[color:var(--t-err)]">{guestError}</span>}
              {newEvent.guests.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {newEvent.guests.map((g) => (
                    <span key={g} className="flex items-center gap-1.5 text-[10px] py-0.5 pl-2 pr-1 border border-solid border-[color:var(--t-mbd)] bg-[var(--t-in0)] text-[color:var(--t-tx1)]">
                      {g}
                      <button type="button" aria-label={`Remove ${g}`} onClick={() => set({ guests: newEvent.guests.filter((x) => x !== g) })} className="w-4 h-4 leading-none text-[color:var(--t-mtx)] hover:text-[color:var(--t-err)]">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={newEvent.meet}
              onClick={() => set({ meet: !newEvent.meet })}
              className="flex items-center justify-between gap-3 text-left"
            >
              <span className="text-[color:var(--t-tx1)] text-xs">🎥 Add Google Meet video conferencing</span>
              <span
                className="relative w-9 h-5 shrink-0 border border-solid transition-colors duration-200"
                style={{
                  backgroundColor: newEvent.meet ? "var(--t-ac)" : "var(--t-in0)",
                  borderColor: newEvent.meet ? "var(--t-ac)" : "var(--t-mbd2)",
                }}
              >
                <span
                  className="absolute top-0.5 w-3.5 h-3.5 transition-all duration-200"
                  style={{ left: newEvent.meet ? "calc(100% - 1.125rem)" : "0.125rem", backgroundColor: newEvent.meet ? "var(--t-onac)" : "var(--t-mtx)" }}
                />
              </span>
            </button>

            <label className="flex flex-col gap-1">
              <span className="text-[color:var(--t-mtx)] text-[11px]">🔔 Notification</span>
              <select value={newEvent.reminder} onChange={(e) => set({ reminder: e.target.value })} className={field}>
                {REMINDER_OPTIONS.map((o) => (
                  <option key={o.v} value={o.v}>{o.label}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[color:var(--t-mtx)] text-[11px]">📝 Description</span>
              <textarea value={newEvent.description} onChange={(e) => set({ description: e.target.value })} rows={3} placeholder="Add description" className={`${field} resize-none`} />
            </label>
          </div>

          {/* Google Calendar link */}
          <label
            className="flex items-start gap-2.5 p-3 border border-solid cursor-pointer transition-colors"
            style={{
              borderColor: newEvent.addToGoogle ? "var(--t-ac)" : "var(--t-mbd)",
              backgroundColor: newEvent.addToGoogle ? "color-mix(in srgb, var(--t-ac) 10%, transparent)" : "transparent",
            }}
          >
            <input
              type="checkbox"
              checked={newEvent.addToGoogle}
              onChange={(e) => set({ addToGoogle: e.target.checked })}
              className="mt-0.5 accent-[var(--t-ac)] w-3.5 h-3.5"
            />
            <span className="flex flex-col gap-0.5 text-left">
              <span className="text-[color:var(--t-tx0)] text-xs font-bold">Also add to Google Calendar</span>
              <span className="text-[color:var(--t-mtx)] text-[10px] leading-snug">
                Opens Google Calendar with these details pre-filled. Title, time, repeat, location, guests and description carry over; Meet links and custom notifications are not supported by Google&apos;s prefill link.
              </span>
            </span>
          </label>

          <span className="text-[color:var(--t-mtx)] text-[10px] text-left">✓ This will also land in your Study Sprint Board backlog, due on the event date.</span>

          <button
            type="submit"
            disabled={!newEvent.label.trim() || launching || timeInvalid}
            className="pz-anim relative overflow-hidden text-xs font-bold py-3 tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:brightness-110"
            style={{
              backgroundColor: complete ? "var(--t-ok)" : "var(--t-ac)",
              color: complete ? "var(--t-onok2)" : "var(--t-onac)",
              "--pz-glow": complete ? "color-mix(in srgb, var(--t-ok) 60%, transparent)" : "color-mix(in srgb, var(--t-ac) 0%, transparent)",
              animation: complete && !launching ? "pzPulse 1.8s ease-in-out infinite" : "none",
            }}
          >
            {launching ? "🚀 ADDING..." : complete ? "🚀 ADD EVENT" : "ADD EVENT"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Badge({ color, children }) {
  return (
    <span className="text-[10px] font-bold py-0.5 px-2 border border-solid shrink-0" style={{ backgroundColor: withAlpha(color, "33"), borderColor: withAlpha(color, "4D"), color }}>
      {children}
    </span>
  );
}

function Spinner({ color = "var(--t-onac)" }) {
  return (
    <svg className="animate-spin w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function FolderIcon({ className = "w-6 h-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" />
    </svg>
  );
}

const menuPanelCls =
  "absolute right-1 top-full z-30 min-w-[170px] flex flex-col py-1 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd1)]";
const menuItemCls =
  "text-left text-xs text-[color:var(--t-tx1)] py-2 px-3 hover:bg-[var(--t-bg3)] hover:text-[color:var(--t-tx0)] transition-colors";
const ghostBtnCls =
  "flex items-center gap-2 bg-[var(--t-bg2)] py-2 px-3.5 text-xs font-bold text-[color:var(--t-tx0)] border border-solid border-[color:var(--t-bd0)] hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-95";

function QuizForgePanel({
  files,
  forgeStatusMap,
  onForge,
  folders,
  activeFolder,
  setActiveFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFile,
  isDragging,
  setIsDragging,
  fileInputRef,
  onDrop,
  onFileInputChange,
  driveSyncing,
  onSyncDrive,
  showRepoLink,
  setShowRepoLink,
  repoLinkValue,
  setRepoLinkValue,
  onAddRepoLink,
  repoLinks,
}) {
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [search, setSearch] = useState("");
  const [dropTarget, setDropTarget] = useState(null);
  const [menu, setMenu] = useState(null); // { kind: "folder" | "file", id }

  const q = search.trim().toLowerCase();
  const current = folders.find((fo) => fo.id === activeFolder) || null;

  // Folders can hold other folders: walk up the parents to get a folder's full path.
  const pathOf = (id) => {
    const out = [];
    const seen = new Set();
    let cur = folders.find((fo) => fo.id === id);
    while (cur && !seen.has(cur.id)) {
      seen.add(cur.id);
      out.unshift(cur);
      cur = folders.find((fo) => fo.id === cur.parentId);
    }
    return out;
  };
  const pathLabel = (id) => (id ? pathOf(id).map((fo) => fo.name).join(" / ") : "My Library");
  const crumbs = current ? pathOf(current.id) : [];
  const fileCount = (id) => files.filter((f) => f.folderId === id).length;
  const subCount = (id) => folders.filter((fo) => fo.parentId === id).length;
  const folderSummary = (id) => {
    const s = subCount(id);
    const f = fileCount(id);
    if (!s && !f) return "Empty";
    const parts = [];
    if (s) parts.push(`${s} ${s === 1 ? "folder" : "folders"}`);
    if (f) parts.push(`${f} ${f === 1 ? "file" : "files"}`);
    return parts.join(" \u2022 ");
  };

  // Drive-style scope: root shows folders + loose files, a folder shows only its own files,
  // and searching looks through everything.
  const shown = files.filter((f) => {
    const inScope = q ? true : current ? f.folderId === current.id : !f.folderId;
    return inScope && f.name.toLowerCase().includes(q);
  });
  const visibleFolders = folders.filter((fo) => (fo.parentId || null) === (current ? current.id : null));
  const showFolders = !q;
  const atRootView = !current && !q;

  const isFileDrag = (e) => e.dataTransfer.types.includes("Files");
  const isMoveDrag = (e) => e.dataTransfer.types.includes("text/forge-file");

  // A folder tile / breadcrumb that accepts a dragged file row.
  const moveTarget = (key, folderId) => ({
    onDragOver: (e) => {
      if (isMoveDrag(e)) {
        e.preventDefault();
        setDropTarget(key);
      }
    },
    onDragLeave: () => setDropTarget((t) => (t === key ? null : t)),
    onDrop: (e) => {
      if (!isMoveDrag(e)) return;
      e.preventDefault();
      e.stopPropagation();
      setDropTarget(null);
      onMoveFile(e.dataTransfer.getData("text/forge-file"), folderId);
    },
  });

  function submitNewFolder(e) {
    e.preventDefault();
    onCreateFolder(newFolderName);
    setNewFolderName("");
    setNewFolderOpen(false);
  }

  function submitRename(e) {
    e.preventDefault();
    onRenameFolder(renamingId, renameValue);
    setRenamingId(null);
  }

  const inputCls =
    "min-w-0 flex-1 bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs py-2 px-2.5 outline-none focus:border-[color:var(--t-ac)]";

  return (
    <div className="flex flex-col self-stretch gap-5">
      {/* Library */}
      <div
        className="relative flex flex-col self-stretch bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)]"
        onDragOver={(e) => {
          if (isFileDrag(e)) {
            e.preventDefault();
            setIsDragging(true);
          }
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
        }}
        onDrop={(e) => {
          if (isFileDrag(e)) onDrop(e);
        }}
      >
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFileInputChange} />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-solid border-[color:var(--t-bd0)]">
          <div className="flex items-center gap-2 min-w-0">
            {current && (
              <button
                type="button"
                onClick={() => { setActiveFolder(current.parentId || null); setSearch(""); }}
                className="flex items-center gap-1.5 shrink-0 py-1.5 px-2.5 text-xs font-bold text-[color:var(--t-ac)] border border-solid border-[color:var(--t-ac)] hover:bg-[var(--t-ac)] hover:text-[color:var(--t-onac)] transition-colors active:scale-95"
              >
                <span aria-hidden="true">{"\u2190"}</span> Back
              </button>
            )}
            <nav aria-label="Folder path" className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm min-w-0">
              {[{ id: null, name: "My Library" }, ...crumbs].map((c, i, arr) => {
                const isLast = i === arr.length - 1;
                const key = `crumb-${c.id ?? "root"}`;
                return (
                  <React.Fragment key={key}>
                    {i > 0 && <span className="text-[color:var(--t-tx2)]" aria-hidden="true">/</span>}
                    {isLast ? (
                      <span className="py-1 px-2 font-bold text-[color:var(--t-tx0)] truncate">{c.name}</span>
                    ) : (
                      <button
                        type="button"
                        title={`Go to ${c.name}`}
                        onClick={() => { setActiveFolder(c.id); setSearch(""); }}
                        {...moveTarget(key, c.id)}
                        className={`py-1 px-2 font-bold underline underline-offset-4 decoration-dotted transition-colors ${dropTarget === key
                          ? "bg-[color-mix(in_srgb,_var(--t-ac)_20%,_transparent)] text-[color:var(--t-ac)]"
                          : "text-[color:var(--t-ac)] hover:bg-[color-mix(in_srgb,_var(--t-ac)_12%,_transparent)]"
                          }`}
                      >
                        {c.name}
                      </button>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files"
              aria-label="Search files"
              className={`${inputCls} !flex-none w-36`}
            />
            <button type="button" onClick={() => setNewFolderOpen(true)} className={ghostBtnCls}>
              <span className="text-[color:var(--t-ac)] text-sm leading-none">+</span> New folder
            </button>
            <button type="button" onClick={onSyncDrive} className={ghostBtnCls}>
              {driveSyncing ? <Spinner color="var(--t-tx0)" /> : <img src={IMG.qfDrive} className="w-[14px] h-[14px] object-fill" />}
              {driveSyncing ? "Syncing\u2026" : "Sync Drive"}
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-[var(--t-ac)] py-2 px-4 hover:opacity-90 transition-all duration-150 active:scale-95"
            >
              <img src={IMG.qfUpload} className="w-3 h-[14px] object-fill" />
              <span className="text-[color:var(--t-onac)] text-xs font-bold">Upload</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-4 min-h-[260px]">
          {/* Folders */}
          {showFolders && (visibleFolders.length > 0 || newFolderOpen) && (
            <section aria-label="Folders" className="flex flex-col gap-2">
              <span className="text-[color:var(--t-tx2)] text-[10px] font-bold tracking-wider">{current ? "FOLDERS IN THIS FOLDER" : "FOLDERS"}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {newFolderOpen && (
                  <form onSubmit={submitNewFolder} className="flex items-center gap-2 p-3 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-ac)]">
                    <FolderIcon className="w-6 h-6 shrink-0 text-[color:var(--t-ac)]" />
                    <input
                      autoFocus
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && (setNewFolderOpen(false), setNewFolderName(""))}
                      onBlur={() => { if (!newFolderName.trim()) setNewFolderOpen(false); }}
                      placeholder={current ? "Untitled subfolder" : "Untitled folder"}
                      maxLength={40}
                      className={inputCls}
                    />
                  </form>
                )}
                {visibleFolders.map((fo) => (
                  <div key={fo.id} className="relative" {...moveTarget(fo.id, fo.id)}>
                    {renamingId === fo.id ? (
                      <form onSubmit={submitRename} className="flex items-center gap-2 p-3 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-ac)]">
                        <FolderIcon className="w-6 h-6 shrink-0 text-[color:var(--t-ac)]" />
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Escape" && setRenamingId(null)}
                          onBlur={() => setRenamingId(null)}
                          maxLength={40}
                          className={inputCls}
                        />
                      </form>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setActiveFolder(fo.id)}
                          className={`w-full flex items-center gap-3 p-3 pr-9 text-left border border-solid transition-all duration-150 ${dropTarget === fo.id
                            ? "bg-[color-mix(in_srgb,_var(--t-ac)_16%,_transparent)] border-[color:var(--t-ac)] scale-[1.02]"
                            : "bg-[var(--t-bg2)] border-[color:var(--t-bd0)] hover:border-[color:var(--t-bd1)]"
                            }`}
                        >
                          <FolderIcon className="w-6 h-6 shrink-0 text-[color:var(--t-ac)]" />
                          <span className="flex flex-col min-w-0">
                            <span className="text-[color:var(--t-tx0)] text-sm font-bold truncate">{fo.name}</span>
                            <span className="text-[color:var(--t-tx2)] text-[11px] truncate">{folderSummary(fo.id)}</span>
                          </span>
                        </button>
                        <button
                          type="button"
                          aria-label={`Options for ${fo.name}`}
                          onClick={() => setMenu(menu?.id === fo.id ? null : { kind: "folder", id: fo.id })}
                          className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 text-[color:var(--t-tx2)] hover:text-[color:var(--t-tx0)] text-base leading-none"
                        >
                          {"\u22EE"}
                        </button>
                        {menu?.kind === "folder" && menu.id === fo.id && (
                          <>
                            <button type="button" aria-label="Close menu" className="fixed inset-0 z-20 cursor-default" onClick={() => setMenu(null)} />
                            <div className={menuPanelCls} style={{ top: "calc(100% - 8px)" }}>
                              <button type="button" className={menuItemCls} onClick={() => { setActiveFolder(fo.id); setMenu(null); }}>Open</button>
                              <button type="button" className={menuItemCls} onClick={() => { setRenameValue(fo.name); setRenamingId(fo.id); setMenu(null); }}>Rename</button>
                              <button type="button" className={`${menuItemCls} !text-[color:var(--t-err)]`} onClick={() => { onDeleteFolder(fo.id); setMenu(null); }}>
                                Delete folder
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Files */}
          <section aria-label="Files" className="flex flex-col gap-2">
            {(shown.length > 0 || atRootView) && (
              <span className="text-[color:var(--t-tx2)] text-[10px] font-bold tracking-wider">
                {q ? "SEARCH RESULTS" : "FILES"}
              </span>
            )}

            {shown.length === 0 && (q || !current || (visibleFolders.length === 0 && !newFolderOpen)) && (
              <div className="flex flex-col items-center justify-center gap-1 py-10 text-center border border-dashed border-[color:var(--t-bd1)]">
                <span className="text-[color:var(--t-tx0)] text-sm font-bold">
                  {q ? "No files match your search" : current ? "This folder is empty" : "No loose files"}
                </span>
                <span className="text-[color:var(--t-tx2)] text-xs max-w-xs">
                  {q
                    ? "Try a different name."
                    : current
                      ? "Drag files here, upload while this folder is open, or create a folder inside it."
                      : "Drop files anywhere in this panel, or press Upload."}
                </span>
              </div>
            )}

            {shown.map((file) => {
              const forgeState = forgeStatusMap[file.id] || "idle";
              const indexing = file.status !== "Indexed";
              const moveOptions = [
                ...(file.folderId ? [{ id: null, name: "My Library" }] : []),
                ...folders.filter((fo) => fo.id !== file.folderId).map((fo) => ({ id: fo.id, name: pathLabel(fo.id) })),
              ];
              return (
                <div
                  key={file.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/forge-file", file.id)}
                  className="relative flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-3 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] hover:border-[color:var(--t-bd1)] cursor-grab active:cursor-grabbing transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img src={file.icon} className="w-9 h-9 object-fill shrink-0" draggable={false} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[color:var(--t-tx0)] text-sm font-bold truncate">{file.name}</span>
                      <span className="text-[color:var(--t-tx2)] text-[11px] truncate">
                        {file.size} {"\u2022"} {file.chunks} chunks {"\u2022"}{" "}
                        <span className={indexing ? "text-[color:var(--t-warn)]" : ""}>{indexing ? "Indexing\u2026" : "Ready"}</span>
                        {q && file.folderId && <> {"\u2022"} in {pathLabel(file.folderId)}</>}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      disabled={indexing}
                      onClick={() => onForge(file.id)}
                      className={`flex items-center py-2 px-3.5 gap-1.5 transition-all duration-150 active:scale-95 ${indexing ? "bg-[var(--t-bd0)] cursor-not-allowed opacity-60" : "bg-[var(--t-ac)] hover:opacity-90"
                        }`}
                    >
                      {forgeState === "forging" ? <Spinner /> : <img src={IMG.qfForge} className="w-[13px] h-[13px] object-fill" draggable={false} />}
                      <span className="text-[color:var(--t-onac)] text-xs font-bold whitespace-nowrap">Forge Quiz</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Options for ${file.name}`}
                      onClick={() => setMenu(menu?.id === file.id ? null : { kind: "file", id: file.id })}
                      className="w-7 h-7 text-[color:var(--t-tx2)] hover:text-[color:var(--t-tx0)] text-base leading-none"
                    >
                      {"\u22EE"}
                    </button>
                  </div>
                  {menu?.kind === "file" && menu.id === file.id && (
                    <>
                      <button type="button" aria-label="Close menu" className="fixed inset-0 z-20 cursor-default" onClick={() => setMenu(null)} />
                      <div className={menuPanelCls} style={{ top: "calc(100% - 6px)" }}>
                        <span className="text-[color:var(--t-tx2)] text-[10px] font-bold tracking-wider py-1.5 px-3">MOVE TO</span>
                        {moveOptions.length === 0 && <span className="text-[color:var(--t-tx2)] text-xs py-2 px-3">Create a folder first</span>}
                        {moveOptions.map((fo) => (
                          <button key={fo.id ?? "root"} type="button" className={menuItemCls} onClick={() => { onMoveFile(file.id, fo.id); setMenu(null); }}>
                            {fo.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {showFolders && visibleFolders.length > 0 && shown.length > 0 && (
              <p className="text-[color:var(--t-tx2)] text-[11px] pt-1">Tip: drag a file onto a folder to file it away.</p>
            )}
          </section>

          {/* Linked sources */}
          {(repoLinks.length > 0 || atRootView) && (
            <section aria-label="Linked sources" className="flex flex-col gap-2 pt-1 border-t border-solid border-[color:var(--t-bd0)]">
              {repoLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2.5 py-1.5">
                  <img src={IMG.qfLink} className="w-4 h-4 object-fill shrink-0" />
                  <span className="text-[color:var(--t-tx1)] text-xs truncate">{link}</span>
                </div>
              ))}
              {showRepoLink ? (
                <form onSubmit={onAddRepoLink} className="flex flex-wrap items-center gap-2 pt-1">
                  <input
                    autoFocus
                    value={repoLinkValue}
                    onChange={(e) => setRepoLinkValue(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className={inputCls}
                  />
                  <button type="submit" className="bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2 px-4 hover:opacity-90 active:scale-95 transition-all duration-150">Link</button>
                  <button type="button" onClick={() => setShowRepoLink(false)} className="text-[color:var(--t-tx2)] text-xs py-2 px-2 hover:text-[color:var(--t-tx1)]">Cancel</button>
                </form>
              ) : (
                <button type="button" onClick={() => setShowRepoLink(true)} className="self-start flex items-center gap-2 text-[color:var(--t-tx1)] text-xs hover:text-[color:var(--t-ac)] transition-colors py-1">
                  <img src={IMG.qfLink} className="w-[14px] h-[14px] object-fill" />
                  Link a syllabus repository or notes
                </button>
              )}
            </section>
          )}
        </div>

        {/* Drop overlay for files dragged in from the computer */}
        {isDragging && (
          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-[color-mix(in_srgb,_var(--t-ac)_14%,_var(--t-bg1))] border-2 border-dashed border-[color:var(--t-ac)]">
            <span className="text-[color:var(--t-ac)] text-sm font-bold">Drop to upload to {current?.name || "My Library"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SprintCard({ card, colId, index, isDone, isDragged, isDropTarget, onDragStart, onDragOver, onDrop, onDragEnd, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editBadge, setEditBadge] = useState(card.subject || "");

  const badgeColor = BADGE_COLOR_BY_COLUMN[colId] || "var(--t-tx1)";
  const dueText = card.dueDate ? dueTextFor(card.dueDate) : card.due || card.meta;
  const urgent = !isDone && isQuestUrgent(dueText);

  function saveEdit() {
    onEdit(colId, card.id, { title: editTitle.trim() || card.title, subject: editBadge.trim().toUpperCase() });
    setEditing(false);
  }

  const controls = !editing && (
    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEditTitle(card.title);
          setEditBadge(card.subject || "");
          setEditing(true);
        }}
        aria-label="Edit quest"
        className="text-[color:var(--t-tx1)] text-[11px] hover:text-[color:var(--t-ac2)] transition-colors"
      >
        ✎
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(colId, card.id);
        }}
        aria-label="Delete quest"
        className="text-[color:var(--t-err)] text-xs font-bold hover:opacity-75 transition-opacity"
      >
        ×
      </button>
    </div>
  );

  if (isDone) {
    return (
      <div
        draggable={!editing}
        onDragStart={(e) => onDragStart(e, colId, card.id)}
        onDragOver={(e) => onDragOver(e, colId, index)}
        onDrop={(e) => onDrop(e, colId)}
        onDragEnd={onDragEnd}
        className={`group flex justify-between items-center gap-3 self-stretch bg-[var(--t-bg3)] p-2 border border-solid border-transparent cursor-grab active:cursor-grabbing transition-all duration-150 hover:border-[color:color-mix(in_srgb,_var(--t-ok2)_30%,_transparent)] ${isDragged ? "opacity-40 scale-95" : "opacity-100"
          } ${isDropTarget ? "ring-1 ring-[color:var(--t-ok2)]" : ""}`}
      >
        <div className="flex items-center gap-[7px] min-w-0 flex-1">
          <img src={IMG.check} className="w-[15px] h-[15px] object-fill shrink-0" />
          {editing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-[13px] py-1 px-2 outline-none focus:border-[color:var(--t-ok2)] flex-1 min-w-0"
            />
          ) : (
            <span className="text-[color:var(--t-tx1)] text-[13px] line-through truncate">{card.title}</span>
          )}
        </div>
        {editing ? (
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={saveEdit} className="text-[color:var(--t-ok2)] text-[10px] font-bold">Save</button>
            <button onClick={() => setEditing(false)} className="text-[color:var(--t-tx2)] text-[10px]">Cancel</button>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            {card.subject && (
              <span className="text-[9px] font-bold" style={{ color: badgeColor }}>
                {card.subject}
              </span>
            )}
            <span className="text-[color:var(--t-ok2)] text-[10px] font-bold">+{card.xp ?? 50} XP</span>
            {controls}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      draggable={!editing}
      onDragStart={(e) => onDragStart(e, colId, card.id)}
      onDragOver={(e) => onDragOver(e, colId, index)}
      onDrop={(e) => onDrop(e, colId)}
      onDragEnd={onDragEnd}
      className={`group flex flex-col self-stretch min-w-0 bg-[var(--t-bg3)] p-3 gap-2 border border-solid border-transparent cursor-grab active:cursor-grabbing transition-all duration-150 hover:-translate-y-0.5 hover:border-[color:color-mix(in_srgb,_var(--t-ac2)_30%,_transparent)] ${urgent ? "border-l-4 border-l-[color:var(--t-err)]" : ""} ${isDragged ? "opacity-40 scale-95" : "opacity-100"
        } ${isDropTarget ? "ring-1 ring-[color:var(--t-ac2)]" : ""}`}
      style={{ boxShadow: urgent ? "0px 0px 10px color-mix(in srgb, var(--t-err) 30%, transparent)" : "0px 1px 2px #0000000D" }}
    >
      <div className="flex items-start justify-between gap-2 self-stretch">
        {editing ? (
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-sm py-1 px-2 outline-none focus:border-[color:var(--t-ac2)] flex-1 min-w-0"
          />
        ) : (
          <span className="text-[color:var(--t-tx0)] text-sm truncate flex-1 min-w-0" title={card.title}>{card.title}</span>
        )}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex flex-col shrink-0 items-start py-0.5 px-2 border border-solid"
            style={{ backgroundColor: withAlpha(badgeColor, "33"), borderColor: withAlpha(badgeColor, "4D") }}
          >
            {editing ? (
              <input
                value={editBadge}
                onChange={(e) => setEditBadge(e.target.value)}
                placeholder="BADGE"
                className="bg-transparent text-[10px] font-bold outline-none w-16"
                style={{ color: badgeColor }}
              />
            ) : (
              <span className="text-[10px] font-bold whitespace-nowrap max-w-[84px] truncate" style={{ color: badgeColor }}>
                {card.subject || "NEW QUEST"}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 self-stretch">
        <span className="text-[10px] font-bold shrink-0" style={{ color: urgent ? "var(--t-err)" : card.metaColor || "var(--t-tx2)" }}>
          {dueText}
        </span>
        {editing ? (
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={saveEdit} className="text-[color:var(--t-ok2)] text-[10px] font-bold">Save</button>
            <button onClick={() => setEditing(false)} className="text-[color:var(--t-tx2)] text-[10px]">Cancel</button>
          </div>
        ) : (
          controls
        )}
      </div>
      {typeof card.progress === "number" ? (
        <>
          <div className="self-stretch bg-[var(--t-bg0)] mt-1 mb-1">
            <div className="bg-[var(--t-ac2)] h-1.5 transition-all duration-500" style={{ width: `${card.progress}%` }} />
          </div>
          <div className="flex justify-between items-center self-stretch">
            <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">{card.due}</span>
            <span className="text-[color:var(--t-ok2)] text-[10px] font-bold">+{card.xp} XP</span>
          </div>
        </>
      ) : (
        card.desc && <span className="text-[color:var(--t-tx1)] text-xs break-words">{card.desc}</span>
      )}
    </div>
  );
}

function SprintBoardPanel({
  columns,
  view,
  setView,
  subjectFilter,
  setSubjectFilter,
  filterOpen,
  setFilterOpen,
  draggedCard,
  dragOverInfo,
  onCardDragStart,
  onCardDragOver,
  onColumnDragOver,
  onCardDrop,
  onDragEnd,
  addingColumnId,
  setAddingColumnId,
  addingText,
  setAddingText,
  addingBadge,
  setAddingBadge,
  onSubmitAddCard,
  onDeleteCard,
  onEditCard,
  onMoveCard,
  autoIngesting,
  onAutoIngest,
  syncingCalendar,
  onSyncCalendar,
  showSprintLogs,
  setShowSprintLogs,
  showQuickTask,
  setShowQuickTask,
  quickTaskText,
  setQuickTaskText,
  quickTaskBadge,
  setQuickTaskBadge,
  onSubmitQuickTask,
  addingDue,
  setAddingDue,
  quickTaskDue,
  setQuickTaskDue,
  onClearAll,
}) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [flatEditingId, setFlatEditingId] = useState(null);
  const [flatEditText, setFlatEditText] = useState("");
  const subjects = ["ALL SUBJECTS", ...new Set(columns.flatMap((c) => c.cards.map((cd) => cd.subject).filter(Boolean)))];
  const filteredColumns = columns.map((c) => ({
    ...c,
    cards: c.cards.filter((cd) => subjectFilter === "ALL SUBJECTS" || cd.subject === subjectFilter),
  }));
  const totalCards = columns.reduce((sum, c) => sum + c.cards.length, 0);
  const doneCount = columns.find((c) => c.id === "done")?.cards.length || 0;
  const progressPct = totalCards ? Math.round((doneCount / totalCards) * 100) : 0;
  const doneColumn = columns.find((c) => c.id === "done");
  const allowAdd = (colId) => colId !== "done";

  return (
    <div className="flex flex-col self-stretch gap-4">
      {/* Sprint status bar */}
      <div
        className="flex flex-wrap justify-between items-center gap-4 self-stretch bg-[var(--t-bg3)] p-4"
        style={{ boxShadow: "0px 1px 2px #0000000D" }}
      >
        <div className="flex flex-wrap shrink-0 items-center gap-x-6 gap-y-2">
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">SPRINT:</span>
            <span className="text-[color:var(--t-tx0)] text-lg font-bold">Sprint 03</span>
            <span className="text-[color:var(--t-ok2)] text-[10px] font-bold">(Week 4 of 8)</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">FOCUS:</span>
            <span className="text-[color:var(--t-tx1)] text-[13px]">Midterm Boss Raids</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">PROGRESS:</span>
          <div className="w-24 sm:w-[120px] h-2 bg-[var(--t-bg0)]" style={{ boxShadow: "0px 2px 4px #0000000D" }}>
            <div className="bg-[var(--t-ok2)] h-2 transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[color:var(--t-ok2)] text-[10px] font-bold">
            {doneCount}/{totalCards}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-[9px]">
          <button
            onClick={() => setShowSprintLogs(true)}
            className="flex shrink-0 items-center bg-[var(--t-bg4)] py-2 px-4 gap-2 hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            <img src={IMG.sbLogs} className="w-[13px] h-[13px] object-fill" />
            <span className="text-[color:var(--t-tx0)] text-xs font-bold">SPRINT LOGS</span>
          </button>
          <button
            onClick={onAutoIngest}
            className="flex shrink-0 items-center bg-[var(--t-ac)] py-2 px-4 gap-[7px] hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            {autoIngesting ? <Spinner /> : <img src={IMG.sbIngest} className="w-3 h-[15px] object-fill" />}
            <span className="text-[color:var(--t-onac)] text-xs font-bold">{autoIngesting ? "Ingesting…" : "AUTO-INGEST"}</span>
          </button>
        </div>
      </div>

      {/* Filter / group-by row */}
      <div className="flex flex-wrap items-center justify-between gap-3 self-stretch bg-[var(--t-bg0)] p-2" style={{ boxShadow: "0px 2px 4px #0000000D" }}>
        <div className="relative shrink-0">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="flex shrink-0 items-center bg-[var(--t-bg3)] py-1.5 px-2 gap-2 hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            <img src={IMG.sbFilterIcon} className="w-2.5 h-2.5 object-fill" />
            <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">FILTER:</span>
            <span className="text-[color:var(--t-tx0)] text-[10px] font-bold">{subjectFilter}</span>
          </button>
          {filterOpen && (
            <div className="absolute left-0 mt-1 z-40 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] min-w-[160px]">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSubjectFilter(s);
                    setFilterOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-[var(--t-bg3)] ${subjectFilter === s ? "text-[color:var(--t-ac2)]" : "text-[color:var(--t-tx1)]"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setView((v) => (v === "kanban" ? "list" : "kanban"))}
            className="flex shrink-0 items-center bg-[var(--t-bg3)] py-1.5 px-2 hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            <img src={IMG.sbGroupIcon} className="w-3 h-3 mr-[7px] object-fill" />
            <span className="text-[color:var(--t-tx2)] text-[10px] font-bold mr-[9px]">GROUP BY:</span>
            <span className="text-[color:var(--t-tx0)] text-[10px] font-bold">
              {view === "kanban" ? "STATUS (KANBAN)" : "FLAT LIST"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            disabled={totalCards === 0}
            className="flex shrink-0 items-center gap-1.5 py-1.5 px-3 text-[10px] font-bold tracking-wider border border-solid border-[color:var(--t-err)] text-[color:var(--t-err)] hover:bg-[var(--t-err)] hover:text-[color:var(--t-onerr)] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[color:var(--t-err)] transition-colors duration-150 active:scale-95"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            CLEAR ALL
          </button>
        </div>
      </div>

      {/* Board */}
      {view === "kanban" ? (
        <div className="grid self-stretch gap-3 pb-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
          {filteredColumns.map((col) => (
            <div
              key={col.id}
              onDragOver={(e) => onColumnDragOver(e, col.id)}
              onDrop={(e) => onCardDrop(e, col.id)}
              className="flex min-w-0 flex-col bg-[var(--t-bg2)] p-2 gap-2"
              style={{ boxShadow: "0px 1px 2px #0000000D" }}
            >
              <div className="flex justify-between items-center gap-2 self-stretch bg-[var(--t-bg0)] p-2" style={{ boxShadow: "0px 2px 4px #0000000D" }}>
                <div className="flex min-w-0 items-center gap-2">
                  <div className="w-3 h-3 shrink-0" style={{ backgroundColor: col.dot }} />
                  <span className="text-[color:var(--t-tx0)] text-[11px] font-bold leading-tight break-words min-w-0">{col.title}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start bg-[var(--t-bg3)] py-0.5 px-2">
                  <span className="text-[10px] font-bold" style={{ color: col.dot }}>
                    {col.cards.length}
                  </span>
                </div>
              </div>

              <div className="flex flex-col self-stretch gap-2 flex-1 min-h-[40px]">
                {col.cards.map((card, idx) => (
                  <SprintCard
                    key={card.id}
                    card={card}
                    colId={col.id}
                    index={idx}
                    isDone={col.id === "done"}
                    isDragged={draggedCard?.cardId === card.id}
                    isDropTarget={dragOverInfo?.colId === col.id && dragOverInfo?.index === idx}
                    onDragStart={onCardDragStart}
                    onDragOver={onCardDragOver}
                    onDrop={onCardDrop}
                    onDragEnd={onDragEnd}
                    onDelete={onDeleteCard}
                    onEdit={onEditCard}
                  />
                ))}

                {allowAdd(col.id) &&
                  (addingColumnId === col.id ? (
                    <form onSubmit={onSubmitAddCard} className="flex flex-col gap-1.5">
                      <input
                        autoFocus
                        value={addingText}
                        onChange={(e) => setAddingText(e.target.value)}
                        placeholder="New quest title…"
                        className="bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs py-2 px-2 outline-none focus:border-[color:var(--t-ac2)]"
                      />
                      <input
                        value={addingBadge}
                        onChange={(e) => setAddingBadge(e.target.value)}
                        placeholder="Badge / subject (e.g. CS240)"
                        className="bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs py-2 px-2 outline-none focus:border-[color:var(--t-ac2)]"
                      />
                      <label className="flex flex-col gap-1">
                        <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">DUE DATE</span>
                        <input
                          type="date"
                          required
                          value={addingDue}
                          onChange={(e) => setAddingDue(e.target.value)}
                          className="pz-date bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs py-2 px-2 outline-none focus:border-[color:var(--t-ac2)]"
                        />
                      </label>
                      <span className="text-[color:var(--t-tx2)] text-[10px]">
                        Also added to your Study Calendar on this date.
                      </span>
                      <span className="text-[color:var(--t-tx2)] text-[10px]">
                        Badge color is set by this column — {col.title}.
                      </span>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-[var(--t-ac2)] text-[color:var(--t-onac)] text-[10px] font-bold py-1.5 hover:opacity-90 transition-all duration-150 active:scale-95">
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingColumnId(null);
                            setAddingBadge("");
                          }}
                          className="text-[color:var(--t-tx2)] text-[10px] px-2 hover:text-[color:var(--t-tx1)]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => {
                        setAddingColumnId(col.id);
                        setAddingText("");
                        setAddingBadge("");
                        setAddingDue(formatDateForInput(TODAY));
                      }}
                      className="flex justify-center items-center self-stretch bg-[var(--t-bg0)] py-2 gap-1.5 hover:opacity-90 transition-all duration-150 active:scale-[0.98]"
                    >
                      <img src={IMG.sbAddQuest} className="w-[9px] h-[9px] object-fill" />
                      <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">+ New Quest</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col self-stretch gap-2">
          {filteredColumns.flatMap((col) =>
            col.cards.map((card, idx) => {
              const badgeColor = BADGE_COLOR_BY_COLUMN[col.id] || col.dot;
              const isEditing = flatEditingId === card.id;
              return (
                <div
                  key={card.id}
                  className="flex flex-wrap items-center justify-between gap-2 bg-[var(--t-bg2)] p-3 border-l-2"
                  style={{ borderColor: badgeColor }}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-[color:var(--t-tx2)] shrink-0">{col.title}</span>
                    {isEditing ? (
                      <input
                        autoFocus
                        value={flatEditText}
                        onChange={(e) => setFlatEditText(e.target.value)}
                        className="bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-sm py-1 px-2 outline-none focus:border-[color:var(--t-ac2)] flex-1 min-w-0"
                      />
                    ) : (
                      <span
                        className={`text-sm truncate ${col.id === "done" ? "line-through" : ""}`}
                        style={{ color: badgeColor }}
                      >
                        {card.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {card.dueDate && (
                      <span
                        className="text-[10px] font-bold shrink-0"
                        style={{ color: isQuestUrgent(dueTextFor(card.dueDate)) ? "var(--t-err)" : "var(--t-tx2)" }}
                      >
                        {dueTextFor(card.dueDate)}
                      </span>
                    )}
                    <span className="text-[color:var(--t-ok2)] text-[10px] font-bold shrink-0">
                      {card.xp ? `+${card.xp} XP` : card.subject}
                    </span>
                    {!isEditing && (
                      <select
                        value={col.id}
                        onChange={(e) => onMoveCard(card.id, col.id, e.target.value)}
                        className="bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] text-[10px] text-[color:var(--t-tx1)] py-1 px-1 outline-none focus:border-[color:var(--t-ac2)]"
                      >
                        {SPRINT_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            onEditCard(col.id, card.id, { title: flatEditText.trim() || card.title });
                            setFlatEditingId(null);
                          }}
                          className="text-[color:var(--t-ok2)] text-[10px] font-bold px-1"
                        >
                          Save
                        </button>
                        <button onClick={() => setFlatEditingId(null)} className="text-[color:var(--t-tx2)] text-[10px] px-1">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setFlatEditingId(card.id);
                          setFlatEditText(card.title);
                        }}
                        aria-label="Edit quest"
                        className="text-[color:var(--t-tx1)] text-[11px] hover:text-[color:var(--t-ac2)] px-1 transition-colors"
                      >
                        ✎
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteCard(col.id, card.id)}
                      aria-label="Delete quest"
                      className="text-[color:var(--t-err)] text-xs font-bold px-1 hover:opacity-75 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Bottom summary bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 self-stretch bg-[var(--t-bg2)] p-4">
        <div className="flex flex-wrap shrink-0 items-center gap-x-6 gap-y-2">
          <div className="flex shrink-0 items-center gap-1.5">
            <img src={IMG.sbBurndown} className="w-[13px] h-2 object-fill" />
            <span className="text-[color:var(--t-tx0)] text-[10px] font-bold">Burndown: +18% Ahead</span>
          </div>
          <div className="flex shrink-0 items-center gap-[7px]">
            <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">Level 18</span>
            <span className="text-[color:var(--t-ok2)] text-[10px] font-bold">82%</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-[9px]">
          <button
            onClick={() => { setQuickTaskDue(formatDateForInput(TODAY)); setShowQuickTask(true); }}
            className="flex flex-col shrink-0 items-start bg-[var(--t-bg3)] py-1 px-2 hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            <span className="text-[color:var(--t-tx0)] text-[10px] font-bold">+ Quick Task</span>
          </button>
          <button
            onClick={onSyncCalendar}
            className="flex shrink-0 items-center gap-1.5 bg-[var(--t-bg3)] py-1 px-2 hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            {syncingCalendar && <Spinner color="var(--t-tx0)" />}
            <span className="text-[color:var(--t-tx0)] text-[10px] font-bold">
              {syncingCalendar ? "Syncing…" : "Sync Calendar"}
            </span>
          </button>
        </div>
      </div>

      {/* Clear-all confirmation */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmClear(false)} />
          <div className="relative bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] border-t-[3px] border-t-[color:var(--t-err)] p-5 w-full max-w-sm flex flex-col gap-3">
            <span className="text-[color:var(--t-tx0)] text-sm font-bold">Clear all quests?</span>
            <p className="text-[color:var(--t-tx1)] text-xs leading-relaxed">
              This removes all {totalCards} {totalCards === 1 ? "quest" : "quests"} from every column, including completed ones, and any due dates they added to your Study Calendar. This can&apos;t be undone.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="flex-1 text-xs font-bold py-2 bg-[var(--t-bg3)] text-[color:var(--t-tx0)] hover:opacity-90 transition-all duration-150 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { onClearAll(); setConfirmClear(false); }}
                className="flex-1 text-xs font-bold py-2 bg-[var(--t-err)] text-[color:var(--t-onerr)] hover:opacity-90 transition-all duration-150 active:scale-95"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sprint logs modal */}
      {showSprintLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowSprintLogs(false)} />
          <div className="relative bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] p-5 w-full max-w-sm flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[color:var(--t-tx0)] text-sm font-bold">SPRINT LOGS</span>
              <button onClick={() => setShowSprintLogs(false)}>
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
            {(doneColumn?.cards || []).map((c) => (
              <div key={c.id} className="flex justify-between items-center gap-2 border-b border-solid border-[color:var(--t-bd0)] pb-2">
                <span className="text-[color:var(--t-tx1)] text-xs">{c.title}</span>
                <span className="text-[color:var(--t-ok2)] text-[10px] font-bold shrink-0">+{c.xp ?? 50} XP</span>
              </div>
            ))}
            {!doneColumn?.cards.length && <p className="text-[color:var(--t-tx2)] text-xs">No conquered quests yet.</p>}
          </div>
        </div>
      )}

      {/* Quick task modal */}
      {showQuickTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowQuickTask(false)} />
          <form
            onSubmit={onSubmitQuickTask}
            className="relative bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] p-5 w-full max-w-sm flex flex-col gap-3"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[color:var(--t-tx0)] text-sm font-bold">QUICK TASK</span>
              <button type="button" onClick={() => setShowQuickTask(false)}>
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
            <input
              autoFocus
              value={quickTaskText}
              onChange={(e) => setQuickTaskText(e.target.value)}
              placeholder="e.g. Skim Chapter 6 notes"
              className="bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac2)]"
            />
            <input
              value={quickTaskBadge}
              onChange={(e) => setQuickTaskBadge(e.target.value)}
              placeholder="Badge / subject (optional, e.g. CS240)"
              className="bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac2)]"
            />
            <label className="flex flex-col gap-1">
              <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">DUE DATE</span>
              <input
                type="date"
                required
                value={quickTaskDue}
                onChange={(e) => setQuickTaskDue(e.target.value)}
                className="pz-date bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac2)]"
              />
            </label>
            <span className="text-[color:var(--t-tx2)] text-[10px]">Also added to your Study Calendar on this date.</span>
            <button
              type="submit"
              className="bg-[var(--t-ac2)] text-[color:var(--t-onac)] text-xs font-bold py-2 hover:opacity-90 transition-all duration-150 active:scale-95"
            >
              Add to Backlog &amp; Calendar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function PlaceholderCard({ title, icon, text }) {
  return (
    <div
      className="flex flex-col self-stretch bg-[var(--t-bg1)] p-6 sm:p-[21px] gap-3 border border-solid border-[color:var(--t-bd0)]"
      style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
    >
      <div className="flex items-center gap-2.5">
        <img src={icon} className="w-[15px] h-4 object-fill" />
        <span className="text-[color:var(--t-tx0)] text-lg font-bold">{title}</span>
      </div>
      <p className="text-[color:var(--t-tx2)] text-sm max-w-md">{text}</p>
    </div>
  );
}

function ComingSoon({ nav, onBack }) {
  return (
    <div
      className="flex flex-col items-start self-stretch bg-[var(--t-bg1)] p-6 sm:p-[25px] gap-3 border border-solid border-[color:var(--t-bd0)] mt-6"
      style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
    >
      <span className="text-[color:var(--t-tx0)] text-xl font-bold">{nav}</span>
      <p className="text-[color:var(--t-tx2)] text-sm max-w-md">
        This section isn't built out in the mockup yet. Head back to Personalized to see the Study Hub.
      </p>
      <button
        onClick={onBack}
        className="bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-ac)] text-xs font-bold py-2 px-4 hover:border-[color:var(--t-ac)] transition-colors"
      >
        BACK TO STUDY HUB
      </button>
    </div>
  );
}
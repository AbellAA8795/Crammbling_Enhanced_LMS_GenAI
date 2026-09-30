import React, { useState, useEffect, useRef, useMemo } from "react";
import Chatbot from "./chatbot";
import GroupCollab from "./group_collab";
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
  review: { dot: "#2CD4D9", bg: "#2CD4D9", text: "#003738" },
  exam: { dot: "#FF6B6B", bg: "#FF6B6B", text: "#EDE0DC" },
  group: { dot: "#82F040", bg: "#82F040", text: "#153A00" },
};

// Badge color is driven by the column/status a quest sits in, so a quest's
// badge automatically re-colors itself as it's moved through the sprint.
const BADGE_COLOR_BY_COLUMN = {
  backlog: "#FF6B6B", // red
  active: "#58F1F6", // cyan (unchanged)
  review: "#FEDA44", // yellow
  done: "#A0D673", // green
};

const SPRINT_STATUS_OPTIONS = [
  { id: "backlog", label: "Backlog" },
  { id: "active", label: "Active Raid" },
  { id: "review", label: "Boss Checkpoint" },
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
    subjectColor: "#2CD4D9",
    meta: "Tomorrow • 14:00 (45 mins) • Big-O Analysis",
    status: "SCHEDULED",
    statusColor: "#2CD4D9",
  },
  {
    id: "u2",
    img: IMG.ev2,
    chk: IMG.ev2chk,
    title: "Discrete Math Midterm",
    subject: "MATH210",
    subjectColor: "#FF6B6B",
    meta: "Fri, Mar 20 • 10:00 • Hall B (80 min instance)",
    status: "URGENT",
    statusColor: "#FF6B6B",
  },
  {
    id: "u3",
    img: IMG.ev3,
    chk: IMG.ev3chk,
    title: "Graph Traversal Group Sprint",
    subject: "CS240",
    subjectColor: "#82F040",
    meta: "Mon, Mar 23 • 16:30 • Voice Room #4",
    status: "GROUP",
    statusColor: "#82F040",
  },
];

const NAV_ITEMS = [
  { key: "dashboard", label: "DASHBOARD", icon: IMG.dashboard, iconClass: "w-[18px] h-[15px]" },
  { key: "chatbot", label: "CHATBOT", icon: IMG.chatbot, iconClass: "w-[18px] h-[15px]" },
  { key: "group", label: "GROUP COLLAB", icon: IMG.group, iconClass: "w-5 h-2.5" },
  { key: "quiz", label: "QUIZ ARENA", icon: IMG.quiz, iconClass: "w-4 h-4" },
  { key: "personalized", label: "PERSONALIZED", icon: IMG.personalized, iconClass: "w-[18px] h-[13px]" },
];

const SUBTABS = [
  { key: "calendar", label: "STUDY CALENDAR", icon: IMG.calendarTab, iconClass: "w-[13px] h-[15px]" },
  { key: "quizforge", label: "QUIZ FORGE", icon: IMG.quizForgeTab, iconClass: "w-[15px] h-[15px]" },
  { key: "sprint", label: "STUDY SPRINT BOARD", icon: IMG.sprintTab, iconClass: "w-[13px] h-3" },
];

const SUBJECT_FILTERS = ["All Subjects", "CS240", "MATH210"];

const QUIZ_FORGE_STATS = [
  {
    icon: IMG.qfStatus,
    label: "STATUS",
    dot: "#A0D673",
    title: "Active Semester",
    titleColor: "#EDE0DC",
    badge: "SP-2025",
    badgeColor: "#A0D673",
    badgeBg: "#2B580080",
    sub: "Week 9 of 16 Complete",
    explain: "Which term you're in and how far through it you are. Updates automatically as the weeks pass — nothing to click here.",
  },
  {
    icon: IMG.qfFocus,
    label: "CURRENT FOCUS",
    dot: "#2CD4D9",
    title: "Syllabus Parsing",
    titleColor: "#2CD4D9",
    sub: "CS240 • Algorithms & Heaps",
    explain: "The topic Quiz Forge is actively pulling from right now, based on your most recently ingested syllabus/document.",
  },
  {
    icon: IMG.qfDeadline,
    label: "NEXT DEADLINE",
    dot: "#FEDA44",
    title: "2d Remainder",
    titleColor: "#FEDA44",
    note: "(CS240 Midterm)",
    sub: "Boss Encounter: Thurs 09:00",
    explain: "A countdown to your nearest exam/checkpoint, pulled straight from the Study Calendar — add or edit events there to change it.",
  },
  {
    icon: IMG.qfTomes,
    label: "INGESTED TOMES",
    dot: "#BBF38C",
    title: "3 Shards",
    titleColor: "#EDE0DC",
    badge: "84 Chunks",
    badgeColor: "#BBF38C",
    badgeBg: "#2B580099",
    sub: "Ready for Crafting Bench",
    explain: "How many documents you've uploaded ('Shards') and how many text chunks were extracted from them ('Chunks') — these are what get turned into quiz questions when you hit 'Forge Quiz' below.",
  },
];

const INITIAL_FORGE_FILES = [
  {
    id: "f1",
    name: "Data_Structures_Midterm_Mastery.pdf",
    icon: IMG.qfFile1,
    chunks: 42,
    size: "3.2 MB",
    status: "Indexed",
  },
  {
    id: "f2",
    name: "Algo_Lecture_5_Graph_Traversals.pdf",
    icon: IMG.qfFile2,
    chunks: 24,
    size: "1.8 MB",
    status: "Indexed",
  },
  {
    id: "f3",
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
    dot: "#FF6B6B",
    cards: [
      { id: "c1", subject: "CS240", subjectColor: "#58F1F6", meta: "45m", title: "Review Red-Black Tree Rotation Rules", desc: "Double rotations and recoloring edge cases." },
      { id: "c2", subject: "DISCRETE MATH", subjectColor: "#FEDA44", meta: "60m", title: "Proof by Induction Practice Set #4", desc: "Strong induction formulations for recurrences." },
      { id: "c3", subject: "ALGORITHMS", subjectColor: "#A0D673", meta: "30m", title: "Dijkstra Shortest Path Time Complexity", desc: "Min-Heap vs Fibonacci Heap bounds." },
    ],
  },
  {
    id: "active",
    title: "IN SPRINT / ACTIVE RAIDS",
    dot: "#58F1F6",
    cards: [
      { id: "c4", subject: "CS240", subjectColor: "#58F1F6", progress: 75, title: "CS240 Algorithm Bounds Review", due: "Due tomorrow", xp: 250 },
      { id: "c5", subject: "QUIZ PREP", subjectColor: "#FEDA44", meta: "Target 90%", title: "Tree Rebalance 10-Question Drill", desc: "AVL factor recalculation & zig-zag cases." },
      { id: "c6", subject: "PVP SPARRING", subjectColor: "#A0D673", meta: "Fri 16:30", title: "Clan Match with @EnderKnight", desc: "Graph Coloring Duel (Live session)." },
    ],
  },
  {
    id: "review",
    title: "BOSS CHECKPOINT / IN REVIEW",
    dot: "#FEDA44",
    cards: [
      { id: "c7", subject: "BOSS EXAM", subjectColor: "#FFDAD6", subjectBg: "#93000A", meta: "Fri Mar 20", metaColor: "#FEDA44", title: "Discrete Math Midterm Simulation", desc: "Combinatorics & recurrence simulation." },
      { id: "c8", subject: "CLAN SPRINT", subjectColor: "#58F1F6", meta: "Ready", metaColor: "#A0D673", title: "Graph Traversal Debrief", desc: "DFS/BFS peer solutions review." },
    ],
  },
  {
    id: "done",
    title: "COMPLETED / CONQUERED",
    dot: "#A0D673",
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

/* ---------------------------------------------------------
   Main component
--------------------------------------------------------- */
export default function CrammblingDashboard({ onNavigateToChatbot, onNavigateToGroup } = {}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false); // desktop drawer: pushed to the side
  const [activeNav, setActiveNav] = useState("personalized");
  const [activeSubTab, setActiveSubTab] = useState("calendar");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [filterOpen, setFilterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(2027, 2, 1)); // month being viewed
  const [selectedDate, setSelectedDate] = useState(null); // date picked on the calendar grid
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [upcoming, setUpcoming] = useState(INITIAL_UPCOMING);
  const [completed, setCompleted] = useState({});
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    label: "",
    subject: "CS240",
    type: "review",
    meta: "",
    date: formatDateForInput(TODAY),
  });
  const [notifOpen, setNotifOpen] = useState(false);
  const [openEventMenuId, setOpenEventMenuId] = useState(null);
  const [forgeFiles, setForgeFiles] = useState(INITIAL_FORGE_FILES);
  const [forgeStatusMap, setForgeStatusMap] = useState({});
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
    events.forEach((ev) => {
      const k = keyFor(ev.year, ev.month, ev.day);
      if (!map[k]) map[k] = [];
      map[k].push(ev);
    });
    return map;
  }, [events]);

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

  function deleteUpcoming(id) {
    setUpcoming((prev) => prev.filter((u) => u.id !== id));
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setCompleted((prev) => {
      const { [id]: _drop, ...rest } = prev;
      return rest;
    });
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
      name: f.name,
      icon: icons[i % icons.length],
      chunks: Math.max(6, Math.round(f.size / 20000)),
      size: formatSize(f.size),
      status: "Indexing…",
    }));
    setForgeFiles((prev) => [...newEntries, ...prev]);
    newEntries.forEach((entry) => {
      setTimeout(() => {
        setForgeFiles((prev) =>
          prev.map((it) => (it.id === entry.id ? { ...it, status: "Indexed" } : it))
        );
      }, 1400);
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
    setForgeStatusMap((prev) => ({ ...prev, [id]: "forging" }));
    setTimeout(() => {
      setForgeStatusMap((prev) => ({ ...prev, [id]: "ready" }));
      setTimeout(() => {
        setForgeStatusMap((prev) => ({ ...prev, [id]: "idle" }));
      }, 1800);
    }, 1200);
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
    setSprintColumns((prev) =>
      prev.map((c) => (c.id === colId ? { ...c, cards: c.cards.filter((cd) => cd.id !== cardId) } : c))
    );
  }

  function editCard(colId, cardId, updates) {
    setSprintColumns((prev) =>
      prev.map((c) =>
        c.id === colId
          ? { ...c, cards: c.cards.map((cd) => (cd.id === cardId ? { ...cd, ...updates } : cd)) }
          : c
      )
    );
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
    addCardToColumn(addingColumnId, addingText, addingBadge.trim() ? { subject: addingBadge.trim().toUpperCase() } : {});
    setAddingColumnId(null);
    setAddingText("");
    setAddingBadge("");
  }

  function runAutoIngest() {
    if (autoIngesting) return;
    setAutoIngesting(true);
    setTimeout(() => {
      addCardToColumn("backlog", "Auto-ingested: New drill from latest slides");
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
    addCardToColumn("backlog", quickTaskText, quickTaskBadge.trim() ? { subject: quickTaskBadge.trim().toUpperCase() } : {});
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
    const colorMap = { review: "#2CD4D9", exam: "#FF6B6B", group: "#82F040" };
    const statusMap = { review: "SCHEDULED", exam: "URGENT", group: "GROUP" };
    // Fall back to the calendar's selected day, then to TODAY, if the
    // date field was ever left empty.
    const chosenDate = parseDateFromInput(newEvent.date) || selectedDate || TODAY;
    const evYear = chosenDate.getFullYear();
    const evMonth = chosenDate.getMonth();
    const evDay = chosenDate.getDate();
    const dateLabel = formatDateLabel(chosenDate);

    setUpcoming((prev) => [
      {
        id,
        img: IMG.ev1,
        chk: IMG.ev1chk,
        title: newEvent.label,
        subject: newEvent.subject,
        subjectColor: colorMap[newEvent.type],
        meta: newEvent.meta || `${dateLabel} • Time to be confirmed`,
        status: statusMap[newEvent.type],
        statusColor: colorMap[newEvent.type],
      },
      ...prev,
    ]);
    setEvents((prev) => [
      ...prev,
      { id, year: evYear, month: evMonth, day: evDay, label: newEvent.label, type: newEvent.type },
    ]);
    // New calendar events also land as a quest in the Sprint Board backlog.
    addCardToColumn("backlog", newEvent.label, {
      subject: newEvent.subject.toUpperCase(),
      meta: dateLabel,
    });
    setNewEvent({ label: "", subject: "CS240", type: "review", meta: "", date: formatDateForInput(TODAY) });
    setSelectedDate(null);
    setShowAddEvent(false);
  }

  function openAddEventForDate(date) {
    setSelectedDate(date);
    setNewEvent((p) => ({ ...p, date: formatDateForInput(date) }));
    setShowAddEvent(true);
  }

  if (loggedOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#130D0B] px-6 text-center">
        <img src={IMG.logo} className="w-12 h-12 mb-4 object-fill" />
        <span className="text-[#2CD4D9] text-lg font-bold mb-2">CRAMMBLING</span>
        <p className="text-[#859394] text-sm mb-6">You've been logged out.</p>
        <button
          onClick={() => setLoggedOut(false)}
          className="bg-[#2CD4D9] text-[#003738] text-sm font-bold py-2 px-6 border border-solid border-[#3F3735] hover:opacity-90 transition-all duration-150 active:scale-95"
        >
          LOG BACK IN
        </button>
      </div>
    );
  }

  // Self-sufficient fallback: if nothing external is controlling navigation
  // (onNavigateToChatbot not passed in), swap the whole page for Chatbot
  // instead of nesting it inside this page's own sidebar/topbar.
  if (activeNav === "chatbot" && !onNavigateToChatbot) {
    return <Chatbot onNavigate={(key) => setActiveNav(key === "chatbot" ? "personalized" : key)} />;
  }

  if (activeNav === "group" && !onNavigateToGroup) {
    return <GroupCollab onNavigate={(key) => setActiveNav(key === "group" ? "personalized" : key)} />;
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <style>{`
        @keyframes pzPop { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes pzMenu { from { opacity: 0; transform: translateY(-6px) scale(.97); } to { opacity: 1; transform: none; } }
        @keyframes pzShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        @keyframes pzPulse { 0%,100% { box-shadow: 0 0 0 0 var(--pz-glow); } 50% { box-shadow: 0 0 22px 2px var(--pz-glow); } }
        @keyframes pzLaunch { to { transform: translateY(-40px) scale(.9); opacity: 0; } }
        .pz-date { color-scheme: dark; }
        .pz-date::-webkit-calendar-picker-indicator { cursor: pointer; opacity: .7; transition: opacity .15s; }
        .pz-date::-webkit-calendar-picker-indicator:hover { opacity: 1; }
        @media (prefers-reduced-motion: reduce) { .pz-anim { animation: none !important; } }
      `}</style>
      <div className="self-stretch bg-[#130D0B] min-h-screen relative">
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
            className={`bg-[#130D0B] w-64 shrink-0 z-50 flex flex-col h-screen
              fixed inset-y-0 left-0 transition-transform duration-300 ease-out
              ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}
              ${navCollapsed ? "lg:-translate-x-full" : "lg:translate-x-0"}`}
          >
            <div className="flex justify-end lg:hidden px-3 pt-3">
              <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                <img src={IMG.close} className="w-4 h-4" />
              </button>
            </div>
            <div className="self-stretch flex-1 overflow-y-auto">
              <div className="flex items-center self-stretch bg-[#1D1715] py-[13px]">
                <img src={IMG.logo} className="w-9 h-9 ml-4 mr-3 object-fill" />
                <div className="w-[127px]">
                  <div
                    className="flex flex-col items-start self-stretch"
                    style={{ boxShadow: "0px 2px 4px #2CD4D94D" }}
                  >
                    <span className="text-[#2CD4D9] text-[17px] font-bold">CRAMMBLING</span>
                  </div>
                  <div className="flex items-center self-stretch pt-1 gap-1">
                    <div className="bg-[#82F040] w-1.5 h-1.5" />
                    <span className="text-[#FEDA44] text-[10px] font-bold">VOXEL QUEST Lv.18</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start self-stretch pt-[21px] pl-5">
                <span className="text-[#859394] text-[11px] font-bold mb-[9px]">NAVIGATION BAR</span>
              </div>

              <nav className="flex flex-col self-stretch px-3 gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = activeNav === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (item.key === "chatbot" && onNavigateToChatbot) {
                          onNavigateToChatbot();
                        } else if (item.key === "group" && onNavigateToGroup) {
                          onNavigateToGroup();
                        } else {
                          setActiveNav(item.key);
                        }
                        setMobileNavOpen(false);
                      }}
                      className={`flex items-center self-stretch py-[9px] text-left border border-solid transition-all duration-150 active:scale-[0.98]
                        ${active ? "bg-[#251E1C] border-[#00000000]" : "border-[#00000000] hover:bg-[#1D1715]"}`}
                      style={active ? { boxShadow: "0px 0px 15px #2CD4D926" } : undefined}
                    >
                      <img src={item.icon} className={`${item.iconClass} ml-[13px] mr-3 object-fill`} />
                      <span className={`text-xs font-bold ${active ? "text-[#2CD4D9]" : "text-[#BBC9C9]"}`}>
                        {item.label}
                      </span>
                      {active && (
                        <div className="flex-1 flex justify-end pr-4">
                          <div
                            className="bg-[#2CD4D9] w-1.5 h-1.5 rounded-full"
                            style={{ boxShadow: "0px 0px 6px #2CD4D9" }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-col self-stretch bg-[#1D1715] p-3 gap-1">
              <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center self-stretch py-2 text-left hover:bg-[#251E1C] transition-all duration-150 active:scale-[0.98]"
              >
                <img src={IMG.settings} className="w-[15px] h-[15px] mx-3 object-fill" />
                <span className="text-[#BBC9C9] text-[11px]">SETTINGS</span>
              </button>
              <button
                onClick={() => setLoggedOut(true)}
                className="flex items-center self-stretch py-2 text-left hover:bg-[#251E1C] transition-all duration-150 active:scale-[0.98]"
              >
                <img src={IMG.logout} className="w-3.5 h-3.5 mx-3 object-fill" />
                <span className="text-[#BBC9C9] text-[11px]">LOGOUT</span>
              </button>
            </div>
          </div>

          {/* Desktop drawer handle — pushes the navigation bar to the side and back */}
          <button
            onClick={() => setNavCollapsed((v) => !v)}
            aria-label={navCollapsed ? "Open navigation bar" : "Push navigation bar aside"}
            title={navCollapsed ? "Open navigation" : "Push navigation aside"}
            className="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[55] w-5 h-16 items-center justify-center bg-[#251E1C] border border-solid border-[#3F3735] border-l-0 text-[#2CD4D9] hover:bg-[#2CD4D9] hover:text-[#003738] hover:shadow-[0_0_14px_#2CD4D966] transition-all duration-300 active:scale-95"
            style={{ left: navCollapsed ? 0 : 256 }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: navCollapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s" }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* ---------------- MAIN ---------------- */}
          <div className={`flex-1 bg-[#181210] pb-16 min-w-0 transition-[margin] duration-300 ease-out ${navCollapsed ? "lg:ml-0" : "lg:ml-64"}`}>
            {/* Top bar */}
            <div className="sticky top-0 z-30 backdrop-blur flex flex-wrap justify-between items-center gap-3 self-stretch bg-[#130D0BF0] py-3 px-4 sm:px-6 mb-8 lg:mb-[72px]">
              <div className="flex flex-1 min-w-0 items-center gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setNavCollapsed(false);
                    setMobileNavOpen(true);
                  }}
                  className={`shrink-0 ${navCollapsed ? "" : "lg:hidden"}`}
                  aria-label="Open menu"
                >
                  <img src={IMG.menu} className="w-6 h-6" />
                </button>

                <div className="hidden sm:flex flex-col shrink-0 items-start bg-[#251E1C] py-[3px] px-[9px] border border-solid border-[#3F3735]">
                  <span className="text-[#2CD4D9] text-[10px]">VOXEL ENGINE V2.4</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="flex shrink-0 items-center bg-[#251E1C] py-[5px] px-[13px] gap-[5px] border border-solid border-[#3F3735]">
                  <img src={IMG.streak} className="w-3 h-3.5 object-fill" />
                  <span className="text-[#FEDA44] text-[11px] font-bold hidden xs:inline">14 STREAK</span>
                </div>
                <div className="flex shrink-0 items-center bg-[#251E1C] py-[5px] px-[13px] gap-[5px] border border-solid border-[#3F3735]">
                  <img src={IMG.xp} className="w-[15px] h-[13px] object-fill" />
                  <span className="text-[#2CD4D9] text-[11px] font-bold hidden xs:inline">3,420 XP</span>
                </div>

                <button className="relative shrink-0" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
                  <img src={IMG.avatar} className="w-8 h-8 object-fill" />
                  {notifOpen && (
                    <div className="absolute right-0 top-10 z-50 w-56 bg-[#1D1715] border border-solid border-[#3F3735] p-3 text-left shadow-lg">
                      <span className="text-[#EDE0DC] text-xs font-bold block mb-2">Notifications</span>
                      <span className="text-[#859394] text-[11px] block">
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
                    className="flex flex-col items-center bg-[#2CD4D9] py-[5px] px-[7px] border border-solid border-[#3F3735]"
                    style={{ boxShadow: "0px 1px 2px #0000000D" }}
                  >
                    <span className="text-[#003738] text-sm font-bold">CP</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="self-stretch relative">
              <div
                className="self-stretch absolute top-[-56px] lg:top-[-72px] right-0 left-0 pb-[1px]"
                style={{ background: "linear-gradient(180deg, #1D1715, #2D221E, #1A1412)" }}
              >
                <div className="self-stretch bg-[#00000000] h-[90px] lg:h-[111px]" />
              </div>

              <div className="flex flex-col self-stretch px-4 sm:px-6 lg:px-10 gap-6">
                {activeNav !== "personalized" ? (
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
                          <span className="text-[#859394] text-[11px]">CRAMMBLING</span>
                          <span className="text-[#859394] text-[11px]">/</span>
                          <span className="text-[#859394] text-[11px]">PERSONAL</span>
                          <span className="text-[#859394] text-[11px]">/</span>
                          <span className="text-[#EDE0DC] text-[11px] font-bold">STUDY HUB</span>
                        </div>
                        <div className="flex shrink-0 items-center bg-[#251E1C] py-[5px] px-[13px] gap-2 border border-solid border-[#3F3735]">
                          <div className="bg-[#82F040] w-1.5 h-1.5" />
                          <span className="text-[#82F040] text-[11px]">SYNC ACTIVE</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center self-stretch py-1 gap-4">
                        <img src={IMG.hubIcon} className="w-12 h-12 object-fill shrink-0" />
                        <div className="flex-1 min-w-[220px]">
                          <div className="flex flex-col items-start self-stretch">
                            <span className="text-[#EDE0DC] text-2xl sm:text-3xl font-bold">
                              PERSONAL STUDY WORKSPACE
                            </span>
                          </div>
                          <div className="flex flex-col self-stretch pt-1">
                            <span className="text-[#859394] text-sm">
                              Synchronized academic revisions, exam checkpoints, and active syllabus ingestion.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-start self-stretch pt-[17px] gap-x-3 gap-y-2">
                        <div className="flex shrink-0 items-center gap-1.5">
                          <div className="bg-[#2CD4D9] w-1.5 h-1.5" />
                          <span className="text-[#2CD4D9] text-[11px]">Active Semester</span>
                        </div>
                        <span className="text-[#3F3735] text-[11px] hidden sm:inline">•</span>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <img src={IMG.clock} className="w-3 h-[11px] object-fill" />
                          <span className="text-[#BBC9C9] text-[11px]">Next: CS240 Midterm (2d)</span>
                        </div>
                        <span className="text-[#3F3735] text-[11px] hidden sm:inline">•</span>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <img src={IMG.check} className="w-2.5 h-2.5 object-fill" />
                          <span className="text-[#82F040] text-[11px]">2 Syllabi Ingested</span>
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
                                ${active ? "border-[#2CD4D9]" : "border-transparent hover:border-[#3F3735]"}`}
                            >
                              <img src={tab.icon} className={`${tab.iconClass} object-fill`} />
                              <span className={`text-xs font-bold whitespace-nowrap ${active ? "text-[#2CD4D9]" : "text-[#BBC9C9]"}`}>
                                {tab.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="relative shrink-0">
                        <button
                          onClick={() => setFilterOpen((v) => !v)}
                          className="flex flex-col items-start bg-[#251E1C] py-[5px] px-[11px] border border-solid border-[#3F3735] hover:border-[#2CD4D9] transition-all duration-150 active:scale-95"
                        >
                          <span className="text-[#859394] text-xs">Filter: {subjectFilter}</span>
                        </button>
                        {filterOpen && (
                          <div className="absolute right-0 mt-1 z-40 bg-[#1D1715] border border-solid border-[#3F3735] min-w-[160px]">
                            {SUBJECT_FILTERS.map((s) => (
                              <button
                                key={s}
                                onClick={() => {
                                  setSubjectFilter(s);
                                  setFilterOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-2 text-xs hover:bg-[#251E1C] ${subjectFilter === s ? "text-[#2CD4D9]" : "text-[#BBC9C9]"
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
                          className="flex flex-col self-stretch bg-[#181210] p-4 sm:p-[21px] gap-4 border border-solid border-[#3F3735]"
                          style={{ boxShadow: "2px 2px 0px #0A0706" }}
                        >
                          <div className="flex flex-wrap justify-between items-start gap-3 self-stretch pb-[13px]">
                            <div className="flex items-center gap-3">
                              <img src={IMG.calendarIcon} className="w-8 h-8 object-fill" />
                              <div>
                                <div className="flex flex-col items-start self-stretch">
                                  <span className="text-[#EDE0DC] text-lg font-bold">
                                    {MONTH_NAMES[month]} {year}
                                  </span>
                                </div>
                                <div className="flex flex-col items-start self-stretch">
                                  <span className="text-[#859394] text-[11px]">Academic Schedule</span>
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
                                className="flex flex-col shrink-0 items-start bg-[#251E1C] py-1 px-[13px] mr-[9px] border border-solid border-[#3F3735] hover:border-[#2CD4D9] transition-all duration-150 active:scale-95"
                              >
                                <span className="text-[#2CD4D9] text-xs font-bold">TODAY</span>
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
                                className="flex shrink-0 items-center bg-[#2CD4D9] py-1 px-3 gap-1 hover:opacity-90 transition-all duration-150 active:scale-95"
                              >
                                <img src={IMG.eventDot} className="w-2 h-2 object-fill" />
                                <span className="text-[#003738] text-xs font-bold">EVENT</span>
                              </button>
                            </div>
                          </div>

                          <div className="self-stretch bg-[#130D0B] p-[1px] border border-solid border-[#3F3735] overflow-x-auto">
                            <div className="min-w-[560px]">
                              <div className="flex items-center self-stretch bg-[#251E1C] py-2">
                                {WEEKDAYS.map((wd) => (
                                  <div key={wd} className="flex flex-1 flex-col items-center">
                                    <span className="text-[#859394] text-[11px] font-bold">{wd}</span>
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
                                          ? "bg-[#2CD4D933]"
                                          : "bg-[#251E1C4D]"
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
                                              ? { boxShadow: "0px 0px 10px #2CD4D940" }
                                              : isSelected
                                                ? { boxShadow: "inset 0px 0px 0px 2px #58F1F6" }
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
                                            className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-[#2CD4D9] text-[#003738] text-xs font-bold opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90 transition-all duration-150 z-10"
                                          >
                                            +
                                          </button>
                                          <div className="flex items-center self-stretch justify-between">
                                            <span
                                              className={`text-xs font-bold ${isToday
                                                ? "text-[#2CD4D9]"
                                                : cell.inMonth
                                                  ? "text-[#EDE0DC]"
                                                  : "text-[#524542]"
                                                }`}
                                            >
                                              {String(cell.date.getDate()).padStart(2, "0")}
                                              {isToday ? " TODAY" : ""}
                                            </span>
                                            {isToday && <div className="bg-[#2CD4D9] w-2 h-2 shrink-0" />}
                                          </div>
                                          <div className="flex flex-col items-start gap-1 mt-2 w-full">
                                            {dayEvents.map((ev) => {
                                              const st = TYPE_STYLES[ev.type];
                                              return (
                                                <div
                                                  key={ev.id}
                                                  title={ev.label}
                                                  className="flex flex-col items-start py-1 px-1.5 w-full truncate"
                                                  style={{ backgroundColor: st.bg }}
                                                >
                                                  <span
                                                    className="text-[10px] sm:text-[11px] font-bold truncate w-full"
                                                    style={{ color: st.text }}
                                                  >
                                                    {ev.label}
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
                              <div className="bg-[#2CD4D9] w-2.5 h-2.5" />
                              <span className="text-[#EDE0DC] text-[11px] font-bold">Study Review</span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <div className="bg-[#FF6B6B] w-2.5 h-2.5" />
                              <span className="text-[#EDE0DC] text-[11px] font-bold">Exam Checkpoint</span>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <div className="bg-[#82F040] w-2.5 h-2.5" />
                              <span className="text-[#EDE0DC] text-[11px] font-bold">Group Session</span>
                            </div>
                          </div>
                        </div>

                        {/* Upcoming events card */}
                        <div
                          className="flex flex-col self-stretch bg-[#181210] p-4 sm:p-[21px] gap-4 border border-solid border-[#3F3735]"
                          style={{ boxShadow: "2px 2px 0px #0A0706" }}
                        >
                          <div className="flex justify-between items-start self-stretch pb-[13px]">
                            <div className="flex shrink-0 items-center gap-2.5">
                              <img src={IMG.bellIcon} className="w-[15px] h-4 object-fill" />
                              <span className="text-[#EDE0DC] text-lg font-bold">UPCOMING STUDY EVENTS</span>
                            </div>
                            <span className="text-[#859394] text-xs">{filteredUpcoming.length} Scheduled</span>
                          </div>

                          <div className="self-stretch">
                            {filteredUpcoming.length === 0 && (
                              <div className="text-[#859394] text-xs py-6 text-center">
                                No events match this filter or search.
                              </div>
                            )}
                            {filteredUpcoming.map((u) => {
                              const isDone = completed[u.id];
                              return (
                                <div
                                  key={u.id}
                                  className={`flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 self-stretch bg-[#1D1715] p-4 sm:p-[17px] mb-2.5 border border-solid border-[#3F3735] ${isDone ? "opacity-60" : ""
                                    }`}
                                  style={isDone ? { filter: "grayscale(1)" } : undefined}
                                >
                                  <div className="flex items-center min-w-0 flex-1 gap-4">
                                    <img src={u.img} className="w-10 h-10 object-fill shrink-0" />
                                    <div className="flex flex-1 min-w-0 flex-col gap-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span
                                          className={`text-[#EDE0DC] text-sm font-bold truncate ${isDone ? "line-through" : ""
                                            }`}
                                        >
                                          {u.title}
                                        </span>
                                        <div
                                          className="flex flex-col shrink-0 items-start py-[3px] px-[9px] border border-solid"
                                          style={{
                                            backgroundColor: `${u.subjectColor}33`,
                                            borderColor: `${u.subjectColor}4D`,
                                          }}
                                        >
                                          <span className="text-[10px] font-bold" style={{ color: u.subjectColor }}>
                                            {u.subject}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-start self-stretch">
                                        <span className="text-[#BBC9C9] text-xs truncate">{u.meta}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex shrink-0 items-center gap-[13px]">
                                    <div
                                      className="flex flex-col shrink-0 items-start py-[5px] px-[11px] border border-solid"
                                      style={{
                                        backgroundColor: `${u.statusColor}1A`,
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
                                        className="w-8 h-8 flex items-center justify-center text-[#BBC9C9] text-lg leading-none tracking-widest hover:text-[#EDE0DC] hover:bg-[#251E1C] transition-all duration-150 active:scale-90"
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
                                            className="pz-anim absolute right-0 top-10 z-50 w-48 bg-[#0B1220F2] backdrop-blur-md border border-solid border-[#2E3B5C] p-1.5 flex flex-col gap-1"
                                            style={{ boxShadow: "0 14px 36px rgba(0,0,0,0.6), 0 0 24px #1E3A5F4D", animation: "pzMenu .16s ease-out" }}
                                          >
                                            <button
                                              onClick={() => {
                                                toggleComplete(u.id);
                                                setOpenEventMenuId(null);
                                              }}
                                              className="group/mi flex items-center gap-2.5 w-full text-left p-1.5 border border-solid border-transparent text-[#BBC9C9] hover:bg-[#2CD4D91A] hover:border-[#2CD4D94D] hover:text-[#2CD4D9] active:scale-[0.98] transition-all duration-150"
                                            >
                                              <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-solid border-[#2CD4D94D] bg-[#2CD4D922] text-[#2CD4D9] group-hover/mi:bg-[#2CD4D9] group-hover/mi:text-[#003738] transition-colors">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                  {isDone ? <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /> : <polyline points="5 12 10 17 19 7" />}
                                                </svg>
                                              </span>
                                              <span className="text-xs font-bold whitespace-nowrap">{isDone ? "Mark as not done" : "Mark as done"}</span>
                                            </button>
                                            <div className="h-px bg-[#2E3B5C] mx-1" />
                                            <button
                                              onClick={() => {
                                                deleteUpcoming(u.id);
                                                setOpenEventMenuId(null);
                                              }}
                                              className="group/mi flex items-center gap-2.5 w-full text-left p-1.5 border border-solid border-transparent text-[#FF6B6B] hover:bg-[#FF6B6B1A] hover:border-[#FF6B6B4D] active:scale-[0.98] transition-all duration-150"
                                            >
                                              <span className="w-6 h-6 shrink-0 flex items-center justify-center border border-solid border-[#FF6B6B4D] bg-[#FF6B6B22] text-[#FF6B6B] group-hover/mi:bg-[#FF6B6B] group-hover/mi:text-[#2A0A0A] transition-colors">
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
                              className="flex justify-center items-center self-stretch bg-[#251E1C] py-[13px] mt-1 gap-[7px] border border-solid border-[#3F3735] w-full hover:border-[#2CD4D9] transition-all duration-150 active:scale-[0.98]"
                            >
                              <img src={IMG.plus} className="w-2.5 h-2.5 object-fill" />
                              <span className="text-[#BBC9C9] text-xs font-bold">+ NEW STUDY EVENT</span>
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
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings drawer */}
        {settingsOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="flex-1 bg-black/60" onClick={() => setSettingsOpen(false)} />
            <div className="w-full max-w-xs bg-[#1D1715] border-l border-solid border-[#3F3735] p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[#EDE0DC] text-sm font-bold">SETTINGS</span>
                <button onClick={() => setSettingsOpen(false)}>
                  <img src={IMG.close} className="w-4 h-4" />
                </button>
              </div>
              <ToggleRow label="Email reminders" />
              <ToggleRow label="Group session pings" defaultOn />
              <ToggleRow label="Voxel quest sound effects" />
            </div>
          </div>
        )}

        {/* Add event modal */}
        {showAddEvent && (
          <NewEventModal
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            onClose={() => setShowAddEvent(false)}
            onSubmit={submitNewEvent}
          />
        )}
      </div>
    </div>
  );
}

const EVENT_TYPES = [
  { key: "review", label: "Study Review", color: "#2CD4D9", icon: "📖" },
  { key: "exam", label: "Exam Checkpoint", color: "#FF6B6B", icon: "🎯" },
  { key: "group", label: "Group Session", color: "#82F040", icon: "👥" },
];

function NewEventModal({ newEvent, setNewEvent, onClose, onSubmit }) {
  const [launching, setLaunching] = useState(false);
  const set = (patch) => setNewEvent((p) => ({ ...p, ...patch }));

  const checks = [!!newEvent.label.trim(), !!newEvent.date, !!newEvent.subject.trim(), !!newEvent.meta.trim()];
  const done = checks.filter(Boolean).length;
  const pct = (done / checks.length) * 100;
  const complete = done === checks.length;
  const barColor = pct < 50 ? "#FEDA44" : pct < 100 ? "#58F1F6" : "#82F040";
  const typeDef = EVENT_TYPES.find((t) => t.key === newEvent.type) || EVENT_TYPES[0];

  const picked = parseDateFromInput(newEvent.date);
  const left = picked ? Math.round((picked - TODAY) / 86400000) : null;
  const dueHint = left === null ? null : left < 0 ? "In the past" : left === 0 ? "Today" : left === 1 ? "Tomorrow" : `In ${left} days`;

  function quickDate(offset) {
    const d = new Date(TODAY);
    d.setDate(d.getDate() + offset);
    set({ date: formatDateForInput(d) });
  }

  function submit(e) {
    e.preventDefault();
    if (!newEvent.label.trim() || launching) return;
    setLaunching(true);
    setTimeout(() => onSubmit({ preventDefault() { } }), 450);
  }

  const field =
    "w-full bg-[#101A2E] border border-solid border-[#2E3B5C] text-[#EDE0DC] text-xs py-2.5 px-3 text-left outline-none transition-all duration-200 placeholder:text-[#4A5578] focus:border-[#2CD4D9] focus:shadow-[0_0_14px_#2CD4D933] focus:bg-[#132038]";

  const Label = ({ children, ok, optional }) => (
    <span className="flex items-center gap-1.5 text-[#8A93B8] text-[10px] font-bold tracking-wider text-left uppercase">
      <span
        className="inline-flex items-center justify-center w-3 h-3 rounded-full text-[8px] leading-none transition-all duration-300"
        style={{
          backgroundColor: ok ? "#82F040" : "transparent",
          border: `1px solid ${ok ? "#82F040" : "#3A4E78"}`,
          color: "#0B1220",
          transform: ok ? "scale(1.15)" : "scale(1)",
        }}
      >
        {ok ? "✓" : ""}
      </span>
      {children}
      {optional && <span className="normal-case tracking-normal font-normal text-[#4A5578]">(optional)</span>}
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <form
        onSubmit={submit}
        className="pz-anim relative bg-[#0B1220F2] backdrop-blur-md border border-solid border-[#2E3B5C] w-full max-w-md max-h-[94vh] overflow-y-auto"
        style={{
          boxShadow: `0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${typeDef.color}22`,
          animation: launching ? "pzLaunch .45s ease-in forwards" : "pzPop .28s cubic-bezier(.2,.9,.3,1.2)",
        }}
      >
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${typeDef.color}, #FEDA44, ${typeDef.color})` }} />

        {/* header */}
        <div className="flex justify-between items-start px-5 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center text-base border border-solid transition-colors duration-300"
              style={{ backgroundColor: `${typeDef.color}22`, borderColor: `${typeDef.color}55` }}
            >
              {typeDef.icon}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[#EDE0DC] text-sm font-bold tracking-wide">NEW STUDY EVENT</span>
              <span className="text-[#8A93B8] text-[11px]">
                {complete ? "All set — ready to launch!" : `${done} of ${checks.length} details filled in`}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[#8A93B8] text-xl leading-none hover:text-[#58F1F6] hover:rotate-90 transition-all duration-200" aria-label="Close">
            ×
          </button>
        </div>

        {/* progress bar */}
        <div className="px-5 pb-4">
          <div className="relative h-1.5 bg-[#101A2E] border border-solid border-[#2E3B5C] overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 transition-all duration-500 ease-out overflow-hidden"
              style={{ width: `${pct}%`, backgroundColor: barColor, boxShadow: `0 0 10px ${barColor}99` }}
            >
              {pct > 0 && (
                <div
                  className="pz-anim absolute inset-y-0 w-1/3"
                  style={{ background: "linear-gradient(90deg, transparent, #ffffff88, transparent)", animation: "pzShimmer 1.8s linear infinite" }}
                />
              )}
            </div>
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-[#4A5578]">
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
            <input autoFocus value={newEvent.label} onChange={(e) => set({ label: e.target.value })} placeholder="e.g. Linear Algebra Review" className={field} />
          </label>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[#8A93B8] text-[10px] font-bold tracking-wider text-left uppercase">Type</span>
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
                      backgroundColor: active ? `${t.color}26` : "#101A2E",
                      borderColor: active ? t.color : "#2E3B5C",
                      color: active ? t.color : "#8A93B8",
                      boxShadow: active ? `0 0 12px ${t.color}44` : "none",
                    }}
                  >
                    <span className="text-sm leading-none">{t.icon}</span>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date + quick picks */}
          <div className="flex flex-col gap-1.5">
            <Label ok={checks[1]}>Date</Label>
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
                    className={`text-[10px] font-bold py-0.5 px-2 border border-solid transition-all duration-150 active:scale-95 ${active ? "bg-[#2CD4D933] border-[#2CD4D9] text-[#2CD4D9]" : "bg-[#101A2E] border-[#2E3B5C] text-[#8A93B8] hover:border-[#58F1F6] hover:text-[#58F1F6]"
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
              {dueHint && (
                <span className="ml-auto text-[10px] font-bold" style={{ color: left < 0 ? "#FF6B6B" : left <= 1 ? "#FEDA44" : "#A0D673" }}>
                  ⏳ {dueHint}
                </span>
              )}
            </div>
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

          {/* Details */}
          <label className="flex flex-col gap-1.5">
            <Label ok={checks[3]} optional>Details</Label>
            <input value={newEvent.meta} onChange={(e) => set({ meta: e.target.value })} placeholder="e.g. 15:00 • Room 3" className={field} />
          </label>

          <span className="text-[#8A93B8] text-[10px] text-left">✓ This will also land in your Study Sprint Board backlog.</span>

          <button
            type="submit"
            disabled={!newEvent.label.trim() || launching}
            className="pz-anim relative overflow-hidden text-xs font-bold py-3 tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:brightness-110"
            style={{
              backgroundColor: complete ? "#82F040" : "#2CD4D9",
              color: complete ? "#0F2A00" : "#003738",
              "--pz-glow": complete ? "#82F04099" : "#2CD4D900",
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
    <span className="text-[10px] font-bold py-0.5 px-2 border border-solid shrink-0" style={{ backgroundColor: `${color}33`, borderColor: `${color}4D`, color }}>
      {children}
    </span>
  );
}

function ToggleRow({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="flex justify-between items-center py-2 border-b border-solid border-[#3F3735]"
    >
      <span className="text-[#BBC9C9] text-xs">{label}</span>
      <div className={`w-9 h-5 flex items-center px-0.5 ${on ? "bg-[#2CD4D9] justify-end" : "bg-[#251E1C] justify-start"}`}>
        <div className="w-3.5 h-3.5 bg-[#EDE0DC]" />
      </div>
    </button>
  );
}

function Spinner({ color = "#003738" }) {
  return (
    <svg className="animate-spin w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function QuizForgePanel({
  files,
  forgeStatusMap,
  onForge,
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
  return (
    <div className="flex flex-col self-stretch gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {QUIZ_FORGE_STATS.map((stat) => (
          <div
            key={stat.label}
            title={stat.explain}
            className="bg-[#181210] p-[15px] border border-solid border-[#3F3735] transition-transform duration-150 hover:-translate-y-0.5 cursor-help"
          >
            <div className="flex justify-between items-center self-stretch">
              <div className="flex shrink-0 items-center gap-1.5">
                <img src={stat.icon} className="w-[13px] h-[13px] object-fill" />
                <span className="text-[#859394] text-xs">{stat.label}</span>
              </div>
              <div className="w-2 h-2 shrink-0" style={{ backgroundColor: stat.dot }} />
            </div>
            <div className="flex flex-wrap items-center self-stretch pt-2.5 gap-[9px]">
              <span className="text-base font-bold" style={{ color: stat.titleColor }}>
                {stat.title}
              </span>
              {stat.badge && (
                <div
                  className="flex flex-col shrink-0 items-start py-0.5 px-1.5"
                  style={{ backgroundColor: stat.badgeBg }}
                >
                  <span className="text-[10px] font-bold" style={{ color: stat.badgeColor }}>
                    {stat.badge}
                  </span>
                </div>
              )}
              {stat.note && <span className="text-[#BBC9C9] text-[10px]">{stat.note}</span>}
            </div>
            <div className="flex flex-col items-start self-stretch pt-1">
              <span className="text-[#859394] text-[11px]">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ingestion vault */}
      <div
        className="flex flex-col self-stretch bg-[#181210] p-4 sm:p-[21px] gap-4 border border-solid border-[#3F3735]"
        style={{ boxShadow: "2px 2px 0px #0A0706" }}
      >
        <div className="flex flex-wrap justify-between items-center gap-2 self-stretch">
          <div className="flex shrink-0 items-center gap-2">
            <div className="bg-[#2CD4D9] w-2.5 h-2.5" />
            <span className="text-[#EDE0DC] text-base font-bold">DOCUMENT INGESTION VAULT</span>
          </div>
          <span className="text-[#38DBE0] text-[11px] bg-[#251E1C] py-[5px] px-[11px] border border-solid border-[#3F3735]">
            PDF, DOCX, MD (MAX 64MB)
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onFileInputChange}
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center self-stretch py-8 sm:py-[34px] px-4 border-2 border-solid transition-all duration-150 ${isDragging ? "bg-[#2CD4D91A] border-[#2CD4D9] scale-[1.01]" : "bg-[#130D0B] border-[#3F3735]"
            }`}
        >
          <img src={IMG.qfDropIllustration} className="w-14 h-[68px] object-fill mb-2" />
          <span className="text-[#EDE0DC] text-lg font-bold text-center">
            Drop Lecture Slides, PDFs, or Syllabi to ingest
          </span>
          <p className="text-[#BBC9C9] text-xs text-center max-w-md pt-1 pb-5">
            Autonomous RAG vector chunking extracts syllabus schedules, formulas, and terminology to
            craft custom practice quizzes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex shrink-0 items-center bg-[#2CD4D9] py-3 px-[22px] gap-2 hover:opacity-90 transition-all duration-150 active:scale-95"
            >
              <img src={IMG.qfUpload} className="w-3 h-[15px] object-fill" />
              <span className="text-[#003738] text-xs font-bold">Upload Study Documents</span>
            </button>
            <button
              onClick={onSyncDrive}
              className="flex items-center bg-[#251E1C] py-3 px-[22px] gap-2 border border-solid border-[#3F3735] hover:border-[#2CD4D9] transition-all duration-150 active:scale-95"
            >
              {driveSyncing ? <Spinner color="#EDE0DC" /> : <img src={IMG.qfDrive} className="w-[15px] h-[15px] object-fill" />}
              <span className="text-[#EDE0DC] text-xs font-bold">
                {driveSyncing ? "Syncing…" : "Sync Google Drive"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Ingested files list */}
      <div
        className="flex flex-col self-stretch bg-[#181210] p-4 sm:p-[21px] gap-4 border border-solid border-[#3F3735]"
        style={{ boxShadow: "2px 2px 0px #0A0706" }}
      >
        <div className="flex flex-wrap justify-between items-center gap-2 self-stretch">
          <div className="flex flex-wrap shrink-0 items-center gap-2">
            <div className="bg-[#A0D673] w-2.5 h-2.5" />
            <span className="text-[#EDE0DC] text-base font-bold">INGESTED LORE &amp; SYLLABI SHARDS</span>
            <span className="text-[#BBF38C] text-xs font-bold bg-[#2B580080] py-0.5 px-2">
              ({files.length} Files Synced)
            </span>
          </div>
          <button className="flex shrink-0 items-center gap-1 hover:opacity-80 transition-all duration-150 active:scale-95">
            <img src={IMG.qfReindex} className="w-2.5 h-2.5 object-fill" />
            <span className="text-[#2CD4D9] text-xs">Re-index All Chunks</span>
          </button>
        </div>

        <div className="flex flex-col self-stretch">
          {files.map((file) => {
            const forgeState = forgeStatusMap[file.id] || "idle";
            const indexing = file.status !== "Indexed";
            return (
              <div
                key={file.id}
                className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-3 self-stretch bg-[#211A18] p-4 sm:p-[15px] mb-3 border border-solid border-[#3F3735]"
              >
                <div className="flex items-center min-w-0 flex-1 gap-3">
                  <img src={file.icon} className="w-10 h-10 object-fill shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-[#EDE0DC] text-sm font-bold truncate w-full">{file.name}</span>
                    </div>
                    <div className="flex flex-wrap items-center self-stretch pt-0.5 gap-x-2">
                      <span className="text-[#A0D673] text-[11px] font-bold">{file.chunks} Chunks</span>
                      <span className="text-[#3F3735] text-[11px]">•</span>
                      <span className="text-[#38DBE0] text-[11px]">{file.size}</span>
                      <span className="text-[#3F3735] text-[11px]">•</span>
                      <span className={`text-[11px] ${indexing ? "text-[#FEDA44]" : "text-[#BBF38C]"}`}>
                        {file.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-[9px]">
                  <div className="flex flex-col shrink-0 items-start bg-[#130D0B] py-1 px-[9px] border border-solid border-[#A0D6734D]">
                    <span className="text-[#BBF38C] text-[11px]">{indexing ? "SYNCING" : "READY"}</span>
                  </div>
                  <button
                    disabled={indexing}
                    onClick={() => onForge(file.id)}
                    className={`flex shrink-0 items-center py-2.5 px-[16px] gap-1.5 transition-all duration-150 active:scale-95 ${indexing
                      ? "bg-[#3F3735] cursor-not-allowed opacity-60"
                      : forgeState === "ready"
                        ? "bg-[#A0D673]"
                        : "bg-[#2CD4D9] hover:opacity-90"
                      }`}
                  >
                    {forgeState === "forging" ? (
                      <Spinner />
                    ) : (
                      <img src={IMG.qfForge} className="w-[13px] h-[13px] object-fill" />
                    )}
                    <span className="text-[#003738] text-xs font-bold whitespace-nowrap">
                      {forgeState === "forging"
                        ? "Forging…"
                        : forgeState === "ready"
                          ? "Quiz Ready ✓"
                          : "Forge Quiz"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}

          {repoLinks.map((link, i) => (
            <div
              key={i}
              className="flex items-center gap-3 self-stretch bg-[#211A18] p-[15px] mb-3 border border-solid border-[#3F3735]"
            >
              <img src={IMG.qfLink} className="w-4 h-4 object-fill shrink-0" />
              <span className="text-[#BBC9C9] text-xs truncate">{link}</span>
            </div>
          ))}

          {showRepoLink ? (
            <form onSubmit={onAddRepoLink} className="flex flex-wrap items-center gap-2 self-stretch bg-[#130D0B] p-3 border border-solid border-[#3F3735]">
              <input
                autoFocus
                value={repoLinkValue}
                onChange={(e) => setRepoLinkValue(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="flex-1 min-w-[160px] bg-[#251E1C] border border-solid border-[#3F3735] text-[#EDE0DC] text-xs py-2 px-3 outline-none focus:border-[#2CD4D9]"
              />
              <button
                type="submit"
                className="bg-[#2CD4D9] text-[#003738] text-xs font-bold py-2 px-4 hover:opacity-90 transition-all duration-150 active:scale-95"
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => setShowRepoLink(false)}
                className="text-[#859394] text-xs py-2 px-2 hover:text-[#BBC9C9] transition-colors"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowRepoLink(true)}
              className="flex justify-center items-center self-stretch bg-[#130D0B] py-[13px] mt-1 gap-2 border border-solid border-[#3F3735] hover:border-[#2CD4D9] transition-all duration-150 active:scale-[0.98]"
            >
              <img src={IMG.qfLink} className="w-[15px] h-[15px] object-fill" />
              <span className="text-[#BBC9C9] text-xs">Link additional syllabus repository or notes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SprintCard({ card, colId, index, isDone, isDragged, isDropTarget, onDragStart, onDragOver, onDrop, onDragEnd, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editBadge, setEditBadge] = useState(card.subject || "");

  const badgeColor = BADGE_COLOR_BY_COLUMN[colId] || "#BBC9C9";
  const urgent = !isDone && colId !== "review" && isQuestUrgent(card.due || card.meta);

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
        className="text-[#BBC9C9] text-[11px] hover:text-[#58F1F6] transition-colors"
      >
        ✎
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(colId, card.id);
        }}
        aria-label="Delete quest"
        className="text-[#FF6B6B] text-xs font-bold hover:opacity-75 transition-opacity"
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
        className={`group flex justify-between items-center gap-3 self-stretch bg-[#251E1C] p-2 border border-solid border-transparent cursor-grab active:cursor-grabbing transition-all duration-150 hover:border-[#A0D6734D] ${isDragged ? "opacity-40 scale-95" : "opacity-100"
          } ${isDropTarget ? "ring-1 ring-[#A0D673]" : ""}`}
      >
        <div className="flex items-center gap-[7px] min-w-0 flex-1">
          <img src={IMG.check} className="w-[15px] h-[15px] object-fill shrink-0" />
          {editing ? (
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="bg-[#130D0B] border border-solid border-[#3F3735] text-[#EDE0DC] text-[13px] py-1 px-2 outline-none focus:border-[#A0D673] flex-1 min-w-0"
            />
          ) : (
            <span className="text-[#BBC9C9] text-[13px] line-through truncate">{card.title}</span>
          )}
        </div>
        {editing ? (
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={saveEdit} className="text-[#A0D673] text-[10px] font-bold">Save</button>
            <button onClick={() => setEditing(false)} className="text-[#859394] text-[10px]">Cancel</button>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            {card.subject && (
              <span className="text-[9px] font-bold" style={{ color: badgeColor }}>
                {card.subject}
              </span>
            )}
            <span className="text-[#A0D673] text-[10px] font-bold">+{card.xp ?? 50} XP</span>
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
      className={`group flex flex-col self-stretch min-w-0 bg-[#251E1C] p-3 gap-2 border border-solid border-transparent cursor-grab active:cursor-grabbing transition-all duration-150 hover:-translate-y-0.5 hover:border-[#58F1F64D] ${urgent ? "border-l-4 border-l-[#FF6B6B]" : ""} ${isDragged ? "opacity-40 scale-95" : "opacity-100"
        } ${isDropTarget ? "ring-1 ring-[#58F1F6]" : ""}`}
      style={{ boxShadow: urgent ? "0px 0px 10px #FF6B6B4D" : "0px 1px 2px #0000000D" }}
    >
      <div className="flex items-start justify-between gap-2 self-stretch">
        {editing ? (
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="bg-[#130D0B] border border-solid border-[#3F3735] text-[#EDE0DC] text-sm py-1 px-2 outline-none focus:border-[#58F1F6] flex-1 min-w-0"
          />
        ) : (
          <span className="text-[#EDE0DC] text-sm truncate flex-1 min-w-0" title={card.title}>{card.title}</span>
        )}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="flex flex-col shrink-0 items-start py-0.5 px-2 border border-solid"
            style={{ backgroundColor: `${badgeColor}33`, borderColor: `${badgeColor}4D` }}
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
        <span className="text-[10px] font-bold shrink-0" style={{ color: urgent ? "#FF6B6B" : card.metaColor || "#859394" }}>
          {card.due || card.meta}
        </span>
        {editing ? (
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={saveEdit} className="text-[#A0D673] text-[10px] font-bold">Save</button>
            <button onClick={() => setEditing(false)} className="text-[#859394] text-[10px]">Cancel</button>
          </div>
        ) : (
          controls
        )}
      </div>
      {typeof card.progress === "number" ? (
        <>
          <div className="self-stretch bg-[#130D0B] mt-1 mb-1">
            <div className="bg-[#58F1F6] h-1.5 transition-all duration-500" style={{ width: `${card.progress}%` }} />
          </div>
          <div className="flex justify-between items-center self-stretch">
            <span className="text-[#859394] text-[10px] font-bold">{card.due}</span>
            <span className="text-[#A0D673] text-[10px] font-bold">+{card.xp} XP</span>
          </div>
        </>
      ) : (
        card.desc && <span className="text-[#BBC9C9] text-xs break-words">{card.desc}</span>
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
}) {
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
        className="flex flex-wrap justify-between items-center gap-4 self-stretch bg-[#251E1C] p-4"
        style={{ boxShadow: "0px 1px 2px #0000000D" }}
      >
        <div className="flex flex-wrap shrink-0 items-center gap-x-6 gap-y-2">
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[#859394] text-[10px] font-bold">SPRINT:</span>
            <span className="text-[#EDE0DC] text-lg font-bold">Sprint 03</span>
            <span className="text-[#A0D673] text-[10px] font-bold">(Week 4 of 8)</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[#859394] text-[10px] font-bold">FOCUS:</span>
            <span className="text-[#BBC9C9] text-[13px]">Midterm Boss Raids</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[#859394] text-[10px] font-bold">PROGRESS:</span>
          <div className="w-24 sm:w-[120px] h-2 bg-[#130D0B]" style={{ boxShadow: "0px 2px 4px #0000000D" }}>
            <div className="bg-[#A0D673] h-2 transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[#A0D673] text-[10px] font-bold">
            {doneCount}/{totalCards}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-[9px]">
          <button
            onClick={() => setShowSprintLogs(true)}
            className="flex shrink-0 items-center bg-[#302826] py-2 px-4 gap-2 hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            <img src={IMG.sbLogs} className="w-[13px] h-[13px] object-fill" />
            <span className="text-[#EDE0DC] text-xs font-bold">SPRINT LOGS</span>
          </button>
          <button
            onClick={onAutoIngest}
            className="flex shrink-0 items-center bg-[#2CD4D9] py-2 px-4 gap-[7px] hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            {autoIngesting ? <Spinner /> : <img src={IMG.sbIngest} className="w-3 h-[15px] object-fill" />}
            <span className="text-[#003738] text-xs font-bold">{autoIngesting ? "Ingesting…" : "AUTO-INGEST"}</span>
          </button>
        </div>
      </div>

      {/* Filter / group-by row */}
      <div className="flex flex-wrap items-center justify-between gap-3 self-stretch bg-[#130D0B] p-2" style={{ boxShadow: "0px 2px 4px #0000000D" }}>
        <div className="relative shrink-0">
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="flex shrink-0 items-center bg-[#251E1C] py-1.5 px-2 gap-2 hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            <img src={IMG.sbFilterIcon} className="w-2.5 h-2.5 object-fill" />
            <span className="text-[#859394] text-[10px] font-bold">FILTER:</span>
            <span className="text-[#EDE0DC] text-[10px] font-bold">{subjectFilter}</span>
          </button>
          {filterOpen && (
            <div className="absolute left-0 mt-1 z-40 bg-[#1D1715] border border-solid border-[#3F3735] min-w-[160px]">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSubjectFilter(s);
                    setFilterOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-[10px] font-bold hover:bg-[#251E1C] ${subjectFilter === s ? "text-[#58F1F6]" : "text-[#BBC9C9]"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setView((v) => (v === "kanban" ? "list" : "kanban"))}
          className="flex shrink-0 items-center bg-[#251E1C] py-1.5 px-2 hover:opacity-90 transition-all duration-150 active:scale-95"
        >
          <img src={IMG.sbGroupIcon} className="w-3 h-3 mr-[7px] object-fill" />
          <span className="text-[#859394] text-[10px] font-bold mr-[9px]">GROUP BY:</span>
          <span className="text-[#EDE0DC] text-[10px] font-bold">
            {view === "kanban" ? "STATUS (KANBAN)" : "FLAT LIST"}
          </span>
        </button>
      </div>

      {/* Board */}
      {view === "kanban" ? (
        <div className="grid self-stretch gap-3 pb-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
          {filteredColumns.map((col) => (
            <div
              key={col.id}
              onDragOver={(e) => onColumnDragOver(e, col.id)}
              onDrop={(e) => onCardDrop(e, col.id)}
              className="flex min-w-0 flex-col bg-[#211A18] p-2 gap-2"
              style={{ boxShadow: "0px 1px 2px #0000000D" }}
            >
              <div className="flex justify-between items-center gap-2 self-stretch bg-[#130D0B] p-2" style={{ boxShadow: "0px 2px 4px #0000000D" }}>
                <div className="flex min-w-0 items-center gap-2">
                  <div className="w-3 h-3 shrink-0" style={{ backgroundColor: col.dot }} />
                  <span className="text-[#EDE0DC] text-[11px] font-bold leading-tight break-words min-w-0">{col.title}</span>
                </div>
                <div className="flex flex-col shrink-0 items-start bg-[#251E1C] py-0.5 px-2">
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
                        className="bg-[#130D0B] border border-solid border-[#3C494A] text-[#EDE0DC] text-xs py-2 px-2 outline-none focus:border-[#58F1F6]"
                      />
                      <input
                        value={addingBadge}
                        onChange={(e) => setAddingBadge(e.target.value)}
                        placeholder="Badge / subject (e.g. CS240)"
                        className="bg-[#130D0B] border border-solid border-[#3C494A] text-[#EDE0DC] text-xs py-2 px-2 outline-none focus:border-[#58F1F6]"
                      />
                      <span className="text-[#859394] text-[10px]">
                        Badge color is set by this column — {col.title}.
                      </span>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-[#58F1F6] text-[#003738] text-[10px] font-bold py-1.5 hover:opacity-90 transition-all duration-150 active:scale-95">
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddingColumnId(null);
                            setAddingBadge("");
                          }}
                          className="text-[#859394] text-[10px] px-2 hover:text-[#BBC9C9]"
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
                      }}
                      className="flex justify-center items-center self-stretch bg-[#130D0B] py-2 gap-1.5 hover:opacity-90 transition-all duration-150 active:scale-[0.98]"
                    >
                      <img src={IMG.sbAddQuest} className="w-[9px] h-[9px] object-fill" />
                      <span className="text-[#859394] text-[10px] font-bold">+ New Quest</span>
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
                  className="flex flex-wrap items-center justify-between gap-2 bg-[#211A18] p-3 border-l-2"
                  style={{ borderColor: badgeColor }}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-[#859394] shrink-0">{col.title}</span>
                    {isEditing ? (
                      <input
                        autoFocus
                        value={flatEditText}
                        onChange={(e) => setFlatEditText(e.target.value)}
                        className="bg-[#130D0B] border border-solid border-[#3F3735] text-[#EDE0DC] text-sm py-1 px-2 outline-none focus:border-[#58F1F6] flex-1 min-w-0"
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
                    <span className="text-[#A0D673] text-[10px] font-bold shrink-0">
                      {card.xp ? `+${card.xp} XP` : card.subject}
                    </span>
                    {!isEditing && (
                      <select
                        value={col.id}
                        onChange={(e) => onMoveCard(card.id, col.id, e.target.value)}
                        className="bg-[#130D0B] border border-solid border-[#3F3735] text-[10px] text-[#BBC9C9] py-1 px-1 outline-none focus:border-[#58F1F6]"
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
                          className="text-[#A0D673] text-[10px] font-bold px-1"
                        >
                          Save
                        </button>
                        <button onClick={() => setFlatEditingId(null)} className="text-[#859394] text-[10px] px-1">
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
                        className="text-[#BBC9C9] text-[11px] hover:text-[#58F1F6] px-1 transition-colors"
                      >
                        ✎
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteCard(col.id, card.id)}
                      aria-label="Delete quest"
                      className="text-[#FF6B6B] text-xs font-bold px-1 hover:opacity-75 transition-opacity"
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
      <div className="flex flex-wrap justify-between items-center gap-4 self-stretch bg-[#211A18] p-4">
        <div className="flex flex-wrap shrink-0 items-center gap-x-6 gap-y-2">
          <div className="flex shrink-0 items-center gap-1.5">
            <img src={IMG.sbBurndown} className="w-[13px] h-2 object-fill" />
            <span className="text-[#EDE0DC] text-[10px] font-bold">Burndown: +18% Ahead</span>
          </div>
          <div className="flex shrink-0 items-center gap-[7px]">
            <span className="text-[#859394] text-[10px] font-bold">Level 18</span>
            <span className="text-[#A0D673] text-[10px] font-bold">82%</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-[9px]">
          <button
            onClick={() => setShowQuickTask(true)}
            className="flex flex-col shrink-0 items-start bg-[#251E1C] py-1 px-2 hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            <span className="text-[#EDE0DC] text-[10px] font-bold">+ Quick Task</span>
          </button>
          <button
            onClick={onSyncCalendar}
            className="flex shrink-0 items-center gap-1.5 bg-[#251E1C] py-1 px-2 hover:opacity-90 transition-all duration-150 active:scale-95"
          >
            {syncingCalendar && <Spinner color="#EDE0DC" />}
            <span className="text-[#EDE0DC] text-[10px] font-bold">
              {syncingCalendar ? "Syncing…" : "Sync Calendar"}
            </span>
          </button>
        </div>
      </div>

      {/* Sprint logs modal */}
      {showSprintLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowSprintLogs(false)} />
          <div className="relative bg-[#1D1715] border border-solid border-[#3F3735] p-5 w-full max-w-sm flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#EDE0DC] text-sm font-bold">SPRINT LOGS</span>
              <button onClick={() => setShowSprintLogs(false)}>
                <img src={IMG.close} className="w-4 h-4" />
              </button>
            </div>
            {(doneColumn?.cards || []).map((c) => (
              <div key={c.id} className="flex justify-between items-center gap-2 border-b border-solid border-[#3F3735] pb-2">
                <span className="text-[#BBC9C9] text-xs">{c.title}</span>
                <span className="text-[#A0D673] text-[10px] font-bold shrink-0">+{c.xp ?? 50} XP</span>
              </div>
            ))}
            {!doneColumn?.cards.length && <p className="text-[#859394] text-xs">No conquered quests yet.</p>}
          </div>
        </div>
      )}

      {/* Quick task modal */}
      {showQuickTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowQuickTask(false)} />
          <form
            onSubmit={onSubmitQuickTask}
            className="relative bg-[#1D1715] border border-solid border-[#3F3735] p-5 w-full max-w-sm flex flex-col gap-3"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#EDE0DC] text-sm font-bold">QUICK TASK</span>
              <button type="button" onClick={() => setShowQuickTask(false)}>
                <img src={IMG.close} className="w-4 h-4" />
              </button>
            </div>
            <input
              autoFocus
              value={quickTaskText}
              onChange={(e) => setQuickTaskText(e.target.value)}
              placeholder="e.g. Skim Chapter 6 notes"
              className="bg-[#251E1C] border border-solid border-[#3F3735] text-[#EDE0DC] text-xs py-2 px-3 outline-none focus:border-[#58F1F6]"
            />
            <input
              value={quickTaskBadge}
              onChange={(e) => setQuickTaskBadge(e.target.value)}
              placeholder="Badge / subject (optional, e.g. CS240)"
              className="bg-[#251E1C] border border-solid border-[#3F3735] text-[#EDE0DC] text-xs py-2 px-3 outline-none focus:border-[#58F1F6]"
            />
            <button
              type="submit"
              className="bg-[#58F1F6] text-[#003738] text-xs font-bold py-2 hover:opacity-90 transition-all duration-150 active:scale-95"
            >
              Add to Backlog
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
      className="flex flex-col self-stretch bg-[#181210] p-6 sm:p-[21px] gap-3 border border-solid border-[#3F3735]"
      style={{ boxShadow: "2px 2px 0px #0A0706" }}
    >
      <div className="flex items-center gap-2.5">
        <img src={icon} className="w-[15px] h-4 object-fill" />
        <span className="text-[#EDE0DC] text-lg font-bold">{title}</span>
      </div>
      <p className="text-[#859394] text-sm max-w-md">{text}</p>
    </div>
  );
}

function ComingSoon({ nav, onBack }) {
  return (
    <div
      className="flex flex-col items-start self-stretch bg-[#181210] p-6 sm:p-[25px] gap-3 border border-solid border-[#3F3735] mt-6"
      style={{ boxShadow: "2px 2px 0px #0A0706" }}
    >
      <span className="text-[#EDE0DC] text-xl font-bold">{nav}</span>
      <p className="text-[#859394] text-sm max-w-md">
        This section isn't built out in the mockup yet. Head back to Personalized to see the Study Hub.
      </p>
      <button
        onClick={onBack}
        className="bg-[#251E1C] border border-solid border-[#3F3735] text-[#2CD4D9] text-xs font-bold py-2 px-4 hover:border-[#2CD4D9] transition-colors"
      >
        BACK TO STUDY HUB
      </button>
    </div>
  );
}
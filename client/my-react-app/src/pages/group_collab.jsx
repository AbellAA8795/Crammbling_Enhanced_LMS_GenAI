import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Chatbot from "./chatbot";
import Personalized from "./personalized";
import { useTheme, withAlpha, CloseIcon, MenuIcon } from "./Theme";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import Settings from "../components/Settings";
import QuizArena from "./QuizArena";
import { createPortal } from "react-dom";
import { ProfileButton, useProfile } from "../components/ProfileSystem";

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
};

const CLASSROOM_ICON =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='15' viewBox='0 0 24 24' fill='none' stroke='%232CD4D9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 10 12 5 2 10l10 5 10-5z'/><path d='M6 12v5c3 3 9 3 12 0v-5'/></svg>";

const PROFILE_ICON =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%232CD4D9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='4'/><path d='M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2'/></svg>";

const EDIT_ICON =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z'/></svg>";

function PencilIcon({ className, size = 10 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
    );
}

function FriendAddIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width="13" height="13">
            <circle cx="9" cy="8" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            <line x1="18" y1="6" x2="18" y2="12" /><line x1="15" y1="9" x2="21" y2="9" />
        </svg>
    );
}
function FriendCheckIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width="13" height="13">
            <circle cx="9" cy="8" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            <polyline points="16 11 18 13 22 9" />
        </svg>
    );
}
function ClockIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width="13" height="13">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
function CheckIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} width="13" height="13">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
function XIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} width="13" height="13">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
function BanIcon({ className, size = 13 }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
    );
}
function CalendarIcon({ className, size = 13 }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}
function ChevronDownIcon({ className, size = 10, open }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

const NAV_ITEMS = [
    { key: "dashboard", label: "DASHBOARD", icon: IMG.dashboard, iconClass: "w-[18px] h-[15px]" },
    { key: "classroom", label: "CLASSROOM", icon: CLASSROOM_ICON, iconClass: "w-[18px] h-[15px]" },
    { key: "chatbot", label: "CHATBOT", icon: IMG.chatbot, iconClass: "w-[18px] h-[15px]" },
    { key: "group", label: "GROUP COLLAB", icon: IMG.group, iconClass: "w-5 h-2.5" },
    { key: "personalized", label: "PERSONALIZED", icon: IMG.personalized, iconClass: "w-[18px] h-[13px]" },
];

const CURRENT_USER = { id: "you", name: "You" };
const POINT_PRESETS = [10, 25, 50, 100];
const ME = "you";

const BADGE_COLORS = ["var(--t-ac)", "var(--t-warn)", "var(--t-ok2)", "var(--t-ok)", "var(--t-err)", "var(--t-ac2)"];
function colorForString(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return BADGE_COLORS[h % BADGE_COLORS.length];
}

function initialsFor(name) {
    return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function findFriendship(friendships, a, b) {
    return friendships.find((f) => (f.from === a && f.to === b) || (f.from === b && f.to === a)) || null;
}
function friendStateFor(friendships, me, them) {
    if (me === them) return "self";
    const rel = findFriendship(friendships, me, them);
    if (!rel) return "none";
    if (rel.status === "accepted") return "friends";
    return rel.from === me ? "outgoing" : "incoming";
}
function getProfile(member, myProfile) {
    let h = 0;
    for (let i = 0; i < member.name.length; i++) h = (h * 31 + member.name.charCodeAt(i)) >>> 0;
    const isMe = member.id === ME;
    const source = isMe ? { ...member, ...myProfile } : member;
    return {
        id: member.id, name: source.name || member.name, role: member.role,
        avatarUrl: source.avatarUrl || null,
        handle: source.handle || `@${(source.name || member.name).toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        accountId: source.accountId || `CRB-${String(10000 + (h % 90000))}`,
        bio: source.bio || "",
        streak: source.streak ?? (h % 30) + 1,
        xp: source.xp ?? 500 + (h % 4000),
        bannerColor: source.bannerColor || null,
        bannerUrl: source.bannerUrl || null,
    };
}
function tabDefsFor(g) {
    if (!g) return [];
    if (g.type === "classroom") return [
        { key: "tasks", label: "Assignments" },
        { key: "materials", label: "Materials" },
        { key: "members", label: "Members" },
    ];
    if (g.type === "dm") return [{ key: "members", label: "Members" }];
    return [
        { key: "tasks", label: "Tasks" },
        { key: "files", label: "Files" },
        { key: "members", label: "Members" },
    ];
}

const INITIAL_GROUPS = [
    {
        id: "g1", name: "Algorithm Study Squad", type: "squad", color: "var(--t-ac)", picture: null,
        members: [
            { id: "you", name: "You", role: "admin" },
            { id: "m2", name: "Jess R.", role: "member" },
            { id: "m3", name: "Kayden L.", role: "member" },
        ],
        messages: [
            { id: "msg1", senderId: "m2", senderName: "Jess R.", text: "Did everyone see the new heap-sort slides?", time: "09:12" },
            { id: "msg2", senderId: "m3", senderName: "Kayden L.", text: "Yep, dropping my notes in Files now.", time: "09:14" },
        ],
        files: [{ id: "f1", name: "HeapSort_Notes.pdf", uploadedBy: "Kayden L.", size: "1.1 MB" }],
        tasks: [{ id: "t1", title: "Practice Set: Heaps", desc: "10 problems on heap operations.", due: "Fri, Mar 20", badge: "ALGORITHMS", createdBy: "You" }],
    },
    {
        id: "g2", name: "CS240 — Study Group", type: "classroom", color: "var(--t-ok)", picture: null,
        members: [
            { id: "you", name: "You", role: "member" },
            { id: "s2", name: "Maya K.", role: "member" },
            { id: "s3", name: "Alex Chen", role: "member" },
        ],
        messages: [{ id: "msg1", senderId: "you", senderName: "You", text: "Reminder: Midterm covers chapters 1-6.", time: "08:00" }],
        materials: [{ id: "mat1", title: "Chapter 5 Slides — Graph Traversals", kind: "Slides", addedBy: "Course Materials" }],
        tasks: [{ id: "at1", title: "Assignment 3: Dijkstra Implementation", desc: "Implement shortest path with a min-heap.", due: "Mon, Mar 23", points: 100, submissions: [{ studentId: "s2", studentName: "Maya K.", submittedAt: "Mar 19" }], createdBy: "You" }],
    },
    {
        id: "g3", name: "Discrete Math Circle", type: "squad", color: "var(--t-warn)", picture: null,
        members: [
            { id: "m4", name: "Priya N.", role: "admin" },
            { id: "you", name: "You", role: "member" },
            { id: "m5", name: "Owen T.", role: "member" },
        ],
        messages: [{ id: "msg3", senderId: "m4", senderName: "Priya N.", text: "Pushed the induction practice set to Tasks.", time: "10:02" }],
        files: [{ id: "f2", name: "Induction_CheatSheet.pdf", uploadedBy: "Priya N.", size: "640 KB" }],
        tasks: [{ id: "t2", title: "Practice Set: Induction Proofs", desc: "Problems 1-8, show your work.", due: "Mon, Mar 23", badge: "DISCRETE MATH", createdBy: "Priya N." }],
    },
    {
        id: "g4", name: "Riley P.", type: "dm", color: "var(--t-ac2)", picture: null,
        members: [
            { id: "you", name: "You", role: "member" },
            { id: "s4", name: "Riley P.", role: "member" },
        ],
        messages: [
            { id: "msg4", senderId: "s4", senderName: "Riley P.", text: "Hey, are you free to review the proofs later?", time: "11:20" },
            { id: "msg5", senderId: "you", senderName: "You", text: "Yeah, after 6pm works.", time: "11:22" },
        ],
    },
    {
        id: "g5", name: "MATH210 — Study Group", type: "classroom", color: "var(--t-ok2)", picture: null,
        members: [
            { id: "you", name: "You", role: "member" },
            { id: "s6", name: "Devon M.", role: "member" },
            { id: "s4", name: "Riley P.", role: "member" },
        ],
        messages: [{ id: "msg6", senderId: "s6", senderName: "Devon M.", text: "Assignment 2 grades are posted.", time: "07:45" }],
        materials: [{ id: "mat2", title: "Set Theory Review Deck", kind: "Slides", addedBy: "Course Materials" }],
        tasks: [{ id: "at2", title: "Assignment 2: Set Theory Proofs", desc: "Prove the given identities using set builder notation.", due: "Fri, Mar 14", points: 50, submissions: [{ studentId: "you", studentName: "You", submittedAt: "Mar 13" }], createdBy: "Devon M." }],
    },
];

const FILTERS = [
    { key: "all", label: "All" },
    { key: "classroom", label: "Classrooms" },
    { key: "dm", label: "1v1" },
    { key: "squad", label: "Squads" },
];

const SCROLLBAR_CSS = `
    .chat-scroll { scrollbar-width: thin; scrollbar-color: color-mix(in srgb, var(--t-ac) 45%, transparent) transparent; }
    .chat-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
    .chat-scroll::-webkit-scrollbar-track { background: transparent; }
    .chat-scroll::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--t-ac) 45%, transparent);
        border-radius: 999px; border: 2px solid transparent; background-clip: padding-box;
    }
    .chat-scroll::-webkit-scrollbar-thumb:hover {
        background: color-mix(in srgb, var(--t-ac) 70%, transparent); background-clip: padding-box;
    }
    .chat-scroll::-webkit-scrollbar-corner { background: transparent; }
    @keyframes mdSweep { from { transform: translateX(0); } to { transform: translateX(400%); } }
`;

function formatLongDate(iso) {
    if (!iso) return "";
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DOW_LETTERS = ["S","M","T","W","T","F","S"];

function DatePicker({ value, onChange, min }) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("days");
    const [rect, setRect] = useState(null);
    const [themeVars, setThemeVars] = useState({});
    const triggerRef = useRef(null);

    const [viewMonth, setViewMonth] = useState(() => {
        const base = value ? new Date(`${value}T00:00:00`) : new Date();
        return { y: base.getFullYear(), m: base.getMonth() };
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = min ? new Date(`${min}T00:00:00`) : today;

    const year = viewMonth.y;
    const month = viewMonth.m;
    const firstOfMonth = new Date(year, month, 1);
    const startDow = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    function isSameDay(a, b) {
        return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }
    function prevMonth() { setViewMonth((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })); }
    function nextMonth() { setViewMonth((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 })); }
    function pickDate(d) { if (!d || d < minDate) return; onChange(toISODate(d)); close(); }
    function pickMonth(m) { setViewMonth((v) => ({ ...v, m })); setMode("days"); }
    function pickYear(y) { setViewMonth((v) => ({ ...v, y })); setMode("days"); }
    function close() { setOpen(false); setMode("days"); }

    function openPicker() {
        const el = triggerRef.current;
        if (!el) return;
        setRect(el.getBoundingClientRect());

        const cs = getComputedStyle(el);
        const names = [
            "--t-bg0","--t-bg1","--t-bg2","--t-bg3",
            "--t-in0","--t-in1","--t-bd0","--t-bd1",
            "--t-mbg","--t-mbd","--t-mbd2","--t-mtx","--t-ph",
            "--t-tx0","--t-tx1","--t-tx2",
            "--t-ac","--t-ac2","--t-onac",
            "--t-warn","--t-ok","--t-ok2","--t-err",
            "--t-glow","--t-shadow",
        ];
        const vars = {};
        names.forEach((n) => {
            const v = cs.getPropertyValue(n);
            if (v && v.trim()) vars[n] = v.trim();
        });
        setThemeVars(vars);

        setOpen(true);
        setMode("days");
    }

    useEffect(() => {
        if (!open) return;
        const handler = () => close();
        window.addEventListener("scroll", handler, true);
        window.addEventListener("resize", handler);
        return () => {
            window.removeEventListener("scroll", handler, true);
            window.removeEventListener("resize", handler);
        };
    }, [open]);

    function computePlacement() {
        if (!rect) return null;
        const W = 300;
        const EST_H = 340;
        const MARGIN = 6;
        const spaceBelow = window.innerHeight - rect.bottom - MARGIN;
        const spaceAbove = rect.top - MARGIN;
        let top;
        if (spaceBelow >= EST_H) {
            top = rect.bottom + MARGIN;
        } else if (spaceAbove >= EST_H) {
            top = rect.top - EST_H - MARGIN;
        } else {
            top = spaceBelow >= spaceAbove ? rect.bottom + MARGIN : Math.max(8, rect.top - EST_H - MARGIN);
        }
        top = Math.max(8, Math.min(window.innerHeight - EST_H - 8, top));
        let left = rect.left;
        if (left + W > window.innerWidth - 8) left = window.innerWidth - W - 8;
        if (left < 8) left = 8;
        return { top, left, width: W };
    }

    const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
    const baseYear = today.getFullYear();
    const yearList = [];
    for (let y = baseYear - 10; y <= baseYear + 15; y++) yearList.push(y);

    const pos = open && rect ? computePlacement() : null;

    const solidBg = themeVars["--t-mbg"] || "#0e1512";
    const solidBd = themeVars["--t-mbd"] || "#2a3d38";

    const popup = pos
        ? createPortal(
            <>
                <div className="fixed inset-0 z-[99998]" onClick={close} />

                <div
                    className="fixed z-[99999] border border-solid p-3"
                    style={{
                        ...themeVars,
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        background: solidBg,
                        borderColor: solidBd,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.75), 0 0 30px rgba(0,200,180,0.15)",
                    }}
                >
                    <div className="flex items-center justify-between mb-3 gap-1">
                        {mode === "days" ? (
                            <button type="button" onClick={prevMonth} aria-label="Previous month"
                                className="w-7 h-7 flex items-center justify-center border border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg0)] text-[color:var(--t-tx1)] hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-colors">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                            </button>
                        ) : <span className="w-7" />}

                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setMode(mode === "months" ? "days" : "months")}
                                className={`flex items-center gap-1 px-2 py-1 text-xs font-bold tracking-wide border border-solid transition-colors ${mode === "months"
                                    ? "bg-[var(--t-bg3)] border-[color:var(--t-ac)] text-[color:var(--t-ac)]"
                                    : "border-transparent text-[color:var(--t-tx0)] hover:bg-[var(--t-bg3)] hover:border-[color:var(--t-bd0)]"}`}>
                                {MONTH_NAMES[month]} <ChevronDownIcon open={mode === "months"} size={8} />
                            </button>
                            <button type="button" onClick={() => setMode(mode === "years" ? "days" : "years")}
                                className={`flex items-center gap-1 px-2 py-1 text-xs font-bold tracking-wide border border-solid transition-colors ${mode === "years"
                                    ? "bg-[var(--t-bg3)] border-[color:var(--t-ac)] text-[color:var(--t-ac)]"
                                    : "border-transparent text-[color:var(--t-tx0)] hover:bg-[var(--t-bg3)] hover:border-[color:var(--t-bd0)]"}`}>
                                {year} <ChevronDownIcon open={mode === "years"} size={8} />
                            </button>
                        </div>

                        {mode === "days" ? (
                            <button type="button" onClick={nextMonth} aria-label="Next month"
                                className="w-7 h-7 flex items-center justify-center border border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg0)] text-[color:var(--t-tx1)] hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-colors">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                        ) : <span className="w-7" />}
                    </div>

                    {mode === "months" && (
                        <div className="chat-scroll grid grid-cols-3 gap-1 max-h-[220px] overflow-y-auto pr-1">
                            {MONTH_SHORT.map((name, i) => {
                                const active = i === month;
                                const lastOfMonth = new Date(year, i + 1, 0);
                                const disabled = lastOfMonth < minDate;
                                return (
                                    <button key={i} type="button" disabled={disabled} onClick={() => pickMonth(i)}
                                        className={`text-[11px] font-bold py-2.5 border border-solid transition-all duration-100 ${disabled ? "cursor-not-allowed opacity-30" : "active:scale-95"} ${active ? "bg-[var(--t-ac)] text-[color:var(--t-onac)] border-[color:var(--t-ac)]" : disabled ? "border-transparent text-[color:var(--t-tx1)]" : "border-transparent text-[color:var(--t-tx0)] hover:bg-[var(--t-bg3)] hover:border-[color:var(--t-bd0)]"}`}>
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {mode === "years" && (
                        <div className="chat-scroll grid grid-cols-3 gap-1 max-h-[220px] overflow-y-auto pr-1">
                            {yearList.map((y) => {
                                const active = y === year;
                                const disabled = y < minDate.getFullYear();
                                return (
                                    <button key={y} type="button" disabled={disabled} onClick={() => pickYear(y)}
                                        className={`text-[11px] font-bold py-2.5 border border-solid transition-all duration-100 ${disabled ? "cursor-not-allowed opacity-30" : "active:scale-95"} ${active ? "bg-[var(--t-ac)] text-[color:var(--t-onac)] border-[color:var(--t-ac)]" : disabled ? "border-transparent text-[color:var(--t-tx1)]" : "border-transparent text-[color:var(--t-tx0)] hover:bg-[var(--t-bg3)] hover:border-[color:var(--t-bd0)]"}`}>
                                        {y}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {mode === "days" && (
                        <>
                            <div className="grid grid-cols-7 gap-0.5 mb-1">
                                {DOW_LETTERS.map((d, i) => (
                                    <span key={i} className="text-[color:var(--t-mtx)] text-[10px] font-bold text-center py-1">{d}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-0.5">
                                {cells.map((d, i) => {
                                    if (!d) return <span key={i} />;
                                    const past = d < minDate;
                                    const isToday = isSameDay(d, today);
                                    const isSelected = isSameDay(d, selectedDate);
                                    return (
                                        <button key={i} type="button" disabled={past} onClick={() => pickDate(d)}
                                            className={`h-8 text-[11px] font-bold flex items-center justify-center border border-solid transition-all duration-100 ${past ? "cursor-not-allowed opacity-30" : "active:scale-95"} ${isSelected ? "bg-[var(--t-ac)] text-[color:var(--t-onac)] border-[color:var(--t-ac)]" : isToday ? "bg-[var(--t-bg3)] border-[color:var(--t-ac)] text-[color:var(--t-ac)]" : past ? "border-transparent text-[color:var(--t-tx1)]" : "border-transparent text-[color:var(--t-tx0)] hover:bg-[var(--t-bg3)] hover:border-[color:var(--t-bd0)]"}`}>
                                            {d.getDate()}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-solid border-[color:var(--t-bd0)]">
                                <button type="button" onClick={() => { onChange(toISODate(today)); close(); }}
                                    className="text-[color:var(--t-ac)] text-[10px] font-bold hover:underline underline-offset-2 transition-colors">Today</button>
                                {value && (
                                    <button type="button" onClick={() => { onChange(""); close(); }}
                                        className="text-[color:var(--t-mtx)] text-[10px] font-bold hover:text-[color:var(--t-err)] transition-colors">Clear</button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </>,
            document.body
        )
        : null;

    return (
        <div className="relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={open ? close : openPicker}
                aria-haspopup="dialog"
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-2 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2.5 px-3 text-left outline-none transition-colors duration-200 hover:border-[color:var(--t-ac)] focus:border-[color:var(--t-ac)]"
            >
                <span className="flex items-center gap-2 min-w-0">
                    <CalendarIcon className="shrink-0 opacity-70" />
                    <span className={`truncate ${value ? "" : "text-[color:var(--t-ph)]"}`}>
                        {value ? formatLongDate(value) : "Pick a date"}
                    </span>
                </span>
                <ChevronDownIcon open={open} className="shrink-0 opacity-70" />
            </button>
            {popup}
        </div>
    );
}

function ImageCropperModal({ src, aspect = 1, title = "ADJUST IMAGE", onSave, onClose }) {
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
            <div className="absolute inset-0 bg-black/85" onClick={onClose} />
            <div className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_95%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-md overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px color-mix(in srgb, var(--t-glow) 25%, transparent)" }}>
                <div className="flex justify-between items-center px-5 pt-4 pb-3 border-b border-solid border-[color:var(--t-mbd)]">
                    <span className="text-[color:var(--t-tx0)] text-sm font-bold tracking-wide">{title}</span>
                    <button onClick={onClose} className="text-[color:var(--t-mtx)] text-xl leading-none hover:text-[color:var(--t-ac2)] transition-colors" aria-label="Close">×</button>
                </div>
                <div className="flex flex-col items-center gap-4 px-5 py-5">
                    <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
                        className="relative overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none touch-none" style={{ width: CROP_W, height: CROP_H }}>
                        <img ref={imgRef} src={src} alt="" draggable={false} onLoad={handleImgLoad} className="absolute pointer-events-none select-none"
                            style={{ width: dispW, height: dispH, left: (CROP_W - dispW) / 2 + offset.x, top: (CROP_H - dispH) / 2 + offset.y, maxWidth: "none" }} />
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
                            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
                            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
                            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
                        </div>
                    </div>
                    <div className="w-full flex items-center gap-3">
                        <span className="text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider">ZOOM</span>
                        <input type="range" min="1" max="4" step="0.01" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="flex-1 accent-[var(--t-ac)]" />
                        <button type="button" onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }} className="text-[color:var(--t-mtx)] text-[10px] font-bold hover:text-[color:var(--t-ac)] transition-colors">RESET</button>
                    </div>
                    <p className="text-[color:var(--t-ph)] text-[10px] text-center">Drag the image to reposition. Use the slider to zoom.</p>
                </div>
                <div className="flex gap-2 px-5 pb-5">
                    <button type="button" onClick={onClose} className="flex-1 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-xs font-bold py-2.5 hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-tx0)] transition-all duration-150 active:scale-[0.98]">CANCEL</button>
                    <button type="button" onClick={handleSave} className="flex-1 bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2.5 hover:opacity-90 transition-all duration-150 active:scale-[0.98]">APPLY</button>
                </div>
            </div>
        </div>
    );
}

function Panel({ title, count, children, action }) {
    return (
        <div className="flex flex-col self-stretch gap-3">
            <div className="flex justify-between items-center">
                <span className="text-[color:var(--t-tx0)] text-xs font-bold tracking-wide">
                    {title} {typeof count === "number" && <span className="text-[color:var(--t-tx2)] font-normal">({count})</span>}
                </span>
                {action}
            </div>
            {children}
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
function Avatar({ name, size = 28, onClick, color, avatarUrl }) {
    const c = color || colorForString(name);
    const style = { width: size, height: size, fontSize: Math.max(9, size * 0.36), backgroundColor: withAlpha(c, "33"), color: c, border: `1px solid ${withAlpha(c, "4D")}` };
    const cls = "shrink-0 flex items-center justify-center font-bold rounded-full overflow-hidden";
    const inner = avatarUrl ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" /> : initialsFor(name);
    if (!onClick) return (<div className={cls} style={style}>{inner}</div>);
    return (
        <button type="button" onClick={onClick} title={`View ${name}'s profile`} aria-label={`View ${name}'s profile`}
            className={`${cls} transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-95`} style={style}>
            {inner}
        </button>
    );
}
function TabIcon({ type, className }) {
    const common = { width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", className };
    switch (type) {
        case "tasks": return (<svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><polyline points="8 15 11 18 16 13" /></svg>);
        case "files": return (<svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>);
        case "materials": return (<svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);
        case "members": return (<svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
        default: return null;
    }
}
function FilterDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const current = FILTERS.find((f) => f.key === value) || FILTERS[0];
    return (
        <div className="relative">
            <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={open}
                className="flex items-center justify-between w-full bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] py-1.5 pl-2.5 pr-2 text-[11px] font-bold text-[color:var(--t-tx1)] hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-tx0)] transition-all duration-150 active:scale-[0.99]">
                <span className="flex items-center gap-1.5 min-w-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                    <span className="truncate">{current.label}</span>
                </span>
                <ChevronDownIcon open={open} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-[5]" onClick={() => setOpen(false)} />
                    <div role="listbox" className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] overflow-hidden" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 20px color-mix(in srgb, var(--t-glow) 20%, transparent)" }}>
                        {FILTERS.map((f) => {
                            const active = f.key === value;
                            return (
                                <button key={f.key} role="option" aria-selected={active} onClick={() => { onChange(f.key); setOpen(false); }}
                                    className={`flex items-center justify-between w-full text-left px-2.5 py-1.5 text-[11px] font-bold transition-colors duration-100 ${active ? "bg-[var(--t-bg3)] text-[color:var(--t-ac)]" : "text-[color:var(--t-tx1)] hover:bg-[var(--t-bg3)] hover:text-[color:var(--t-tx0)]"}`}>
                                    <span>{f.label}</span>
                                    {active && (<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>)}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

function AddMemberModal({ onClose, onAdd }) {
    const [method, setMethod] = useState("id");
    const [value, setValue] = useState("");
    const placeholders = { id: "e.g. CRB-48213", username: "e.g. @kaydenL", gmail: "e.g. student@gmail.com" };
    function submit(e) { e.preventDefault(); if (!value.trim()) return; onAdd(value.trim()); setValue(""); }
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form onSubmit={submit} className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_90%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] p-5 w-full max-w-sm flex flex-col gap-3" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 40px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[color:var(--t-tx0)] text-sm font-bold">ADD MEMBER</span>
                    <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-lg leading-none hover:text-[color:var(--t-ac2)] transition-colors">×</button>
                </div>
                <div className="flex gap-1.5">
                    {[{ id: "id", label: "Account ID" }, { id: "username", label: "Username" }, { id: "gmail", label: "Gmail" }].map((m) => (
                        <button type="button" key={m.id} onClick={() => setMethod(m.id)}
                            className={`flex-1 text-[10px] font-bold py-1.5 border border-solid transition-all duration-150 active:scale-95 ${method === m.id ? "bg-[var(--t-in1)] border-[color:var(--t-ac)] text-[color:var(--t-ac)]" : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-tx1)]"}`}>
                            {m.label}
                        </button>
                    ))}
                </div>
                <input autoFocus value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholders[method]}
                    className="bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac)] transition-colors" />
                <button type="submit" className="mt-1 bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2 hover:opacity-90 transition-all duration-150 active:scale-[0.98]">ADD TO GROUP</button>
            </form>
        </div>
    );
}

const CHAT_TYPES = [
    { id: "classroom", label: "Classroom", color: "var(--t-ok)" },
    { id: "dm", label: "1v1", color: "var(--t-ac2)" },
    { id: "squad", label: "Squad", color: "var(--t-ac)" },
];
function CreateGroupModal({ onClose, onCreate }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("classroom");
    function submit(e) { e.preventDefault(); if (!name.trim()) return; onCreate(name.trim(), type); }
    const isDm = type === "dm";
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form onSubmit={submit} className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_90%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] p-5 w-full max-w-sm flex flex-col gap-3" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 40px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[color:var(--t-tx0)] text-sm font-bold">NEW MESSAGE</span>
                    <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-lg leading-none hover:text-[color:var(--t-ac2)] transition-colors">×</button>
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Type</span>
                    <div className="flex gap-1.5">
                        {CHAT_TYPES.map((t) => {
                            const active = type === t.id;
                            return (
                                <button type="button" key={t.id} onClick={() => setType(t.id)} className="flex-1 text-[11px] font-bold py-2 border border-solid transition-all duration-150 active:scale-95"
                                    style={{ backgroundColor: active ? withAlpha(t.color, "22") : "var(--t-in0)", borderColor: active ? t.color : "var(--t-mbd)", color: active ? t.color : "var(--t-mtx)" }}>
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <label className="flex flex-col gap-1">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">{isDm ? "Person's name" : "Name"}</span>
                    <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={isDm ? "e.g. Riley P." : "e.g. Discrete Math Study Group"}
                        className="bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac)] transition-colors" />
                </label>
                <button type="submit" className="mt-1 bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2 hover:opacity-90 transition-all duration-150 active:scale-[0.98]">CREATE</button>
            </form>
        </div>
    );
}

function toISODate(d) { const p = (n) => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; }
function formatDue(iso) { if (!iso) return ""; const d = new Date(`${iso}T00:00:00`); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
function daysUntil(iso) { if (!iso) return null; const today = new Date(); today.setHours(0, 0, 0, 0); return Math.round((new Date(`${iso}T00:00:00`) - today) / 86400000); }

function NewTaskModal({ isClassroom, onClose, onCreate }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [due, setDue] = useState("");
    const [badge, setBadge] = useState("");
    const [points, setPoints] = useState(100);
    const [launching, setLaunching] = useState(false);
    const checks = [!!title.trim(), !!desc.trim(), !!due, isClassroom ? Number(points) > 0 : !!badge.trim()];
    const done = checks.filter(Boolean).length;
    const pct = (done / checks.length) * 100;
    const complete = done === checks.length;
    const barColor = pct < 50 ? "var(--t-warn)" : pct < 100 ? "var(--t-ac2)" : "var(--t-ok)";
    const left = daysUntil(due);
    const dueHint = left === null ? null : left < 0 ? "In the past" : left === 0 ? "Due today" : left === 1 ? "Due tomorrow" : `${left} days to go`;
    function quickDue(offset) { const d = new Date(); d.setDate(d.getDate() + offset); setDue(toISODate(d)); }
    function submit(e) {
        e.preventDefault(); if (!title.trim() || launching) return;
        setLaunching(true);
        setTimeout(() => { onCreate({ title: title.trim(), desc: desc.trim(), due: formatDue(due), badge: badge.trim().toUpperCase(), points: Number(points) || 0 }); }, 450);
    }
    const accent = isClassroom ? "var(--t-ok)" : "var(--t-ac)";
    const field = "w-full bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2.5 px-3 text-left outline-none transition-all duration-200 placeholder:text-[color:var(--t-ph)] focus:border-[color:var(--t-ac)] focus:bg-[var(--t-in1)]";
    const Label = ({ children, ok }) => (
        <span className="flex items-center gap-1.5 text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider text-left uppercase">
            <span className="inline-flex items-center justify-center w-3 h-3 rounded-full text-[8px] leading-none transition-all duration-300"
                style={{ backgroundColor: ok ? "var(--t-ok)" : "transparent", border: `1px solid ${ok ? "var(--t-ok)" : "var(--t-mbd2)"}`, color: "var(--t-mbg)", transform: ok ? "scale(1.15)" : "scale(1)" }}>
                {ok ? "✓" : ""}
            </span>
            {children}
        </span>
    );
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <style>{`
                @keyframes ntPop { from { opacity: 0; transform: translateY(14px) scale(.96); } to { opacity: 1; transform: none; } }
                @keyframes ntShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
                @keyframes ntLaunch { to { transform: translateY(-40px) scale(.9); opacity: 0; } }
                .nt-num::-webkit-inner-spin-button { opacity: .4; }
            `}</style>
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form onSubmit={submit} className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_95%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-md overflow-hidden"
                style={{ boxShadow: `0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${withAlpha(accent, "22")}`, animation: launching ? "ntLaunch .45s ease-in forwards" : "ntPop .28s cubic-bezier(.2,.9,.3,1.2)" }}>
                <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}, var(--t-warn), ${accent})` }} />
                <div className="flex justify-between items-start px-5 pt-4 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center text-base border border-solid" style={{ backgroundColor: withAlpha(accent, "22"), borderColor: withAlpha(accent, "55"), color: accent }}>
                            {isClassroom ? "🎓" : "✦"}
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[color:var(--t-tx0)] text-sm font-bold tracking-wide">{isClassroom ? "NEW ASSIGNMENT" : "NEW TASK"}</span>
                            <span className="text-[color:var(--t-mtx)] text-[11px]">{complete ? "All set — ready to launch!" : `${done} of ${checks.length} details filled in`}</span>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-xl leading-none hover:text-[color:var(--t-ac2)]" aria-label="Close">×</button>
                </div>
                <div className="px-5 pb-4">
                    <div className="relative h-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] overflow-hidden">
                        <div className="absolute inset-y-0 left-0 transition-all duration-500 ease-out overflow-hidden" style={{ width: `${pct}%`, backgroundColor: barColor }}>
                            {pct > 0 && (<div className="absolute inset-y-0 w-1/3" style={{ background: "linear-gradient(90deg, transparent, #ffffff88, transparent)", animation: "ntShimmer 1.8s linear infinite" }} />)}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 px-5 pb-5">
                    <label className="flex flex-col gap-1.5">
                        <Label ok={checks[0]}>Title</Label>
                        <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isClassroom ? "e.g. Problem Set 4" : "e.g. Finish chapter 3 notes"} className={field} />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <Label ok={checks[1]}>Description</Label>
                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="What needs to be done?" className={`${field} resize-none`} />
                    </label>

                    <div className="flex flex-col gap-1.5">
                        <Label ok={checks[2]}>Due date</Label>
                        <DatePicker value={due} onChange={setDue} min={toISODate(new Date())} />
                        <div className="flex items-center flex-wrap gap-1.5 min-h-[22px]">
                            {[["Today", 0], ["Tomorrow", 1], ["Next week", 7]].map(([label, off]) => {
                                const active = due === toISODate(new Date(Date.now() + off * 86400000));
                                return (
                                    <button key={label} type="button" onClick={() => quickDue(off)}
                                        className={`text-[10px] font-bold py-0.5 px-2 border border-solid transition-all duration-150 active:scale-95 ${active ? "bg-[color-mix(in_srgb,_var(--t-ac)_20%,_transparent)] border-[color:var(--t-ac)] text-[color:var(--t-ac)]" : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-ac2)]"}`}>
                                        {label}
                                    </button>
                                );
                            })}
                            {dueHint && (<span className="ml-auto text-[10px] font-bold" style={{ color: left < 0 ? "var(--t-err)" : left <= 1 ? "var(--t-warn)" : "var(--t-ok2)" }}>⏳ {dueHint}</span>)}
                        </div>
                    </div>

                    {isClassroom ? (
                        <div className="flex flex-col gap-1.5">
                            <Label ok={checks[3]}>Points</Label>
                            <div className="flex items-stretch gap-1.5">
                                {POINT_PRESETS.map((p) => (
                                    <button key={p} type="button" onClick={() => setPoints(p)}
                                        className={`flex-1 text-xs font-bold py-2 border border-solid transition-all duration-150 active:scale-95 ${Number(points) === p ? "bg-[color-mix(in_srgb,_var(--t-warn)_20%,_transparent)] border-[color:var(--t-warn)] text-[color:var(--t-warn)]" : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-warn)] hover:text-[color:var(--t-warn)]"}`}>
                                        {p}
                                    </button>
                                ))}
                                <input type="number" min="0" value={points} onChange={(e) => setPoints(e.target.value)} className={`${field} nt-num !w-20 !py-2 text-center`} />
                            </div>
                        </div>
                    ) : (
                        <label className="flex flex-col gap-1.5">
                            <Label ok={checks[3]}>Badge / subject</Label>
                            <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. CS240" className={field} />
                            {badge.trim() && (<span className="self-start"><Badge color={colorForString(badge.trim().toUpperCase())}>{badge.trim().toUpperCase()}</Badge></span>)}
                        </label>
                    )}
                    <button type="submit" disabled={!title.trim() || launching}
                        className="relative overflow-hidden text-xs font-bold py-3 tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:brightness-110"
                        style={{ backgroundColor: complete ? "var(--t-ok)" : "var(--t-ac)", color: complete ? "var(--t-onok2)" : "var(--t-onac)" }}>
                        {launching ? "🚀 LAUNCHING..." : complete ? `🚀 ${isClassroom ? "POST ASSIGNMENT" : "ADD TASK"}` : isClassroom ? "POST ASSIGNMENT" : "ADD TASK"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function ProfileModal({ member, groups, myProfile, roles, friendState, isBlocked, onClose, onMessage, onEdit, onAddFriend, onAcceptFriend, onRemoveFriend, onToggleBlock }) {
    if (!member) return null;
    const p = getProfile(member, myProfile);
    const isMe = member.id === ME;
    const color = colorForString(p.name);
    const shared = groups.filter((g) => g.type !== "dm" && g.members.some((m) => m.id === member.id));
    const roleList = roles || [];
    return (
        <div className="fixed inset-0 z-[65] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_92%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-sm overflow-hidden flex flex-col max-h-[88vh]" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 40px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}>
                <button onClick={onClose} aria-label="Close" className="absolute top-2 right-3 z-20 text-[color:var(--t-tx0)] text-xl leading-none hover:text-[color:var(--t-ac2)] transition-colors">×</button>
                <div className="relative shrink-0">
                    <div className="h-20 w-full" style={p.bannerUrl ? { backgroundImage: `url(${p.bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: p.bannerColor || `linear-gradient(135deg, ${withAlpha(color, "88")}, ${withAlpha(color, "22")})` }} />
                    <div className="absolute left-5 -bottom-10 rounded-full p-1" style={{ backgroundColor: "var(--t-mbg)" }}>
                        <Avatar name={p.name} size={72} color={color} avatarUrl={p.avatarUrl} />
                    </div>
                </div>
                <div className="chat-scroll flex-1 overflow-y-auto px-5 pt-12 pb-5">
                    <div className="text-left flex items-center gap-2 flex-wrap">
                        <span className="text-[color:var(--t-tx0)] text-base font-bold leading-tight">{isMe ? (p.name || "You") : p.name}</span>
                        {isBlocked && <span className="text-[10px] font-bold py-0.5 px-2 border border-solid shrink-0 bg-[color-mix(in_srgb,_var(--t-err)_20%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-err)_45%,_transparent)] text-[color:var(--t-err)]">BLOCKED</span>}
                    </div>
                    <span className="text-[color:var(--t-mtx)] text-[11px] block text-left">{p.handle} · {p.accountId}</span>
                    {p.bio && (
                        <div className="mt-4 text-left">
                            <span className="text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider uppercase">About Me</span>
                            <p className="text-[color:var(--t-tx1)] text-xs mt-1 whitespace-pre-wrap">{p.bio}</p>
                        </div>
                    )}
                    {roleList.length > 0 && (
                        <div className="mt-4 text-left">
                            <span className="text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider uppercase">Roles</span>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {roleList.map((r, i) => (<Badge key={i} color={r.color || "var(--t-ac)"}>{r.label}</Badge>))}
                            </div>
                        </div>
                    )}
                    <div className="flex gap-2 w-full mt-4">
                        <div className="flex-1 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] py-2 text-center">
                            <span className="block text-[color:var(--t-warn)] text-sm font-bold">{p.streak}</span>
                            <span className="text-[color:var(--t-mtx)] text-[10px]">STREAK</span>
                        </div>
                        <div className="flex-1 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] py-2 text-center">
                            <span className="block text-[color:var(--t-ac)] text-sm font-bold">{p.xp.toLocaleString()}</span>
                            <span className="text-[color:var(--t-mtx)] text-[10px]">XP</span>
                        </div>
                    </div>
                    {shared.length > 0 && (
                        <div className="w-full mt-4 text-left">
                            <span className="text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider uppercase">{isMe ? "Your Groups" : "Shared Groups"} ({shared.length})</span>
                            <div className="chat-scroll flex flex-col gap-1 mt-1.5 max-h-32 overflow-y-auto">
                                {shared.map((g) => (
                                    <div key={g.id} className="flex items-center gap-2 text-xs text-[color:var(--t-tx1)]">
                                        <Avatar name={g.name} size={18} color={g.color} avatarUrl={g.picture} />
                                        <span className="truncate">{g.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="shrink-0 border-t border-solid border-[color:var(--t-mbd)] p-3">
                    {isMe ? (
                        <button onClick={() => onEdit && onEdit()} className="flex items-center justify-center gap-2 w-full bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2 hover:opacity-90 transition-all duration-150 active:scale-[0.98]">
                            <img src={EDIT_ICON} alt="" className="w-3 h-3" /> EDIT PROFILE
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {friendState === "incoming" && (
                                <div className="flex gap-2">
                                    <button onClick={() => onAcceptFriend && onAcceptFriend(member)} className="flex flex-1 items-center justify-center gap-1.5 bg-[var(--t-ok)] text-[color:var(--t-onok2)] text-xs font-bold py-2 hover:opacity-90 transition-all duration-150 active:scale-[0.98]">
                                        <CheckIcon /> ACCEPT
                                    </button>
                                    <button onClick={() => onRemoveFriend && onRemoveFriend(member)} className="flex flex-1 items-center justify-center gap-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-xs font-bold py-2 hover:border-[color:var(--t-err)] hover:text-[color:var(--t-err)] transition-all duration-150 active:scale-[0.98]">
                                        <XIcon /> DECLINE
                                    </button>
                                </div>
                            )}
                            <div className="flex gap-2">
                                {friendState === "none" && (
                                    <button onClick={() => onAddFriend && onAddFriend(member)} className="flex flex-1 items-center justify-center gap-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-xs font-bold py-2 hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.98]">
                                        <FriendAddIcon /> ADD FRIEND
                                    </button>
                                )}
                                {friendState === "outgoing" && (
                                    <button onClick={() => onRemoveFriend && onRemoveFriend(member)} title="Click to cancel your request" className="flex flex-1 items-center justify-center gap-1.5 bg-[color-mix(in_srgb,_var(--t-warn)_12%,_transparent)] border border-solid border-[color:color-mix(in_srgb,_var(--t-warn)_45%,_transparent)] text-[color:var(--t-warn)] text-xs font-bold py-2 hover:border-[color:color-mix(in_srgb,_var(--t-err)_50%,_transparent)] hover:text-[color:var(--t-err)] transition-all duration-150 active:scale-[0.98]">
                                        <ClockIcon /> REQUEST SENT
                                    </button>
                                )}
                                {friendState === "friends" && (
                                    <button onClick={() => onRemoveFriend && onRemoveFriend(member)} title="Click to remove friend" className="flex flex-1 items-center justify-center gap-1.5 bg-[color-mix(in_srgb,_var(--t-ok)_18%,_transparent)] border border-solid border-[color:color-mix(in_srgb,_var(--t-ok)_50%,_transparent)] text-[color:var(--t-ok2)] text-xs font-bold py-2 hover:border-[color:color-mix(in_srgb,_var(--t-err)_50%,_transparent)] hover:text-[color:var(--t-err)] transition-all duration-150 active:scale-[0.98]">
                                        <FriendCheckIcon /> FRIENDS
                                    </button>
                                )}
                                <button
                                    onClick={() => onMessage && onMessage(member)}
                                    disabled={isBlocked}
                                    title={isBlocked ? "Unblock to message" : "Send a message"}
                                    className={`flex-1 text-xs font-bold py-2 transition-all duration-150 ${isBlocked
                                        ? "bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] cursor-not-allowed opacity-60"
                                        : "bg-[var(--t-ac)] text-[color:var(--t-onac)] hover:opacity-90 active:scale-[0.98]"
                                        }`}
                                >
                                    MESSAGE
                                </button>
                            </div>

                            <button
                                onClick={() => onToggleBlock && onToggleBlock(member)}
                                title={isBlocked ? "Unblock this user" : "Block this user"}
                                className={`flex items-center justify-center gap-1.5 w-full text-xs font-bold py-2 border border-solid transition-all duration-150 active:scale-[0.98] ${isBlocked
                                    ? "bg-[color-mix(in_srgb,_var(--t-err)_18%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-err)_50%,_transparent)] text-[color:var(--t-err)] hover:bg-[color-mix(in_srgb,_var(--t-ok)_15%,_transparent)] hover:border-[color:color-mix(in_srgb,_var(--t-ok)_50%,_transparent)] hover:text-[color:var(--t-ok2)]"
                                    : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] hover:border-[color:var(--t-err)] hover:text-[color:var(--t-err)]"
                                    }`}
                            >
                                <BanIcon />
                                {isBlocked ? "UNBLOCK" : "BLOCK"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const BANNER_SWATCHES = ["#2CD4D9", "#3DDC84", "#F5B301", "#E5484D", "#8B5CF6", "#EC4899", "#3B82F6", "#64748B"];

function EditProfileModal({ myProfile, onClose, onSave }) {
    const [name, setName] = useState(myProfile.name || "You");
    const [handle, setHandle] = useState(myProfile.handle || "@you");
    const [bio, setBio] = useState(myProfile.bio || "");
    const [avatarUrl, setAvatarUrl] = useState(myProfile.avatarUrl || "");
    const [bannerUrl, setBannerUrl] = useState(myProfile.bannerUrl || "");
    const [bannerColor, setBannerColor] = useState(myProfile.bannerColor || "");
    const [avatarError, setAvatarError] = useState("");
    const [bannerError, setBannerError] = useState("");
    const [cropper, setCropper] = useState(null);
    const MAX_BYTES = 5 * 1024 * 1024;

    function pickImage(file, target, setErr) {
        setErr("");
        if (!file) return;
        if (!file.type.startsWith("image/")) { setErr("Please pick an image file."); return; }
        if (file.size > MAX_BYTES) { setErr("Image is too large (max 5 MB)."); return; }
        const reader = new FileReader();
        reader.onload = () => setCropper({ src: String(reader.result || ""), target });
        reader.onerror = () => setErr("Could not read that file.");
        reader.readAsDataURL(file);
    }
    function handleCropSave(url) {
        if (!cropper) return;
        if (cropper.target === "avatar") setAvatarUrl(url); else setBannerUrl(url);
        setCropper(null);
    }
    function submit(e) {
        e.preventDefault();
        onSave({ name: name.trim() || "You", handle: handle.trim() || "@you", bio: bio.trim(), avatarUrl: avatarUrl || null, bannerUrl: bannerUrl || null, bannerColor: bannerColor || null });
    }
    const field = "w-full bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2 px-3 text-left outline-none transition-all duration-200 placeholder:text-[color:var(--t-ph)] focus:border-[color:var(--t-ac)] focus:bg-[var(--t-in1)]";
    const Label = ({ children }) => (<span className="text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider uppercase text-left">{children}</span>);
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/75" onClick={onClose} />
            <form onSubmit={submit} className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_95%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}>
                <div className="h-0.5 w-full shrink-0" style={{ background: `linear-gradient(90deg, var(--t-ac), var(--t-warn), var(--t-ac))` }} />
                <div className="flex justify-between items-center px-5 pt-4 pb-3 border-b border-solid border-[color:var(--t-mbd)] shrink-0">
                    <span className="text-[color:var(--t-tx0)] text-sm font-bold tracking-wide">EDIT PROFILE</span>
                    <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-xl leading-none hover:text-[color:var(--t-ac2)] transition-colors" aria-label="Close">×</button>
                </div>
                <div className="chat-scroll flex flex-col gap-4 px-5 py-5 overflow-y-auto">
                    <label className="flex flex-col gap-1.5">
                        <Label>Display name</Label>
                        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={32} placeholder="e.g. You" className={field} />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <Label>Username</Label>
                        <div className="flex items-center bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] focus-within:border-[color:var(--t-ac)] focus-within:bg-[var(--t-in1)] transition-all duration-200">
                            <span className="pl-3 text-[color:var(--t-mtx)] text-xs select-none pointer-events-none">@</span>
                            <input
                                value={handle.replace(/^@/, "")}
                                onChange={(e) => {
                                    const next = e.target.value.replace(/^@+/, "").replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();
                                    setHandle("@" + next);
                                }}
                                maxLength={23}
                                placeholder="you"
                                className="flex-1 bg-transparent border-0 text-[color:var(--t-tx0)] text-xs py-2 pr-3 outline-none placeholder:text-[color:var(--t-ph)]"
                            />
                        </div>
                        <span className="text-[color:var(--t-ph)] text-[10px] text-left">Shown as @username · people can find you with this.</span>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <Label>About me</Label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={190} rows={3} placeholder="Tell people a little about yourself..." className={`${field} resize-none`} />
                        <span className="text-[color:var(--t-ph)] text-[10px] text-right">{bio.length}/190</span>
                    </label>
                    <div className="flex flex-col gap-1.5">
                        <Label>Avatar</Label>
                        <div className="flex items-center gap-3">
                            <div className="shrink-0 overflow-hidden rounded-full border border-solid border-[color:var(--t-mbd)] bg-[var(--t-in0)] flex items-center justify-center" style={{ width: 56, height: 56 }}>
                                {avatarUrl ? (<img src={avatarUrl} alt="" className="w-full h-full object-cover" />) : (<span className="text-[color:var(--t-ph)] text-[10px]">No avatar</span>)}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <label htmlFor="edit-profile-avatar" className="flex items-center justify-center gap-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-[11px] font-bold py-2 px-3 cursor-pointer hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.98]">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    {avatarUrl ? "Change" : "Choose file"}
                                </label>
                                <input id="edit-profile-avatar" type="file" accept="image/*" className="hidden"
                                    onChange={(e) => { pickImage(e.target.files?.[0], "avatar", setAvatarError); e.target.value = ""; }} />
                                {avatarUrl && (<button type="button" onClick={() => setAvatarUrl("")} className="text-[color:var(--t-mtx)] text-[10px] font-bold hover:text-[color:var(--t-err)] transition-colors self-start">Remove</button>)}
                            </div>
                        </div>
                        {avatarError && <span className="text-[color:var(--t-err)] text-[10px]">{avatarError}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Banner image (optional)</Label>
                        <div className="flex items-center gap-3">
                            <div className="shrink-0 overflow-hidden border border-solid border-[color:var(--t-mbd)] bg-[var(--t-in0)]" style={{ width: 96, height: 32 }}>
                                {bannerUrl ? (<img src={bannerUrl} alt="" className="w-full h-full object-cover" />) : (<span className="w-full h-full flex items-center justify-center text-[color:var(--t-ph)] text-[9px]">No banner</span>)}
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <label htmlFor="edit-profile-banner" className="flex items-center justify-center gap-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-[11px] font-bold py-2 px-3 cursor-pointer hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.98]">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    {bannerUrl ? "Change" : "Choose file"}
                                </label>
                                <input id="edit-profile-banner" type="file" accept="image/*" className="hidden"
                                    onChange={(e) => { pickImage(e.target.files?.[0], "banner", setBannerError); e.target.value = ""; }} />
                                {bannerUrl && (<button type="button" onClick={() => setBannerUrl("")} className="text-[color:var(--t-mtx)] text-[10px] font-bold hover:text-[color:var(--t-err)] transition-colors self-start">Remove</button>)}
                            </div>
                        </div>
                        {bannerError && <span className="text-[color:var(--t-err)] text-[10px]">{bannerError}</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label>Banner color (fallback)</Label>
                        <div className="h-10 w-full border border-solid border-[color:var(--t-mbd)]" style={{ background: bannerColor || "var(--t-in0)" }} />
                        <div className="flex flex-wrap items-center gap-1.5">
                            {BANNER_SWATCHES.map((c) => (
                                <button key={c} type="button" onClick={() => setBannerColor(c)} aria-label={`Banner color ${c}`}
                                    className="w-6 h-6 rounded-full border-2 border-solid transition-transform duration-150 hover:scale-110 active:scale-95"
                                    style={{ backgroundColor: c, borderColor: bannerColor === c ? "var(--t-tx0)" : "transparent" }} />
                            ))}
                            <label className="relative w-6 h-6 rounded-full overflow-hidden cursor-pointer border border-solid border-[color:var(--t-mbd)] hover:scale-110 transition-transform" title="Custom color" style={{ background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" }}>
                                <input type="color" value={bannerColor || "#2CD4D9"} onChange={(e) => setBannerColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </label>
                            {bannerColor && (<button type="button" onClick={() => setBannerColor("")} className="ml-1 text-[color:var(--t-mtx)] text-[10px] font-bold hover:text-[color:var(--t-err)] transition-colors">Reset</button>)}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 px-5 pb-5 shrink-0">
                    <button type="button" onClick={onClose} className="flex-1 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-xs font-bold py-2.5 hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-tx0)] transition-all duration-150 active:scale-[0.98]">CANCEL</button>
                    <button type="submit" className="flex-1 bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2.5 hover:opacity-90 transition-all duration-150 active:scale-[0.98]">SAVE</button>
                </div>
            </form>
            {cropper && (
                <ImageCropperModal src={cropper.src} aspect={cropper.target === "avatar" ? 1 : 3}
                    title={cropper.target === "avatar" ? "ADJUST AVATAR" : "ADJUST BANNER"}
                    onSave={handleCropSave} onClose={() => setCropper(null)} />
            )}
        </div>
    );
}

function GroupDetailModal({ group, isClassroom, isDm, canAddMembers, canCreateTask, tab, onTabChange, tabDefs, onClose, onNewTask, onAddMember, onSubmitTask, onPromote, onKick, onViewProfile, isAdmin, canChangePicture, onChangePicture }) {
    if (!group) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_90%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-lg max-h-[85vh] flex flex-col" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 50px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}>
                <div className="flex justify-between items-center p-4 border-b border-solid border-[color:var(--t-mbd)] shrink-0 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative group/av shrink-0">
                            <Avatar name={group.name} size={44} color={group.color} avatarUrl={group.picture} />
                            {canChangePicture && (
                                <button onClick={onChangePicture} className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--t-ac)] text-[color:var(--t-onac)] border border-solid border-[color:var(--t-mbg)] flex items-center justify-center opacity-0 group-hover/av:opacity-100 transition-opacity duration-150" aria-label="Change group picture" title="Change group picture">
                                    <PencilIcon />
                                </button>
                            )}
                        </div>
                        <div className="min-w-0">
                            <span className="text-[color:var(--t-tx0)] text-sm font-bold block truncate">{group.name}</span>
                            <span className="text-[color:var(--t-mtx)] text-[11px]">{isDm ? "Direct message" : isClassroom ? "Classroom details" : "Squad details"}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-[color:var(--t-mtx)] text-lg leading-none hover:text-[color:var(--t-ac2)] transition-colors" aria-label="Close">×</button>
                </div>
                <div className="flex items-center gap-2 px-4 pt-3 border-b border-solid border-[color:var(--t-mbd)] shrink-0">
                    {tabDefs.map((t) => {
                        const active = tab === t.key;
                        return (
                            <button key={t.key} onClick={() => onTabChange(t.key)}
                                className={`flex items-center gap-1 pb-2.5 -mb-px border-b-2 text-[10px] font-bold whitespace-nowrap flex-1 min-w-0 justify-center transition-all duration-150 active:scale-95 ${active ? "border-[color:var(--t-ac)] text-[color:var(--t-ac)]" : "border-transparent text-[color:var(--t-mtx)] hover:text-[color:var(--t-tx1)] hover:border-[color:var(--t-mbd2)]"}`}>
                                <TabIcon type={t.key} /> {t.label}
                                {typeof t.count === "number" && <span className="opacity-70 font-normal">({t.count})</span>}
                            </button>
                        );
                    })}
                </div>
                <div className="chat-scroll flex-1 overflow-y-auto p-4">
                    {tab === "tasks" && (
                        <Panel title={isClassroom ? "ASSIGNMENTS" : "TASKS"} count={group.tasks?.length || 0}
                            action={canCreateTask && (<button onClick={onNewTask} className="text-[color:var(--t-ac)] text-[10px] font-bold hover:text-[color:var(--t-ac2)] hover:underline underline-offset-2 transition-colors">+ {isClassroom ? "New Assignment" : "New Task"}</button>)}>
                            {(group.tasks || []).length === 0 && <p className="text-[color:var(--t-mtx)] text-xs py-2">Nothing here yet.</p>}
                            {(group.tasks || []).map((t) => {
                                const mySubmission = isClassroom && t.submissions?.find((s) => s.studentId === ME);
                                const submittedCount = (t.submissions || []).length;
                                return (
                                    <div key={t.id} className="flex flex-col gap-1.5 bg-[var(--t-in0)] p-3 border border-solid border-[color:var(--t-mbd)] mb-2 transition-colors hover:border-[color:var(--t-mbd2)]">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-[color:var(--t-tx0)] text-xs font-bold">{t.title}</span>
                                            {isClassroom ? (<Badge color="var(--t-warn)">{t.points} PTS</Badge>) : (<Badge color={colorForString(t.badge)}>{t.badge}</Badge>)}
                                        </div>
                                        {t.desc && <span className="text-[color:var(--t-tx1)] text-xs">{t.desc}</span>}
                                        <span className="text-[color:var(--t-mtx)] text-[10px]">Due {t.due || "—"}</span>
                                        {isClassroom && (
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-[color:var(--t-mtx)] text-[10px] font-bold">{submittedCount} submitted</span>
                                                <button onClick={() => onSubmitTask(t.id)} disabled={!!mySubmission}
                                                    className={`group/md relative overflow-hidden flex items-center gap-1 text-[10px] font-bold tracking-wide py-1 pl-1.5 pr-2 rounded-full border border-solid transition-all duration-200 active:scale-95 ${mySubmission ? "bg-[color-mix(in_srgb,_var(--t-ok)_14%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-ok)_40%,_transparent)] text-[color:var(--t-ok2)] cursor-default" : "bg-[color-mix(in_srgb,_var(--t-ac2)_16%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-ac2)_45%,_transparent)] text-[color:var(--t-ac2)] hover:bg-[var(--t-ac2)] hover:text-[color:var(--t-onac)]"}`}>
                                                    <span className={`flex items-center justify-center w-3 h-3 rounded-full border border-solid transition-all duration-200 ${mySubmission ? "bg-[var(--t-ok2)] border-[color:var(--t-ok2)] text-[color:var(--t-onac)]" : "bg-transparent border-[color:var(--t-ac2)] text-[color:var(--t-ac2)] group-hover/md:bg-[var(--t-onac)] group-hover/md:border-[color:var(--t-onac)] group-hover/md:text-[color:var(--t-ac2)]"}`}>
                                                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    </span>
                                                    <span>{mySubmission ? "Done" : "Mark Done"}</span>
                                                    {!mySubmission && (
                                                        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 opacity-0 group-hover/md:opacity-100 group-hover/md:animate-[mdSweep_0.9s_ease-out]"
                                                            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </Panel>
                    )}
                    {tab === "files" && !isClassroom && !isDm && (
                        <Panel title="SHARED FILES" count={group.files?.length || 0}>
                            {(group.files || []).length === 0 && (<p className="text-[color:var(--t-mtx)] text-xs py-2">No files shared yet.</p>)}
                            {(group.files || []).map((f) => (
                                <div key={f.id} className="flex justify-between items-center bg-[var(--t-in0)] p-2.5 border border-solid border-[color:var(--t-mbd)] mb-1.5 hover:border-[color:var(--t-mbd2)]">
                                    <span className="text-[color:var(--t-tx1)] text-xs truncate">{f.name}</span>
                                    <span className="text-[color:var(--t-mtx)] text-[10px] shrink-0">{f.uploadedBy} • {f.size}</span>
                                </div>
                            ))}
                        </Panel>
                    )}
                    {tab === "materials" && isClassroom && (
                        <Panel title="LESSON MATERIALS" count={group.materials?.length || 0}>
                            {(group.materials || []).length === 0 && <p className="text-[color:var(--t-mtx)] text-xs py-2">No materials posted yet.</p>}
                            {(group.materials || []).map((m) => (
                                <div key={m.id} className="flex justify-between items-center bg-[var(--t-in0)] p-2.5 border border-solid border-[color:var(--t-mbd)] mb-1.5 hover:border-[color:var(--t-mbd2)]">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Badge color="var(--t-ok)">{m.kind}</Badge>
                                        <span className="text-[color:var(--t-tx1)] text-xs truncate">{m.title}</span>
                                    </div>
                                    <span className="text-[color:var(--t-mtx)] text-[10px] shrink-0">{m.addedBy}</span>
                                </div>
                            ))}
                        </Panel>
                    )}
                    {tab === "members" && (
                        <Panel title="MEMBERS" count={group.members.length}
                            action={canAddMembers && (<button onClick={onAddMember} className="text-[color:var(--t-ac)] text-[10px] font-bold hover:text-[color:var(--t-ac2)] hover:underline underline-offset-2 transition-colors">+ Add Member</button>)}>
                            {group.members.map((m) => {
                                const canKick = isAdmin && !isDm && m.id !== ME && m.role !== "admin";
                                return (
                                    <div key={m.id} className="flex justify-between items-center bg-[var(--t-in0)] p-2.5 border border-solid border-[color:var(--t-mbd)] mb-1.5 hover:border-[color:var(--t-mbd2)]">
                                        <button type="button" onClick={() => onViewProfile(m)} className="flex items-center gap-2 min-w-0 text-left group/pf">
                                            <Avatar name={m.name} size={26} />
                                            <span className="text-[color:var(--t-tx0)] text-xs truncate group-hover/pf:text-[color:var(--t-ac)] transition-colors">{m.name}</span>
                                        </button>
                                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                            {!isClassroom && !isDm && (<Badge color={m.role === "admin" ? "var(--t-ac)" : "var(--t-mtx)"}>{m.role.toUpperCase()}</Badge>)}
                                            {!isClassroom && !isDm && isAdmin && m.role !== "admin" && (
                                                <button onClick={() => onPromote(m.id)}
                                                    className="group/adm flex items-center gap-1 text-[10px] font-bold py-0.5 px-2 border border-solid shrink-0 bg-[color-mix(in_srgb,_var(--t-warn)_20%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-warn)_30%,_transparent)] text-[color:var(--t-warn)] hover:bg-[var(--t-warn)] hover:text-[color:var(--t-onwarn)] active:scale-95 transition-all duration-150">
                                                    <span className="text-[11px] leading-none transition-transform duration-150 group-hover/adm:rotate-90">+</span> MAKE ADMIN
                                                </button>
                                            )}
                                            {canKick && (
                                                <button onClick={() => onKick(m.id, m.name)}
                                                    className="flex items-center gap-1 text-[10px] font-bold py-0.5 px-2 border border-solid shrink-0 bg-[color-mix(in_srgb,_var(--t-err)_15%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-err)_40%,_transparent)] text-[color:var(--t-err)] hover:bg-[var(--t-err)] hover:text-[color:var(--t-mbg)] hover:border-[color:var(--t-err)] active:scale-95 transition-all duration-150"
                                                    title={`Remove ${m.name} from group`}>
                                                    <XIcon className="w-2.5 h-2.5" /> KICK
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </Panel>
                    )}
                </div>
            </div>
        </div>
    );
}

function GroupContextMenu({ x, y, group, onClose, onOpenMessages, onOpenTab }) {
    const opts = tabDefsFor(group);
    const clampedX = Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 1000) - 190);
    const clampedY = Math.min(y, (typeof window !== "undefined" ? window.innerHeight : 800) - (opts.length * 30 + 56));
    return (
        <>
            <div className="fixed inset-0 z-[70]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
            <div className="fixed z-[80] bg-[color-mix(in_srgb,_var(--t-mbg)_90%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] py-1 min-w-[172px]"
                style={{ top: Math.max(8, clampedY), left: Math.max(8, clampedX), boxShadow: "0 12px 32px rgba(0,0,0,0.6), 0 0 24px color-mix(in srgb, var(--t-glow) 25%, transparent)" }}>
                <div className="px-3 py-1.5 border-b border-solid border-[color:var(--t-mbd)]">
                    <span className="text-[color:var(--t-mtx)] text-[10px] font-bold truncate block">{group.name}</span>
                </div>
                <button onClick={onOpenMessages} className="flex items-center w-full text-left px-3 py-1.5 text-[color:var(--t-tx0)] text-[11px] border-l-2 border-l-transparent hover:border-l-[color:var(--t-ac2)] hover:bg-[var(--t-in1)] hover:text-[color:var(--t-ac2)] transition-all duration-150">Open Messages</button>
                {opts.map((o) => (
                    <button key={o.key} onClick={() => onOpenTab(o.key)} className="flex items-center w-full text-left px-3 py-1.5 text-[color:var(--t-tx1)] text-[11px] border-l-2 border-l-transparent hover:border-l-[color:var(--t-ac2)] hover:bg-[var(--t-in1)] hover:text-[color:var(--t-tx0)] transition-all duration-150">{o.label}</button>
                ))}
            </div>
        </>
    );
}

function ImageViewerModal({ file, onClose }) {
    if (!file) return null;
    return (
        <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center px-4 py-6">
            <div className="absolute inset-0 bg-black/85" onClick={onClose} />
            <div className="relative z-10 flex flex-col items-center gap-3 max-w-full max-h-full">
                <img src={file.url} alt={file.name} className="max-w-[92vw] max-h-[75vh] object-contain border border-solid border-[color:var(--t-mbd)]" />
                <div className="flex items-center gap-3 bg-[color-mix(in_srgb,_var(--t-mbg)_90%,_transparent)] border border-solid border-[color:var(--t-mbd)] py-2 px-3">
                    <span className="text-[color:var(--t-tx1)] text-xs truncate max-w-[40vw]">{file.name}</span>
                    <span className="text-[color:var(--t-mtx)] text-[10px] shrink-0">{file.size}</span>
                    <a href={file.url} download={file.name} className="bg-[var(--t-ac)] text-[color:var(--t-onac)] text-[11px] font-bold py-1.5 px-3 hover:opacity-90 transition-all duration-150 active:scale-95">SAVE</a>
                    <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-[11px] font-bold hover:text-[color:var(--t-ac2)] transition-colors">CLOSE</button>
                </div>
            </div>
        </div>
    );
}

export default function GroupCollab(props) {
  return <GroupCollabInner {...props} />;
}

function GroupCollabInner({ onNavigate, onSyncTaskToSprintBoard }) {
    const navigate = useNavigate();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [navCollapsed, setNavCollapsed] = useState(false);
    const [fallbackPage, setFallbackPage] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [theme, setTheme, rootThemeStyle] = useTheme();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const searchRef = useRef(null);
    const fileInputRef = useRef(null);
    const gcFileInputRef = useRef(null);
    const [viewerFile, setViewerFile] = useState(null);
    const [gcPictureTarget, setGcPictureTarget] = useState(null);
    const messagesEndRef = useRef(null);

    function formatSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    const [groups, setGroups] = useState(INITIAL_GROUPS);
    const [activeGroupId, setActiveGroupId] = useState(INITIAL_GROUPS[0]?.id || null);
    const [openPanel, setOpenPanel] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showNewTask, setShowNewTask] = useState(false);
    const [filter, setFilter] = useState("all");
    const [contextMenu, setContextMenu] = useState(null);
    const [profileMember, setProfileMember] = useState(null);
    const [profileContext, setProfileContext] = useState(null);
    const [editProfileOpen, setEditProfileOpen] = useState(false);

    const [friendships, setFriendships] = useState([{ id: "fr-seed", from: "m4", to: ME, status: "pending" }]);
    const [blocked, setBlocked] = useState([]);

    const [myProfile, setMyProfile] = useState({
        name: "You", handle: "@you", bio: "", avatarUrl: null, bannerColor: null, bannerUrl: null,
    });

    const activeGroup = groups.find((g) => g.id === activeGroupId) || null;
    const isClassroom = activeGroup?.type === "classroom";
    const isDm = activeGroup?.type === "dm";
    const isSquad = activeGroup?.type === "squad";
    const me = activeGroup?.members.find((m) => m.id === ME);
    const isAdmin = !!isSquad && me?.role === "admin";
    const canAddMembers = activeGroup ? !isDm : false;
    const canCreateTask = !!isSquad;
    const canChangePicture = activeGroup ? !isDm : false;

    useEffect(() => {
        if (activeGroup?.messages?.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeGroup?.messages]);

    const visibleGroups = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return groups.filter((g) => {
            if (filter !== "all" && g.type !== filter) return false;
            if (!q) return true;
            if (g.name.toLowerCase().includes(q)) return true;
            return g.messages.some((m) => (m.text || "").toLowerCase().includes(q));
        });
    }, [groups, filter, searchQuery]);

    function meAsMember() {
        const myRole = groups.find((g) => g.members.some((m) => m.id === ME))?.members.find((m) => m.id === ME)?.role;
        return { id: ME, name: myProfile.name || "You", role: myRole || "member" };
    }

    function openMyProfile() {
        setProfileMember(meAsMember());
        setProfileContext(null);
        setUserMenuOpen(false);
        setNotifOpen(false);
    }
    function openMemberProfile(member, group) {
        const roles = [];
        if (group) {
            if (member.role === "admin") roles.push({ label: "ADMIN", color: "var(--t-ac)" });
            if (group.type === "classroom") roles.push({ label: "STUDENT", color: "var(--t-ok)" });
            if (group.type === "squad" && member.role !== "admin") roles.push({ label: "MEMBER", color: "var(--t-mtx)" });
        }
        setProfileMember({ ...member, role: member.role });
        setProfileContext({ groupId: group?.id || null, roles });
    }
    function handleSaveProfile(updated) {
        setMyProfile((prev) => ({ ...prev, ...updated }));
        setEditProfileOpen(false);
        setProfileMember((prev) => (prev && prev.id === ME ? { ...prev, name: updated.name } : prev));
    }

    function sendFriendRequest(m) {
        setFriendships((prev) => findFriendship(prev, ME, m.id) ? prev : [...prev, { id: `fr${Date.now()}`, from: ME, to: m.id, status: "pending" }]);
    }
    function acceptFriendRequest(m) {
        setFriendships((prev) => prev.map((f) => ((f.from === m.id && f.to === ME) || (f.from === ME && f.to === m.id)) ? { ...f, status: "accepted" } : f));
    }
    function removeFriendship(m) {
        setFriendships((prev) => prev.filter((f) => !((f.from === ME && f.to === m.id) || (f.from === m.id && f.to === ME))));
    }

    function toggleBlock(m) {
        setBlocked((prev) => (prev.includes(m.id) ? prev.filter((id) => id !== m.id) : [...prev, m.id]));
    }

    function kickMember(memberId, memberName) {
        if (!activeGroup) return;
        const ok = window.confirm(`Remove ${memberName} from "${activeGroup.name}"?`);
        if (!ok) return;
        setGroups((prev) =>
            prev.map((g) =>
                g.id === activeGroupId
                    ? {
                        ...g,
                        members: g.members.filter((m) => m.id !== memberId),
                        tasks: (g.tasks || []).map((t) => ({
                            ...t,
                            submissions: (t.submissions || []).filter((s) => s.studentId !== memberId),
                        })),
                    }
                    : g
            )
        );
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

    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "/" && document.activeElement !== searchRef.current) {
                e.preventDefault();
                searchRef.current?.focus();
            }
            if (e.key === "Escape") {
                if (searchQuery) setSearchQuery("");
                searchRef.current?.blur();
                setSettingsOpen(false);
                setNotifOpen(false);
                setUserMenuOpen(false);
                setOpenPanel(null);
                setContextMenu(null);
                setProfileMember(null);
                setProfileContext(null);
                setEditProfileOpen(false);
                setViewerFile(null);
                setGcPictureTarget(null);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [searchQuery]);

    function updateActiveGroup(fn) {
        setGroups((prev) => prev.map((g) => (g.id === activeGroupId ? fn(g) : g)));
    }

    function createGroup(name, type, extraMember) {
        const id = `g${Date.now()}`;
        const you = { id: ME, name: myProfile.name || "You", role: type === "squad" ? "admin" : "member" };
        const base = { id, name, type, color: colorForString(name), picture: null, members: [you], messages: [] };
        let fresh;
        if (type === "classroom") fresh = { ...base, materials: [], tasks: [] };
        else if (type === "dm") fresh = { ...base, members: [you, extraMember || { id: `m${Date.now()}`, name, role: "member" }] };
        else fresh = { ...base, files: [], tasks: [] };
        setGroups((prev) => [fresh, ...prev]);
        setActiveGroupId(id);
        setFilter("all");
        setShowCreateGroup(false);
        setOpenPanel(null);
    }

    function sendMessage(e) {
        e.preventDefault();
        if (!messageText.trim() || !activeGroup) return;
        updateActiveGroup((g) => ({
            ...g,
            messages: [...g.messages, { id: `msg${Date.now()}`, senderId: ME, senderName: myProfile.name || "You", text: messageText.trim(), time: "Now" }],
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
        const entries = accepted.map((f, i) => ({ id: `f${stamp}_${i}`, name: f.name, size: formatSize(f.size), type: f.type, url: URL.createObjectURL(f), uploadedBy: myProfile.name || "You" }));
        updateActiveGroup((g) => ({
            ...g,
            ...(g.type === "squad" ? { files: [...(g.files || []), ...entries] } : {}),
            messages: [...g.messages, ...entries.map((f) => ({ id: `msg${f.id}`, senderId: ME, senderName: myProfile.name || "You", text: "", file: f, time: "Now" }))],
        }));
    }

    function addMember(rawValue) {
        updateActiveGroup((g) => ({ ...g, members: [...g.members, { id: `m${Date.now()}`, name: rawValue, role: "member" }] }));
        setShowAddMember(false);
    }
    function promoteToAdmin(memberId) {
        updateActiveGroup((g) => ({ ...g, members: g.members.map((m) => (m.id === memberId ? { ...m, role: "admin" } : m)) }));
    }

    function createTask(fields) {
        updateActiveGroup((g) => ({
            ...g,
            tasks: [...(g.tasks || []), { id: `t${Date.now()}`, title: fields.title, desc: fields.desc, due: fields.due, badge: fields.badge || "SQUAD", createdBy: myProfile.name || "You" }],
        }));
        onSyncTaskToSprintBoard?.(fields.title, { subject: (fields.badge || "SQUAD").toUpperCase(), meta: fields.due || activeGroup.name });
        setShowNewTask(false);
    }
    function submitTask(taskId) {
        updateActiveGroup((g) => ({
            ...g,
            tasks: g.tasks.map((t) => t.id === taskId ? { ...t, submissions: [...(t.submissions || []).filter((s) => s.studentId !== ME), { studentId: ME, studentName: myProfile.name || "You", submittedAt: "Now" }] } : t),
        }));
    }

    const tabDefs = useMemo(() => {
        if (!activeGroup) return [];
        if (isClassroom) {
            return [
                { key: "tasks", label: "ASSIGNMENTS", count: activeGroup.tasks?.length || 0 },
                { key: "materials", label: "MATERIALS", count: activeGroup.materials?.length || 0 },
                { key: "members", label: "MEMBERS", count: activeGroup.members.length },
            ];
        }
        if (isDm) return [{ key: "members", label: "MEMBERS", count: activeGroup.members.length }];
        return [
            { key: "tasks", label: "TASKS", count: activeGroup.tasks?.length || 0 },
            { key: "files", label: "FILES", count: activeGroup.files?.length || 0 },
            { key: "members", label: "MEMBERS", count: activeGroup.members.length },
        ];
    }, [activeGroup, isClassroom, isDm]);

    function handleNavClick(key) {
        setMobileNavOpen(false);
        if (key === "group") return setShowQuiz(false);
        if (onNavigate) onNavigate(key);
        else if (key === "classroom") navigate("/classroom");
        else if (key === "chatbot") setFallbackPage("chatbot");
        else if (key === "personalized") setFallbackPage("personalized");
        else if (key === "dashboard") setFallbackPage("dashboard");
    }
    function handleConfirmLogout() { setShowLogoutConfirm(false); navigate("/"); }
    function openGroupTab(groupId, tabKey) { setShowQuiz(false); setActiveGroupId(groupId); setOpenPanel(tabKey); setContextMenu(null); }
    function openGroupMessages(groupId) { setShowQuiz(false); setActiveGroupId(groupId); setOpenPanel(null); setContextMenu(null); }

    function messageMember(m) {
        if (blocked.includes(m.id)) return;
        const existing = groups.find((g) => g.type === "dm" && g.members.some((x) => x.id === m.id));
        if (existing) openGroupMessages(existing.id);
        else createGroup(m.name, "dm", { id: m.id, name: m.name, role: "member" });
        setShowQuiz(false);
        setProfileMember(null);
        setProfileContext(null);
    }

    if (fallbackPage === "dashboard") return <Dashboard />;
    if (fallbackPage === "chatbot") return <Chatbot onNavigate={(key) => setFallbackPage(key === "group" ? null : key)} />;
    if (fallbackPage === "personalized") return (
        <Personalized onNavigateToChatbot={() => setFallbackPage("chatbot")} onNavigateToGroup={() => setFallbackPage(null)} onNavigateToDashboard={() => setFallbackPage("dashboard")} />
    );

    const activeNavKey = showQuiz ? "quiz" : "group";

    return (
        <div style={rootThemeStyle} className="flex h-screen w-full bg-[var(--t-bg1)] overflow-hidden">
            <style>{SCROLLBAR_CSS}</style>
            <input ref={gcFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleGcFileChange} />

            {notifOpen && (
                <>
                    <div className="fixed inset-0 z-[45]" onClick={() => setNotifOpen(false)} />
                    <div className="fixed right-4 top-[64px] z-[46] w-56 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] p-3 text-left shadow-lg">
                        <span className="text-[color:var(--t-tx0)] text-xs font-bold block mb-2">Notifications</span>
                        <span className="text-[color:var(--t-tx2)] text-[11px] block">Jess R. sent a new message in Algorithm Study Squad.</span>
                    </div>
                </>
            )}

            {mobileNavOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileNavOpen(false)} />}

            <div style={{ backgroundImage: "var(--t-grad-side)" }}
                className={`bg-[var(--t-bg0)] w-64 shrink-0 z-50 flex flex-col h-full transition-all duration-300 ease-out
                    ${mobileNavOpen ? "fixed inset-y-0 left-0 translate-x-0" : "fixed inset-y-0 left-0 -translate-x-full"}
                    lg:static lg:translate-x-0 ${navCollapsed ? "lg:w-0 lg:overflow-hidden" : "lg:w-64"}`}>
                <div className="flex justify-end lg:hidden px-3 pt-3">
                    <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><CloseIcon className="w-4 h-4" /></button>
                </div>
                <div className="self-stretch flex-1 overflow-y-auto">
                    <div className="flex items-center self-stretch bg-[color-mix(in_srgb,_var(--t-bg2)_45%,_transparent)] py-[13px]">
                        <img src={IMG.logo} className="w-9 h-9 ml-4 mr-3 object-fill" />
                        <div className="w-[127px]">
                            <div className="flex flex-col items-start self-stretch" style={{ boxShadow: "0px 2px 4px color-mix(in srgb, var(--t-ac) 30%, transparent)" }}>
                                <span className="text-[color:var(--t-ac)] text-[17px] font-bold">CRAMMBLING</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start self-stretch pt-[21px] pl-5">
                        <span className="text-[color:var(--t-tx2)] text-[11px] font-bold mb-[9px]">NAVIGATION BAR</span>
                    </div>
                    <nav className="flex flex-col self-stretch px-3 gap-1">
                        {NAV_ITEMS.map((item) => {
                            const active = item.key === activeNavKey;
                            return (
                                <button key={item.key} onClick={() => handleNavClick(item.key)}
                                    className={`flex items-center self-stretch py-[9px] text-left border border-solid transition-all duration-150 active:scale-[0.98] ${active ? "bg-[var(--t-bg3)] border-[#00000000]" : "border-[#00000000] hover:bg-[var(--t-bg2)]"}`}
                                    style={active ? { boxShadow: "0px 0px 15px color-mix(in srgb, var(--t-ac) 15%, transparent)" } : undefined}>
                                    <img src={item.icon} className={`${item.iconClass} ml-[13px] mr-3 object-fill`} />
                                    <span className={`text-xs font-bold ${active ? "text-[color:var(--t-ac)]" : "text-[color:var(--t-tx1)]"}`}>{item.label}</span>
                                    {active && (<div className="flex-1 flex justify-end pr-4"><div className="bg-[var(--t-ac)] w-1.5 h-1.5 rounded-full" style={{ boxShadow: "0px 0px 6px var(--t-ac)" }} /></div>)}
                                </button>
                            );
                        })}
                    </nav>
                </div>
                <div className="flex flex-col self-stretch bg-[color-mix(in_srgb,_var(--t-bg2)_45%,_transparent)] p-3 gap-1">
                    <button onClick={openMyProfile} className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]">
                        <img src={PROFILE_ICON} className="w-[15px] h-[15px] mx-3 object-fill" />
                        <span className="text-[color:var(--t-tx1)] text-[11px]">PROFILE</span>
                    </button>
                    <button onClick={() => setSettingsOpen(true)} className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]">
                        <img src={IMG.settings} className="w-[15px] h-[15px] mx-3 object-fill" />
                        <span className="text-[color:var(--t-tx1)] text-[11px]">SETTINGS</span>
                    </button>
                    <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]">
                        <img src={IMG.logout} className="w-3.5 h-3.5 mx-3 object-fill" />
                        <span className="text-[color:var(--t-tx1)] text-[11px]">LOGOUT</span>
                    </button>
                </div>
            </div>

            <button onClick={() => setNavCollapsed((v) => !v)}
                aria-label={navCollapsed ? "Open navigation bar" : "Push navigation bar aside"}
                className="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[55] w-5 h-16 items-center justify-center bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] border-l-0 text-[color:var(--t-ac)] hover:bg-[var(--t-ac)] hover:text-[color:var(--t-onac)] transition-all duration-300 active:scale-95"
                style={{ left: navCollapsed ? 0 : 256 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: navCollapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s" }}>
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            <div style={{ backgroundImage: "var(--t-grad-main)" }} className="flex-1 flex flex-col min-w-0 h-full relative">
                <div className="shrink-0 flex flex-wrap justify-between items-center gap-3 self-stretch bg-[color-mix(in_srgb,_var(--t-bg0)_40%,_transparent)] py-3 px-4 sm:px-6">
                    <div className="flex flex-1 min-w-0 items-center gap-3 sm:gap-4">
                        <button onClick={() => { setNavCollapsed(false); setMobileNavOpen(true); }} className={`shrink-0 ${navCollapsed ? "" : "lg:hidden"}`} aria-label="Open menu">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <div className="relative flex-1 min-w-[40px] sm:min-w-[220px] sm:flex-none">
                            <div className="flex items-center bg-[var(--t-bg3)] py-[7px] px-[15px] gap-2.5 border border-solid border-[color:var(--t-bd0)]">
                                <img src={IMG.search} className="w-[13px] h-[13px] object-fill shrink-0" />
                                <input ref={searchRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                                    placeholder={searchFocused ? "Search messages..." : "[ / ] Search messages..."}
                                    className="bg-transparent outline-none text-[color:var(--t-tx0)] placeholder-[color:var(--t-tx2)] text-xs w-full min-w-0" />
                                {searchQuery && (
                                    <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search"
                                        className="text-[color:var(--t-tx2)] hover:text-[color:var(--t-ac2)] text-xs shrink-0">×</button>
                                )}
                            </div>
                        </div>
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

                        <button onClick={() => { setNotifOpen((v) => !v); setUserMenuOpen(false); }} aria-label="Notifications" className="block shrink-0">
                            <img src={IMG.avatar} className="w-8 h-8 object-fill" />
                        </button>

                        <ProfileButton />
                    </div>
                </div>

                {showQuiz && <QuizArena where="Group Collab" onBack={() => setShowQuiz(false)} />}

                <div className={`${showQuiz ? "hidden" : "flex"} flex-col flex-1 min-h-0 self-stretch px-4 sm:px-6 lg:px-10 py-4 gap-4`}>
                    <div className="flex flex-col sm:flex-row items-stretch flex-1 min-h-0 self-stretch gap-4">

                        <div className="flex flex-col w-full sm:w-64 shrink-0 bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] p-3 gap-2" style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}>
                            <div className="flex justify-between items-center pb-1">
                                <span className="text-[color:var(--t-tx0)] text-xs font-bold">MY MESSAGES</span>
                                <span className="text-[color:var(--t-tx2)] text-[10px]">{visibleGroups.length}</span>
                            </div>
                            <button onClick={() => setShowCreateGroup(true)} className="flex justify-center items-center bg-[var(--t-bg3)] py-2 gap-1.5 border border-solid border-[color:var(--t-bd0)] hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.98]">
                                <span className="text-[color:var(--t-ac)] text-xs font-bold">+ NEW MESSAGE</span>
                            </button>
                            <FilterDropdown value={filter} onChange={setFilter} />
                            <p className="text-[color:var(--t-bd1)] text-[10px] italic px-0.5">Right-click a message for quick access.</p>

                            <div className="chat-scroll flex flex-col gap-1.5 max-h-[460px] overflow-y-auto pr-0.5">
                                {visibleGroups.length === 0 && (
                                    <p className="text-[color:var(--t-tx2)] text-xs py-6 text-center">
                                        {searchQuery ? `No conversations match "${searchQuery}".` : "Nothing here yet."}
                                    </p>
                                )}
                                {visibleGroups.map((g) => {
                                    const active = g.id === activeGroupId;
                                    const lastMsg = g.messages[g.messages.length - 1];
                                    const myRole = g.members.find((m) => m.id === ME)?.role;
                                    const showRole = g.type === "squad" && myRole;
                                    return (
                                        <button key={g.id} onClick={() => { setActiveGroupId(g.id); setOpenPanel(null); }}
                                            onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, groupId: g.id }); }}
                                            className={`flex items-center gap-2.5 p-2 text-left border border-solid transition-all duration-150 ${active ? "bg-[var(--t-bg3)] border-[#00000000]" : "border-[#00000000] hover:bg-[var(--t-bg2)]"}`}
                                            style={active ? { boxShadow: `0px 0px 12px ${withAlpha(g.color, "33")}` } : undefined}>
                                            <div className="w-8 h-8 shrink-0 overflow-hidden rounded-full flex items-center justify-center text-[10px] font-bold"
                                                style={{ backgroundColor: withAlpha(g.color, "33"), color: g.color, border: `1px solid ${withAlpha(g.color, "4D")}` }}>
                                                {g.picture ? <img src={g.picture} alt="" className="w-full h-full object-cover" /> : initialsFor(g.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[color:var(--t-tx0)] text-xs font-bold truncate">{g.name}</span>
                                                    {showRole && (<span className="text-[10px] font-bold shrink-0" style={{ color: myRole === "admin" ? "var(--t-ac)" : "var(--t-tx2)" }}>· {myRole.toUpperCase()}</span>)}
                                                </div>
                                                <span className="text-[color:var(--t-tx2)] text-[11px] truncate block">{lastMsg ? (lastMsg.text || (lastMsg.file ? `📎 ${lastMsg.file.name}` : "")) : "No messages yet"}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col gap-3 h-full">
                            {!activeGroup ? (
                                <div className="flex flex-col items-center justify-center flex-1 min-h-0 bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] p-10 gap-2" style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}>
                                    <span className="text-[color:var(--t-tx0)] text-sm font-bold">No message selected</span>
                                    <p className="text-[color:var(--t-tx2)] text-xs">Create or pick a conversation from the list on the left.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="shrink-0 flex flex-wrap justify-between items-center gap-3 bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] p-3 sm:p-4" style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}>
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative group/av shrink-0">
                                                <Avatar name={activeGroup.name} size={40} color={activeGroup.color} avatarUrl={activeGroup.picture}
                                                    onClick={() => {
                                                        if (isDm) {
                                                            const other = activeGroup.members.find((m) => m.id !== ME);
                                                            if (other) openMemberProfile(other, activeGroup);
                                                        } else setOpenPanel("members");
                                                    }} />
                                                {canChangePicture && (
                                                    <button onClick={(e) => { e.stopPropagation(); pickGcPicture(activeGroup.id); }}
                                                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--t-ac)] text-[color:var(--t-onac)] border border-solid border-[color:var(--t-mbg)] flex items-center justify-center opacity-0 group-hover/av:opacity-100 transition-opacity duration-150"
                                                        aria-label="Change group picture" title="Change group picture">
                                                        <PencilIcon />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[color:var(--t-tx0)] text-sm font-bold truncate block">{activeGroup.name}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <Badge color={isClassroom ? "var(--t-ok)" : isDm ? "var(--t-ac2)" : "var(--t-ac)"}>
                                                        {isClassroom ? "CLASSROOM" : isDm ? "1v1" : "SQUAD"}
                                                    </Badge>
                                                    <span className="text-[color:var(--t-tx2)] text-[11px]">{activeGroup.members.length} member{activeGroup.members.length === 1 ? "" : "s"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setOpenPanel(tabDefs[0]?.key || "members")} className="flex items-center gap-1.5 py-1.5 px-3 border border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg0)] text-[color:var(--t-tx1)] text-[11px] font-bold hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-all duration-150 active:scale-95">
                                            <span>☰</span>
                                        </button>
                                    </div>

                                    <div className="flex flex-col flex-1 min-h-0 bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] p-3 sm:p-4 gap-3" style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}>
                                        <div className="chat-scroll flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                                            {activeGroup.messages.length === 0 && <p className="text-[color:var(--t-tx2)] text-xs py-6 text-center">No messages yet — say hi!</p>}
                                            {activeGroup.messages.map((m) => {
                                                const mine = m.senderId === ME;
                                                const sender = activeGroup.members.find((x) => x.id === m.senderId) || { id: m.senderId, name: m.senderName, role: "member" };
                                                return (
                                                    <div key={m.id} className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
                                                        {!mine && (<Avatar name={m.senderName} size={28} onClick={() => openMemberProfile(sender, activeGroup)} />)}
                                                        <div className={`flex flex-col gap-0.5 min-w-0 max-w-[80%] ${mine ? "items-end" : "items-start"}`}>
                                                            <div className="flex items-center gap-1.5">
                                                                {mine ? (
                                                                    <span className="text-[color:var(--t-tx2)] text-[11px] font-bold">{m.senderName}</span>
                                                                ) : (
                                                                    <button type="button" onClick={() => openMemberProfile(sender, activeGroup)} className="text-[color:var(--t-tx2)] text-[11px] font-bold hover:text-[color:var(--t-ac)] hover:underline underline-offset-2 transition-colors">{m.senderName}</button>
                                                                )}
                                                                <span className="text-[color:var(--t-bd1)] text-[10px]">{m.time}</span>
                                                            </div>
                                                            <div className={`py-2 px-3 text-xs ${mine ? "bg-[var(--t-ac)] text-[color:var(--t-onac)]" : "bg-[var(--t-bg3)] text-[color:var(--t-tx0)] border border-solid border-[color:var(--t-bd0)]"}`}>
                                                                {m.file && (
                                                                    m.file.type?.startsWith("image/") ? (
                                                                        <button type="button" onClick={() => setViewerFile(m.file)} className="block cursor-zoom-in" aria-label={`View ${m.file.name}`}>
                                                                            <img src={m.file.url} alt={m.file.name} className="max-w-full max-h-56 object-contain hover:opacity-90 transition-opacity" />
                                                                        </button>
                                                                    ) : (
                                                                        <a href={m.file.url} download={m.file.name} className="flex items-center gap-2 underline underline-offset-2 hover:opacity-80">
                                                                            <span>📎</span>
                                                                            <span className="truncate">{m.file.name}</span>
                                                                            <span className="opacity-70 text-[10px] shrink-0">{m.file.size}</span>
                                                                            <span className="shrink-0 font-bold">↓</span>
                                                                        </a>
                                                                    )
                                                                )}
                                                                {m.text}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        <form onSubmit={sendMessage} className="shrink-0 flex items-center gap-2 pt-2 border-t border-solid border-[color:var(--t-bd0)]">
                                            <input value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder={`Message ${activeGroup.name}...`}
                                                className="flex-1 min-w-0 bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac)]" />
                                            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => { attachFiles(e.target.files); e.target.value = ""; }} />
                                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                                className="shrink-0 bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx1)] text-xs py-2 px-3 hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-95" aria-label="Attach a file">
                                                📎
                                            </button>
                                            <button type="submit" className="shrink-0 bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2 px-4 hover:opacity-90 transition-all duration-150 active:scale-95">SEND</button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} onThemeChange={setTheme} />

            {openPanel && activeGroup && (
                <GroupDetailModal
                    group={activeGroup} isClassroom={isClassroom} isDm={isDm} isAdmin={isAdmin}
                    canAddMembers={canAddMembers} canCreateTask={canCreateTask}
                    tab={openPanel} onTabChange={setOpenPanel} tabDefs={tabDefs}
                    onClose={() => setOpenPanel(null)}
                    onNewTask={() => setShowNewTask(true)}
                    onAddMember={() => setShowAddMember(true)}
                    onSubmitTask={submitTask} onPromote={promoteToAdmin}
                    onKick={kickMember}
                    onViewProfile={(m) => openMemberProfile(m, activeGroup)}
                    canChangePicture={canChangePicture}
                    onChangePicture={() => pickGcPicture(activeGroup.id)}
                />
            )}

            {contextMenu && (() => {
                const g = groups.find((gr) => gr.id === contextMenu.groupId);
                if (!g) return null;
                return (<GroupContextMenu x={contextMenu.x} y={contextMenu.y} group={g} onClose={() => setContextMenu(null)} onOpenMessages={() => openGroupMessages(g.id)} onOpenTab={(tabKey) => openGroupTab(g.id, tabKey)} />);
            })()}

            {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} onCreate={createGroup} />}
            {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} onAdd={addMember} />}
            {showNewTask && <NewTaskModal isClassroom={isClassroom} onClose={() => setShowNewTask(false)} onCreate={createTask} />}

            {profileMember && (
                <ProfileModal
                    member={profileMember} groups={groups} myProfile={myProfile}
                    roles={profileContext?.roles}
                    friendState={friendStateFor(friendships, ME, profileMember.id)}
                    isBlocked={blocked.includes(profileMember.id)}
                    onClose={() => { setProfileMember(null); setProfileContext(null); }}
                    onMessage={messageMember}
                    onEdit={() => setEditProfileOpen(true)}
                    onAddFriend={sendFriendRequest}
                    onAcceptFriend={acceptFriendRequest}
                    onRemoveFriend={removeFriendship}
                    onToggleBlock={toggleBlock}
                />
            )}

            {editProfileOpen && (
                <EditProfileModal myProfile={myProfile} onClose={() => setEditProfileOpen(false)} onSave={handleSaveProfile} />
            )}

            {viewerFile && <ImageViewerModal file={viewerFile} onClose={() => setViewerFile(null)} />}

            {gcPictureTarget?.src && (
                <ImageCropperModal src={gcPictureTarget.src} aspect={1} title="ADJUST GROUP PICTURE" onSave={saveGcPicture} onClose={() => setGcPictureTarget(null)} />
            )}

            {showLogoutConfirm && (
                <LogoutConfirmModal onConfirm={handleConfirmLogout} onCancel={() => setShowLogoutConfirm(false)} />
            )}
        </div>
    );
}
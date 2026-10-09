// Classroom.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Chatbot from "./chatbot";
import GroupCollab from "./group_collab";
import Personalized from "./personalized";
import QuizArena from "./QuizArena";
import { useTheme, themeStyle, withAlpha, CloseIcon, MenuIcon } from "./Theme";
import { useHubClasses, useOpenRequest, clearOpenRequest, clockNow } from "./Classhub";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import Settings from "../components/Settings";

/* ------------------------------------------------------------------ */
/*  Tiny inline icon set (kept dependency-free, same style as the      */
/*  Icon object in chatbot.jsx).                                       */
/* ------------------------------------------------------------------ */
const Icon = {
    Plus: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
    ),
    Copy: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
        </svg>
    ),
    Check: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...p}>
            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Back: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Comment: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Assignment: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <polyline points="8 15 11 18 16 13" />
        </svg>
    ),
    Quiz: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.1 1.2-1.1 2.2" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
        </svg>
    ),
    Question: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.1 1.2-1.1 2.2" strokeLinecap="round" />
        </svg>
    ),
    Material: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    ),
    People: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
    ),
    Stream: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
            <line x1="4" y1="12" x2="14" y2="12" strokeLinecap="round" />
            <line x1="4" y1="18" x2="18" y2="18" strokeLinecap="round" />
        </svg>
    ),
    Classwork: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M4 6h11M4 12h11M4 18h7" strokeLinecap="round" />
            <path d="M20 6l-3 3-3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Grades: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M12 3l9 4-9 4-9-4 9-4z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 11v5c3 3 11 3 14 0v-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    More: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <circle cx="12" cy="5" r="1.4" fill="currentColor" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" />
            <circle cx="12" cy="19" r="1.4" fill="currentColor" />
        </svg>
    ),
    Attach: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M21 12.5 12.5 21a4.95 4.95 0 0 1-7-7L14 5.5a3.5 3.5 0 0 1 5 5L10.5 19a2 2 0 0 1-3-3L15 8.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Link: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" strokeLinecap="round" />
            <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" strokeLinecap="round" />
        </svg>
    ),
};

/* ------------------------------------------------------------------ */
/*  Static assets — same icon set the other pages use.                 */
/* ------------------------------------------------------------------ */
const NAV_ASSET = (id) => `https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/${id}_expires_30_days.png`;

// Graduation cap for the CLASSROOM sidebar entry, drawn inline so we don't
// need a new hosted asset.
const CLASSROOM_ICON =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='15' viewBox='0 0 24 24' fill='none' stroke='%232CD4D9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 10 12 5 2 10l10 5 10-5z'/><path d='M6 12v5c3 3 9 3 12 0v-5'/></svg>";

const NAV_IMG = {
    logo: NAV_ASSET("ec7p6crg"),
    dashboard: NAV_ASSET("5fuik1xz"),
    chatbot: NAV_ASSET("2ordxy0o"),
    group: NAV_ASSET("tda70phj"),
    quiz: NAV_ASSET("dni61l44"),
    personalized: NAV_ASSET("z60zmihq"),
    settings: NAV_ASSET("ojko43i5"),
    logout: NAV_ASSET("cxrmfyil"),
    streak: NAV_ASSET("75egjh7r"),
    xp: NAV_ASSET("5hwd9ufw"),
    avatar: NAV_ASSET("24khomt6"),
};

const NAV_ITEMS = [
    { key: "dashboard", label: "DASHBOARD", icon: NAV_IMG.dashboard, iconClass: "w-[18px] h-[15px]" },
    { key: "classroom", label: "CLASSROOM", icon: CLASSROOM_ICON, iconClass: "w-[18px] h-[15px]" },
    { key: "chatbot", label: "CHATBOT", icon: NAV_IMG.chatbot, iconClass: "w-[18px] h-[15px]" },
    { key: "group", label: "GROUP COLLAB", icon: NAV_IMG.group, iconClass: "w-5 h-2.5" },
    { key: "personalized", label: "PERSONALIZED", icon: NAV_IMG.personalized, iconClass: "w-[18px] h-[13px]" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
const CURRENT_USER = { id: "you", name: "You", email: "you@univ.edu" };

/* Class colours are theme roles, not fixed hex values, so every class
   automatically re-tints itself when the theme changes. */
const CLASS_COLORS = [
    "var(--t-ac)",
    "var(--t-ok)",
    "var(--t-warn)",
    "var(--t-ac2)",
    "var(--t-ok2)",
];

function colorForString(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return CLASS_COLORS[h % CLASS_COLORS.length];
}

function initialsFor(name) {
    return name
        .split(" ")
        .map((w) => w[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function makeClassCode() {
    const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
    let s = "";
    for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
    return s;
}

function toISODate(d) {
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/* Sample classes now live in ./classHub so Group Collab can see them too. */

/* ------------------------------------------------------------------ */
/*  Small shared UI                                                    */
/* ------------------------------------------------------------------ */
/* ---------------------------------------------------------
   Dashboard-style design kit (theme-aware, flat + pixel-sharp):
   hard pixel shadows, micro-caps labels, tinted tags, panels with
   a glyph header bar, pixel avatars and segmented meters.
--------------------------------------------------------- */
const PIXEL_SHADOW = "3px 3px 0px var(--t-shadow)";
const LABEL = "text-[10px] font-bold uppercase tracking-wider text-[color:var(--t-tx2)]";
const PRIMARY_BTN =
    "bg-[var(--t-ac)] text-[color:var(--t-onac)] font-bold uppercase tracking-wider border-2 border-solid border-[color:var(--t-ac2)] border-b-4 border-b-[color:color-mix(in_srgb,_var(--t-ac)_55%,_#000)] hover:brightness-110 active:translate-y-[2px] active:border-b-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150";
const ACTION_BTN =
    "text-[10px] font-bold uppercase tracking-wider py-1 px-2 border border-solid border-[color:var(--t-ac)] text-[color:var(--t-ac)] hover:bg-[var(--t-ac)] hover:text-[color:var(--t-onac)] transition-colors duration-150";
const SEGMENTS = "repeating-linear-gradient(90deg, transparent 0 9px, rgba(0,0,0,0.3) 9px 10px)";
const MODAL_SHADOW = "6px 6px 0px var(--t-shadow), 0 0 40px color-mix(in srgb, var(--t-glow) 18%, transparent)";

/* Tinted tag chip (same idea as the Dashboard's tag-lime / tag-gold / tag-cyan). */
function Badge({ color, children, className = "" }) {
    return (
        <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 border border-solid shrink-0 ${className}`}
            style={{ backgroundColor: withAlpha(color, "26"), borderColor: withAlpha(color, "66"), color }}
        >
            {children}
        </span>
    );
}

/* Header bar shared by every panel: glyph + title + optional right slot. */
function PanelHeader({ icon = "◆", title, right }) {
    return (
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-solid border-[color:var(--t-bd0)] bg-[color-mix(in_srgb,_var(--t-ac)_7%,_transparent)]">
            <span className="flex items-center gap-2 min-w-0">
                <span className="text-[color:var(--t-ac)] text-[13px] leading-none">{icon}</span>
                <span className="text-[color:var(--t-tx0)] text-xs font-bold uppercase tracking-wider truncate">{title}</span>
            </span>
            {right}
        </div>
    );
}

/* Square avatar with a pixel "hair" strip, like the Dashboard player avatar. */
function PixelAvatar({ color, text, className = "w-9 h-9 text-[11px]" }) {
    return (
        <div
            className={`relative shrink-0 flex items-center justify-center font-bold border-2 border-solid ${className}`}
            style={{ backgroundColor: withAlpha(color, "26"), borderColor: color, color }}
        >
            <span className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: color }} />
            {text}
        </div>
    );
}

/* Modal title row: glyph + micro-caps title + close button. */
function ModalHeader({ icon, title, onClose }) {
    return (
        <div className="flex justify-between items-center mb-1">
            <span className="flex items-center gap-2 min-w-0 text-[color:var(--t-tx0)] text-sm font-bold uppercase tracking-wider">
                <span className="text-[color:var(--t-ac)]">{icon}</span>
                <span className="truncate">{title}</span>
            </span>
            <button
                type="button"
                onClick={onClose}
                className="text-[color:var(--t-mtx)] text-lg leading-none hover:text-[color:var(--t-ac2)] transition-colors"
            >
                ×
            </button>
        </div>
    );
}

function ClassworkTypeIcon({ type, className = "w-4 h-4" }) {
    if (type === "quiz") return <Icon.Quiz className={className} />;
    if (type === "question") return <Icon.Question className={className} />;
    if (type === "material") return <Icon.Material className={className} />;
    return <Icon.Assignment className={className} />;
}

function classworkTypeLabel(type) {
    if (type === "quiz") return "Quiz assignment";
    if (type === "question") return "Question";
    if (type === "material") return "Material";
    return "Assignment";
}

/* ------------------------------------------------------------------ */
/*  Due-date helpers: parse the due value and describe time remaining  */
/* ------------------------------------------------------------------ */
const MONTHS = "janfebmaraprmayjunjulaugsepoctnovdec";

function parseDueAt(item) {
    if (item.dueAt) {
        const d = new Date(item.dueAt);
        if (!isNaN(d)) return d;
    }
    if (!item.due) return null;
    // Handles "Mon, Mar 23, 11:59 PM" and "Wed, Oct 14" (no time = end of day).
    // The strings carry no year, so the current year is assumed.
    const m = String(item.due).match(
        /(?:[A-Za-z]{3},\s*)?([A-Za-z]{3})[a-z]*\s+(\d{1,2})(?:,\s*(\d{4}))?(?:,?\s+(\d{1,2}):(\d{2})\s*(AM|PM))?/i
    );
    if (!m) {
        const d = new Date(item.due);
        return isNaN(d) ? null : d;
    }
    const month = MONTHS.indexOf(m[1].toLowerCase()) / 3;
    if (!Number.isInteger(month) || month < 0) return null;
    let hour = 23;
    let min = 59;
    if (m[4]) {
        hour = Number(m[4]) % 12;
        if (m[6].toUpperCase() === "PM") hour += 12;
        min = Number(m[5]);
    }
    const year = m[3] ? Number(m[3]) : new Date().getFullYear();
    return new Date(year, month, Number(m[2]), hour, min);
}

/* Returns { text, color } describing how long is left, or null if there is no due date. */
function dueInfo(item, now) {
    const d = parseDueAt(item);
    if (!d) return null;
    const diff = d.getTime() - now;
    const mins = Math.floor(Math.abs(diff) / 60000);
    const days = Math.floor(mins / 1440);
    const hrs = Math.floor((mins % 1440) / 60);
    const span = days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins % 60}m`;
    if (diff < 0) return { text: `Overdue by ${span}`, color: "var(--t-err)" };
    if (diff < 24 * 3600000) return { text: `${span} left`, color: "var(--t-err)" };
    if (diff < 3 * 24 * 3600000) return { text: `${span} left`, color: "var(--t-warn)" };
    return { text: `${span} left`, color: "var(--t-ok2)" };
}

/* Re-renders its caller every so often so countdowns stay current. */
function useNow(intervalMs = 30000) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);
    return now;
}

/* ------------------------------------------------------------------ */
/*  Sidebar (same shape as chatbot / group_collab / personalized)      */
/* ------------------------------------------------------------------ */
function Sidebar({ activePage, onNavigate, onCloseMobile, onOpenSettings, onLogout }) {
    return (
        <div
            style={{ backgroundImage: "var(--t-grad-side)" }}
            className="flex flex-col h-full bg-[var(--t-bg0)] w-64 shrink-0"
        >
            <div className="flex justify-end md:hidden px-3 pt-3">
                <button onClick={onCloseMobile} aria-label="Close menu">
                    <CloseIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="flex items-center self-stretch bg-[color-mix(in_srgb,_var(--t-bg2)_45%,_transparent)] py-[13px]">
                    <img src={NAV_IMG.logo} className="w-9 h-9 ml-4 mr-3 object-fill" alt="" />
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
                        const active = item.key === activePage;
                        return (
                            <button
                                key={item.key}
                                onClick={() => onNavigate(item.key)}
                                className={`flex items-center self-stretch py-[9px] text-left border border-solid transition-all duration-150 active:scale-[0.98] ${active ? "bg-[var(--t-bg3)] border-[#00000000]" : "border-[#00000000] hover:bg-[var(--t-bg2)]"
                                    }`}
                                style={active ? { boxShadow: "0px 0px 15px color-mix(in srgb, var(--t-ac) 15%, transparent)" } : undefined}
                            >
                                <img src={item.icon} className={`${item.iconClass} ml-[13px] mr-3 object-fill`} alt="" />
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
                    onClick={onOpenSettings}
                    className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]"
                >
                    <img src={NAV_IMG.settings} className="w-[15px] h-[15px] mx-3 object-fill" alt="" />
                    <span className="text-[color:var(--t-tx1)] text-[11px]">SETTINGS</span>
                </button>
                <button
                    onClick={onLogout}
                    className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]"
                >
                    <img src={NAV_IMG.logout} className="w-3.5 h-3.5 mx-3 object-fill" alt="" />
                    <span className="text-[color:var(--t-tx1)] text-[11px]">LOGOUT</span>
                </button>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Class banner                                                       */
/* ------------------------------------------------------------------ */
function ClassBanner({ color, name, section, tall = false }) {
    return (
        <div
            className={`relative w-full ${tall ? "h-28 sm:h-32" : "h-20"} overflow-hidden`}
            style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${color} 26%, var(--t-bg2)) 0%, color-mix(in srgb, ${color} 8%, var(--t-bg1)) 100%)`,
            }}
        >
            {/* pixel staircase motif */}
            <div className="absolute right-3 bottom-0 flex items-end gap-1" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                    <span key={i} className="block w-2.5" style={{ height: i * 7, backgroundColor: color, opacity: 0.12 + i * 0.1 }} />
                ))}
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-4 pr-24">
                <span className={`font-bold uppercase tracking-wide truncate text-[color:var(--t-tx0)] ${tall ? "text-xl sm:text-2xl" : "text-base"}`}>{name}</span>
                {section && <span className="text-[11px] truncate text-[color:var(--t-tx0)] opacity-80">{section}</span>}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Class card (grid view)                                             */
/* ------------------------------------------------------------------ */
function ClassCard({ cls, onOpen }) {
    return (
        <button
            onClick={() => onOpen(cls.id)}
            className="group flex flex-col text-left self-stretch bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:border-[color:var(--t-ac)] active:scale-[0.99]"
            style={{ boxShadow: PIXEL_SHADOW }}
        >
            <ClassBanner color={cls.color} name={cls.name} section={cls.section} />
            <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                    <p className="text-[color:var(--t-tx0)] text-sm font-bold uppercase tracking-wide truncate">{cls.name}</p>
                    <p className="text-[color:var(--t-tx2)] text-[11px] truncate mt-0.5">{cls.section}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <Badge color="var(--t-ac2)" className="!text-[9px] !py-0 !px-1.5">{cls.owner}</Badge>
                        <span className="text-[color:var(--t-tx2)] text-[10px]">{(cls.students || []).length} students</span>
                    </div>
                </div>
                <PixelAvatar color={cls.color} text={initialsFor(cls.name)} className="w-10 h-10 text-xs" />
            </div>
        </button>
    );
}

/* ------------------------------------------------------------------ */
/*  Create / Join class modals                                         */
/* ------------------------------------------------------------------ */
function CreateClassModal({ onClose, onCreate }) {
    const [name, setName] = useState("");
    const [section, setSection] = useState("");
    const [subject, setSubject] = useState("");
    const [room, setRoom] = useState("");

    function submit(e) {
        e.preventDefault();
        if (!name.trim()) return;
        onCreate({
            name: name.trim(),
            section: section.trim() || "—",
            subject: subject.trim() || "GENERAL",
            room: room.trim() || "",
        });
    }

    const field =
        "w-full bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2.5 px-3 outline-none placeholder:text-[color:var(--t-ph)] focus:border-[color:var(--t-ac)] transition-colors";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form
                onSubmit={submit}
                className="relative bg-[var(--t-mbg)] border border-solid border-[color:var(--t-mbd2)] border-t-[3px] border-t-[color:var(--t-ac)] p-5 w-full max-w-md flex flex-col gap-3"
                style={{ boxShadow: MODAL_SHADOW }}
            >
                <ModalHeader icon="⚑" title="CREATE CLASS" onClose={onClose} />

                <label className="flex flex-col gap-1">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Class name (required)</span>
                    <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Linear Algebra" className={field} />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Section</span>
                    <input value={section} onChange={(e) => setSection(e.target.value)} placeholder="e.g. Section A" className={field} />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Subject</span>
                    <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. MATH210" className={field} />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Room</span>
                    <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Room 304" className={field} />
                </label>

                <button
                    type="submit"
                    disabled={!name.trim()}
                    className={`mt-1 text-xs py-2.5 ${PRIMARY_BTN}`}
                >
                    CREATE
                </button>
            </form>
        </div>
    );
}

function JoinClassModal({ onClose, onJoin }) {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    function submit(e) {
        e.preventDefault();
        const c = code.trim().toLowerCase();
        if (!c) return;
        onJoin(c, (msg) => setError(msg || ""));
    }

    const field =
        "w-full bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2.5 px-3 outline-none placeholder:text-[color:var(--t-ph)] focus:border-[color:var(--t-ac)] transition-colors tracking-[0.3em] text-center";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form
                onSubmit={submit}
                className="relative bg-[var(--t-mbg)] border border-solid border-[color:var(--t-mbd2)] border-t-[3px] border-t-[color:var(--t-ac)] p-5 w-full max-w-sm flex flex-col gap-3"
                style={{ boxShadow: MODAL_SHADOW }}
            >
                <ModalHeader icon="⛆" title="JOIN CLASS" onClose={onClose} />

                <p className="text-[color:var(--t-mtx)] text-[11px] -mt-1">Ask your teacher for the class code, then enter it here.</p>

                <input
                    autoFocus
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        if (error) setError("");
                    }}
                    placeholder="CLASS CODE"
                    maxLength={8}
                    className={field}
                />
                {error && <span className="text-[color:var(--t-err)] text-[11px]">{error}</span>}

                <button
                    type="submit"
                    disabled={!code.trim()}
                    className={`mt-1 text-xs py-2.5 ${PRIMARY_BTN}`}
                >
                    JOIN
                </button>
            </form>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Turn-in modal                                                      */
/* ------------------------------------------------------------------ */
function TurnInModal({ cls, item, onClose, onTurnIn }) {
    const [note, setNote] = useState("");
    const [attached, setAttached] = useState(false);
    const now = useNow();

    if (!cls || !item || !item.id) return null;

    const isTeacher = cls.teachers.some((t) => t.id === CURRENT_USER.id);
    const isMaterial = item.type === "material";
    const graded = item.grade != null;
    const done = !!item.submitted;
    const canSubmit = !isMaterial && !isTeacher && !done;
    const info = !isMaterial && !done && !graded ? dueInfo(item, now) : null;

    function submit(e) {
        e.preventDefault();
        if (!canSubmit) return;
        onTurnIn(cls.id, item.id, { note: note.trim(), attached });
    }

    const field =
        "w-full bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2.5 px-3 outline-none placeholder:text-[color:var(--t-ph)] focus:border-[color:var(--t-ac)] transition-colors";
    const box = "bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] p-3";

    const showWorkPanel = !isMaterial && !isTeacher;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form
                onSubmit={submit}
                className={`relative bg-[var(--t-mbg)] border border-solid border-[color:var(--t-mbd2)] border-t-[3px] border-t-[color:var(--t-ac)] p-5 w-full ${showWorkPanel ? "max-w-4xl" : "max-w-lg"} flex flex-col gap-4 max-h-[92vh] overflow-y-auto`}
                style={{ boxShadow: MODAL_SHADOW }}
            >
                <ModalHeader icon={<ClassworkTypeIcon type={item.type} className="w-4 h-4" />} title={classworkTypeLabel(item.type)} onClose={onClose} />

                <div className={`grid grid-cols-1 gap-5 ${showWorkPanel ? "md:grid-cols-[1fr_320px]" : ""}`}>
                    {/* LEFT: assignment information + description */}
                    <div className="flex flex-col gap-3 min-w-0">
                        <div>
                            <p className="text-[color:var(--t-tx0)] text-base font-bold break-words">{item.title}</p>
                            <p className="text-[color:var(--t-tx2)] text-[11px] mt-1">
                                {cls.name}
                                {item.topic ? ` · ${item.topic}` : ""}
                            </p>
                        </div>

                        {info && (
                            <div className={`${box} flex items-center justify-between gap-3`}>
                                <span className="text-sm font-semibold" style={{ color: info.color }}>{info.text}</span>
                                <span className="text-[11px] text-[color:var(--t-tx2)] text-right">Due {item.due}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-2">
                            <div className={box}>
                                <p className={LABEL}>Points</p>
                                <p className="text-[color:var(--t-tx0)] text-sm font-bold mt-0.5">{item.points ?? "—"}</p>
                            </div>
                            <div className={box}>
                                <p className={LABEL}>Posted</p>
                                <p className="text-[color:var(--t-tx0)] text-sm font-bold mt-0.5">{item.posted || "—"}</p>
                            </div>
                            <div className={box}>
                                <p className={LABEL}>Status</p>
                                <p className="text-[color:var(--t-tx0)] text-sm font-bold mt-0.5">
                                    {isMaterial ? "Material" : graded ? "Graded" : done ? "Turned in" : "Assigned"}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className={LABEL}>Instructions</span>
                            <p className="text-[color:var(--t-tx1)] text-xs leading-relaxed whitespace-pre-wrap break-words">
                                {item.description || "No instructions were provided."}
                            </p>
                        </div>

                        {(item.attachments || []).length > 0 && (
                            <div className="flex flex-col gap-1.5">
                                <span className={LABEL}>Attachments</span>
                                {item.attachments.map((a) => (
                                    <div key={a.name} className={`${box} flex items-center gap-2`}>
                                        <Icon.Attach className="w-3.5 h-3.5 shrink-0 text-[color:var(--t-ac2)]" />
                                        <span className="text-[color:var(--t-tx0)] text-xs font-bold truncate flex-1">{a.name}</span>
                                        <span className="text-[color:var(--t-tx2)] text-[10px] shrink-0">{a.size}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: the student's work + turn in */}
                    {showWorkPanel && (
                        <div className="flex flex-col gap-3 md:border-l md:border-solid md:border-[color:var(--t-mbd)] md:pl-5">
                            <span className={LABEL}>Your work</span>

                            {graded && (
                                <div className="flex items-center justify-between py-2.5 px-3 border border-solid border-[color:var(--t-ok2)] bg-[color-mix(in_srgb,_var(--t-ok2)_14%,_transparent)]">
                                    <span className="text-[color:var(--t-ok2)] text-xs font-bold uppercase tracking-wider">Your grade</span>
                                    <span className="text-[color:var(--t-ok2)] text-lg font-black">{item.grade}/{item.points}</span>
                                </div>
                            )}

                            {done && (
                                <div className="flex flex-col gap-1 py-2.5 px-3 border border-solid border-[color:var(--t-ok)] bg-[color-mix(in_srgb,_var(--t-ok)_12%,_transparent)]">
                                    <span className="text-[color:var(--t-ok2)] text-xs font-bold uppercase tracking-wider">✓ Turned in</span>
                                    {item.submissionAttached && <span className="text-[color:var(--t-tx1)] text-[11px]">submission.pdf attached</span>}
                                    {item.submissionNote && <span className="text-[color:var(--t-tx1)] text-[11px] break-words">“{item.submissionNote}”</span>}
                                </div>
                            )}

                            {canSubmit && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setAttached((v) => !v)}
                                        className={`flex items-center justify-center gap-2 text-[11px] font-bold py-3 px-3 border border-dashed transition-all duration-150 active:scale-95 ${attached
                                            ? "bg-[color-mix(in_srgb,_var(--t-ok)_16%,_transparent)] border-[color:var(--t-ok)] text-[color:var(--t-ok2)]"
                                            : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-ac2)]"
                                            }`}
                                    >
                                        <Icon.Attach className="w-3.5 h-3.5" />
                                        {attached ? "submission.pdf attached" : "Attach your work"}
                                    </button>

                                    <label className="flex flex-col gap-1">
                                        <span className="text-[color:var(--t-mtx)] text-[11px]">Private comment (optional)</span>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            rows={4}
                                            placeholder="Add a note for your teacher…"
                                            className={`${field} resize-none`}
                                        />
                                    </label>

                                    <button type="submit" className={`mt-1 text-xs py-2.5 ${PRIMARY_BTN}`}>
                                        TURN IN
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Create post modal (teacher-only)                                   */
/* ------------------------------------------------------------------ */
function CreatePostModal({ cls, onClose, onCreate }) {
    const [type, setType] = useState("announcement");
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [due, setDue] = useState("");
    const [points, setPoints] = useState(100);
    const [topic, setTopic] = useState(cls.topics[0] || "General");

    function submit(e) {
        e.preventDefault();
        if (type === "announcement") {
            if (!text.trim()) return;
            onCreate({ type, text: text.trim() });
        } else {
            if (!title.trim()) return;
            onCreate({
                type,
                text: description.trim(),
                title: title.trim(),
                description: description.trim(),
                due: due ? new Date(`${due}T23:59:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "",
                dueAt: due ? `${due}T23:59:00` : "",
                points: type === "material" ? null : Number(points) || 0,
                topic,
            });
        }
    }

    const field =
        "w-full bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2.5 px-3 outline-none placeholder:text-[color:var(--t-ph)] focus:border-[color:var(--t-ac)] transition-colors";

    const TYPES = [
        { id: "announcement", label: "Announcement", icon: <Icon.Stream className="w-3.5 h-3.5" /> },
        { id: "assignment", label: "Assignment", icon: <Icon.Assignment className="w-3.5 h-3.5" /> },
        { id: "quiz", label: "Quiz assignment", icon: <Icon.Quiz className="w-3.5 h-3.5" /> },
        { id: "question", label: "Question", icon: <Icon.Question className="w-3.5 h-3.5" /> },
        { id: "material", label: "Material", icon: <Icon.Material className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form
                onSubmit={submit}
                className="relative bg-[var(--t-mbg)] border border-solid border-[color:var(--t-mbd2)] border-t-[3px] border-t-[color:var(--t-ac)] p-5 w-full max-w-lg flex flex-col gap-3 max-h-[92vh] overflow-y-auto"
                style={{ boxShadow: MODAL_SHADOW }}
            >
                <ModalHeader icon="✉" title={`POST TO ${cls.name.toUpperCase()}`} onClose={onClose} />

                <div className="flex flex-wrap gap-1.5">
                    {TYPES.map((t) => (
                        <button
                            type="button"
                            key={t.id}
                            onClick={() => setType(t.id)}
                            className={`flex items-center gap-1.5 text-[11px] font-bold py-1.5 px-2.5 border border-solid transition-all duration-150 active:scale-95 ${type === t.id
                                ? "bg-[color-mix(in_srgb,_var(--t-ac)_18%,_transparent)] border-[color:var(--t-ac)] text-[color:var(--t-ac)]"
                                : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-ac2)]"
                                }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </div>

                {type === "announcement" ? (
                    <label className="flex flex-col gap-1">
                        <span className="text-[color:var(--t-mtx)] text-[11px]">Announce something to your class</span>
                        <textarea
                            autoFocus
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={4}
                            placeholder="Share a reminder, update, or resource…"
                            className={`${field} resize-none`}
                        />
                    </label>
                ) : (
                    <>
                        <label className="flex flex-col gap-1">
                            <span className="text-[color:var(--t-mtx)] text-[11px]">Title</span>
                            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className={field} placeholder="e.g. Problem Set 5" />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-[color:var(--t-mtx)] text-[11px]">Description</span>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className={`${field} resize-none`}
                                placeholder="What should students do?"
                            />
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <label className="flex flex-col gap-1">
                                <span className="text-[color:var(--t-mtx)] text-[11px]">Due</span>
                                <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={`${field} pz-date`} />
                            </label>
                            {type !== "material" && (
                                <label className="flex flex-col gap-1">
                                    <span className="text-[color:var(--t-mtx)] text-[11px]">Points</span>
                                    <input type="number" min="0" value={points} onChange={(e) => setPoints(e.target.value)} className={field} />
                                </label>
                            )}
                            <label className="flex flex-col gap-1">
                                <span className="text-[color:var(--t-mtx)] text-[11px]">Topic</span>
                                <select value={topic} onChange={(e) => setTopic(e.target.value)} className={field}>
                                    {cls.topics.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    className={`mt-1 text-xs py-2.5 ${PRIMARY_BTN}`}
                >
                    POST
                </button>
            </form>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Stream post                                                        */
/* ------------------------------------------------------------------ */
function StreamPost({ post, classwork, isTeacher, onAddComment }) {
    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState((post.comments || []).length > 0);

    function submitComment(e) {
        e.preventDefault();
        if (!comment.trim()) return;
        onAddComment(post.id, comment.trim());
        setComment("");
        setShowComments(true);
    }

    const t = classwork?.type || post.type;

    return (
        <div className="flex flex-col self-stretch bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)]" style={{ boxShadow: PIXEL_SHADOW }}>
            <div className="flex items-start gap-3 p-4">
                <PixelAvatar color={isTeacher ? "var(--t-ac2)" : "var(--t-ac)"} text={initialsFor(post.authorName)} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[color:var(--t-tx0)] text-sm font-bold uppercase tracking-wide">{post.authorName}</span>
                        <span className="text-[color:var(--t-tx2)] text-[10px]">{post.time}</span>
                        {post.authorRole === "teacher" && <Badge color="var(--t-ac2)">TEACHER</Badge>}
                    </div>
                    <p className="text-[color:var(--t-tx1)] text-[13px] whitespace-pre-wrap mt-1">{post.text}</p>

                    {classwork && (
                        <div className="mt-3 flex flex-col gap-2 p-3 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] border-l-[3px] border-l-[color:var(--t-ac2)]">
                            <div className="flex items-center gap-2">
                                <ClassworkTypeIcon type={t} className="w-4 h-4 text-[color:var(--t-ac2)]" />
                                <span className="text-[color:var(--t-tx0)] text-xs font-bold truncate">{classwork.title}</span>
                            </div>
                            {classwork.description && (
                                <p className="text-[color:var(--t-tx2)] text-[11px]">{classwork.description}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold">
                                {classwork.due && <Badge color="var(--t-warn)">▲ Due {classwork.due}</Badge>}
                                {classwork.points != null && <Badge color="var(--t-ok)">{classwork.points} PTS</Badge>}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                        <button
                            onClick={() => setShowComments((v) => !v)}
                            className="flex items-center gap-1.5 text-[color:var(--t-tx2)] text-[11px] hover:text-[color:var(--t-ac2)] transition-colors"
                        >
                            <Icon.Comment className="w-3.5 h-3.5" />
                            {post.comments?.length || 0} comment{post.comments?.length === 1 ? "" : "s"}
                        </button>
                    </div>

                    {showComments && (
                        <div className="mt-3 flex flex-col gap-2">
                            {(post.comments || []).map((c) => (
                                <div key={c.id} className="flex items-start gap-2.5">
                                    <PixelAvatar color="var(--t-ac2)" text={initialsFor(c.authorName)} className="w-7 h-7 text-[10px]" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[color:var(--t-tx0)] text-[12px] font-bold">{c.authorName}</span>
                                            <span className="text-[color:var(--t-tx2)] text-[10px]">{c.time}</span>
                                        </div>
                                        <p className="text-[color:var(--t-tx1)] text-[12px] whitespace-pre-wrap">{c.text}</p>
                                    </div>
                                </div>
                            ))}

                            <form onSubmit={submitComment} className="flex items-center gap-2 mt-1">
                                <input
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a class comment…"
                                    className="flex-1 min-w-0 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] placeholder-[color:var(--t-tx2)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac2)]"
                                />
                                <button
                                    type="submit"
                                    disabled={!comment.trim()}
                                    className="shrink-0 bg-[var(--t-ac2)] text-[color:var(--t-onac)] text-[11px] font-bold uppercase tracking-wider py-2 px-3 border-b-2 border-solid border-b-[color:color-mix(in_srgb,_var(--t-ac2)_55%,_#000)] hover:brightness-110 active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
                                >
                                    Post
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Classwork row                                                      */
/* ------------------------------------------------------------------ */
function ClassworkRow({ item, onOpen, highlighted = false }) {
    const now = useNow();
    const rowRef = useRef(null);
    useEffect(() => {
        if (highlighted) rowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [highlighted]);
    const done = !!item.submitted;
    const graded = item.grade != null;
    const label = classworkTypeLabel(item.type);
    const info = item.type !== "material" && !done && !graded ? dueInfo(item, now) : null;

    return (
        <button
            ref={rowRef}
            onClick={() => onOpen(item.id)}
            style={highlighted ? { boxShadow: "0 0 0 2px var(--t-ac), 0 0 24px color-mix(in srgb, var(--t-ac) 40%, transparent)" } : undefined}
            className="group flex items-center gap-3 w-full text-left bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] border-l-[3px] border-l-[color:var(--t-ac2)] p-3 hover:border-[color:var(--t-ac)] hover:border-l-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.995]"
        >
            <div
                className="relative w-9 h-9 shrink-0 flex items-center justify-center border-2 border-solid"
                style={{ backgroundColor: withAlpha("var(--t-ac2)", "26"), color: "var(--t-ac2)", borderColor: "var(--t-ac2)" }}
            >
                <span className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: "var(--t-ac2)" }} />
                <ClassworkTypeIcon type={item.type} className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-[color:var(--t-tx0)] text-sm font-bold truncate block">{item.title}</span>
                <span className="text-[color:var(--t-tx2)] text-[11px] truncate block">
                    {label} · Posted {item.posted}
                    {item.points != null ? ` · ${item.points} pts` : ""}
                </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {graded ? (
                    <Badge color="var(--t-ok2)">{item.grade}/{item.points}</Badge>
                ) : done ? (
                    <Badge color="var(--t-ok)">TURNED IN</Badge>
                ) : info ? (
                    <div className="flex flex-col items-end text-right">
                        <span className="text-xs font-semibold leading-tight" style={{ color: info.color }}>{info.text}</span>
                        <span className="text-[10px] text-[color:var(--t-tx2)] leading-tight mt-0.5">Due {item.due}</span>
                    </div>
                ) : item.type !== "material" ? (
                    <span className="text-[color:var(--t-tx2)] text-[11px] font-bold uppercase tracking-wider">No due date</span>
                ) : null}
            </div>
        </button>
    );
}

/* ------------------------------------------------------------------ */
/*  Missing-work row (Grades tab): whole card opens the details popup  */
/* ------------------------------------------------------------------ */
function MissingRow({ item, onOpen }) {
    const now = useNow();
    const info = dueInfo(item, now);
    const tint = info ? info.color : "var(--t-warn)";

    return (
        <button
            onClick={() => onOpen(item.id)}
            className="flex items-center justify-between gap-3 w-full text-left p-3 border border-solid border-[color:var(--t-bd0)] bg-[color-mix(in_srgb,_var(--card-tint)_14%,_transparent)] hover:bg-[color-mix(in_srgb,_var(--card-tint)_6%,_transparent)] transition-colors duration-150 active:scale-[0.995]"
            style={{ "--card-tint": tint }}
        >
            <div className="min-w-0">
                <span className="text-[color:var(--t-tx0)] text-sm font-bold truncate block">{item.title}</span>
                <span className="text-[color:var(--t-tx2)] text-[11px] truncate block">
                    {classworkTypeLabel(item.type)}
                    {item.points != null ? ` · ${item.points} pts` : ""}
                </span>
            </div>
            {info ? (
                <div className="flex flex-col items-end text-right shrink-0">
                    <span className="text-xs font-semibold leading-tight" style={{ color: info.color }}>{info.text}</span>
                    <span className="text-[10px] text-[color:var(--t-tx2)] leading-tight mt-0.5">Due {item.due}</span>
                </div>
            ) : (
                <span className="shrink-0 text-[color:var(--t-tx2)] text-[11px] font-bold uppercase tracking-wider">No due date</span>
            )}
        </button>
    );
}

/* ------------------------------------------------------------------ */
/*  Class detail view with tabs                                        */
/* ------------------------------------------------------------------ */
function ClassDetail({
    cls,
    tab,
    setTab,
    onBack,
    onAddComment,
    onTurnIn,
    onCreatePost,
    onCopyCode,
    copiedCode,
    highlightId = null,
}) {
    const isTeacher = cls.teachers.some((t) => t.id === CURRENT_USER.id);

    // --- Stream tab
    const renderStream = () => (
        <div className="flex flex-col gap-3 w-full">
            {isTeacher && (
                <button
                    onClick={onCreatePost}
                    className="flex items-center gap-3 self-stretch bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] p-3 text-left hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.995]"
                    style={{ boxShadow: PIXEL_SHADOW }}
                >
                    <PixelAvatar color="var(--t-ac)" text={initialsFor(CURRENT_USER.name)} />
                    <span className="text-[color:var(--t-tx2)] text-xs">Announce something to your class…</span>
                </button>
            )}
            {cls.stream.map((p) => {
                const cw = p.classworkId ? cls.classwork.find((c) => c.id === p.classworkId) : null;
                return (
                    <StreamPost
                        key={p.id}
                        post={p}
                        classwork={cw}
                        isTeacher={p.authorRole === "teacher"}
                        onAddComment={onAddComment}
                    />
                );
            })}
            {cls.stream.length === 0 && (
                <p className="text-[color:var(--t-tx2)] text-xs py-8 text-center">No posts yet.</p>
            )}
        </div>
    );

    // --- Classwork tab: group by topic
    const renderClasswork = () => {
        const byTopic = {};
        cls.classwork.forEach((item) => {
            const t = item.topic || "General";
            if (!byTopic[t]) byTopic[t] = [];
            byTopic[t].push(item);
        });
        const topics = Object.keys(byTopic);

        return (
            <div className="flex flex-col gap-6 w-full">
                {isTeacher && (
                    <button
                        onClick={onCreatePost}
                        className={`self-start flex items-center gap-2 text-xs py-2 px-3.5 ${PRIMARY_BTN}`}
                    >
                        <Icon.Plus className="w-3.5 h-3.5" />
                        Create
                    </button>
                )}
                {topics.length === 0 && (
                    <p className="text-[color:var(--t-tx2)] text-xs py-8 text-center">No classwork yet.</p>
                )}
                {topics.map((t) => (
                    <section key={t} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between border-b border-solid border-[color:var(--t-bd0)] pb-1.5">
                            <span className="flex items-center gap-2 text-[color:var(--t-tx0)] text-xs font-bold uppercase tracking-wider">
                                <span className="text-[color:var(--t-ac)]">▤</span>
                                {t}
                            </span>
                            <Badge color="var(--t-warn)">{byTopic[t].length} item{byTopic[t].length === 1 ? "" : "s"}</Badge>
                        </div>
                        <div className="flex flex-col gap-2">
                            {byTopic[t].map((item) => (
                                <ClassworkRow
                                    key={item.id}
                                    item={item}
                                    onOpen={(id) => onTurnIn(id)}
                                    highlighted={item.id === highlightId}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        );
    };

    // --- People tab
    const renderPeople = () => (
        <div className="flex flex-col gap-6 w-full">
            <section className="flex flex-col gap-2">
                <div className="flex items-center gap-2 border-b border-solid border-[color:var(--t-ac)] pb-2">
                    <span className="text-[color:var(--t-ac)] text-xs font-bold uppercase tracking-wider">⚑ Teachers</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6">
                    {cls.teachers.map((t) => (
                        <div key={t.id} className="flex items-center gap-3 py-2">
                            <PixelAvatar color="var(--t-ac2)" text={initialsFor(t.name)} />
                            <div className="min-w-0">
                                <span className="text-[color:var(--t-tx0)] text-sm block truncate">{t.name}</span>
                                <span className="text-[color:var(--t-tx2)] text-[11px] truncate block">{t.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-solid border-[color:var(--t-ac)] pb-2">
                    <span className="text-[color:var(--t-ac)] text-xs font-bold uppercase tracking-wider">⛆ Classmates</span>
                    <Badge color="var(--t-warn)">{cls.students.length} students</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6">
                    {cls.students.map((s) => (
                        <div key={s.id} className="flex items-center gap-3 py-2">
                            <PixelAvatar color="var(--t-ac)" text={initialsFor(s.name)} />
                            <span className="text-[color:var(--t-tx0)] text-sm truncate">{s.name}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    // --- Grades tab
    const renderGrades = () => {
        const graded = cls.classwork.filter((c) => c.grade != null);
        const totalPoints = graded.reduce((s, c) => s + (c.points || 0), 0);
        const earned = graded.reduce((s, c) => s + (c.grade || 0), 0);
        const pct = totalPoints ? Math.round((earned / totalPoints) * 100) : 0;
        const missing = cls.classwork.filter((c) => c.type !== "material" && !c.submitted);

        return (
            <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] p-4">
                        <p className={LABEL}>OVERALL GRADE</p>
                        <p className="text-[color:var(--t-ok2)] text-2xl font-bold mt-1">{pct}%</p>
                        <p className="text-[color:var(--t-tx2)] text-[11px] mt-1">
                            {earned} / {totalPoints} pts
                        </p>
                        <div className="relative h-2.5 mt-2 bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)]">
                            <div className="h-full bg-[var(--t-ok)]" style={{ width: `${Math.min(pct, 100)}%` }} />
                            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: SEGMENTS }} />
                        </div>
                    </div>
                    <div className="bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] p-4">
                        <p className={LABEL}>GRADED</p>
                        <p className="text-[color:var(--t-tx0)] text-2xl font-bold mt-1">{graded.length}</p>
                        <p className="text-[color:var(--t-tx2)] text-[11px] mt-1">assignments returned</p>
                    </div>
                    <div className="bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] p-4">
                        <p className={LABEL}>MISSING</p>
                        <p className="text-[color:var(--t-warn)] text-2xl font-bold mt-1">{missing.length}</p>
                        <p className="text-[color:var(--t-tx2)] text-[11px] mt-1">not turned in</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-[color:var(--t-tx0)] text-xs font-bold uppercase tracking-wider">▤ Graded work</span>
                    {graded.length === 0 && <p className="text-[color:var(--t-tx2)] text-xs py-4">Nothing graded yet.</p>}
                    {graded.map((c) => (
                        <div
                            key={c.id}
                            className="flex items-center justify-between gap-3 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] border-l-[3px] border-l-[color:var(--t-ok2)] p-3"
                        >
                            <div className="min-w-0">
                                <span className="text-[color:var(--t-tx0)] text-sm font-bold truncate block">{c.title}</span>
                                <span className="text-[color:var(--t-tx2)] text-[11px]">{classworkTypeLabel(c.type)}</span>
                            </div>
                            <Badge color="var(--t-ok2)">{c.grade}/{c.points}</Badge>
                        </div>
                    ))}
                </div>

                {missing.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <span className="text-[color:var(--t-warn)] text-xs font-bold uppercase tracking-wider">▲ Missing</span>
                        {missing.map((c) => (
                            <MissingRow key={c.id} item={c} onOpen={(id) => onTurnIn(id)} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const TABS = [
        { key: "stream", label: "Stream", icon: <Icon.Stream className="w-3.5 h-3.5" /> },
        { key: "classwork", label: "Classwork", icon: <Icon.Classwork className="w-3.5 h-3.5" /> },
        { key: "people", label: "People", icon: <Icon.People className="w-3.5 h-3.5" /> },
        { key: "grades", label: "Grades", icon: <Icon.Grades className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="flex-1 min-h-0 overflow-y-auto">
            {/* Banner header */}
            <div className="relative">
                <ClassBanner color={cls.color} name={cls.name} section={cls.section} tall />
                <button
                    onClick={onBack}
                    aria-label="Back to classes"
                    className="absolute top-3 left-3 flex items-center gap-1.5 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd1)] text-[color:var(--t-tx0)] text-[11px] font-bold uppercase tracking-wider py-1.5 px-2.5 hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-colors"
                >
                    <Icon.Back className="w-3.5 h-3.5" />
                    Classes
                </button>
                <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                        onClick={onCopyCode}
                        className="flex items-center gap-1.5 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd1)] text-[color:var(--t-tx0)] text-[11px] font-bold uppercase tracking-wider py-1.5 px-2.5 hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-colors"
                        title="Copy class code"
                    >
                        <Icon.Copy className="w-3.5 h-3.5" />
                        {copiedCode ? "Copied!" : cls.code}
                    </button>
                </div>
            </div>

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 sm:px-8 py-3 border-b border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg1)]">
                <span className="text-[color:var(--t-tx1)] text-xs">
                    <span className={LABEL}>Room · </span>
                    {cls.room || "—"}
                </span>
                <span className="text-[color:var(--t-tx1)] text-xs">
                    <span className={LABEL}>Subject · </span>
                    {cls.subject}
                </span>
                <span className="text-[color:var(--t-tx1)] text-xs">
                    <span className={LABEL}>Teacher · </span>
                    {cls.owner}
                </span>
                <span className="text-[color:var(--t-tx1)] text-xs">
                    <span className={LABEL}>Code · </span>
                    {cls.code}
                </span>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg1)] px-4 sm:px-8">
                {TABS.map((t) => {
                    const active = tab === t.key;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex items-center gap-2 py-3 px-3 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap border-b-2 -mb-px transition-all duration-150 ${active
                                ? "border-[color:var(--t-ac)] text-[color:var(--t-ac)]"
                                : "border-transparent text-[color:var(--t-tx1)] hover:text-[color:var(--t-tx0)]"
                                }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div className="px-4 sm:px-8 py-6">
                {tab === "stream" && renderStream()}
                {tab === "classwork" && renderClasswork()}
                {tab === "people" && renderPeople()}
                {tab === "grades" && renderGrades()}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Class list (grid) + To-do panel                                    */
/* ------------------------------------------------------------------ */
function ClassList({ classes, onOpen, onCreateClass, onJoinClass }) {
    const todo = useMemo(() => {
        const items = [];
        classes.forEach((c) => {
            c.classwork.forEach((cw) => {
                if (cw.type !== "material" && !cw.submitted && cw.due) {
                    items.push({ cls: c, item: cw });
                }
            });
        });
        return items.slice(0, 8);
    }, [classes]);

    return (
        <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="px-4 sm:px-8 py-6 flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className={LABEL}>Classroom HQ</p>
                        <div className="flex flex-wrap items-center gap-2.5 mt-1">
                            <h1 className="text-[color:var(--t-tx0)] text-[22px] sm:text-[26px] leading-none font-bold uppercase tracking-wide">Classes</h1>
                            <Badge color="var(--t-ok)">[{classes.length} ENROLLED]</Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onJoinClass}
                            className="flex items-center gap-1.5 bg-[var(--t-bg0)] border-2 border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs font-bold uppercase tracking-wider py-2 px-3 hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-95"
                        >
                            <Icon.Link className="w-3.5 h-3.5" />
                            Join class
                        </button>
                        <button
                            onClick={onCreateClass}
                            className={`flex items-center gap-1.5 text-xs py-2 px-3.5 ${PRIMARY_BTN}`}
                        >
                            <Icon.Plus className="w-3.5 h-3.5" />
                            Create class
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                        {classes.map((cls) => (
                            <ClassCard key={cls.id} cls={cls} onOpen={onOpen} />
                        ))}
                        {classes.length === 0 && (
                            <p className="text-[color:var(--t-tx2)] text-xs py-10 text-center col-span-full">
                                You haven't joined any classes yet. Use “Join class” with a code from your teacher.
                            </p>
                        )}
                    </div>

                    <aside className="flex flex-col bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)]" style={{ boxShadow: PIXEL_SHADOW }}>
                        <PanelHeader icon="⚑" title="To-do" right={<Badge color="var(--t-warn)">{todo.length} upcoming</Badge>} />
                        <div className="flex flex-col gap-2 p-3">
                            {todo.length === 0 && (
                                <p className="text-[color:var(--t-tx2)] text-xs py-4 text-center">Nothing due. You're all caught up.</p>
                            )}
                            {todo.map(({ cls, item }) => (
                                <button
                                    key={`${cls.id}-${item.id}`}
                                    onClick={() => onOpen(cls.id)}
                                    className="flex items-start gap-2.5 text-left p-2.5 border border-solid border-[color:var(--t-bd0)] bg-[color-mix(in_srgb,_var(--card-tint)_14%,_transparent)] hover:bg-[color-mix(in_srgb,_var(--card-tint)_6%,_transparent)] transition-colors duration-150"
                                    style={{ "--card-tint": cls.color }}
                                >
                                    <div
                                        className="relative w-8 h-8 shrink-0 flex items-center justify-center border-2 border-solid"
                                        style={{ backgroundColor: withAlpha(cls.color, "26"), color: cls.color, borderColor: cls.color }}
                                    >
                                        <span className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: cls.color }} />
                                        <ClassworkTypeIcon type={item.type} className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[color:var(--t-tx0)] text-xs font-bold truncate">{item.title}</p>
                                        <p className="text-[color:var(--t-tx2)] text-[10px] truncate">{cls.name}</p>
                                        <p className="text-[color:var(--t-warn)] text-[10px] font-bold mt-0.5">Due {item.due}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Error boundary — a crash inside the page shows a message instead   */
/*  of unmounting everything (which looks like a black screen).        */
/* ------------------------------------------------------------------ */
class PageErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    componentDidCatch(error, info) {
        console.error("Classroom crashed:", error, info);
        this.setState({ stack: info?.componentStack || "" });
    }
    render() {
        if (!this.state.error) return this.props.children;
        if (this.props.fullScreen) {
            return (
                <div
                    style={{
                        minHeight: "100vh",
                        background: "#181210",
                        color: "#EDE0DC",
                        padding: 32,
                        fontFamily: "ui-monospace, monospace",
                        fontSize: 13,
                    }}
                >
                    <p style={{ color: "#FF6B6B", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
                        Classroom crashed while rendering
                    </p>
                    <p style={{ marginBottom: 12, whiteSpace: "pre-wrap" }}>
                        {String(this.state.error?.message || this.state.error)}
                    </p>
                    <pre style={{ color: "#859394", whiteSpace: "pre-wrap", fontSize: 11 }}>
                        {String(this.state.stack || this.state.error?.stack || "").slice(0, 1500)}
                    </pre>
                </div>
            );
        }
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="text-[color:var(--t-err)] text-sm font-bold">Something went wrong in Classroom.</p>
                <p className="text-[color:var(--t-tx2)] text-xs max-w-md break-words">{String(this.state.error?.message || this.state.error)}</p>
                <button
                    onClick={() => this.setState({ error: null })}
                    className="bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2 px-4"
                >
                    Try again
                </button>
            </div>
        );
    }
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */
function ClassroomPage({ onNavigate } = {}) {
    const navigate = useNavigate();
    const [theme, setTheme, rootThemeStyle] = useTheme();

    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [navCollapsed, setNavCollapsed] = useState(false);
    const [fallbackPage, setFallbackPage] = useState(null); // only used when onNavigate isn't passed

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);

    const [classes, setClasses] = useHubClasses(); // shared with Group Collab (see classHub.js)
    const [activeClassId, setActiveClassId] = useState(null);
    const [tab, setTab] = useState("stream");

    const [showCreateClass, setShowCreateClass] = useState(false);
    const [showJoinClass, setShowJoinClass] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [turnInTarget, setTurnInTarget] = useState(null); // { classId, itemId }
    const [copiedCode, setCopiedCode] = useState(false);

    const activeClass = classes.find((c) => c.id === activeClassId) || null;

    // Arriving from a task message in Group Collab: open that class on the Classwork tab
    // and flash the task. Works whether this page just mounted or was already open.
    const [highlightId, setHighlightId] = useState(null);
    const openRequest = useOpenRequest();
    useEffect(() => {
        if (!openRequest) return;
        if (classes.some((c) => c.id === openRequest.classId)) {
            setShowQuiz(false);
            setActiveClassId(openRequest.classId);
            setTab(openRequest.tab || "classwork");
            setHighlightId(openRequest.classworkId || null);
        }
        clearOpenRequest();
    }, [openRequest, classes]);
    useEffect(() => {
        if (!highlightId) return;
        const id = setTimeout(() => setHighlightId(null), 3500);
        return () => clearTimeout(id);
    }, [highlightId]);

    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") {
                setNotifOpen(false);
                setShowCreateClass(false);
                setShowJoinClass(false);
                setShowCreatePost(false);
                setTurnInTarget(null);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        if (!copiedCode) return;
        const id = setTimeout(() => setCopiedCode(false), 1500);
        return () => clearTimeout(id);
    }, [copiedCode]);

    function updateClass(classId, updater) {
        setClasses((prev) => prev.map((c) => (c.id === classId ? updater(c) : c)));
    }

    function handleNavigate(key) {
        setMobileNavOpen(false);
        if (key === "classroom") {
            setShowQuiz(false);
            setActiveClassId(null);
            return;
        }
        if (onNavigate) {
            onNavigate(key);
        } else if (key === "dashboard") {
            setFallbackPage("dashboard");
        } else if (key === "chatbot") {
            setFallbackPage("chatbot");
        } else if (key === "group") {
            setFallbackPage("group");
        } else if (key === "personalized") {
            setFallbackPage("personalized");
        }
    }

    function handleConfirmLogout() {
        setShowLogoutConfirm(false);
        // TODO: clear auth/session state here once real auth is wired up
        navigate("/");
    }

    function createClass({ name, section, subject, room }) {
        const id = `cls_${Date.now()}`;
        const fresh = {
            id,
            name,
            section,
            subject,
            room,
            code: makeClassCode(),
            color: colorForString(name),
            owner: CURRENT_USER.name,
            teachers: [{ id: CURRENT_USER.id, name: CURRENT_USER.name, email: CURRENT_USER.email }],
            students: [],
            topics: ["General"],
            classwork: [],
            stream: [],
            createdClock: clockNow(),
        };
        setClasses((prev) => [fresh, ...prev]);
        setShowCreateClass(false);
        setActiveClassId(id);
        setTab("stream");
    }

    function joinClass(code, setError) {
        const found = classes.find((c) => c.code.toLowerCase() === code);
        if (!found) {
            setError("No class found with that code.");
            return;
        }
        if (found.students.some((s) => s.id === CURRENT_USER.id)) {
            setError("You're already in this class.");
            return;
        }
        updateClass(found.id, (c) => ({
            ...c,
            students: [...c.students, { id: CURRENT_USER.id, name: CURRENT_USER.name }],
        }));
        setShowJoinClass(false);
        setActiveClassId(found.id);
        setTab("stream");
    }

    function addComment(postId, text) {
        if (!activeClass) return;
        updateClass(activeClass.id, (c) => ({
            ...c,
            stream: c.stream.map((p) =>
                p.id === postId
                    ? {
                        ...p,
                        comments: [
                            ...(p.comments || []),
                            {
                                id: `c_${Date.now()}`,
                                authorId: CURRENT_USER.id,
                                authorName: CURRENT_USER.name,
                                text,
                                time: "Now",
                            },
                        ],
                    }
                    : p
            ),
        }));
    }

    function turnIn(classId, itemId, { note, attached }) {
        updateClass(classId, (c) => ({
            ...c,
            classwork: c.classwork.map((cw) =>
                cw.id === itemId ? { ...cw, submitted: true, submissionNote: note, submissionAttached: attached } : cw
            ),
        }));
        setTurnInTarget(null);
    }

    function createPost(fields) {
        if (!activeClass) return;
        const id = `p_${Date.now()}`;
        let classworkId = null;

        if (fields.type !== "announcement") {
            classworkId = `cw_${Date.now()}`;
            const item = {
                id: classworkId,
                type: fields.type,
                topic: fields.topic || "General",
                title: fields.title,
                description: fields.description || "",
                due: fields.due || "",
                dueAt: fields.dueAt || "",
                points: fields.points,
                posted: "Now",
                attachments: [],
                submitted: false,
                grade: null,
                // Group Collab turns every task posted here into a clickable chat message
                notify: true,
                by: CURRENT_USER.name,
                byId: CURRENT_USER.id,
                postedClock: clockNow(),
            };
            updateClass(activeClass.id, (c) => ({ ...c, classwork: [item, ...c.classwork] }));
        }

        const post = {
            id,
            type: fields.type,
            authorId: CURRENT_USER.id,
            authorName: CURRENT_USER.name,
            authorRole: "teacher",
            text: fields.type === "announcement" ? fields.text : fields.description || fields.title,
            time: "Now",
            classworkId,
            comments: [],
        };
        updateClass(activeClass.id, (c) => ({ ...c, stream: [post, ...c.stream] }));
        setShowCreatePost(false);
    }

    function copyCode() {
        if (!activeClass) return;
        try {
            navigator.clipboard?.writeText(activeClass.code);
        } catch (_) { }
        setCopiedCode(true);
    }

    /* ---- fallback navigation (only when no onNavigate prop was passed) ---- */
    if (!onNavigate && fallbackPage === "dashboard") return <Dashboard />;
    if (!onNavigate && fallbackPage === "chatbot") {
        return <Chatbot onNavigate={(key) => setFallbackPage(key === "classroom" ? null : key)} />;
    }
    if (!onNavigate && fallbackPage === "group") {
        return <GroupCollab onNavigate={(key) => setFallbackPage(key === "classroom" ? null : key)} />;
    }
    if (!onNavigate && fallbackPage === "personalized") {
        return (
            <Personalized
                onNavigateToChatbot={() => setFallbackPage("chatbot")}
                onNavigateToGroup={() => setFallbackPage("group")}
                onNavigateToDashboard={() => setFallbackPage("dashboard")}
            />
        );
    }

    const activePage = showQuiz ? "quiz" : "classroom";

    return (
        <div style={rootThemeStyle || themeStyle(theme)} className="flex h-screen w-full bg-[var(--t-bg1)] text-[color:var(--t-tx0)] overflow-hidden">
            {/* Desktop sidebar */}
            <div
                className="hidden md:flex h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-out"
                style={{ width: navCollapsed ? 0 : 256 }}
            >
                <Sidebar
                    activePage={activePage}
                    onNavigate={handleNavigate}
                    onCloseMobile={() => { }}
                    onOpenSettings={() => setSettingsOpen(true)}
                    onLogout={() => setShowLogoutConfirm(true)}
                />
            </div>

            {/* Desktop drawer handle */}
            <button
                onClick={() => setNavCollapsed((v) => !v)}
                aria-label={navCollapsed ? "Open navigation bar" : "Push navigation bar aside"}
                className="hidden md:flex fixed top-1/2 -translate-y-1/2 z-30 w-5 h-16 items-center justify-center bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] border-l-0 text-[color:var(--t-ac)] hover:bg-[var(--t-ac)] hover:text-[color:var(--t-onac)] hover:shadow-[0_0_14px_color-mix(in_srgb,var(--t-ac)_40%,transparent)] transition-all duration-300 active:scale-95"
                style={{ left: navCollapsed ? 0 : 256 }}
            >
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transform: navCollapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s" }}
                >
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Mobile sidebar overlay */}
            {mobileNavOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <Sidebar
                        activePage={activePage}
                        onNavigate={handleNavigate}
                        onCloseMobile={() => setMobileNavOpen(false)}
                        onOpenSettings={() => {
                            setMobileNavOpen(false);
                            setSettingsOpen(true);
                        }}
                        onLogout={() => {
                            setMobileNavOpen(false);
                            setShowLogoutConfirm(true);
                        }}
                    />
                    <div className="flex-1 bg-black/50" onClick={() => setMobileNavOpen(false)} />
                </div>
            )}

            <div
                style={{ backgroundImage: "var(--t-grad-main)" }}
                className="flex-1 flex flex-col min-w-0 bg-[var(--t-bg1)]"
            >
                {/* Top bar */}
                <div className="flex flex-wrap justify-between items-center gap-3 bg-[color-mix(in_srgb,_var(--t-bg0)_40%,_transparent)] py-3 px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            className={`text-[color:var(--t-tx0)] ${navCollapsed ? "" : "md:hidden"}`}
                            onClick={() => {
                                setNavCollapsed(false);
                                setMobileNavOpen(true);
                            }}
                            aria-label="Open menu"
                        >
                            <MenuIcon className="w-5 h-5" />
                        </button>
                        {activeClass && (
                            <button
                                onClick={() => {
                                    setActiveClassId(null);
                                    setTab("stream");
                                }}
                                className="flex items-center gap-1.5 text-[color:var(--t-tx1)] text-xs font-bold hover:text-[color:var(--t-ac)] transition-colors"
                            >
                                <Icon.Back className="w-3.5 h-3.5" />
                                Back to classes
                            </button>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <div className="flex shrink-0 items-center bg-[color-mix(in_srgb,_var(--t-warn)_14%,_transparent)] py-[5px] px-[13px] gap-[5px] border border-solid border-[color:color-mix(in_srgb,_var(--t-warn)_45%,_transparent)]">
                            <img src={NAV_IMG.streak} className="w-3 h-3.5 object-fill" alt="" />
                            <span className="text-[color:var(--t-warn)] text-[11px] font-bold tracking-wider hidden xs:inline">▲ 14 STREAK</span>
                        </div>
                        <div className="flex shrink-0 items-center bg-[color-mix(in_srgb,_var(--t-ac)_14%,_transparent)] py-[5px] px-[13px] gap-[5px] border border-solid border-[color:color-mix(in_srgb,_var(--t-ac)_45%,_transparent)]">
                            <img src={NAV_IMG.xp} className="w-[15px] h-[13px] object-fill" alt="" />
                            <span className="text-[color:var(--t-ac)] text-[11px] font-bold tracking-wider hidden xs:inline">3,420 XP</span>
                        </div>

                        <button
                            className="relative shrink-0"
                            onClick={() => setNotifOpen((v) => !v)}
                            aria-label="Notifications"
                        >
                            <img src={NAV_IMG.avatar} className="w-8 h-8 object-fill" alt="" />
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

                <PageErrorBoundary>
                    {/* Quiz Arena placeholder */}
                    {showQuiz ? (
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <QuizArena where="Classroom" onBack={() => setShowQuiz(false)} />
                        </div>
                    ) : activeClass ? (
                        <ClassDetail
                            cls={activeClass}
                            tab={tab}
                            setTab={setTab}
                            onBack={() => {
                                setActiveClassId(null);
                                setTab("stream");
                            }}
                            onAddComment={addComment}
                            onTurnIn={(itemId) => setTurnInTarget({ classId: activeClass.id, itemId })}
                            onCreatePost={() => setShowCreatePost(true)}
                            onCopyCode={copyCode}
                            copiedCode={copiedCode}
                            highlightId={highlightId}
                        />
                    ) : (
                        <ClassList
                            classes={classes}
                            onOpen={(id) => {
                                setActiveClassId(id);
                                setTab("stream");
                            }}
                            onCreateClass={() => setShowCreateClass(true)}
                            onJoinClass={() => setShowJoinClass(true)}
                        />
                    )}
                </PageErrorBoundary>
            </div>

            {/* Settings drawer — shared by every page */}
            {settingsOpen && (
                <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} onThemeChange={setTheme} />
            )}

            {/* Logout confirmation — same popup as the Dashboard */}
            {showLogoutConfirm && (
                <LogoutConfirmModal onConfirm={handleConfirmLogout} onCancel={() => setShowLogoutConfirm(false)} />
            )}

            {/* Modals */}
            {showCreateClass && <CreateClassModal onClose={() => setShowCreateClass(false)} onCreate={createClass} />}
            {showJoinClass && <JoinClassModal onClose={() => setShowJoinClass(false)} onJoin={joinClass} />}
            {showCreatePost && activeClass && (
                <CreatePostModal cls={activeClass} onClose={() => setShowCreatePost(false)} onCreate={createPost} />
            )}
            {turnInTarget && (
                <TurnInModal
                    cls={classes.find((c) => c.id === turnInTarget.classId)}
                    item={
                        classes
                            .find((c) => c.id === turnInTarget.classId)
                            ?.classwork.find((cw) => cw.id === turnInTarget.itemId) || {}
                    }
                    onClose={() => setTurnInTarget(null)}
                    onTurnIn={turnIn}
                />
            )}
        </div>
    );
}

/* Exported wrapper: catches ANY render error in the page (sidebar, settings, modals…)
   and shows it on screen instead of leaving a blank dark page. */
export default function Classroom(props) {
    return (
        <PageErrorBoundary fullScreen>
            <ClassroomPage {...props} />
        </PageErrorBoundary>
    );
}
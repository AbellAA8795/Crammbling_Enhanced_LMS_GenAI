import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHubClasses, syncClassGroups, requestOpenClassroom, TASK_TYPE_LABEL } from "./Classhub";
import Dashboard from "./Dashboard";
import Chatbot from "./chatbot";
import Personalized from "./personalized";
import { useTheme, withAlpha, CloseIcon, MenuIcon } from "./Theme";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import Settings from "../components/Settings";
import QuizArena from "./QuizArena";


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
    menu:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%232CD4D9' stroke-width='2' stroke-linecap='round'><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='18' x2='21' y2='18'/></svg>",
    close:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23BBC9C9' stroke-width='2' stroke-linecap='round'><line x1='4' y1='4' x2='20' y2='20'/><line x1='20' y1='4' x2='4' y2='20'/></svg>",
};

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

const CURRENT_USER = { id: "you", name: "You" };

const BADGE_COLORS = ["var(--t-ac)", "var(--t-warn)", "var(--t-ok2)", "var(--t-ok)", "var(--t-err)", "var(--t-ac2)"];
function colorForString(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return BADGE_COLORS[h % BADGE_COLORS.length];
}

function initialsFor(name) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

/* Quick-access options for the right-click context menu — depends on chat type. */
function tabDefsFor(g) {
    if (!g) return [];
    if (g.type === "classroom") {
        return [
            { key: "tasks", label: "Assignments" },
            { key: "materials", label: "Materials" },
            { key: "members", label: "Members" },
        ];
    }
    if (g.type === "dm") {
        return [{ key: "members", label: "Members" }];
    }
    return [
        { key: "tasks", label: "Tasks" },
        { key: "files", label: "Files" },
        { key: "members", label: "Members" },
    ];
}

const INITIAL_GROUPS = [
    {
        id: "g1",
        name: "Algorithm Study Squad",
        type: "squad",
        color: "var(--t-ac)",
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
        tasks: [
            { id: "t1", title: "Practice Set: Heaps", desc: "10 problems on heap operations.", due: "Fri, Mar 20", badge: "ALGORITHMS", createdBy: "You" },
        ],
    },
    {
        id: "g2",
        classId: "cls_cs240",
        name: "CS240 — Study Group",
        type: "classroom",
        color: "var(--t-ok)",
        members: [
            { id: "you", name: "You", role: "member" },
            { id: "s2", name: "Maya K.", role: "member" },
            { id: "s3", name: "Alex Chen", role: "member" },
        ],
        messages: [
            { id: "msg1", senderId: "you", senderName: "You", text: "Reminder: Midterm covers chapters 1-6.", time: "08:00" },
        ],
        materials: [
            { id: "mat1", title: "Chapter 5 Slides — Graph Traversals", kind: "Slides", addedBy: "Course Materials" },
        ],
        tasks: [
            {
                id: "at1",
                title: "Assignment 3: Dijkstra Implementation",
                desc: "Implement shortest path with a min-heap.",
                due: "Mon, Mar 23",
                points: 100,
                submissions: [{ studentId: "s2", studentName: "Maya K.", submittedAt: "Mar 19" }],
                createdBy: "You",
            },
        ],
    },
    {
        id: "g3",
        name: "Discrete Math Circle",
        type: "squad",
        color: "var(--t-warn)",
        members: [
            { id: "m4", name: "Priya N.", role: "admin" },
            { id: "you", name: "You", role: "member" },
            { id: "m5", name: "Owen T.", role: "member" },
        ],
        messages: [
            { id: "msg3", senderId: "m4", senderName: "Priya N.", text: "Pushed the induction practice set to Tasks.", time: "10:02" },
        ],
        files: [{ id: "f2", name: "Induction_CheatSheet.pdf", uploadedBy: "Priya N.", size: "640 KB" }],
        tasks: [
            { id: "t2", title: "Practice Set: Induction Proofs", desc: "Problems 1-8, show your work.", due: "Mon, Mar 23", badge: "DISCRETE MATH", createdBy: "Priya N." },
        ],
    },
    {
        id: "g4",
        name: "Riley P.",
        type: "dm",
        color: "var(--t-ac2)",
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
        id: "g5",
        classId: "cls_math210",
        name: "MATH210 — Study Group",
        type: "classroom",
        color: "var(--t-ok2)",
        members: [
            { id: "you", name: "You", role: "member" },
            { id: "s6", name: "Devon M.", role: "member" },
            { id: "s7", name: "Riley P.", role: "member" },
        ],
        messages: [{ id: "msg6", senderId: "s6", senderName: "Devon M.", text: "Assignment 2 grades are posted.", time: "07:45" }],
        materials: [{ id: "mat2", title: "Set Theory Review Deck", kind: "Slides", addedBy: "Course Materials" }],
        tasks: [
            {
                id: "at2",
                title: "Assignment 2: Set Theory Proofs",
                desc: "Prove the given identities using set builder notation.",
                due: "Fri, Mar 14",
                points: 50,
                submissions: [{ studentId: "you", studentName: "You", submittedAt: "Mar 13" }],
                createdBy: "Devon M.",
            },
        ],
    },
];

const FILTERS = [
    { key: "all", label: "All" },
    { key: "classroom", label: "Classrooms" },
    { key: "dm", label: "1v1" },
    { key: "squad", label: "Squads" },
];

/* ---------------------------------------------------------
   Dashboard-style design kit (theme-aware, flat + pixel-sharp):
   hard pixel shadows, micro-caps labels, tinted tags, panels with
   a glyph header bar, pixel avatars and segmented "pip" meters.
--------------------------------------------------------- */
const PIXEL_SHADOW = "3px 3px 0px var(--t-shadow)";
const LABEL = "text-[10px] font-bold uppercase tracking-wider text-[color:var(--t-tx2)]";
const PRIMARY_BTN =
    "bg-[var(--t-ac)] text-[color:var(--t-onac)] font-bold uppercase tracking-wider border-2 border-solid border-[color:var(--t-ac2)] border-b-4 border-b-[color:color-mix(in_srgb,_var(--t-ac)_55%,_#000)] hover:brightness-110 active:translate-y-[2px] active:border-b-2 transition-all duration-150";
const ACTION_BTN =
    "text-[10px] font-bold uppercase tracking-wider py-1 px-2 border border-solid border-[color:var(--t-ac)] text-[color:var(--t-ac)] hover:bg-[var(--t-ac)] hover:text-[color:var(--t-onac)] transition-colors duration-150";
const SEGMENTS = "repeating-linear-gradient(90deg, transparent 0 9px, rgba(0,0,0,0.3) 9px 10px)";

/* Header bar shared by every panel: glyph + title + optional right slot. */
function PanelHeader({ icon = "◆", title, right, tone = "page" }) {
    return (
        <div
            className="flex items-center justify-between gap-2 px-3 py-2 border-b border-solid bg-[color-mix(in_srgb,_var(--t-ac)_7%,_transparent)]"
            style={{ borderColor: tone === "modal" ? "var(--t-mbd)" : "var(--t-bd0)" }}
        >
            <span className="flex items-center gap-2 min-w-0">
                <span className="text-[color:var(--t-ac)] text-[13px] leading-none">{icon}</span>
                <span className="text-[color:var(--t-tx0)] text-xs font-bold uppercase tracking-wider truncate">{title}</span>
            </span>
            {right}
        </div>
    );
}

/* Panel used inside the pop-up card (tasks / files / materials / members). */
function Panel({ title, count, children, action, icon = "◆" }) {
    return (
        <div className="flex flex-col self-stretch border border-solid border-[color:var(--t-mbd)]">
            <PanelHeader
                tone="modal"
                icon={icon}
                title={title}
                right={
                    <span className="flex items-center gap-2 shrink-0">
                        {typeof count === "number" && <Badge color="var(--t-warn)">{count}</Badge>}
                        {action}
                    </span>
                }
            />
            <div className="p-2.5">{children}</div>
        </div>
    );
}

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

/* Square avatar with a pixel "hair" strip, like the Dashboard player avatar. */
function GroupAvatar({ color, name, className = "w-8 h-8 text-[10px]" }) {
    return (
        <div
            className={`relative shrink-0 flex items-center justify-center font-bold border-2 border-solid ${className}`}
            style={{ backgroundColor: withAlpha(color, "26"), borderColor: color, color }}
        >
            <span className="absolute top-0 left-0 w-full h-[3px]" style={{ backgroundColor: color }} />
            {initialsFor(name)}
        </div>
    );
}

/* Segmented meter — same idea as the HP / focus meter on the Dashboard player card. */
function Pips({ value, max = 10, color = "var(--t-ok)" }) {
    return (
        <span className="flex gap-0.5" aria-hidden="true">
            {Array.from({ length: max }).map((_, i) => (
                <span key={i} className="w-2 h-2" style={{ backgroundColor: i < value ? color : "var(--t-bd0)" }} />
            ))}
        </span>
    );
}

/* Pixel-art chat bubble avatar for the page banner (built from plain divs). */
function HubAvatar() {
    return (
        <div className="relative w-16 h-16 shrink-0 overflow-hidden border-2 border-solid border-[color:var(--t-bd1)] bg-[color-mix(in_srgb,_var(--t-ac)_22%,_var(--t-bg2))]">
            <div className="absolute top-0 left-0 w-full h-3 bg-[var(--t-ac)]" />
            <div className="absolute top-7 left-3 w-2 h-2 bg-[var(--t-tx0)]" />
            <div className="absolute top-7 left-7 w-2 h-2 bg-[var(--t-tx0)]" />
            <div className="absolute top-7 left-[44px] w-2 h-2 bg-[var(--t-tx0)]" />
            <div className="absolute bottom-0 left-0 w-full h-3 bg-[var(--t-ok)]" />
        </div>
    );
}

/* Small stroke-style line icons for the panel tabs — no emoji. */
function TabIcon({ type, className }) {
    const common = {
        width: 12,
        height: 12,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
    };
    switch (type) {
        case "tasks":
            return (
                <svg {...common}>
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <polyline points="8 15 11 18 16 13" />
                </svg>
            );
        case "files":
            return (
                <svg {...common}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
            );
        case "materials":
            return (
                <svg {...common}>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
            );
        case "grades":
            return (
                <svg {...common}>
                    <path d="M8 21h8" />
                    <path d="M12 17v4" />
                    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
                    <path d="M17 4h3a2 2 0 0 1-2 2h-1" />
                    <path d="M7 4H4a2 2 0 0 0 2 2h1" />
                </svg>
            );
        case "members":
            return (
                <svg {...common}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            );
        default:
            return null;
    }
}

/* Custom themed dropdown for the messages filter. */
function FilterDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const current = FILTERS.find((f) => f.key === value) || FILTERS[0];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="flex items-center justify-between w-full bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] py-1.5 pl-2.5 pr-2 text-[10px] font-bold uppercase tracking-wider text-[color:var(--t-ac)] hover:border-[color:var(--t-ac)] transition-colors duration-150"
            >
                <span className="flex items-center gap-1.5 min-w-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                    </svg>
                    <span className="truncate">{current.label}</span>
                </span>
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 ml-1 transition-transform duration-200"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-[5]" onClick={() => setOpen(false)} />
                    <div
                        role="listbox"
                        className="absolute top-full left-0 right-0 z-10 mt-1 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] overflow-hidden"
                        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 20px color-mix(in srgb, var(--t-glow) 20%, transparent)" }}
                    >
                        {FILTERS.map((f) => {
                            const active = f.key === value;
                            return (
                                <button
                                    key={f.key}
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => {
                                        onChange(f.key);
                                        setOpen(false);
                                    }}
                                    className={`flex items-center justify-between w-full text-left px-2.5 py-1.5 text-[11px] font-bold transition-colors duration-100 ${active
                                        ? "bg-[var(--t-bg3)] text-[color:var(--t-ac)]"
                                        : "text-[color:var(--t-tx1)] hover:bg-[var(--t-bg3)] hover:text-[color:var(--t-tx0)]"
                                        }`}
                                >
                                    <span>{f.label}</span>
                                    {active && (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
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
    const placeholders = {
        id: "e.g. CRB-48213",
        username: "e.g. @kaydenL",
        gmail: "e.g. student@gmail.com",
    };

    function submit(e) {
        e.preventDefault();
        if (!value.trim()) return;
        onAdd(value.trim());
        setValue("");
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form
                onSubmit={submit}
                className="relative bg-[var(--t-mbg)] border border-solid border-[color:var(--t-mbd2)] border-t-[3px] border-t-[color:var(--t-ac)] p-5 w-full max-w-sm flex flex-col gap-3"
                style={{ boxShadow: "6px 6px 0px var(--t-shadow), 0 0 40px color-mix(in srgb, var(--t-glow) 18%, transparent)" }}
            >
                <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center gap-2 text-[color:var(--t-tx0)] text-sm font-bold uppercase tracking-wider"><span className="text-[color:var(--t-ac)]">⛆</span>ADD MEMBER</span>
                    <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-lg leading-none hover:text-[color:var(--t-ac2)] transition-colors">
                        ×
                    </button>
                </div>

                <div className="flex gap-1.5">
                    {[
                        { id: "id", label: "Account ID" },
                        { id: "username", label: "Username" },
                        { id: "gmail", label: "Gmail" },
                    ].map((m) => (
                        <button
                            type="button"
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            className={`flex-1 text-[10px] font-bold py-1.5 border border-solid transition-all duration-150 active:scale-95 ${method === m.id
                                ? "bg-[var(--t-in1)] border-[color:var(--t-ac)] text-[color:var(--t-ac)] shadow-[0_0_10px_color-mix(in_srgb,_var(--t-ac)_30%,_transparent)]"
                                : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-tx1)]"
                                }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                <input
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholders[method]}
                    className="bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac)] transition-colors"
                />

                <button
                    type="submit"
                    className={`mt-1 text-xs py-2 ${PRIMARY_BTN}`}
                >
                    ADD TO GROUP
                </button>
            </form>
        </div>
    );
}

/* Compact type picker — no more big descriptive cards. */
const CHAT_TYPES = [
    { id: "classroom", label: "Classroom", color: "var(--t-ok)" },
    { id: "dm", label: "1v1", color: "var(--t-ac2)" },
    { id: "squad", label: "Squad", color: "var(--t-ac)" },
];

function CreateGroupModal({ onClose, onCreate }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("classroom");

    function submit(e) {
        e.preventDefault();
        if (!name.trim()) return;
        onCreate(name.trim(), type);
    }

    const isDm = type === "dm";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form
                onSubmit={submit}
                className="relative bg-[var(--t-mbg)] border border-solid border-[color:var(--t-mbd2)] border-t-[3px] border-t-[color:var(--t-ac)] p-5 w-full max-w-sm flex flex-col gap-3"
                style={{ boxShadow: "6px 6px 0px var(--t-shadow), 0 0 40px color-mix(in srgb, var(--t-glow) 18%, transparent)" }}
            >
                <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center gap-2 text-[color:var(--t-tx0)] text-sm font-bold uppercase tracking-wider"><span className="text-[color:var(--t-ac)]">✉</span>NEW MESSAGE</span>
                    <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-lg leading-none hover:text-[color:var(--t-ac2)] transition-colors">
                        ×
                    </button>
                </div>

                <div className="flex flex-col gap-1.5">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Type</span>
                    <div className="flex gap-1.5">
                        {CHAT_TYPES.map((t) => {
                            const active = type === t.id;
                            return (
                                <button
                                    type="button"
                                    key={t.id}
                                    onClick={() => setType(t.id)}
                                    className="flex-1 text-[11px] font-bold py-2 border border-solid transition-all duration-150 active:scale-95"
                                    style={{
                                        backgroundColor: active ? withAlpha(t.color, "22") : "var(--t-in0)",
                                        borderColor: active ? t.color : "var(--t-mbd)",
                                        color: active ? t.color : "var(--t-mtx)",
                                    }}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <label className="flex flex-col gap-1">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">{isDm ? "Person's name" : "Name"}</span>
                    <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isDm ? "e.g. Riley P." : "e.g. Discrete Math Study Group"}
                        className="bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac)] transition-colors"
                    />
                </label>

                <button
                    type="submit"
                    className={`mt-1 text-xs py-2 ${PRIMARY_BTN}`}
                >
                    CREATE
                </button>
            </form>
        </div>
    );
}


function toISODate(d) {
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function formatDue(iso) {
    if (!iso) return "";
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function daysUntil(iso) {
    if (!iso) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((new Date(`${iso}T00:00:00`) - today) / 86400000);
}

function NewTaskModal({ isClassroom, onCreate }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [due, setDue] = useState(""); // ISO yyyy-mm-dd from the date field
    const [badge, setBadge] = useState("");
    const [points, setPoints] = useState(100);
    const [launching, setLaunching] = useState(false);

    // Progress = how many of the fields are filled in
    const checks = [
        !!title.trim(),
        !!desc.trim(),
        !!due,
        isClassroom ? Number(points) > 0 : !!badge.trim(),
    ];
    const done = checks.filter(Boolean).length;
    const pct = (done / checks.length) * 100;
    const complete = done === checks.length;
    const barColor = pct < 50 ? "var(--t-warn)" : pct < 100 ? "var(--t-ac2)" : "var(--t-ok)";

    const left = daysUntil(due);
    const dueHint =
        left === null ? null : left < 0 ? "In the past" : left === 0 ? "Due today" : left === 1 ? "Due tomorrow" : `${left} days to go`;

    function quickDue(offset) {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        setDue(toISODate(d));
    }

    function submit(e) {
        e.preventDefault();
        if (!title.trim() || launching) return;
        setLaunching(true);
        setTimeout(() => {
            onCreate({
                title: title.trim(),
                desc: desc.trim(),
                due: formatDue(due),
                badge: badge.trim().toUpperCase(),
                points: Number(points) || 0,
            });
        }, 450);
    }

    const accent = isClassroom ? "var(--t-ok)" : "var(--t-ac)";
    const field =
        "w-full bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2.5 px-3 text-left outline-none transition-all duration-200 placeholder:text-[color:var(--t-ph)] focus:border-[color:var(--t-ac)] focus:shadow-[0_0_14px_color-mix(in_srgb,_var(--t-ac)_20%,_transparent)] focus:bg-[var(--t-in1)]";

    const Label = ({ children, ok }) => (
        <span className="flex items-center gap-1.5 text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider text-left uppercase">
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
        </span>
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <style>{`
                @keyframes ntPop { from { opacity: 0; transform: translateY(14px) scale(.96); } to { opacity: 1; transform: none; } }
                @keyframes ntShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
                @keyframes ntPulse { 0%,100% { box-shadow: 0 0 0 0 var(--nt-glow); } 50% { box-shadow: 0 0 22px 2px var(--nt-glow); } }
                @keyframes ntLaunch { to { transform: translateY(-40px) scale(.9); opacity: 0; } }
                .nt-date { color-scheme: inherit; }
                .nt-date::-webkit-calendar-picker-indicator { cursor: pointer; opacity: .7; transition: opacity .15s; }
                .nt-date::-webkit-calendar-picker-indicator:hover { opacity: 1; }
                .nt-num::-webkit-inner-spin-button { opacity: .4; }
            `}</style>
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form
                onSubmit={submit}
                className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_95%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-md overflow-hidden"
                style={{
                    boxShadow: `0 20px 60px rgba(0,0,0,0.65), 0 0 40px ${withAlpha(accent, "22")}`,
                    animation: launching ? "ntLaunch .45s ease-in forwards" : "ntPop .28s cubic-bezier(.2,.9,.3,1.2)",
                }}
            >
                {/* accent strip */}
                <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}, var(--t-warn), ${accent})` }} />

                {/* header */}
                <div className="flex justify-between items-start px-5 pt-4 pb-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 flex items-center justify-center text-base border border-solid"
                            style={{ backgroundColor: withAlpha(accent, "22"), borderColor: withAlpha(accent, "55"), color: accent }}
                        >
                            {isClassroom ? "🎓" : "✦"}
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[color:var(--t-tx0)] text-sm font-bold tracking-wide">{isClassroom ? "NEW ASSIGNMENT" : "NEW TASK"}</span>
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
                    <div className="relative h-3 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 transition-all duration-500 ease-out overflow-hidden"
                            style={{ width: `${pct}%`, backgroundColor: barColor, boxShadow: `0 0 10px ${withAlpha(barColor, "99")}` }}
                        >
                            {pct > 0 && (
                                <div
                                    className="absolute inset-y-0 w-1/3"
                                    style={{ background: "linear-gradient(90deg, transparent, #ffffff88, transparent)", animation: "ntShimmer 1.8s linear infinite" }}
                                />
                            )}
                        </div>
                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: SEGMENTS }} />
                    </div>
                    <div className="flex justify-between mt-1.5 text-[10px] text-[color:var(--t-ph)]">
                        <span className="uppercase tracking-wider font-bold">Progress</span>
                        <span className="font-bold transition-colors duration-500" style={{ color: barColor }}>
                            {Math.round(pct)}%
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 px-5 pb-5">
                    {/* Title */}
                    <label className="flex flex-col gap-1.5">
                        <Label ok={checks[0]}>Title</Label>
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={isClassroom ? "e.g. Problem Set 4" : "e.g. Finish chapter 3 notes"}
                            className={field}
                        />
                    </label>

                    {/* Description */}
                    <label className="flex flex-col gap-1.5">
                        <Label ok={checks[1]}>Description</Label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={2}
                            placeholder="What needs to be done?"
                            className={`${field} resize-none`}
                        />
                    </label>

                    {/* Due date + quick picks */}
                    <div className="flex flex-col gap-1.5">
                        <Label ok={checks[2]}>Due date</Label>
                        <input type="date" value={due} min={toISODate(new Date())} onChange={(e) => setDue(e.target.value)} className={`${field} nt-date`} />
                        <div className="flex items-center flex-wrap gap-1.5 min-h-[22px]">
                            {[
                                ["Today", 0],
                                ["Tomorrow", 1],
                                ["Next week", 7],
                            ].map(([label, off]) => {
                                const active = due === toISODate(new Date(Date.now() + off * 86400000));
                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => quickDue(off)}
                                        className={`text-[10px] font-bold py-0.5 px-2 border border-solid transition-all duration-150 active:scale-95 ${active
                                            ? "bg-[color-mix(in_srgb,_var(--t-ac)_20%,_transparent)] border-[color:var(--t-ac)] text-[color:var(--t-ac)]"
                                            : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-ac2)]"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                            {dueHint && (
                                <span
                                    className="ml-auto text-[10px] font-bold"
                                    style={{ color: left < 0 ? "var(--t-err)" : left <= 1 ? "var(--t-warn)" : "var(--t-ok2)" }}
                                >
                                    ⏳ {dueHint}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Points (classroom) or Badge (squad) */}
                    {isClassroom ? (
                        <div className="flex flex-col gap-1.5">
                            <Label ok={checks[3]}>Points</Label>
                            <div className="flex items-stretch gap-1.5">
                                {POINT_PRESETS.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPoints(p)}
                                        className={`flex-1 text-xs font-bold py-2 border border-solid transition-all duration-150 active:scale-95 ${Number(points) === p
                                            ? "bg-[color-mix(in_srgb,_var(--t-warn)_20%,_transparent)] border-[color:var(--t-warn)] text-[color:var(--t-warn)] shadow-[0_0_12px_color-mix(in_srgb,_var(--t-warn)_27%,_transparent)]"
                                            : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-warn)] hover:text-[color:var(--t-warn)]"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <input
                                    type="number"
                                    min="0"
                                    value={points}
                                    onChange={(e) => setPoints(e.target.value)}
                                    aria-label="Custom points"
                                    className={`${field} nt-num !w-20 !py-2 text-center`}
                                />
                            </div>
                        </div>
                    ) : (
                        <label className="flex flex-col gap-1.5">
                            <Label ok={checks[3]}>Badge / subject</Label>
                            <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. CS240" className={field} />
                            {badge.trim() && (
                                <span className="self-start">
                                    <Badge color={colorForString(badge.trim().toUpperCase())}>{badge.trim().toUpperCase()}</Badge>
                                </span>
                            )}
                        </label>
                    )}

                    {!isClassroom && <span className="text-[color:var(--t-mtx)] text-[10px] text-left">✓ This will also sync to your Study Sprint Board backlog.</span>}

                    <button
                        type="submit"
                        disabled={!title.trim() || launching}
                        className="relative overflow-hidden text-xs font-bold py-3 tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:brightness-110"
                        style={{
                            backgroundColor: complete ? "var(--t-ok)" : "var(--t-ac)",
                            color: complete ? "var(--t-onok2)" : "var(--t-onac)",
                            "--nt-glow": complete ? "color-mix(in srgb, var(--t-ok) 60%, transparent)" : "color-mix(in srgb, var(--t-ac) 0%, transparent)",
                            animation: complete && !launching ? "ntPulse 1.8s ease-in-out infinite" : "none",
                        }}
                    >
                        {launching ? "🚀 LAUNCHING..." : complete ? `🚀 ${isClassroom ? "POST ASSIGNMENT" : "ADD TASK"}` : isClassroom ? "POST ASSIGNMENT" : "ADD TASK"}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ---------------------------------------------------------
   Tabbed pop-up card: Tasks / Files / Materials / Members
   all live here now instead of being stacked on the page.
   Grading + teacher controls removed — classrooms are
   student-only and everyone has equal access. Materials
   are read-only (no "Add Material" for students).
--------------------------------------------------------- */
function GroupDetailModal({
    group,
    isClassroom,
    isDm,
    canAddMembers,
    canCreateTask,
    tab,
    onTabChange,
    tabDefs,
    onClose,
    onNewTask,
    onAddMember,
    onSubmitTask,
    onPromote,
    isAdmin,
}) {
    if (!group) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div
                className="relative bg-[var(--t-mbg)] border border-solid border-[color:var(--t-mbd2)] border-t-[3px] border-t-[color:var(--t-ac)] w-full max-w-lg max-h-[85vh] flex flex-col"
                style={{ boxShadow: "6px 6px 0px var(--t-shadow), 0 0 40px color-mix(in srgb, var(--t-glow) 18%, transparent)" }}
            >
                <div className="flex justify-between items-center p-4 border-b border-solid border-[color:var(--t-mbd)] shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <GroupAvatar color={group.color} name={group.name} className="w-10 h-10 text-xs" />
                        <div className="min-w-0">
                            <span className="text-[color:var(--t-tx0)] text-sm font-bold uppercase tracking-wide block truncate">{group.name}</span>
                            <span className="text-[color:var(--t-mtx)] text-[11px]">{isDm ? "Direct message" : isClassroom ? "Classroom details" : "Squad details"}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-[color:var(--t-mtx)] text-lg leading-none hover:text-[color:var(--t-ac2)] transition-colors" aria-label="Close">
                        ×
                    </button>
                </div>

                <div className=" flex items-center gap-2 px-4 pt-3 border-b border-solid border-[color:var(--t-mbd)] shrink-0 ">
                    {tabDefs.map((t) => {
                        const active = tab === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => onTabChange(t.key)}
                                className={`flex items-center gap-1.5 pb-2.5 -mb-px border-b-2 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap flex-1 min-w-0 justify-center transition-all duration-150 active:scale-95 ${active
                                    ? "border-[color:var(--t-ac)] text-[color:var(--t-ac)]"
                                    : "border-transparent text-[color:var(--t-mtx)] hover:text-[color:var(--t-tx1)] hover:border-[color:var(--t-mbd2)]"
                                    }`}
                            >
                                <TabIcon type={t.key} />
                                {t.label}
                                {typeof t.count === "number" && <span className="opacity-70 font-normal">({t.count})</span>}
                            </button>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {tab === "tasks" && (
                        <Panel
                            icon="⚑"
                            title={isClassroom ? "ASSIGNMENTS" : "TASKS"}
                            count={group.tasks?.length || 0}
                            action={
                                canCreateTask && (
                                    <button onClick={onNewTask} className={ACTION_BTN}>
                                        + {isClassroom ? "New Assignment" : "New Task"}
                                    </button>
                                )
                            }
                        >
                            {(group.tasks || []).length === 0 && <p className="text-[color:var(--t-mtx)] text-xs py-2">Nothing here yet.</p>}
                            {(group.tasks || []).map((t) => {
                                const mySubmission = isClassroom && t.submissions?.find((s) => s.studentId === "you");
                                const submittedCount = (t.submissions || []).length;
                                return (
                                    <div
                                        key={t.id}
                                        className="flex flex-col gap-1.5 bg-[var(--t-in0)] p-3 border border-solid border-[color:var(--t-mbd)] mb-2 transition-colors hover:border-[color:var(--t-mbd2)]"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-[color:var(--t-tx0)] text-sm font-bold">{t.title}</span>
                                            {isClassroom ? (
                                                t.points != null ? <Badge color="var(--t-warn)">{t.points} PTS</Badge> : null
                                            ) : (
                                                <Badge color={colorForString(t.badge)}>{t.badge}</Badge>
                                            )}
                                        </div>
                                        {t.desc && <span className="text-[color:var(--t-tx1)] text-xs">{t.desc}</span>}
                                        <span className="text-[color:var(--t-mtx)] text-[11px]">Due {t.due || "—"}</span>

                                        {isClassroom && (
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-[color:var(--t-mtx)] text-[10px] font-bold">
                                                    {submittedCount} submitted
                                                </span>

                                                <button
                                                    onClick={() => onSubmitTask(t.id)}
                                                    disabled={!!mySubmission}
                                                    className={`group/md relative overflow-hidden flex items-center gap-1 text-[9px] font-bold tracking-wide py-1 pl-1.5 pr-2 border border-solid transition-all duration-200 active:scale-95 ${mySubmission
                                                        ? "bg-[color-mix(in_srgb,_var(--t-ok)_14%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-ok)_40%,_transparent)] text-[color:var(--t-ok2)] cursor-default"
                                                        : "bg-[color-mix(in_srgb,_var(--t-ac2)_16%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-ac2)_45%,_transparent)] text-[color:var(--t-ac2)] hover:bg-[var(--t-ac2)] hover:text-[color:var(--t-onac)] hover:border-[color:var(--t-ac2)] hover:shadow-[0_0_12px_color-mix(in_srgb,_var(--t-ac2)_50%,_transparent)]"
                                                        }`}
                                                >
                                                    <span
                                                        className={`flex items-center justify-center w-3 h-3 border border-solid transition-all duration-200 ${mySubmission
                                                            ? "bg-[var(--t-ok2)] border-[color:var(--t-ok2)] text-[color:var(--t-onac)]"
                                                            : "bg-transparent border-[color:var(--t-ac2)] text-[color:var(--t-ac2)] group-hover/md:bg-[var(--t-onac)] group-hover/md:border-[color:var(--t-onac)] group-hover/md:text-[color:var(--t-ac2)]"
                                                            }`}
                                                    >
                                                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </span>

                                                    <span>{mySubmission ? "Done" : "Mark Done"}</span>

                                                    {!mySubmission && (
                                                        <span
                                                            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 opacity-0 group-hover/md:opacity-100 group-hover/md:animate-[mdSweep_0.9s_ease-out]"
                                                            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }}
                                                        />
                                                    )}
                                                </button>

                                                {/* keyframes for the sweep — safe to leave inline, browsers dedupe */}
                                                <style>{`
            @keyframes mdSweep {
                from { transform: translateX(0); }
                to   { transform: translateX(400%); }
            }
        `}</style>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </Panel>
                    )}

                    {tab === "files" && !isClassroom && !isDm && (
                        <Panel icon="▤" title="SHARED FILES" count={group.files?.length || 0}>
                            {(group.files || []).length === 0 && (
                                <p className="text-[color:var(--t-mtx)] text-xs py-2">No files shared yet — attach one from the composer below.</p>
                            )}
                            {(group.files || []).map((f) => (
                                <div
                                    key={f.id}
                                    className="flex justify-between items-center bg-[var(--t-in0)] p-2.5 border border-solid border-[color:var(--t-mbd)] mb-1.5 transition-colors hover:border-[color:var(--t-mbd2)]"
                                >
                                    <span className="text-[color:var(--t-tx1)] text-xs truncate">{f.name}</span>
                                    <span className="text-[color:var(--t-mtx)] text-[10px] shrink-0">
                                        {f.uploadedBy} • {f.size}
                                    </span>
                                </div>
                            ))}
                        </Panel>
                    )}

                    {tab === "materials" && isClassroom && (
                        <Panel icon="◆" title="LESSON MATERIALS" count={group.materials?.length || 0}>
                            {(group.materials || []).length === 0 && <p className="text-[color:var(--t-mtx)] text-xs py-2">No materials posted yet.</p>}
                            {(group.materials || []).map((m) => (
                                <div
                                    key={m.id}
                                    className="flex justify-between items-center bg-[var(--t-in0)] p-2.5 border border-solid border-[color:var(--t-mbd)] mb-1.5 transition-colors hover:border-[color:var(--t-mbd2)]"
                                >
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
                        <Panel
                            icon="⛆"
                            title="MEMBERS"
                            count={group.members.length}
                            action={
                                canAddMembers && (
                                    <button onClick={onAddMember} className={ACTION_BTN}>
                                        + Add Member
                                    </button>
                                )
                            }
                        >
                            {group.members.map((m) => (
                                <div
                                    key={m.id}
                                    className="flex justify-between items-center bg-[var(--t-in0)] p-2.5 border border-solid border-[color:var(--t-mbd)] mb-1.5 transition-colors hover:border-[color:var(--t-mbd2)]"
                                >
                                    <span className="text-[color:var(--t-tx0)] text-xs">{m.name}</span>
                                    <div className="flex items-center gap-2">
                                        {!isClassroom && !isDm && (
                                            <Badge color={m.role === "admin" ? "var(--t-ac)" : "var(--t-mtx)"}>{m.role.toUpperCase()}</Badge>
                                        )}
                                        {!isClassroom && !isDm && isAdmin && m.role !== "admin" && (
                                            <button
                                                onClick={() => onPromote(m.id)}
                                                className="group/adm flex items-center gap-1 text-[10px] font-bold py-0.5 px-2 border border-solid shrink-0 bg-[color-mix(in_srgb,_var(--t-warn)_20%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-warn)_30%,_transparent)] text-[color:var(--t-warn)] hover:bg-[var(--t-warn)] hover:text-[color:var(--t-onwarn)] hover:border-[color:var(--t-warn)] hover:shadow-[0_0_12px_color-mix(in_srgb,_var(--t-warn)_40%,_transparent)] active:scale-95 transition-all duration-150"
                                            >
                                                <span className="text-[11px] leading-none transition-transform duration-150 group-hover/adm:rotate-90">+</span>
                                                MAKE ADMIN
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Panel>
                    )}
                </div>
            </div>
        </div>
    );
}

/* Right-click quick-access menu on a conversation list item. */
function GroupContextMenu({ x, y, group, onClose, onOpenMessages, onOpenTab }) {
    const opts = tabDefsFor(group);
    const clampedX = Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 1000) - 190);
    const clampedY = Math.min(y, (typeof window !== "undefined" ? window.innerHeight : 800) - (opts.length * 30 + 56));
    return (
        <>
            <div className="fixed inset-0 z-[70]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
            <div
                className="fixed z-[80] bg-[var(--t-mbg)] border border-solid border-[color:var(--t-mbd2)] border-t-[3px] border-t-[color:var(--t-ac)] py-1 min-w-[172px]"
                style={{ top: Math.max(8, clampedY), left: Math.max(8, clampedX), boxShadow: "4px 4px 0px var(--t-shadow), 0 0 24px color-mix(in srgb, var(--t-glow) 18%, transparent)" }}
            >
                <div className="px-3 py-1.5 border-b border-solid border-[color:var(--t-mbd)]">
                    <span className="text-[color:var(--t-mtx)] text-[10px] font-bold truncate block">{group.name}</span>
                </div>
                <button
                    onClick={onOpenMessages}
                    className="flex items-center w-full text-left px-3 py-1.5 text-[color:var(--t-tx0)] text-[11px] border-l-2 border-l-transparent hover:border-l-[color:var(--t-ac2)] hover:bg-[var(--t-in1)] hover:text-[color:var(--t-ac2)] transition-all duration-150"
                >
                    Open Messages
                </button>
                {opts.map((o) => (
                    <button
                        key={o.key}
                        onClick={() => onOpenTab(o.key)}
                        className="flex items-center w-full text-left px-3 py-1.5 text-[color:var(--t-tx1)] text-[11px] border-l-2 border-l-transparent hover:border-l-[color:var(--t-ac2)] hover:bg-[var(--t-in1)] hover:text-[color:var(--t-tx0)] transition-all duration-150"
                    >
                        {o.label}
                    </button>
                ))}
            </div>
        </>
    );
}

/**
 * Standalone Group Collab page — same sidebar/topbar shell as Chatbot and
 * Personalized. Also usable as an embedded panel (pass onNavigate) from
 * either of those pages.
 *
 * Props:
 *  - onNavigate(key): called when a sidebar item other than "group" is
 *    clicked. If omitted, this page is self-sufficient and swaps itself
 *    for Chatbot / Personalized directly.
 *  - onSyncTaskToSprintBoard(title, meta): optional, forwarded from a
 *    parent Study Sprint Board integration.
 */
export default function GroupCollab({ onNavigate, onSyncTaskToSprintBoard }) {
    const navigate = useNavigate();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [navCollapsed, setNavCollapsed] = useState(false); // desktop drawer: pushed to the side
    const [fallbackPage, setFallbackPage] = useState(null); // used only when no onNavigate prop is passed
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [theme, setTheme, rootThemeStyle] = useTheme(); // shared with chatbot + personalized
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false); // Quiz Arena placeholder shown inside the page
    const [notifOpen, setNotifOpen] = useState(false);
    const searchRef = useRef(null);

    // Every class in Classroom has a chat here: its members become chat members and every
    // task posted in the class shows up as a clickable message (see classHub.js).
    const [hubClasses] = useHubClasses();
    const firstGroups = useRef(null);
    if (firstGroups.current === null) firstGroups.current = syncClassGroups(INITIAL_GROUPS, hubClasses);
    const [groups, setGroups] = useState(firstGroups.current);
    const [activeGroupId, setActiveGroupId] = useState(firstGroups.current[0]?.id || null);
    const [openPanel, setOpenPanel] = useState(null); // which tab is open in the pop-up modal, or null
    const [messageText, setMessageText] = useState("");
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showNewTask, setShowNewTask] = useState(false);
    const [filter, setFilter] = useState("all"); // all | classroom | dm | squad
    const [contextMenu, setContextMenu] = useState(null); // { x, y, groupId } | null

    const activeGroup = groups.find((g) => g.id === activeGroupId) || null;
    const isClassroom = activeGroup?.type === "classroom";
    const isDm = activeGroup?.type === "dm";
    const isSquad = activeGroup?.type === "squad";
    const me = activeGroup?.members.find((m) => m.id === "you");
    const isAdmin = !!isSquad && me?.role === "admin";
    // Classrooms have no teacher/student split — everyone can add members and post.
    const canAddMembers = activeGroup ? !isDm : false;
    const canCreateTask = !!isSquad; // only squads can create tasks now

    useEffect(() => {
        setGroups((prev) => syncClassGroups(prev, hubClasses));
    }, [hubClasses]);

    const visibleGroups = useMemo(() => groups.filter((g) => filter === "all" || g.type === filter), [groups, filter]);

    /* Keyboard shortcut: "/" focuses search, Esc clears/closes things — same as personalized.jsx */
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
                setOpenPanel(null);
                setContextMenu(null);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [searchQuery]);

    function updateActiveGroup(fn) {
        setGroups((prev) => prev.map((g) => (g.id === activeGroupId ? fn(g) : g)));
    }

    function createGroup(name, type) {
        const id = `g${Date.now()}`;
        const you = { id: "you", name: "You", role: type === "squad" ? "admin" : "member" };
        const base = {
            id,
            name,
            type,
            color: colorForString(name),
            members: [you],
            messages: [],
        };
        let fresh;
        if (type === "classroom") {
            fresh = { ...base, materials: [], tasks: [] };
        } else if (type === "dm") {
            fresh = {
                ...base,
                members: [you, { id: `m${Date.now()}`, name, role: "member" }],
            };
        } else {
            fresh = { ...base, files: [], tasks: [] };
        }
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
            messages: [...g.messages, { id: `msg${Date.now()}`, senderId: "you", senderName: "You", text: messageText.trim(), time: "Now" }],
        }));
        setMessageText("");
    }

    function addMember(rawValue) {
        updateActiveGroup((g) => ({
            ...g,
            members: [...g.members, { id: `m${Date.now()}`, name: rawValue, role: "member" }],
        }));
        setShowAddMember(false);
    }

    function promoteToAdmin(memberId) {
        updateActiveGroup((g) => ({
            ...g,
            members: g.members.map((m) => (m.id === memberId ? { ...m, role: "admin" } : m)),
        }));
    }

    function createTask(fields) {
        updateActiveGroup((g) => ({
            ...g,
            tasks: [
                ...(g.tasks || []),
                { id: `t${Date.now()}`, title: fields.title, desc: fields.desc, due: fields.due, badge: fields.badge || "SQUAD", createdBy: "You" },
            ],
        }));
        onSyncTaskToSprintBoard?.(fields.title, { subject: (fields.badge || "SQUAD").toUpperCase(), meta: fields.due || activeGroup.name });
        setShowNewTask(false);
    }

    function submitTask(taskId) {
        updateActiveGroup((g) => ({
            ...g,
            tasks: g.tasks.map((t) =>
                t.id === taskId
                    ? {
                        ...t,
                        submissions: [
                            ...(t.submissions || []).filter((s) => s.studentId !== "you"),
                            { studentId: "you", studentName: "You", submittedAt: "Now" },
                        ],
                    }
                    : t
            ),
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
        if (isDm) {
            return [{ key: "members", label: "MEMBERS", count: activeGroup.members.length }];
        }
        return [
            { key: "tasks", label: "TASKS", count: activeGroup.tasks?.length || 0 },
            { key: "files", label: "FILES", count: activeGroup.files?.length || 0 },
            { key: "members", label: "MEMBERS", count: activeGroup.members.length },
        ];
    }, [activeGroup, isClassroom, isDm]);

    function handleNavClick(key) {
        setMobileNavOpen(false);
        if (key === "group") return setShowQuiz(false);
        if (onNavigate) {
            onNavigate(key);
        } else if (key === "classroom") {
            // Classroom is a real route, so jump straight to it (the other keys
            // still swap pages in place when no onNavigate prop was passed).
            navigate("/classroom");
        } else if (key === "chatbot") {
            setFallbackPage("chatbot");
        } else if (key === "personalized") {
            setFallbackPage("personalized");
        } else if (key === "dashboard") {
            setFallbackPage("dashboard");
        }
    }

    function openTaskInClassroom(link) {
        requestOpenClassroom({ classId: link.classId, classworkId: link.classworkId, tab: "classwork" });
        handleNavClick("classroom");
    }

    function handleConfirmLogout() {
        setShowLogoutConfirm(false);
        // TODO: clear auth/session state here once real auth is wired up
        navigate("/");
    }

    function openGroupTab(groupId, tabKey) {
        setShowQuiz(false);
        setActiveGroupId(groupId);
        setOpenPanel(tabKey);
        setContextMenu(null);
    }

    function openGroupMessages(groupId) {
        setShowQuiz(false);
        setActiveGroupId(groupId);
        setOpenPanel(null);
        setContextMenu(null);
    }

    if (fallbackPage === "dashboard") {
        return <Dashboard />;
    }
    if (fallbackPage === "chatbot") {
        return <Chatbot onNavigate={(key) => setFallbackPage(key === "group" ? null : key)} />;
    }
    if (fallbackPage === "personalized") {
        return (
            <Personalized
                onNavigateToChatbot={() => setFallbackPage("chatbot")}
                onNavigateToGroup={() => setFallbackPage(null)}
                onNavigateToDashboard={() => setFallbackPage("dashboard")}
            />
        );
    }

    const activeNavKey = showQuiz ? "quiz" : "group";

    // Display-only numbers for the banner (derived from the existing chats, nothing new is stored)
    const chatMix = [
        { key: "classroom", label: "Classrooms", glyph: "⚑", color: "var(--t-ok)", n: groups.filter((g) => g.type === "classroom").length },
        { key: "squad", label: "Squads", glyph: "▲", color: "var(--t-ac)", n: groups.filter((g) => g.type === "squad").length },
        { key: "dm", label: "1v1", glyph: "◆", color: "var(--t-ac2)", n: groups.filter((g) => g.type === "dm").length },
    ];

    return (
        <div style={rootThemeStyle} className="flex flex-col bg-[var(--t-bg0)] min-h-screen">
            <div className="self-stretch bg-[var(--t-bg0)] min-h-screen relative">
                <div className="flex items-start self-stretch relative">
                    {mobileNavOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileNavOpen(false)} />}

                    {/* ---------------- SIDEBAR (scrollable, fits any device) ---------------- */}
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
                                        <button
                                            key={item.key}
                                            onClick={() => handleNavClick(item.key)}
                                            className={`flex items-center self-stretch py-[9px] text-left border border-solid transition-all duration-150 active:scale-[0.98]
                        ${active ? "bg-[var(--t-bg3)] border-[#00000000]" : "border-[#00000000] hover:bg-[var(--t-bg2)]"}`}
                                            style={active ? { boxShadow: "0px 0px 15px color-mix(in srgb, var(--t-ac) 15%, transparent)" } : undefined}
                                        >
                                            <img src={item.icon} className={`${item.iconClass} ml-[13px] mr-3 object-fill`} />
                                            <span className={`text-xs font-bold ${active ? "text-[color:var(--t-ac)]" : "text-[color:var(--t-tx1)]"}`}>{item.label}</span>
                                            {active && (
                                                <div className="flex-1 flex justify-end pr-4">
                                                    <div className="bg-[var(--t-ac)] w-1.5 h-1.5 rounded-full" style={{ boxShadow: "0px 0px 6px var(--t-ac)" }} />
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
                        className="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[55] w-5 h-16 items-center justify-center bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] border-l-0 text-[color:var(--t-ac)] hover:bg-[var(--t-ac)] hover:text-[color:var(--t-onac)] hover:shadow-[0_0_14px_color-mix(in_srgb,_var(--t-ac)_40%,_transparent)] transition-all duration-300 active:scale-95"
                        style={{ left: navCollapsed ? 0 : 256 }}
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: navCollapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s" }}>
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    {/* ---------------- MAIN ---------------- */}
                    <div style={{ backgroundImage: "var(--t-grad-main)" }} className={`flex-1 bg-[var(--t-bg1)] pb-16 min-w-0 transition-[margin] duration-300 ease-out ${navCollapsed ? "lg:ml-0" : "lg:ml-64"}`}>
                        {/* Top bar — same search, streak/XP, notifications and profile/settings as the other pages */}
                        <div className="sticky top-0 z-30 backdrop-blur flex flex-wrap justify-between items-center gap-3 self-stretch bg-[color-mix(in_srgb,_var(--t-bg0)_40%,_transparent)] py-3 px-4 sm:px-6">
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

                                <div className="relative flex-1 min-w-[40px] sm:min-w-[220px] sm:flex-none">
                                    <div className="flex items-center bg-[var(--t-bg3)] py-[7px] px-[15px] gap-2.5 border border-solid border-[color:var(--t-bd0)]">
                                        <img src={IMG.search} className="w-[13px] h-[13px] object-fill shrink-0" />
                                        <input
                                            ref={searchRef}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => setSearchFocused(true)}
                                            onBlur={() => setSearchFocused(false)}
                                            placeholder={searchFocused ? "Search messages..." : "[ / ] Search messages..."}
                                            className="bg-transparent outline-none text-[color:var(--t-tx0)] placeholder-[color:var(--t-tx2)] text-xs w-full min-w-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                <div className="flex shrink-0 items-center bg-[color-mix(in_srgb,_var(--t-warn)_14%,_transparent)] py-[5px] px-[13px] gap-[5px] border border-solid border-[color:color-mix(in_srgb,_var(--t-warn)_45%,_transparent)]">
                                    <img src={IMG.streak} className="w-3 h-3.5 object-fill" />
                                    <span className="text-[color:var(--t-warn)] text-[11px] font-bold tracking-wider hidden xs:inline">▲ 14 STREAK</span>
                                </div>
                                <div className="flex shrink-0 items-center bg-[color-mix(in_srgb,_var(--t-ac)_14%,_transparent)] py-[5px] px-[13px] gap-[5px] border border-solid border-[color:color-mix(in_srgb,_var(--t-ac)_45%,_transparent)]">
                                    <img src={IMG.xp} className="w-[15px] h-[13px] object-fill" />
                                    <span className="text-[color:var(--t-ac)] text-[11px] font-bold tracking-wider hidden xs:inline">3,420 XP</span>
                                </div>

                                <button className="relative shrink-0" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
                                    <img src={IMG.avatar} className="w-8 h-8 object-fill" />
                                    {notifOpen && (
                                        <div className="absolute right-0 top-10 z-50 w-56 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] p-3 text-left shadow-lg">
                                            <span className="text-[color:var(--t-tx0)] text-xs font-bold block mb-2">Notifications</span>
                                            <span className="text-[color:var(--t-tx2)] text-[11px] block">Jess R. sent a new message in Algorithm Study Squad.</span>
                                        </div>
                                    )}
                                </button>

                                <button onClick={() => setSettingsOpen(true)} className="flex flex-col shrink-0 items-start px-1 sm:px-2" aria-label="Profile / Settings">
                                    <div
                                        className="flex flex-col items-center bg-[var(--t-ac)] py-[5px] px-[7px] border border-solid border-[color:var(--t-bd0)]"
                                        style={{ boxShadow: "0px 1px 2px #0000000D" }}
                                    >
                                        <span className="text-[color:var(--t-onac)] text-sm font-bold">CP</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Quiz Arena placeholder (shown inside the page, sidebar and top bar stay) */}
                        {showQuiz && <QuizArena where="Group Collab" onBack={() => setShowQuiz(false)} />}

                        {/* Content (hidden, not unmounted, while Quiz Arena is open so chats are kept) */}
                        <div className={`${showQuiz ? "hidden" : "flex"} flex-col self-stretch px-4 sm:px-6 py-6 gap-6`}>
                            {/* Banner — same "player card" idea as the Dashboard, built from the chats you already have */}
                            <section className="border border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg1)] p-4 sm:p-5" style={{ boxShadow: PIXEL_SHADOW }}>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <HubAvatar />
                                        <div className="min-w-0">
                                            <p className={LABEL}>Squad HQ</p>
                                            <div className="flex flex-wrap items-center gap-2.5 mt-1">
                                                <h1 className="text-[22px] sm:text-[26px] leading-none font-bold uppercase tracking-wide text-[color:var(--t-tx0)]">Group Collab</h1>
                                                <Badge color="var(--t-ok)">[{groups.length} {groups.length === 1 ? "CHAT" : "CHATS"}]</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {chatMix.map((m) => (
                                            <Badge key={m.key} color={m.color}>
                                                {m.glyph} {m.n} {m.label}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className={LABEL}>Chat mix</span>
                                        <span className="text-[11px] font-bold text-[color:var(--t-ac)]">{groups.length} TOTAL</span>
                                    </div>
                                    <div className="relative flex w-full h-3.5 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)]">
                                        {chatMix
                                            .filter((m) => m.n > 0)
                                            .map((m) => (
                                                <div key={m.key} className="h-full" style={{ width: `${(m.n / groups.length) * 100}%`, backgroundColor: m.color }} />
                                            ))}
                                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: SEGMENTS }} />
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-col sm:flex-row items-start self-stretch gap-6">
                                {/* Messages list with dropdown filter */}
                                <div
                                    className="flex flex-col w-full sm:w-72 shrink-0 bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)]"
                                    style={{ boxShadow: PIXEL_SHADOW }}
                                >
                                    <PanelHeader icon="✉" title="MY MESSAGES" right={<Badge color="var(--t-warn)">{visibleGroups.length}</Badge>} />
                                    <div className="flex flex-col gap-2 p-3">
                                        <button
                                            onClick={() => setShowCreateGroup(true)}
                                            className={`flex justify-center items-center py-2 gap-1.5 ${PRIMARY_BTN}`}
                                        >
                                            <span className="text-xs">+ NEW MESSAGE</span>
                                        </button>

                                        {/* Dropdown filter */}
                                        <FilterDropdown value={filter} onChange={setFilter} />

                                        <p className="text-[color:var(--t-tx2)] text-[10px] italic px-0.5 opacity-80">Right-click a message for quick access.</p>

                                        <div className="flex flex-col gap-1.5 max-h-[460px] overflow-y-auto pr-0.5">
                                            {visibleGroups.length === 0 && (
                                                <p className="text-[color:var(--t-tx2)] text-xs py-6 text-center">Nothing here yet.</p>
                                            )}
                                            {visibleGroups.map((g) => {
                                                const active = g.id === activeGroupId;
                                                const lastMsg = g.messages[g.messages.length - 1];
                                                const myRole = g.members.find((m) => m.id === "you")?.role;
                                                const showRole = g.type === "squad" && myRole;
                                                return (
                                                    <button
                                                        key={g.id}
                                                        onClick={() => {
                                                            setActiveGroupId(g.id);
                                                            setOpenPanel(null);
                                                        }}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault();
                                                            setContextMenu({ x: e.clientX, y: e.clientY, groupId: g.id });
                                                        }}
                                                        className={`flex items-center gap-2.5 p-2 text-left border border-solid border-l-[3px] transition-all duration-150 ${active ? "bg-[var(--t-bg3)]" : "bg-[var(--t-bg0)] hover:bg-[var(--t-bg2)]"}`}
                                                        style={{
                                                            borderColor: active ? withAlpha(g.color, "99") : "var(--t-bd0)",
                                                            borderLeftColor: g.color,
                                                            boxShadow: active ? `0px 0px 12px ${withAlpha(g.color, "33")}` : undefined,
                                                        }}
                                                    >
                                                        <GroupAvatar color={g.color} name={g.name} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[color:var(--t-tx0)] text-xs font-bold truncate">{g.name}</span>
                                                                {showRole && (
                                                                    <Badge color={myRole === "admin" ? "var(--t-ac)" : "var(--t-tx2)"} className="!text-[8px] !py-0 !px-1">
                                                                        {myRole.toUpperCase()}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <span className="text-[color:var(--t-tx2)] text-[10px] truncate block">{lastMsg ? lastMsg.text : "No messages yet"}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Active conversation */}
                                <div className="flex-1 min-w-0 flex flex-col gap-3">
                                    {!activeGroup ? (
                                        <div
                                            className="flex flex-col items-center justify-center self-stretch bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] p-10 gap-2"
                                            style={{ boxShadow: PIXEL_SHADOW }}
                                        >
                                            <span className="text-[color:var(--t-ac)] text-2xl leading-none">✉</span>
                                            <span className="text-[color:var(--t-tx0)] text-sm font-bold uppercase tracking-wider">No message selected</span>
                                            <p className="text-[color:var(--t-tx2)] text-xs">Create or pick a conversation from the list on the left.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Header */}
                                            <div
                                                className="flex flex-wrap justify-between items-center gap-3 bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] border-t-[3px] p-3 sm:p-4"
                                                style={{ boxShadow: PIXEL_SHADOW, borderTopColor: activeGroup.color }}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <GroupAvatar color={activeGroup.color} name={activeGroup.name} className="w-12 h-12 text-sm" />
                                                    <div className="min-w-0">
                                                        <span className="text-[color:var(--t-tx0)] text-base font-bold uppercase tracking-wide truncate block">{activeGroup.name}</span>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <Badge color={isClassroom ? "var(--t-ok)" : isDm ? "var(--t-ac2)" : "var(--t-ac)"}>
                                                                {isClassroom ? "CLASSROOM" : isDm ? "1v1" : "SQUAD"}
                                                            </Badge>
                                                            <Pips value={activeGroup.members.length} color={activeGroup.color} />
                                                            <span className="text-[color:var(--t-tx2)] text-[11px]">
                                                                {activeGroup.members.length} member{activeGroup.members.length === 1 ? "" : "s"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Single entry point into the tabbed pop-up card */}
                                                <button
                                                    onClick={() => setOpenPanel(tabDefs[0]?.key || "members")}
                                                    className="flex items-center justify-center w-10 h-10 border-2 border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg0)] text-[color:var(--t-tx1)] text-base font-bold hover:bg-[var(--t-ac)] hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-onac)] transition-all duration-150 active:scale-95"
                                                >
                                                    <span>☰</span>
                                                </button>
                                            </div>

                                            {/* Chat stream */}
                                            <div
                                                className="flex flex-col self-stretch bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] h-[600px]"
                                                style={{ boxShadow: PIXEL_SHADOW }}
                                            >
                                                <PanelHeader icon="▤" title="CHAT LOG" right={<Badge color="var(--t-ac)">{activeGroup.messages.length} MSG</Badge>} />
                                                <div className="flex flex-col flex-1 min-h-0 p-3 sm:p-4 gap-3">
                                                    <div className="flex-1 flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                                                        {activeGroup.messages.length === 0 && <p className="text-[color:var(--t-tx2)] text-xs py-6 text-center">No messages yet — say hi!</p>}
                                                        {activeGroup.messages.map((m) => {
                                                            if (m.kind === "system") {
                                                                return (
                                                                    <div key={m.id} className="self-center flex items-center gap-2 py-1 px-3 border border-dashed border-[color:var(--t-bd1)] text-[color:var(--t-tx2)] text-[10px] font-bold uppercase tracking-wider">
                                                                        <span className="text-[color:var(--t-ok)]">✦</span>
                                                                        {m.text}
                                                                        {m.time && <span className="opacity-70">· {m.time}</span>}
                                                                    </div>
                                                                );
                                                            }
                                                            if (m.kind === "task" && m.link) {
                                                                const isMaterial = m.link.type === "material";
                                                                return (
                                                                    <div key={m.id} className="flex flex-col gap-0.5 items-start">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colorForString(m.senderName) }}>{m.senderName}</span>
                                                                            <span className="text-[color:var(--t-tx2)] text-[10px] opacity-70">{m.time}</span>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => openTaskInClassroom(m.link)}
                                                                            title="Open this task in Classroom"
                                                                            className="group w-full max-w-[85%] flex flex-col gap-2 text-left p-3 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] border-l-[3px] border-l-[color:var(--t-ok)] hover:border-[color:var(--t-ok)] transition-all duration-150 active:scale-[0.99]"
                                                                            style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
                                                                        >
                                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                                                <Badge color="var(--t-ok)">⚑ {TASK_TYPE_LABEL[m.link.type] || "Task"}</Badge>
                                                                                <span className="text-[color:var(--t-tx2)] text-[10px] font-bold uppercase tracking-wider truncate">{m.link.className}</span>
                                                                            </div>
                                                                            <span className="text-[color:var(--t-tx0)] text-sm font-bold">{m.link.title}</span>
                                                                            {(m.link.due || m.link.points != null) && (
                                                                                <div className="flex flex-wrap items-center gap-1.5">
                                                                                    {m.link.due && !isMaterial && <Badge color="var(--t-warn)">▲ Due {m.link.due}</Badge>}
                                                                                    {m.link.points != null && <Badge color="var(--t-ac)">{m.link.points} PTS</Badge>}
                                                                                </div>
                                                                            )}
                                                                            <span className="text-[color:var(--t-ac)] text-[10px] font-bold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
                                                                                Open in Classroom →
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                );
                                                            }
                                                            const mine = m.senderId === "you";
                                                            return (
                                                                <div key={m.id} className={`flex flex-col gap-0.5 ${mine ? "items-end" : "items-start"}`}>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: mine ? "var(--t-ac)" : colorForString(m.senderName) }}>{m.senderName}</span>
                                                                        <span className="text-[color:var(--t-tx2)] text-[10px] opacity-70">{m.time}</span>
                                                                    </div>
                                                                    <div
                                                                        className={`max-w-[80%] py-2 px-3 text-xs ${mine ? "bg-[var(--t-ac)] text-[color:var(--t-onac)] border border-solid border-[color:var(--t-ac2)]" : "bg-[var(--t-bg0)] text-[color:var(--t-tx0)] border border-solid border-[color:var(--t-bd0)] border-l-[3px]"
                                                                            }`}
                                                                        style={mine ? { boxShadow: "2px 2px 0px var(--t-shadow)" } : { borderLeftColor: colorForString(m.senderName) }}
                                                                    >
                                                                        {m.text}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <form onSubmit={sendMessage} className="flex items-center gap-2 pt-2 border-t border-solid border-[color:var(--t-bd0)]">
                                                        <input
                                                            value={messageText}
                                                            onChange={(e) => setMessageText(e.target.value)}
                                                            placeholder={`Message ${activeGroup.name}...`}
                                                            className="flex-1 min-w-0 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] placeholder-[color:var(--t-tx2)] text-xs py-2.5 px-3 outline-none focus:border-[color:var(--t-ac)]"
                                                        />
                                                        {isSquad && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateActiveGroup((g) => ({
                                                                        ...g,
                                                                        files: [...(g.files || []), { id: `f${Date.now()}`, name: "Shared_File.pdf", uploadedBy: "You", size: "0.9 MB" }],
                                                                    }))
                                                                }
                                                                className="shrink-0 bg-[var(--t-bg0)] border-2 border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx1)] text-xs py-2 px-3 hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-95"
                                                                aria-label="Attach a file"
                                                            >
                                                                📎
                                                            </button>
                                                        )}
                                                        <button type="submit" className={`shrink-0 text-xs py-2 px-4 ${PRIMARY_BTN}`}>
                                                            SEND 
                                                            
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings drawer — shared by every page (and Quiz Arena) */}
                <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} onThemeChange={setTheme} />
            </div>

            {openPanel && activeGroup && (
                <GroupDetailModal
                    group={activeGroup}
                    isClassroom={isClassroom}
                    isDm={isDm}
                    isAdmin={isAdmin}
                    canAddMembers={canAddMembers}
                    canCreateTask={canCreateTask}
                    tab={openPanel}
                    onTabChange={setOpenPanel}
                    tabDefs={tabDefs}
                    onClose={() => setOpenPanel(null)}
                    onNewTask={() => setShowNewTask(true)}
                    onAddMember={() => setShowAddMember(true)}
                    onSubmitTask={submitTask}
                    onPromote={promoteToAdmin}
                />
            )}

            {contextMenu &&
                (() => {
                    const g = groups.find((gr) => gr.id === contextMenu.groupId);
                    if (!g) return null;
                    return (
                        <GroupContextMenu
                            x={contextMenu.x}
                            y={contextMenu.y}
                            group={g}
                            onClose={() => setContextMenu(null)}
                            onOpenMessages={() => openGroupMessages(g.id)}
                            onOpenTab={(tabKey) => openGroupTab(g.id, tabKey)}
                        />
                    );
                })()}

            {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} onCreate={createGroup} />}
            {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} onAdd={addMember} />}
            {showNewTask && <NewTaskModal onClose={() => setShowNewTask(false)} onCreate={createTask} />}

            {/* Logout confirmation — same popup as the Dashboard */}
            {showLogoutConfirm && (
                <LogoutConfirmModal onConfirm={handleConfirmLogout} onCancel={() => setShowLogoutConfirm(false)} />
            )}
        </div>
    );
}
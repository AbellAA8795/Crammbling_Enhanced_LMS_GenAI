import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Chatbot from "./chatbot";
import Personalized from "./personalized";
import { useTheme, withAlpha, CloseIcon, MenuIcon } from "./Theme";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import Settings from "../components/Settings";
import QuizArena from "./QuizArena";

/* ---------------------------------------------------------
   GROUP COLLAB
   Two kinds of group chat:
   - "normal"    (a squad): creator becomes ADMIN, any admin can
                  promote other members to admin, everyone can
                  send files, add members, and create tasks
                  (tasks optionally sync to the Study Sprint Board).
   - "classroom" (a class): creator becomes TEACHER automatically,
                  only the teacher adds members, grades submitted
                  tasks, and posts lesson materials.
   Members can be added via Account ID, Username, or Gmail.
   Files / Tasks / Materials / Grades / Members now live in a single
   tabbed pop-up card instead of being stacked inline on the page.
   Right-clicking a group chat opens a quick-access context menu.
--------------------------------------------------------- */

/* ---------------------------------------------------------
   Same asset set as chatbot.jsx / personalized.jsx, so the
   shell (sidebar, topbar, nav icons) matches pixel-for-pixel.
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
    menu:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%232CD4D9' stroke-width='2' stroke-linecap='round'><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='18' x2='21' y2='18'/></svg>",
    close:
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23BBC9C9' stroke-width='2' stroke-linecap='round'><line x1='4' y1='4' x2='20' y2='20'/><line x1='20' y1='4' x2='4' y2='20'/></svg>",
};

const NAV_ITEMS = [
    { key: "dashboard", label: "DASHBOARD", icon: IMG.dashboard, iconClass: "w-[18px] h-[15px]" },
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

/* Quick-access options for the right-click context menu — depends on GC type. */
function tabDefsFor(g) {
    if (!g) return [];
    if (g.type === "classroom") {
        return [
            { key: "tasks", label: "Assignments" },
            { key: "materials", label: "Materials" },
            { key: "grades", label: "Grades" },
            { key: "members", label: "Members" },
        ];
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
        type: "normal",
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
        name: "CS240 — Prof. Santos",
        type: "classroom",
        color: "var(--t-ok)",
        teacherId: "you",
        members: [
            { id: "you", name: "You", role: "teacher" },
            { id: "s2", name: "Maya K.", role: "student" },
            { id: "s3", name: "Alex Chen", role: "student" },
        ],
        messages: [
            { id: "msg1", senderId: "you", senderName: "You", text: "Reminder: Midterm covers chapters 1-6.", time: "08:00" },
        ],
        materials: [
            { id: "mat1", title: "Chapter 5 Slides — Graph Traversals", kind: "Slides", addedBy: "You" },
        ],
        tasks: [
            {
                id: "at1",
                title: "Assignment 3: Dijkstra Implementation",
                desc: "Implement shortest path with a min-heap.",
                due: "Mon, Mar 23",
                points: 100,
                submissions: [{ studentId: "s2", studentName: "Maya K.", submittedAt: "Mar 19", grade: null, feedback: "" }],
                createdBy: "You",
            },
        ],
    },
    {
        // Demo: what the UI looks like when "You" are a regular MEMBER
        // (not the admin) of a normal squad — no "Make Admin" button shows.
        id: "g3",
        name: "Discrete Math Circle",
        type: "normal",
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
        // Demo: what the UI looks like when "You" are a STUDENT (not the
        // teacher) in a classroom — no grading inputs, no "Add Member",
        // and the Grades tab only shows your own graded work.
        id: "g4",
        name: "MATH210 — Prof. Alvarez",
        type: "classroom",
        color: "var(--t-ac2)",
        teacherId: "t1",
        members: [
            { id: "t1", name: "Dr. Alvarez", role: "teacher" },
            { id: "you", name: "You", role: "student" },
            { id: "s4", name: "Riley P.", role: "student" },
        ],
        messages: [{ id: "msg4", senderId: "t1", senderName: "Dr. Alvarez", text: "Assignment 2 grades are posted.", time: "07:45" }],
        materials: [{ id: "mat2", title: "Set Theory Review Deck", kind: "Slides", addedBy: "Dr. Alvarez" }],
        tasks: [
            {
                id: "at2",
                title: "Assignment 2: Set Theory Proofs",
                desc: "Prove the given identities using set builder notation.",
                due: "Fri, Mar 14",
                points: 50,
                submissions: [
                    { studentId: "you", studentName: "You", submittedAt: "Mar 13", grade: 46, feedback: "Great work, minor notation slip on #4." },
                    { studentId: "s4", studentName: "Riley P.", submittedAt: "Mar 14", grade: null, feedback: "" },
                ],
                createdBy: "Dr. Alvarez",
            },
        ],
    },
];

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
        <span
            className="text-[10px] font-bold py-0.5 px-2 border border-solid shrink-0"
            style={{ backgroundColor: withAlpha(color, "33"), borderColor: withAlpha(color, "4D"), color }}
        >
            {children}
        </span>
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
                className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_90%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] p-5 w-full max-w-sm flex flex-col gap-3"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 40px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}
            >
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[color:var(--t-tx0)] text-sm font-bold">ADD MEMBER</span>
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
                    className="mt-1 bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2 hover:opacity-90 hover:shadow-[0_0_16px_color-mix(in_srgb,_var(--t-ac)_40%,_transparent)] transition-all duration-150 active:scale-[0.98]"
                >
                    ADD TO GROUP
                </button>
            </form>
        </div>
    );
}

function CreateGroupModal({ onClose, onCreate }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("normal");

    function submit(e) {
        e.preventDefault();
        if (!name.trim()) return;
        onCreate(name.trim(), type);
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form
                onSubmit={submit}
                className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_90%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] p-5 w-full max-w-sm flex flex-col gap-3"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 40px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}
            >
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[color:var(--t-tx0)] text-sm font-bold">NEW GROUP CHAT</span>
                    <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-lg leading-none hover:text-[color:var(--t-ac2)] transition-colors">
                        ×
                    </button>
                </div>

                <label className="flex flex-col gap-1">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Group name</span>
                    <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Discrete Math Warband"
                        className="bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac)] transition-colors"
                    />
                </label>

                <div className="flex flex-col gap-1.5">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Type</span>
                    <button
                        type="button"
                        onClick={() => setType("normal")}
                        className={`flex flex-col items-start p-3 border border-solid text-left transition-all duration-150 ${type === "normal" ? "border-[color:var(--t-ac)] bg-[var(--t-in1)] shadow-[0_0_14px_color-mix(in_srgb,_var(--t-ac)_20%,_transparent)]" : "border-[color:var(--t-mbd)] bg-[var(--t-in0)] hover:border-[color:var(--t-ac2)]"
                            }`}
                    >
                        <span className="text-[color:var(--t-ac)] text-xs font-bold">NORMAL SQUAD</span>
                        <span className="text-[color:var(--t-mtx)] text-[11px] mt-0.5">
                            You become admin. Anyone can add members, share files, and create tasks.
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setType("classroom")}
                        className={`flex flex-col items-start p-3 border border-solid text-left transition-all duration-150 ${type === "classroom" ? "border-[color:var(--t-ok)] bg-[var(--t-in1)] shadow-[0_0_14px_color-mix(in_srgb,_var(--t-ok)_20%,_transparent)]" : "border-[color:var(--t-mbd)] bg-[var(--t-in0)] hover:border-[color:var(--t-ac2)]"
                            }`}
                    >
                        <span className="text-[color:var(--t-ok)] text-xs font-bold">CLASSROOM</span>
                        <span className="text-[color:var(--t-mtx)] text-[11px] mt-0.5">
                            You become the teacher. You add members, post materials, and grade tasks.
                        </span>
                    </button>
                </div>

                <button
                    type="submit"
                    className="mt-1 bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2 hover:opacity-90 hover:shadow-[0_0_16px_color-mix(in_srgb,_var(--t-ac)_40%,_transparent)] transition-all duration-150 active:scale-[0.98]"
                >
                    CREATE GROUP CHAT
                </button>
            </form>
        </div>
    );
}

const POINT_PRESETS = [10, 50, 100, 200];

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

function NewTaskModal({ isClassroom, onClose, onCreate }) {
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
                    <div className="relative h-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] overflow-hidden">
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

function NewMaterialModal({ onClose, onCreate }) {
    const [title, setTitle] = useState("");
    const [kind, setKind] = useState("PDF");
    const [link, setLink] = useState("");

    function submit(e) {
        e.preventDefault();
        if (!title.trim()) return;
        onCreate({ title: title.trim(), kind, link: link.trim() });
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form
                onSubmit={submit}
                className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_90%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] p-5 w-full max-w-sm flex flex-col gap-3"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 40px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}
            >
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[color:var(--t-tx0)] text-sm font-bold">ADD LESSON MATERIAL</span>
                    <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-lg leading-none hover:text-[color:var(--t-ac2)] transition-colors">
                        ×
                    </button>
                </div>
                <label className="flex flex-col gap-1">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Title</span>
                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ok)] transition-colors"
                    />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Type</span>
                    <select
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                        className="bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ok)] transition-colors"
                    >
                        <option>PDF</option>
                        <option>Slides</option>
                        <option>Video</option>
                        <option>Link</option>
                    </select>
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-[color:var(--t-mtx)] text-[11px]">Link / filename</span>
                    <input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="e.g. Chapter6_Slides.pdf"
                        className="bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ok)] transition-colors"
                    />
                </label>
                <button
                    type="submit"
                    className="mt-1 bg-[var(--t-ok)] text-[color:var(--t-onok)] text-xs font-bold py-2 hover:opacity-90 hover:shadow-[0_0_16px_color-mix(in_srgb,_var(--t-ok)_40%,_transparent)] transition-all duration-150 active:scale-[0.98]"
                >
                    ADD MATERIAL
                </button>
            </form>
        </div>
    );
}

/* ---------------------------------------------------------
   Tabbed pop-up card: Tasks / Files / Materials / Grades / Members
   all live here now instead of being stacked on the page.
--------------------------------------------------------- */
function GroupDetailModal({
    group,
    isClassroom,
    isTeacher,
    canAddMembers,
    canCreateTask,
    tab,
    onTabChange,
    tabDefs,
    onClose,
    onNewTask,
    onNewMaterial,
    onAddMember,
    onSubmitTask,
    onPromote,
    isAdmin,
    gradeDrafts,
    setGradeDrafts,
    onSaveGrade,
}) {
    if (!group) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <div
                className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_90%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-lg max-h-[85vh] flex flex-col"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 50px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}
            >
                <div className="flex justify-between items-center p-4 border-b border-solid border-[color:var(--t-mbd)] shrink-0">
                    <div className="min-w-0">
                        <span className="text-[color:var(--t-tx0)] text-sm font-bold block truncate">{group.name}</span>
                        <span className="text-[color:var(--t-mtx)] text-[11px]">{isClassroom ? "Classroom details" : "Squad details"}</span>
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
                                className={`flex items-center gap-1.2 pb-2.5 -mb-px border-b-2 text-[5px] font-bold whitespace-nowrap flex-1 min-w-0 justify-center transition-all duration-150 active:scale-95 ${active
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
                            title={isClassroom ? "ASSIGNMENTS" : "TASKS"}
                            count={group.tasks?.length || 0}
                            action={
                                canCreateTask && (
                                    <button onClick={onNewTask} className="text-[color:var(--t-ac)] text-[10px] font-bold hover:text-[color:var(--t-ac2)] hover:underline underline-offset-2 transition-colors">
                                        + {isClassroom ? "New Assignment" : "New Task"}
                                    </button>
                                )
                            }
                        >
                            {(group.tasks || []).length === 0 && <p className="text-[color:var(--t-mtx)] text-xs py-2">Nothing here yet.</p>}
                            {(group.tasks || []).map((t) => {
                                const mySubmission = isClassroom && t.submissions?.find((s) => s.studentId === "you");
                                return (
                                    <div
                                        key={t.id}
                                        className="flex flex-col gap-1.5 bg-[var(--t-in0)] p-3 border border-solid border-[color:var(--t-mbd)] mb-2 transition-colors hover:border-[color:var(--t-mbd2)]"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-[color:var(--t-tx0)] text-sm font-bold">{t.title}</span>
                                            {isClassroom ? (
                                                <Badge color="var(--t-warn)">{t.points} PTS</Badge>
                                            ) : (
                                                <Badge color={colorForString(t.badge)}>{t.badge}</Badge>
                                            )}
                                        </div>
                                        {t.desc && <span className="text-[color:var(--t-tx1)] text-xs">{t.desc}</span>}
                                        <span className="text-[color:var(--t-mtx)] text-[11px]">Due {t.due || "—"}</span>

                                        {isClassroom && !isTeacher && (
                                            <button
                                                onClick={() => onSubmitTask(t.id)}
                                                disabled={!!mySubmission}
                                                className={`self-start text-[10px] font-bold py-1.5 px-3 mt-1 transition-all duration-150 active:scale-95 ${mySubmission ? "bg-[var(--t-in2)] text-[color:var(--t-mtx)] cursor-not-allowed" : "bg-[var(--t-ac2)] text-[color:var(--t-onac)] hover:opacity-90 hover:shadow-[0_0_14px_color-mix(in_srgb,_var(--t-ac2)_40%,_transparent)]"
                                                    }`}
                                            >
                                                {mySubmission ? "✓ Submitted" : "Submit Task"}
                                            </button>
                                        )}

                                        {isClassroom && isTeacher && (
                                            <div className="flex flex-col gap-1.5 mt-1">
                                                <span className="text-[color:var(--t-mtx)] text-[10px] font-bold">
                                                    {t.submissions.length} submission{t.submissions.length === 1 ? "" : "s"}
                                                </span>
                                                {t.submissions.map((s) => {
                                                    const key = `${t.id}:${s.studentId}`;
                                                    const draft = gradeDrafts[key] || { grade: s.grade ?? "", feedback: s.feedback || "" };
                                                    return (
                                                        <div key={s.studentId} className="flex flex-wrap items-center gap-2 bg-[var(--t-mbg)] p-2 border border-solid border-[color:var(--t-mbd)]">
                                                            <span className="text-[color:var(--t-tx1)] text-xs flex-1 min-w-[80px]">{s.studentName}</span>
                                                            {s.grade != null ? (
                                                                <Badge color="var(--t-ok2)">
                                                                    {s.grade}/{t.points}
                                                                </Badge>
                                                            ) : (
                                                                <>
                                                                    <input
                                                                        type="number"
                                                                        value={draft.grade}
                                                                        onChange={(e) => setGradeDrafts((prev) => ({ ...prev, [key]: { ...draft, grade: e.target.value } }))}
                                                                        placeholder="Grade"
                                                                        className="w-16 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-1 px-2 outline-none focus:border-[color:var(--t-ok2)] transition-colors"
                                                                    />
                                                                    <button
                                                                        onClick={() => onSaveGrade(t.id, s.studentId)}
                                                                        className="text-[color:var(--t-ok2)] text-[10px] font-bold py-1 px-2 hover:text-[color:var(--t-ok3)] hover:underline underline-offset-2 transition-colors"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                                {t.submissions.length === 0 && <span className="text-[color:var(--t-mtx)] text-[11px]">No submissions yet.</span>}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </Panel>
                    )}

                    {tab === "files" && !isClassroom && (
                        <Panel title="SHARED FILES" count={group.files?.length || 0}>
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
                        <Panel
                            title="LESSON MATERIALS"
                            count={group.materials?.length || 0}
                            action={
                                isTeacher && (
                                    <button onClick={onNewMaterial} className="text-[color:var(--t-ok)] text-[10px] font-bold hover:text-[color:var(--t-ok3)] hover:underline underline-offset-2 transition-colors">
                                        + Add Material
                                    </button>
                                )
                            }
                        >
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

                    {tab === "grades" && isClassroom && (
                        <Panel title="GRADES">
                            {(group.tasks || []).length === 0 && <p className="text-[color:var(--t-mtx)] text-xs py-2">No graded work yet.</p>}
                            <div className="flex flex-col gap-1.5">
                                {(group.tasks || []).flatMap((t) =>
                                    t.submissions
                                        .filter((s) => isTeacher || s.studentId === "you")
                                        .map((s) => (
                                            <div
                                                key={`${t.id}-${s.studentId}`}
                                                className="flex justify-between items-center bg-[var(--t-in0)] p-2.5 border border-solid border-[color:var(--t-mbd)] transition-colors hover:border-[color:var(--t-mbd2)]"
                                            >
                                                <div className="min-w-0">
                                                    <span className="text-[color:var(--t-tx1)] text-xs block truncate">{t.title}</span>
                                                    {isTeacher && <span className="text-[color:var(--t-mtx)] text-[10px]">{s.studentName}</span>}
                                                </div>
                                                {s.grade != null ? (
                                                    <Badge color="var(--t-ok2)">
                                                        {s.grade}/{t.points}
                                                    </Badge>
                                                ) : (
                                                    <Badge color="var(--t-warn)">PENDING</Badge>
                                                )}
                                            </div>
                                        ))
                                )}
                            </div>
                        </Panel>
                    )}

                    {tab === "members" && (
                        <Panel
                            title="MEMBERS"
                            count={group.members.length}
                            action={
                                canAddMembers && (
                                    <button onClick={onAddMember} className="text-[color:var(--t-ac)] text-[10px] font-bold hover:text-[color:var(--t-ac2)] hover:underline underline-offset-2 transition-colors">
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
                                        <Badge color={m.role === "admin" || m.role === "teacher" ? "var(--t-ac)" : "var(--t-mtx)"}>{m.role.toUpperCase()}</Badge>
                                        {!isClassroom && isAdmin && m.role !== "admin" && (
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

/* Right-click quick-access menu on a group chat list item. */
function GroupContextMenu({ x, y, group, onClose, onOpenMessages, onOpenTab }) {
    const opts = tabDefsFor(group);
    const clampedX = Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 1000) - 190);
    const clampedY = Math.min(y, (typeof window !== "undefined" ? window.innerHeight : 800) - (opts.length * 30 + 56));
    return (
        <>
            <div className="fixed inset-0 z-[70]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
            <div
                className="fixed z-[80] bg-[color-mix(in_srgb,_var(--t-mbg)_90%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] py-1 min-w-[172px]"
                style={{ top: Math.max(8, clampedY), left: Math.max(8, clampedX), boxShadow: "0 12px 32px rgba(0,0,0,0.6), 0 0 24px color-mix(in srgb, var(--t-glow) 25%, transparent)" }}
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

    const [groups, setGroups] = useState(INITIAL_GROUPS);
    const [activeGroupId, setActiveGroupId] = useState(INITIAL_GROUPS[0]?.id || null);
    const [openPanel, setOpenPanel] = useState(null); // which tab is open in the pop-up modal, or null
    const [messageText, setMessageText] = useState("");
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showNewTask, setShowNewTask] = useState(false);
    const [showNewMaterial, setShowNewMaterial] = useState(false);
    const [gradeDrafts, setGradeDrafts] = useState({}); // `${taskId}:${studentId}` -> { grade, feedback }
    const [openSections, setOpenSections] = useState({ classroom: true, normal: true }); // dropdown state for the group list
    const [contextMenu, setContextMenu] = useState(null); // { x, y, groupId } | null

    const activeGroup = groups.find((g) => g.id === activeGroupId) || null;
    const isClassroom = activeGroup?.type === "classroom";
    const me = activeGroup?.members.find((m) => m.id === "you");
    const isAdmin = me?.role === "admin";
    const isTeacher = me?.role === "teacher";
    const canAddMembers = activeGroup ? (isClassroom ? isTeacher : true) : false;
    const canCreateTask = activeGroup ? (isClassroom ? isTeacher : true) : false;

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
        const base = {
            id,
            name,
            type,
            color: colorForString(name),
            members: [{ id: "you", name: "You", role: type === "classroom" ? "teacher" : "admin" }],
            messages: [],
        };
        const fresh = type === "classroom" ? { ...base, teacherId: "you", materials: [], tasks: [] } : { ...base, files: [], tasks: [] };
        setGroups((prev) => [fresh, ...prev]);
        setActiveGroupId(id);
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
            members: [...g.members, { id: `m${Date.now()}`, name: rawValue, role: g.type === "classroom" ? "student" : "member" }],
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
        if (isClassroom) {
            updateActiveGroup((g) => ({
                ...g,
                tasks: [
                    ...(g.tasks || []),
                    { id: `at${Date.now()}`, title: fields.title, desc: fields.desc, due: fields.due, points: fields.points, submissions: [], createdBy: "You" },
                ],
            }));
        } else {
            updateActiveGroup((g) => ({
                ...g,
                tasks: [
                    ...(g.tasks || []),
                    { id: `t${Date.now()}`, title: fields.title, desc: fields.desc, due: fields.due, badge: fields.badge || "SQUAD", createdBy: "You" },
                ],
            }));
            onSyncTaskToSprintBoard?.(fields.title, { subject: (fields.badge || "SQUAD").toUpperCase(), meta: fields.due || activeGroup.name });
        }
        setShowNewTask(false);
    }

    function addMaterial(fields) {
        updateActiveGroup((g) => ({
            ...g,
            materials: [...(g.materials || []), { id: `mat${Date.now()}`, title: fields.title, kind: fields.kind, link: fields.link, addedBy: "You" }],
        }));
        setShowNewMaterial(false);
    }

    function submitTask(taskId) {
        updateActiveGroup((g) => ({
            ...g,
            tasks: g.tasks.map((t) =>
                t.id === taskId
                    ? {
                        ...t,
                        submissions: [
                            ...t.submissions.filter((s) => s.studentId !== "you"),
                            { studentId: "you", studentName: "You", submittedAt: "Now", grade: null, feedback: "" },
                        ],
                    }
                    : t
            ),
        }));
    }

    function saveGrade(taskId, studentId) {
        const draft = gradeDrafts[`${taskId}:${studentId}`];
        if (!draft) return;
        updateActiveGroup((g) => ({
            ...g,
            tasks: g.tasks.map((t) =>
                t.id === taskId
                    ? { ...t, submissions: t.submissions.map((s) => (s.studentId === studentId ? { ...s, grade: draft.grade, feedback: draft.feedback || "" } : s)) }
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
                { key: "grades", label: "GRADES" },
                { key: "members", label: "MEMBERS", count: activeGroup.members.length },
            ];
        }
        return [
            { key: "tasks", label: "TASKS", count: activeGroup.tasks?.length || 0 },
            { key: "files", label: "FILES", count: activeGroup.files?.length || 0 },
            { key: "members", label: "MEMBERS", count: activeGroup.members.length },
        ];
    }, [activeGroup, isClassroom]);

    function handleNavClick(key) {
        setMobileNavOpen(false);
        if (key === "group") return setShowQuiz(false);
        if (onNavigate) {
            onNavigate(key);
        } else if (key === "chatbot") {
            setFallbackPage("chatbot");
        } else if (key === "personalized") {
            setFallbackPage("personalized");
        } else if (key === "dashboard") {
            setFallbackPage("dashboard");
        }
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
                                            placeholder={searchFocused ? "Search group chats..." : "[ / ] Search group chats..."}
                                            className="bg-transparent outline-none text-[color:var(--t-tx0)] placeholder-[color:var(--t-tx2)] text-xs w-full min-w-0"
                                        />
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
                        <div className={`${showQuiz ? "hidden" : "flex"} flex-col self-stretch px-4 sm:px-6 lg:px-10 py-4 gap-4`}>
                            <div className="flex flex-col sm:flex-row items-start self-stretch gap-4">
                                {/* Group list */}
                                <div
                                    className="flex flex-col w-full sm:w-64 shrink-0 bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] p-3 gap-2"
                                    style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
                                >
                                    <div className="flex justify-between items-center pb-1">
                                        <span className="text-[color:var(--t-tx0)] text-xs font-bold">MY GROUP CHATS</span>
                                        <span className="text-[color:var(--t-tx2)] text-[10px]">{groups.length}</span>
                                    </div>
                                    <button
                                        onClick={() => setShowCreateGroup(true)}
                                        className="flex justify-center items-center bg-[var(--t-bg3)] py-2 gap-1.5 border border-solid border-[color:var(--t-bd0)] hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.98]"
                                    >
                                        <span className="text-[color:var(--t-ac)] text-xs font-bold">+ NEW GROUP CHAT</span>
                                    </button>

                                    <p className="text-[color:var(--t-bd1)] text-[10px] italic px-0.5">Right-click a chat for quick access.</p>

                                    <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-0.5">
                                        {[
                                            { key: "classroom", label: "CLASSROOMS", color: "var(--t-ok)" },
                                            { key: "normal", label: "SQUADS", color: "var(--t-ac)" },
                                        ].map((section) => {
                                            const items = groups.filter((g) => (section.key === "classroom" ? g.type === "classroom" : g.type !== "classroom"));
                                            const open = openSections[section.key];
                                            return (
                                                <div key={section.key} className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() => setOpenSections((s) => ({ ...s, [section.key]: !s[section.key] }))}
                                                        aria-expanded={open}
                                                        className="flex items-center gap-2 py-1.5 px-2 border border-solid bg-[var(--t-bg2)] border-[color:var(--t-bd0)] hover:border-[color:var(--t-bd1)] transition-all duration-150 active:scale-[0.99]"
                                                        style={{ borderLeft: `3px solid ${section.color}` }}
                                                    >
                                                        <svg
                                                            width="10"
                                                            height="10"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke={section.color}
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="shrink-0 transition-transform duration-200"
                                                            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
                                                        >
                                                            <polyline points="9 18 15 12 9 6" />
                                                        </svg>
                                                        <span className="text-xs font-bold flex-1 text-left" style={{ color: section.color }}>
                                                            {section.label}
                                                        </span>
                                                        <span className="text-[10px] font-bold px-1.5 py-px" style={{ backgroundColor: withAlpha(section.color, "22"), color: section.color }}>
                                                            {items.length}
                                                        </span>
                                                    </button>

                                                    {open && (
                                                        <div className="flex flex-col gap-1.5 pl-1.5">
                                                            {items.length === 0 && <p className="text-[color:var(--t-bd1)] text-[10px] italic py-1.5 px-2">Nothing here yet.</p>}
                                                            {items.map((g) => {
                                                                const active = g.id === activeGroupId;
                                                                const lastMsg = g.messages[g.messages.length - 1];
                                                                const myRole = g.members.find((m) => m.id === "you")?.role;
                                                                const myRoleColor = myRole === "admin" || myRole === "teacher" ? "var(--t-ac)" : "var(--t-tx2)";
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
                                                                        className={`flex items-center gap-2.5 p-2 text-left border border-solid transition-all duration-150 ${active ? "bg-[var(--t-bg3)] border-[#00000000]" : "border-[#00000000] hover:bg-[var(--t-bg2)]"}`}
                                                                        style={active ? { boxShadow: `0px 0px 12px ${withAlpha(g.color, "33")}` } : undefined}
                                                                    >
                                                                        <div
                                                                            className="w-8 h-8 shrink-0 flex items-center justify-center text-[10px] font-bold"
                                                                            style={{ backgroundColor: withAlpha(g.color, "33"), color: g.color, border: `1px solid ${withAlpha(g.color, "4D")}` }}
                                                                        >
                                                                            {initialsFor(g.name)}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-center gap-1.5">
                                                                                <span className="text-[color:var(--t-tx0)] text-xs font-bold truncate">{g.name}</span>
                                                                                {myRole && (
                                                                                    <span className="text-[9px] font-bold shrink-0" style={{ color: myRoleColor }}>
                                                                                        · {myRole.toUpperCase()}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <span className="text-[color:var(--t-tx2)] text-[10px] truncate block">{lastMsg ? lastMsg.text : "No messages yet"}</span>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {groups.length === 0 && <p className="text-[color:var(--t-tx2)] text-xs py-4 text-center">No group chats yet — create one above.</p>}
                                    </div>
                                </div>

                                {/* Active group */}
                                <div className="flex-1 min-w-0 flex flex-col gap-3">
                                    {!activeGroup ? (
                                        <div
                                            className="flex flex-col items-center justify-center self-stretch bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] p-10 gap-2"
                                            style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
                                        >
                                            <span className="text-[color:var(--t-tx0)] text-sm font-bold">No group chat selected</span>
                                            <p className="text-[color:var(--t-tx2)] text-xs">Create or pick a group chat from the list on the left.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Header */}
                                            <div
                                                className="flex flex-wrap justify-between items-center gap-3 bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] p-3 sm:p-4"
                                                style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div
                                                        className="w-10 h-10 shrink-0 flex items-center justify-center text-xs font-bold"
                                                        style={{ backgroundColor: withAlpha(activeGroup.color, "33"), color: activeGroup.color, border: `1px solid ${withAlpha(activeGroup.color, "4D")}` }}
                                                    >
                                                        {initialsFor(activeGroup.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="text-[color:var(--t-tx0)] text-base font-bold truncate block">{activeGroup.name}</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <Badge color={isClassroom ? "var(--t-ok)" : "var(--t-ac)"}>{isClassroom ? "CLASSROOM" : "SQUAD"}</Badge>
                                                            <span className="text-[color:var(--t-tx2)] text-[11px]">
                                                                {activeGroup.members.length} member{activeGroup.members.length === 1 ? "" : "s"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Single entry point into the tabbed pop-up card */}
                                                <button
                                                    onClick={() => setOpenPanel(tabDefs[0]?.key || "members")}
                                                    className="flex items-center gap-1.5 py-1.5 px-3 border border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg0)] text-[color:var(--t-tx1)] text-[10px] font-bold hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-all duration-150 active:scale-95"
                                                >
                                                    <span>☰</span>
                                                </button>
                                            </div>

                                            {/* Chat stream */}
                                            <div
                                                className="flex flex-col self-stretch bg-[var(--t-bg1)] border border-solid border-[color:var(--t-bd0)] p-3 sm:p-4 gap-3 h-[600px]"
                                                style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
                                            >
                                                <div className="flex-1 flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
                                                    {activeGroup.messages.length === 0 && <p className="text-[color:var(--t-tx2)] text-xs py-6 text-center">No messages yet — say hi!</p>}
                                                    {activeGroup.messages.map((m) => {
                                                        const mine = m.senderId === "you";
                                                        return (
                                                            <div key={m.id} className={`flex flex-col gap-0.5 ${mine ? "items-end" : "items-start"}`}>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">{m.senderName}</span>
                                                                    <span className="text-[color:var(--t-bd1)] text-[10px]">{m.time}</span>
                                                                </div>
                                                                <div
                                                                    className={`max-w-[80%] py-2 px-3 text-xs ${mine ? "bg-[var(--t-ac)] text-[color:var(--t-onac)]" : "bg-[var(--t-bg3)] text-[color:var(--t-tx0)] border border-solid border-[color:var(--t-bd0)]"
                                                                        }`}
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
                                                        className="flex-1 min-w-0 bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-xs py-2 px-3 outline-none focus:border-[color:var(--t-ac)]"
                                                    />
                                                    {!isClassroom && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateActiveGroup((g) => ({
                                                                    ...g,
                                                                    files: [...(g.files || []), { id: `f${Date.now()}`, name: "Shared_File.pdf", uploadedBy: "You", size: "0.9 MB" }],
                                                                }))
                                                            }
                                                            className="shrink-0 bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx1)] text-xs py-2 px-3 hover:border-[color:var(--t-ac)] transition-all duration-150 active:scale-95"
                                                            aria-label="Attach a file"
                                                        >
                                                            📎
                                                        </button>
                                                    )}
                                                    <button type="submit" className="shrink-0 bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2 px-4 hover:opacity-90 transition-all duration-150 active:scale-95">
                                                        SEND
                                                    </button>
                                                </form>
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
                    isTeacher={isTeacher}
                    isAdmin={isAdmin}
                    canAddMembers={canAddMembers}
                    canCreateTask={canCreateTask}
                    tab={openPanel}
                    onTabChange={setOpenPanel}
                    tabDefs={tabDefs}
                    onClose={() => setOpenPanel(null)}
                    onNewTask={() => setShowNewTask(true)}
                    onNewMaterial={() => setShowNewMaterial(true)}
                    onAddMember={() => setShowAddMember(true)}
                    onSubmitTask={submitTask}
                    onPromote={promoteToAdmin}
                    gradeDrafts={gradeDrafts}
                    setGradeDrafts={setGradeDrafts}
                    onSaveGrade={saveGrade}
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
            {showNewTask && <NewTaskModal isClassroom={isClassroom} onClose={() => setShowNewTask(false)} onCreate={createTask} />}
            {showNewMaterial && <NewMaterialModal onClose={() => setShowNewMaterial(false)} onCreate={addMaterial} />}

            {/* Logout confirmation — same popup as the Dashboard */}
            {showLogoutConfirm && (
                <LogoutConfirmModal onConfirm={handleConfirmLogout} onCancel={() => setShowLogoutConfirm(false)} />
            )}
        </div>
    );
}
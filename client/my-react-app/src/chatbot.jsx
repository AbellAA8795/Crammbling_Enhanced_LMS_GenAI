import React, { useEffect, useRef, useState } from "react";
import Personalized from "./personalized";
import GroupCollab from "./group_collab";

/* ------------------------------------------------------------------ */
/*  Tiny inline icon set (keeps this file dependency-free)             */
/* ------------------------------------------------------------------ */
const Icon = {
    Menu: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
    ),
    Close: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
    ),
    History: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Plus: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
    ),
    Paperclip: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path
                d="M21 12.5 12.5 21a4.95 4.95 0 0 1-7-7L14 5.5a3.5 3.5 0 0 1 5 5L10.5 19a2 2 0 0 1-3-3L15 8.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    Image: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Send: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M22 2 11 13" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2 15 22l-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    Trash: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    File: (p) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
};

/* ------------------------------------------------------------------ */
/*  Nav data — pulled from the exact same asset host/ids as             */
/*  personalized.jsx's NAV_ITEMS, so the icon art is pixel-identical.   */
/* ------------------------------------------------------------------ */
const NAV_ASSET = (id) => `https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/${id}_expires_30_days.png`;

const NAV_IMG = {
    logo: NAV_ASSET("ec7p6crg"),
    dashboard: NAV_ASSET("5fuik1xz"),
    chatbot: NAV_ASSET("2ordxy0o"),
    group: NAV_ASSET("tda70phj"),
    quiz: NAV_ASSET("dni61l44"),
    personalized: NAV_ASSET("z60zmihq"),
    settings: NAV_ASSET("ojko43i5"),
    logout: NAV_ASSET("cxrmfyil"),
};

const NAV_ITEMS = [
    { key: "dashboard", label: "DASHBOARD", icon: NAV_IMG.dashboard, iconClass: "w-[18px] h-[15px]" },
    { key: "chatbot", label: "CHATBOT", icon: NAV_IMG.chatbot, iconClass: "w-[18px] h-[15px]" },
    { key: "collab", label: "GROUP COLLAB", icon: NAV_IMG.group, iconClass: "w-5 h-2.5" },
    { key: "quiz", label: "QUIZ ARENA", icon: NAV_IMG.quiz, iconClass: "w-4 h-4" },
    { key: "personalized", label: "PERSONALIZER", icon: NAV_IMG.personalized, iconClass: "w-[18px] h-[13px]" },
];

const ASSET = (id) => `https://storage.googleapis.com/tagjs-prod.appspot.com/v1/tD9ysWtmXJ/${id}_expires_30_days.png`;

/* ------------------------------------------------------------------ */
/*  Sidebar — scrollable, responsive, drives page navigation           */
/* ------------------------------------------------------------------ */
function Sidebar({ activePage, onNavigate, onCloseMobile }) {
    return (
        <div className="flex flex-col h-full bg-[#130D0B] w-64 shrink-0">
            {/* mobile close button — matches personalized's top-of-drawer close */}
            <div className="flex justify-end md:hidden px-3 pt-3">
                <button onClick={onCloseMobile} aria-label="Close menu">
                    <Icon.Close className="w-4 h-4 text-[#BBC9C9]" />
                </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                {/* header / brand */}
                <div className="flex items-center self-stretch bg-[#1D1715] py-[13px]">
                    <img src={NAV_IMG.logo} className="w-9 h-9 ml-4 mr-3 object-fill" />
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
                        const active = item.key === activePage;
                        return (
                            <button
                                key={item.key}
                                onClick={() => onNavigate(item.key)}
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

            {/* footer */}
            <div className="flex flex-col self-stretch bg-[#1D1715] p-3 gap-1">
                <button className="flex items-center self-stretch py-2 text-left hover:bg-[#251E1C] transition-all duration-150 active:scale-[0.98]">
                    <img src={NAV_IMG.settings} className="w-[15px] h-[15px] mx-3 object-fill" />
                    <span className="text-[#BBC9C9] text-[11px]">SETTINGS</span>
                </button>
                <button className="flex items-center self-stretch py-2 text-left hover:bg-[#251E1C] transition-all duration-150 active:scale-[0.98]">
                    <img src={NAV_IMG.logout} className="w-3.5 h-3.5 mx-3 object-fill" />
                    <span className="text-[#BBC9C9] text-[11px]">LOGOUT</span>
                </button>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  History drawer — lists previous conversations                      */
/* ------------------------------------------------------------------ */
function HistoryDrawer({ open, conversations, activeId, onSelect, onDelete, onNewChat, onClose }) {
    return (
        <>
            {open && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
            <div
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#181210] border-r border-[#302826] z-50 flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-[#302826] shrink-0">
                    <span className="text-[#EDE0DC] text-sm font-bold">CONVERSATION LOG</span>
                    <button onClick={onClose} className="text-[#859394] hover:text-[#EDE0DC]">
                        <Icon.Close className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-3 shrink-0">
                    <button
                        onClick={onNewChat}
                        className="flex items-center justify-center w-full gap-1.5 bg-[#58F1F6] py-2.5"
                    >
                        <Icon.Plus className="w-3.5 h-3.5 text-[#003738]" />
                        <span className="text-[#003738] text-xs font-bold">NEW CHAT</span>
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-3 flex flex-col gap-1">
                    {conversations.length === 0 && (
                        <p className="text-[#859394] text-xs px-3 py-4">No saved conversations yet.</p>
                    )}
                    {conversations.map((c) => (
                        <div
                            key={c.id}
                            onClick={() => onSelect(c.id)}
                            className={`group flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer ${c.id === activeId ? "bg-[#302826]" : "hover:bg-[#211A18]"
                                }`}
                        >
                            <div className="min-w-0">
                                <p
                                    className={`text-xs font-bold truncate ${c.id === activeId ? "text-[#58F1F6]" : "text-[#EDE0DC]"
                                        }`}
                                >
                                    {c.title}
                                </p>
                                <p className="text-[#859394] text-[10px] mt-0.5">{c.timestamp}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(c.id);
                                }}
                                className="shrink-0 text-[#859394] hover:text-[#FF6B6B] opacity-0 group-hover:opacity-100"
                                aria-label="Delete conversation"
                            >
                                <Icon.Trash className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  Chat message bubble                                                 */
/* ------------------------------------------------------------------ */
function Message({ msg }) {
    const isUser = msg.role === "user";
    return (
        <div className={`flex items-start self-stretch gap-2 ${isUser ? "justify-end" : ""}`}>
            {!isUser && (
                <div className="flex shrink-0 items-start bg-[#FFFFFF00] py-2 px-1.5">
                    <img src={ASSET("fjn3452v")} className="w-[18px] h-[15px] object-fill" />
                </div>
            )}
            <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%] sm:max-w-[672px] gap-[6px]`}>
                <span className={`text-[10px] font-bold px-1 ${isUser ? "text-[#859394]" : "text-[#58F1F6]"}`}>
                    {isUser ? "YOU • PLAYER LVL 18" : "ALLAY • ACTIVE RECALL ORB"}
                </span>

                {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-end">
                        {msg.attachments.map((a, i) =>
                            a.previewUrl ? (
                                <img key={i} src={a.previewUrl} className="w-20 h-20 object-cover rounded-sm border border-[#302826]" />
                            ) : (
                                <div key={i} className="flex items-center gap-1.5 bg-[#130D0B] px-3 py-2 border border-[#302826]">
                                    <Icon.File className="w-3.5 h-3.5 text-[#859394]" />
                                    <span className="text-[#EDE0DC] text-[10px] font-bold">{a.name}</span>
                                </div>
                            )
                        )}
                    </div>
                )}

                {msg.text && (
                    <div
                        className={`py-4 px-5 ${isUser ? "bg-[#211A18]" : "bg-[#130D0B]"}`}
                        style={{ boxShadow: "0px 8px 10px #0000001A" }}
                    >
                        <span className="text-[#EDE0DC] text-[15px] whitespace-pre-wrap">{msg.text}</span>
                    </div>
                )}
            </div>
            {isUser && <img src={ASSET("a9vqvbh6")} className="w-8 h-8 shrink-0 object-fill" />}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main chatbot page                                                   */
/* ------------------------------------------------------------------ */
const SEED_MESSAGES = [
    { role: "user", text: "How does DFS detect cycles in a directed graph?" },
    {
        role: "assistant",
        text: "Encountering a node currently active in your recursion stack (BACK-EDGE) confirms a directed cycle.\n\nDFS uses recursive backtracking and 3-color visited marking — O(V + E). Kahn's BFS approach tracks in-degrees; if the processed count doesn't equal V, a cycle exists — also O(V + E).",
    },
];

function makeConversation(title, seed = []) {
    return {
        id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title,
        timestamp: new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        messages: seed,
    };
}

export default function Chatbot({ onNavigate } = {}) {
    const [page, setPage] = useState("chatbot"); // "chatbot" | "personalized"
    const [fallbackPage, setFallbackPage] = useState(null); // "personalized" | "group" | null — used only when no onNavigate prop is passed
    const [conversations, setConversations] = useState(() => [
        makeConversation("DFS cycle detection in graphs", SEED_MESSAGES),
    ]);
    const [activeId, setActiveId] = useState(() => conversations[0].id);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [navCollapsed, setNavCollapsed] = useState(false); // desktop drawer: pushed to the side
    const [input, setInput] = useState("");
    const [pendingFiles, setPendingFiles] = useState([]);
    const [isThinking, setIsThinking] = useState(false);

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const scrollRef = useRef(null);

    const active = conversations.find((c) => c.id === activeId) || conversations[0];

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [active?.messages, isThinking]);

    function updateActiveMessages(updater) {
        setConversations((prev) =>
            prev.map((c) => (c.id === activeId ? { ...c, messages: updater(c.messages) } : c))
        );
    }

    function handleNewChat() {
        const fresh = makeConversation("New conversation", []);
        setConversations((prev) => [fresh, ...prev]);
        setActiveId(fresh.id);
        setDrawerOpen(false);
        setPage("chatbot");
    }

    function handleDeleteConversation(id) {
        setConversations((prev) => {
            const next = prev.filter((c) => c.id !== id);
            if (id === activeId && next.length > 0) setActiveId(next[0].id);
            if (next.length === 0) {
                const fresh = makeConversation("New conversation", []);
                setActiveId(fresh.id);
                return [fresh];
            }
            return next;
        });
    }

    function handleClearChat() {
        updateActiveMessages(() => []);
    }

    function handleFiles(fileList, kind) {
        const files = Array.from(fileList || []);
        const mapped = files.map((f) => ({
            name: f.name,
            type: f.type,
            previewUrl: kind === "image" || f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
        }));
        setPendingFiles((prev) => [...prev, ...mapped]);
    }

    function simulateAssistantReply(userText) {
        setIsThinking(true);
        // NOTE: replace this with a real call to your AI backend / API.
        setTimeout(() => {
            updateActiveMessages((msgs) => [
                ...msgs,
                {
                    role: "assistant",
                    text: `Here's a starting point on "${userText.slice(0, 60)}${userText.length > 60 ? "…" : ""
                        }" — reply coming soon with more details and references.`,
                },
            ]);
            setIsThinking(false);
        }, 700);
    }

    function handleSend() {
        const trimmed = input.trim();
        if (!trimmed && pendingFiles.length === 0) return;

        // first message in an empty/untitled conversation becomes its title
        setConversations((prev) =>
            prev.map((c) =>
                c.id === activeId && c.messages.length === 0 && trimmed
                    ? { ...c, title: trimmed.slice(0, 40), messages: [...c.messages] }
                    : c
            )
        );

        updateActiveMessages((msgs) => [
            ...msgs,
            { role: "user", text: trimmed, attachments: pendingFiles },
        ]);
        setInput("");
        setPendingFiles([]);
        simulateAssistantReply(trimmed || "shared attachment(s)");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        } else if (e.key === "Escape") {
            setInput("");
        }
    }

    function handleQuickAction(label) {
        setInput(label);
    }

    function handleNavigate(key) {
        if (key === "chatbot") return;
        if (onNavigate) {
            onNavigate(key);
        } else {
            setFallbackPage(key); // "personalized" | "group"
        }
        setMobileNavOpen(false);
    }

    if (!onNavigate && fallbackPage === "personalized") {
        return <Personalized onNavigateToChatbot={() => setFallbackPage(null)} onNavigateToGroup={() => setFallbackPage("group")} />;
    }
    if (!onNavigate && fallbackPage === "group") {
        return <GroupCollab onNavigate={(key) => setFallbackPage(key === "group" ? null : key)} />;
    }

    if (page === "personalized") {
        // Renders the existing PERSONALIZED page. If you'd like a way back to
        // the chatbot from there too, add the same onNavigate wiring to its
        // own "CHATBOT" nav item.
        return <Personalized onBackToChatbot={() => setPage("chatbot")} />;
    }

    return (
        <div className="flex h-screen w-full bg-[#181210] overflow-hidden">
            {/* desktop sidebar — collapsible drawer */}
            <div
                className="hidden md:flex h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-out"
                style={{ width: navCollapsed ? 0 : 256 }}
            >
                <Sidebar activePage="chatbot" onNavigate={handleNavigate} onCloseMobile={() => { }} />
            </div>

            {/* Desktop drawer handle — pushes the navigation bar to the side and back */}
            <button
                onClick={() => setNavCollapsed((v) => !v)}
                aria-label={navCollapsed ? "Open navigation bar" : "Push navigation bar aside"}
                title={navCollapsed ? "Open navigation" : "Push navigation aside"}
                className="hidden md:flex fixed top-1/2 -translate-y-1/2 z-30 w-5 h-16 items-center justify-center bg-[#251E1C] border border-solid border-[#3F3735] border-l-0 text-[#2CD4D9] hover:bg-[#2CD4D9] hover:text-[#003738] hover:shadow-[0_0_14px_#2CD4D966] transition-all duration-300 active:scale-95"
                style={{ left: navCollapsed ? 0 : 256 }}
            >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: navCollapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s" }}>
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* mobile sidebar overlay */}
            {mobileNavOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <Sidebar activePage="chatbot" onNavigate={handleNavigate} onCloseMobile={() => setMobileNavOpen(false)} />
                    <div className="flex-1 bg-black/50" onClick={() => setMobileNavOpen(false)} />
                </div>
            )}

            <HistoryDrawer
                open={drawerOpen}
                conversations={conversations}
                activeId={activeId}
                onSelect={(id) => {
                    setActiveId(id);
                    setDrawerOpen(false);
                }}
                onDelete={handleDeleteConversation}
                onNewChat={handleNewChat}
                onClose={() => setDrawerOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 bg-[#181210]">
                {/* top bar */}
                <div className="flex flex-wrap justify-between items-center gap-3 bg-[#211A18F0] py-3 px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            className={`text-[#EDE0DC] ${navCollapsed ? "" : "md:hidden"}`}
                            onClick={() => {
                                setNavCollapsed(false);
                                setMobileNavOpen(true);
                            }}
                            aria-label="Open menu"
                        >
                            <Icon.Menu className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-1.5 bg-[#130D0B] py-1.5 px-3"
                            style={{ boxShadow: "0px 1px 2px #0000000D" }}
                        >
                            <Icon.History className="w-3.5 h-3.5 text-[#58F1F6]" />
                            <span className="text-[#58F1F6] text-[10px] font-bold hidden sm:inline">HISTORY</span>
                        </button>
                        <button
                            onClick={handleNewChat}
                            className="flex items-center gap-1.5 bg-[#302826] py-1.5 px-3"
                        >
                            <Icon.Plus className="w-3.5 h-3.5 text-[#EDE0DC]" />
                            <span className="text-[#EDE0DC] text-[10px] font-bold hidden sm:inline">NEW CHAT</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-[#130D0B] py-1 px-[15px] gap-1">
                            <img src={ASSET("9a7i2gtu")} className="w-3 h-3.5 object-fill" />
                            <span className="text-[#FEDA44] text-[10px] font-bold">14 STREAK</span>
                        </div>
                        <div className="flex items-center bg-[#130D0B] py-1 px-[15px] gap-1">
                            <img src={ASSET("8kq93tyy")} className="w-[15px] h-[13px] object-fill" />
                            <span className="text-[#58F1F6] text-[10px] font-bold">3,420 XP</span>
                        </div>
                        <img src={ASSET("culn7maw")} className="w-[31px] h-8 rounded-full object-fill" />
                    </div>
                </div>

                {/* chat header strip */}
                <div className="flex flex-wrap justify-between items-center gap-2 px-4 sm:px-8 py-3 border-b border-[#211A18]">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#130D0B] py-1 px-4 gap-2">
                            <img src={ASSET("wtp1mt7q")} className="w-6 h-6 object-fill" />
                            <span className="text-[#58F1F6] text-base font-bold">ALLAY TUTOR</span>
                            <span className="text-[#859394] text-[10px] font-bold">/</span>
                            <span className="text-[#FEDA44] text-[10px] font-bold">SOCRATIC MODE</span>
                        </div>
                    </div>
                    <button
                        onClick={handleClearChat}
                        className="flex items-center bg-[#302826] py-1 px-[15px] gap-1"
                        style={{ boxShadow: "0px 1px 2px #0000000D" }}
                    >
                        <Icon.Trash className="w-3 h-3 text-[#BBC9C9]" />
                        <span className="text-[#BBC9C9] text-[10px] font-bold">CLEAR CHAT</span>
                    </button>
                </div>

                {/* messages */}
                <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-6">
                    <div className="flex flex-col gap-6 max-w-[900px] mx-auto">
                        {active.messages.length === 0 && (
                            <div className="text-center text-[#859394] text-xs py-16">
                                Ask Allay anything from your lecture slides to start this conversation.
                            </div>
                        )}
                        {active.messages.map((m, i) => (
                            <Message key={i} msg={m} />
                        ))}

                        {active.messages.length > 0 && (
                            <div className="flex items-start self-stretch pt-1 gap-[9px] flex-wrap">
                                <button
                                    onClick={() => handleQuickAction("Give me practice questions on this topic")}
                                    className="flex items-center bg-[#58F1F6] py-2 px-4 gap-1"
                                >
                                    <img src={ASSET("qj6m3auq")} className="w-[15px] h-[15px] object-fill" />
                                    <span className="text-[#193800] text-[10px] font-bold">PRACTICE IN QUIZ ARENA</span>
                                </button>
                                <button
                                    onClick={() => handleQuickAction("Explain this with a diagram")}
                                    className="flex items-center bg-[#302826] py-2 px-[15px] gap-1"
                                >
                                    <img src={ASSET("awaayiyv")} className="w-[15px] h-[13px] object-fill" />
                                    <span className="text-[#EDE0DC] text-[10px] font-bold">EXPLAIN WITH DIAGRAM</span>
                                </button>
                                <button
                                    onClick={() => handleQuickAction("Give me a summary cheat sheet")}
                                    className="flex items-center bg-[#302826] py-2 px-[15px] gap-1"
                                >
                                    <img src={ASSET("msnkrwft")} className="w-[13px] h-[9px] object-fill" />
                                    <span className="text-[#EDE0DC] text-[10px] font-bold">SUMMARY CHEAT SHEET</span>
                                </button>
                            </div>
                        )}

                        {isThinking && <p className="text-[#58F1F6] text-[10px] font-bold px-1">ALLAY IS THINKING…</p>}
                    </div>
                </div>

                {/* composer */}
                <div className="px-4 sm:px-8 pb-4 sm:pb-6 pt-2">
                    <div className="max-w-[900px] mx-auto">
                        {pendingFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {pendingFiles.map((f, i) => (
                                    <div key={i} className="relative flex items-center gap-1.5 bg-[#130D0B] px-2 py-1.5 border border-[#302826]">
                                        {f.previewUrl ? (
                                            <img src={f.previewUrl} className="w-6 h-6 object-cover" />
                                        ) : (
                                            <Icon.File className="w-3.5 h-3.5 text-[#859394]" />
                                        )}
                                        <span className="text-[#EDE0DC] text-[10px] font-bold max-w-[120px] truncate">{f.name}</span>
                                        <button
                                            onClick={() => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                            className="text-[#859394] hover:text-[#FF6B6B]"
                                        >
                                            <Icon.Close className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-end bg-[#130D0B] p-2" style={{ boxShadow: "0px 25px 50px #00000040" }}>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="shrink-0 p-2 text-[#859394] hover:text-[#58F1F6]"
                                aria-label="Attach file"
                            >
                                <Icon.Paperclip className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => imageInputRef.current?.click()}
                                className="shrink-0 p-2 text-[#859394] hover:text-[#58F1F6]"
                                aria-label="Attach image"
                            >
                                <Icon.Image className="w-4 h-4" />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    handleFiles(e.target.files, "file");
                                    e.target.value = "";
                                }}
                            />
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    handleFiles(e.target.files, "image");
                                    e.target.value = "";
                                }}
                            />

                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder="Ask Allay anything from your lecture slides..."
                                className="flex-1 bg-transparent resize-none outline-none text-[#EDE0DC] text-xs font-bold placeholder-[#859394] py-2.5 px-2 max-h-32"
                            />

                            <button
                                onClick={handleSend}
                                className="shrink-0 flex items-center bg-[#58F1F6] py-3 px-[18px] gap-1.5"
                                style={{ boxShadow: "0px 2px 4px #0000001A" }}
                            >
                                <span className="text-[#003738] text-xs font-bold">SEND</span>
                                <Icon.Send className="w-3.5 h-3 text-[#003738]" />
                            </button>
                        </div>
                        <div className="flex flex-wrap justify-between items-center gap-1 py-1.5 px-2">
                            <div className="flex items-center gap-1">
                                <div className="bg-[#58F1F6] w-1.5 h-1.5" />
                                <span className="text-[#859394] text-[10px] font-bold">VOXEL PARSER ACTIVE</span>
                            </div>
                            <div className="flex items-center gap-[15px]">
                                <span className="text-[#859394] text-[10px] font-bold hidden sm:inline">
                                    PRESS [ENTER] TO DISPATCH
                                </span>
                                <span className="text-[#859394] text-[10px] font-bold hidden sm:inline">[ESC] TO RESET QUERY</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
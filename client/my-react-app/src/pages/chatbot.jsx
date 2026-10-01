import React, { useEffect, useRef, useState } from "react";
import Dashboard from "./Dashboard";
import Personalized from "./personalized";
import GroupCollab from "./group_collab";
import { ThemePicker, useTheme, CloseIcon } from "./Theme";
import { useNavigate } from "react-router-dom";
import { listChats, getChatMessages, uploadChatFile } from "../api/chat";
import { streamChatMessage } from "../api/chatStream";



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
    { key: "group", label: "GROUP COLLAB", icon: NAV_IMG.group, iconClass: "w-5 h-2.5" },
    { key: "quiz", label: "QUIZ ARENA", icon: NAV_IMG.quiz, iconClass: "w-4 h-4" },
    { key: "personalized", label: "PERSONALIZER", icon: NAV_IMG.personalized, iconClass: "w-[18px] h-[13px]" },
];

const ASSET = (id) => `https://storage.googleapis.com/tagjs-prod.appspot.com/v1/tD9ysWtmXJ/${id}_expires_30_days.png`;

/* ------------------------------------------------------------------ */
/*  Sidebar — scrollable, responsive, drives page navigation           */
/* ------------------------------------------------------------------ */
function Sidebar({ activePage, onNavigate, onCloseMobile, onOpenSettings }) {
    return (
        <div style={{ backgroundImage: "var(--t-grad-side)" }} className="flex flex-col h-full bg-[var(--t-bg0)] w-64 shrink-0">
            {/* mobile close button — matches personalized's top-of-drawer close */}
            <div className="flex justify-end md:hidden px-3 pt-3">
                <button onClick={onCloseMobile} aria-label="Close menu">
                    <Icon.Close className="w-4 h-4 text-[color:var(--t-tx1)]" />
                </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                {/* header / brand */}
                <div className="flex items-center self-stretch bg-[color-mix(in_srgb,_var(--t-bg2)_45%,_transparent)] py-[13px]">
                    <img src={NAV_IMG.logo} className="w-9 h-9 ml-4 mr-3 object-fill" />
                    <div className="w-[127px]">
                        <div
                            className="flex flex-col items-start self-stretch"
                            style={{ boxShadow: "0px 2px 4px color-mix(in srgb, var(--t-ac) 30%, transparent)" }}
                        >
                            <span className="text-[color:var(--t-ac)] text-[17px] font-bold">CRAMMBLING</span>
                        </div>
                        <div className="flex items-center self-stretch pt-1 gap-1">
                            <div className="bg-[var(--t-ok)] w-1.5 h-1.5" />
                            <span className="text-[color:var(--t-warn)] text-[10px] font-bold">VOXEL QUEST Lv.18</span>
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

            {/* footer */}
            <div className="flex flex-col self-stretch bg-[color-mix(in_srgb,_var(--t-bg2)_45%,_transparent)] p-3 gap-1">
                <button onClick={onOpenSettings} className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]">
                    <img src={NAV_IMG.settings} className="w-[15px] h-[15px] mx-3 object-fill" />
                    <span className="text-[color:var(--t-tx1)] text-[11px]">SETTINGS</span>
                </button>
                <button className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]">
                    <img src={NAV_IMG.logout} className="w-3.5 h-3.5 mx-3 object-fill" />
                    <span className="text-[color:var(--t-tx1)] text-[11px]">LOGOUT</span>
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
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[var(--t-bg1)] border-r border-[color:var(--t-bg4)] z-50 flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-[color:var(--t-bg4)] shrink-0">
                    <span className="text-[color:var(--t-tx0)] text-sm font-bold">CONVERSATION LOG</span>
                    <button onClick={onClose} className="text-[color:var(--t-tx2)] hover:text-[color:var(--t-tx0)]">
                        <Icon.Close className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-3 shrink-0">
                    <button
                        onClick={onNewChat}
                        className="flex items-center justify-center w-full gap-1.5 bg-[var(--t-ac2)] py-2.5"
                    >
                        <Icon.Plus className="w-3.5 h-3.5 text-[color:var(--t-onac)]" />
                        <span className="text-[color:var(--t-onac)] text-xs font-bold">NEW CHAT</span>
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-3 flex flex-col gap-1">
                    {conversations.length === 0 && (
                        <p className="text-[color:var(--t-tx2)] text-xs px-3 py-4">No saved conversations yet.</p>
                    )}
                    {conversations.map((c) => (
                        <div
                            key={c.id}
                            onClick={() => onSelect(c.id)}
                            className={`group flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer ${c.id === activeId ? "bg-[var(--t-bg4)]" : "hover:bg-[var(--t-bg2)]"
                                }`}
                        >
                            <div className="min-w-0">
                                <p
                                    className={`text-xs font-bold truncate ${c.id === activeId ? "text-[color:var(--t-ac2)]" : "text-[color:var(--t-tx0)]"
                                        }`}
                                >
                                    {c.title}
                                </p>
                                <p className="text-[color:var(--t-tx2)] text-[10px] mt-0.5">{c.timestamp}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(c.id);
                                }}
                                className="shrink-0 text-[color:var(--t-tx2)] hover:text-[color:var(--t-err)] opacity-0 group-hover:opacity-100"
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
                <span className={`text-[10px] font-bold px-1 ${isUser ? "text-[color:var(--t-tx2)]" : "text-[color:var(--t-ac2)]"}`}>
                    {isUser ? "YOU • PLAYER LVL 18" : "ALLAY • ACTIVE RECALL ORB"}
                </span>

                {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-end">
                        {msg.attachments.map((a, i) =>
                            a.previewUrl ? (
                                <img key={i} src={a.previewUrl} className="w-20 h-20 object-cover rounded-sm border border-[color:var(--t-bg4)]" />
                            ) : (
                                <div key={i} className="flex items-center gap-1.5 bg-[var(--t-bg0)] px-3 py-2 border border-[color:var(--t-bg4)]">
                                    <Icon.File className="w-3.5 h-3.5 text-[color:var(--t-tx2)]" />
                                    <span className="text-[color:var(--t-tx0)] text-[10px] font-bold">{a.name}</span>
                                </div>
                            )
                        )}
                    </div>
                )}

                {msg.text && (
                    <div
                        className={`py-4 px-5 ${isUser ? "bg-[var(--t-bg2)]" : "bg-[var(--t-bg0)]"}`}
                        style={{ boxShadow: "0px 8px 10px #0000001A" }}
                    >
                        <span className="text-[color:var(--t-tx0)] text-[15px] whitespace-pre-wrap">{msg.text}</span>
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
    function formatTimestamp(isoString) {
    return new Date(isoString).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function makeDraftConversation() {
    return {
        id: `draft_${Date.now()}`,
        backendId: null,
        title: "New conversation",
        timestamp: formatTimestamp(new Date().toISOString()),
        messages: [],
        messagesLoaded: true,
    };
}

export default function Chatbot({ onNavigate } = {}) {
    const navigate = useNavigate();
    const [theme, setTheme, rootThemeStyle] = useTheme();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [page, setPage] = useState("chatbot");
    const [fallbackPage, setFallbackPage] = useState(null);
    const [conversations, setConversations] = useState([makeDraftConversation()]);
    const [activeId, setActiveId] = useState(() => conversations[0].id);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [navCollapsed, setNavCollapsed] = useState(false);
    const [input, setInput] = useState("");
    const [pendingFiles, setPendingFiles] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [queuePosition, setQueuePosition] = useState(null);
    const [sendError, setSendError] = useState("");

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const scrollRef = useRef(null);

    const active = conversations.find((c) => c.id === activeId) || conversations[0];

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [active?.messages, isThinking]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        loadChatList();
    }, []);

    async function loadChatList() {
        try {
            const data = await listChats();
            const loaded = data.data.map((c) => ({
                id: String(c.chat_id),
                backendId: c.chat_id,
                title: c.title,
                timestamp: formatTimestamp(c.updated_at),
                messages: [],
                messagesLoaded: false,
            }));
            setConversations((prev) => {
                const draft = prev.find((c) => c.backendId === null);
                return draft ? [draft, ...loaded] : loaded.length ? loaded : [makeDraftConversation()];
            });
        } catch (err) {
            console.error("Failed to load chats:", err.message);
        }
    }

    function updateActiveMessages(updater) {
        setConversations((prev) =>
            prev.map((c) => (c.id === activeId ? { ...c, messages: updater(c.messages) } : c))
        );
    }

    async function handleSelectConversation(id) {
        setActiveId(id);
        setDrawerOpen(false);

        const convo = conversations.find((c) => c.id === id);
        if (!convo || convo.messagesLoaded || convo.backendId === null) return;

        try {
            const data = await getChatMessages(convo.backendId);
            const messages = data.data.map((m) => ({ role: m.role, text: m.content }));
            setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, messages, messagesLoaded: true } : c))
            );
        } catch (err) {
            console.error("Failed to load chat history:", err.message);
        }
    }

    function handleNewChat() {
        const fresh = makeDraftConversation();
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
                const fresh = makeDraftConversation();
                setActiveId(fresh.id);
                return [fresh];
            }
            return next;
        });
    }

    function handleClearChat() {
        updateActiveMessages(() => []);
    }

    function handleFiles(fileList) {
        const files = Array.from(fileList || []);
        const mapped = files.map((f) => ({
            file: f,
            name: f.name,
            type: f.type,
            previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
        }));
        setPendingFiles((prev) => [...prev, ...mapped]);
    }

    async function handleSend() {
        const trimmed = input.trim();
        if (!trimmed && pendingFiles.length === 0) return;
        if (isThinking) return;

        setSendError("");
        setInput("");
        const filesToSend = pendingFiles;
        setPendingFiles([]);

        updateActiveMessages((msgs) => [
            ...msgs,
            {
                role: "user",
                text: trimmed,
                attachments: filesToSend.map((f) => ({ name: f.name, previewUrl: f.previewUrl })),
            },
        ]);

        let chatId = active.backendId;
        setIsThinking(true);

        try {
            if (filesToSend.length > 0 && !chatId) {
                chatId = await createChatFromFirstMessage(trimmed || "Shared attachment(s)");
            }

            if (filesToSend.length > 0) {
                for (let i = 0; i < filesToSend.length; i++) {
                    const caption = i === 0 ? trimmed || undefined : undefined;
                    await uploadChatFile(chatId, filesToSend[i].file, caption);
                }
                const data = await getChatMessages(chatId);
                updateActiveMessages(() => data.data.map((m) => ({ role: m.role, text: m.content })));
            } else {
                updateActiveMessages((msgs) => [...msgs, { role: "assistant", text: "" }]);

                await streamChatMessage(chatId, trimmed, {
                    onStart: (data) => {
                        if (data.chatId && !chatId) {
                            chatId = data.chatId;
                            setConversations((prev) =>
                                prev.map((c) =>
                                    c.id === activeId
                                        ? { ...c, id: String(data.chatId), backendId: data.chatId, title: data.title }
                                        : c
                                )
                            );
                            setActiveId(String(data.chatId));
                        }
                    },
                    onQueued: (position) => setQueuePosition(position),
                    onChunk: (chunk) => {
                        setQueuePosition(null);
                        setConversations((prev) =>
                            prev.map((c) => {
                                const targetId = chatId ? String(chatId) : c.id;
                                if (c.id !== targetId && c.id !== activeId) return c;
                                const msgs = [...c.messages];
                                const lastIdx = msgs.length - 1;
                                msgs[lastIdx] = { ...msgs[lastIdx], text: (msgs[lastIdx].text || "") + chunk };
                                return { ...c, messages: msgs };
                            })
                        );
                    },
                    onDone: () => {
                        setQueuePosition(null);
                        loadChatList();
                    },
                    onError: (message) => setSendError(message),
                });
            }
        } catch (err) {
            setSendError(err.message || "Something went wrong sending your message.");
        } finally {
            setIsThinking(false);
        }
    }

    async function createChatFromFirstMessage(message) {
        let newChatId = null;
        await streamChatMessage(null, message, {
            onStart: (data) => { newChatId = data.chatId; },
            onChunk: () => {},
            onDone: () => {},
            onError: (msg) => { throw new Error(msg); },
        });
        setConversations((prev) =>
            prev.map((c) =>
                c.id === activeId ? { ...c, id: String(newChatId), backendId: newChatId } : c
            )
        );
        setActiveId(String(newChatId));
        return newChatId;
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
            setFallbackPage(key);
        }
        setMobileNavOpen(false);
    }

    if (!onNavigate && fallbackPage === "dashboard") {
        return <Dashboard />;
    }
    if (!onNavigate && fallbackPage === "personalized") {
        return <Personalized onNavigateToChatbot={() => setFallbackPage(null)} onNavigateToGroup={() => setFallbackPage("group")} onNavigateToDashboard={() => setFallbackPage("dashboard")} />;
    }
    if (!onNavigate && fallbackPage === "group") {
        return <GroupCollab onNavigate={(key) => setFallbackPage(key === "group" ? null : key)} />;
    }

    if (page === "dashboard") {
        return <Dashboard />;
    }

    if (page === "group") {
        return <GroupCollab onNavigate={(key) => setPage(key === "group" ? "group" : key)} />;
    }

    if (page === "personalized") {
        return (
            <Personalized
                onBackToChatbot={() => setPage("chatbot")}
                onNavigateToChatbot={() => setPage("chatbot")}
                onNavigateToGroup={() => setPage("group")}
                onNavigateToDashboard={() => setPage("dashboard")}
            />
        );
    }

    return (
        <div style={rootThemeStyle} className="flex h-screen w-full bg-[var(--t-bg1)] overflow-hidden">
            {/* desktop sidebar — collapsible drawer */}
            <div
                className="hidden md:flex h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-out"
                style={{ width: navCollapsed ? 0 : 256 }}
            >
                <Sidebar activePage="chatbot" onNavigate={handleNavigate} onCloseMobile={() => { }} onOpenSettings={() => setSettingsOpen(true)} />
            </div>

            {/* Desktop drawer handle — pushes the navigation bar to the side and back */}
            <button
                onClick={() => setNavCollapsed((v) => !v)}
                aria-label={navCollapsed ? "Open navigation bar" : "Push navigation bar aside"}
                title={navCollapsed ? "Open navigation" : "Push navigation aside"}
                className="hidden md:flex fixed top-1/2 -translate-y-1/2 z-30 w-5 h-16 items-center justify-center bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] border-l-0 text-[color:var(--t-ac)] hover:bg-[var(--t-ac)] hover:text-[color:var(--t-onac)] hover:shadow-[0_0_14px_color-mix(in srgb, var(--t-ac) 40%, transparent)] transition-all duration-300 active:scale-95"
                style={{ left: navCollapsed ? 0 : 256 }}
            >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: navCollapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s" }}>
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* mobile sidebar overlay */}
            {mobileNavOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <Sidebar activePage="chatbot" onNavigate={handleNavigate} onCloseMobile={() => setMobileNavOpen(false)} onOpenSettings={() => { setMobileNavOpen(false); setSettingsOpen(true); }} />
                    <div className="flex-1 bg-black/50" onClick={() => setMobileNavOpen(false)} />
                </div>
            )}

            {/* Settings drawer — same design as personalized.jsx / group_collab.jsx */}
            {settingsOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    <div className="flex-1 bg-black/60" onClick={() => setSettingsOpen(false)} />
                    <div className="w-full max-w-xs overflow-y-auto bg-[var(--t-bg2)] border-l border-solid border-[color:var(--t-bd0)] p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[color:var(--t-tx0)] text-sm font-bold">SETTINGS</span>
                            <button onClick={() => setSettingsOpen(false)} aria-label="Close settings">
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <ThemePicker theme={theme} onChange={setTheme} />
                    </div>
                </div>
            )}

            <HistoryDrawer
                open={drawerOpen}
                conversations={conversations}
                activeId={activeId}
                onSelect={handleSelectConversation}
                onDelete={handleDeleteConversation}
                onNewChat={handleNewChat}
                onClose={() => setDrawerOpen(false)}
            />

            <div style={{ backgroundImage: "var(--t-grad-main)" }} className="flex-1 flex flex-col min-w-0 bg-[var(--t-bg1)]">
                {/* top bar */}
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
                            <Icon.Menu className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-1.5 bg-[var(--t-bg0)] py-1.5 px-3"
                            style={{ boxShadow: "0px 1px 2px #0000000D" }}
                        >
                            <Icon.History className="w-3.5 h-3.5 text-[color:var(--t-ac2)]" />
                            <span className="text-[color:var(--t-ac2)] text-[10px] font-bold hidden sm:inline">HISTORY</span>
                        </button>
                        <button
                            onClick={handleNewChat}
                            className="flex items-center gap-1.5 bg-[var(--t-bg4)] py-1.5 px-3"
                        >
                            <Icon.Plus className="w-3.5 h-3.5 text-[color:var(--t-tx0)]" />
                            <span className="text-[color:var(--t-tx0)] text-[10px] font-bold hidden sm:inline">NEW CHAT</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-[var(--t-bg0)] py-1 px-[15px] gap-1">
                            <img src={ASSET("9a7i2gtu")} className="w-3 h-3.5 object-fill" />
                            <span className="text-[color:var(--t-warn)] text-[10px] font-bold">14 STREAK</span>
                        </div>
                        <div className="flex items-center bg-[var(--t-bg0)] py-1 px-[15px] gap-1">
                            <img src={ASSET("8kq93tyy")} className="w-[15px] h-[13px] object-fill" />
                            <span className="text-[color:var(--t-ac2)] text-[10px] font-bold">3,420 XP</span>
                        </div>
                        <img src={ASSET("culn7maw")} className="w-[31px] h-8 rounded-full object-fill" />
                    </div>
                </div>

                {/* chat header strip */}
                <div className="flex flex-wrap justify-between items-center gap-2 px-4 sm:px-8 py-3 border-b border-[color:var(--t-bg2)]">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[var(--t-bg0)] py-1 px-4 gap-2">
                            <img src={ASSET("wtp1mt7q")} className="w-6 h-6 object-fill" />
                            <span className="text-[color:var(--t-ac2)] text-base font-bold">ALLAY TUTOR</span>
                            <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">/</span>
                            <span className="text-[color:var(--t-warn)] text-[10px] font-bold">SOCRATIC MODE</span>
                        </div>
                    </div>
                    <button
                        onClick={handleClearChat}
                        className="flex items-center bg-[var(--t-bg4)] py-1 px-[15px] gap-1"
                        style={{ boxShadow: "0px 1px 2px #0000000D" }}
                    >
                        <Icon.Trash className="w-3 h-3 text-[color:var(--t-tx1)]" />
                        <span className="text-[color:var(--t-tx1)] text-[10px] font-bold">CLEAR CHAT</span>
                    </button>
                </div>

                {/* messages */}
                <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-6">
                    <div className="flex flex-col gap-6 max-w-[900px] mx-auto">
                        {active.messages.length === 0 && (
                            <div className="text-center text-[color:var(--t-tx2)] text-xs py-16">
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
                                    className="flex items-center bg-[var(--t-ac2)] py-2 px-4 gap-1"
                                >
                                    <img src={ASSET("qj6m3auq")} className="w-[15px] h-[15px] object-fill" />
                                    <span className="text-[color:var(--t-onac)] text-[10px] font-bold">PRACTICE IN QUIZ ARENA</span>
                                </button>
                                <button
                                    onClick={() => handleQuickAction("Explain this with a diagram")}
                                    className="flex items-center bg-[var(--t-bg4)] py-2 px-[15px] gap-1"
                                >
                                    <img src={ASSET("awaayiyv")} className="w-[15px] h-[13px] object-fill" />
                                    <span className="text-[color:var(--t-tx0)] text-[10px] font-bold">EXPLAIN WITH DIAGRAM</span>
                                </button>
                                <button
                                    onClick={() => handleQuickAction("Give me a summary cheat sheet")}
                                    className="flex items-center bg-[var(--t-bg4)] py-2 px-[15px] gap-1"
                                >
                                    <img src={ASSET("msnkrwft")} className="w-[13px] h-[9px] object-fill" />
                                    <span className="text-[color:var(--t-tx0)] text-[10px] font-bold">SUMMARY CHEAT SHEET</span>
                                </button>
                            </div>
                        )}

                        {isThinking && <p className="text-[color:var(--t-ac2)] text-[10px] font-bold px-1">ALLAY IS THINKING…</p>}
                    </div>
                </div>

                {/* composer */}
                <div className="px-4 sm:px-8 pb-4 sm:pb-6 pt-2">
                    <div className="max-w-[900px] mx-auto">
                        {sendError && <p className="text-[color:var(--t-err)] text-[11px] px-2 pb-1">{sendError}</p>}
                            {queuePosition !== null && (
                                <p className="text-[color:var(--t-tx2)] text-[11px] px-2 pb-1">Waiting in queue (position {queuePosition})...</p>
                            )}
                        {pendingFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                                {pendingFiles.map((f, i) => (
                                    <div key={i} className="relative flex items-center gap-1.5 bg-[var(--t-bg0)] px-2 py-1.5 border border-[color:var(--t-bg4)]">
                                        {f.previewUrl ? (
                                            <img src={f.previewUrl} className="w-6 h-6 object-cover" />
                                        ) : (
                                            <Icon.File className="w-3.5 h-3.5 text-[color:var(--t-tx2)]" />
                                        )}
                                        <span className="text-[color:var(--t-tx0)] text-[10px] font-bold max-w-[120px] truncate">{f.name}</span>
                                        <button
                                            onClick={() => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                            className="text-[color:var(--t-tx2)] hover:text-[color:var(--t-err)]"
                                        >
                                            <Icon.Close className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-end bg-[var(--t-bg0)] p-2" style={{ boxShadow: "0px 25px 50px #00000040" }}>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="shrink-0 p-2 text-[color:var(--t-tx2)] hover:text-[color:var(--t-ac2)]"
                                aria-label="Attach file"
                            >
                                <Icon.Paperclip className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => imageInputRef.current?.click()}
                                className="shrink-0 p-2 text-[color:var(--t-tx2)] hover:text-[color:var(--t-ac2)]"
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
                                    handleFiles(e.target.files);
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
                                    handleFiles(e.target.files);
                                    e.target.value = "";
                                }}
                            />

                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder="Ask Allay anything from your lecture slides..."
                                className="flex-1 bg-transparent resize-none outline-none text-[color:var(--t-tx0)] text-xs font-bold placeholder-[color:var(--t-tx2)] py-2.5 px-2 max-h-32"
                            />

                            <button
                                onClick={handleSend}
                                className="shrink-0 flex items-center bg-[var(--t-ac2)] py-3 px-[18px] gap-1.5"
                                style={{ boxShadow: "0px 2px 4px #0000001A" }}
                            >
                                <span className="text-[color:var(--t-onac)] text-xs font-bold">SEND</span>
                                <Icon.Send className="w-3.5 h-3 text-[color:var(--t-onac)]" />
                            </button>
                        </div>
                        <div className="flex flex-wrap justify-between items-center gap-1 py-1.5 px-2">
                            <div className="flex items-center gap-1">
                                <div className="bg-[var(--t-ac2)] w-1.5 h-1.5" />
                                <span className="text-[color:var(--t-tx2)] text-[10px] font-bold">VOXEL PARSER ACTIVE</span>
                            </div>
                            <div className="flex items-center gap-[15px]">
                                <span className="text-[color:var(--t-tx2)] text-[10px] font-bold hidden sm:inline">
                                    PRESS [ENTER] TO DISPATCH
                                </span>
                                <span className="text-[color:var(--t-tx2)] text-[10px] font-bold hidden sm:inline">[ESC] TO RESET QUERY</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


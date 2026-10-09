import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeacherTheme, ThemeToggle } from "./TeacherTheme";
import TeacherLogout from "./TeacherLogout";

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
  Send: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M22 2 11 13" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>),
  History: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Trash: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Sparkle: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" strokeLinecap="round" /></svg>),
  Megaphone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 11v2a1 1 0 0 0 1 1h3l7 5V5L7 10H4a1 1 0 0 0-1 1z" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 8a5 5 0 0 1 0 8" strokeLinecap="round" /></svg>),
  Quiz: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.1 1.2-1.1 2.2" strokeLinecap="round" /><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" /></svg>),
  Rubric: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="3" width="18" height="18" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="3" x2="9" y2="21" /></svg>),
  Attach: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M21 12.5 12.5 21a4.95 4.95 0 0 1-7-7L14 5.5a3.5 3.5 0 0 1 5 5L10.5 19a2 2 0 0 1-3-3L15 8.5" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  Image: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  File: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
};

const TEACHER = { name: "Prof. Reyes", department: "Department of Computer Science" };

function makeConversation(title, seed = []) {
  return {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title,
    timestamp: new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    messages: seed,
  };
}

const SEED_MESSAGES = [
  { role: "user", text: "How does DFS detect cycles in a directed graph?" },
  {
    role: "assistant",
    text: "Encountering a node currently active in your recursion stack (BACK-EDGE) confirms a directed cycle.\n\nDFS uses recursive backtracking and 3-color visited marking — O(V + E). Kahn's BFS approach tracks in-degrees; if the processed count doesn't equal V, a cycle exists — also O(V + E).",
  },
];

const QUICK_ACTIONS = [
  { id: "announcement", label: "Draft announcement",      prompt: "Draft a class announcement about ",            icon: Icon.Megaphone, primary: true },
  { id: "quiz",         label: "Generate quiz questions", prompt: "Generate quiz questions on the topic of ",     icon: Icon.Quiz,      primary: false },
  { id: "rubric",       label: "Build rubric",            prompt: "Create a grading rubric for an assignment on ", icon: Icon.Rubric,   primary: false },
];

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

function HistoryDrawer({ open, conversations, activeId, onSelect, onDelete, onNewChat, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: "var(--tt-bg2)", borderRight: `1px solid var(--tt-bd0)` }}
      >
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: `1px solid var(--tt-bd0)` }}>
          <span className="text-sm font-semibold" style={{ color: "var(--tt-tx0)" }}>Conversation history</span>
          <button onClick={onClose} style={{ color: "var(--tt-tx1)" }} aria-label="Close">
            <Icon.Close className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 shrink-0">
          <button onClick={onNewChat}
            className="flex items-center justify-center w-full gap-2 text-sm font-semibold py-3 rounded-xl"
            style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
            <Icon.Plus className="w-4 h-4" />
            New conversation
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-3 flex flex-col gap-1">
          {conversations.length === 0 && (
            <p className="text-xs px-3 py-4" style={{ color: "var(--tt-tx2)" }}>No saved conversations yet.</p>
          )}
          {conversations.map((c) => {
            const isActive = c.id === activeId;
            return (
              <div key={c.id}
                onClick={() => onSelect(c.id)}
                className="group flex items-center justify-between gap-2 px-4 py-3 cursor-pointer transition-colors rounded-xl"
                style={{ backgroundColor: isActive ? "var(--tt-bg3)" : "transparent" }}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate"
                    style={{ color: isActive ? "var(--tt-ac)" : "var(--tt-tx0)" }}>{c.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--tt-tx2)" }}>{c.timestamp}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--tt-tx2)" }} aria-label="Delete conversation">
                  <Icon.Trash className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-9 h-9 shrink-0 flex items-center justify-center mt-1 rounded-xl"
          style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-ac)" }}>
          <Icon.Sparkle className="w-5 h-5" />
        </div>
      )}
      <div className={`flex flex-col gap-1.5 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <span className="text-xs font-semibold tracking-wide"
          style={{ color: isUser ? "var(--tt-tx2)" : "var(--tt-ac)" }}>
          {isUser ? TEACHER.name : "ALLAY TUTOR"}
        </span>

        {msg.attachments && msg.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end">
            {msg.attachments.map((a, i) =>
              a.previewUrl ? (
                <img key={i} src={a.previewUrl} alt={a.name}
                  className="w-20 h-20 object-cover rounded-xl"
                  style={{ border: `1px solid var(--tt-bd0)` }} />
              ) : (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)`, color: "var(--tt-tx0)" }}>
                  <Icon.File className="w-4 h-4" style={{ color: "var(--tt-tx2)" }} />
                  <span className="text-xs font-medium truncate max-w-[160px]">{a.name}</span>
                </div>
              )
            )}
          </div>
        )}

        {msg.text && (
          <div className="text-[15px] whitespace-pre-wrap leading-relaxed py-4 px-5 rounded-2xl"
            style={
              isUser
                ? { backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }
                : { backgroundColor: "var(--tt-bg1)", border: `1px solid var(--tt-bd0)`, color: "var(--tt-tx0)" }
            }>
            {msg.text}
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-9 h-9 shrink-0 flex items-center justify-center mt-1 text-xs font-semibold rounded-xl"
          style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx1)" }}>
          {TEACHER.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </div>
      )}
    </div>
  );
}

export default function TeacherChatbot() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [, , teacherThemeStyle] = useTeacherTheme();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [conversations, setConversations] = useState(() => [
    makeConversation("DFS cycle detection in graphs", SEED_MESSAGES),
  ]);
  const [activeId, setActiveId] = useState(() => conversations[0].id);
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const active = conversations.find((c) => c.id === activeId) || conversations[0];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages, isThinking]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setDrawerOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleNavClick(key) {
    setMobileNavOpen(false);
    if (key === "chatbot") return;
    const item = NAV_ITEMS.find((i) => i.key === key);
    if (item) navigate(item.path);
  }

  
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
    setInput("");
    setPendingFiles([]);
    setTimeout(() => inputRef.current?.focus(), 50);
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
    setTimeout(() => {
      updateActiveMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          text: `Here's a starting point on "${userText.slice(0, 60)}${userText.length > 60 ? "…" : ""}" — reply coming soon with more details and references.`,
        },
      ]);
      setIsThinking(false);
    }, 700);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed && pendingFiles.length === 0) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId && c.messages.length === 0 && trimmed
          ? { ...c, title: trimmed.slice(0, 40) }
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
    }
  }

  function handleQuickAction(prompt) {
    setInput(prompt);
    setTimeout(() => inputRef.current?.focus(), 30);
  }

  const today = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    []
  );

  return (
    <div style={teacherThemeStyle} className="flex h-screen w-full overflow-hidden">
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar activePage="chatbot" onNavigate={handleNavClick} onCloseMobile={() => {}} onLogout={() => setShowLogoutConfirm(true)} />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar activePage="chatbot" onNavigate={handleNavClick} onCloseMobile={() => setMobileNavOpen(false)} onLogout={() => { setMobileNavOpen(false); setShowLogoutConfirm(true); }} />
          <div className="flex-1 bg-black/60" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}

      <HistoryDrawer
        open={drawerOpen}
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => { setActiveId(id); setDrawerOpen(false); }}
        onDelete={handleDeleteConversation}
        onNewChat={handleNewChat}
        onClose={() => setDrawerOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: "var(--tt-bg0)" }}>
        <div className="shrink-0 flex flex-wrap justify-between items-center gap-4 py-4 px-5 sm:px-10"
          style={{ backgroundColor: "var(--tt-bg1)", borderBottom: `1px solid var(--tt-bd0)` }}>
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden shrink-0" style={{ color: "var(--tt-tx1)" }}
              onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
              <Icon.Menu className="w-6 h-6" />
            </button>
            <button onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold py-2 px-4 shrink-0 rounded-lg"
              style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>
              <Icon.History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
            <button onClick={handleNewChat}
              className="flex items-center gap-2 text-sm font-semibold py-2 px-4 shrink-0 rounded-lg"
              style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>
              <Icon.Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2.5">
            <span className="hidden sm:flex text-xs" style={{ color: "var(--tt-tx2)" }}>{today}</span>
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

        <div className="shrink-0 flex flex-wrap items-center justify-between gap-4 px-5 sm:px-10 py-4"
          style={{ backgroundColor: "var(--tt-bg1)", borderBottom: `1px solid var(--tt-bd0)` }}>
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 flex items-center justify-center shrink-0 rounded-xl"
              style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-ac)" }}>
              <Icon.Sparkle className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-semibold" style={{ color: "var(--tt-ac)" }}>ALLAY TUTOR</span>
              <span className="text-sm mt-0.5" style={{ color: "var(--tt-tx2)" }}>
                Draft announcements, generate questions, build rubrics
              </span>
            </div>
          </div>

          <button onClick={handleClearChat}
            className="flex items-center gap-2 text-xs font-semibold py-1.5 px-3 rounded-lg"
            style={{ color: "var(--tt-tx1)", border: `1px solid var(--tt-bd0)` }}>
            <Icon.Trash className="w-3.5 h-3.5" />
            Clear chat
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-10 py-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            {active.messages.length === 0 && (
              <div className="text-center text-sm py-16" style={{ color: "var(--tt-tx2)" }}>
                Ask Allay anything from your lecture slides to start this conversation.
              </div>
            )}

            {active.messages.map((m, i) => (<Message key={i} msg={m} />))}

            {active.messages.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_ACTIONS.map((a) => {
                  const IconCmp = a.icon;
                  return (
                    <button key={a.id} onClick={() => handleQuickAction(a.prompt)}
                      className="flex items-center gap-2 text-xs font-semibold py-2 px-4 rounded-lg transition-colors"
                      style={a.primary
                        ? { backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }
                        : { color: "var(--tt-tx0)", border: `1px solid var(--tt-bd0)` }}>
                      <IconCmp className="w-3.5 h-3.5" />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            )}

            {isThinking && (
              <p className="text-xs font-semibold px-1" style={{ color: "var(--tt-ac)" }}>
                ALLAY IS THINKING…
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0 px-5 sm:px-10 py-5"
          style={{ backgroundColor: "var(--tt-bg1)", borderTop: `1px solid var(--tt-bd0)` }}>
          <div className="max-w-3xl mx-auto">
            {pendingFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {pendingFiles.map((f, i) => (
                  <div key={i} className="relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                    style={{ backgroundColor: "var(--tt-bg2)", border: `1px solid var(--tt-bd0)` }}>
                    {f.previewUrl ? (
                      <img src={f.previewUrl} alt={f.name} className="w-6 h-6 object-cover rounded" />
                    ) : (
                      <Icon.File className="w-4 h-4" style={{ color: "var(--tt-tx2)" }} />
                    )}
                    <span className="text-xs font-medium max-w-[140px] truncate" style={{ color: "var(--tt-tx0)" }}>{f.name}</span>
                    <button onClick={() => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      style={{ color: "var(--tt-tx2)" }} aria-label="Remove attachment">
                      <Icon.Close className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-3">
              <button onClick={() => fileInputRef.current?.click()}
                className="shrink-0 p-3 rounded-xl"
                style={{ color: "var(--tt-tx2)", border: `1px solid var(--tt-bd0)` }}
                title="Attach file" aria-label="Attach file">
                <Icon.Attach className="w-5 h-5" />
              </button>
              <button onClick={() => imageInputRef.current?.click()}
                className="shrink-0 p-3 rounded-xl"
                style={{ color: "var(--tt-tx2)", border: `1px solid var(--tt-bd0)` }}
                title="Attach image" aria-label="Attach image">
                <Icon.Image className="w-5 h-5" />
              </button>

              <input ref={fileInputRef} type="file" multiple className="hidden"
                onChange={(e) => { handleFiles(e.target.files, "file"); e.target.value = ""; }} />
              <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => { handleFiles(e.target.files, "image"); e.target.value = ""; }} />

              <textarea ref={inputRef} value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask Allay anything from your lecture slides..."
                className="flex-1 resize-none text-sm py-3 px-4 outline-none max-h-40 rounded-xl"
                style={{ backgroundColor: "var(--tt-bg3)", border: `1px solid var(--tt-bd1)`, color: "var(--tt-tx0)" }} />

              <button onClick={handleSend} disabled={!input.trim() && pendingFiles.length === 0}
                className="shrink-0 flex items-center gap-2 text-sm font-semibold py-3 px-5 disabled:opacity-40 rounded-xl"
                style={{ backgroundColor: "var(--tt-ac)", color: "var(--tt-onac)" }}>
                <span className="hidden sm:inline">Send</span>
                <Icon.Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs" style={{ color: "var(--tt-tx2)" }}>
                Press Enter to send · Shift+Enter for a new line
              </span>
            </div>
          </div>
        </div>
      </div>
      {showLogoutConfirm && (
        <TeacherLogout onClose={() => setShowLogoutConfirm(false)} />
      )}
    </div>
  );
}
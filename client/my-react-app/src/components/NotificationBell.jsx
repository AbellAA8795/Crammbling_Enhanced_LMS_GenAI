import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    listNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearNotifications,
    openNotificationStream,
} from "../api/notifications";
import { useSettings } from "./Settings";

/* ------------------------------------------------------------------ */
/*  Notification bell for every page's top bar. Reads the user's real  */
/*  notifications from the backend, shows an unread badge, updates     */
/*  live (server-sent events) and pops a short toast for new ones.      */
/* ------------------------------------------------------------------ */

// Same key chatbot.jsx reads, so "AI has responded" opens that chat.
const ACTIVE_CHAT_KEY = "crammbling-active-chat";

const TYPE_STYLE = {
    ai_response_ready: { glyph: "✦", color: "var(--t-ac)" },
    friend_request_accepted: { glyph: "⛆", color: "var(--t-ok)" },
};

function timeAgo(iso) {
    if (!iso) return "";
    const secs = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (secs < 60) return "just now";
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    if (secs < 7 * 86400) return `${Math.floor(secs / 86400)}d ago`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// List rows (snake_case) and live events (camelCase) in one shape.
function normalize(n) {
    return {
        id: n.notification_id ?? n.notificationId ?? null,
        type: n.type,
        title: n.title,
        message: n.message,
        data: typeof n.data === "string" ? safeJson(n.data) : n.data || {},
        isRead: !!n.is_read,
        createdAt: n.created_at ?? n.createdAt,
    };
}
function safeJson(s) {
    try {
        return JSON.parse(s);
    } catch {
        return {};
    }
}

export default function NotificationBell({ icon }) {
    const navigate = useNavigate();
    const [settings] = useSettings();
    // The live stream outlives renders, so read Settings through a ref to get the current values.
    const settingsRef = useRef(settings);
    settingsRef.current = settings;
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [unread, setUnread] = useState(0);
    const [status, setStatus] = useState("loading"); // loading | ready | error | signed-out
    const [toast, setToast] = useState(null);
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

    const refresh = useCallback(async () => {
        if (!localStorage.getItem("token")) {
            setStatus("signed-out");
            return;
        }
        try {
            const [list, count] = await Promise.all([listNotifications(), getUnreadCount()]);
            setItems((list.data || []).map(normalize));
            setUnread(Number(count.data?.count) || 0);
            setStatus("ready");
        } catch {
            setStatus("error");
        }
    }, []);

    // Initial load + live stream while the page is open.
    useEffect(() => {
        refresh();
        if (!token) return;
        const source = openNotificationStream(token, (event) => {
            const n = normalize(event);
            refresh(); // the server is the source of truth (ids, read state)
            const s = settingsRef.current;
            const muted = s.notifPaused || (n.type === "friend_request_accepted" && !s.friendActivity);
            if (!muted) setToast(n);
        });
        return () => source.close();
    }, [token, refresh]);

    useEffect(() => {
        if (!toast) return;
        const id = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(id);
    }, [toast]);

    useEffect(() => {
        if (!open) return;
        refresh();
        function onKey(e) {
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, refresh]);

    async function openItem(n) {
        setOpen(false);
        setToast(null);
        if (n.id && !n.isRead) {
            setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
            setUnread((c) => Math.max(0, c - 1));
            markNotificationRead(n.id).catch(() => refresh());
        }
        if (n.type === "ai_response_ready" && n.data?.chatId) {
            try {
                sessionStorage.setItem(ACTIVE_CHAT_KEY, String(n.data.chatId));
            } catch {
                /* storage unavailable — the chatbot just opens its latest state */
            }
            navigate("/chatbot");
        } else if (n.type === "friend_request_accepted") {
            navigate(n.data?.friendId ? `/profile/${n.data.friendId}` : "/profile");
        }
    }

    async function removeItem(e, n) {
        e.stopPropagation();
        setItems((prev) => prev.filter((x) => x.id !== n.id));
        if (!n.isRead) setUnread((c) => Math.max(0, c - 1));
        deleteNotification(n.id).catch(() => refresh());
    }

    async function markAll() {
        setItems((prev) => prev.map((x) => ({ ...x, isRead: true })));
        setUnread(0);
        markAllNotificationsRead().catch(() => refresh());
    }

    async function clearAll() {
        setItems([]);
        setUnread(0);
        clearNotifications().catch(() => refresh());
    }

    const badge = unread > 9 ? "9+" : unread;

    return (
        <>
            <div className="relative shrink-0">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
                    aria-expanded={open}
                    className="relative block"
                >
                    <img src={icon} alt="" className="w-8 h-8 object-fill" />
                    {unread > 0 && (
                        <span
                            className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold leading-none border border-solid border-[color:var(--t-bg0)]"
                            style={{ backgroundColor: "var(--t-err)", color: "var(--t-onerr, #fff)" }}
                        >
                            {badge}
                        </span>
                    )}
                </button>

                {open && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                        <div
                            role="dialog"
                            aria-label="Notifications"
                            className="absolute right-0 top-10 z-50 w-80 max-w-[calc(100vw-2rem)] flex flex-col bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] border-t-[3px] border-t-[color:var(--t-ac)] text-left"
                            style={{ boxShadow: "4px 4px 0px var(--t-shadow), 0 12px 32px rgba(0,0,0,0.45)" }}
                        >
                            <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-solid border-[color:var(--t-bd0)]">
                                <span className="text-[color:var(--t-tx0)] text-xs font-bold uppercase tracking-wider">
                                    Notifications
                                    {unread > 0 && <span className="ml-1.5 text-[color:var(--t-err)]">({unread})</span>}
                                </span>
                                {status === "ready" && items.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={markAll}
                                            disabled={unread === 0}
                                            className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--t-ac)] hover:underline disabled:opacity-40 disabled:no-underline"
                                        >
                                            Mark all read
                                        </button>
                                        <span className="text-[color:var(--t-bd1)]">|</span>
                                        <button type="button" onClick={clearAll} className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--t-tx2)] hover:text-[color:var(--t-err)]">
                                            Clear
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="max-h-[360px] overflow-y-auto">
                                {status === "loading" && <p className="text-[color:var(--t-tx2)] text-[11px] px-3 py-6 text-center">Loading…</p>}
                                {status === "signed-out" && <p className="text-[color:var(--t-tx2)] text-[11px] px-3 py-6 text-center">Log in to see your notifications.</p>}
                                {status === "error" && (
                                    <div className="px-3 py-5 text-center">
                                        <p className="text-[color:var(--t-tx2)] text-[11px]">Couldn&apos;t load notifications. Is the server running, or did your login expire?</p>
                                        <button type="button" onClick={refresh} className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[color:var(--t-ac)] hover:underline">
                                            Try again
                                        </button>
                                    </div>
                                )}
                                {status === "ready" && items.length === 0 && (
                                    <p className="text-[color:var(--t-tx2)] text-[11px] px-3 py-6 text-center">You&apos;re all caught up.</p>
                                )}
                                {status === "ready" &&
                                    items.map((n) => {
                                        const st = TYPE_STYLE[n.type] || { glyph: "•", color: "var(--t-tx2)" };
                                        return (
                                            <div
                                                key={n.id ?? `${n.type}-${n.createdAt}`}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => openItem(n)}
                                                onKeyDown={(e) => e.key === "Enter" && openItem(n)}
                                                className={`group flex items-start gap-2.5 px-3 py-2.5 border-b border-solid border-[color:var(--t-bd0)] last:border-b-0 cursor-pointer transition-colors hover:bg-[var(--t-bg3)] ${n.isRead ? "" : "bg-[color-mix(in_srgb,_var(--t-ac)_7%,_transparent)]"}`}
                                            >
                                                <span
                                                    className="w-7 h-7 shrink-0 flex items-center justify-center text-[13px] border border-solid"
                                                    style={{ color: st.color, borderColor: `color-mix(in srgb, ${st.color} 45%, transparent)`, backgroundColor: `color-mix(in srgb, ${st.color} 12%, transparent)` }}
                                                >
                                                    {st.glyph}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-xs truncate ${n.isRead ? "text-[color:var(--t-tx1)]" : "text-[color:var(--t-tx0)] font-bold"}`}>{n.title}</span>
                                                        {!n.isRead && <span className="w-1.5 h-1.5 shrink-0 bg-[var(--t-ac)]" aria-label="unread" />}
                                                    </div>
                                                    {n.message && <p className="text-[color:var(--t-tx2)] text-[11px] leading-snug mt-0.5 line-clamp-2">{n.message}</p>}
                                                    <span className="text-[color:var(--t-tx2)] text-[10px] opacity-70">{timeAgo(n.createdAt)}</span>
                                                </div>
                                                {n.id && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => removeItem(e, n)}
                                                        aria-label="Remove notification"
                                                        className="shrink-0 w-5 h-5 flex items-center justify-center text-[color:var(--t-tx2)] opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-[color:var(--t-err)] transition-opacity"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Toast for a notification that just arrived */}
            {toast && !open && (
                <div
                    role="status"
                    onClick={() => openItem(toast)}
                    className="fixed z-[70] right-4 bottom-4 w-72 max-w-[calc(100vw-2rem)] flex items-start gap-2.5 p-3 cursor-pointer bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] border-l-[3px] text-left"
                    style={{
                        borderLeftColor: (TYPE_STYLE[toast.type] || {}).color || "var(--t-ac)",
                        boxShadow: "4px 4px 0px var(--t-shadow), 0 12px 32px rgba(0,0,0,0.45)",
                    }}
                >
                    <div className="flex-1 min-w-0">
                        <span className="text-[color:var(--t-tx0)] text-xs font-bold block truncate">{toast.title}</span>
                        {toast.message && <span className="text-[color:var(--t-tx2)] text-[11px] block mt-0.5 line-clamp-2">{toast.message}</span>}
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setToast(null);
                        }}
                        aria-label="Dismiss"
                        className="text-[color:var(--t-tx2)] hover:text-[color:var(--t-tx0)] leading-none"
                    >
                        ×
                    </button>
                </div>
            )}
        </>
    );
}

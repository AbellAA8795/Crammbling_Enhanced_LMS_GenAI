import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Panel } from "../components/Panel";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import Settings, { useSettings } from "../components/Settings";
import { Sidebar, NAV_IMG } from "./Dashboard";
import { useTheme, withAlpha } from "./Theme";
import {
    ACHIEVEMENTS,
    PEOPLE,
    findPerson,
    findByUsername,
    findByGmail,
    searchPeople,
    useMe,
    updateMe,
    useFriends,
    addFriend,
    removeFriend,
    friendsOf,
} from "./ProfileHub";

// Same sans-serif font setup as the Dashboard.
const SANS = 'ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif';
const SEGMENTS = "repeating-linear-gradient(90deg, transparent 0 9px, rgba(0,0,0,0.3) 9px 10px)";
const SCROLL =
    "[scrollbar-width:thin] [scrollbar-color:var(--t-bd0,#2e2521)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-edge";
const FIELD =
    "w-full bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2.5 px-3 outline-none placeholder:text-[color:var(--t-ph)] focus:border-[color:var(--t-ac)] transition-colors";
const MODAL_SHADOW = "6px 6px 0px var(--t-shadow), 0 0 40px color-mix(in srgb, var(--t-glow) 18%, transparent)";

const AVATAR_COLORS = ["var(--t-ac)", "var(--t-warn)", "var(--t-ok2)", "var(--t-ok)", "var(--t-ac2)"];
function colorForString(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initialsFor(name) {
    return name
        .replace(/^(Prof\.|Dr\.|Ms\.|Mr\.)\s+/, "")
        .split(" ")
        .map((w) => w[0])
        .filter(Boolean)
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

/* Square avatar with a pixel "hair" strip — same look as Group Collab's avatars. */
function Avatar({ person, className = "w-9 h-9 text-[11px]" }) {
    const color = person.id === "you" ? "var(--t-ac)" : colorForString(person.name);
    return (
        <div
            className={`relative shrink-0 flex items-center justify-center font-bold border-2 border-solid ${className}`}
            style={{ backgroundColor: withAlpha(color, "26"), borderColor: color, color }}
        >
            <span className="absolute top-0 left-0 w-full h-[12%] min-h-[3px]" style={{ backgroundColor: color }} />
            {person.initials || initialsFor(person.name)}
        </div>
    );
}

function RoleTag({ role }) {
    return <span className={`tag ${role === "teacher" ? "tag-gold" : "tag-cyan"} !text-[10px] !py-0.5`}>{role === "teacher" ? "TEACHER" : "STUDENT"}</span>;
}

/* Small line icons (no emoji) for the info rows. */
function InfoIcon({ type }) {
    const p = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
    switch (type) {
        case "user":
            return (
                <svg {...p}>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                </svg>
            );
        case "at":
            return (
                <svg {...p}>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                </svg>
            );
        case "mail":
            return (
                <svg {...p}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <polyline points="22 6 12 13 2 6" />
                </svg>
            );
        case "school":
            return (
                <svg {...p}>
                    <path d="M22 10 12 5 2 10l10 5 10-5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
            );
        case "book":
            return (
                <svg {...p}>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
            );
        case "calendar":
            return (
                <svg {...p}>
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            );
        default:
            return null;
    }
}

function GoogleIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Top-bar people search                                               */
/* ------------------------------------------------------------------ */
function PeopleSearchBar({ inputRef, onOpenProfile, friends }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const results = query.trim() ? searchPeople(query).slice(0, 8) : [];

    function pick(p) {
        onOpenProfile(p.id);
        setQuery("");
        setOpen(false);
        inputRef.current?.blur();
    }

    return (
        <div className="relative flex-1 min-w-[40px] sm:min-w-[260px] sm:flex-none">
            <div className="flex items-center bg-[var(--t-bg3)] py-[7px] px-[15px] gap-2.5 border border-solid border-[color:var(--t-bd0)] focus-within:border-[color:var(--t-ac)] transition-colors">
                <img src={NAV_IMG.search} alt="" className="w-[13px] h-[13px] object-fill shrink-0" />
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && results[0]) pick(results[0]);
                        if (e.key === "Escape") {
                            setQuery("");
                            e.currentTarget.blur();
                        }
                    }}
                    placeholder="[ / ] Search people by name or @username..."
                    className="bg-transparent outline-none text-[color:var(--t-tx0)] placeholder-[color:var(--t-tx2)] text-xs w-full min-w-0"
                />
            </div>

            {open && query.trim() && (
                <div
                    className={`absolute top-full left-0 right-0 z-40 mt-1 max-h-80 overflow-y-auto bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] ${SCROLL}`}
                    style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 20px color-mix(in srgb, var(--t-glow) 20%, transparent)" }}
                >
                    {results.length === 0 && <p className="text-mute text-[11px] px-3 py-4 text-center">No one matches “{query.trim()}”.</p>}
                    {results.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            // mousedown fires before the input's blur closes the list
                            onMouseDown={(e) => {
                                e.preventDefault();
                                pick(p);
                            }}
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2 hover:bg-[var(--t-bg3)] transition-colors"
                        >
                            <Avatar person={p} className="w-7 h-7 text-[9px]" />
                            <div className="flex-1 min-w-0">
                                <span className="text-ink text-xs font-bold truncate block">{p.name}</span>
                                <span className="text-mute text-[10px] truncate block">@{p.username}</span>
                            </div>
                            {friends.includes(p.id) ? <span className="tag tag-lime !text-[9px] !py-0">FRIEND</span> : <RoleTag role={p.role} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Modals                                                              */
/* ------------------------------------------------------------------ */
function ModalShell({ title, icon, onClose, children, onSubmit }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onClose} />
            <form
                onSubmit={onSubmit}
                className="relative bg-[var(--t-mbg)] border border-solid border-[color:var(--t-mbd2)] border-t-[3px] border-t-[color:var(--t-ac)] p-5 w-full max-w-md flex flex-col gap-3 max-h-[90vh] overflow-y-auto"
                style={{ boxShadow: MODAL_SHADOW }}
            >
                <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center gap-2 text-[color:var(--t-tx0)] text-sm font-bold uppercase tracking-wider">
                        <span className="text-[color:var(--t-ac)]">{icon}</span>
                        {title}
                    </span>
                    <button type="button" onClick={onClose} aria-label="Close" className="text-[color:var(--t-mtx)] text-lg leading-none hover:text-[color:var(--t-ac2)] transition-colors">
                        ×
                    </button>
                </div>
                {children}
            </form>
        </div>
    );
}

/* Add a friend by username or by their Google (Gmail) account. */
function AddFriendModal({ me, friends, onClose, onOpenProfile }) {
    const [method, setMethod] = useState("username");
    const [value, setValue] = useState("");
    const [added, setAdded] = useState(null); // person just added

    const raw = value.trim();
    const isGoogle = method === "google";
    const badEmail = isGoogle && raw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
    const isSelf = raw && (isGoogle ? raw.toLowerCase() === me.gmail.toLowerCase() : raw.replace(/^@/, "").toLowerCase() === me.username.toLowerCase());
    const match = raw && !badEmail && !isSelf ? (isGoogle ? findByGmail(raw) : findByUsername(raw)) : null;
    const already = match && friends.includes(match.id);

    let hint = null;
    if (isSelf) hint = "That's you!";
    else if (badEmail) hint = "Enter a full Google account email, e.g. name@gmail.com.";
    else if (raw && !match) hint = isGoogle ? "No Crammbling account is linked to that Google account." : "No one has that username.";

    function submit(e) {
        e.preventDefault();
        if (!match || already) return;
        addFriend(match.id);
        setAdded(match);
        setValue("");
    }

    return (
        <ModalShell title="Add friend" icon="+" onClose={onClose} onSubmit={submit}>
            <div className="flex gap-1.5">
                {[
                    { id: "username", label: "Username" },
                    { id: "google", label: "Google account" },
                ].map((m) => (
                    <button
                        type="button"
                        key={m.id}
                        onClick={() => {
                            setMethod(m.id);
                            setValue("");
                        }}
                        className={`flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold py-2 border border-solid transition-all duration-150 active:scale-95 ${method === m.id
                            ? "bg-[var(--t-in1)] border-[color:var(--t-ac)] text-[color:var(--t-ac)]"
                            : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-tx1)]"
                            }`}
                    >
                        {m.id === "google" ? <GoogleIcon /> : <span className="font-bold">@</span>}
                        {m.label}
                    </button>
                ))}
            </div>

            <p className="text-[color:var(--t-mtx)] text-[11px] -mb-1">
                {isGoogle ? "Find a friend by the Google account they signed up with." : "Find a friend by their Crammbling username."}
            </p>
            <input
                autoFocus
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    setAdded(null);
                }}
                placeholder={isGoogle ? "name@gmail.com" : "@username"}
                type={isGoogle ? "email" : "text"}
                className={FIELD}
            />

            {hint && <span className="text-[color:var(--t-err)] text-[11px]">{hint}</span>}

            {match && (
                <div className="flex items-center gap-3 p-3 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)]">
                    <Avatar person={match} className="w-10 h-10 text-xs" />
                    <div className="flex-1 min-w-0">
                        <button type="button" onClick={() => onOpenProfile(match.id)} className="text-ink text-sm font-bold truncate block hover:text-cyan hover:underline text-left">
                            {match.name}
                        </button>
                        <span className="text-mute text-[11px] truncate block">@{match.username} · {match.course}</span>
                    </div>
                    <RoleTag role={match.role} />
                </div>
            )}

            {added && (
                <div className="flex items-center gap-2 p-2.5 border border-solid border-[color:color-mix(in_srgb,_var(--t-ok)_45%,_transparent)] bg-[color-mix(in_srgb,_var(--t-ok)_12%,_transparent)] text-[color:var(--t-ok)] text-[11px] font-bold">
                    ✓ {added.name} is now your friend.
                </div>
            )}

            <button type="submit" disabled={!match || already} className="btn btn-cyan mt-1 disabled:opacity-40 disabled:cursor-not-allowed">
                {already ? "Already friends" : "Add friend"}
            </button>
        </ModalShell>
    );
}

function EditProfileModal({ me, onClose }) {
    const [form, setForm] = useState({ name: me.name, username: me.username, bio: me.bio, school: me.school, course: me.course });
    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const cleanUser = form.username.trim().replace(/^@/, "");
    const taken = PEOPLE.some((p) => p.username.toLowerCase() === cleanUser.toLowerCase());
    const valid = form.name.trim() && /^[A-Za-z0-9_.]{3,20}$/.test(cleanUser) && !taken;

    function submit(e) {
        e.preventDefault();
        if (!valid) return;
        updateMe({ name: form.name.trim(), username: cleanUser, bio: form.bio.trim(), school: form.school.trim(), course: form.course.trim() });
        onClose();
    }

    return (
        <ModalShell title="Edit profile" icon="✎" onClose={onClose} onSubmit={submit}>
            <label className="flex flex-col gap-1">
                <span className="label">Display name</span>
                <input autoFocus value={form.name} onChange={set("name")} className={FIELD} />
            </label>
            <label className="flex flex-col gap-1">
                <span className="label">Username</span>
                <input value={form.username} onChange={set("username")} className={FIELD} />
                {taken && <span className="text-[color:var(--t-err)] text-[11px]">That username is taken.</span>}
                {!taken && cleanUser && !/^[A-Za-z0-9_.]{3,20}$/.test(cleanUser) && (
                    <span className="text-[color:var(--t-err)] text-[11px]">3–20 letters, numbers, dots or underscores.</span>
                )}
            </label>
            <label className="flex flex-col gap-1">
                <span className="label">Bio</span>
                <textarea value={form.bio} onChange={set("bio")} rows={3} maxLength={160} className={`${FIELD} resize-none`} />
                <span className="text-mute text-[10px] self-end">{form.bio.length}/160</span>
            </label>
            <label className="flex flex-col gap-1">
                <span className="label">School</span>
                <input value={form.school} onChange={set("school")} className={FIELD} />
            </label>
            <label className="flex flex-col gap-1">
                <span className="label">Course / year</span>
                <input value={form.course} onChange={set("course")} className={FIELD} />
            </label>
            <div className="flex items-center gap-2 text-mute text-[11px]">
                <GoogleIcon className="w-3 h-3" />
                Signed in with {me.gmail}
            </div>
            <button type="submit" disabled={!valid} className="btn btn-cyan mt-1 disabled:opacity-40 disabled:cursor-not-allowed">
                Save changes
            </button>
        </ModalShell>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
export default function Profile() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [theme, setTheme, themeVars] = useTheme();
    const rootStyle = { ...themeVars, "--font-display": SANS, "--font-label": SANS };

    const [showSettings, setShowSettings] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [navCollapsed, setNavCollapsed] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [badgeView, setBadgeView] = useState("earned"); // earned | all
    const [friendQuery, setFriendQuery] = useState("");
    const searchRef = useRef(null);
    const mainRef = useRef(null);

    const me = useMe();
    const myFriends = useFriends();
    const [settings] = useSettings();

    // Settings → Account → "Edit profile" lands here with { edit: true }.
    const location = useLocation();
    useEffect(() => {
        if (!location.state?.edit) return;
        setShowEdit(true);
        navigate(location.pathname, { replace: true, state: null });
    }, [location.state, location.pathname, navigate]);

    const isMe = !userId || userId === "you";
    const person = isMe ? null : findPerson(userId);

    // Everything the page shows, in one shape for "me" and for other people.
    const view = useMemo(() => {
        if (isMe) return { ...me, badges: ACHIEVEMENTS.filter((a) => a.unlocked).map((a) => a.id), friendIds: myFriends };
        if (!person) return null;
        return { ...person, friendIds: friendsOf(person, myFriends) };
    }, [isMe, me, person, myFriends]);

    const friendPeople = useMemo(
        () => (view ? view.friendIds.map((id) => (id === "you" ? me : findPerson(id))).filter(Boolean) : []),
        [view, me]
    );
    const shownFriends = friendQuery.trim()
        ? friendPeople.filter((p) => `${p.name} ${p.username}`.toLowerCase().includes(friendQuery.trim().toLowerCase().replace(/^@/, "")))
        : friendPeople;
    const mutualCount = !isMe && view ? view.friendIds.filter((id) => myFriends.includes(id)).length : 0;
    const isFriend = !isMe && view && myFriends.includes(view.id);

    // People you might know: friends of your friends you haven't added yet.
    const suggestions = useMemo(() => {
        if (!isMe) return [];
        const seen = new Set(myFriends);
        const out = [];
        myFriends.forEach((fid) => {
            (findPerson(fid)?.friends || []).forEach((id) => {
                if (!seen.has(id)) {
                    seen.add(id);
                    const p = findPerson(id);
                    if (p) out.push(p);
                }
            });
        });
        return out.slice(0, 4);
    }, [isMe, myFriends]);

    const earned = view ? ACHIEVEMENTS.filter((a) => view.badges.includes(a.id)) : [];
    const shownBadges = badgeView === "earned" ? earned : ACHIEVEMENTS;
    const isTeacher = view?.role === "teacher";

    // New profile → back to the top, clear the friend filter.
    useEffect(() => {
        mainRef.current?.scrollTo({ top: 0 });
        setFriendQuery("");
    }, [userId]);

    /* "/" focuses the people search, Esc closes things — same shortcuts as the other pages. */
    useEffect(() => {
        function onKeyDown(e) {
            const typing = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);
            if (e.key === "/" && !typing) {
                e.preventDefault();
                searchRef.current?.focus();
            }
            if (e.key === "Escape") {
                setNotifOpen(false);
                setShowAddFriend(false);
                setShowEdit(false);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    function openProfile(id) {
        setShowAddFriend(false);
        navigate(id === "you" ? "/profile" : `/profile/${id}`);
    }

    const handleNavigate = (item) => {
        setMobileNavOpen(false);
        navigate(item.path);
    };

    const handleConfirmLogout = () => {
        setShowLogoutConfirm(false);
        // TODO: clear auth/session state here once real auth is wired up
        navigate("/");
    };

    const level = view?.level;
    const xpPercent = isMe ? me.xpPercent : view?.xp ? Math.round(((view.xp % 1000) / 1000) * 100) : 0;
    const stats = view
        ? [
            { label: "Friends", value: view.friendIds.length, color: "text-cyan" },
            !isMe && { label: "Mutual friends", value: mutualCount, color: "text-ink" },
            !isTeacher && { label: "Level", value: level, color: "text-lime" },
            !isTeacher && { label: "Total XP", value: view.xp?.toLocaleString(), color: "text-cyan" },
            !isTeacher && { label: "Day streak", value: view.streak, color: "text-gold" },
            !isTeacher && { label: "Badges", value: `${earned.length}/${ACHIEVEMENTS.length}`, color: "text-gold" },
            isTeacher && { label: "Joined", value: view.joined, color: "text-ink" },
        ].filter(Boolean)
        : [];

    const accent = isMe ? "var(--t-ac)" : view ? colorForString(view.name) : "var(--t-ac)";

    return (
        <div style={rootStyle} className="flex h-screen w-full bg-[var(--t-bg1)] text-ink overflow-hidden">
            {/* desktop sidebar: collapsible drawer (same as the Dashboard) */}
            <div className="hidden md:flex h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-out" style={{ width: navCollapsed ? 0 : 256 }}>
                <Sidebar
                    activePage="profile"
                    onNavigate={handleNavigate}
                    onCloseMobile={() => { }}
                    onOpenSettings={() => setShowSettings(true)}
                    onLogout={() => setShowLogoutConfirm(true)}
                />
            </div>

            <button
                type="button"
                onClick={() => setNavCollapsed((v) => !v)}
                aria-label={navCollapsed ? "Open navigation bar" : "Push navigation bar aside"}
                title={navCollapsed ? "Open navigation" : "Push navigation aside"}
                className="hidden md:flex fixed top-1/2 -translate-y-1/2 z-30 w-5 h-16 items-center justify-center bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] border-l-0 text-[color:var(--t-ac)] hover:bg-[var(--t-ac)] hover:text-[color:var(--t-onac)] hover:shadow-[0_0_14px_color-mix(in_srgb,var(--t-ac)_40%,transparent)] transition-all duration-300 active:scale-95"
                style={{ left: navCollapsed ? 0 : 256 }}
            >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: navCollapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s" }}>
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {mobileNavOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <Sidebar
                        activePage="profile"
                        onNavigate={handleNavigate}
                        onCloseMobile={() => setMobileNavOpen(false)}
                        onOpenSettings={() => { setMobileNavOpen(false); setShowSettings(true); }}
                        onLogout={() => { setMobileNavOpen(false); setShowLogoutConfirm(true); }}
                    />
                    <div className="flex-1 bg-black/50" onClick={() => setMobileNavOpen(false)} />
                </div>
            )}

            <div style={{ backgroundImage: "var(--t-grad-main)" }} className="flex-1 flex flex-col min-w-0 bg-[var(--t-bg1)]">
                {/* top bar */}
                <div className="relative z-30 flex flex-wrap justify-between items-center gap-3 bg-[color-mix(in_srgb,_var(--t-bg0)_40%,_transparent)] py-3 px-4 sm:px-8">
                    <div className="flex flex-1 min-w-0 items-center gap-3">
                        <button
                            type="button"
                            className={`text-[color:var(--t-tx0)] shrink-0 ${navCollapsed ? "" : "md:hidden"}`}
                            onClick={() => {
                                setNavCollapsed(false);
                                setMobileNavOpen(true);
                            }}
                            aria-label="Open menu"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                            </svg>
                        </button>
                        <PeopleSearchBar inputRef={searchRef} onOpenProfile={openProfile} friends={myFriends} />
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <button type="button" className="relative shrink-0" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
                            <img src={NAV_IMG.avatar} alt="" className="w-8 h-8 object-fill" />
                            {notifOpen && (
                                <div className="absolute right-0 top-10 z-50 w-56 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] p-3 text-left shadow-lg">
                                    <span className="text-[color:var(--t-tx0)] text-xs font-bold block mb-2">Notifications</span>
                                    <span className="text-[color:var(--t-tx2)] text-[11px] block">Jess R. earned the Speed Run badge.</span>
                                </div>
                            )}
                        </button>
                        <button type="button" onClick={() => openProfile("you")} className="flex flex-col shrink-0 items-start px-1 sm:px-2" aria-label="My profile">
                            <div
                                className="flex flex-col items-center bg-[var(--t-ac)] py-[5px] px-[7px] border border-solid border-[color:var(--t-bd0)]"
                                style={{ boxShadow: isMe ? "0 0 0 2px var(--t-bg0), 0 0 0 3px var(--t-ac)" : "0px 1px 2px #0000000D" }}
                            >
                                <span className="text-[color:var(--t-onac)] text-sm font-bold">{me.initials}</span>
                            </div>
                        </button>
                    </div>
                </div>

                <main ref={mainRef} className={`flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto ${SCROLL}`}>
                    {!view ? (
                        <section className="panel p-10 flex flex-col items-center gap-3 text-center">
                            <span className="text-cyan text-2xl leading-none">?</span>
                            <h1 className="panel-title">Profile not found</h1>
                            <p className="text-mute text-xs">This person doesn't exist or their account was removed.</p>
                            <button type="button" onClick={() => openProfile("you")} className="btn btn-ghost mt-2">
                                Back to my profile
                            </button>
                        </section>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {!isMe && (
                                <button type="button" onClick={() => navigate(-1)} className="self-start label hover:text-cyan transition-colors">
                                    ← Back
                                </button>
                            )}

                            {/* ---------------- Profile card ---------------- */}
                            <section className="panel overflow-hidden">
                                {/* banner */}
                                <div
                                    className="relative h-24 sm:h-28 border-b border-edge"
                                    style={{
                                        background: `linear-gradient(120deg, ${withAlpha(accent, "55")} 0%, ${withAlpha(accent, "18")} 55%, transparent 100%)`,
                                    }}
                                >
                                    <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(color-mix(in srgb, var(--t-tx0) 14%, transparent) 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
                                    <span className="absolute right-4 top-3 label !text-[color:var(--t-tx1)]">{isMe ? "My profile" : isTeacher ? "Faculty profile" : "Student profile"}</span>
                                </div>

                                <div className="px-4 sm:px-6 pb-5">
                                    <div className="flex flex-wrap items-end justify-between gap-4 -mt-10 sm:-mt-12">
                                        <div className="flex items-end gap-4 min-w-0">
                                            <div className="p-1 bg-[var(--t-bg2)] border border-edge" style={{ boxShadow: "3px 3px 0px var(--t-shadow)" }}>
                                                <Avatar person={view} className="w-20 h-20 sm:w-24 sm:h-24 text-2xl sm:text-3xl" />
                                            </div>
                                            <div className="min-w-0 pb-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h1 className="text-[22px] sm:text-[26px] leading-none font-bold uppercase tracking-wide truncate">{view.name}</h1>
                                                    {!isTeacher && <span className="tag tag-lime">[LVL {level}]</span>}
                                                    <RoleTag role={view.role} />
                                                </div>
                                                <p className="text-mute text-xs mt-1.5">@{view.username}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            {isMe ? (
                                                <>
                                                    <button type="button" onClick={() => setShowEdit(true)} className="btn btn-ghost">
                                                        ✎ Edit profile
                                                    </button>
                                                    <button type="button" onClick={() => setShowAddFriend(true)} className="btn btn-cyan">
                                                        + Add friend
                                                    </button>
                                                </>
                                            ) : isFriend ? (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFriend(view.id)}
                                                    className="group btn btn-ghost !border-[color:color-mix(in_srgb,_var(--t-ok)_50%,_transparent)] !text-[color:var(--t-ok)] hover:!border-[color:var(--t-err)] hover:!text-[color:var(--t-err)]"
                                                >
                                                    <span className="group-hover:hidden">✓ Friends</span>
                                                    <span className="hidden group-hover:inline">× Unfriend</span>
                                                </button>
                                            ) : (
                                                <button type="button" onClick={() => addFriend(view.id)} className="btn btn-cyan">
                                                    + Add friend
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {view.bio && <p className="text-[color:var(--t-tx1)] text-[13px] mt-4 max-w-2xl leading-relaxed">{view.bio}</p>}

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-mute text-[11px]">
                                        <span className="flex items-center gap-1.5"><InfoIcon type="school" />{view.school}</span>
                                        <span className="flex items-center gap-1.5"><InfoIcon type="book" />{view.course}</span>
                                        <span className="flex items-center gap-1.5"><InfoIcon type="calendar" />Joined {view.joined}</span>
                                    </div>

                                    {!isTeacher && (
                                        <div className="mt-5">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="label">Experience progress</span>
                                                <span className="font-label text-[11px] font-bold text-cyan">
                                                    LVL {level} - {xpPercent}%
                                                </span>
                                            </div>
                                            <div className="w-full h-3.5 bg-deep border border-edge">
                                                <div className="h-full bg-lime" style={{ width: `${xpPercent}%`, backgroundImage: SEGMENTS }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* ---------------- Stat tiles ---------------- */}
                            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
                                {stats.map((s) => (
                                    <div key={s.label} className="panel px-4 py-3" style={{ boxShadow: "3px 3px 0px var(--t-shadow)" }}>
                                        <p className={`font-display text-[22px] font-bold leading-none ${s.color}`}>{s.value ?? "—"}</p>
                                        <p className="label mt-1.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
                                {/* ---------------- Badges ---------------- */}
                                <Panel
                                    icon={"★"}
                                    title={
                                        <>
                                            Badges & Achievements
                                            {isMe && !settings.showBadges && (
                                                <span className="tag !text-[9px] !py-0 !tracking-wider" title="Change this in Settings → Privacy">
                                                    HIDDEN FROM OTHERS
                                                </span>
                                            )}
                                        </>
                                    }
                                    right={
                                        !isTeacher && (
                                            <div className="flex border border-edge">
                                                {[
                                                    { key: "earned", label: `Earned (${earned.length})` },
                                                    { key: "all", label: "All" },
                                                ].map((o) => (
                                                    <button
                                                        key={o.key}
                                                        type="button"
                                                        onClick={() => setBadgeView(o.key)}
                                                        className={`px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-wider transition-colors ${badgeView === o.key ? "bg-cyan text-[color:var(--t-onac)]" : "bg-inset text-mute hover:text-ink"
                                                            }`}
                                                    >
                                                        {o.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )
                                    }
                                >
                                    {isTeacher ? (
                                        <p className="text-mute text-xs py-6 text-center">Teachers don't earn quiz badges.</p>
                                    ) : (
                                        <>
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="label">Collection</span>
                                                    <span className="font-label text-[11px] font-bold text-gold">
                                                        {earned.length} / {ACHIEVEMENTS.length}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2.5 bg-deep border border-edge">
                                                    <div className="h-full bg-gold" style={{ width: `${(earned.length / ACHIEVEMENTS.length) * 100}%`, backgroundImage: SEGMENTS }} />
                                                </div>
                                            </div>

                                            {shownBadges.length === 0 && <p className="text-mute text-xs py-6 text-center">No badges earned yet.</p>}
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {shownBadges.map((a) => {
                                                    const got = view.badges.includes(a.id);
                                                    return (
                                                        <li
                                                            key={a.id}
                                                            title={`${a.name} — ${a.mission}`}
                                                            className={`flex items-center gap-3 px-2.5 py-2 border bg-deep transition-colors ${got ? "border-lime/30 hover:border-lime/60" : "border-edge"}`}
                                                        >
                                                            <img src={a.badge} alt="" className={`w-11 h-11 shrink-0 object-contain ${got ? "" : "grayscale opacity-40"}`} />
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <h4 className={`font-display text-[13px] font-bold truncate ${got ? "text-ink" : "text-mute"}`}>{a.name}</h4>
                                                                    {!got && <span className="tag tag-gold !text-[9px] !py-0 shrink-0">Locked</span>}
                                                                </div>
                                                                <p className="font-label text-[10px] text-mute mt-0.5 leading-snug line-clamp-2">{a.mission}</p>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </>
                                    )}
                                </Panel>

                                <div className="flex flex-col gap-6">
                                    {/* ---------------- Friends ---------------- */}
                                    <Panel
                                        icon={"⛆"}
                                        title={isMe ? "My friends" : "Friends"}
                                        right={
                                            <div className="flex items-center gap-2">
                                                <span className="tag tag-gold !text-[10px] !py-0.5">{friendPeople.length}</span>
                                                {isMe && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAddFriend(true)}
                                                        aria-label="Add friend"
                                                        title="Add friend"
                                                        className="w-6 h-6 flex items-center justify-center bg-cyan text-[color:var(--t-onac)] font-bold text-sm leading-none hover:brightness-110 active:scale-95 transition"
                                                    >
                                                        +
                                                    </button>
                                                )}
                                            </div>
                                        }
                                    >
                                        {friendPeople.length > 3 && (
                                            <input
                                                value={friendQuery}
                                                onChange={(e) => setFriendQuery(e.target.value)}
                                                placeholder="Search friends..."
                                                className="w-full mb-3 bg-inset border border-edge text-ink text-xs py-2 px-3 outline-none placeholder:text-mute focus:border-cyan/60"
                                            />
                                        )}
                                        {friendPeople.length === 0 && (
                                            <p className="text-mute text-xs py-4 text-center">
                                                {isMe ? "No friends yet — add some by username or Google account." : "No friends to show yet."}
                                            </p>
                                        )}
                                        {friendPeople.length > 0 && shownFriends.length === 0 && <p className="text-mute text-xs py-4 text-center">No friends match.</p>}
                                        <div className={`flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-0.5 ${SCROLL}`}>
                                            {shownFriends.map((f) => {
                                                const mutual = !isMe && f.id !== "you" && myFriends.includes(f.id);
                                                return (
                                                    <button
                                                        key={f.id}
                                                        type="button"
                                                        onClick={() => openProfile(f.id)}
                                                        className="group flex items-center gap-2.5 p-2 text-left border border-edge bg-inset hover:border-cyan/50 transition-colors"
                                                    >
                                                        <Avatar person={f} className="w-8 h-8 text-[10px]" />
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-ink text-xs font-bold truncate block group-hover:text-cyan">
                                                                {f.id === "you" ? `${f.name} (you)` : f.name}
                                                            </span>
                                                            <span className="text-mute text-[10px] truncate block">@{f.username}</span>
                                                        </div>
                                                        {mutual && <span className="tag tag-lime !text-[9px] !py-0">MUTUAL</span>}
                                                        {f.role === "teacher" ? (
                                                            <RoleTag role="teacher" />
                                                        ) : (
                                                            f.level != null && <span className="font-label text-[10px] font-bold text-gold shrink-0">LVL {f.level}</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </Panel>

                                    {/* ---------------- People you may know (my profile only) ---------------- */}
                                    {isMe && suggestions.length > 0 && (
                                        <Panel icon={"✦"} title="People you may know">
                                            <div className="flex flex-col gap-1.5">
                                                {suggestions.map((p) => (
                                                    <div key={p.id} className="flex items-center gap-2.5 p-2 border border-edge bg-inset">
                                                        <Avatar person={p} className="w-8 h-8 text-[10px]" />
                                                        <button type="button" onClick={() => openProfile(p.id)} className="flex-1 min-w-0 text-left group">
                                                            <span className="text-ink text-xs font-bold truncate block group-hover:text-cyan">{p.name}</span>
                                                            <span className="text-mute text-[10px] truncate block">
                                                                {p.friends.filter((id) => myFriends.includes(id)).length} mutual friend(s)
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => addFriend(p.id)}
                                                            className="text-[10px] font-bold uppercase tracking-wider py-1 px-2 border border-cyan text-cyan hover:bg-cyan hover:text-[color:var(--t-onac)] transition-colors"
                                                        >
                                                            + Add
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </Panel>
                                    )}

                                    {/* ---------------- About ---------------- */}
                                    <Panel icon={"▤"} title="About">
                                        <dl className="flex flex-col">
                                            {[
                                                { icon: "user", label: "Name", value: view.name },
                                                { icon: "at", label: "Username", value: `@${view.username}` },
                                                { icon: "mail", label: "Google account", value: view.gmail, google: true },
                                                { icon: "school", label: "School", value: view.school },
                                                { icon: "book", label: isTeacher ? "Department" : "Course", value: view.course },
                                                { icon: "calendar", label: "Joined", value: view.joined },
                                            ].map((row) => (
                                                <div key={row.label} className="flex items-center gap-3 py-2 border-b border-edge last:border-b-0">
                                                    <span className="text-cyan shrink-0">
                                                        <InfoIcon type={row.icon} />
                                                    </span>
                                                    <dt className="label w-24 shrink-0">{row.label}</dt>
                                                    <dd className="text-ink text-xs truncate flex items-center gap-1.5 min-w-0">
                                                        {row.google && <GoogleIcon className="w-3 h-3 shrink-0" />}
                                                        <span className="truncate">{row.value}</span>
                                                        {row.google && isMe && !settings.showGmail && (
                                                            <span className="tag !text-[9px] !py-0 shrink-0" title="Change this in Settings → Privacy">HIDDEN</span>
                                                        )}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </Panel>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Settings drawer — shared by every page */}
            <Settings open={showSettings} onClose={() => setShowSettings(false)} theme={theme} onThemeChange={setTheme} />

            {showAddFriend && <AddFriendModal me={me} friends={myFriends} onClose={() => setShowAddFriend(false)} onOpenProfile={openProfile} />}
            {showEdit && <EditProfileModal me={me} onClose={() => setShowEdit(false)} />}

            {showLogoutConfirm && <LogoutConfirmModal onConfirm={handleConfirmLogout} onCancel={() => setShowLogoutConfirm(false)} />}
        </div>
    );
}

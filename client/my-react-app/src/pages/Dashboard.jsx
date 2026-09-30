import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizHistory from "../components/QuizHistory";
import Chatbot from "./chatbot";
import GroupCollab from "./group_collab";
import Personalized from "./personalized";
import { ThemePicker, useTheme, withAlpha, CloseIcon, MenuIcon } from "./Theme";

/* ---------------------------------------------------------
   Static assets — same icon art as personalized.jsx so the
   navigation bar is pixel-identical on every page.
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
  streak: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/75egjh7r_expires_30_days.png",
  xp: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/5hwd9ufw_expires_30_days.png",
  avatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/fUpAUSquvf/24khomt6_expires_30_days.png",
};

/* Same keys the other pages use: dashboard | chatbot | group | quiz | personalized */
const NAV_ITEMS = [
  { key: "dashboard", label: "DASHBOARD", icon: IMG.dashboard, iconClass: "w-[18px] h-[15px]" },
  { key: "chatbot", label: "CHATBOT", icon: IMG.chatbot, iconClass: "w-[18px] h-[15px]" },
  { key: "group", label: "GROUP COLLAB", icon: IMG.group, iconClass: "w-5 h-2.5" },
  { key: "quiz", label: "QUIZ ARENA", icon: IMG.quiz, iconClass: "w-4 h-4" },
  { key: "personalized", label: "PERSONALIZED", icon: IMG.personalized, iconClass: "w-[18px] h-[13px]" },
];

const FILTERS = ["This Week", "This Month", "All Time"];

const PLAYER = {
  name: "John",
  level: 18,
  xpPercent: 68,
  streakDays: 14,
  studyHours: 18.5,
  rank: 8,
  hp: 8,
  hpMax: 10,
  focus: 8,
  focusMax: 10,
};

const ANALYTICS_STATS = [
  { label: "Total XP", value: "3,420", color: "var(--t-ac)" },
  { label: "Current Level", value: "18", color: "var(--t-ok)" },
  { label: "Study Streak", value: "14 days", color: "var(--t-warn)" },
  { label: "Quizzes Completed", value: "47", color: "var(--t-ac)" },
  { label: "Avg. Accuracy", value: "82%", color: "var(--t-ok)" },
];

const WEEKLY_ACTIVITY = [
  { day: "Mon", xp: 120 },
  { day: "Tue", xp: 260 },
  { day: "Wed", xp: 90 },
  { day: "Thu", xp: 310 },
  { day: "Fri", xp: 200 },
  { day: "Sat", xp: 350 },
  { day: "Sun", xp: 180 },
];

const LEADERBOARD = [
  { rank: 1, name: "JuanDelaCruz", level: 18, points: 5230 },
  { rank: 2, name: "MariaSantos", level: 16, points: 4870 },
  { rank: 3, name: "CarloReyes", level: 15, points: 4520 },
  { rank: 4, name: "AngelaTan", level: 14, points: 4110 },
  { rank: 5, name: "MikoRamos", level: 13, points: 3890 },
  { rank: 6, name: "JoshuaLim", level: 13, points: 3760 },
  { rank: 7, name: "PatriciaCruz", level: 12, points: 3540 },
  { rank: 8, name: "You", level: 18, points: 3420 },
  { rank: 9, name: "DennisAquino", level: 11, points: 3280 },
  { rank: 10, name: "SofiaGarcia", level: 11, points: 3105 },
];

/* Medal colours are fixed on purpose (gold / silver / bronze) in every theme. */
const PODIUM = {
  1: { order: "order-2", trophy: "\u{1F3C6}", color: "#f4c542", pedestal: "h-24", avatar: "w-14 h-14 text-[20px]" },
  2: { order: "order-1", trophy: "\u{1F948}", color: "#cfc8bf", pedestal: "h-16", avatar: "w-11 h-11 text-[15px]" },
  3: { order: "order-3", trophy: "\u{1F949}", color: "#d08a52", pedestal: "h-12", avatar: "w-11 h-11 text-[15px]" },
};

/* ---------------------------------------------------------
   Small themed building blocks
--------------------------------------------------------- */
const LABEL = "text-[color:var(--t-tx2)] text-[10px] font-bold uppercase tracking-[0.12em]";

function Tag({ color, children }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 border border-solid text-[10px] font-bold uppercase tracking-wide"
      style={{ color, borderColor: withAlpha(color, "66"), background: withAlpha(color, "1a") }}
    >
      {children}
    </span>
  );
}

function Panel({ icon, title, right, children }) {
  return (
    <section
      className="bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)]"
      style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg1)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[color:var(--t-ac)] text-sm">{icon}</span>
          <h3 className="text-[color:var(--t-tx0)] text-xs font-bold uppercase tracking-[0.12em] truncate">{title}</h3>
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function PixelAvatar() {
  return (
    <div className="relative w-16 h-16 overflow-hidden border-2 border-solid border-[color:var(--t-bd1)] bg-[#d9a066] shrink-0">
      <div className="absolute top-0 left-0 w-full h-3 bg-[#4a3527]" />
      <div className="absolute top-7 left-3.5 w-2 h-2 bg-[#2a1c14]" />
      <div className="absolute top-7 right-3.5 w-2 h-2 bg-[#2a1c14]" />
      <div className="absolute bottom-0 left-0 w-full h-4 bg-[#2f6fb0]" />
    </div>
  );
}

function FilterDropdown({ value, onChange, ariaLabel }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="appearance-none cursor-pointer pl-2.5 pr-6 py-1.5 bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-ac)] text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-[color:var(--t-ac)]"
      >
        {FILTERS.map((option) => (
          <option key={option} value={option} className="bg-[var(--t-bg2)] text-[color:var(--t-tx0)]">
            {option}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--t-ac)] text-[9px]">
        {"\u25BE"}
      </span>
    </div>
  );
}

function PodiumCard({ entry }) {
  const cfg = PODIUM[entry.rank];
  const isYou = entry.name === "You";
  return (
    <div className={`flex flex-1 max-w-[128px] flex-col items-center ${cfg.order}`}>
      <span className="text-[20px] leading-none mb-1">{cfg.trophy}</span>
      <div
        className={`${cfg.avatar} border-2 border-solid flex items-center justify-center font-bold text-[color:var(--t-ok)] mb-2`}
        style={{ borderColor: cfg.color, background: withAlpha("var(--t-ok)", "1a") }}
      >
        {entry.name.charAt(0)}
      </div>
      <p
        className="text-[12px] text-center truncate w-full"
        style={{ color: isYou ? "var(--t-ac)" : "var(--t-tx0)" }}
      >
        {entry.name}
      </p>
      <p className={`${LABEL} mb-2`}>Lvl {entry.level}</p>
      <div
        className={`${cfg.pedestal} w-full border border-b-0 border-solid flex flex-col items-center pt-2 gap-0.5`}
        style={{ borderColor: `${cfg.color}66`, background: `${cfg.color}1a`, color: cfg.color }}
      >
        <span className="text-[18px] font-bold leading-none">{entry.rank}</span>
        <span className="text-[10px]">{entry.points.toLocaleString()} pts</span>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="flex justify-between items-center py-2 border-b border-solid border-[color:var(--t-bd0)]"
    >
      <span className="text-[color:var(--t-tx1)] text-xs">{label}</span>
      <div className={`w-9 h-5 flex items-center px-0.5 ${on ? "bg-[var(--t-ac)] justify-end" : "bg-[var(--t-bg3)] justify-start"}`}>
        <div className="w-3.5 h-3.5 bg-[var(--t-tx0)]" />
      </div>
    </button>
  );
}

function LogoutConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-[340px] max-w-full bg-[var(--t-mbg)] border border-solid border-[color:var(--t-mbd)]"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}
      >
        <div className="px-4 py-3 border-b border-solid border-[color:var(--t-mbd)] flex items-center gap-2">
          <img src={IMG.logout} className="w-3.5 h-3.5 object-fill" alt="" />
          <h3 className="text-[color:var(--t-tx0)] text-xs font-bold uppercase tracking-[0.12em]">Log out</h3>
        </div>
        <div className="p-4">
          <p className="text-[color:var(--t-mtx)] text-sm mb-5">Are you sure you want to log out?</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx1)] text-xs font-bold hover:border-[color:var(--t-ac)] transition-colors"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-2 bg-[var(--t-err)] text-[color:var(--t-onerr)] text-xs font-bold hover:brightness-110 transition-all active:scale-95"
            >
              LOG OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ nav, onBack }) {
  return (
    <div
      className="flex flex-col items-start self-stretch bg-[var(--t-bg1)] p-6 sm:p-[25px] gap-3 border border-solid border-[color:var(--t-bd0)]"
      style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
    >
      <span className="text-[color:var(--t-tx0)] text-xl font-bold">{nav}</span>
      <p className="text-[color:var(--t-tx2)] text-sm max-w-md">This section isn't built out yet.</p>
      <button
        onClick={onBack}
        className="bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-ac)] text-xs font-bold py-2 px-4 hover:border-[color:var(--t-ac)] transition-colors"
      >
        BACK TO DASHBOARD
      </button>
    </div>
  );
}

/* ---------------------------------------------------------
   Dashboard — also the hub that routes to the other pages.
   Chatbot / Group Collab / Personalized each receive
   onNavigate(key) and call it for any sidebar item that isn't
   themselves, which brings the user back here (or across).
--------------------------------------------------------- */
function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme, rootThemeStyle] = useTheme(); // shared with every other page
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false); // desktop drawer: pushed to the side
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [leaderboardFilter, setLeaderboardFilter] = useState(FILTERS[0]);
  const [analyticsFilter, setAnalyticsFilter] = useState(FILTERS[0]);

  const maxXp = Math.max(...WEEKLY_ACTIVITY.map((d) => d.xp));
  const topThree = LEADERBOARD.filter((e) => e.rank <= 3);
  const rest = LEADERBOARD.filter((e) => e.rank > 3);

  const goTo = (key) => {
    setActiveNav(key);
    setMobileNavOpen(false);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    // TODO: clear auth/session state here once real auth is wired up
    navigate("/");
  };

  // The other pages bring their own sidebar/topbar, so they replace this page entirely.
  if (activeNav === "chatbot") return <Chatbot onNavigate={goTo} />;
  if (activeNav === "group") return <GroupCollab onNavigate={goTo} />;
  if (activeNav === "personalized") return <Personalized onNavigateToDashboard={() => goTo("dashboard")} onNavigateToChatbot={() => goTo("chatbot")} onNavigateToGroup={() => goTo("group")} />;

  return (
    <div style={rootThemeStyle} className="flex flex-col bg-[var(--t-bg0)] min-h-screen">
      <div className="self-stretch bg-[var(--t-bg0)] min-h-screen relative">
        <div className="flex items-start self-stretch relative">
          {/* Mobile sidebar backdrop */}
          {mobileNavOpen && (
            <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileNavOpen(false)} />
          )}

          {/* ---------------- SIDEBAR (personalized design) ---------------- */}
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
                <img src={IMG.logo} className="w-9 h-9 ml-4 mr-3 object-fill" alt="" />
                <div className="w-[127px]">
                  <div
                    className="flex flex-col items-start self-stretch"
                    style={{ boxShadow: "0px 2px 4px color-mix(in srgb, var(--t-ac) 30%, transparent)" }}
                  >
                    <span className="text-[color:var(--t-ac)] text-[17px] font-bold">CRAMMBLING</span>
                  </div>
                  <div className="flex items-center self-stretch pt-1 gap-1">
                    <div className="bg-[var(--t-ok)] w-1.5 h-1.5" />
                    <span className="text-[color:var(--t-warn)] text-[10px] font-bold">VOXEL QUEST Lv.{PLAYER.level}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start self-stretch pt-[21px] pl-5">
                <span className="text-[color:var(--t-tx2)] text-[11px] font-bold mb-[9px]">NAVIGATION BAR</span>
              </div>

              <nav className="flex flex-col self-stretch px-3 gap-1">
                {NAV_ITEMS.map((item) => {
                  const active = activeNav === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => goTo(item.key)}
                      className={`flex items-center self-stretch py-[9px] text-left border border-solid transition-all duration-150 active:scale-[0.98]
                        ${active ? "bg-[var(--t-bg3)] border-[#00000000]" : "border-[#00000000] hover:bg-[var(--t-bg2)]"}`}
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
                onClick={() => {
                  setMobileNavOpen(false);
                  setSettingsOpen(true);
                }}
                className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]"
              >
                <img src={IMG.settings} className="w-[15px] h-[15px] mx-3 object-fill" alt="" />
                <span className="text-[color:var(--t-tx1)] text-[11px]">SETTINGS</span>
              </button>
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]"
              >
                <img src={IMG.logout} className="w-3.5 h-3.5 mx-3 object-fill" alt="" />
                <span className="text-[color:var(--t-tx1)] text-[11px]">LOGOUT</span>
              </button>
            </div>
          </div>

          {/* Desktop drawer handle — pushes the navigation bar to the side and back */}
          <button
            onClick={() => setNavCollapsed((v) => !v)}
            aria-label={navCollapsed ? "Open navigation bar" : "Push navigation bar aside"}
            title={navCollapsed ? "Open navigation" : "Push navigation aside"}
            className="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[55] w-5 h-16 items-center justify-center bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] border-l-0 text-[color:var(--t-ac)] hover:bg-[var(--t-ac)] hover:text-[color:var(--t-onac)] transition-[left,background-color,color] duration-300 ease-out"
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

          {/* ---------------- MAIN ---------------- */}
          <div
            style={{ backgroundImage: "var(--t-grad-main)" }}
            className={`flex-1 bg-[var(--t-bg1)] pb-16 min-w-0 min-h-screen transition-[margin] duration-300 ease-out ${navCollapsed ? "lg:ml-0" : "lg:ml-64"}`}
          >
            {/* Top bar */}
            <div className="sticky top-0 z-30 backdrop-blur flex flex-wrap justify-between items-center gap-3 self-stretch bg-[color-mix(in_srgb,_var(--t-bg0)_40%,_transparent)] py-3 px-4 sm:px-6 mb-6">
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
                <div className="hidden sm:flex flex-col shrink-0 items-start bg-[var(--t-bg3)] py-[3px] px-[9px] border border-solid border-[color:var(--t-bd0)]">
                  <span className="text-[color:var(--t-ac)] text-[10px]">VOXEL ENGINE V2.4</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div className="flex shrink-0 items-center bg-[var(--t-bg3)] py-[5px] px-[13px] gap-[5px] border border-solid border-[color:var(--t-bd0)]">
                  <img src={IMG.streak} className="w-3 h-3.5 object-fill" alt="" />
                  <span className="text-[color:var(--t-warn)] text-[11px] font-bold hidden sm:inline">{PLAYER.streakDays} STREAK</span>
                </div>
                <div className="flex shrink-0 items-center bg-[var(--t-bg3)] py-[5px] px-[13px] gap-[5px] border border-solid border-[color:var(--t-bd0)]">
                  <img src={IMG.xp} className="w-[15px] h-[13px] object-fill" alt="" />
                  <span className="text-[color:var(--t-ac)] text-[11px] font-bold hidden sm:inline">3,420 XP</span>
                </div>

                <button className="relative shrink-0" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
                  <img src={IMG.avatar} className="w-8 h-8 object-fill" alt="" />
                  {notifOpen && (
                    <div className="absolute right-0 top-10 z-50 w-56 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] p-3 text-left shadow-lg">
                      <span className="text-[color:var(--t-tx0)] text-xs font-bold block mb-2">Notifications</span>
                      <span className="text-[color:var(--t-tx2)] text-[11px] block">CS240 Midterm is coming up on Mar 20.</span>
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
                    <span className="text-[color:var(--t-onac)] text-sm font-bold">{PLAYER.name.charAt(0)}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col self-stretch px-4 sm:px-6 lg:px-10 gap-6 text-[color:var(--t-tx0)]">
              {activeNav !== "dashboard" ? (
                <ComingSoon nav={NAV_ITEMS.find((n) => n.key === activeNav)?.label} onBack={() => goTo("dashboard")} />
              ) : (
                <>
                  {/* Player card */}
                  <section
                    className="bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] p-5"
                    style={{ boxShadow: "2px 2px 0px var(--t-shadow)" }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <PixelAvatar />
                        <div>
                          <p className={LABEL}>Welcome back</p>
                          <div className="flex items-center gap-2.5 mt-1">
                            <h1 className="text-[26px] leading-none font-bold uppercase tracking-wide">{PLAYER.name}</h1>
                            <Tag color="var(--t-ok)">[LVL {PLAYER.level}]</Tag>
                          </div>
                          <div className="flex items-center gap-3 mt-2.5 text-[13px]">
                            <span className="tracking-wide" style={{ color: "var(--t-err)" }}>
                              {"\u2764".repeat(PLAYER.hp)}
                              <span style={{ color: "var(--t-bd1)" }}>{"\u2764".repeat(PLAYER.hpMax - PLAYER.hp)}</span>
                            </span>
                            <span style={{ color: "var(--t-bd1)" }}>|</span>
                            <span className="flex gap-0.5">
                              {Array.from({ length: PLAYER.focusMax }).map((_, i) => (
                                <span
                                  key={i}
                                  className="w-2.5 h-2.5"
                                  style={{ background: i < PLAYER.focus ? "var(--t-warn)" : "var(--t-bd1)" }}
                                />
                              ))}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Tag color="var(--t-warn)">{"\u25B2"} {PLAYER.streakDays} day streak</Tag>
                        <Tag color="var(--t-ac)">{"\u23F1"} {PLAYER.studyHours} hrs studied</Tag>
                        <Tag color="var(--t-ok)">{"\u2691"} Rank #{PLAYER.rank}</Tag>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={LABEL}>Experience progress</span>
                        <span className="text-[11px] font-bold text-[color:var(--t-ac)]">
                          LVL {PLAYER.level} - {PLAYER.xpPercent}%
                        </span>
                      </div>
                      <div className="w-full h-3.5 bg-[var(--t-bg0)] border border-solid border-[color:var(--t-bd0)]">
                        <div
                          className="h-full bg-[var(--t-ok)]"
                          style={{
                            width: `${PLAYER.xpPercent}%`,
                            backgroundImage: "repeating-linear-gradient(90deg, transparent 0 9px, rgba(0,0,0,0.3) 9px 10px)",
                          }}
                        />
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                    {/* Leaderboard */}
                    <Panel
                      icon={"\u26C6"}
                      title="Class Leaderboard"
                      right={<FilterDropdown value={leaderboardFilter} onChange={setLeaderboardFilter} ariaLabel="Filter leaderboard" />}
                    >
                      <div className="flex items-end justify-center gap-3 mb-5">
                        {topThree.map((entry) => (
                          <PodiumCard key={entry.rank} entry={entry} />
                        ))}
                      </div>

                      <div className="flex flex-col gap-2">
                        {rest.map((entry) => {
                          const isYou = entry.name === "You";
                          return (
                            <div
                              key={entry.rank}
                              className="flex items-center justify-between px-3 py-2 border border-solid"
                              style={{
                                borderColor: isYou ? withAlpha("var(--t-ac)", "66") : "var(--t-bd0)",
                                background: isYou ? withAlpha("var(--t-ac)", "1a") : "var(--t-bg3)",
                              }}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-7 h-7 shrink-0 border border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg0)] flex items-center justify-center text-[11px] font-bold text-[color:var(--t-tx2)]">
                                  {entry.rank}
                                </span>
                                <span
                                  className="w-7 h-7 shrink-0 border border-solid flex items-center justify-center text-[12px] font-bold text-[color:var(--t-ok)]"
                                  style={{ borderColor: withAlpha("var(--t-ok)", "66"), background: withAlpha("var(--t-ok)", "1a") }}
                                >
                                  {entry.name.charAt(0)}
                                </span>
                                <span className="text-[13px] truncate" style={{ color: isYou ? "var(--t-ac)" : "var(--t-tx0)" }}>
                                  {entry.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-[11px] shrink-0">
                                <span className="text-[color:var(--t-warn)]">Lvl {entry.level}</span>
                                <span className="text-[color:var(--t-tx2)] w-20 text-right">{entry.points.toLocaleString()} pts</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Panel>

                    {/* Analytics */}
                    <Panel
                      icon={"\u25A4"}
                      title="Analytics"
                      right={<FilterDropdown value={analyticsFilter} onChange={setAnalyticsFilter} ariaLabel="Filter analytics" />}
                    >
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {ANALYTICS_STATS.map((stat, i) => (
                          <div
                            key={stat.label}
                            className={`border border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg3)] px-4 py-3 ${i === ANALYTICS_STATS.length - 1 && ANALYTICS_STATS.length % 2 ? "col-span-2" : ""
                              }`}
                          >
                            <p className="text-[22px] font-bold leading-none" style={{ color: stat.color }}>
                              {stat.value}
                            </p>
                            <p className={`${LABEL} mt-1.5`}>{stat.label}</p>
                          </div>
                        ))}
                      </div>

                      <p className={`${LABEL} mb-2`}>Weekly activity</p>
                      <div className="border border-solid border-[color:var(--t-bd0)] bg-[var(--t-bg3)] p-3">
                        <div className="flex items-end justify-between gap-2 h-28 px-1">
                          {WEEKLY_ACTIVITY.map((d) => (
                            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                              <div className="w-full flex items-end justify-center h-20">
                                <div
                                  className="w-full max-w-[24px]"
                                  style={{
                                    height: `${(d.xp / maxXp) * 100}%`,
                                    background: d.xp === maxXp ? "var(--t-warn)" : "var(--t-ok)",
                                  }}
                                  title={`${d.xp} XP`}
                                />
                              </div>
                              <span className={LABEL}>{d.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Panel>
                  </div>

                  <QuizHistory />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Settings drawer — same design as chatbot / group collab / personalized */}
        {settingsOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="flex-1 bg-black/60" onClick={() => setSettingsOpen(false)} />
            <div className="w-full max-w-xs bg-[var(--t-bg2)] border-l border-solid border-[color:var(--t-bd0)] p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[color:var(--t-tx0)] text-sm font-bold">SETTINGS</span>
                <button onClick={() => setSettingsOpen(false)} aria-label="Close settings">
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
              <ThemePicker theme={theme} onChange={setTheme} />
              <ToggleRow label="Email reminders" />
              <ToggleRow label="Group session pings" defaultOn />
              <ToggleRow label="Voxel quest sound effects" />
            </div>
          </div>
        )}

        {showLogoutConfirm && (
          <LogoutConfirmModal onConfirm={handleConfirmLogout} onCancel={() => setShowLogoutConfirm(false)} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
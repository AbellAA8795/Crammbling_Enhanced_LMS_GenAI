import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Panel } from "../components/Panel";
import QuizHistory from "../components/QuizHistory";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "\u2302" },
  { id: "chatbot", label: "Chatbot", icon: "\u25A3" },
  { id: "group-collab", label: "Group Collab", icon: "\u2637" },
  { id: "quiz-arena", label: "Quiz Arena", icon: "\u2694" },
  { id: "personalized", label: "Personalized", icon: "\u2338" },
];

const BOTTOM_NAV_ITEMS = [
  { id: "settings", label: "Settings", icon: "\u2699" },
  { id: "logout", label: "Log Out", icon: "\u23FB" },
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
  { label: "Total XP", value: "3,420", color: "text-cyan" },
  { label: "Current Level", value: "18", color: "text-lime" },
  { label: "Study Streak", value: "14 days", color: "text-gold" },
  { label: "Quizzes Completed", value: "47", color: "text-cyan" },
  { label: "Avg. Accuracy", value: "82%", color: "text-lime" },
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

const PODIUM = {
  1: { order: "order-2", trophy: "\u{1F3C6}", color: "#f4c542", pedestal: "h-24", avatar: "w-14 h-14 text-[20px]" },
  2: { order: "order-1", trophy: "\u{1F948}", color: "#cfc8bf", pedestal: "h-16", avatar: "w-11 h-11 text-[15px]" },
  3: { order: "order-3", trophy: "\u{1F949}", color: "#d08a52", pedestal: "h-12", avatar: "w-11 h-11 text-[15px]" },
};

function PixelAvatar() {
  return (
    <div className="relative w-16 h-16 overflow-hidden border-2 border-edge bg-[#d9a066] shrink-0">
      <div className="absolute top-0 left-0 w-full h-3 bg-[#4a3527]" />
      <div className="absolute top-7 left-3.5 w-2 h-2 bg-[#2a1c14]" />
      <div className="absolute top-7 right-3.5 w-2 h-2 bg-[#2a1c14]" />
      <div className="absolute bottom-0 left-0 w-full h-4 bg-[#2f6fb0]" />
    </div>
  );
}

function LogoutConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div role="dialog" aria-modal="true" className="panel w-[340px]">
        <div className="px-4 py-3 border-b border-edge bg-bar flex items-center gap-2">
          <span className="text-danger">{"\u23FB"}</span>
          <h3 className="panel-title">Log out</h3>
        </div>
        <div className="p-4">
          <p className="font-display text-[14px] text-mute mb-5">Are you sure you want to log out?</p>
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="btn btn-ghost flex-1">
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="btn flex-1 bg-danger text-ink shadow-[inset_0_-3px_0_rgba(0,0,0,0.28)] hover:brightness-110"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
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
        className="appearance-none cursor-pointer pl-2.5 pr-6 py-1.5 bg-inset border border-edge text-cyan font-label text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-cyan/60"
      >
        {FILTERS.map((option) => (
          <option key={option} value={option} className="bg-panel text-ink">
            {option}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-cyan text-[9px]">
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
        className={`${cfg.avatar} border-2 bg-lime/10 flex items-center justify-center font-display font-bold text-lime mb-2`}
        style={{ borderColor: cfg.color }}
      >
        {entry.name.charAt(0)}
      </div>
      <p className={`font-display text-[12px] text-center truncate w-full ${isYou ? "text-cyan" : "text-ink"}`}>
        {entry.name}
      </p>
      <p className="label mb-2">Lvl {entry.level}</p>
      <div
        className={`${cfg.pedestal} w-full border border-b-0 flex flex-col items-center pt-2 gap-0.5`}
        style={{ borderColor: `${cfg.color}66`, background: `${cfg.color}1a`, color: cfg.color }}
      >
        <span className="font-display text-[18px] font-bold leading-none">{entry.rank}</span>
        <span className="font-label text-[10px]">{entry.points.toLocaleString()} pts</span>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [leaderboardFilter, setLeaderboardFilter] = useState(FILTERS[0]);
  const [analyticsFilter, setAnalyticsFilter] = useState(FILTERS[0]);
  const maxXp = Math.max(...WEEKLY_ACTIVITY.map((d) => d.xp));
  const topThree = LEADERBOARD.filter((e) => e.rank <= 3);
  const rest = LEADERBOARD.filter((e) => e.rank > 3);

  const handleBottomNavClick = (id) => {
    if (id === "logout") {
      setShowLogoutConfirm(true);
      return;
    }
    setActiveNav(id);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    // TODO: clear auth/session state here once real auth is wired up
    navigate("/");
  };

  const navButton = (item, isActive, onClick, extra = "") => (
    <button
      key={item.id}
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 text-left px-3 py-2.5 border font-label text-[12px] font-bold uppercase tracking-[0.1em] cursor-pointer transition-colors duration-100 ${
        isActive
          ? "bg-inset border-edge text-ink"
          : "border-transparent text-mute hover:bg-inset/60 hover:text-ink"
      } ${extra}`}
    >
      <span className={`text-[14px] ${extra ? "" : "text-cyan"}`}>{item.icon}</span>
      {item.label}
    </button>
  );

  return (
    <div className="h-screen w-full flex flex-col bg-deep text-ink font-display overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 h-14 bg-bar border-b border-edge shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-cyan/50 bg-cyan/10 flex items-center justify-center text-cyan font-label text-[13px] font-bold">
            C
          </div>
          <span className="text-[17px] font-bold tracking-[0.12em]">CRAMMBLING</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="w-9 h-9 bg-inset border border-edge flex items-center justify-center cursor-pointer hover:border-mute transition-colors duration-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-mute" aria-hidden="true">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Profile"
            className="w-9 h-9 bg-cyan flex items-center justify-center text-deep font-label text-sm font-bold cursor-pointer shadow-[inset_0_-3px_0_rgba(0,0,0,0.25)]"
          >
            J
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <nav className="w-56 shrink-0 bg-bar border-r border-edge py-5 px-3 flex flex-col gap-1">
          <p className="label px-3 mb-2 text-faint">Navigation Bar</p>
          {NAV_ITEMS.map((item) => navButton(item, activeNav === item.id, () => setActiveNav(item.id)))}

          <div className="mt-auto pt-3 border-t border-edge flex flex-col gap-1">
            {BOTTOM_NAV_ITEMS.map((item) =>
              navButton(
                item,
                activeNav === item.id,
                () => handleBottomNavClick(item.id),
                item.id === "logout" ? "text-danger! hover:bg-danger/10!" : ""
              )
            )}
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 p-6 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#2e2521_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-edge">
          {activeNav === "dashboard" ? (
            <div className="flex flex-col gap-6">
              {/* Player card */}
              <section className="panel p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <PixelAvatar />
                    <div>
                      <p className="label">Welcome back</p>
                      <div className="flex items-center gap-2.5 mt-1">
                        <h1 className="text-[26px] leading-none font-bold uppercase tracking-wide">
                          {PLAYER.name}
                        </h1>
                        <span className="tag tag-lime">[LVL {PLAYER.level}]</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2.5 text-[13px]">
                        <span className="text-danger tracking-wide">
                          {"\u2764".repeat(PLAYER.hp)}
                          <span className="text-edge">{"\u2764".repeat(PLAYER.hpMax - PLAYER.hp)}</span>
                        </span>
                        <span className="text-edge">|</span>
                        <span className="flex gap-0.5">
                          {Array.from({ length: PLAYER.focusMax }).map((_, i) => (
                            <span key={i} className={`w-2.5 h-2.5 ${i < PLAYER.focus ? "bg-gold" : "bg-edge"}`} />
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tag tag-gold">{"\u25B2"} {PLAYER.streakDays} day streak</span>
                    <span className="tag tag-cyan">{"\u23F1"} {PLAYER.studyHours} hrs studied</span>
                    <span className="tag tag-lime">{"\u2691"} Rank #{PLAYER.rank}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="label">Experience progress</span>
                    <span className="font-label text-[11px] font-bold text-cyan">
                      LVL {PLAYER.level} - {PLAYER.xpPercent}%
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-deep border border-edge">
                    <div
                      className="h-full bg-lime"
                      style={{
                        width: `${PLAYER.xpPercent}%`,
                        backgroundImage:
                          "repeating-linear-gradient(90deg, transparent 0 9px, rgba(0,0,0,0.3) 9px 10px)",
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
                  right={
                    <FilterDropdown
                      value={leaderboardFilter}
                      onChange={setLeaderboardFilter}
                      ariaLabel="Filter leaderboard"
                    />
                  }
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
                          className={`flex items-center justify-between px-3 py-2 border ${
                            isYou ? "border-cyan/40 bg-cyan/10" : "border-edge bg-inset"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 border border-edge bg-deep flex items-center justify-center font-label text-[11px] font-bold text-mute">
                              {entry.rank}
                            </span>
                            <span className="w-7 h-7 border border-lime/40 bg-lime/10 flex items-center justify-center font-display text-[12px] font-bold text-lime">
                              {entry.name.charAt(0)}
                            </span>
                            <span className={`font-display text-[13px] ${isYou ? "text-cyan" : "text-ink"}`}>
                              {entry.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 font-label text-[11px]">
                            <span className="text-gold">Lvl {entry.level}</span>
                            <span className="text-mute w-20 text-right">{entry.points.toLocaleString()} pts</span>
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
                  right={
                    <FilterDropdown
                      value={analyticsFilter}
                      onChange={setAnalyticsFilter}
                      ariaLabel="Filter analytics"
                    />
                  }
                >
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {ANALYTICS_STATS.map((stat, i) => (
                      <div
                        key={stat.label}
                        className={`border border-edge bg-inset px-4 py-3 ${
                          i === ANALYTICS_STATS.length - 1 && ANALYTICS_STATS.length % 2 ? "col-span-2" : ""
                        }`}
                      >
                        <p className={`font-display text-[22px] font-bold leading-none ${stat.color}`}>
                          {stat.value}
                        </p>
                        <p className="label mt-1.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <p className="label mb-2">Weekly activity</p>
                  <div className="border border-edge bg-inset p-3">
                    <div className="flex items-end justify-between gap-2 h-28 px-1">
                      {WEEKLY_ACTIVITY.map((d) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex items-end justify-center h-20">
                            <div
                              className={`w-full max-w-[24px] ${d.xp === maxXp ? "bg-gold" : "bg-lime"}`}
                              style={{ height: `${(d.xp / maxXp) * 100}%` }}
                              title={`${d.xp} XP`}
                            />
                          </div>
                          <span className="label text-faint">{d.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
              </div>

              <QuizHistory />
            </div>
          ) : (
            <div className="h-full border border-dashed border-edge flex items-center justify-center label">
              Page content goes here
            </div>
          )}
        </main>
      </div>

      {showLogoutConfirm && (
        <LogoutConfirmModal onConfirm={handleConfirmLogout} onCancel={() => setShowLogoutConfirm(false)} />
      )}
    </div>
  );
}

export default Dashboard;
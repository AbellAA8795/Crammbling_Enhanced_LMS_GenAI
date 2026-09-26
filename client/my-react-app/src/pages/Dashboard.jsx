import { useState } from "react";
import { useNavigate } from "react-router-dom";
import notificationIcon from "../assets/notification.svg";

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

const LEADERBOARD_FILTERS = ["This Week", "This Month", "All Time"];
const ANALYTICS_FILTERS = ["This Week", "This Month", "All Time"];

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
  { label: "Total XP", value: "3,420" },
  { label: "Current Level", value: "18" },
  { label: "Study Streak", value: "14 days" },
  { label: "Quizzes Completed", value: "47" },
  { label: "Avg. Accuracy", value: "82%" },
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

const RANK_STYLES = {
  1: "text-[#d4a94a] border-[#d4a94a]/50 bg-[#d4a94a]/10",
  2: "text-[#c8c2b8] border-[#c8c2b8]/40 bg-[#c8c2b8]/10",
  3: "text-[#c98a4f] border-[#c98a4f]/40 bg-[#c98a4f]/10",
};

const PODIUM_CONFIG = {
  1: {
    order: "order-2",
    trophy: "\u{1F3C6}",
    ring: "border-[#d4a94a]",
    glow: "shadow-[0_0_18px_-2px_rgba(212,169,74,0.5)]",
    pedestal: "h-24 border-[#d4a94a]/60 bg-gradient-to-b from-[#d4a94a]/20 to-[#d4a94a]/5 text-[#d4a94a]",
    avatarSize: "w-16 h-16 text-[20px]",
  },
  2: {
    order: "order-1",
    trophy: "\u{1F948}",
    ring: "border-[#c8c2b8]",
    glow: "",
    pedestal: "h-16 border-[#c8c2b8]/50 bg-gradient-to-b from-[#c8c2b8]/15 to-[#c8c2b8]/5 text-[#c8c2b8]",
    avatarSize: "w-12 h-12 text-[15px]",
  },
  3: {
    order: "order-3",
    trophy: "\u{1F949}",
    ring: "border-[#c98a4f]",
    glow: "",
    pedestal: "h-12 border-[#c98a4f]/50 bg-gradient-to-b from-[#c98a4f]/15 to-[#c98a4f]/5 text-[#c98a4f]",
    avatarSize: "w-12 h-12 text-[15px]",
  },
};

function PixelAvatar() {
  return (
    <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-[#3a2e26] bg-[#d9a066] shrink-0">
      <div className="absolute top-0 left-0 w-full h-3 bg-[#4a3527]" />
      <div className="absolute top-7 left-3.5 w-2 h-2 bg-[#2a1c14]" />
      <div className="absolute top-7 right-3.5 w-2 h-2 bg-[#2a1c14]" />
      <div className="absolute bottom-0 left-0 w-full h-4 bg-[#2f6fb0]" />
    </div>
  );
}

function StatChip({ icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#120d0b] border border-[#3a2e26]">
      <span className="text-[15px]" style={{ color: accent }}>
        {icon}
      </span>
      <div className="leading-tight">
        <p className="text-[#6b6156] text-[10px] tracking-wide">{label}</p>
        <p className="text-white text-[13px] font-bold tracking-wide">{value}</p>
      </div>
    </div>
  );
}

function PanelHeader({ icon, title, tag, right }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-[#22d3ee] text-[16px]">{icon}</span>
        <h2 className="text-white text-[14px] tracking-[1.5px]">{title}</h2>
      </div>
      {right ? (
        right
      ) : (
        tag && (
          <span className="px-2.5 py-1 rounded-md bg-[#22d3ee]/15 border border-[#22d3ee]/40 text-[#22d3ee] text-[10px] tracking-wide">
            {tag}
          </span>
        )
      )}
    </div>
  );
}

function LogoutConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[320px] rounded-2xl border border-[#3a2e26] bg-[#1c1310] p-6 shadow-[0_0_30px_-5px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-[#e05252] text-[18px]">{"\u23FB"}</span>
          <h3 className="text-white text-[15px] tracking-wide">Log out</h3>
        </div>
        <p className="text-[#9c948a] text-[13px] tracking-wide leading-relaxed mb-6">
          Are you sure you want to log out? 
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-3 py-2.5 rounded-lg text-[13px] tracking-wide text-white border border-[#3a2e26] bg-[#120d0b] hover:bg-[#0d0907] transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-3 py-2.5 rounded-lg text-[13px] tracking-wide text-white bg-[#e05252] hover:bg-[#c94646] transition-colors duration-150"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterDropdown({ options, value, onChange, ariaLabel }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="appearance-none cursor-pointer pl-3 pr-7 py-1.5 rounded-md bg-[#22d3ee]/15 border border-[#22d3ee]/40 text-[#22d3ee] text-[10px] tracking-wide focus:outline-none focus:border-[#22d3ee]/70 hover:bg-[#22d3ee]/20 transition-colors duration-150"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#1c1310] text-white">
            {option}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#22d3ee] text-[9px]">
        {"\u25BE"}
      </span>
    </div>
  );
}

function PodiumCard({ entry }) {
  const config = PODIUM_CONFIG[entry.rank];
  const isYou = entry.name === "You";

  return (
    <div className={`flex flex-1 max-w-[128px] flex-col items-center ${config.order}`}>
      <span className="text-[20px] mb-1 leading-none">{config.trophy}</span>
      <div
        className={`${config.avatarSize} ${config.ring} ${config.glow} rounded-full border-2 bg-[#8bc34a]/20 flex items-center justify-center font-bold text-[#8bc34a] mb-2`}
      >
        {entry.name.charAt(0)}
      </div>
      <p
        className={`text-[12px] tracking-wide text-center truncate w-full ${
          isYou ? "text-[#22d3ee]" : "text-white"
        }`}
      >
        {entry.name}
      </p>
      <p className="text-[#9c948a] text-[10px] tracking-wide mb-2">Lvl {entry.level}</p>
      <div
        className={`w-full rounded-t-lg border border-b-0 flex flex-col items-center justify-start pt-2 gap-0.5 ${config.pedestal}`}
      >
        <span className="text-[16px] font-bold">{entry.rank}</span>
        <span className="text-[10px] tracking-wide opacity-90">
          {entry.points.toLocaleString()} pts
        </span>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [leaderboardFilter, setLeaderboardFilter] = useState(LEADERBOARD_FILTERS[0]);
  const [analyticsFilter, setAnalyticsFilter] = useState(ANALYTICS_FILTERS[0]);
  const maxXp = Math.max(...WEEKLY_ACTIVITY.map((d) => d.xp));
  const topThree = LEADERBOARD.filter((entry) => entry.rank <= 3);
  const rest = LEADERBOARD.filter((entry) => entry.rank > 3);

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

  return (
    <div className="h-screen w-full flex flex-col bg-[#0d0907] font-mono overflow-hidden">
      {/* Top navbar */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#1c1310] border-b border-[#3a2e26] shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 bg-[#8bc34a]/20 border border-[#8bc34a]/50 flex items-center justify-center text-[#8bc34a] text-xs font-bold"
            style={{ clipPath: "polygon(25% 5%,75% 5%,100% 50%,75% 95%,25% 95%,0% 50%)" }}
          >
            C
          </div>
          <span className="text-white text-[17px] font-bold tracking-[2px]">
            CRAMMBLING
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="w-8 h-8 rounded-full bg-[#120d0b] border border-[#3a2e26] flex items-center justify-center hover:bg-[#1c1310] transition-colors duration-150"
          >
            <img src={notificationIcon} alt="" className="w-4 h-4 opacity-70 brightness-150" />
          </button>
          <button
            type="button"
            aria-label="Profile"
            className="w-8 h-8 rounded-full bg-[#22d3ee] flex items-center justify-center text-[#0d0907] text-sm font-bold"
          >
            J
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <nav className="w-56 shrink-0 bg-[#1c1310] border-r border-[#3a2e26] py-6 px-3 flex flex-col gap-1">
          <p className="text-[#6b6156] text-[12px] tracking-wide px-3 mb-2">
            NAVIGATION BAR
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg text-[14px] tracking-wide transition-colors duration-150 ${
                  isActive
                    ? "bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/40"
                    : "text-white border border-transparent hover:bg-[#120d0b] hover:text-[#22d3ee]"
                }`}
              >
                <span className="text-[14px]">{item.icon}</span>
                {item.label}
              </button>
            );
          })}

          {/* Bottom nav: settings and log out*/}
          <div className="mt-auto pt-3 border-t border-[#3a2e26] flex flex-col gap-1">
            {BOTTOM_NAV_ITEMS.map((item) => {
              const isLogout = item.id === "logout";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleBottomNavClick(item.id)}
                  className={`flex items-center gap-2.5 text-left px-3 py-2.5 rounded-lg text-[14px] tracking-wide transition-colors duration-150 border border-transparent ${
                    isLogout
                      ? "text-[#e05252] hover:bg-[#e05252]/10 hover:border-[#e05252]/30"
                      : "text-white hover:bg-[#120d0b] hover:text-[#22d3ee]"
                  }`}
                >
                  <span className="text-[14px]">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main content area */}
        <main
          className="flex-1 p-6 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#3a2e26_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#3a2e26] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#4a3527]"
        >
          {activeNav === "dashboard" ? (
            <div className="flex flex-col gap-6">
              {/* Player card */}
              <section className="rounded-2xl border border-[#3a2e26] bg-[#1c1310] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <PixelAvatar />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white text-[18px] font-bold tracking-wide">
                          {PLAYER.name.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#8bc34a]/15 border border-[#8bc34a]/40 text-[#8bc34a] text-[10px] tracking-wide">
                          LVL {PLAYER.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] tracking-wide">
                        <span className="text-[#e05252]">
                          {"\u2764".repeat(PLAYER.hp)}
                          <span className="text-[#3a2e26]">
                            {"\u2764".repeat(PLAYER.hpMax - PLAYER.hp)}
                          </span>
                        </span>
                        <span className="text-[#3a2e26]">|</span>
                        <span className="flex gap-0.5">
                          {Array.from({ length: PLAYER.focusMax }).map((_, i) => (
                            <span
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < PLAYER.focus ? "bg-[#d4a94a]" : "bg-[#3a2e26]"
                              }`}
                            />
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <StatChip icon={"\u25B2"} label="STREAK" value={`${PLAYER.streakDays} DAYS`} accent="#d4a94a" />
                    <StatChip icon={"\u23F1"} label="STUDY HOURS" value={`${PLAYER.studyHours} HRS`} accent="#22d3ee" />
                    <StatChip icon={"\u2691"} label="TOP PERFORMER" value={`RANK #${PLAYER.rank}`} accent="#8bc34a" />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-[11px] tracking-wide mb-1.5">
                    <span className="text-[#9c948a]">EXPERIENCE PROGRESS</span>
                    <span className="text-[#22d3ee]">
                      LVL {PLAYER.level} ({PLAYER.xpPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#120d0b] border border-[#3a2e26] overflow-hidden">
                    <div
                      className="h-full bg-[#8bc34a] rounded-full"
                      style={{ width: `${PLAYER.xpPercent}%` }}
                    />
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Leaderboard */}
                <section className="rounded-2xl border border-[#3a2e26] bg-[#1c1310] p-6">
                  <PanelHeader
                    icon={"\u26C6"}
                    title="CLASS LEADERBOARD"
                    right={
                      <FilterDropdown
                        options={LEADERBOARD_FILTERS}
                        value={leaderboardFilter}
                        onChange={setLeaderboardFilter}
                        ariaLabel="Filter leaderboard"
                      />
                    }
                  />

                  {/* Podium for ranks 1-3 */}
                  <div className="flex items-end justify-center gap-3 mb-5 pb-1">
                    {topThree.map((entry) => (
                      <PodiumCard key={entry.rank} entry={entry} />
                    ))}
                  </div>

                  {/* Ranks 4-10 */}
                  <div className="flex flex-col gap-2">
                    {rest.map((entry) => {
                      const isYou = entry.name === "You";
                      return (
                        <div
                          key={entry.rank}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${
                            isYou
                              ? "border-[#22d3ee]/40 bg-[#22d3ee]/10"
                              : "border-[#3a2e26] bg-[#120d0b]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-bold text-[#9c948a] border-[#3a2e26] bg-[#120d0b]">
                              {entry.rank}
                            </span>
                            <span className="w-7 h-7 rounded-full bg-[#8bc34a]/20 border border-[#8bc34a]/40 flex items-center justify-center text-[#8bc34a] text-[11px] font-bold">
                              {entry.name.charAt(0)}
                            </span>
                            <span
                              className={`text-[12px] tracking-wide ${
                                isYou ? "text-[#22d3ee]" : "text-white"
                              }`}
                            >
                              {entry.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[#d4a94a] text-[11px] tracking-wide">
                              Lvl {entry.level}
                            </span>
                            <span className="text-[#9c948a] text-[11px] tracking-wide w-16 text-right">
                              {entry.points.toLocaleString()} pts
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Analytics */}
                <section className="relative overflow-hidden rounded-2xl border border-[#3a2e26] bg-[#1c1310] p-6">
                 
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 15% 0%, rgba(34,211,238,0.14), transparent 55%), radial-gradient(circle at 100% 100%, rgba(139,195,74,0.10), transparent 50%)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                      backgroundSize: "22px 22px",
                    }}
                  />

                  <div className="relative">
                    <PanelHeader
                      icon={"\u25A4"}
                      title="ANALYTICS"
                      right={
                        <FilterDropdown
                          options={ANALYTICS_FILTERS}
                          value={analyticsFilter}
                          onChange={setAnalyticsFilter}
                          ariaLabel="Filter analytics"
                        />
                      }
                    />

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {ANALYTICS_STATS.map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-xl border border-[#3a2e26] bg-[#120d0b]/80 backdrop-blur-sm px-4 py-3"
                        >
                          <p className="text-[#22d3ee] text-[17px] font-bold">
                            {stat.value}
                          </p>
                          <p className="text-[#9c948a] text-[10px] tracking-wide mt-1">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[#9c948a] text-[11px] tracking-wide mb-3">
                      Weekly Activity
                    </p>
                    <div className="rounded-xl border border-[#3a2e26] bg-[#120d0b]/60 backdrop-blur-sm p-3">
                      <div className="flex items-end justify-between gap-2 h-28 px-1">
                        {WEEKLY_ACTIVITY.map((d) => (
                          <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex items-end justify-center h-20">
                              <div
                                className="w-full max-w-[24px] rounded-t-md bg-gradient-to-t from-[#8bc34a]/40 to-[#8bc34a]"
                                style={{ height: `${(d.xp / maxXp) * 100}%` }}
                              />
                            </div>
                            <span className="text-[#6b6156] text-[10px] tracking-wide">
                              {d.day}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="h-full rounded-2xl border border-dashed border-[#3a2e26] flex items-center justify-center text-[#5a5048] text-[14px] tracking-wide">
              Page content goes here
            </div>
          )}
        </main>
      </div>

      {showLogoutConfirm && (
        <LogoutConfirmModal
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
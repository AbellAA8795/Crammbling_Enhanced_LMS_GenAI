import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Panel } from "../components/Panel";
import QuizHistory from "../components/QuizHistory";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import Settings from "../components/Settings";
import QuizArena from "./QuizArena";
import { useTheme, CloseIcon } from "./Theme";

import firstCramBadge from "../assets/first_cram_badge.svg";
import quizRookieBadge from "../assets/quiz_rookie_badge.svg";
import quizVeteranBadge from "../assets/quiz_veteran_badge.svg";
import questionCrusherBadge from "../assets/question_crusher_badge.svg";
import questionMachineBadge from "../assets/question_machine_badge.svg";
import perfectCramBadge from "../assets/perfect_cram_badge.svg";
import flawlessFiveBadge from "../assets/flawless_five_badge.svg";
import accuracyAceBadge from "../assets/accuracy_ace_badge.svg";
import comebackCrammerBadge from "../assets/comeback_crammer_badge.svg";
import retakeWarriorBadge from "../assets/retake_warrior_badge.svg";
import noHintsBadge from "../assets/no_hints_badge.svg";
import hardModeHeroBadge from "../assets/hard_mode_hero_badge.svg";
import speedRunBadge from "../assets/speed_run_badge.svg";
import blitzMasterBadge from "../assets/blitz_master_badge.svg";
import quizArchitectBadge from "../assets/quiz_architect_badge.svg";
import promptToPassBadge from "../assets/prompt_to_pass_badge.svg";
import adaptiveAceBadge from "../assets/adaptive_ace_badge.svg";
import mistakeMinerBadge from "../assets/mistake_miner_badge.svg";
import quizStreakBadge from "../assets/quiz_streak_badge.svg";
import quizMarathonBadge from "../assets/quiz_marathon_badge.svg";

// Same icon art, labels and layout as the Chatbot / Group Collab / Personalized sidebar.
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
  avatar: NAV_ASSET("24khomt6"),
};

const NAV_ITEMS = [
  { key: "dashboard", label: "DASHBOARD", icon: NAV_IMG.dashboard, iconClass: "w-[18px] h-[15px]", path: "/dashboard" },
  { key: "chatbot", label: "CHATBOT", icon: NAV_IMG.chatbot, iconClass: "w-[18px] h-[15px]", path: "/chatbot" },
  { key: "group", label: "GROUP COLLAB", icon: NAV_IMG.group, iconClass: "w-5 h-2.5", path: "/group-collab" },
  { key: "personalized", label: "PERSONALIZED", icon: NAV_IMG.personalized, iconClass: "w-[18px] h-[13px]", path: "/personalized" },
];

// The other pages use the plain sans-serif font, so the Dashboard does too.
const SANS = 'ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif';

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

// `unlocked` is placeholder data. Replace with real stats from the backend later.
const ACHIEVEMENTS = [
  { id: "first-cram", name: "First Cram", mission: "Complete your first AI-generated quiz.", quote: "Every legend starts with one question.", badge: firstCramBadge, unlocked: true },
  { id: "quiz-rookie", name: "Quiz Rookie", mission: "Complete 10 quizzes.", quote: "You\u2019re warming up. The questions are starting to fear you.", badge: quizRookieBadge, unlocked: true },
  { id: "quiz-veteran", name: "Quiz Veteran", mission: "Complete 50 quizzes.", quote: "You\u2019ve seen it all: easy, hard, and weirdly specific.", badge: quizVeteranBadge, unlocked: false },
  { id: "question-crusher", name: "Question Crusher", mission: "Answer 100 quiz questions correctly.", quote: "One hundred down. Your brain is getting swole.", badge: questionCrusherBadge, unlocked: true },
  { id: "question-machine", name: "Question Machine", mission: "Answer 500 quiz questions correctly.", quote: "At this point, multiple choice feels like a conversation.", badge: questionMachineBadge, unlocked: false },
  { id: "perfect-cram", name: "Perfect Cram", mission: "Score 100% on any quiz.", quote: "No misses. No mercy.", badge: perfectCramBadge, unlocked: true },
  { id: "flawless-five", name: "Flawless Five", mission: "Score 100% on 5 different quizzes.", quote: "Perfection isn\u2019t a fluke. It\u2019s a habit.", badge: flawlessFiveBadge, unlocked: false },
  { id: "accuracy-ace", name: "Accuracy Ace", mission: "Maintain a 95%+ average across 20 quizzes.", quote: "Consistently brilliant. Annoyingly good.", badge: accuracyAceBadge, unlocked: false },
  { id: "comeback-crammer", name: "Comeback Crammer", mission: "Fail a quiz, then pass the same quiz within 24 hours.", quote: "You didn\u2019t just retake it. You redeemed it.", badge: comebackCrammerBadge, unlocked: true },
  { id: "retake-warrior", name: "Retake Warrior", mission: "Retake a quiz 5 times until you pass.", quote: "Persistence beats talent when talent gives up.", badge: retakeWarriorBadge, unlocked: false },
  { id: "no-hints", name: "No Hints Needed", mission: "Score 100% on a quiz without hints or AI help.", quote: "Just you, the question, and the truth.", badge: noHintsBadge, unlocked: false },
  { id: "hard-mode-hero", name: "Hard Mode Hero", mission: "Score 90%+ on a hard-difficulty quiz.", quote: "You chose violence. And won.", badge: hardModeHeroBadge, unlocked: false },
  { id: "speed-run", name: "Speed Run", mission: "Finish a timed quiz with 90%+ in under 2 minutes.", quote: "Fast fingers, faster brain.", badge: speedRunBadge, unlocked: false },
  { id: "blitz-master", name: "Blitz Master", mission: "Complete 10 timed quizzes with 90%+ accuracy.", quote: "You don\u2019t just survive the clock. You own it.", badge: blitzMasterBadge, unlocked: false },
  { id: "quiz-architect", name: "Quiz Architect", mission: "Generate 25 quizzes using the AI quiz generator.", quote: "You\u2019re not just taking quizzes. You\u2019re building them.", badge: quizArchitectBadge, unlocked: false },
  { id: "prompt-to-pass", name: "Prompt to Pass", mission: "Generate a quiz from a custom prompt and score 100%.", quote: "You asked the right question and answered it perfectly.", badge: promptToPassBadge, unlocked: false },
  { id: "adaptive-ace", name: "Adaptive Ace", mission: "Score 100% on an adaptive-difficulty quiz.", quote: "The AI tried to challenge you. You challenged it back.", badge: adaptiveAceBadge, unlocked: false },
  { id: "mistake-miner", name: "Mistake Miner", mission: "Review every incorrect answer from 10 quizzes.", quote: "Mistakes are just clues. You followed them all.", badge: mistakeMinerBadge, unlocked: false },
  { id: "quiz-streak", name: "Quiz Streak", mission: "Complete at least one quiz every day for 7 days.", quote: "Seven days. Seven quizzes. Zero excuses.", badge: quizStreakBadge, unlocked: true },
  { id: "quiz-marathon", name: "Quiz Marathon", mission: "Complete 10 quizzes in one day.", quote: "Cramming? No. This is a full-on quiz endurance event.", badge: quizMarathonBadge, unlocked: false },
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

function AchievementsSection() {
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <div className="mt-5 flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between mb-2">
        <p className="label">Achievements</p>
        <span className="font-label text-[11px] font-bold text-gold">
          {unlockedCount} / {ACHIEVEMENTS.length}
        </span>
      </div>

      {/* The list fills whatever height is left, so Analytics always ends level with the Leaderboard */}
      <div className="relative flex-1 min-h-[300px] xl:min-h-[160px] border border-edge bg-inset">
        <ul className="absolute inset-0 p-2 flex flex-col gap-2 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--t-bd0,#2e2521)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-edge">
          {ACHIEVEMENTS.map((a) => (
            <li
              key={a.id}
              className={`flex items-center gap-3 px-2.5 py-2 border ${
                a.unlocked ? "border-lime/30 bg-deep" : "border-edge bg-deep"
              }`}
            >
              <img
                src={a.badge}
                alt=""
                className={`w-10 h-10 shrink-0 object-contain ${a.unlocked ? "" : "grayscale opacity-40"}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-display text-[13px] font-bold truncate ${a.unlocked ? "text-ink" : "text-mute"}`}>
                    {a.name}
                  </h4>
                  <span className={`tag shrink-0 ${a.unlocked ? "tag-lime" : "tag-gold"}`}>
                    {a.unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <p className="font-label text-[10px] text-mute mt-0.5 leading-snug">
                  <span className="text-cyan font-bold uppercase tracking-wider">Mission: </span>
                  {a.mission}
                </p>
                <p className="font-display text-[11px] italic text-faint mt-0.5 leading-snug">
                  {"\u201C"}{a.quote}{"\u201D"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Sidebar({ activePage, onNavigate, onCloseMobile, onOpenSettings, onLogout }) {
  return (
    <div style={{ backgroundImage: "var(--t-grad-side)" }} className="flex flex-col h-full bg-[var(--t-bg0)] w-64 shrink-0">
      <div className="flex justify-end md:hidden px-3 pt-3">
        <button type="button" onClick={onCloseMobile} aria-label="Close menu">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex items-center self-stretch bg-[color-mix(in_srgb,_var(--t-bg2)_45%,_transparent)] py-[13px]">
          <img src={NAV_IMG.logo} alt="" className="w-9 h-9 ml-4 mr-3 object-fill" />
          <div className="w-[127px]">
            <div
              className="flex flex-col items-start self-stretch"
              style={{ boxShadow: "0px 2px 4px color-mix(in srgb, var(--t-ac) 30%, transparent)" }}
            >
              <span className="text-[color:var(--t-ac)] text-[17px] font-bold">CRAMMBLING</span>
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
                type="button"
                onClick={() => onNavigate(item)}
                className={`flex items-center self-stretch py-[9px] text-left border border-solid transition-all duration-150 active:scale-[0.98]
                  ${active ? "bg-[var(--t-bg3)] border-[#00000000]" : "border-[#00000000] hover:bg-[var(--t-bg2)]"}`}
                style={active ? { boxShadow: "0px 0px 15px color-mix(in srgb, var(--t-ac) 15%, transparent)" } : undefined}
              >
                <img src={item.icon} alt="" className={`${item.iconClass} ml-[13px] mr-3 object-fill`} />
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
        <button type="button" onClick={onOpenSettings} className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]">
          <img src={NAV_IMG.settings} alt="" className="w-[15px] h-[15px] mx-3 object-fill" />
          <span className="text-[color:var(--t-tx1)] text-[11px]">SETTINGS</span>
        </button>
        <button type="button" onClick={onLogout} className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]">
          <img src={NAV_IMG.logout} alt="" className="w-3.5 h-3.5 mx-3 object-fill" />
          <span className="text-[color:var(--t-tx1)] text-[11px]">LOGOUT</span>
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme, themeVars] = useTheme(); // shared with chatbot, group collab, personalized
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false); // Quiz Arena placeholder shown inside the page
  const [notifOpen, setNotifOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false); // desktop: push the sidebar aside
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const rootStyle = { ...themeVars, "--font-display": SANS, "--font-label": SANS };
  const [leaderboardFilter, setLeaderboardFilter] = useState(FILTERS[0]);
  const [analyticsFilter, setAnalyticsFilter] = useState(FILTERS[0]);
  const maxXp = Math.max(...WEEKLY_ACTIVITY.map((d) => d.xp));
  const topThree = LEADERBOARD.filter((e) => e.rank <= 3);
  const rest = LEADERBOARD.filter((e) => e.rank > 3);

  const activePage = showQuiz ? "quiz" : "dashboard";

  const handleNavigate = (item) => {
    setMobileNavOpen(false);
    if (item.key === "dashboard") return setShowQuiz(false);
    navigate(item.path);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    // TODO: clear auth/session state here once real auth is wired up
    navigate("/");
  };

  return (
    <div style={rootStyle} className="flex h-screen w-full bg-[var(--t-bg1)] text-ink overflow-hidden">
      {/* desktop sidebar: collapsible drawer */}
      <div
        className="hidden md:flex h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-out"
        style={{ width: navCollapsed ? 0 : 256 }}
      >
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          onCloseMobile={() => {}}
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

      {/* mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <Sidebar
            activePage={activePage}
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
        <div className="flex flex-wrap justify-between items-center gap-3 bg-[color-mix(in_srgb,_var(--t-bg0)_40%,_transparent)] py-3 px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`text-[color:var(--t-tx0)] ${navCollapsed ? "" : "md:hidden"}`}
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
          </div>
          {/* Dashboard shows only notifications + profile (streak and XP are already on the player card) */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button type="button" className="relative shrink-0" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
              <img src={NAV_IMG.avatar} alt="" className="w-8 h-8 object-fill" />
              {notifOpen && (
                <div className="absolute right-0 top-10 z-50 w-56 bg-[var(--t-bg2)] border border-solid border-[color:var(--t-bd0)] p-3 text-left shadow-lg">
                  <span className="text-[color:var(--t-tx0)] text-xs font-bold block mb-2">Notifications</span>
                  <span className="text-[color:var(--t-tx2)] text-[11px] block">CS240 Midterm is coming up on Mar 20.</span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="flex flex-col shrink-0 items-start px-1 sm:px-2"
              aria-label="Profile / Settings"
            >
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
        {showQuiz && (
          <main className="flex-1 min-h-0 overflow-y-auto">
            <QuizArena where="Dashboard" onBack={() => setShowQuiz(false)} />
          </main>
        )}

        {/* Main (hidden, not unmounted, while Quiz Arena is open so quiz history state is kept) */}
        <main className={`${showQuiz ? "hidden" : ""} flex-1 min-h-0 p-6 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--t-bd0,#2e2521)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-edge`}>
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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
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
                bodyClassName="p-4 flex-1 min-h-0 flex flex-col"
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

                <AchievementsSection />
              </Panel>
            </div>

            <QuizHistory />
          </div>
        </main>
      </div>

      {/* Settings drawer — shared by every page (and Quiz Arena) */}
      <Settings open={showSettings} onClose={() => setShowSettings(false)} theme={theme} onThemeChange={setTheme} />

      {showLogoutConfirm && (
        <LogoutConfirmModal onConfirm={handleConfirmLogout} onCancel={() => setShowLogoutConfirm(false)} />
      )}
    </div>
  );
}

export default Dashboard;
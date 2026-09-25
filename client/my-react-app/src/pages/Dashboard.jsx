import { useState } from "react";
import streakIcon from "../assets/streak.svg";
import notificationIcon from "../assets/notification.svg";
import levelIcon from "../assets/level.svg";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "chatbot", label: "Chatbot" },
  { id: "group-collab", label: "Group Collab" },
  { id: "quiz-arena", label: "Quiz Arena" },
  { id: "personalized", label: "Personalized" },
];

function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0d0907] font-mono">
      {/* Top navbar */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#1c1310] border-b border-[#3a2e26]">
        <div className="flex items-center gap-2">

            {/* Need Logo for Crammbling */}
          <div className="w-7 h-7 rounded-md bg-[#8bc34a]/15 border border-[#8bc34a]/40 flex items-center justify-center text-[#8bc34a] text-xs font-bold">
            C
          </div>
          <span className="text-white text-[15px] font-bold tracking-[2px]">
            CRAMMBLING
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#120d0b] border border-[#3a2e26] text-[#d4a94a] text-[11px] tracking-wide">
            <img src={streakIcon} alt="" className="w-3.5 h-3.5 brightness-150" />
            Sample 1
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#120d0b] border border-[#3a2e26] text-[#22d3ee] text-[11px] tracking-wide">
            <img src={levelIcon} alt="" className="w-3.5 h-3.5 brightness-150" />
            3,420 XP
          </span>
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
            className="w-8 h-8 rounded-full bg-[#8bc34a] flex items-center justify-center text-[#1c1310] text-sm font-bold"
          >
            M
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-56 bg-[#1c1310] border-r border-[#3a2e26] py-6 px-3 flex flex-col gap-1">
          <p className="text-[#5a5048] text-[10px] tracking-wide px-3 mb-2">
            NAVIGATION
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNav(item.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-[12px] tracking-wide transition-colors duration-150 ${
                  isActive
                    ? "bg-[#8bc34a]/15 text-[#8bc34a] border border-[#8bc34a]/30"
                    : "text-[#9c948a] border border-transparent hover:bg-[#120d0b] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Main content area — intentionally empty for now */}
        <main className="flex-1 p-6">
          <div className="h-full rounded-2xl border border-dashed border-[#3a2e26] flex items-center justify-center text-[#5a5048] text-[12px] tracking-wide">
            Page content goes here
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from "react";
import { ThemePicker, CloseIcon } from "../pages/Theme";

/* ------------------------------------------------------------------ */
/*  Shared Settings drawer — one design, one set of toggles, used by   */
/*  Dashboard, Chatbot, Group Collab, Personalized (and therefore also */
/*  Quiz Arena, which renders inside those pages).                     */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "crambling_settings";

const DEFAULTS = {
  emailReminders: false,
  groupPings: true,
  groupMessages: true,
  gradeAlerts: true,
  syncSprint: true,
  sfx: false,
};

const TOGGLES = [
  { key: "emailReminders", label: "Email reminders" },
  { key: "groupPings", label: "Group session pings" },
  { key: "groupMessages", label: "Group message notifications" },
  { key: "gradeAlerts", label: "Grade posted alerts" },
  { key: "syncSprint", label: "Sync tasks to Sprint Board" },
  { key: "sfx", label: "Quest sound effects" },
];

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return DEFAULTS;
  }
}

/* Read the saved toggles anywhere: const [settings, toggle] = useSettings(); */
export function useSettings() {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable — ignore */
    }
  }, [settings]);

  const toggle = (key) => setSettings((p) => ({ ...p, [key]: !p[key] }));
  return [settings, toggle];
}

export default function Settings({ open, onClose, theme, onThemeChange }) {
  const [settings, toggle] = useSettings();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div className="w-full max-w-xs overflow-y-auto bg-[var(--t-bg2)] border-l border-solid border-[color:var(--t-bd0)] p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-[color:var(--t-tx0)] text-sm font-bold">SETTINGS</span>
          <button type="button" onClick={onClose} aria-label="Close settings">
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        <ThemePicker theme={theme} onChange={onThemeChange} />

        {TOGGLES.map((t) => {
          const on = settings[t.key];
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => toggle(t.key)}
              className="flex justify-between items-center py-2 border-b border-solid border-[color:var(--t-bd0)]"
            >
              <span className="text-[color:var(--t-tx1)] text-xs">{t.label}</span>
              <div className={`w-9 h-5 flex items-center px-0.5 ${on ? "bg-[var(--t-ac)] justify-end" : "bg-[var(--t-bg3)] justify-start"}`}>
                <div className="w-3.5 h-3.5 bg-[var(--t-tx0)]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
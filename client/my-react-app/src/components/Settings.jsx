import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { ThemePicker, CloseIcon, withAlpha } from "../pages/Theme";
import { useMe } from "../pages/ProfileHub";

/* ------------------------------------------------------------------ */
/*  Shared Settings drawer — one design, one set of options, used by   */
/*  Dashboard, Classroom, Chatbot, Group Collab, Personalized and      */
/*  Profile (and therefore also Quiz Arena, which renders inside them). */
/*                                                                      */
/*  Options are grouped into categories (tabs). Values live in a small */
/*  store on globalThis (same trick as Theme.jsx) so every open page    */
/*  sees a change instantly, and are saved to localStorage.             */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "crambling_settings";

const DEFAULTS = {
  // Preferences
  startPage: "dashboard",
  reduceMotion: false,
  // Notifications
  notifPaused: false,
  emailReminders: false,
  groupPings: true,
  groupMessages: true,
  gradeAlerts: true,
  dueReminders: true,
  dueLead: "1d",
  friendActivity: true,
  // Study
  syncSprint: true,
  sfx: false,
  dailyGoal: 60, // minutes
  quizDifficulty: "adaptive",
  showHints: true,
  // Privacy
  profileVisibility: "everyone",
  showGmail: true,
  showBadges: true,
  allowUsernameRequests: true,
  allowGoogleRequests: true,
};

/* Where Login sends you (see startPagePath). */
export const START_PAGES = [
  { value: "dashboard", label: "Dashboard", path: "/dashboard" },
  { value: "classroom", label: "Classroom", path: "/classroom" },
  { value: "personalized", label: "Personalized", path: "/personalized" },
  { value: "group", label: "Group Collab", path: "/group-collab" },
];

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return DEFAULTS;
  }
}

/* Settings that change the whole page, not one component. */
function applyGlobal(s) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("reduce-motion", !!s.reduceMotion);
}

const store = (globalThis.__crammblingSettingsStore ||= { value: load(), listeners: new Set() });
applyGlobal(store.value);

function commit(next) {
  store.value = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — settings just won't survive a refresh */
  }
  applyGlobal(next);
  store.listeners.forEach((fn) => fn());
}
function subscribe(fn) {
  store.listeners.add(fn);
  return () => store.listeners.delete(fn);
}

/* Read the saved settings anywhere: const [settings, toggle, set] = useSettings(); */
export function useSettings() {
  const settings = useSyncExternalStore(subscribe, () => store.value, () => store.value);
  const toggle = (key) => commit({ ...store.value, [key]: !store.value[key] });
  const set = (key, value) => commit({ ...store.value, [key]: value });
  return [settings, toggle, set];
}

/* Path of the page the user picked to land on after logging in. */
export function startPagePath() {
  return (START_PAGES.find((p) => p.value === store.value.startPage) || START_PAGES[0]).path;
}

/* ------------------------------------------------------------------ */
/*  Building blocks                                                     */
/* ------------------------------------------------------------------ */
function CategoryIcon({ type }) {
  const p = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "preferences":
      return (
        <svg {...p}>
          <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      );
    case "notifications":
      return (
        <svg {...p}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "study":
      return (
        <svg {...p}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "privacy":
      return (
        <svg {...p}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "account":
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
        </svg>
      );
    default:
      return null;
  }
}

const CATEGORIES = [
  { key: "preferences", label: "Preferences" },
  { key: "notifications", label: "Notifications" },
  { key: "study", label: "Study" },
  { key: "privacy", label: "Privacy" },
  { key: "account", label: "Account" },
];

function Section({ title, hint, children }) {
  return (
    <section className="flex flex-col">
      <div className="mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--t-ac)]">{title}</span>
        {hint && <p className="text-[color:var(--t-tx2)] text-[11px] mt-0.5">{hint}</p>}
      </div>
      <div className="flex flex-col border border-solid border-[color:var(--t-bd0)] bg-[color-mix(in_srgb,_var(--t-bg0)_45%,_transparent)] px-3">{children}</div>
    </section>
  );
}

function Row({ label, hint, children, disabled }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-2.5 border-b border-solid border-[color:var(--t-bd0)] last:border-b-0 ${disabled ? "opacity-45 pointer-events-none" : ""}`}>
      <div className="min-w-0">
        <span className="text-[color:var(--t-tx0)] text-xs block">{label}</span>
        {hint && <span className="text-[color:var(--t-tx2)] text-[10px] block mt-0.5 leading-snug">{hint}</span>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Switch({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`w-9 h-5 flex items-center px-0.5 border border-solid transition-colors duration-150 ${on ? "bg-[var(--t-ac)] border-[color:var(--t-ac)] justify-end" : "bg-[var(--t-bg3)] border-[color:var(--t-bd0)] justify-start"}`}
    >
      <span className={`w-3.5 h-3.5 ${on ? "bg-[var(--t-onac)]" : "bg-[var(--t-tx2)]"}`} />
    </button>
  );
}

function ToggleRow({ settings, toggle, k, label, hint, disabled }) {
  return (
    <Row label={label} hint={hint} disabled={disabled}>
      <Switch on={!!settings[k]} onChange={() => toggle(k)} label={label} />
    </Row>
  );
}

/* Segmented picker: a few mutually exclusive options in one row. */
function Segmented({ value, options, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex border border-solid border-[color:var(--t-bd0)]">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${active ? "bg-[var(--t-ac)] text-[color:var(--t-onac)]" : "bg-[var(--t-bg3)] text-[color:var(--t-tx2)] hover:text-[color:var(--t-tx0)]"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Select({ value, options, onChange, label }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none cursor-pointer pl-2.5 pr-6 py-1.5 bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-ac)] text-[10px] font-bold uppercase tracking-wider outline-none focus:border-[color:var(--t-ac)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[var(--t-bg2)] text-[color:var(--t-tx0)]">
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--t-ac)] text-[9px]">{"▾"}</span>
    </div>
  );
}

function Stepper({ value, min, max, step, onChange, format }) {
  const btn =
    "w-6 h-6 flex items-center justify-center bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd0)] text-[color:var(--t-tx0)] text-sm leading-none hover:border-[color:var(--t-ac)] disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" className={btn} disabled={value <= min} onClick={() => onChange(Math.max(min, value - step))} aria-label="Decrease">
        −
      </button>
      <span className="min-w-[56px] text-center text-[color:var(--t-ac)] text-[11px] font-bold">{format(value)}</span>
      <button type="button" className={btn} disabled={value >= max} onClick={() => onChange(Math.min(max, value + step))} aria-label="Increase">
        +
      </button>
    </div>
  );
}

function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[22px] h-[20px] px-1.5 bg-[var(--t-bg3)] border border-solid border-[color:var(--t-bd1)] border-b-2 text-[color:var(--t-tx0)] text-[10px] font-bold">
      {children}
    </kbd>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Category panels                                                     */
/* ------------------------------------------------------------------ */
function PreferencesPanel({ settings, toggle, set, theme, onThemeChange }) {
  return (
    <>
      <section className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--t-ac)] mb-1.5">Appearance</span>
        <ThemePicker theme={theme} onChange={onThemeChange} />
      </section>

      <Section title="Display">
        <ToggleRow settings={settings} toggle={toggle} k="reduceMotion" label="Reduce motion" hint="Turns off animations and transitions across the app." />
      </Section>

      <Section title="Start-up">
        <Row label="Start page" hint="Where you land after logging in.">
          <Select label="Start page" value={settings.startPage} options={START_PAGES} onChange={(v) => set("startPage", v)} />
        </Row>
      </Section>

      <Section title="Keyboard shortcuts">
        <Row label="Focus the search bar">
          <Kbd>/</Kbd>
        </Row>
        <Row label="Close menus and pop-ups">
          <Kbd>Esc</Kbd>
        </Row>
        <Row label="Pick the top search result">
          <Kbd>Enter</Kbd>
        </Row>
      </Section>
    </>
  );
}

function NotificationsPanel({ settings, toggle, set }) {
  const paused = settings.notifPaused;
  return (
    <>
      <div
        className="flex items-center justify-between gap-3 p-3 border border-solid"
        style={{
          borderColor: withAlpha(paused ? "var(--t-warn)" : "var(--t-ok)", "66"),
          backgroundColor: withAlpha(paused ? "var(--t-warn)" : "var(--t-ok)", "14"),
        }}
      >
        <div>
          <span className="text-xs font-bold block" style={{ color: paused ? "var(--t-warn)" : "var(--t-ok)" }}>
            {paused ? "Notifications paused" : "Notifications on"}
          </span>
          <span className="text-[color:var(--t-tx2)] text-[10px] block mt-0.5">{paused ? "You won't get any alerts until you turn them back on." : "Pause everything at once, e.g. during exams."}</span>
        </div>
        <Switch on={!paused} onChange={() => toggle("notifPaused")} label="Notifications on" />
      </div>

      <Section title="Classes">
        <ToggleRow settings={settings} toggle={toggle} k="gradeAlerts" label="Grade posted alerts" disabled={paused} />
        <ToggleRow settings={settings} toggle={toggle} k="dueReminders" label="Assignment due reminders" disabled={paused} />
        <Row label="Remind me" hint="How early due-date reminders arrive." disabled={paused || !settings.dueReminders}>
          <Segmented
            label="Remind me"
            value={settings.dueLead}
            onChange={(v) => set("dueLead", v)}
            options={[
              { value: "1h", label: "1 hr" },
              { value: "1d", label: "1 day" },
              { value: "3d", label: "3 days" },
            ]}
          />
        </Row>
      </Section>

      <Section title="Group Collab">
        <ToggleRow settings={settings} toggle={toggle} k="groupMessages" label="New message notifications" disabled={paused} />
        <ToggleRow settings={settings} toggle={toggle} k="groupPings" label="Group session pings" disabled={paused} />
        <ToggleRow settings={settings} toggle={toggle} k="friendActivity" label="Friend activity" hint="When a friend adds you or earns a badge." disabled={paused} />
      </Section>

      <Section title="Email">
        <ToggleRow settings={settings} toggle={toggle} k="emailReminders" label="Email reminders" hint="A daily summary sent to your Google account." disabled={paused} />
      </Section>
    </>
  );
}

function StudyPanel({ settings, toggle, set }) {
  return (
    <>
      <Section title="Goals">
        <Row label="Daily study goal" hint="Used for your streak — study this long to keep it going.">
          <Stepper
            value={settings.dailyGoal}
            min={15}
            max={240}
            step={15}
            onChange={(v) => set("dailyGoal", v)}
            format={(m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}` : `${m} min`)}
          />
        </Row>
      </Section>

      <Section title="Quizzes">
        <Row label="Default difficulty" hint="Starting difficulty for new AI quizzes.">
          <Select
            label="Default difficulty"
            value={settings.quizDifficulty}
            onChange={(v) => set("quizDifficulty", v)}
            options={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
              { value: "adaptive", label: "Adaptive" },
            ]}
          />
        </Row>
        <ToggleRow settings={settings} toggle={toggle} k="showHints" label="Show hints" hint="Turn off to work toward the No Hints Needed badge." />
        <ToggleRow settings={settings} toggle={toggle} k="sfx" label="Quest sound effects" />
      </Section>

      <Section title="Tasks">
        <ToggleRow settings={settings} toggle={toggle} k="syncSprint" label="Sync tasks to Sprint Board" hint="Squad tasks also show up in your Study Sprint Board." />
      </Section>
    </>
  );
}

function PrivacyPanel({ settings, toggle, set }) {
  return (
    <>
      <Section title="Profile">
        <Row label="Who can see my profile">
          <Select
            label="Who can see my profile"
            value={settings.profileVisibility}
            onChange={(v) => set("profileVisibility", v)}
            options={[
              { value: "everyone", label: "Everyone" },
              { value: "friends", label: "Friends only" },
              { value: "private", label: "Only me" },
            ]}
          />
        </Row>
        <ToggleRow settings={settings} toggle={toggle} k="showGmail" label="Show my Google account" hint="Your Gmail address in your profile's About section." />
        <ToggleRow settings={settings} toggle={toggle} k="showBadges" label="Show my badges" hint="Your Badges & Achievements on your profile." />
      </Section>

      <Section title="Friend requests" hint="How other students can find and add you.">
        <ToggleRow settings={settings} toggle={toggle} k="allowUsernameRequests" label="By username" />
        <ToggleRow settings={settings} toggle={toggle} k="allowGoogleRequests" label="By Google account" />
      </Section>
    </>
  );
}

function AccountPanel({ onClose, onReset }) {
  const me = useMe();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);

  function go(state) {
    onClose();
    navigate("/profile", state ? { state } : undefined);
  }

  return (
    <>
      <div className="flex items-center gap-3 p-3 border border-solid border-[color:var(--t-bd0)] bg-[color-mix(in_srgb,_var(--t-bg0)_45%,_transparent)]">
        <div className="relative w-11 h-11 shrink-0 flex items-center justify-center font-bold text-sm border-2 border-solid border-[color:var(--t-ac)] text-[color:var(--t-ac)] bg-[color-mix(in_srgb,_var(--t-ac)_15%,_transparent)]">
          <span className="absolute top-0 left-0 w-full h-[4px] bg-[var(--t-ac)]" />
          {me.initials}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[color:var(--t-tx0)] text-sm font-bold block truncate">{me.name}</span>
          <span className="text-[color:var(--t-tx2)] text-[11px] block truncate">@{me.username}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 -mt-2">
        <button type="button" onClick={() => go()} className="btn btn-ghost !text-[10px] !py-2">
          View profile
        </button>
        <button type="button" onClick={() => go({ edit: true })} className="btn btn-cyan !text-[10px] !py-2">
          Edit profile
        </button>
      </div>

      <Section title="Connected accounts">
        <Row label={<span className="flex items-center gap-2"><GoogleIcon />Google</span>} hint={me.gmail}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--t-ok)]">✓ Connected</span>
        </Row>
      </Section>

      <Section title="Reset">
        {!confirmReset ? (
          <Row label="Restore default settings" hint="Theme and your profile are kept.">
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="text-[10px] font-bold uppercase tracking-wider py-1 px-2 border border-solid border-[color:var(--t-err)] text-[color:var(--t-err)] hover:bg-[var(--t-err)] hover:text-[color:var(--t-onerr)] transition-colors"
            >
              Reset
            </button>
          </Row>
        ) : (
          <div className="flex flex-col gap-2 py-2.5">
            <span className="text-[color:var(--t-tx0)] text-xs">Reset every setting to its default?</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setConfirmReset(false)} className="btn btn-ghost flex-1 !text-[10px] !py-1.5">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                }}
                className="btn flex-1 !text-[10px] !py-1.5 bg-[var(--t-err)] text-[color:var(--t-onerr)] hover:brightness-110"
              >
                Yes, reset
              </button>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Drawer                                                              */
/* ------------------------------------------------------------------ */
let lastCategory = "preferences"; // reopen on the tab you left, across pages

export default function Settings({ open, onClose, theme, onThemeChange }) {
  const [settings, toggle, set] = useSettings();
  const [category, setCategory] = useState(lastCategory);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    lastCategory = category;
  }, [category]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Brief "Saved" tick whenever a setting changes while the drawer is open.
  const seen = useRef({ settings, theme });
  useEffect(() => {
    const changed = seen.current.settings !== settings || seen.current.theme !== theme;
    seen.current = { settings, theme };
    if (!open || !changed) return;
    setSavedFlash(true);
    const id = setTimeout(() => setSavedFlash(false), 1200);
    return () => clearTimeout(id);
  }, [open, settings, theme]);

  if (!open) return null;

  const panelProps = { settings, toggle, set };
  const current = CATEGORIES.find((c) => c.key === category) || CATEGORIES[0];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="flex-1 bg-black/60" onClick={onClose} />
      <div
        role="dialog"
        aria-label="Settings"
        className="w-full max-w-md h-full flex flex-col bg-[var(--t-bg2)] border-l border-solid border-[color:var(--t-bd0)]"
        style={{ boxShadow: "-6px 0 30px rgba(0,0,0,0.45)" }}
      >
        {/* header */}
        <div className="flex justify-between items-center px-5 pt-5 pb-3">
          <div>
            <span className="text-[color:var(--t-tx0)] text-sm font-bold tracking-wider block">SETTINGS</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider transition-opacity duration-300 ${savedFlash ? "opacity-100 text-[color:var(--t-ok)]" : "opacity-60 text-[color:var(--t-tx2)]"}`}>
              {savedFlash ? "✓ Saved" : "Changes save automatically"}
            </span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close settings">
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* category tabs */}
        <div role="tablist" aria-label="Settings categories" className="grid grid-cols-5 border-y border-solid border-[color:var(--t-bd0)] bg-[color-mix(in_srgb,_var(--t-bg0)_45%,_transparent)]">
          {CATEGORIES.map((c) => {
            const active = c.key === current.key;
            return (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c.key)}
                className={`flex flex-col items-center gap-1 py-2.5 border-b-2 border-solid transition-colors ${active
                  ? "border-[color:var(--t-ac)] text-[color:var(--t-ac)] bg-[var(--t-bg3)]"
                  : "border-transparent text-[color:var(--t-tx2)] hover:text-[color:var(--t-tx0)]"
                  }`}
              >
                <CategoryIcon type={c.key} />
                <span className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wide">{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* body */}
        <div role="tabpanel" aria-label={current.label} className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          {current.key === "preferences" && <PreferencesPanel {...panelProps} theme={theme} onThemeChange={onThemeChange} />}
          {current.key === "notifications" && <NotificationsPanel {...panelProps} />}
          {current.key === "study" && <StudyPanel {...panelProps} />}
          {current.key === "privacy" && <PrivacyPanel {...panelProps} />}
          {current.key === "account" && <AccountPanel onClose={onClose} onReset={() => commit({ ...DEFAULTS })} />}
        </div>
      </div>
    </div>
  );
}

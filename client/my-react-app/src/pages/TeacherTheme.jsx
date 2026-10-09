import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";

const STORAGE_KEY = "teacher_theme_mode";

const DARK = {
  bg0: "#09090B", bg1: "#18181B", bg2: "#1F1F23", bg3: "#27272A",
  bd0: "#27272A", bd1: "#3F3F46",
  tx0: "#FAFAFA", tx1: "#A1A1AA", tx2: "#71717A",
  ac: "#3B82F6", acHover: "#2563EB", onac: "#FFFFFF",
  ok: "#22C55E", warn: "#F59E0B", err: "#EF4444",
  overlay: "rgba(0,0,0,0.70)",
};

const LIGHT = {
  bg0: "#F4F4F5", bg1: "#FFFFFF", bg2: "#FAFAFA", bg3: "#E4E4E7",
  bd0: "#E4E4E7", bd1: "#D4D4D8",
  tx0: "#18181B", tx1: "#52525B", tx2: "#A1A1AA",
  ac: "#2563EB", acHover: "#1D4ED8", onac: "#FFFFFF",
  ok: "#16A34A", warn: "#D97706", err: "#DC2626",
  overlay: "rgba(0,0,0,0.45)",
};

function paletteFor(mode) {
  return mode === "light" ? LIGHT : DARK;
}

/* ---------------------------------------------------------
   Tunables — change these to taste
--------------------------------------------------------- */
const THEME_CSS_ID = "tt-theme-css";
const FALLBACK_MS   = 1400;   // cross-fade fallback (no View Transitions)
const REVEAL_MS     = 1800;   // how long the circle takes to expand
const REVEAL_EASING = "cubic-bezier(0.22, 1, 0.36, 1)"; // smooth ease-out

/* ---------------------------------------------------------
   Stylesheet
--------------------------------------------------------- */
function injectThemeCSS() {
  if (typeof document === "undefined") return;
  if (document.getElementById(THEME_CSS_ID)) return;

  const el = document.createElement("style");
  el.id = THEME_CSS_ID;
  el.textContent = `
    /* The new theme layer sits ON TOP of the old one and gets clipped
       into a growing circle. The old layer just stays put underneath. */
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
    ::view-transition-old(root) {
      z-index: 1;
    }
    ::view-transition-new(root) {
      z-index: 2;
    }

    /* Fallback cross-fade */
    .tt-theme-transitioning,
    .tt-theme-transitioning *,
    .tt-theme-transitioning *::before,
    .tt-theme-transitioning *::after {
      transition:
        background-color 0.9s cubic-bezier(0.4, 0, 0.2, 1),
        color            0.9s cubic-bezier(0.4, 0, 0.2, 1),
        border-color     0.9s cubic-bezier(0.4, 0, 0.2, 1),
        fill             0.9s cubic-bezier(0.4, 0, 0.2, 1),
        stroke           0.9s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow       0.9s cubic-bezier(0.4, 0, 0.2, 1) !important;
      transition-delay: 0s !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .tt-theme-transitioning,
      .tt-theme-transitioning *,
      .tt-theme-transitioning *::before,
      .tt-theme-transitioning *::after {
        transition: none !important;
      }
      ::view-transition-group(root),
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation: none !important;
      }
    }
  `;
  document.head.appendChild(el);
}

/* ---------------------------------------------------------
   Apply theme colors to <html>
--------------------------------------------------------- */
function cssVarsFor(palette) {
  return {
    "--tt-bg0": palette.bg0,
    "--tt-bg1": palette.bg1,
    "--tt-bg2": palette.bg2,
    "--tt-bg3": palette.bg3,
    "--tt-bd0": palette.bd0,
    "--tt-bd1": palette.bd1,
    "--tt-tx0": palette.tx0,
    "--tt-tx1": palette.tx1,
    "--tt-tx2": palette.tx2,
    "--tt-ac": palette.ac,
    "--tt-ac-hover": palette.acHover,
    "--tt-onac": palette.onac,
    "--tt-ok": palette.ok,
    "--tt-warn": palette.warn,
    "--tt-err": palette.err,
    "--tt-overlay": palette.overlay,
  };
}

function applyToDocument(style) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries(style).forEach(([k, v]) => root.style.setProperty(k, v));
}

/* ---------------------------------------------------------
   Store
--------------------------------------------------------- */
function readStored() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch { /* ignore */ }
  return "dark";
}

const store = { mode: readStored(), listeners: new Set() };
function emit() { store.listeners.forEach((fn) => fn(store.mode)); }

function commitModeChange(mode) {
  store.mode = mode;
  try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* ignore */ }

  // 1. Update the CSS variables on <html> — this is what actually
  //    changes the colors on the page.
  applyToDocument(cssVarsFor(paletteFor(mode)));

  // 2. Re-render any React subscribers (like the toggle icon) inside
  //    the same snapshot the View Transition captures.
  try {
    flushSync(() => emit());
  } catch {
    emit();
  }
}

/* ---------------------------------------------------------
   Fallback cross-fade
--------------------------------------------------------- */
let fallbackTimer = null;
function beginFallbackTransition() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.add("tt-theme-transitioning");
  if (fallbackTimer) clearTimeout(fallbackTimer);
  fallbackTimer = setTimeout(() => {
    root.classList.remove("tt-theme-transitioning");
    fallbackTimer = null;
  }, FALLBACK_MS);
}

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
function supportsViewTransition() {
  return (
    typeof document !== "undefined" &&
    typeof document.startViewTransition === "function"
  );
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------------------------------------------------------
   The circular reveal
   ---------------------------------------------------------
   - `origin` is the button's center in viewport coords.
   - The NEW theme is rendered on top and clipped into a circle
     of radius 0 at (x, y). We animate that radius up until it
     covers the farthest corner of the viewport.
--------------------------------------------------------- */
function runCircularReveal(mode, origin) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const x = origin?.x ?? vw - 48;
  const y = origin?.y ?? 48;

  // Radius from (x, y) to the farthest viewport corner.
  const endRadius = Math.hypot(
    Math.max(x, vw - x),
    Math.max(y, vh - y)
  );

  const transition = document.startViewTransition(() => {
    commitModeChange(mode);
  });

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: REVEAL_MS,
          easing: REVEAL_EASING,
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => { /* skipped or cancelled */ });

  transition.finished.catch(() => { /* swallow aborts */ });
}

/* ---------------------------------------------------------
   Public API
--------------------------------------------------------- */
export function setTeacherThemeMode(mode, origin) {
  if (mode !== "light" && mode !== "dark") return;
  if (mode === store.mode) return;

  if (supportsViewTransition() && !prefersReducedMotion()) {
    runCircularReveal(mode, origin);
    return;
  }

  beginFallbackTransition();
  commitModeChange(mode);
}

/* ---------------------------------------------------------
   Hook
--------------------------------------------------------- */
export function useTeacherTheme() {
  const [mode, setMode] = useState(store.mode);

  useEffect(() => {
    injectThemeCSS();
    const handler = (m) => setMode(m);
    store.listeners.add(handler);
    return () => store.listeners.delete(handler);
  }, []);

  const palette = paletteFor(mode);
  const style = useMemo(() => cssVarsFor(palette), [palette]);

  // Keep <html> in sync on first mount / after external changes.
  useEffect(() => {
    applyToDocument(style);
  }, [style]);

  return [mode, setTeacherThemeMode, style];
}

/* ---------------------------------------------------------
   Toggle button
   ---------------------------------------------------------
   The click handler measures the button, converts to viewport
   coords, and hands them to setTeacherThemeMode. That's what
   makes the circle appear to grow out of the button itself.
--------------------------------------------------------- */
export function ThemeToggle({ className = "" }) {
  const [mode, setMode] = useTeacherTheme();
  const isDark = mode === "dark";

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMode(isDark ? "light" : "dark", {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  return (
    <button
      onClick={handleClick}
      className={`relative w-10 h-10 flex items-center justify-center shrink-0 rounded-xl transition-colors duration-200 ${className}`}
      style={{ color: "var(--tt-tx1)", border: "1px solid var(--tt-bd0)" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--tt-bg3)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.6)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
        </svg>
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? "rotate(-90deg) scale(0.6)" : "rotate(0deg) scale(1)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
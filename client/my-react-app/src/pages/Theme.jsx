import React, { useEffect, useMemo, useState } from "react";

/* ---------------------------------------------------------
   THEMES
   Every colour in this file is a CSS variable (--t-*). A theme is
   just a set of values for those variables, so adding a new one is
   a single entry in THEMES below.
   Roles: bg0-3 surfaces, bd0-1 borders, tx0-2 text, mbg/mbd/in0-2 modal and
   input surfaces, ac/ac2 primary accent, ok* secondary accent,
   warn/err status, on* = text that sits on top of an accent fill.
--------------------------------------------------------- */
export const BASE_THEME = {
    bg0: "#130D0B", bg1: "#181210", bg2: "#1D1715", bg3: "#251E1C",
    bd0: "#3F3735", bd1: "#524542", shadow: "#0A0706",
    tx0: "#EDE0DC", tx1: "#BBC9C9", tx2: "#859394",
    mbg: "#0B1220", in0: "#101A2E", in1: "#132038", in2: "#1E2A44",
    mbd: "#2E3B5C", mbd2: "#3A4E78", ph: "#4A5578", mtx: "#8A93B8", glow: "#1E3A5F",
    ac: "#2CD4D9", ac2: "#58F1F6",
    ok: "#82F040", ok2: "#A0D673", ok3: "#BBF38C",
    warn: "#FEDA44", err: "#FF6B6B",
    onac: "#003738", onok: "#153A00", onok2: "#0F2A00", onwarn: "#3A2E00",
};

export const THEMES = {
    /* Default = the dashboard look: flat near-black warm surfaces, no gradient.
       Colours sampled from the dashboard screenshot. */
    default: {
        label: "Default",
        flat: true,
        vars: {
            ...BASE_THEME,
            bg0: "#090806", bg1: "#120D0A", bg2: "#17120F", bg3: "#211917",
            bd0: "#2C2825", bd1: "#453D39", shadow: "#050403",
            tx0: "#EDE0DC", tx1: "#BBC9C9", tx2: "#859394",
            ac: "#2CD4D9", ac2: "#58F1F6",
            ok: "#A7DF62", ok2: "#A0D673", ok3: "#C4EE94",
            warn: "#F4C541", err: "#FF6B6B",
            onok: "#1A3300", onok2: "#1A3300",
        },
    },
    light: {
        label: "Light",
        scheme: "light",
        vars: {
            ...BASE_THEME,
            bg0: "#E8EEF1", bg1: "#F6F9FA", bg2: "#FFFFFF", bg3: "#DCE6EA",
            bd0: "#C6D2D8", bd1: "#9FB1BA", shadow: "#C2CDD3",
            tx0: "#14222B", tx1: "#33474F", tx2: "#5B707B",
            mbg: "#FFFFFF", in0: "#F0F5F7", in1: "#E3F3F4", in2: "#DCE5EA",
            mbd: "#C3CFD7", mbd2: "#A5B5C2", ph: "#8B9DAA", mtx: "#546879", glow: "#9CD8DB",
            ac: "#0E959B", ac2: "#0A767C",
            ok: "#3C9A0F", ok2: "#4E8F22", ok3: "#397A12",
            warn: "#B9820A", err: "#D63A3A",
            onac: "#FFFFFF", onok: "#FFFFFF", onok2: "#FFFFFF", onwarn: "#FFFFFF",
        },
    },
    pink: {
        label: "Pink",
        vars: {
            ...BASE_THEME,
            bg0: "#1A0C14", bg1: "#200F19", bg2: "#2A1520", bg3: "#381D2A",
            bd0: "#4D2A3B", bd1: "#6B3C52", shadow: "#0D050A",
            tx0: "#FBE4EE", tx1: "#E3BFD0", tx2: "#B08599",
            mbg: "#1B0B15", in0: "#2A1420", in1: "#3A1A2B", in2: "#4A2337",
            mbd: "#5C3048", mbd2: "#7A4562", ph: "#8F5E77", mtx: "#C79AB2", glow: "#7A1F4F",
            ac: "#FF5FA8", ac2: "#FF9CCB",
            ok: "#C792FF", ok2: "#DDB8FF", ok3: "#EBD3FF",
            warn: "#FFD166", err: "#FF4D4D",
            onac: "#3D0A24", onok: "#2A0A4D", onok2: "#2A0A4D", onwarn: "#3A2E00",
        },
    },
    green: {
        label: "Green",
        vars: {
            ...BASE_THEME,
            bg0: "#08140E", bg1: "#0C1B13", bg2: "#11241A", bg3: "#1A3326",
            bd0: "#24422F", bd1: "#34604A", shadow: "#040A07",
            tx0: "#E2F5E8", tx1: "#B5D3BF", tx2: "#7FA08B",
            mbg: "#07140D", in0: "#10241A", in1: "#173222", in2: "#1F412D",
            mbd: "#2A5039", mbd2: "#3C7051", ph: "#4F8062", mtx: "#8FB9A0", glow: "#1E5F3A",
            ac: "#3DDC84", ac2: "#7CF0AB",
            ok: "#C6F135", ok2: "#D9F77A", ok3: "#E8FBAA",
            warn: "#FEDA44", err: "#FF6B6B",
            onac: "#00351B", onok: "#2A3A00", onok2: "#2A3A00", onwarn: "#3A2E00",
        },
    },
    blue: {
        label: "Blue",
        vars: {
            ...BASE_THEME,
            bg0: "#070E1C", bg1: "#0A1426", bg2: "#0F1B33", bg3: "#17284A",
            bd0: "#22385F", bd1: "#34528A", shadow: "#03070F",
            tx0: "#E3EEFF", tx1: "#B4C8E6", tx2: "#7F97BA",
            mbg: "#060D1B", in0: "#0F1B33", in1: "#152647", in2: "#1D3360",
            mbd: "#2A4372", mbd2: "#3E62A0", ph: "#5476A8", mtx: "#8FA9D1", glow: "#1E4FA0",
            ac: "#4DA3FF", ac2: "#8CC8FF",
            ok: "#35E0C2", ok2: "#7AEBD5", ok3: "#A8F3E5",
            warn: "#FEDA44", err: "#FF6B6B",
            onac: "#00224D", onok: "#003D33", onok2: "#003D33", onwarn: "#3A2E00",
        },
    },
    pinkgreen: {
        label: "Pink & Green",
        vars: {
            ...BASE_THEME,
            bg0: "#120A12", bg1: "#170D17", bg2: "#201220", bg3: "#2C1A2B",
            bd0: "#40263F", bd1: "#5C3A5A", shadow: "#080308",
            tx0: "#F8E6F2", tx1: "#D7BFD2", tx2: "#A084A0",
            mbg: "#120A12", in0: "#201220", in1: "#2C1A2B", in2: "#3A2339",
            mbd: "#4E2F4C", mbd2: "#6B4568", ph: "#825F80", mtx: "#BE9BBB", glow: "#6B2A5F",
            ac: "#FF5FA8", ac2: "#FF9CCB",
            ok: "#4DF08A", ok2: "#8CF5B2", ok3: "#BFFAD3",
            warn: "#FEDA44", err: "#FF6B6B",
            onac: "#3D0A24", onok: "#003D1A", onok2: "#003D1A", onwarn: "#3A2E00",
        },
    },
    blossom: {
        label: "Blossom Meadow",
        scheme: "light",
        vars: {
            ...BASE_THEME,
            bg0: "#FFD8DC", bg1: "#F8F5DF", bg2: "#FFFDF3", bg3: "#D8E6B8",
            bd0: "#E7CBC4", bd1: "#C6D99A", shadow: "#E3BFC4",
            tx0: "#3E2C31", tx1: "#6A4B52", tx2: "#87726D",
            mbg: "#FFFDF4", in0: "#F8F5DF", in1: "#FFE6E9", in2: "#E7F0CF",
            mbd: "#E6CDC9", mbd2: "#C6D99A", ph: "#A99A90", mtx: "#7F6A66", glow: "#FFBFC7",
            ac: "#CF4A6E", ac2: "#B03458",
            ok: "#5F8A22", ok2: "#78A03A", ok3: "#4B7218",
            warn: "#B0800A", err: "#D03A3A",
            onac: "#FFFFFF", onok: "#FFFFFF", onok2: "#FFFFFF", onwarn: "#FFFFFF",
        },
    },
    midnight: {
        label: "Midnight Blue",
        scheme: "dark",
        vars: {
            ...BASE_THEME,
            bg0: "#070E2F", bg1: "#0B1340", bg2: "#121A52", bg3: "#1E1F5F",
            bd0: "#2A3080", bd1: "#3F4FB0", shadow: "#040819",
            tx0: "#DBEDFF", tx1: "#9BBBFF", tx2: "#7489C6",
            mbg: "#070E2F", in0: "#0F1745", in1: "#1A2160", in2: "#1E1F5F",
            mbd: "#2C3590", mbd2: "#536CCF", ph: "#4F62AE", mtx: "#8FA8E8", glow: "#536CCF",
            ac: "#9BBBFF", ac2: "#DBEDFF",
            ok: "#7B93F0", ok2: "#9EAEF6", ok3: "#C2CCFA",
            warn: "#FEDA44", err: "#FF6B6B",
            onac: "#070E2F", onok: "#070E2F", onok2: "#070E2F", onwarn: "#3A2E00",
        },
    },
    lavender: {
        label: "Lavender Dream",
        scheme: "light",
        vars: {
            ...BASE_THEME,
            bg0: "#E2D9D9", bg1: "#EAF7EC", bg2: "#F7FCF8", bg3: "#EBCBDA",
            bd0: "#D9C4CE", bd1: "#C79BB2", shadow: "#CDB9C3",
            tx0: "#3B2748", tx1: "#5E4670", tx2: "#84708E",
            mbg: "#F7FCF8", in0: "#EAF7EC", in1: "#F4E3EC", in2: "#E6D2EF",
            mbd: "#D5C3D6", mbd2: "#B48FCB", ph: "#A995B5", mtx: "#7C6790", glow: "#DEAFC2",
            ac: "#8A56B8", ac2: "#6F3F9C",
            ok: "#C4569F", ok2: "#D480BB", ok3: "#A83F86",
            warn: "#B0800A", err: "#D63A3A",
            onac: "#FFFFFF", onok: "#FFFFFF", onok2: "#FFFFFF", onwarn: "#FFFFFF",
        },
    },
};

export const THEME_STORAGE_KEY = "crammbling-theme";
const LEGACY_KEY = "crammbling-gc-theme";

export function themeStyle(key) {
    const t = (THEMES[key] || THEMES.default).vars;
    const light = (THEMES[key] || THEMES.default).scheme === "light";
    const out = { colorScheme: (THEMES[key] || THEMES.default).scheme || "dark" };
    Object.keys(t).forEach((k) => {
        out[`--t-${k}`] = t[k];
    });
    /* Extra derived roles used by chatbot.jsx / personalized.jsx */
    out["--t-bg4"] = `color-mix(in srgb, ${t.bg3} 50%, ${t.bd0})`;
    out["--t-onerr"] = light ? "#FFFFFF" : "#2A0A0A";
    out["--t-errc"] = light ? "#FFDAD6" : "#93000A";
    out["--t-onerrc"] = light ? "#93000A" : "#FFDAD6";

    /* Light -> dark background gradients, built from each theme's own colours.
       Dark themes: a bright accent-tinted corner fading into near-black.
       Light themes: a white-ish corner fading into a deeper accent-tinted shade. */
    const hiMain = light ? `color-mix(in srgb, #ffffff 65%, ${t.bg1})` : `color-mix(in srgb, ${t.ac} 26%, ${t.bg1})`;
    const loMain = light ? `color-mix(in srgb, ${t.ac} 24%, ${t.bg0})` : `color-mix(in srgb, #000000 55%, ${t.bg0})`;
    const midMain = light ? `color-mix(in srgb, ${t.ok} 10%, ${t.bg1})` : `color-mix(in srgb, ${t.ok} 8%, ${t.bg0})`;
    out["--t-grad-main"] =
        `radial-gradient(ellipse at 100% 100%, color-mix(in srgb, ${t.ok} ${light ? 22 : 16}%, transparent) 0%, transparent 50%), ` +
        `linear-gradient(135deg, ${hiMain} 0%, ${midMain} 48%, ${loMain} 100%)`;
    const hiSide = light ? `color-mix(in srgb, #ffffff 60%, ${t.bg0})` : `color-mix(in srgb, ${t.ac} 42%, ${t.bg0})`;
    const midSide = light ? `color-mix(in srgb, ${t.ok} 14%, ${t.bg0})` : `color-mix(in srgb, ${t.ok} 12%, ${t.bg0})`;
    const loSide = light ? `color-mix(in srgb, ${t.ac} 34%, ${t.bg0})` : `color-mix(in srgb, #000000 60%, ${t.bg0})`;
    out["--t-grad-side"] = `linear-gradient(170deg, ${hiSide} 0%, ${midSide} 45%, ${loSide} 100%)`;
    /* Flat themes (Default): solid fills, wrapped in linear-gradient() because
       the pages apply these variables through `background-image`. */
    if ((THEMES[key] || THEMES.default).flat) {
        out["--t-grad-main"] = `linear-gradient(${t.bg0}, ${t.bg0})`;
        out["--t-grad-side"] = `linear-gradient(${t.bg1}, ${t.bg1})`;
    }
    return out;
}

/* Apply an alpha (hex pair like "33") to any CSS colour, including var(--t-*). */
export function withAlpha(color, hexAlpha) {
    const pct = Math.round((parseInt(hexAlpha, 16) / 255) * 100);
    return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}


/* ---------------------------------------------------------
   Shared theme store.
   Lives at module level, so every page (chatbot, group collab,
   personalized) reads the SAME value. Changing the theme on one
   page updates it everywhere instantly, and it is also saved to
   localStorage so it survives a refresh (and syncs across
   browser tabs through the "storage" event).
--------------------------------------------------------- */
function readStoredTheme() {
    try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
        if (saved && THEMES[saved]) return saved;
    } catch {
        /* storage unavailable — fall back to default */
    }
    return "default";
}

/* The store lives on globalThis, not in a module variable. If this file is ever
   evaluated twice (hot reload, or two pages resolving "./Theme" to separate
   module instances), every copy still shares ONE current theme and ONE
   listener set, so the picker on any page always updates every page. */
const store = (globalThis.__crammblingThemeStore ||= {
    current: readStoredTheme(),
    listeners: new Set(),
    storageBound: false,
});

function emitTheme() {
    store.listeners.forEach((fn) => fn(store.current));
}

export function setTheme(key) {
    if (!THEMES[key] || key === store.current) return;
    store.current = key;
    try {
        localStorage.setItem(THEME_STORAGE_KEY, key);
    } catch {
        /* storage unavailable — theme just won't persist across reloads */
    }
    emitTheme();
}

if (typeof window !== "undefined" && !store.storageBound) {
    store.storageBound = true;
    window.addEventListener("storage", (e) => {
        if (e.key === THEME_STORAGE_KEY && e.newValue && THEMES[e.newValue] && e.newValue !== store.current) {
            store.current = e.newValue;
            emitTheme();
        }
    });
}

/* Returns [themeKey, setTheme, rootStyle]. Put rootStyle on the page's root element. */
export function useTheme() {
    const [theme, setLocal] = useState(store.current);
    useEffect(() => {
        setLocal(store.current); // catch a change made between render and mount
        store.listeners.add(setLocal);
        return () => {
            store.listeners.delete(setLocal);
        };
    }, []);
    const style = useMemo(() => themeStyle(theme), [theme]);
    return [theme, setTheme, style];
}

/* Theme picker shown inside Settings. */
export function ThemePicker({ theme, onChange }) {
    return (
        <div className="flex flex-col gap-2 pb-3 border-b border-solid border-[color:var(--t-bd0)]">
            <span className="text-[color:var(--t-tx1)] text-xs">Theme</span>
            <div className="grid grid-cols-2 gap-2">
                {Object.keys(THEMES).map((key) => {
                    const t = THEMES[key].vars;
                    const active = theme === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onChange(key)}
                            aria-pressed={active}
                            className="flex flex-col gap-1.5 p-2 text-left border border-solid transition-all duration-150 active:scale-[0.98]"
                            style={{
                                background: t.bg1,
                                borderColor: active ? t.ac : t.bd0,
                                boxShadow: active ? `0 0 12px ${withAlpha(t.ac, "55")}` : "none",
                            }}
                        >
                            <div className="flex gap-1">
                                <span className="w-4 h-4" style={{ background: t.ac }} />
                                <span className="w-4 h-4" style={{ background: t.ok }} />
                                <span className="w-4 h-4" style={{ background: t.bg3, border: `1px solid ${t.bd1}` }} />
                            </div>
                            <span className="text-[10px] font-bold" style={{ color: t.tx0 }}>
                                {THEMES[key].label.toUpperCase()}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* Theme-aware line icons (stroke follows the theme instead of a fixed colour). */
export function CloseIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--t-tx1)" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
    );
}
export function MenuIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="var(--t-ac)" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}
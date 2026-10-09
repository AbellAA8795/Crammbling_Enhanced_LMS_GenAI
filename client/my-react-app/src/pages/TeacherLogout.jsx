import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export default function TeacherLogout({ onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose?.(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleConfirm() {
    try {
      localStorage.removeItem("teacher_profile_data");
      localStorage.removeItem("teacher_theme_mode");
      sessionStorage.clear();
    } catch {}
    onClose?.();
    setTimeout(() => navigate("/"), 220);
  }

  const modal = (
    <div style={{ position: "fixed", inset: 0, zIndex: 10001, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, backgroundColor: "var(--tt-overlay, rgba(0,0,0,0.40))" }} />

      <div role="dialog" aria-modal="true"
        style={{
          position: "relative", width: "100%", maxWidth: 420,
          backgroundColor: "var(--tt-bg1)",
          color: "var(--tt-tx0)",
          border: "1px solid var(--tt-bd0)",
          borderRadius: 16, padding: 24,
          display: "flex", flexDirection: "column", gap: 16, zIndex: 1,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{
            width: 40, height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 12,
            backgroundColor: "color-mix(in srgb, var(--tt-err) 15%, transparent)",
            color: "var(--tt-err)",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 20, height: 20 }}>
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
              <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div style={{ minWidth: 0, flex: 1, paddingTop: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "var(--tt-tx0)" }}>Sign out</span>
          </div>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--tt-tx1)", margin: 0 }}>
          Are you sure you want to sign out? You'll need to log in again to access the Faculty Portal.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <button type="button" onClick={onClose}
            style={{
              fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 8,
              color: "var(--tt-tx1)", backgroundColor: "transparent", border: "none", cursor: "pointer",
            }}>
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} autoFocus
            style={{
              fontSize: 14, fontWeight: 600, padding: "10px 20px", borderRadius: 8,
              backgroundColor: "var(--tt-err)", color: "var(--tt-onac)",
              border: "none", cursor: "pointer",
            }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return modal;
  return createPortal(modal, document.body);
}
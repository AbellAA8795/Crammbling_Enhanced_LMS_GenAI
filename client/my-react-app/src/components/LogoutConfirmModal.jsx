const SANS = 'ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif';

function LogoutConfirmModal({ onConfirm, onCancel }) {
  return (
    <div
      style={{ "--font-display": SANS, "--font-label": SANS }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="panel w-[340px]"
        onClick={(e) => e.stopPropagation()}
      >
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

export default LogoutConfirmModal;
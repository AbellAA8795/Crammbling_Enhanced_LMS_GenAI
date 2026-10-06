import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { withAlpha } from "../pages/Theme";

const EDIT_ICON =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z'/></svg>";

function PencilIcon({ className, size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}
function FriendAddIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width="13" height="13">
      <circle cx="9" cy="8" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <line x1="18" y1="6" x2="18" y2="12" /><line x1="15" y1="9" x2="21" y2="9" />
    </svg>
  );
}
function FriendCheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width="13" height="13">
      <circle cx="9" cy="8" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
function ClockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width="13" height="13">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} width="13" height="13">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function XIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} width="13" height="13">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function BanIcon({ className, size = 13 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} width={size} height={size}>
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  );
}

const BADGE_COLORS = ["var(--t-ac)", "var(--t-warn)", "var(--t-ok2)", "var(--t-ok)", "var(--t-err)", "var(--t-ac2)"];

function colorForString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return BADGE_COLORS[h % BADGE_COLORS.length];
}
function initialsFor(name) {
  return String(name || "")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
function findFriendship(friendships, a, b) {
  return friendships.find((f) => (f.from === a && f.to === b) || (f.from === b && f.to === a)) || null;
}
function friendStateFor(friendships, me, them) {
  if (me === them) return "self";
  const rel = findFriendship(friendships, me, them);
  if (!rel) return "none";
  if (rel.status === "accepted") return "friends";
  return rel.from === me ? "outgoing" : "incoming";
}
function getProfile(member, myProfile) {
  let h = 0;
  for (let i = 0; i < member.name.length; i++) h = (h * 31 + member.name.charCodeAt(i)) >>> 0;
  const isMe = member.id === "you";
  const source = isMe ? { ...member, ...myProfile } : member;
  return {
    id: member.id,
    name: source.name || member.name,
    role: member.role,
    avatarUrl: source.avatarUrl || null,
    handle: source.handle || `@${(source.name || member.name).toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    accountId: source.accountId || `CRB-${String(10000 + (h % 90000))}`,
    bio: source.bio || "",
    streak: source.streak ?? (h % 30) + 1,
    xp: source.xp ?? 500 + (h % 4000),
    bannerColor: source.bannerColor || null,
    bannerUrl: source.bannerUrl || null,
  };
}

function Avatar({ name, size = 28, onClick, color, avatarUrl }) {
  const c = color || colorForString(name);
  const style = {
    width: size, height: size, fontSize: Math.max(9, size * 0.36),
    backgroundColor: withAlpha(c, "33"), color: c,
    border: `1px solid ${withAlpha(c, "4D")}`,
  };
  const cls = "shrink-0 flex items-center justify-center font-bold rounded-full overflow-hidden";
  const inner = avatarUrl ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" /> : initialsFor(name);
  if (!onClick) return <div className={cls} style={style}>{inner}</div>;
  return (
    <button type="button" onClick={onClick} className={`${cls} transition-all duration-150 hover:scale-110 hover:brightness-125 active:scale-95`} style={style}>
      {inner}
    </button>
  );
}

function Badge({ color, children }) {
  return (
    <span
      className="text-[10px] font-bold py-0.5 px-2 border border-solid shrink-0"
      style={{ backgroundColor: withAlpha(color, "33"), borderColor: withAlpha(color, "4D"), color }}
    >
      {children}
    </span>
  );
}

const BANNER_SWATCHES = ["#2CD4D9", "#3DDC84", "#F5B301", "#E5484D", "#8B5CF6", "#EC4899", "#3B82F6", "#64748B"];

function ImageCropperModal({ src, aspect = 1, title = "ADJUST IMAGE", onSave, onClose }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const dragStart = useRef(null);
  const imgRef = useRef(null);

  const CROP_W = 260;
  const CROP_H = Math.round(CROP_W / aspect);
  const OUT_W = 512;
  const OUT_H = Math.round(OUT_W / aspect);
  const baseScale = natural.w && natural.h ? Math.max(CROP_W / natural.w, CROP_H / natural.h) : 1;
  const dispW = natural.w * baseScale * scale;
  const dispH = natural.h * baseScale * scale;

  function handleImgLoad(e) {
    const img = e.currentTarget;
    setNatural({ w: img.naturalWidth, h: img.naturalHeight });
  }
  function onPointerDown(e) {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragging || !dragStart.current) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.sx),
      y: dragStart.current.oy + (e.clientY - dragStart.current.sy),
    });
  }
  function onPointerUp(e) {
    setDragging(false);
    dragStart.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }

  function handleSave() {
    const img = imgRef.current;
    if (!img || !natural.w) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUT_W;
    canvas.height = OUT_H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, OUT_W, OUT_H);
    const k = OUT_W / CROP_W;
    const imgLeft = (CROP_W - dispW) / 2 + offset.x;
    const imgTop = (CROP_H - dispH) / 2 + offset.y;
    ctx.drawImage(img, imgLeft * k, imgTop * k, dispW * k, dispH * k);
    onSave(canvas.toDataURL("image/jpeg", 0.92));
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/85" onClick={onClose} />
      <div
        className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_95%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-md overflow-hidden"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px color-mix(in srgb, var(--t-glow) 25%, transparent)" }}
      >
        <div className="flex justify-between items-center px-5 pt-4 pb-3 border-b border-solid border-[color:var(--t-mbd)]">
          <span className="text-[color:var(--t-tx0)] text-sm font-bold tracking-wide">{title}</span>
          <button onClick={onClose} className="text-[color:var(--t-mtx)] text-xl leading-none hover:text-[color:var(--t-ac2)] transition-colors" aria-label="Close">×</button>
        </div>
        <div className="flex flex-col items-center gap-4 px-5 py-5">
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative overflow-hidden bg-black cursor-grab active:cursor-grabbing select-none touch-none"
            style={{ width: CROP_W, height: CROP_H }}
          >
            <img
              ref={imgRef}
              src={src}
              alt=""
              draggable={false}
              onLoad={handleImgLoad}
              className="absolute pointer-events-none select-none"
              style={{ width: dispW, height: dispH, left: (CROP_W - dispW) / 2 + offset.x, top: (CROP_H - dispH) / 2 + offset.y, maxWidth: "none" }}
            />
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
              <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
            </div>
          </div>
          <div className="w-full flex items-center gap-3">
            <span className="text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider">ZOOM</span>
            <input
              type="range"
              min="1"
              max="4"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="flex-1 accent-[var(--t-ac)]"
            />
            <button
              type="button"
              onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}
              className="text-[color:var(--t-mtx)] text-[10px] font-bold hover:text-[color:var(--t-ac)] transition-colors"
            >
              RESET
            </button>
          </div>
          <p className="text-[color:var(--t-ph)] text-[10px] text-center">Drag the image to reposition. Use the slider to zoom.</p>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-xs font-bold py-2.5 hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-tx0)] transition-all duration-150 active:scale-[0.98]"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2.5 hover:opacity-90 transition-all duration-150 active:scale-[0.98]"
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileModal({
  member, groups, myProfile, roles, friendState, isBlocked,
  onClose, onMessage, onEdit, onAddFriend, onAcceptFriend, onRemoveFriend, onToggleBlock,
}) {
  if (!member) return null;
  const p = getProfile(member, myProfile);
  const isMe = member.id === "you";
  const color = colorForString(p.name);
  const shared = groups.filter((g) => g.type !== "dm" && g.members.some((m) => m.id === member.id));
  const roleList = roles || [];

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_92%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-sm overflow-hidden flex flex-col max-h-[88vh]"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.65), 0 0 40px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-3 z-20 text-[color:var(--t-tx0)] text-xl leading-none hover:text-[color:var(--t-ac2)] transition-colors"
        >
          ×
        </button>
        <div className="relative shrink-0">
          <div
            className="h-20 w-full"
            style={p.bannerUrl
              ? { backgroundImage: `url(${p.bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: p.bannerColor || `linear-gradient(135deg, ${withAlpha(color, "88")}, ${withAlpha(color, "22")})` }}
          />
          <div className="absolute left-5 -bottom-10 rounded-full p-1" style={{ backgroundColor: "var(--t-mbg)" }}>
            <Avatar name={p.name} size={72} color={color} avatarUrl={p.avatarUrl} />
          </div>
        </div>
        <div className="chat-scroll flex-1 overflow-y-auto px-5 pt-12 pb-5">
          <div className="text-left flex items-center gap-2 flex-wrap">
            <span className="text-[color:var(--t-tx0)] text-base font-bold leading-tight">
              {isMe ? (p.name || "You") : p.name}
            </span>
            {isBlocked && (
              <span className="text-[10px] font-bold py-0.5 px-2 border border-solid shrink-0 bg-[color-mix(in_srgb,_var(--t-err)_20%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-err)_45%,_transparent)] text-[color:var(--t-err)]">
                BLOCKED
              </span>
            )}
          </div>
          <span className="text-[color:var(--t-mtx)] text-[11px] block text-left">{p.handle} · {p.accountId}</span>
          {p.bio && (
            <div className="mt-4 text-left">
              <span className="text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider uppercase">About Me</span>
              <p className="text-[color:var(--t-tx1)] text-xs mt-1 whitespace-pre-wrap">{p.bio}</p>
            </div>
          )}
          {roleList.length > 0 && (
            <div className="mt-4 text-left">
              <span className="text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider uppercase">Roles</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {roleList.map((r, i) => (
                  <Badge key={i} color={r.color || "var(--t-ac)"}>{r.label}</Badge>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2 w-full mt-4">
            <div className="flex-1 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] py-2 text-center">
              <span className="block text-[color:var(--t-warn)] text-sm font-bold">{p.streak}</span>
              <span className="text-[color:var(--t-mtx)] text-[10px]">STREAK</span>
            </div>
            <div className="flex-1 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] py-2 text-center">
              <span className="block text-[color:var(--t-ac)] text-sm font-bold">{p.xp.toLocaleString()}</span>
              <span className="text-[color:var(--t-mtx)] text-[10px]">XP</span>
            </div>
          </div>
          {shared.length > 0 && (
            <div className="w-full mt-4 text-left">
              <span className="text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider uppercase">
                {isMe ? "Your Groups" : "Shared Groups"} ({shared.length})
              </span>
              <div className="chat-scroll flex flex-col gap-1 mt-1.5 max-h-32 overflow-y-auto">
                {shared.map((g) => (
                  <div key={g.id} className="flex items-center gap-2 text-xs text-[color:var(--t-tx1)]">
                    <Avatar name={g.name} size={18} color={g.color} avatarUrl={g.picture} />
                    <span className="truncate">{g.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 border-t border-solid border-[color:var(--t-mbd)] p-3">
          {isMe ? (
            <button
              onClick={() => onEdit && onEdit()}
              className="flex items-center justify-center gap-2 w-full bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2 hover:opacity-90 transition-all duration-150 active:scale-[0.98]"
            >
              <img src={EDIT_ICON} alt="" className="w-3 h-3" /> EDIT PROFILE
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              {friendState === "incoming" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onAcceptFriend && onAcceptFriend(member)}
                    className="flex flex-1 items-center justify-center gap-1.5 bg-[var(--t-ok)] text-[color:var(--t-onok2)] text-xs font-bold py-2 hover:opacity-90 transition-all duration-150 active:scale-[0.98]"
                  >
                    <CheckIcon /> ACCEPT
                  </button>
                  <button
                    onClick={() => onRemoveFriend && onRemoveFriend(member)}
                    className="flex flex-1 items-center justify-center gap-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-xs font-bold py-2 hover:border-[color:var(--t-err)] hover:text-[color:var(--t-err)] transition-all duration-150 active:scale-[0.98]"
                  >
                    <XIcon /> DECLINE
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                {friendState === "none" && (
                  <button
                    onClick={() => onAddFriend && onAddFriend(member)}
                    className="flex flex-1 items-center justify-center gap-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-xs font-bold py-2 hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.98]"
                  >
                    <FriendAddIcon /> ADD FRIEND
                  </button>
                )}
                {friendState === "outgoing" && (
                  <button
                    onClick={() => onRemoveFriend && onRemoveFriend(member)}
                    className="flex flex-1 items-center justify-center gap-1.5 bg-[color-mix(in_srgb,_var(--t-warn)_12%,_transparent)] border border-solid border-[color:color-mix(in_srgb,_var(--t-warn)_45%,_transparent)] text-[color:var(--t-warn)] text-xs font-bold py-2 hover:border-[color:color-mix(in_srgb,_var(--t-err)_50%,_transparent)] hover:text-[color:var(--t-err)] transition-all duration-150 active:scale-[0.98]"
                  >
                    <ClockIcon /> REQUEST SENT
                  </button>
                )}
                {friendState === "friends" && (
                  <button
                    onClick={() => onRemoveFriend && onRemoveFriend(member)}
                    className="flex flex-1 items-center justify-center gap-1.5 bg-[color-mix(in_srgb,_var(--t-ok)_18%,_transparent)] border border-solid border-[color:color-mix(in_srgb,_var(--t-ok)_50%,_transparent)] text-[color:var(--t-ok2)] text-xs font-bold py-2 hover:border-[color:color-mix(in_srgb,_var(--t-err)_50%,_transparent)] hover:text-[color:var(--t-err)] transition-all duration-150 active:scale-[0.98]"
                  >
                    <FriendCheckIcon /> FRIENDS
                  </button>
                )}
                <button
                  onClick={() => onMessage && onMessage(member)}
                  disabled={isBlocked}
                  className={`flex-1 text-xs font-bold py-2 transition-all duration-150 ${isBlocked
                    ? "bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-mtx)] cursor-not-allowed opacity-60"
                    : "bg-[var(--t-ac)] text-[color:var(--t-onac)] hover:opacity-90 active:scale-[0.98]"}`}
                >
                  MESSAGE
                </button>
              </div>
              <button
                onClick={() => onToggleBlock && onToggleBlock(member)}
                className={`flex items-center justify-center gap-1.5 w-full text-xs font-bold py-2 border border-solid transition-all duration-150 active:scale-[0.98] ${isBlocked
                  ? "bg-[color-mix(in_srgb,_var(--t-err)_18%,_transparent)] border-[color:color-mix(in_srgb,_var(--t-err)_50%,_transparent)] text-[color:var(--t-err)]"
                  : "bg-[var(--t-in0)] border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] hover:border-[color:var(--t-err)] hover:text-[color:var(--t-err)]"}`}
              >
                <BanIcon /> {isBlocked ? "UNBLOCK" : "BLOCK"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditProfileModal({ myProfile, onClose, onSave }) {
  const [name, setName] = useState(myProfile.name || "You");
  const [handle, setHandle] = useState(myProfile.handle || "@you");
  const [bio, setBio] = useState(myProfile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(myProfile.avatarUrl || "");
  const [bannerUrl, setBannerUrl] = useState(myProfile.bannerUrl || "");
  const [bannerColor, setBannerColor] = useState(myProfile.bannerColor || "");
  const [avatarError, setAvatarError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [cropper, setCropper] = useState(null);
  const MAX_BYTES = 5 * 1024 * 1024;

  function pickImage(file, target, setErr) {
    setErr("");
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErr("Please pick an image file."); return; }
    if (file.size > MAX_BYTES) { setErr("Image is too large (max 5 MB)."); return; }
    const reader = new FileReader();
    reader.onload = () => setCropper({ src: String(reader.result || ""), target });
    reader.onerror = () => setErr("Could not read that file.");
    reader.readAsDataURL(file);
  }
  function handleCropSave(url) {
    if (!cropper) return;
    if (cropper.target === "avatar") setAvatarUrl(url); else setBannerUrl(url);
    setCropper(null);
  }
  function submit(e) {
    e.preventDefault();
    onSave({
      name: name.trim() || "You",
      handle: handle.trim() || "@you",
      bio: bio.trim(),
      avatarUrl: avatarUrl || null,
      bannerUrl: bannerUrl || null,
      bannerColor: bannerColor || null,
    });
  }

  const field = "w-full bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx0)] text-xs py-2 px-3 text-left outline-none transition-all duration-200 placeholder:text-[color:var(--t-ph)] focus:border-[color:var(--t-ac)] focus:bg-[var(--t-in1)]";
  const Label = ({ children }) => (
    <span className="text-[color:var(--t-mtx)] text-[10px] font-bold tracking-wider uppercase text-left">{children}</span>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative bg-[color-mix(in_srgb,_var(--t-mbg)_95%,_transparent)] backdrop-blur-md border border-solid border-[color:var(--t-mbd)] w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px color-mix(in srgb, var(--t-glow) 30%, transparent)" }}
      >
        <div className="h-0.5 w-full shrink-0" style={{ background: "linear-gradient(90deg, var(--t-ac), var(--t-warn), var(--t-ac))" }} />
        <div className="flex justify-between items-center px-5 pt-4 pb-3 border-b border-solid border-[color:var(--t-mbd)] shrink-0">
          <span className="text-[color:var(--t-tx0)] text-sm font-bold tracking-wide">EDIT PROFILE</span>
          <button type="button" onClick={onClose} className="text-[color:var(--t-mtx)] text-xl leading-none hover:text-[color:var(--t-ac2)] transition-colors" aria-label="Close">×</button>
        </div>
        <div className="chat-scroll flex flex-col gap-4 px-5 py-5 overflow-y-auto">
          <label className="flex flex-col gap-1.5">
            <Label>Display name</Label>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={32} placeholder="e.g. You" className={field} />
          </label>
          <label className="flex flex-col gap-1.5">
            <Label>Username</Label>
            <div className="flex items-center bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] focus-within:border-[color:var(--t-ac)] focus-within:bg-[var(--t-in1)] transition-all duration-200">
              <span className="pl-3 text-[color:var(--t-mtx)] text-xs select-none pointer-events-none">@</span>
              <input
                value={handle.replace(/^@/, "")}
                onChange={(e) => {
                  const next = e.target.value.replace(/^@+/, "").replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();
                  setHandle("@" + next);
                }}
                maxLength={23}
                placeholder="you"
                className="flex-1 bg-transparent border-0 text-[color:var(--t-tx0)] text-xs py-2 pr-3 outline-none placeholder:text-[color:var(--t-ph)]"
              />
            </div>
            <span className="text-[color:var(--t-ph)] text-[10px] text-left">Shown as @username · people can find you with this.</span>
          </label>
          <label className="flex flex-col gap-1.5">
            <Label>About me</Label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={190}
              rows={3}
              placeholder="Tell people a little about yourself..."
              className={`${field} resize-none`}
            />
            <span className="text-[color:var(--t-ph)] text-[10px] text-right">{bio.length}/190</span>
          </label>
          <div className="flex flex-col gap-1.5">
            <Label>Avatar</Label>
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 overflow-hidden rounded-full border border-solid border-[color:var(--t-mbd)] bg-[var(--t-in0)] flex items-center justify-center"
                style={{ width: 56, height: 56 }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[color:var(--t-ph)] text-[10px]">No avatar</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label
                  htmlFor="sp-edit-avatar"
                  className="flex items-center justify-center gap-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-[11px] font-bold py-2 px-3 cursor-pointer hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.98]"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {avatarUrl ? "Change" : "Choose file"}
                </label>
                <input
                  id="sp-edit-avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { pickImage(e.target.files?.[0], "avatar", setAvatarError); e.target.value = ""; }}
                />
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl("")}
                    className="text-[color:var(--t-mtx)] text-[10px] font-bold hover:text-[color:var(--t-err)] transition-colors self-start"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {avatarError && <span className="text-[color:var(--t-err)] text-[10px]">{avatarError}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Banner image (optional)</Label>
            <div className="flex items-center gap-3">
              <div className="shrink-0 overflow-hidden border border-solid border-[color:var(--t-mbd)] bg-[var(--t-in0)]" style={{ width: 96, height: 32 }}>
                {bannerUrl ? (
                  <img src={bannerUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-[color:var(--t-ph)] text-[9px]">No banner</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <label
                  htmlFor="sp-edit-banner"
                  className="flex items-center justify-center gap-1.5 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-[11px] font-bold py-2 px-3 cursor-pointer hover:border-[color:var(--t-ac)] hover:text-[color:var(--t-ac)] transition-all duration-150 active:scale-[0.98]"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {bannerUrl ? "Change" : "Choose file"}
                </label>
                <input
                  id="sp-edit-banner"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { pickImage(e.target.files?.[0], "banner", setBannerError); e.target.value = ""; }}
                />
                {bannerUrl && (
                  <button
                    type="button"
                    onClick={() => setBannerUrl("")}
                    className="text-[color:var(--t-mtx)] text-[10px] font-bold hover:text-[color:var(--t-err)] transition-colors self-start"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {bannerError && <span className="text-[color:var(--t-err)] text-[10px]">{bannerError}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Banner color (fallback)</Label>
            <div className="h-10 w-full border border-solid border-[color:var(--t-mbd)]" style={{ background: bannerColor || "var(--t-in0)" }} />
            <div className="flex flex-wrap items-center gap-1.5">
              {BANNER_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBannerColor(c)}
                  aria-label={`Banner color ${c}`}
                  className="w-6 h-6 rounded-full border-2 border-solid transition-transform duration-150 hover:scale-110 active:scale-95"
                  style={{ backgroundColor: c, borderColor: bannerColor === c ? "var(--t-tx0)" : "transparent" }}
                />
              ))}
              <label
                className="relative w-6 h-6 rounded-full overflow-hidden cursor-pointer border border-solid border-[color:var(--t-mbd)] hover:scale-110 transition-transform"
                title="Custom color"
                style={{ background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" }}
              >
                <input
                  type="color"
                  value={bannerColor || "#2CD4D9"}
                  onChange={(e) => setBannerColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
              {bannerColor && (
                <button
                  type="button"
                  onClick={() => setBannerColor("")}
                  className="ml-1 text-[color:var(--t-mtx)] text-[10px] font-bold hover:text-[color:var(--t-err)] transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[var(--t-in0)] border border-solid border-[color:var(--t-mbd)] text-[color:var(--t-tx1)] text-xs font-bold py-2.5 hover:border-[color:var(--t-ac2)] hover:text-[color:var(--t-tx0)] transition-all duration-150 active:scale-[0.98]"
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="flex-1 bg-[var(--t-ac)] text-[color:var(--t-onac)] text-xs font-bold py-2.5 hover:opacity-90 transition-all duration-150 active:scale-[0.98]"
          >
            SAVE
          </button>
        </div>
      </form>
      {cropper && (
        <ImageCropperModal
          src={cropper.src}
          aspect={cropper.target === "avatar" ? 1 : 3}
          title={cropper.target === "avatar" ? "ADJUST AVATAR" : "ADJUST BANNER"}
          onSave={handleCropSave}
          onClose={() => setCropper(null)}
        />
      )}
    </div>
  );
}

const ProfileContext = createContext(null);

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}

export function ProfileProvider({ children }) {
  const [myProfile, setMyProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("crammbling_profile");
      if (saved) return JSON.parse(saved);
    } catch { /* storage unavailable — fall through to defaults */ }
    return {
      name: "You",
      handle: "@you",
      bio: "",
      avatarUrl: null,
      bannerColor: null,
      bannerUrl: null,
    };
  });

  const [profileMember, setProfileMember] = useState(null);
  const [profileRoles, setProfileRoles] = useState([]);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [friendships, setFriendships] = useState([
    { id: "fr-seed", from: "m4", to: "you", status: "pending" },
  ]);
  const [blocked, setBlocked] = useState([]);

  useEffect(() => {
    try {
      localStorage.setItem("crammbling_profile", JSON.stringify(myProfile));
    } catch { /* storage unavailable — ignore */ }
  }, [myProfile]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setProfileMember(null);
        setProfileRoles([]);
        setEditProfileOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function openMyProfile() {
    setProfileMember({ id: "you", name: myProfile.name || "You", role: "member" });
    setProfileRoles([]);
  }

  function viewMember(member, group) {
    const roles = [];
    if (group) {
      if (member.role === "admin") roles.push({ label: "ADMIN", color: "var(--t-ac)" });
      if (group.type === "classroom") roles.push({ label: "STUDENT", color: "var(--t-ok)" });
      if (group.type === "squad" && member.role !== "admin") roles.push({ label: "MEMBER", color: "var(--t-mtx)" });
    }
    setProfileMember({ ...member, role: member.role });
    setProfileRoles(roles);
  }

  function closeProfile() {
    setProfileMember(null);
    setProfileRoles([]);
  }

  function openEditProfile() { setEditProfileOpen(true); }
  function closeEditProfile() { setEditProfileOpen(false); }

  function saveProfile(updated) {
    setMyProfile((prev) => ({ ...prev, ...updated }));
    setEditProfileOpen(false);
    setProfileMember((prev) =>
      prev && prev.id === "you" ? { ...prev, name: updated.name } : prev
    );
  }

  function sendFriendRequest(m) {
    setFriendships((prev) =>
      findFriendship(prev, "you", m.id)
        ? prev
        : [...prev, { id: `fr${Date.now()}`, from: "you", to: m.id, status: "pending" }]
    );
  }

  function acceptFriendRequest(m) {
    setFriendships((prev) =>
      prev.map((f) =>
        (f.from === m.id && f.to === "you") || (f.from === "you" && f.to === m.id)
          ? { ...f, status: "accepted" }
          : f
      )
    );
  }

  function removeFriendship(m) {
    setFriendships((prev) =>
      prev.filter(
        (f) => !((f.from === "you" && f.to === m.id) || (f.from === m.id && f.to === "you"))
      )
    );
  }

  function toggleBlock(m) {
    setBlocked((prev) =>
      prev.includes(m.id) ? prev.filter((id) => id !== m.id) : [...prev, m.id]
    );
  }

  const value = {
    myProfile,
    profileMember,
    profileRoles,
    editProfileOpen,
    friendships,
    blocked,
    openMyProfile,
    viewMember,
    closeProfile,
    openEditProfile,
    closeEditProfile,
    saveProfile,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriendship,
    toggleBlock,
    isBlocked: (id) => blocked.includes(id),
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function ProfileButton({ className = "" }) {
  const { myProfile, openMyProfile } = useProfile();
  return (
    <button
      type="button"
      onClick={openMyProfile}
      className={`flex flex-col shrink-0 items-start px-1 sm:px-2 ${className}`}
      aria-label="Open profile"
    >
      <div
        className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-[var(--t-ac)] border border-solid border-[color:var(--t-bd0)] transition-transform duration-150 hover:scale-110 active:scale-95"
        style={{ boxShadow: "0px 1px 2px #0000000D" }}
      >
        {myProfile.avatarUrl ? (
          <img src={myProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[color:var(--t-onac)] text-sm font-bold">
            {initialsFor(myProfile.name || "CP")}
          </span>
        )}
      </div>
    </button>
  );
}

export function ProfileHost({ groups = [], onMessage }) {
  const {
    myProfile, profileMember, profileRoles, editProfileOpen, friendships,
    openEditProfile, closeEditProfile, saveProfile, closeProfile,
    sendFriendRequest, acceptFriendRequest, removeFriendship, toggleBlock, isBlocked,
  } = useProfile();

  return (
    <>
      {profileMember && (
        <ProfileModal
          member={profileMember}
          groups={groups}
          myProfile={myProfile}
          roles={profileRoles}
          friendState={friendStateFor(friendships, "you", profileMember.id)}
          isBlocked={isBlocked(profileMember.id)}
          onClose={closeProfile}
          onMessage={onMessage || (() => {})}
          onEdit={openEditProfile}
          onAddFriend={sendFriendRequest}
          onAcceptFriend={acceptFriendRequest}
          onRemoveFriend={removeFriendship}
          onToggleBlock={toggleBlock}
        />
      )}
      {editProfileOpen && (
        <EditProfileModal
          myProfile={myProfile}
          onClose={closeEditProfile}
          onSave={saveProfile}
        />
      )}
    </>
  );
}

const PROFILE_ICON =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%232CD4D9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='8' r='4'/><path d='M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2'/></svg>";

export function SidebarProfileButton() {
  const { openMyProfile } = useProfile();
  return (
    <button
      type="button"
      onClick={openMyProfile}
      className="flex items-center self-stretch py-2 text-left hover:bg-[var(--t-bg3)] transition-all duration-150 active:scale-[0.98]"
    >
      <img src={PROFILE_ICON} alt="" className="w-[15px] h-[15px] mx-3 object-fill" />
      <span className="text-[color:var(--t-tx1)] text-[11px]">PROFILE</span>
    </button>
  );
}
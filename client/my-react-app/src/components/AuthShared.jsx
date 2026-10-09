import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

/**
 * Exact list of school email domains that are allowed besides gmail.com.
 * Ask the school for its exact domain(s) and put them here.
 * Matching is EXACT (no "endsWith"), so "evilschool.edu.ph" can't sneak in.
 */
const SCHOOL_DOMAINS = [
  "plpasig.edu.ph",
];

/**
 * Email check (format + domain only; whether the mailbox really exists and
 * belongs to the user is confirmed by the verification code).
 *
 * - gmail.com: 6-30 letters, numbers or periods, no leading/trailing/double periods.
 * - School domains: must match SCHOOL_DOMAINS exactly.
 */
export function validateEmail(value) {
  const email = value.trim().toLowerCase();
  if (!email) return "Email is required.";

  const parts = email.split("@");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return "Enter a valid email, like name@gmail.com or your school email.";
  }

  const [local, domain] = parts;

  // Regular Gmail: keep the strict Gmail rules.
  if (domain === "gmail.com") {
    const name = local.split("+")[0]; // name+tag@gmail.com is valid
    if (name.length < 6 || name.length > 30 || !/^[a-z0-9]+(\.[a-z0-9]+)*$/.test(name)) {
      return "Gmail names use 6-30 letters, numbers, or periods.";
    }
    return "";
  }

  // School email: the domain must be on the allowlist EXACTLY.
  if (SCHOOL_DOMAINS.includes(domain)) {
    if (!/^[a-z0-9]+([._-][a-z0-9]+)*$/.test(local)) {
      return "That school email name doesn't look right.";
    }
    return "";
  }

  return "Use a Gmail address or your school email.";
}

// Keeps any other file that still imports the old name working.
export const validateGmail = validateEmail;

export function AuthCard({ subtitle, children, wide }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-deep font-display px-4 py-10">
      <div className={`relative w-full ${wide ? "max-w-[540px]" : "max-w-[420px]"} bg-panel border border-edge shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-9`}>
        {/* corner accents */}
        <div className="absolute top-5 left-5 w-3 h-3 border-t-2 border-l-2 border-faint" />
        <div className="absolute top-5 right-5 w-3 h-3 border-t-2 border-r-2 border-faint" />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3">
          <span className="w-1.5 h-1.5 bg-gold" />
          <span className="w-1.5 h-1.5 bg-gold" />
        </div>

        <h1 className="text-center text-ink text-[30px] font-bold tracking-[0.15em] mt-2 mb-1">
          CRAMMBLING
        </h1>
        <p className="text-center text-cyan font-label text-[12px] uppercase tracking-[0.2em] mb-6">
          ■ {subtitle} ■
        </p>
        {children}
      </div>
    </div>
  );
}

/** Eye button that shows/hides a password. Eye = hidden (click to show), slashed eye = visible. */
export function PasswordToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
      aria-pressed={show}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-mute cursor-pointer transition-colors duration-150 hover:text-ink focus:outline-none focus-visible:text-ink"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
        aria-hidden="true"
      >
        {show ? (
          <>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </>
        ) : (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
      </svg>
    </button>
  );
}

/** Small "i" icon that shows a tooltip on hover, keyboard focus, or tap. */
function InfoTip({ id, text }) {
  return (
    <span className="relative group inline-flex">
      <button
        type="button"
        aria-label="Show requirements"
        aria-describedby={id}
        className="w-4 h-4 border border-faint text-mute text-[10px] leading-none flex items-center justify-center cursor-help transition-colors duration-150 hover:text-ink hover:border-white focus:outline-none focus-visible:text-cyan focus-visible:border-cyan"
      >
        i
      </button>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full mt-2 z-20 w-56 border border-edge bg-deep px-3 py-2 text-[11px] leading-relaxed tracking-wide text-ink shadow-[0_8px_24px_rgba(0,0,0,0.5)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

/**
 * Text field with live feedback.
 * `error`  -> red border + message (parent decides when to show it)
 * `valid`  -> green border once the value passes validation
 * `action` -> optional node rendered beside the input (e.g. "Send code")
 */
export function Field({
  id,
  label,
  optional,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  valid,
  hint,
  tooltip,
  icon,
  action,
  first,
  disabled,
  inputMode,
  maxLength,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const border = error
    ? "border-danger focus:border-danger"
    : valid
    ? "border-lime/70 focus:border-lime"
    : "border-edge focus:border-faint";

  return (
    <div className={first ? "" : "mt-5"}>
      <div className="flex items-center gap-1.5 mb-2">
        <label
          htmlFor={id}
          className="flex items-center gap-1.5 text-left font-label text-[10px] uppercase tracking-[0.14em] text-mute"
        >
          <span className="w-1.5 h-1.5 bg-lime" />
          {label}
          {optional && <span className="text-faint">(optional)</span>}
        </label>
        {tooltip && <InfoTip id={`${id}-tip`} text={tooltip} />}
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            id={id}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            inputMode={inputMode}
            maxLength={maxLength}
            autoComplete={autoComplete}
            className={`w-full py-3.5 pl-4 ${isPassword || icon ? "pr-10" : "pr-4"} bg-deep border text-ink placeholder:text-faint text-[15px] transition-colors duration-200 focus:outline-none autofill:shadow-[inset_0_0_0_1000px_var(--color-deep)] autofill:[-webkit-text-fill-color:var(--color-ink)] disabled:opacity-50 disabled:cursor-not-allowed ${border}`}
          />
          {isPassword ? (
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          ) : (
            icon && (
              <img
                src={icon}
                alt=""
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 brightness-200 pointer-events-none"
              />
            )
          )}
        </div>
        {action}
      </div>
      {error ? (
        <p role="alert" className="text-danger text-[12px] mt-1.5">
          {error}
        </p>
      ) : (
        hint && <p className="text-faint text-[12px] mt-1.5">{hint}</p>
      )}
    </div>
  );
}

export const primaryButton = "btn btn-lime w-full mt-7 py-3.5 text-[13px]";

/**
 * Email + verification code block, used by Forgot Password and the last
 * step of Registration.
 *
 * `initialEmail` / `lockEmail` are optional: Registration passes the email
 * already collected in step 1 and locks the field so it can't drift from
 * the account that was actually created server-side. Forgot Password (or
 * any other caller) can omit both and the field behaves exactly as before
 * — free text entry.
 */
export function EmailVerifyForm({ submitLabel, onVerified, footer, initialEmail = "", lockEmail = false }) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [touched, setTouched] = useState({ email: !!initialEmail, code: false });
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sendError, setSendError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const emailError = validateEmail(email);

  const codeError = !codeSent
    ? "Send a code to your email first."
    : !code
    ? "Verification code is required."
    : code.length < 6
    ? "The code has 6 digits."
    : "";

  const touch = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const handleSendCode = async () => {
    touch("email");
    if (emailError) return;

    setSendError("");
    setIsSending(true);
    try {
      await apiRequest("/api/otp/send", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setCodeSent(true);
      setCooldown(30);
    } catch (err) {
      setSendError(err.message || "Failed to send code. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, code: true });
    if (emailError || codeError) return;

    setVerifyError("");
    setIsVerifying(true);
    try {
      await apiRequest("/api/otp/verify", {
        method: "POST",
        body: JSON.stringify({ email, otp: code }),
      });
      onVerified(email);
    } catch (err) {
      setVerifyError(err.message || "Invalid or expired code.");
    } finally {
      setIsVerifying(false);
    }
  };

  const sendLabel =
    isSending ? "Sending..." : cooldown > 0 ? `Resend (${cooldown}s)` : codeSent ? "Resend code" : "Send code";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field
        first
        id="verify-email"
        label="Email"
        type="email"
        placeholder="name@gmail.com or school email"
        value={email}
        disabled={lockEmail}
        onChange={(e) => {
          setEmail(e.target.value);
          touch("email");
        }}
        onBlur={() => touch("email")}
        error={touched.email ? emailError : ""}
        valid={touched.email && !emailError}
        autoComplete="email"
        action={
          <button
            type="button"
            onClick={handleSendCode}
            disabled={cooldown > 0 || isSending || (touched.email && !!emailError)}
            className="btn btn-cyan whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sendLabel}
          </button>
        }
      />
      {sendError && (
        <p role="alert" className="text-danger text-[12px] mt-1.5">
          {sendError}
        </p>
      )}

      <Field
        id="verify-code"
        label="Verification Code"
        placeholder="6-digit code"
        value={code}
        inputMode="numeric"
        maxLength={6}
        autoComplete="one-time-code"
        disabled={!codeSent}
        onChange={(e) => {
          setCode(e.target.value.replace(/\D/g, ""));
          touch("code");
        }}
        onBlur={() => touch("code")}
        error={touched.code ? codeError : ""}
        valid={touched.code && !codeError}
        hint={
          codeSent
            ? `We sent a 6-digit code to ${email}. Check your inbox.`
            : "We'll send a 6-digit code to your email."
        }
      />
      {verifyError && (
        <p role="alert" className="text-danger text-[12px] mt-1.5">
          {verifyError}
        </p>
      )}

      <button type="submit" className={primaryButton} disabled={isVerifying}>
        {isVerifying ? "Verifying..." : submitLabel}
      </button>

      {footer}
    </form>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCard, Field, EmailVerifyForm, primaryButton } from "../components/AuthShared";

function validatePasswords(password, confirmPassword) {
  return {
    password: !password
      ? "Password is required."
      : password.length < 8
      ? "Password must be at least 8 characters."
      : !/[A-Za-z]/.test(password) || !/\d/.test(password)
      ? "Password needs at least one letter and one number."
      : "",
    confirmPassword: !confirmPassword
      ? "Please confirm your password."
      : confirmPassword !== password
      ? "Passwords do not match."
      : "",
  };
}

function ResetPasswordForm({ email, onDone }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });

  const errors = validatePasswords(password, confirmPassword);
  const touch = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (errors.password || errors.confirmPassword) return;
    // TODO: send `email` + new `password` to the real reset-password API
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field
        first
        id="new-password"
        label="New Password"
        type="password"
        placeholder="New password"
        tooltip="At least 8 characters, with at least one letter and one number."
        autoComplete="new-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          touch("password");
        }}
        onBlur={() => touch("password")}
        error={touched.password ? errors.password : ""}
        valid={touched.password && !errors.password}
      />

      <Field
        id="confirm-new-password"
        label="Confirm New Password"
        type="password"
        placeholder="Confirm new password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          touch("confirmPassword");
        }}
        onBlur={() => touch("confirmPassword")}
        error={touched.confirmPassword ? errors.confirmPassword : ""}
        valid={touched.confirmPassword && !errors.confirmPassword}
      />

      <button type="submit" className={primaryButton}>
        Reset Password
      </button>
    </form>
  );
}

function ForgotPassword() {
  const navigate = useNavigate();

  const [stage, setStage] = useState("verify");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  // After the password is changed, go back to the login page automatically.
  useEffect(() => {
    if (stage !== "done") return;
    const t = setTimeout(() => navigate("/"), 2500);
    return () => clearTimeout(t);
  }, [stage, navigate]);

  const handleVerified = (email) => {
    setVerifiedEmail(email);
    setStage("reset");
  };

  const backToLogin = (
    <p className="text-center text-mute text-[13px] tracking-wide mt-6">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="text-cyan bg-transparent border-none p-0 cursor-pointer tracking-wide hover:underline"
      >
        Back to login
      </button>
    </p>
  );

  return (
    <AuthCard subtitle="RESET PASSWORD">
      {stage === "verify" && (
        <>
          <p className="text-mute text-[13px] tracking-wide leading-relaxed mb-6 text-center">
            Enter your email and the verification code we send you.
          </p>
          <EmailVerifyForm
            submitLabel="Verify Code"
            onVerified={handleVerified}
            footer={backToLogin}
          />
        </>
      )}

      {stage === "reset" && (
        <>
          <p className="text-mute text-[13px] tracking-wide leading-relaxed mb-6 text-center">
            Email verified. Enter a new password for{" "}
            <span className="text-ink">{verifiedEmail}</span>.
          </p>
          <ResetPasswordForm email={verifiedEmail} onDone={() => setStage("done")} />
          {backToLogin}
        </>
      )}

      {stage === "done" && (
        <div className="text-center">
          <div className="px-3 py-3 border border-lime/40 bg-lime/10 text-lime text-[13px] tracking-wide">
            {"\u2713"} Password changed successfully. Taking you to login...
          </div>
          <button type="button" onClick={() => navigate("/")} className={primaryButton}>
            Go to Login
          </button>
        </div>
      )}
    </AuthCard>
  );
}

export default ForgotPassword;
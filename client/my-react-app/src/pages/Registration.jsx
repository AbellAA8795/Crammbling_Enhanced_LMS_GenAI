import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import personIcon from "../assets/person.svg";
import googleIcon from "../assets/google-icon.svg";
import {
  AuthCard,
  Field,
  EmailVerifyForm,
  primaryButton,
  validateEmail,
} from "../components/AuthShared";

const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;
const STEPS = ["Your details", "Verify OTP"];

const INITIAL = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

function validate(v) {
  return {
    email: validateEmail(v.email),
    username: !v.username.trim()
      ? "Username is required."
      : v.username.length < 4
      ? "Username must be at least 4 characters."
      : v.username.length > 20
      ? "Username must be 20 characters or fewer."
      : !USERNAME_PATTERN.test(v.username)
      ? "Use only letters, numbers, and underscores."
      : "",
    password: !v.password
      ? "Password is required."
      : v.password.length < 8
      ? "Password must be at least 8 characters."
      : !/[A-Za-z]/.test(v.password) || !/\d/.test(v.password)
      ? "Password needs at least one letter and one number."
      : "",
    confirmPassword: !v.confirmPassword
      ? "Please confirm your password."
      : v.confirmPassword !== v.password
      ? "Passwords do not match."
      : "",
  };
}

function StepProgress({ step }) {
  const pct = (step / STEPS.length) * 100;
  return (
    <div className="mb-6">
      <div
        role="progressbar"
        aria-label={`Registration progress: ${STEPS[step - 1]}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-2 w-full bg-deep border border-edge overflow-hidden"
      >
        <div
          className="h-full bg-lime transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 font-label text-[10px] uppercase tracking-[0.12em]">
        {STEPS.map((label, i) => (
          <span key={label} className={i < step ? "text-lime" : "text-faint"}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SuccessModal({ onContinue }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-[320px] border border-edge bg-panel p-6 shadow-[0_0_30px_-5px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-lime text-[18px]">{"\u2713"}</span>
          <h3 className="text-ink text-[15px] tracking-wide">Account created</h3>
        </div>
        <p className="text-mute text-[13px] tracking-wide leading-relaxed mb-6">
          Your account was created successfully. Taking you to your dashboard...
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="w-full px-3 py-2.5 text-[13px] font-bold tracking-wide text-panel bg-lime hover:brightness-110 transition-colors duration-150"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

function Registration() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [values, setValues] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const errors = validate(values);

  // After the success popup appears, continue to the dashboard automatically.
  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => navigate("/dashboard"), 2500);
    return () => clearTimeout(t);
  }, [showSuccess, navigate]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // Live feedback
  const err = (field) => (touched[field] ? errors[field] : "");
  const ok = (field) => touched[field] && !errors[field] && values[field].trim() !== "";

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setTouched({
      email: true,
      username: true,
      password: true,
      confirmPassword: true,
    });
    if (Object.values(errors).some(Boolean)) return;
    // TODO: call the API here to send the OTP to `values.email`
    setStep(2);
  };

  const handleVerified = () => {
    // TODO: send `values` + verified OTP to the real registration API
    setShowSuccess(true);
  };

  const handleGoogleSignup = () => {
    navigate("/dashboard");
  };

  const field = (name, props) => ({
    id: name,
    first: true,
    value: values[name],
    onChange: handleChange(name),
    onBlur: handleBlur(name),
    error: err(name),
    valid: ok(name),
    ...props,
  });

  return (
    <>
      <AuthCard subtitle="CREATE ACCOUNT" wide>
        <StepProgress step={step} />

        {step === 1 ? (
          <>
            <form onSubmit={handleDetailsSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 items-start">
                <div className="sm:col-span-2">
                  <Field
                    {...field("username", {
                      label: "Username",
                      placeholder: "Username",
                      tooltip: "4-20 characters. Letters, numbers, and underscores only.",
                      icon: personIcon,
                      autoComplete: "username",
                    })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    {...field("email", {
                      label: "Email",
                      type: "email",
                      placeholder: "you@example.com",
                      tooltip: "We'll send a one-time code (OTP) to this email.",
                      autoComplete: "email",
                    })}
                  />
                </div>
                <Field
                  {...field("password", {
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                    tooltip: "At least 8 characters, with at least one letter and one number.",
                    autoComplete: "new-password",
                  })}
                />
                <Field
                  {...field("confirmPassword", {
                    label: "Confirm Password",
                    type: "password",
                    placeholder: "Confirm password",
                    autoComplete: "new-password",
                  })}
                />
              </div>

              <button type="submit" className={`${primaryButton} mt-6!`}>
                Next
              </button>
            </form>

            <div className="flex items-center gap-3 mt-5 mb-4">
              <span className="flex-1 h-px bg-edge" />
              <span className="text-faint text-[12px] tracking-wide">or sign up with</span>
              <span className="flex-1 h-px bg-edge" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-transparent border border-lime text-lime text-[13px] tracking-wide cursor-pointer transition-all duration-150 hover:bg-lime/10"
            >
              <img src={googleIcon} alt="" className="w-3.5 h-3.5" />
              Google
            </button>

            <p className="text-center text-mute text-[13px] tracking-wide mt-5">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-cyan bg-transparent border-none p-0 cursor-pointer tracking-wide hover:underline"
              >
                Log in
              </button>
            </p>
          </>
        ) : (
          <EmailVerifyForm
            initialEmail={values.email.trim()}
            lockEmail
            submitLabel="Verify & Create Account"
            onVerified={handleVerified}
            footer={
              <p className="text-center text-mute text-[13px] tracking-wide mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-cyan bg-transparent border-none p-0 cursor-pointer tracking-wide hover:underline"
                >
                  Back to details
                </button>
              </p>
            }
          />
        )}
      </AuthCard>

      {showSuccess && <SuccessModal onContinue={() => navigate("/dashboard")} />}
    </>
  );
}

export default Registration;
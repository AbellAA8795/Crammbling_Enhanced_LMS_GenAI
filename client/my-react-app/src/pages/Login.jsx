import { useState } from "react";
import { useNavigate } from "react-router-dom";
import personIcon from "../assets/person.svg";
import googleIcon from "../assets/google-icon.svg";
import { AuthCard, Field, primaryButton } from "../components/AuthShared";
import { apiRequest } from "../api/client.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email && value.trim()) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password && value) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = !email.trim() ? "Email is required." : "";
    const passwordError = !password ? "Password is required." : "";

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({ email: "", password: "" });
    setIsSubmitting(true);

    try {
      const data = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setErrors({ email: "", password: err.message || "Incorrect email or password." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <AuthCard subtitle="LOGIN PORTAL">
      <form onSubmit={handleSubmit} noValidate>
        <Field
          first
          id="email"
          label="Email"
          type="email"
          placeholder="Email"
          icon={personIcon}
          value={email}
          onChange={handleEmailChange}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          id="password"
          label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex justify-between items-center mt-4 text-[13px]">
          <label className="flex items-center gap-2 text-mute cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 accent-lime" />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-mute bg-transparent border-none p-0 cursor-pointer transition-colors duration-150 hover:text-ink"
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className={primaryButton} disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex items-center gap-3 mt-6 mb-4">
        <span className="flex-1 h-px bg-edge" />
        <span className="label">or continue with</span>
        <span className="flex-1 h-px bg-edge" />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn flex-1 py-2.5 border border-lime/50 text-lime hover:bg-lime/10"
        >
          <img src={googleIcon} alt="" className="w-3.5 h-3.5" />
          Google
        </button>
        <span className="label">or</span>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-gold bg-transparent border-none p-0 cursor-pointer tracking-wide hover:underline"
        >
          Create account
        </button>
      </p>
    </AuthCard>
  );
}

export default Login;
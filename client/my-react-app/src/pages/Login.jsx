import { useState } from "react";
import { useNavigate } from "react-router-dom";
import personIcon from "../assets/person.svg";
import googleIcon from "../assets/google-icon.svg";
import { AuthCard, Field, primaryButton } from "../components/AuthShared";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  // TODO: need to replace this
  const MOCK_USERNAME = "admin";
  const MOCK_PASSWORD = "password123";

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (errors.username && value.trim()) {
      setErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (errors.password && value) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const usernameError = !username.trim() ? "Username is required." : "";
    const passwordError = !password ? "Password is required." : "";

    if (usernameError || passwordError) {
      setErrors({ username: usernameError, password: passwordError });
      return;
    }

    // need to replace this for real API (this is just a hardcoded)
    if (username !== MOCK_USERNAME || password !== MOCK_PASSWORD) {
      setErrors({ username: "", password: "Incorrect username or password." });
      return;
    }

    setErrors({ username: "", password: "" });
    navigate("/dashboard");
  };

  return (
    <AuthCard subtitle="LOGIN PORTAL">
      <form onSubmit={handleSubmit} noValidate>
        <Field
          first
          id="username"
          label="Username"
          placeholder="Username"
          icon={personIcon}
          value={username}
          onChange={handleUsernameChange}
          error={errors.username}
          autoComplete="username"
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

        <button type="submit" className={primaryButton}>
          Login
        </button>
      </form>

      <div className="flex items-center gap-3 mt-6 mb-4">
        <span className="flex-1 h-px bg-edge" />
        <span className="label">or continue with</span>
        <span className="flex-1 h-px bg-edge" />
      </div>

      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="btn w-full py-2.5 border border-lime/50 text-lime hover:bg-lime/10"
      >
        <img src={googleIcon} alt="" className="w-3.5 h-3.5" />
        Google
      </button>

      <p className="text-center text-mute text-[13px] tracking-wide mt-5">
        Don't have an account?{" "}
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
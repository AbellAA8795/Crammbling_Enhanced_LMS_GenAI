import { useState } from "react";
import { useNavigate } from "react-router-dom";
import personIcon from "../assets/person.svg";
import keyIcon from "../assets/key.svg";
import googleIcon from "../assets/google-icon.svg";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });

  // TODO: need to replace this
  const MOCK_USERNAME = "admin";
  const MOCK_PASSWORD = "Password123";

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
      setErrors({
        username: "",
        password: "Incorrect username or password.",
      });
      return;
    }

    setErrors({ username: "", password: "" });
    navigate("/dashboard");
  };

  const handleGoogleLogin = () => {
    navigate("/dashboard");
  };

  const handleForgotPassword = () => {
    // to do: forgot password form
    console.log("Forgot password clicked");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0907] font-mono px-4">
      <div className="relative w-full max-w-[420px] bg-[#1c1310] rounded-2xl border border-[#3a2e26] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-9">
        {/* corner accents */}
        <div className="absolute top-5 left-5 w-3 h-3 border-t-2 border-l-2 border-[#6b6156]" />
        <div className="absolute top-5 right-5 w-3 h-3 border-t-2 border-r-2 border-[#6b6156]" />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3">
          <span className="w-1.5 h-1.5 bg-[#d4a94a]" />
          <span className="w-1.5 h-1.5 bg-[#d4a94a]" />
        </div>

        <h1 className="text-center text-white text-[28px] font-bold tracking-[3px] mt-2 mb-1">
          CRAMMBLING
        </h1>
        <p className="text-center text-[#22d3ee] text-[11px] tracking-[2px] mb-8">
          ■ LOGIN PORTAL ■
        </p>

        <form onSubmit={handleSubmit}>
          <label className="flex items-center gap-1.5 text-left text-[#9c948a] text-[10px] tracking-wide mb-2">
            <span className="w-1.5 h-1.5 bg-[#8bc34a]" />
            USERNAME
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              className={`w-full py-3.5 pl-4 pr-10 bg-[#120d0b] border rounded-lg text-white placeholder:text-[#5a5048] text-[13px] tracking-wide transition-colors duration-200 focus:outline-none ${
                errors.username
                  ? "border-[#e05252] focus:border-[#e05252]"
                  : "border-[#3a2e26] focus:border-[#6b6156]"
              }`}
            />
            <img
              src={personIcon}
              alt=""
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 brightness-200 pointer-events-none"
            />
          </div>
          {errors.username && (
            <p className="text-[#e05252] text-[10px] mt-1.5">{errors.username}</p>
          )}

          <label className="flex items-center gap-1.5 text-left text-[#9c948a] text-[10px] tracking-wide mt-5 mb-2">
            <span className="w-1.5 h-1.5 bg-[#8bc34a]" />
            PASSWORD
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full py-3.5 pl-4 pr-10 bg-[#120d0b] border rounded-lg text-white placeholder:text-[#5a5048] text-[13px] tracking-wide transition-colors duration-200 focus:outline-none ${
                errors.password
                  ? "border-[#e05252] focus:border-[#e05252]"
                  : "border-[#3a2e26] focus:border-[#6b6156]"
              }`}
            />
            <img
              src={keyIcon}
              alt=""
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 brightness-200 pointer-events-none"
            />
          </div>
          {errors.password && (
            <p className="text-[#e05252] text-[10px] mt-1.5">{errors.password}</p>
          )}

          <div className="flex justify-between items-center mt-4 text-[11px]">
            <label className="flex items-center gap-2 text-[#9c948a] cursor-pointer">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded-sm accent-[#8bc34a] bg-[#120d0b] border border-[#3a2e26]"
              />
              REMEMBER ME
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#9c948a] text-[11px] tracking-wide cursor-pointer bg-transparent border-none p-0 transition-colors duration-200 hover:text-white"
            >
              FORGOT PASSWORD
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-7 py-3.5 bg-[#a8d979] rounded-lg text-[#1c1310] text-[14px] font-bold tracking-wide cursor-pointer shadow-[0_4px_14px_rgba(168,217,121,0.35)] transition-all duration-150 hover:bg-[#9bcf66] hover:-translate-y-px"
          >
            LOGIN
          </button>
        </form>

        <p className="text-center text-[#6b6156] text-[10px] tracking-wide mt-7 mb-4">
          SELECT SIGN UP OPTION
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-transparent rounded-lg border border-[#8bc34a] text-[#8bc34a] text-[11px] tracking-wide cursor-pointer transition-all duration-150 hover:bg-[#8bc34a]/10"
          >
            <img src={googleIcon} alt="" className="w-3.5 h-3.5" />
            GOOGLE
          </button>
          <span className="text-[#6b6156] text-[11px]">OR</span>
          <button
            type="button"
            className="flex-1 py-2.5 bg-transparent rounded-lg border border-[#d4a94a] text-[#d4a94a] text-[11px] tracking-wide cursor-pointer transition-all duration-150 hover:bg-[#d4a94a]/10"
          >
            CREATE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
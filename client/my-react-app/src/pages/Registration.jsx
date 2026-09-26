import { useState } from "react";
import { useNavigate } from "react-router-dom";
import personIcon from "../assets/person.svg";
import keyIcon from "../assets/key.svg";
import googleIcon from "../assets/google-icon.svg";

function Registration() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const clearError = (field) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    clearError("username");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearError("email");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearError("password");
    clearError("confirmPassword");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    clearError("confirmPassword");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      username: !username.trim() ? "Username is required." : "",
      email: !email.trim()
        ? "Email is required."
        : !emailPattern.test(email)
        ? "Enter a valid email address."
        : "",
      password: !password
        ? "Password is required."
        : password.length < 8
        ? "Password must be at least 8 characters."
        : "",
      confirmPassword: !confirmPassword
        ? "Please confirm your password."
        : confirmPassword !== password
        ? "Passwords do not match."
        : "",
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    // TODO: replace with real registration API call
    setErrors({ username: "", email: "", password: "", confirmPassword: "" });
    navigate("/dashboard");
  };

  const handleGoogleSignup = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0907] font-mono px-4 py-10">
      <div className="relative w-full max-w-[420px] bg-[#1c1310] rounded-2xl border border-[#3a2e26] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-9">
        {/* corner accents */}
        <div className="absolute top-5 left-5 w-3 h-3 border-t-2 border-l-2 border-[#6b6156]" />
        <div className="absolute top-5 right-5 w-3 h-3 border-t-2 border-r-2 border-[#6b6156]" />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3">
          <span className="w-1.5 h-1.5 bg-[#d4a94a]" />
          <span className="w-1.5 h-1.5 bg-[#d4a94a]" />
        </div>

        <h1 className="text-center text-white text-[30px] font-bold tracking-[3px] mt-2 mb-1">
          CRAMMBLING
        </h1>
        <p className="text-center text-[#22d3ee] text-[13px] tracking-[2px] mb-8">
          ■ CREATE ACCOUNT ■
        </p>

        <form onSubmit={handleSubmit}>
          <label className="flex items-center gap-1.5 text-left text-[#9c948a] text-[12px] tracking-wide mb-2">
            <span className="w-1.5 h-1.5 bg-[#8bc34a]" />
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              className={`w-full py-3.5 pl-4 pr-10 bg-[#120d0b] border rounded-lg text-white placeholder:text-[#5a5048] text-[15px] tracking-wide transition-colors duration-200 focus:outline-none ${
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
            <p className="text-[#e05252] text-[12px] mt-1.5">{errors.username}</p>
          )}

          <label className="flex items-center gap-1.5 text-left text-[#9c948a] text-[12px] tracking-wide mt-5 mb-2">
            <span className="w-1.5 h-1.5 bg-[#8bc34a]" />
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full py-3.5 pl-4 pr-10 bg-[#120d0b] border rounded-lg text-white placeholder:text-[#5a5048] text-[15px] tracking-wide transition-colors duration-200 focus:outline-none ${
                errors.email
                  ? "border-[#e05252] focus:border-[#e05252]"
                  : "border-[#3a2e26] focus:border-[#6b6156]"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[#e05252] text-[12px] mt-1.5">{errors.email}</p>
          )}

          <label className="flex items-center gap-1.5 text-left text-[#9c948a] text-[12px] tracking-wide mt-5 mb-2">
            <span className="w-1.5 h-1.5 bg-[#8bc34a]" />
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full py-3.5 pl-4 pr-10 bg-[#120d0b] border rounded-lg text-white placeholder:text-[#5a5048] text-[15px] tracking-wide transition-colors duration-200 focus:outline-none ${
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
            <p className="text-[#e05252] text-[12px] mt-1.5">{errors.password}</p>
          )}

          <label className="flex items-center gap-1.5 text-left text-[#9c948a] text-[12px] tracking-wide mt-5 mb-2">
            <span className="w-1.5 h-1.5 bg-[#8bc34a]" />
            Confirm Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full py-3.5 pl-4 pr-10 bg-[#120d0b] border rounded-lg text-white placeholder:text-[#5a5048] text-[15px] tracking-wide transition-colors duration-200 focus:outline-none ${
                errors.confirmPassword
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
          {errors.confirmPassword && (
            <p className="text-[#e05252] text-[12px] mt-1.5">
              {errors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-7 py-3.5 bg-[#a8d979] rounded-lg text-[#1c1310] text-[16px] font-bold tracking-wide cursor-pointer shadow-[0_4px_14px_rgba(168,217,121,0.35)] transition-all duration-150 hover:bg-[#9bcf66] hover:-translate-y-px"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-[#6b6156] text-[12px] tracking-wide mt-7 mb-4">
          Or sign up with
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-transparent rounded-lg border border-[#8bc34a] text-[#8bc34a] text-[13px] tracking-wide cursor-pointer transition-all duration-150 hover:bg-[#8bc34a]/10"
          >
            <img src={googleIcon} alt="" className="w-3.5 h-3.5" />
            Google
          </button>
        </div>

        <p className="text-center text-[#9c948a] text-[13px] tracking-wide mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-[#22d3ee] bg-transparent border-none p-0 cursor-pointer tracking-wide hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Registration;
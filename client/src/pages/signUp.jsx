import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InnerNavbar from "../components/InnerNavbar";
import { requestOtp, signupUser } from "../services/authaService";
import { User, Mail, Phone, Calendar, Lock, Eye, EyeOff, UserPlus, ChevronRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import "../styles/signup.css";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const pastedData = value.split("").slice(0, 6);
      const updatedOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) updatedOtp[index + i] = char;
      });
      setOtp(updatedOtp);
      const nextIndex = Math.min(index + pastedData.length, 5);
      const nextInput = document.getElementById(`otp-${nextIndex}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setMessage({ type: "error", text: "Please enter your email first." });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid academic email." });
      return;
    }

    setOtpLoading(true);
    try {
      const response = await requestOtp(formData.email);
      setMessage({ type: "success", text: "Verification code sent to your email!" });
      setOtpSent(true);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error sending OTP.",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setMessage({ type: "error", text: "Please enter the 6-digit verification code." });
      return;
    }

    setLoading(true);
    try {
      const response = await signupUser({
        ...formData,
        otp: otpString,
      });
      if (response.data.success) {
        setMessage({ type: "success", text: "Account created successfully! Redirecting..." });
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Signup failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page winter-theme">
      <InnerNavbar />

      <main className="signup-container">
        <div className="signup-card">
          <header className="signup-header">
            <div className="signup-icon-container">
              <UserPlus size={32} />
            </div>
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join our academic community today</p>
          </header>

          {message.text && (
            <div className={`signup-status-message ${message.type}`}>
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-form-grid">
              <div className="signup-input-group">
                <label>First Name</label>
                <div className="signup-input-wrapper">
                  <User className="signup-input-icon" size={18} />
                  <input
                    name="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="signup-input-group">
                <label>Last Name</label>
                <div className="signup-input-wrapper">
                  <User className="signup-input-icon" size={18} />
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="signup-input-group">
                <label>Email Address</label>
                <div className="signup-input-wrapper">
                  <Mail className="signup-input-icon" size={18} />
                  <input
                    name="email"
                    type="email"
                    placeholder="john@university.ac.lk"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="signup-input-group">
                <label>Phone Number</label>
                <div className="signup-input-wrapper">
                  <Phone className="signup-input-icon" size={18} />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+94 7X XXX XXXX"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="signup-input-group full-width">
                <label>Date of Birth</label>
                <div className="signup-input-wrapper">
                  <Calendar className="signup-input-icon" size={18} />
                  <input
                    name="dob"
                    type="date"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="signup-input-group">
                <label>Password</label>
                <div className="signup-input-wrapper">
                  <Lock className="signup-input-icon" size={18} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="signup-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="signup-input-group">
                <label>Confirm Password</label>
                <div className="signup-input-wrapper">
                  <Lock className="signup-input-icon" size={18} />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="signup-eye-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="signup-otp-section">
              <div className="otp-header">
                <h3>Verification Code</h3>
                <p>{otpSent ? `Code sent to ${formData.email}` : "We'll send a 6-digit code to your email"}</p>
              </div>

              <div className="otp-container">
                {otpSent && (
                  <div className="otp-boxes">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        className="otp-box"
                        autoComplete="off"
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                      />
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="send-otp-btn"
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                >
                  {otpLoading ? <Loader2 className="animate-spin" size={18} /> : (otpSent ? "Resend Code" : "Send Code")}
                </button>
              </div>
            </div>

            <button type="submit" className="signup-submit-btn" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
              {!loading && <ChevronRight size={18} />}
            </button>

            <p className="signin-prompt">
              Already have an Account?{" "}
              <Link to="/signin" className="signin-link">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Signup;
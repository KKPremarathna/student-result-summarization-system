import React, { useState } from "react";
import signupImage from "../assets/images/signup-image.png";
import "../styles/signup.css";
import InnerNavbar from "../components/InnerNavbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setMessage({ type: "error", text: "Please enter your email first." });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/request-otp", {
        email: formData.email,
      });
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error sending OTP.",
      });
    } finally {
      setLoading(false);
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
      setMessage({ type: "error", text: "Please enter the 6-digit OTP." });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        ...formData,
        otp: otpString,
      });
      if (response.data.success) {
        setMessage({ type: "success", text: "Account created successfully! Redirecting..." });
        setTimeout(() => navigate("/SignIn"), 2000);
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
    <div className="signup-page">
      <InnerNavbar />

      <main className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join Academet for secure result analysis</p>
          </div>

          {message.text && (
            <div className={`message-alert ${message.type}`}>
              {message.text}
            </div>
          )}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Academic Email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-grid">
              <input
                type="text"
                name="dob"
                placeholder="Birth Date (YYYY-MM-DD)"
                required
                value={formData.dob}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-grid">
              <div className="password-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="password-wrapper">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="otp-section">
              <p className="otp-label">Identity Verification</p>
              <div className="otp-row">
                <div className="otp-boxes">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="otp-input"
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="send-otp-btn"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Processing..." : "Create Account"}
            </button>

            <p className="signin-text">
              Already have an Account ?{" "}
              <Link to="/SignIn" className="signin-link">
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
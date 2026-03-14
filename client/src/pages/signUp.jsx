import React, { useState } from "react";
import signupImage from "../assets/images/signup-image.png";
import "../styles/signup.css";
import InnerNavbar from "../components/InnerNavbar";
import { Link } from "react-router-dom";

function Signup() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
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

          <form className="signup-form">
            <div className="form-grid">
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
            </div>

            <div className="form-group">
              <input type="email" placeholder="Academic Email" />
            </div>

            <div className="form-grid">
              <input type="text" placeholder="Birth Date (YYYY-MM-DD)" />
              <input type="text" placeholder="Phone Number" />
            </div>

            <div className="form-grid">
              <div className="password-wrapper">
                <input type="password" placeholder="Password" />
                <span className="eye-icon">👁</span>
              </div>
              <div className="password-wrapper">
                <input type="password" placeholder="Confirm Password" />
                <span className="eye-icon">👁</span>
              </div>
            </div>

            <div className="otp-section">
              <p className="otp-label">Identity Verification</p>
              <div className="otp-row">
                <div className="otp-boxes">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="otp-input"
                    />
                  ))}
                </div>
                <button type="button" className="send-otp-btn">
                  Send OTP
                </button>
              </div>
              <div className="otp-actions">
                <button type="button" className="verify-btn">
                  Verify Identity
                </button>
              </div>
            </div>

            <button type="submit" className="signup-btn">
              Create Account
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
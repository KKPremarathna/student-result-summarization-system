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

      <div className="signup-main">
        <div className="signup-left">
          <img
            src={signupImage}
            alt="Signup illustration"
            className="signup-image"
          />
        </div>

        <div className="signup-right">
          <form className="signup-form">
            <input type="text" placeholder="First name" />
            <input type="text" placeholder="Last name" />
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Birth date" />
            <input type="text" placeholder="Phone number" />

            <div className="password-wrapper">
              <input type="password" placeholder="Password" />
              <span className="eye-icon">👁</span>
            </div>

            <div className="password-wrapper">
              <input type="password" placeholder="Confirm password" />
              <span className="eye-icon">👁</span>
            </div>

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
                send OTP
              </button>
            </div>

            <button type="button" className="verify-btn">
              Verify
            </button>

            <button type="submit" className="signup-btn">
              SignUp
            </button>

            <p className="signin-text">
              Already have an Account ? 
              <Link to="/signin">
                <span>Sign In</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
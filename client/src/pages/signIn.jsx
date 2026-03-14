import React, { useState } from "react";
import { Link } from "react-router-dom";
import InnerNavbar from "../components/InnerNavbar";
import signinImage from "../assets/images/signup-image.png";
import "../styles/signIn.css";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="signin-page">
      <InnerNavbar />

      <main className="signin-container">
        <div className="signin-card">
          <div className="signin-header">
            <h1 className="signin-title">Sign In</h1>
            <p className="signin-subtitle">Enter your credentials to continue</p>
          </div>

          <form className="signin-form">
            <div className="form-group">
              <input type="email" placeholder="Email" />
            </div>

            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            <div className="form-footer">
              <Link to="/AdminResetPassword">
                <span className="forgot-password">Forgot Password ?</span>
              </Link>
            </div>

            <button type="submit" className="signin-btn">
              Sign In
            </button>

            <p className="signup-text">
              Don't have an Account ?{" "}
              <Link to="/SignUp" className="signup-link">
                Create One
              </Link>
            </p>
          </form>
        </div>
      </main>

    </div>
  );
}

export default Signin;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InnerNavbar from "../components/InnerNavbar";
import axios from "axios";
import "../styles/signIn.css";

function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        // Store session info
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setMessage({ type: "success", text: "Login successful! Redirecting..." });

        // Role-based redirection
        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/AdminHome");
          } else if (user.role === "lecturer") {
            navigate("/lecturer/home");
          } else if (user.role === "student") {
            navigate("/home");
          } else {
            navigate("/"); // Default fallback
          }
        }, 1500);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <InnerNavbar />

      <main className="signin-container">
        <div className="signin-card">
          <div className="signin-header">
            <h1 className="signin-title">Sign In</h1>
            <p className="signin-subtitle">Enter your credentials to continue</p>
          </div>

          {message.text && (
            <div className={`message-alert ${message.type}`}>
              {message.text}
            </div>
          )}

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁" : "👁"}
                </span>
              </div>
            </div>

            <div className="form-footer">
              <Link to="#">
                <span className="forgot-password">Forgot Password ?</span>
              </Link>
            </div>

            <button type="submit" className="signin-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
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
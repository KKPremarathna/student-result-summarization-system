import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendResetOtp, verifyResetOtp, resetPassword as resetPasswordApi } from "../services/authaService";
import InnerNavbar from "../components/InnerNavbar";
import { Mail, ShieldCheck, Lock, ChevronRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

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

  const handleRequestOTP = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await sendResetOtp(email);
      setStatus({ type: "success", message: "Verification OTP sent to your email!" });
      setStep(2);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Failed to send OTP." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setStatus({ type: "error", message: "Please enter the 6-digit code." });
      return;
    }

    setLoading(true);
    try {
      await verifyResetOtp(email, otpString);
      setStatus({ type: "success", message: "Email verified! You can now reset your password." });
      setStep(3);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Invalid or expired OTP." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: "error", message: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);
    try {
      await resetPasswordApi(email, newPassword);
      setStatus({ type: "success", message: "Password reset successful! Redirecting to sign in..." });
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Reset failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page winter-theme">
      <InnerNavbar />
      
      <main className="fp-container">
        <div className="fp-card">
          <Link to="/signin" className="fp-back-link">
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>

          <header className="fp-header">
            <div className="fp-icon-container">
              {step === 1 && <Mail size={32} />}
              {step === 2 && <ShieldCheck size={32} />}
              {step === 3 && <Lock size={32} />}
            </div>
            <h1 className="fp-title">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verification OTP"}
              {step === 3 && "New Password"}
            </h1>
            <p className="fp-subtitle">
              {step === 1 && "Enter your email address to receive a verification code."}
              {step === 2 && `We've sent a 6-digit code to ${email}`}
              {step === 3 && "Secure your account with a strong new password."}
            </p>
          </header>

          <div className="fp-stepper">
            <div className={`fp-step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`fp-step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`fp-step ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`fp-step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`fp-step ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>

          {status.message && (
            <div className={`fp-status-message ${status.type}`}>
              {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{status.message}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="fp-form">
              <div className="fp-input-group">
                <label>Email Address</label>
                <div className="fp-input-wrapper">
                  <Mail className="fp-input-icon" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@university.ac.lk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="fp-btn" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Code"}
                {!loading && <ChevronRight size={18} />}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="fp-form">
              <div className="fp-input-group">
                <label>6-Digit Code</label>
                <div className="fp-otp-boxes">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      autoComplete="off"
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="fp-otp-input"
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className="fp-btn" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Code"}
                {!loading && <ChevronRight size={18} />}
              </button>
              <p className="fp-resend">
                Didn't receive the code? <button type="button" onClick={() => handleRequestOTP()} disabled={loading}>Resend OTP</button>
              </p>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="fp-form">
              <div className="fp-input-group">
                <label>New Password</label>
                <div className="fp-input-wrapper">
                  <Lock className="fp-input-icon" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="fp-input-group">
                <label>Confirm Password</label>
                <div className="fp-input-wrapper">
                  <Lock className="fp-input-icon" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="fp-btn" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
                {!loading && <CheckCircle2 size={18} />}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;

import { useState } from "react";
//import { requestOtp, signupUser } from "../services/authService";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    otp: "",
  });

  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async () => {
    try {
      setError("");
      setMessage("");

      const res = await requestOtp(formData.email);
      setMessage(res.data.message);
      setOtpRequested(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request OTP");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const res = await signupUser(formData);
      setMessage("Signup successful!");
      console.log(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "30px auto" }}>
      <h2>Signup</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          type="email"
          name="email"
          placeholder="Enter allowed email"
          value={formData.email}
          onChange={handleChange}
        />
        <button onClick={handleRequestOtp}>Request OTP</button>
      </div>

      {otpRequested && (
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <br />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <br />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <br />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          <br />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <br />

          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
          />
          <br />

          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  );
}

export default Signup;
import axios from "axios";

// Handle both Vite (import.meta.env) and CRA (process.env) environments
const getBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return "http://localhost:5000"; // Default fallback
};

const API_BASE_URL = `${getBaseUrl()}/api/auth`;
export const requestOtp = async (email) => {
  return await axios.post(`${API_BASE_URL}/request-otp`, { email });
};

export const signupUser = async (userData) => {
  return await axios.post(`${API_BASE_URL}/signup`, userData);
};
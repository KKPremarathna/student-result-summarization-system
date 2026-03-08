import axios from "axios";

const API_BASE_URL = `${import.meta.env.API_URL}/api/auth`;
export const requestOtp = async (email) => {
  return await axios.post(`${API_BASE_URL}/request-otp`, { email });
};

export const signupUser = async (userData) => {
  return await axios.post(`${API_BASE_URL}/signup`, userData);
};
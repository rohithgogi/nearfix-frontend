import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  // Send OTP
  sendOtp: (phoneNumber) => {
    return api.post(`/auth/otp/send?phoneNumber=${phoneNumber}`);
  },

  // Verify OTP
  verifyOtp: (phoneNumber, otpCode) => {
    return api.post(`/auth/otp/verify?phoneNumber=${phoneNumber}&otpCode=${otpCode}`);
  },

  // Register with role
  registerWithRole: (phoneNumber, role) => {
    return api.post(`/auth/otp/register-with-role?phoneNumber=${phoneNumber}&role=${role}`);
  },
};

// Helper functions
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const getUserData = () => {
  const phoneNumber = localStorage.getItem('phoneNumber');
  const role = localStorage.getItem('role');
  return { phoneNumber, role };
};

export const setUserData = (phoneNumber, role) => {
  localStorage.setItem('phoneNumber', phoneNumber);
  localStorage.setItem('role', role);
};

export const clearUserData = () => {
  localStorage.removeItem('phoneNumber');
  localStorage.removeItem('role');
  removeAuthToken();
};

export default api;
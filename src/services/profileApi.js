import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create axios instance
const profileApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
profileApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Profile API calls
export const providerProfileAPI = {
  // Get profile
  getProfile: () => {
    return profileApi.get('/api/provider/profile');
  },

  // Update profile
  updateProfile: (data) => {
    return profileApi.put('/api/provider/profile', data);
  },

  // Upload photo
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return profileApi.post('/api/provider/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload document
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return profileApi.post('/api/provider/profile/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete photo
  deletePhoto: () => {
    return profileApi.delete('/api/provider/profile/photo');
  },
};

// Helper to get file URL
export const getFileUrl = (relativePath) => {
  if (!relativePath) return null;
  return `${API_BASE_URL}/api/files${relativePath}`;
};

export default profileApi;
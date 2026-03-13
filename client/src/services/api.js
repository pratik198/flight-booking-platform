import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'https://flight-booking-platform-z5s2.onrender.com/api';

// Ensure the API base URL always includes `/api` so deployed builds don't accidentally hit the wrong path
const API_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl.replace(/\/+$/, '')
  : rawApiUrl.replace(/\/+$/, '') + '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
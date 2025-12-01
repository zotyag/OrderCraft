import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  // baseURL: 'http://localhost:8080/api',  <-- EZT TÖRÖLD VAGY KOMMENTELD KI
  baseURL: '/api', // <-- CSAK ENNYI KELL (a proxy elintézi a többit)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (e.g., 401)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if token is expired/invalid
      // We'll handle this more gracefully in AuthContext, but this is a fallback
      // localStorage.removeItem('token');
      // window.location.href = '/login';
      // Careful with direct window location changes in SPA
    }
    return Promise.reject(error);
  }
);

export default api;

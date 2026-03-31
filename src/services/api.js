import axios from 'axios';

/**
 * Centralized Axios instance for Spring Boot backend.
 * - baseURL: /api (proxied by Vite in dev to http://localhost:8080)
 * - Automatically attaches JWT from localStorage
 * - Handles 401 globally by clearing token + redirecting to /login
 */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/* ─── Request interceptor: attach JWT ─────────────────────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ─── Response interceptor: global error handler ──────────────── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      // Only redirect if not already on /login or /signup
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        window.location.href = '/login';
      }
    }

    // Construct a human-readable error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';

    // Attach a friendlier message to the error object
    error.friendlyMessage = message;

    return Promise.reject(error);
  },
);

export default api;

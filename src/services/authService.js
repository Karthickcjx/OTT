import api from './api';

/**
 * Auth service — communicates with Spring Boot /auth endpoints.
 */

/**
 * POST /auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {{ token: string, user: { id, name, email, role } }}
 */
export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

/**
 * POST /auth/register
 * @param {{ name: string, email: string, password: string }} payload
 * @returns {{ token: string, user: { id, name, email, role } }}
 */
export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

/**
 * GET /auth/me — validate current token and get fresh user data
 * @returns {{ id, name, email, role }}
 */
export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

/**
 * Persist auth state to localStorage
 */
export const persistAuth = (token, user) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
};

/**
 * Clear auth state from localStorage
 */
export const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

/**
 * Load persisted auth state (used on app boot)
 */
export const loadPersistedAuth = () => {
  const token = localStorage.getItem('auth_token');
  const raw = localStorage.getItem('auth_user');

  if (!token || !raw) return null;

  try {
    return { token, user: JSON.parse(raw) };
  } catch {
    clearAuth();
    return null;
  }
};

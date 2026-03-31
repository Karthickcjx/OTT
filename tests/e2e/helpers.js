/**
 * Shared Playwright helpers — login via API, inject token into localStorage.
 */

import { BASE_URL, ADMIN_CREDS, USER_CREDS } from '../config.js';

/**
 * Inject a JWT + user object into localStorage so the React app
 * treats the browser session as authenticated — no UI form required.
 *
 * Accepts either:
 *   { token, user }          — nested shape (future-proof)
 *   { token, id, email, name, role } — flat AuthResponse shape from backend
 */
export async function injectAuth(page, authData) {
  const token = authData.token;
  // Normalise flat response → user object that AppContext expects
  const user = authData.user ?? {
    id: authData.id,
    name: authData.name,
    email: authData.email,
    role: authData.role,
  };

  await page.addInitScript(
    ({ token, user }) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    },
    { token, user },
  );
}

/**
 * Obtain a JWT token via the REST API (bypasses the UI login form).
 * Fast: used in beforeAll hooks to pre-authenticate.
 */
export async function apiLogin(credentials) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) throw new Error(`apiLogin failed: HTTP ${res.status}`);
  return res.json(); // { token, user }
}

/**
 * Register a new user via the REST API.
 */
export async function apiRegister(payload) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`apiRegister failed: HTTP ${res.status}`);
  return res.json();
}

/**
 * Clear all auth from localStorage (simulate logout).
 */
export async function clearAuth(page) {
  await page.evaluate(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  });
}

export { ADMIN_CREDS, USER_CREDS };

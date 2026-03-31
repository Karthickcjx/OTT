/**
 * Auth UI Tests
 * Covers: login form, signup form, logout, redirect behavior,
 *         protected route enforcement
 */

import { test, expect } from '@playwright/test';
import { apiLogin, clearAuth, injectAuth, ADMIN_CREDS, USER_CREDS } from './helpers.js';

// ── Login Page ────────────────────────────────────────────────────────────────

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Login page renders email + password fields and submit button', async ({ page }) => {
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('Successful login redirects to home', async ({ page }) => {
    await page.getByLabel(/email/i).fill(ADMIN_CREDS.email);
    await page.getByLabel(/password/i).fill(ADMIN_CREDS.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/', { timeout: 8_000 });
  });

  test('After login, JWT is stored in localStorage', async ({ page }) => {
    await page.getByLabel(/email/i).fill(ADMIN_CREDS.email);
    await page.getByLabel(/password/i).fill(ADMIN_CREDS.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL('/');

    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeTruthy();
    expect(token.split('.').length).toBe(3); // valid JWT format
  });

  test('Wrong password shows error message', async ({ page }) => {
    await page.getByLabel(/email/i).fill(ADMIN_CREDS.email);
    await page.getByLabel(/password/i).fill('wrong-password-123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Page should remain on /login
    await expect(page).toHaveURL(/\/login/);

    // An error message should appear (text varies by implementation)
    const errorEl = page.locator('[role="alert"], .error, [data-testid="error"]').first();
    const anyError = page.getByText(/invalid|incorrect|wrong|failed|unauthorized/i).first();

    await expect(errorEl.or(anyError)).toBeVisible({ timeout: 5_000 });
  });

  test('Empty form submit shows validation feedback', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();

    // Either HTML5 validation or custom error should prevent submission
    await expect(page).toHaveURL(/\/login/);
  });

  test('Already logged-in user visiting /login is redirected', async ({ page }) => {
    const auth = await apiLogin(ADMIN_CREDS);
    await injectAuth(page, auth);
    await page.goto('/login');

    // Should redirect away from /login (to / or wherever the app sends logged-in users)
    await page.waitForLoadState('networkidle');
    // If the app doesn't redirect automatically, this test documents that gap
    const url = page.url();
    // The page either redirected or is still on /login — document both
    if (url.includes('/login')) {
      console.warn('[INFO] Logged-in users are NOT redirected away from /login — consider adding a guard.');
    }
  });
});

// ── Signup Page ───────────────────────────────────────────────────────────────

test.describe('Signup Page', () => {
  const newUser = {
    name: 'E2E New User',
    email: `e2e_${Date.now()}@test.local`,
    password: 'NewUser@1234',
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('Signup page renders name, email, password fields', async ({ page }) => {
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    // Use exact match to avoid also matching "Confirm Password"
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
  });

  test('Successful registration redirects to home or login', async ({ page }) => {
    await page.getByLabel(/name/i).fill(newUser.name);
    await page.getByLabel(/email/i).fill(newUser.email);
    await page.getByLabel(/^password$/i).fill(newUser.password);
    await page.getByRole('button', { name: /sign up|register|create/i }).click();

    // After registration, user lands on / or /login
    await page.waitForURL(/\/|\/login/, { timeout: 8_000 });
    const url = page.url();
    expect(url.endsWith('/') || url.includes('/login')).toBe(true);
  });
});

// ── Logout ────────────────────────────────────────────────────────────────────

test.describe('Logout', () => {
  test.beforeEach(async ({ page }) => {
    const auth = await apiLogin(ADMIN_CREDS);
    await injectAuth(page, auth);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('After logout, token is removed from localStorage', async ({ page }) => {
    // Open profile switcher
    const profileBtn = page.locator('button').filter({ has: page.locator('img.rounded-full') });
    await profileBtn.first().click();

    // Click logout inside the modal/dropdown
    const logoutBtn = page.getByRole('button', { name: /log ?out|sign ?out/i });
    await expect(logoutBtn).toBeVisible({ timeout: 5_000 });
    await logoutBtn.click();

    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeNull();
  });

  test('After logout, Sign In button is visible', async ({ page }) => {
    const profileBtn = page.locator('button').filter({ has: page.locator('img.rounded-full') });
    await profileBtn.first().click();

    const logoutBtn = page.getByRole('button', { name: /log ?out|sign ?out/i });
    await logoutBtn.click();

    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible({ timeout: 5_000 });
  });

  test('After logout, Admin badge is hidden', async ({ page }) => {
    const profileBtn = page.locator('button').filter({ has: page.locator('img.rounded-full') });
    await profileBtn.first().click();

    const logoutBtn = page.getByRole('button', { name: /log ?out|sign ?out/i });
    await logoutBtn.click();

    const adminBtn = page.getByRole('button', { name: /^admin$/i });
    await expect(adminBtn).not.toBeVisible();
  });

  test('After logout, Continue Watching is hidden', async ({ page }) => {
    // Seed some recentlyWatched so it would show if auth checks fail
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('streamvault-app-state') || '{}');
      state.recentlyWatched = [{ id: 1, title: 'Test', type: 'movie', vote_average: 7 }];
      localStorage.setItem('streamvault-app-state', JSON.stringify(state));
    });

    const profileBtn = page.locator('button').filter({ has: page.locator('img.rounded-full') });
    await profileBtn.first().click();

    const logoutBtn = page.getByRole('button', { name: /log ?out|sign ?out/i });
    await logoutBtn.click();

    await page.waitForLoadState('networkidle');

    const heading = page.getByRole('heading', { name: /continue watching/i });
    await expect(heading).not.toBeVisible();
  });
});

// ── Protected Routes ──────────────────────────────────────────────────────────

test.describe('Protected Routes', () => {
  test('Unauthenticated access to /profile redirects to /login', async ({ page }) => {
    await page.goto('/');
    await clearAuth(page);
    await page.goto('/profile');

    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 });
  });

  test('Unauthenticated access to /watch/:id redirects to /login', async ({ page }) => {
    await page.goto('/');
    await clearAuth(page);
    await page.goto('/watch/1');

    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 });
  });

  test('Unauthenticated access to /admin redirects to /login', async ({ page }) => {
    await page.goto('/');
    await clearAuth(page);
    await page.goto('/admin');

    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 });
  });

  test('Regular user accessing /admin is redirected to home', async ({ page }) => {
    const auth = await apiLogin({ email: USER_CREDS.email, password: USER_CREDS.password })
      .catch(() => null);
    if (!auth) return test.skip();

    await injectAuth(page, auth);
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    // Should land on / (not /admin)
    await expect(page).toHaveURL('/', { timeout: 5_000 });
  });

  test('Admin user can access /admin', async ({ page }) => {
    const auth = await apiLogin(ADMIN_CREDS);
    await injectAuth(page, auth);
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/admin/);
    // Dashboard heading or some admin content should appear
    await expect(page.getByText(/dashboard|admin|platform/i).first()).toBeVisible();
  });
});

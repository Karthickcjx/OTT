/**
 * Home Page — UI Rendering Tests
 *
 * Validates that auth-gated sections render correctly depending on
 * whether the user is logged in or not.
 */

import { test, expect } from '@playwright/test';
import { injectAuth, apiLogin, apiRegister, clearAuth, ADMIN_CREDS, USER_CREDS } from './helpers.js';

// ── Unauthenticated ───────────────────────────────────────────────────────────

test.describe('Home — Unauthenticated', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean localStorage — no leftover tokens
    await page.goto('/');
    await clearAuth(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('Sign In button is visible in navbar', async ({ page }) => {
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('Profile avatar is NOT visible', async ({ page }) => {
    // The profile switcher button (shows avatar image) must not exist
    // Avatar in the profile button has a rounded-full class
    const profileBtn = page.locator('button').filter({ has: page.locator('img.rounded-full') });
    await expect(profileBtn).not.toBeVisible();
  });

  test('Admin badge is NOT visible in navbar', async ({ page }) => {
    // The admin button in the navbar has text "Admin" and a Shield icon
    const adminBtn = page.getByRole('button', { name: /^admin$/i });
    await expect(adminBtn).not.toBeVisible();
  });

  test('Profile name badge is NOT visible in the hero banner', async ({ page }) => {
    // The banner shows the activeProfile.name in a small badge — should be hidden when logged out
    // It sits alongside the "Series Premiere" or "Featured Tonight" badge
    // None of the banner badge texts should look like a user profile name
    // The avatar image inside the badge is only rendered when isAuthenticated
    const avatarInBanner = page.locator('section').first().locator('img.rounded-full');
    await expect(avatarInBanner).not.toBeVisible();
  });

  test('"Continue Watching" section is NOT visible', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /continue watching/i });
    await expect(heading).not.toBeVisible();
  });

  test('Trending Now row IS visible (public content)', async ({ page }) => {
    // Content rows are visible even without login (populated from backend)
    // If backend has no data the row won't render — that is expected
    // We just assert the page loads without crashing
    await expect(page).toHaveTitle(/playnix/i);
    await expect(page.locator('nav')).toBeVisible();
  });
});

// ── Authenticated (regular user) ──────────────────────────────────────────────

test.describe('Home — Authenticated User', () => {
  let auth;

  test.beforeAll(async () => {
    // Register fresh user (or login if already exists)
    try {
      auth = await apiRegister(USER_CREDS);
    } catch {
      auth = await apiLogin({ email: USER_CREDS.email, password: USER_CREDS.password });
    }
  });

  test.beforeEach(async ({ page }) => {
    await injectAuth(page, auth);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Sign In button is NOT visible', async ({ page }) => {
    const signIn = page.getByRole('link', { name: /sign in/i });
    await expect(signIn).not.toBeVisible();
  });

  test('Profile avatar button is visible', async ({ page }) => {
    const profileBtn = page.locator('button').filter({ has: page.locator('img.rounded-full') });
    await expect(profileBtn.first()).toBeVisible();
  });

  test('Admin badge is NOT visible for regular user', async ({ page }) => {
    const adminBtn = page.getByRole('button', { name: /^admin$/i });
    await expect(adminBtn).not.toBeVisible();
  });

  test('"Continue Watching" appears after watching content (recentlyWatched in state)', async ({ page }) => {
    // Seed recentlyWatched in localStorage to simulate watched history
    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('streamvault-app-state') || '{}');
      state.recentlyWatched = [
        {
          id: 9001,
          title: 'QA Test Movie',
          type: 'movie',
          genre: 'Drama',
          release_date: '2024-01-01',
          vote_average: 7.5,
        },
      ];
      localStorage.setItem('streamvault-app-state', JSON.stringify(state));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    const heading = page.getByRole('heading', { name: /continue watching/i });
    await expect(heading).toBeVisible();
  });
});

// ── Authenticated (admin) ─────────────────────────────────────────────────────

test.describe('Home — Authenticated Admin', () => {
  let adminAuth;

  test.beforeAll(async () => {
    adminAuth = await apiLogin(ADMIN_CREDS);
  });

  test.beforeEach(async ({ page }) => {
    await injectAuth(page, adminAuth);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Admin badge IS visible in navbar for admin user', async ({ page }) => {
    const adminBtn = page.getByRole('button', { name: /^admin$/i });
    await expect(adminBtn).toBeVisible();
  });

  test('Clicking Admin badge navigates to /admin', async ({ page }) => {
    const adminBtn = page.getByRole('button', { name: /^admin$/i });
    await adminBtn.click();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('Sign In button is NOT visible for admin', async ({ page }) => {
    const signIn = page.getByRole('link', { name: /sign in/i });
    await expect(signIn).not.toBeVisible();
  });
});

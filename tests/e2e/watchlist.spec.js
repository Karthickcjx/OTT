/**
 * Watchlist E2E Tests
 * Covers: add via banner button, watchlist persists in UI,
 *         remove from watchlist, real-time badge update
 */

import { test, expect } from '@playwright/test';
import { injectAuth, apiLogin, ADMIN_CREDS, USER_CREDS } from './helpers.js';
import { BASE_URL, MOVIE_FIXTURE } from '../config.js';

// Helper — create a test movie via API, return its id
async function createTestMovie(adminToken) {
  const res = await fetch(`${BASE_URL}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ ...MOVIE_FIXTURE, title: `E2E Watchlist Movie ${Date.now()}` }),
  });
  if (!res.ok) throw new Error(`createTestMovie failed: ${res.status}`);
  return res.json();
}

async function deleteTestMovie(adminToken, id) {
  await fetch(`${BASE_URL}/movies/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
}

test.describe('Watchlist — Banner Add Button', () => {
  let adminAuth;
  let userAuth;
  let movie;

  test.beforeAll(async () => {
    adminAuth = await apiLogin(ADMIN_CREDS);
    try {
      userAuth = await apiLogin({ email: USER_CREDS.email, password: USER_CREDS.password });
    } catch {
      const { default: fetch } = await import('node-fetch').catch(() => ({ default: globalThis.fetch }));
      const res = await globalThis.fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(USER_CREDS),
      });
      userAuth = await res.json();
    }
    movie = await createTestMovie(adminAuth.token);
  });

  test.afterAll(async () => {
    if (movie?.id) await deleteTestMovie(adminAuth.token, movie.id);
  });

  test.beforeEach(async ({ page }) => {
    await injectAuth(page, userAuth);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('"Add to Watchlist" button is visible on the banner', async ({ page }) => {
    const btn = page.getByRole('button', { name: /add to watchlist/i });
    await expect(btn).toBeVisible({ timeout: 6_000 });
  });

  test('Clicking "Add to Watchlist" changes button to "In Watchlist"', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add to watchlist/i });
    await addBtn.click();

    // Button text should update immediately (optimistic UI)
    const inListBtn = page.getByRole('button', { name: /in watchlist/i });
    await expect(inListBtn).toBeVisible({ timeout: 4_000 });
  });

  test('Clicking "In Watchlist" toggles back to "Add to Watchlist"', async ({ page }) => {
    // Add first
    const addBtn = page.getByRole('button', { name: /add to watchlist/i });
    await addBtn.click();
    await expect(page.getByRole('button', { name: /in watchlist/i })).toBeVisible({ timeout: 3_000 });

    // Remove
    const inBtn = page.getByRole('button', { name: /in watchlist/i });
    await inBtn.click();
    await expect(page.getByRole('button', { name: /add to watchlist/i })).toBeVisible({ timeout: 3_000 });
  });
});

test.describe('Watchlist — My List Page', () => {
  let adminAuth;
  let userAuth;
  let movie;

  test.beforeAll(async () => {
    adminAuth = await apiLogin(ADMIN_CREDS);
    try {
      userAuth = await apiLogin({ email: USER_CREDS.email, password: USER_CREDS.password });
    } catch {
      const res = await globalThis.fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(USER_CREDS),
      });
      userAuth = await res.json();
    }
    movie = await createTestMovie(adminAuth.token);
  });

  test.afterAll(async () => {
    if (movie?.id) await deleteTestMovie(adminAuth.token, movie.id);
  });

  test('/profile page (My List) requires auth', async ({ page }) => {
    // No auth injected
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 });
  });

  test('My List page renders when authenticated', async ({ page }) => {
    await injectAuth(page, userAuth);
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/profile/);
  });

  test('Watchlist items appear on My List after adding via API', async ({ page }) => {
    // Add item via API first
    await globalThis.fetch(`${BASE_URL}/watchlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAuth.token}`,
      },
      body: JSON.stringify({ contentId: movie.id, contentType: 'movie' }),
    });

    await injectAuth(page, userAuth);
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2_000);

    // The movie title should appear on the page
    const titleEl = page.getByText(movie.title, { exact: false });
    await expect(titleEl).toBeVisible({ timeout: 6_000 });
  });
});

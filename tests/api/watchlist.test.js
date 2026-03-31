/**
 * Watchlist API Tests
 * Covers: fetch, add, remove, auth enforcement, isolation between users
 */

import { suite, test, assert, request } from '../runner.js';
import { BASE_URL, MOVIE_FIXTURE } from '../config.js';

const MOVIES    = `${BASE_URL}/movies`;
const WATCHLIST = `${BASE_URL}/watchlist`;

export async function runWatchlistTests(tokens) {
  let testMovieId = null;
  let watchlistItemId = null;

  // Create a movie to add to the watchlist (requires admin token)
  await suite('Watchlist — Setup', async () => {
    await test('Create a movie to use in watchlist tests', async () => {
      const { status, data } = await request(MOVIES, {
        method: 'POST',
        token: tokens.admin,
        body: { ...MOVIE_FIXTURE, title: `${MOVIE_FIXTURE.title} [Watchlist]` },
      });

      assert.status(status, 201, data);
      testMovieId = data.id;
    });
  });

  await suite('Watchlist — Authorization', async () => {
    await test('GET /watchlist (no token) → 401', async () => {
      const { status } = await request(WATCHLIST);
      assert.equal(status, 401);
    });

    await test('POST /watchlist (no token) → 401', async () => {
      const { status } = await request(WATCHLIST, {
        method: 'POST',
        body: { contentId: testMovieId, contentType: 'movie' },
      });

      assert.equal(status, 401);
    });
  });

  await suite('Watchlist — Add / Fetch / Remove', async () => {
    await test('GET /watchlist (user) → 200, initially empty or array', async () => {
      const { status, data } = await request(WATCHLIST, { token: tokens.user });
      assert.status(status, 200, data);
      assert.isArray(data);
    });

    await test('POST /watchlist → 201, returns watchlist item', async () => {
      assert.defined(testMovieId, 'testMovieId must be set');

      const { status, data } = await request(WATCHLIST, {
        method: 'POST',
        token: tokens.user,
        body: { contentId: testMovieId, contentType: 'movie' },
      });

      assert.status(status, 201, data);
      assert.hasKeys(data, ['id', 'contentId', 'contentType']);
      assert.equal(data.contentId, testMovieId);
      assert.equal(data.contentType, 'movie');

      watchlistItemId = data.id;
    });

    await test('GET /watchlist → item is present after add', async () => {
      const { status, data } = await request(WATCHLIST, { token: tokens.user });
      assert.status(status, 200, data);
      assert.isArray(data);

      const found = data.some((item) => item.contentId === testMovieId);
      assert.ok(found, `Movie id=${testMovieId} not found in watchlist after add`);
    });

    await test('DELETE /watchlist/:id (wrong user) → 403 or 404', async () => {
      // Admin trying to delete user's watchlist item — should be denied
      const { status } = await request(`${WATCHLIST}/${watchlistItemId}`, {
        method: 'DELETE',
        token: tokens.admin,
      });

      // Backend should enforce ownership; 403 or 404 are both acceptable
      assert.ok(
        status === 403 || status === 404,
        `Expected 403 or 404 for cross-user delete, got ${status}`,
      );
    });

    await test('DELETE /watchlist/:id (owner) → 204', async () => {
      assert.defined(watchlistItemId, 'watchlistItemId must be set');

      const { status } = await request(`${WATCHLIST}/${watchlistItemId}`, {
        method: 'DELETE',
        token: tokens.user,
      });

      assert.equal(status, 204);
    });

    await test('GET /watchlist → item is gone after remove', async () => {
      const { status, data } = await request(WATCHLIST, { token: tokens.user });
      assert.status(status, 200, data);
      assert.isArray(data);

      const found = data.some((item) => item.id === watchlistItemId);
      assert.ok(!found, 'Removed watchlist item should not appear in list');
    });

    await test('DELETE /watchlist/:id (already removed) → 404', async () => {
      const { status } = await request(`${WATCHLIST}/${watchlistItemId}`, {
        method: 'DELETE',
        token: tokens.user,
      });

      assert.equal(status, 404);
    });
  });

  await suite('Watchlist — Isolation', async () => {
    await test("Admin's watchlist does not contain user's items", async () => {
      // Add item as user
      const add = await request(WATCHLIST, {
        method: 'POST',
        token: tokens.user,
        body: { contentId: testMovieId, contentType: 'movie' },
      });
      const addedId = add.data?.contentId;

      // Fetch admin's watchlist
      const { data: adminList } = await request(WATCHLIST, { token: tokens.admin });
      assert.isArray(adminList);

      const leaked = adminList.some((item) => item.contentId === addedId);
      assert.ok(!leaked, "User's watchlist items must not appear in admin's list");
    });
  });

  // ── Cleanup ────────────────────────────────────────────────────
  await suite('Watchlist — Cleanup', async () => {
    await test('Delete the test movie used by watchlist tests', async () => {
      if (!testMovieId) return;
      const { status } = await request(`${MOVIES}/${testMovieId}`, {
        method: 'DELETE',
        token: tokens.admin,
      });

      assert.ok(status === 204 || status === 404, `Cleanup delete returned ${status}`);
    });
  });
}

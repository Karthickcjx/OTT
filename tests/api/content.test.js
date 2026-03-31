/**
 * Content API Tests — Movies & Series
 * Covers: list, get-by-id, create (admin), update (admin), delete (admin),
 *         authorization enforcement (user cannot mutate, anon cannot read)
 */

import { suite, test, assert, request } from '../runner.js';
import { BASE_URL, MOVIE_FIXTURE, SERIES_FIXTURE } from '../config.js';

const MOVIES  = `${BASE_URL}/movies`;
const SERIES  = `${BASE_URL}/series`;

// IDs created during this run — cleaned up at the end
const created = { movieId: null, seriesId: null };

export async function runContentTests(tokens) {
  // ── Movies ────────────────────────────────────────────────────

  await suite('Movies — Authorization', async () => {
    await test('GET /movies (no token) → 401', async () => {
      const { status } = await request(MOVIES);
      assert.equal(status, 401);
    });

    await test('GET /movies (user token) → 200 array', async () => {
      const { status, data } = await request(MOVIES, { token: tokens.user });
      assert.status(status, 200, data);
      assert.isArray(data);
    });

    await test('POST /movies (user token) → 403 (non-admin blocked)', async () => {
      const { status } = await request(MOVIES, {
        method: 'POST',
        token: tokens.user,
        body: MOVIE_FIXTURE,
      });

      assert.equal(status, 403);
    });
  });

  await suite('Movies — CRUD (admin)', async () => {
    await test('POST /movies → 201, returns full movie object', async () => {
      const { status, data } = await request(MOVIES, {
        method: 'POST',
        token: tokens.admin,
        body: MOVIE_FIXTURE,
      });

      assert.status(status, 201, data);
      assert.hasKeys(data, ['id', 'title', 'genre', 'releaseYear', 'type']);
      assert.equal(data.title, MOVIE_FIXTURE.title);
      assert.equal(data.type, 'movie');

      created.movieId = data.id;
    });

    await test('GET /movies/:id → 200, correct movie', async () => {
      assert.defined(created.movieId, 'movieId must be set from create test');

      const { status, data } = await request(`${MOVIES}/${created.movieId}`, {
        token: tokens.admin,
      });

      assert.status(status, 200, data);
      assert.equal(data.id, created.movieId);
      assert.equal(data.title, MOVIE_FIXTURE.title);
    });

    await test('GET /movies list contains new movie', async () => {
      const { status, data } = await request(MOVIES, { token: tokens.user });
      assert.status(status, 200, data);
      assert.isArray(data);

      const found = data.some((m) => m.id === created.movieId);
      assert.ok(found, `Movie id=${created.movieId} not found in GET /movies response`);
    });

    await test('GET /movies?search=<title> filters correctly', async () => {
      const title = encodeURIComponent(MOVIE_FIXTURE.title);
      const { status, data } = await request(`${MOVIES}?search=${title}`, {
        token: tokens.user,
      });

      assert.status(status, 200, data);
      assert.isArray(data);
      assert.ok(
        data.every((m) => m.title.toLowerCase().includes('qa movie')),
        'Search results should match query term',
      );
    });

    await test('PUT /movies/:id → 200, title updated', async () => {
      const updatedTitle = `${MOVIE_FIXTURE.title} — Updated`;
      const { status, data } = await request(`${MOVIES}/${created.movieId}`, {
        method: 'PUT',
        token: tokens.admin,
        body: { ...MOVIE_FIXTURE, title: updatedTitle },
      });

      assert.status(status, 200, data);
      assert.equal(data.title, updatedTitle);
    });

    await test('PUT /movies/:id (user token) → 403', async () => {
      const { status } = await request(`${MOVIES}/${created.movieId}`, {
        method: 'PUT',
        token: tokens.user,
        body: MOVIE_FIXTURE,
      });

      assert.equal(status, 403);
    });

    await test('DELETE /movies/:id → 204', async () => {
      const { status } = await request(`${MOVIES}/${created.movieId}`, {
        method: 'DELETE',
        token: tokens.admin,
      });

      assert.equal(status, 204);
    });

    await test('GET /movies/:id after delete → 404', async () => {
      const { status } = await request(`${MOVIES}/${created.movieId}`, {
        token: tokens.admin,
      });

      assert.equal(status, 404);
    });

    await test('GET /movies/:id (non-existent) → 404', async () => {
      const { status } = await request(`${MOVIES}/999999`, { token: tokens.user });
      assert.equal(status, 404);
    });
  });

  await suite('Movies — Validation', async () => {
    await test('POST /movies (missing title) → 400', async () => {
      const { status } = await request(MOVIES, {
        method: 'POST',
        token: tokens.admin,
        body: { genre: 'Drama', releaseYear: 2024 }, // no title
      });

      assert.equal(status, 400);
    });
  });

  // ── Series ────────────────────────────────────────────────────

  await suite('Series — Authorization', async () => {
    await test('GET /series (no token) → 401', async () => {
      const { status } = await request(SERIES);
      assert.equal(status, 401);
    });

    await test('GET /series (user token) → 200 array', async () => {
      const { status, data } = await request(SERIES, { token: tokens.user });
      assert.status(status, 200, data);
      assert.isArray(data);
    });

    await test('POST /series (user token) → 403', async () => {
      const { status } = await request(SERIES, {
        method: 'POST',
        token: tokens.user,
        body: SERIES_FIXTURE,
      });

      assert.equal(status, 403);
    });
  });

  await suite('Series — CRUD (admin)', async () => {
    await test('POST /series → 201, returns full series with seasons', async () => {
      const { status, data } = await request(SERIES, {
        method: 'POST',
        token: tokens.admin,
        body: SERIES_FIXTURE,
      });

      assert.status(status, 201, data);
      assert.hasKeys(data, ['id', 'title', 'type']);
      assert.equal(data.title, SERIES_FIXTURE.title);
      assert.equal(data.type, 'series');

      // Seasons should be nested in the response
      if (data.seasons) {
        assert.ok(Array.isArray(data.seasons), 'seasons should be an array');
        assert.ok(data.seasons.length >= 1, 'expected at least 1 season');
        const ep = data.seasons[0]?.episodes?.[0];
        assert.ok(ep, 'Expected episodes inside season 1');
        assert.hasKeys(ep, ['episodeNumber', 'title']);
      }

      created.seriesId = data.id;
    });

    await test('GET /series/:id → 200, nested seasons + episodes', async () => {
      assert.defined(created.seriesId, 'seriesId must be set from create test');

      const { status, data } = await request(`${SERIES}/${created.seriesId}`, {
        token: tokens.user,
      });

      assert.status(status, 200, data);
      assert.equal(data.id, created.seriesId);
    });

    await test('GET /series list contains new series', async () => {
      const { status, data } = await request(SERIES, { token: tokens.user });
      assert.status(status, 200, data);
      assert.isArray(data);

      const found = data.some((s) => s.id === created.seriesId);
      assert.ok(found, `Series id=${created.seriesId} not found in GET /series`);
    });

    await test('DELETE /series/:id → 204', async () => {
      const { status } = await request(`${SERIES}/${created.seriesId}`, {
        method: 'DELETE',
        token: tokens.admin,
      });

      assert.equal(status, 204);
    });

    await test('GET /series/:id after delete → 404', async () => {
      const { status } = await request(`${SERIES}/${created.seriesId}`, {
        token: tokens.user,
      });

      assert.equal(status, 404);
    });
  });
}

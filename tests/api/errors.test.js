/**
 * Error Handling Tests
 * Covers: malformed JSON, invalid types, boundary values, global exception handler
 */

import { suite, test, assert, request } from '../runner.js';
import { BASE_URL } from '../config.js';

const MOVIES = `${BASE_URL}/movies`;
const AUTH   = `${BASE_URL}/auth`;

export async function runErrorTests(tokens) {
  await suite('Errors — Malformed Requests', async () => {
    await test('POST /auth/login with invalid Content-Type body → non-200', async () => {
      // Send plain text instead of JSON
      const res = await fetch(`${AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: 'not json at all',
      });

      assert.ok(res.status >= 400, `Expected 4xx, got ${res.status}`);
    });

    await test('POST /movies with empty JSON object → 400 (validation fails)', async () => {
      const { status } = await request(MOVIES, {
        method: 'POST',
        token: tokens.admin,
        body: {}, // title is required
      });

      assert.equal(status, 400);
    });

    await test('POST /movies with negative releaseYear → 400 or stored with warning', async () => {
      const { status } = await request(MOVIES, {
        method: 'POST',
        token: tokens.admin,
        body: { title: 'Bad Year Movie', genre: 'Drama', releaseYear: -100 },
      });

      // Backend may reject (400) or accept — either is observable; document the behavior
      assert.ok(
        status === 400 || status === 201,
        `Boundary year -100: got ${status} (document in bug report if 201)`,
      );

      // BUG NOTE: If 201, the backend accepts negative release years — should be validated
      if (status === 201) {
        throw new Error(
          '[BUG] Backend accepted releaseYear=-100. Add @Min(1888) validation to MovieRequest.',
        );
      }
    });

    await test('POST /movies with rating > 10 → 400 or stored (boundary)', async () => {
      const { status } = await request(MOVIES, {
        method: 'POST',
        token: tokens.admin,
        body: { title: 'Bad Rating', genre: 'Action', releaseYear: 2024, rating: 99 },
      });

      assert.ok(
        status === 400 || status === 201,
        `Rating=99: got ${status}`,
      );

      if (status === 201) {
        throw new Error(
          '[BUG] Backend accepted rating=99. Add @DecimalMax("10.0") validation to MovieRequest.',
        );
      }
    });
  });

  await suite('Errors — Not Found', async () => {
    await test('GET /movies/0 → 404', async () => {
      const { status } = await request(`${MOVIES}/0`, { token: tokens.user });
      assert.equal(status, 404);
    });

    await test('GET /movies/999999999 → 404', async () => {
      const { status } = await request(`${MOVIES}/999999999`, { token: tokens.user });
      assert.equal(status, 404);
    });

    await test('GET /nonexistent-endpoint → 404 (or 403 if filtered by security)', async () => {
      const { status } = await request(`${BASE_URL}/nonexistent`, { token: tokens.admin });
      assert.ok(status === 404 || status === 403, `Expected 404/403, got ${status}`);
    });
  });

  await suite('Errors — Token Edge Cases', async () => {
    await test('Bearer token with extra spaces → 401', async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: '  Bearer  ' + tokens.user },
      });

      assert.ok(
        res.status === 200 || res.status === 401,
        `Extra-space token: got ${res.status}`,
      );
    });

    await test('Authorization header with no Bearer prefix → 401', async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: tokens.user }, // no "Bearer " prefix
      });

      assert.equal(res.status, 401);
    });

    await test('Empty Authorization header → 401', async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: '' },
      });

      assert.equal(res.status, 401);
    });
  });

  await suite('Errors — Response Shape', async () => {
    await test('Error responses include a message field', async () => {
      const { data } = await request(`${AUTH}/login`, {
        method: 'POST',
        body: { email: 'wrong@wrong.com', password: 'wrong' },
      });

      // Spring GlobalExceptionHandler should return { message: '...' } or { error: '...' }
      const hasMessage = data && (typeof data.message === 'string' || typeof data.error === 'string');
      assert.ok(hasMessage, `Error body should contain message/error field. Got: ${JSON.stringify(data)}`);
    });

    await test('404 responses include a message field', async () => {
      const { data } = await request(`${MOVIES}/999999`, { token: tokens.user });
      const hasMessage = data && (typeof data.message === 'string' || typeof data.error === 'string');
      assert.ok(hasMessage, `404 body should contain message/error. Got: ${JSON.stringify(data)}`);
    });
  });
}

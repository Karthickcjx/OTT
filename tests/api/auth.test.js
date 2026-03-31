/**
 * Auth API Tests
 * Covers: register, login, /auth/me, invalid credentials, missing token
 *
 * Actual AuthResponse shape (flat — no user wrapper):
 *   { id, token, email, name, role }
 */

import { suite, test, assert, request } from '../runner.js';
import { BASE_URL, ADMIN_CREDS, USER_CREDS } from '../config.js';

const AUTH = `${BASE_URL}/auth`;

// Shared token state — populated by login tests, consumed by all other suites
export const tokens = {};

export async function runAuthTests() {
  await suite('Auth — Registration', async () => {
    await test('POST /auth/register → 201 with flat { id, token, email, name, role }', async () => {
      const { status, data } = await request(`${AUTH}/register`, {
        method: 'POST',
        body: USER_CREDS,
      });

      assert.status(status, 201, data);
      assert.hasKeys(data, ['token', 'email', 'name', 'role']);
      assert.ok(data.token, 'token must be a non-empty string');
      assert.equal(data.email, USER_CREDS.email);
      assert.equal(data.name, USER_CREDS.name);
      assert.equal(data.role, 'USER');
      assert.defined(data.id, 'id field must be present in AuthResponse');

      tokens.user = data.token;
    });

    await test('POST /auth/register → 400/409 for duplicate email', async () => {
      const { status } = await request(`${AUTH}/register`, {
        method: 'POST',
        body: USER_CREDS,
      });

      assert.ok(status === 400 || status === 409, `Expected 400 or 409, got ${status}`);
    });

    await test('POST /auth/register → 400 for missing required fields', async () => {
      const { status } = await request(`${AUTH}/register`, {
        method: 'POST',
        body: { email: 'incomplete@test.local' },
      });

      assert.equal(status, 400);
    });
  });

  await suite('Auth — Login', async () => {
    await test('POST /auth/login (admin) → 200 with ADMIN role', async () => {
      const { status, data } = await request(`${AUTH}/login`, {
        method: 'POST',
        body: ADMIN_CREDS,
      });

      assert.status(status, 200, data);
      assert.hasKeys(data, ['token', 'email', 'name', 'role']);
      assert.ok(data.token, 'token must be present');
      assert.equal(data.role, 'ADMIN');
      assert.equal(data.email, ADMIN_CREDS.email);
      assert.defined(data.id, 'id field must be present');

      tokens.admin = data.token;
    });

    await test('POST /auth/login (regular user) → 200 with USER role', async () => {
      const { status, data } = await request(`${AUTH}/login`, {
        method: 'POST',
        body: { email: USER_CREDS.email, password: USER_CREDS.password },
      });

      assert.status(status, 200, data);
      assert.equal(data.role, 'USER');

      // Refresh user token from login (same user, fresh token)
      tokens.user = data.token;
    });

    await test('POST /auth/login (wrong password) → 401', async () => {
      const { status } = await request(`${AUTH}/login`, {
        method: 'POST',
        body: { email: ADMIN_CREDS.email, password: 'wrong-password' },
      });

      assert.equal(status, 401);
    });

    await test('POST /auth/login (unknown email) → 401', async () => {
      const { status } = await request(`${AUTH}/login`, {
        method: 'POST',
        body: { email: 'nobody@nowhere.com', password: 'irrelevant' },
      });

      assert.equal(status, 401);
    });

    await test('POST /auth/login (empty body) → 400', async () => {
      const { status } = await request(`${AUTH}/login`, {
        method: 'POST',
        body: {},
      });

      assert.equal(status, 400);
    });
  });

  await suite('Auth — Token Validation (/auth/me)', async () => {
    await test('GET /auth/me (valid user token) → 200 with user object', async () => {
      const { status, data } = await request(`${AUTH}/me`, {
        token: tokens.user,
      });

      assert.status(status, 200, data);
      assert.hasKeys(data, ['id', 'email', 'name', 'role']);
      assert.equal(data.email, USER_CREDS.email);
      assert.equal(data.role, 'USER');
    });

    await test('GET /auth/me (valid admin token) → 200 with ADMIN role', async () => {
      const { status, data } = await request(`${AUTH}/me`, {
        token: tokens.admin,
      });

      assert.status(status, 200, data);
      assert.equal(data.role, 'ADMIN');
    });

    await test('GET /auth/me (no token) → 401', async () => {
      const { status } = await request(`${AUTH}/me`);
      assert.equal(status, 401);
    });

    await test('GET /auth/me (malformed token) → 401', async () => {
      const { status } = await request(`${AUTH}/me`, {
        token: 'this.is.not.a.real.jwt',
      });

      assert.equal(status, 401);
    });

    await test('GET /auth/me (tampered signature) → 401', async () => {
      assert.ok(tokens.user, 'user token must be set from login test');
      const parts = tokens.user.split('.');
      const tampered = `${parts[0]}.${parts[1]}.INVALIDSIGNATURE`;

      const { status } = await request(`${AUTH}/me`, { token: tampered });
      assert.equal(status, 401);
    });
  });
}

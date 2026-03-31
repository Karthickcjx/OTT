/**
 * Admin API Tests
 * Covers: dashboard stats, user management, S3 presigned URL,
 *         role-based access enforcement
 */

import { suite, test, assert, request } from '../runner.js';
import { BASE_URL } from '../config.js';

const STATS      = `${BASE_URL}/admin/stats`;
const USERS      = `${BASE_URL}/admin/users`;
const UPLOAD_URL = `${BASE_URL}/upload-url`;

export async function runAdminTests(tokens) {
  await suite('Admin — Dashboard Stats', async () => {
    await test('GET /admin/stats (admin) → 200 with stat keys', async () => {
      const { status, data } = await request(STATS, { token: tokens.admin });
      assert.status(status, 200, data);

      // Normalize: backend may nest under data.stats or return flat
      const stats = data?.stats ?? data;
      assert.ok(typeof stats === 'object', 'Expected stats object');
      assert.ok('totalMovies' in stats || 'totalSeries' in stats || 'totalUsers' in stats,
        'Expected at least one stat field (totalMovies, totalSeries, totalUsers)');
    });

    await test('GET /admin/stats (user token) → 403', async () => {
      const { status } = await request(STATS, { token: tokens.user });
      assert.equal(status, 403);
    });

    await test('GET /admin/stats (no token) → 401', async () => {
      const { status } = await request(STATS);
      assert.equal(status, 401);
    });
  });

  await suite('Admin — User Management', async () => {
    await test('GET /admin/users (admin) → 200, array of users', async () => {
      const { status, data } = await request(USERS, { token: tokens.admin });
      assert.status(status, 200, data);
      assert.isArray(data);
      assert.ok(data.length >= 1, 'Expected at least 1 user (the seeded admin)');

      // Each user should have core fields
      const first = data[0];
      assert.hasKeys(first, ['id', 'email', 'role']);
    });

    await test('GET /admin/users (user token) → 403', async () => {
      const { status } = await request(USERS, { token: tokens.user });
      assert.equal(status, 403);
    });

    await test('GET /admin/users (no token) → 401', async () => {
      const { status } = await request(USERS);
      assert.equal(status, 401);
    });

    await test('Admin user list includes the seeded admin account', async () => {
      const { data } = await request(USERS, { token: tokens.admin });
      assert.isArray(data);

      const adminUser = data.find((u) => u.email === 'admin@streamvault.com');
      assert.ok(adminUser, 'Seeded admin user (admin@streamvault.com) not found in user list');
      assert.equal(adminUser.role, 'ADMIN');
    });

    await test('Admin user list includes the newly registered test user', async () => {
      const { data } = await request(USERS, { token: tokens.admin });
      assert.isArray(data);

      const testUser = data.find((u) => u.email?.includes('qa_user_'));
      assert.ok(testUser, 'Registered QA test user not found in admin user list');
      assert.equal(testUser.role, 'USER');
    });
  });

  await suite('Admin — S3 Presigned Upload URL', async () => {
    await test('POST /upload-url (admin) → 200 with uploadUrl + fileUrl', async () => {
      const { status, data } = await request(UPLOAD_URL, {
        method: 'POST',
        token: tokens.admin,
        body: { fileName: 'qa-test-thumb.jpg', fileType: 'image/jpeg' },
      });

      assert.status(status, 200, data);
      assert.hasKeys(data, ['uploadUrl', 'fileUrl']);
      assert.ok(data.uploadUrl.startsWith('https://'), 'uploadUrl should be an https S3 URL');
      assert.ok(data.fileUrl.startsWith('https://'), 'fileUrl should be an https S3 URL');
    });

    await test('POST /upload-url (user token) → 403', async () => {
      const { status } = await request(UPLOAD_URL, {
        method: 'POST',
        token: tokens.user,
        body: { fileName: 'hack.mp4', fileType: 'video/mp4' },
      });

      assert.equal(status, 403);
    });

    await test('POST /upload-url (no token) → 401', async () => {
      const { status } = await request(UPLOAD_URL, {
        method: 'POST',
        body: { fileName: 'anon.mp4', fileType: 'video/mp4' },
      });

      assert.equal(status, 401);
    });

    await test('POST /upload-url (missing body fields) → 400', async () => {
      const { status } = await request(UPLOAD_URL, {
        method: 'POST',
        token: tokens.admin,
        body: {}, // fileName and fileType are required
      });

      assert.equal(status, 400);
    });
  });
}

import { defineConfig, devices } from '@playwright/test';
import { FRONTEND_URL } from '../config.js';

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  retries: 1,
  workers: 1, // sequential — tests share auth state via storageState files

  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/e2e/report', open: 'never' }],
  ],

  use: {
    baseURL: FRONTEND_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

import { defineConfig } from '@playwright/test';

// Determine if we are in a CI environment
const isCI = process.env.CI === 'true';

export default defineConfig({
  timeout: 30000,
  retries: 0,
  use: {
    headless: true,
    baseURL: 'http://web:1313/homepage/',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on',
  },
  reporter: isCI ? 'dot' : 'html',
});

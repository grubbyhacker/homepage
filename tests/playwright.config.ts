import { defineConfig } from '@playwright/test';

// Determine if we are in a CI environment
const isCI = process.env.CI === 'true';

export default defineConfig({
  timeout: 30000,
  retries: 3,
  testDir: './',
  outputDir: './test-results',
  updateSnapshots: isCI? 'none' : 'missing',
  snapshotPathTemplate: '{testDir}/{testFileDir}/__screenshots__/{testFileName}-{arg}{ext}',

  // Optional: Pixel tolerance for screenshot comparison. Adjust as needed.
  // A value of 0 means pixel-perfect. Small values (e.g., 0.1) can account for minor rendering differences.
    expect: {
      toMatchSnapshot: {
      threshold: 0.1, // 0.1% pixel difference allowed
      },
    },

  use: {
    headless: true,
    baseURL: 'http://web:1313/homepage/',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  reporter: isCI ? 'dot' : 'html',
});

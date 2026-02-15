const { defineConfig, devices } = require('@playwright/test');
const { getConfig } = require('./config/environments.config.js');
const testConfig = require('./config/test.config.js');
require('dotenv').config();

const envConfig = getConfig();
const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: 'tests',
  timeout: envConfig.timeout,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : testConfig.PARALLEL.workers,

  use: {
    headless: isCI ? true : envConfig.headless,
    slowMo: envConfig.slowMo,
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/results.xml' }],
    ['list'],
    ['./src/utils/json-failures-reporter.js'],
  ],

  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});


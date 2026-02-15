/**
 * Browser Configuration
 * Browser-specific settings and capabilities
 */

module.exports = {
  CHROME: {
    name: 'chromium',
    headless: process.env.HEADLESS !== 'false',
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
    ],
  },
  FIREFOX: {
    name: 'firefox',
    headless: true,
    firefoxUserPrefs: {
      'browser.startup.homepage_override.mstone': 'ignore',
    },
  },
  WEBKIT: {
    name: 'webkit',
    headless: true,
  },
  VIEWPORT: {
    width: 1280,
    height: 720,
  },
};

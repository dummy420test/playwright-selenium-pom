/**
 * Page Fixtures
 * Reusable fixtures for test setup
 */

const { test: base } = require('@playwright/test');
const { GooglePage } = require('../pages/GooglePage');
const { logger } = require('../utils/logger');

/**
 * Custom fixture that provides initialized page objects
 */
const test = base.extend({
  /**
   * Fixture: googlePage
   * Initializes GooglePage with automatic cleanup
   */
  googlePage: async ({ page }, use) => {
    logger.info('Setting up GooglePage fixture');

    const googlePage = new GooglePage(page);

    // Setup
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logger.warn(`Console error: ${msg.text()}`);
      }
    });

    page.on('request', request => {
      logger.debug(`Request: ${request.method()} ${request.url()}`);
    });

    page.on('response', response => {
      logger.debug(`Response: ${response.status()} ${response.url()}`);
    });

    // Use the fixture
    await use(googlePage);

    // Teardown
    logger.info('Tearing down GooglePage fixture');
    try {
      await googlePage.closePage();
    } catch (error) {
      logger.warn('Error closing page during teardown');
    }
  },

  /**
   * Fixture: authenticatedPage
   * Provides authenticated user context
   */
  authenticatedPage: async ({ page }, use) => {
    logger.info('Setting up authenticated page fixture');

    // Login logic here if needed
    // await loginUser(page);

    await use(page);

    // Logout logic here if needed
    // await logoutUser(page);
  },
});

module.exports = { test };

/**
 * Custom Assertions
 * Application-specific assertion helpers
 */

const { expect } = require('@playwright/test');
const { logger } = require('./logger');

class CustomAssertions {
  static async assertElementVisible(page, selector, message = '') {
    try {
      const locator = page.locator(selector);
      await expect(locator).toBeVisible();
      logger.info(`✓ Element is visible: ${selector}`);
    } catch (error) {
      logger.error(`✗ Assert element visible failed: ${selector} ${message}`);
      throw error;
    }
  }

  static async assertElementContainsText(page, selector, text, message = '') {
    try {
      const locator = page.locator(selector);
      await expect(locator).toContainText(text);
      logger.info(`✓ Element contains text "${text}": ${selector}`);
    } catch (error) {
      logger.error(`✗ Assert element text failed: ${selector} ${message}`);
      throw error;
    }
  }

  static async assertPageNavigation(page, expectedUrl, timeout = 5000) {
    try {
      await page.waitForURL(expectedUrl, { timeout });
      logger.info(`✓ Page navigated to: ${expectedUrl}`);
    } catch (error) {
      logger.error(`✗ Page navigation failed. Expected: ${expectedUrl}, Got: ${page.url()}`);
      throw error;
    }
  }

  static assertResultCount(count, expectedMin, expectedMax, message = '') {
    try {
      expect(count).toBeGreaterThanOrEqual(expectedMin);
      expect(count).toBeLessThanOrEqual(expectedMax);
      logger.info(`✓ Result count ${count} is within range [${expectedMin}, ${expectedMax}]`);
    } catch (error) {
      logger.error(`✗ Result count assertion failed: ${message}`);
      throw error;
    }
  }

  static assertNoConsoleErrors(consoleLogs) {
    const errors = consoleLogs.filter(log => log.type === 'error');
    if (errors.length > 0) {
      logger.warn(`⚠️ Console errors detected: ${errors.length}`);
      errors.forEach(error => logger.error(`Console error: ${error.message}`));
    }
  }
}

module.exports = { CustomAssertions };

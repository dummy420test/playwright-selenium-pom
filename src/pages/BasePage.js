/**
 * BasePage - Base class for all page objects
 * Contains common methods and utilities for all pages
 */

const { expect } = require('@playwright/test');
const { logger } = require('../utils/logger');
const TIMEOUTS = require('../constants/timeouts');

class BasePage {
  /**
   * Constructor for BasePage
   * @param {import('@playwright/test').Page} page - Playwright Page object
   */
  constructor(page) {
    this.page = page;
    this.pageTitle = null;
    this.pageUrl = null;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - URL to navigate to
   * @param {object} options - Navigation options
   * @returns {Promise<void>}
   */
  async navigateTo(url, options = { waitUntil: 'domcontentloaded' }) {
    try {
      logger.info(`Navigating to: ${url}`);
      await this.page.goto(url, options);
      logger.info(`Successfully navigated to: ${url}`);
    } catch (error) {
      logger.error(`Failed to navigate to ${url}: ${error.message}`);
      throw new Error(`Navigation failed: ${error.message}`);
    }
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForElement(selector, timeout = TIMEOUTS.ELEMENT_VISIBILITY) {
    try {
      const locator = this.page.locator(selector);
      await locator.waitFor({ state: 'visible', timeout });
      logger.debug(`Element found: ${selector}`);
    } catch (error) {
      logger.error(`Element not found within ${timeout}ms: ${selector}`);
      throw new Error(`Element timeout: ${selector}`);
    }
  }

  /**
   * Click an element with retry logic
   * @param {string} selector - Element selector
   * @param {number} retries - Number of retries
   * @returns {Promise<void>}
   */
  async clickWithRetry(selector, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const locator = this.page.locator(selector);
        await locator.click();
        logger.info(`Clicked element: ${selector}`);
        return;
      } catch (error) {
        if (i === retries - 1) {
          logger.error(`Failed to click after ${retries} retries: ${selector}`);
          throw error;
        }
        logger.warn(`Click failed, retry ${i + 1}/${retries}: ${selector}`);
        await this.page.waitForTimeout(500);
      }
    }
  }

  /**
   * Fill input field with validation
   * @param {string} selector - Input selector
   * @param {string} text - Text to fill
   * @returns {Promise<void>}
   */
  async fillInput(selector, text) {
    try {
      const locator = this.page.locator(selector);
      await locator.clear();
      await locator.fill(text);
      const value = await locator.inputValue();
      if (value !== text) {
        throw new Error(`Text mismatch: expected "${text}", got "${value}"`);
      }
      logger.info(`Filled input ${selector} with: ${text}`);
    } catch (error) {
      logger.error(`Failed to fill input ${selector}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get text from an element
   * @param {string} selector - Element selector
   * @returns {Promise<string>}
   */
  async getElementText(selector) {
    try {
      const text = await this.page.locator(selector).textContent();
      logger.debug(`Retrieved text from ${selector}: ${text}`);
      return text.trim();
    } catch (error) {
      logger.error(`Failed to get text from ${selector}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Wait for page to reach a specific state
   * @param {string} state - State: 'load', 'domcontentloaded', 'networkidle'
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForPageLoad(state = 'networkidle', timeout = TIMEOUTS.PAGE_LOAD) {
    try {
      await this.page.waitForLoadState(state, { timeout });
      logger.info(`Page reached ${state} state`);
    } catch (error) {
      logger.warn(`Page load state timeout (${state}): ${error.message}`);
    }
  }

  /**
   * Handle alerts/dialogs
   * @param {string} action - 'accept' or 'dismiss'
   * @returns {Promise<void>}
   */
  async handleDialog(action = 'accept') {
    this.page.once('dialog', async dialog => {
      logger.info(`Dialog detected: ${dialog.type()} - ${dialog.message()}`);
      if (action === 'accept') {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Take screenshot for debugging
   * @param {string} filename - Screenshot filename
   * @returns {Promise<void>}
   */
  async takeScreenshot(filename) {
    try {
      const path = `reports/screenshots/${filename}.png`;
      await this.page.screenshot({ path });
      logger.info(`Screenshot saved: ${path}`);
    } catch (error) {
      logger.error(`Failed to take screenshot: ${error.message}`);
    }
  }

  /**
   * Execute JavaScript in page context
   * @param {string} script - JavaScript code
   * @returns {Promise<any>}
   */
  async executeScript(script) {
    try {
      const result = await this.page.evaluate(script);
      logger.debug(`Script executed successfully`);
      return result;
    } catch (error) {
      logger.error(`Script execution failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get page URL
   * @returns {string}
   */
  getPageURL() {
    return this.page.url();
  }

  /**
   * Get page title
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Close page
   * @returns {Promise<void>}
   */
  async closePage() {
    await this.page.close();
    logger.info('Page closed');
  }

  /**
   * Scroll to element
   * @param {string} selector - Element selector
   * @returns {Promise<void>}
   */
  async scrollToElement(selector) {
    try {
      const locator = this.page.locator(selector);
      await locator.scrollIntoViewIfNeeded();
      logger.info(`Scrolled to element: ${selector}`);
    } catch (error) {
      logger.error(`Failed to scroll to element ${selector}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if element exists
   * @param {string} selector - Element selector
   * @returns {Promise<boolean>}
   */
  async elementExists(selector) {
    try {
      const count = await this.page.locator(selector).count();
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for multiple elements
   * @param {string} selector - Element selector
   * @param {number} expectedCount - Expected element count
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForElements(selector, expectedCount, timeout = TIMEOUTS.LONG) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const count = await this.page.locator(selector).count();
      if (count >= expectedCount) {
        logger.info(`Found ${count} elements matching ${selector}`);
        return;
      }
      await this.page.waitForTimeout(500);
    }
    throw new Error(`Expected ${expectedCount} elements, timeout after ${timeout}ms`);
  }
}

module.exports = { BasePage };

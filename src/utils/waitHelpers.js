/**
 * Wait Helpers
 * Custom wait strategies for complex scenarios
 */

const { logger } = require('./logger');

class WaitHelpers {
  static async waitForElementClickable(locator, timeout = 10000) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await locator.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      logger.debug('Element is clickable');
    } catch (error) {
      logger.error(`Element not clickable within ${timeout}ms`);
      throw error;
    }
  }

  static async waitForApiResponse(page, urlPattern, timeout = 10000) {
    return page.waitForResponse(
      response => response.url().includes(urlPattern),
      { timeout }
    );
  }

  static async waitForNetworkIdle(page, timeout = 30000) {
    try {
      await page.waitForLoadState('networkidle', { timeout });
      logger.info('Network is idle');
    } catch (error) {
      logger.warn('Network still busy, but proceeding');
    }
  }

  static async waitForDOMStability(page, selector, timeout = 10000) {
    const startTime = Date.now();
    let previousHTML = '';
    let stableCount = 0;

    while (Date.now() - startTime < timeout) {
      const currentHTML = await page.locator(selector).innerHTML();

      if (currentHTML === previousHTML) {
        stableCount++;
        if (stableCount >= 2) {
          logger.debug('DOM is stable');
          return true;
        }
      } else {
        stableCount = 0;
      }

      previousHTML = currentHTML;
      await page.waitForTimeout(500);
    }

    throw new Error(`DOM did not stabilize within ${timeout}ms`);
  }

  static async waitWithBackoff(fn, maxRetries = 3, initialDelay = 500) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const delay = initialDelay * Math.pow(2, i);
        logger.warn(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

module.exports = { WaitHelpers };

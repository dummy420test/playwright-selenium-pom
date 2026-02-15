/**
 * Error Handler
 * Centralized error handling and recovery
 */

const { logger } = require('./logger');

class ErrorHandler {
  static async handleCommonErrors(error, context = '') {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('timeout')) {
      logger.error(`Timeout error in ${context}: ${error.message}`);
      return 'TIMEOUT';
    }

    if (errorMessage.includes('navigation')) {
      logger.error(`Navigation error in ${context}: ${error.message}`);
      return 'NAVIGATION_ERROR';
    }

    if (errorMessage.includes('stale')) {
      logger.error(`Stale element in ${context}: ${error.message}`);
      return 'STALE_ELEMENT';
    }

    logger.error(`Unknown error in ${context}: ${error.message}`);
    return 'UNKNOWN';
  }

  static async retryOperation(fn, maxAttempts = 3, delayMs = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        logger.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  static async recoverFromError(page, errorType) {
    switch (errorType) {
      case 'STALE_ELEMENT':
        await page.reload();
        logger.info('Recovered from stale element by reloading page');
        break;
      case 'TIMEOUT':
        await page.goto(page.url());
        logger.info('Recovered from timeout by navigating to same URL');
        break;
      case 'NAVIGATION_ERROR':
        await page.goBack();
        logger.info('Recovered from navigation error by going back');
        break;
    }
  }
}

module.exports = { ErrorHandler };

/**
 * Secrets Manager
 * Handle sensitive data securely
 */

const { logger } = require('./logger');

class SecretsManager {
  static getAPIKey() {
    const key = process.env.API_KEY;
    if (!key) {
      logger.warn('API_KEY not found in environment variables');
      return null;
    }
    return key;
  }

  static getCredentials() {
    return {
      username: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    };
  }

  static maskSensitiveData(text) {
    return text
      .replace(/(?<=api_key=).+/g, '***')
      .replace(/(?<=password=).+/g, '***')
      .replace(/(?<=token=).+/g, '***');
  }

  static logSafely(data) {
    const masked = this.maskSensitiveData(JSON.stringify(data));
    logger.info(masked);
  }
}

module.exports = { SecretsManager };

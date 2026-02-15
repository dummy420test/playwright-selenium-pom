/**
 * Environment Configuration
 * Centralized configuration for different environments
 */

const environments = {
  development: {
    baseURL: 'https://duckduckgo.com',
    apiURL: 'https://api-dev.duckduckgo.com',
    timeout: 30000,
    slowMo: 100,
    headless: false,
  },
  staging: {
    baseURL: 'https://staging.duckduckgo.com',
    apiURL: 'https://api-staging.duckduckgo.com',
    timeout: 30000,
    slowMo: 0,
    headless: true,
  },
  production: {
    baseURL: 'https://duckduckgo.com',
    apiURL: 'https://api.duckduckgo.com',
    timeout: 45000,
    slowMo: 0,
    headless: true,
  },
};

const currentEnv = process.env.ENVIRONMENT || 'development';

module.exports = {
  getConfig: () => environments[currentEnv],
  getAllEnvironments: () => environments,
  getCurrentEnvironment: () => currentEnv,
};

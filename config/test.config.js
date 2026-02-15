/**
 * Test Configuration
 * Centralized test-specific settings
 */

module.exports = {
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 15000,
    LONG: 30000,
    EXTRA_LONG: 60000,
  },
  RETRY: {
    enabled: true,
    count: 2,
  },
  PARALLEL: {
    workers: Number(process.env.WORKERS) || 4,
  },
  REPORTS: {
    html: true,
    json: true,
    junit: true,
    allure: false,
  },
};

/**
 * Application Constants
 * Centralized constants used across the application
 */

module.exports = {
  SEARCH_TERMS: {
    VALID: ['Playwright', 'JavaScript', 'Automation', 'Testing'],
    INVALID: ['!!!@@@', ''],
    SPECIAL_CHARS: ['<script>', 'SELECT * FROM'],
  },

  WAIT_TIMES: {
    ELEMENT_VISIBLE: 10000,
    PAGE_LOAD: 30000,
    NETWORK_IDLE: 20000,
    SHORT: 5000,
  },

  ERROR_MESSAGES: {
    ELEMENT_NOT_FOUND: 'Element not found within timeout',
    NAVIGATION_FAILED: 'Failed to navigate to page',
    SEARCH_FAILED: 'Search operation failed',
    TIMEOUT_ERROR: 'Operation timed out',
  },

  URLS: {
    DUCKDUCKGO_HOME: 'https://duckduckgo.com/',
    DUCKDUCKGO_SEARCH: 'https://duckduckgo.com/?q=',
  },

  SELECTORS: {
    ACCEPT_BUTTON: 'button:has-text("Accept all")',
    SEARCH_BOX: 'input[name="q"]',
    SEARCH_BUTTON: 'button[type="submit"]',
  },

  TEST_DATA: {
    SEARCH_TIMEOUT: 15000,
    RESULT_MIN_COUNT: 1,
    RESULT_MAX_COUNT: 1000,
  },
};

/**
 * Error Messages
 * Centralized error messages
 */

module.exports = {
  ELEMENT: {
    NOT_FOUND: 'Element not found within timeout',
    NOT_VISIBLE: 'Element not visible',
    NOT_CLICKABLE: 'Element not clickable',
    STALE: 'Stale element reference',
  },
  NAVIGATION: {
    FAILED: 'Navigation failed',
    TIMEOUT: 'Navigation timeout exceeded',
    INVALID_URL: 'Invalid URL provided',
  },
  SEARCH: {
    FAILED: 'Search operation failed',
    NO_RESULTS: 'No search results found',
    INVALID_TERM: 'Invalid search term provided',
  },
  PAGE: {
    LOAD_FAILED: 'Page load failed',
    TITLE_MISMATCH: 'Page title mismatch',
    URL_MISMATCH: 'Page URL mismatch',
  },
  ASSERTION: {
    FAILED: 'Assertion failed',
    CONDITION_NOT_MET: 'Expected condition not met',
  },
};

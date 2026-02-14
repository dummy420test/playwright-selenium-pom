/**
 * DuckDuckGo Search Page Locators
 * Centralized location for all selectors used on the search page
 */

const searchLocators = {
  // Search input field
  SEARCH_BOX: 'xpath=//*[@id="searchbox_input"]',
  
  // Search button
  SEARCH_BUTTON: 'xpath=//button[@title="Search"]',
  
  // Submit button (alternative)
  SUBMIT_BUTTON: 'xpath=//*[@type="submit"]',
  
  // Search results container
  SEARCH_RESULTS: '#search',
  
  // Individual search result links
  RESULT_LINKS: 'a.result__url, a[data-testid="result-title-a"]',
  
  // Cookie consent button
  ACCEPT_BUTTON: 'button:has-text("Accept all"), button:has-text("I agree"), div[role="none"] button:has-text("Accept")',
};

module.exports = { searchLocators };
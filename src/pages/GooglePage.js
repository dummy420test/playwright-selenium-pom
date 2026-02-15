/**
 * GooglePage - Page Object Model for DuckDuckGo search
 * Handles navigation, search, and result extraction
 */

const { BasePage } = require('./BasePage');
const { GoogleLocators } = require('../locators/GoogleLocators');
const { logger } = require('../utils/logger');
const TIMEOUTS = require('../constants/timeouts');

class GooglePage extends BasePage {
  /**
   * Constructor for GooglePage
   * @param {import('@playwright/test').Page} page - Playwright Page object
   */
  constructor(page) {
    super(page);
    // Use locators from the locators file
    this.searchBox = page.locator(GoogleLocators.SEARCH_BOX);
    this.clickSearchButton = page.locator(GoogleLocators.SEARCH_BUTTON);
    this.clickSubmitButton = page.locator(GoogleLocators.SUBMIT_BUTTON);
    this.verifySearchResults = page.locator(GoogleLocators.SEARCH_RESULTS);
    this.acceptButton = page.locator(GoogleLocators.ACCEPT_BUTTON);
  }

  /**
   * Navigate to DuckDuckGo homepage
   * Handles cookie consent popup if present
   * @returns {Promise<void>}
   */
  async goto() {
    try {
      await this.navigateTo('https://duckduckgo.com/', { waitUntil: 'domcontentloaded' });

      // Handle cookie consent if present
      if (await this.acceptButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        logger.info('Cookie consent button found, clicking...');
        await this.acceptButton.click();
        await this.searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBILITY });
      }

      logger.info('Successfully navigated to DuckDuckGo homepage');
    } catch (error) {
      logger.error(`Failed to navigate to DuckDuckGo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search for a term on DuckDuckGo
   * Fills search box and clicks search button
   * @param {string} term - The search term to look for
   * @returns {Promise<void>}
   */
  async search(term) {
    try {
      logger.info(`Starting search for term: "${term}"`);

      // Wait for the search box to be visible
      await this.searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBILITY });
      await this.searchBox.click();
      await this.fillInput(GoogleLocators.SEARCH_BOX, term);

      // Wait for and click search button
      await this.clickSearchButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBILITY });
      await this.clickSearchButton.click();

      // Wait for results to load
      await this.waitForPageLoad('networkidle', TIMEOUTS.PAGE_LOAD);
      logger.info(`Search completed for term: "${term}"`);
    } catch (error) {
      logger.error(`Search failed for term "${term}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract and retrieve all search results from the page
   * Waits for results to load and extracts URLs and titles
   * @returns {Promise<Array<{url: string, title: string}>>} Array of search result objects
   */
  async getSearchResults() {
    try {
      // Wait for search results to load
      await this.waitForPageLoad('networkidle', TIMEOUTS.NETWORK_IDLE);

      // Extract all search result URLs from DuckDuckGo results
      const searchResultUrls = await this.page.evaluate(() => {
        const results = [];
        // DuckDuckGo search results are typically in <a> tags with class 'result__url' or similar
        const resultLinks = document.querySelectorAll('a.result__url, a[data-testid="result-title-a"]');

        resultLinks.forEach((link) => {
          const href = link.getAttribute('href');
          const text = link.textContent.trim();
          if (href && text) {
            results.push({
              url: href,
              title: text,
            });
          }
        });
        return results;
      });

      // Log the results for debugging
      logger.info(`\n📊 Search Results Retrieved: ${searchResultUrls.length} URLs found\n`);
      searchResultUrls.forEach((result, index) => {
        logger.info(`${index + 1}. ${result.title}`);
        logger.info(`   URL: ${result.url}\n`);
      });

      return searchResultUrls;
    } catch (error) {
      logger.error(`Failed to get search results: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify search results page is displayed
   * @returns {Promise<boolean>}
   */
  async isSearchResultsPageDisplayed() {
    try {
      const url = this.getPageURL();
      const hasResults = url.includes('q=');
      logger.info(`Search results page displayed: ${hasResults}`);
      return hasResults;
    } catch (error) {
      logger.error(`Failed to verify search results page: ${error.message}`);
      return false;
    }
  }

  /**
   * Get number of search results
   * @returns {Promise<number>}
   */
  async getResultCount() {
    try {
      const results = await this.getSearchResults();
      return results.length;
    } catch (error) {
      logger.error(`Failed to get result count: ${error.message}`);
      return 0;
    }
  }

  /**
   * Clear search box
   * @returns {Promise<void>}
   */
  async clearSearchBox() {
    try {
      await this.searchBox.clear();
      logger.info('Search box cleared');
    } catch (error) {
      logger.error(`Failed to clear search box: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { GooglePage };
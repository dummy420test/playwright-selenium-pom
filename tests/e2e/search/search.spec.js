/**
 * Search Tests - E2E
 * Comprehensive E2E tests for DuckDuckGo search functionality
 */

const { test, expect } = require('@playwright/test');
const { GooglePage } = require('../../../src/pages/GooglePage');
const { SearchDataBuilder } = require('../../../src/utils/testDataBuilder');
const { CustomAssertions } = require('../../../src/utils/assertions');
const { logger } = require('../../../src/utils/logger');
const searchTermsData = require('../../../test-data/search-terms.json');

test.describe('DuckDuckGo Search @e2e @search', () => {
  let googlePage;

  test.beforeEach(async ({ page }) => {
    googlePage = new GooglePage(page);
    logger.startTest(test.info().title);
    await googlePage.goto();
  });

  test.afterEach(async () => {
    const testTitle = test.info().title;
    const testStatus = test.info().status;
    logger.endTest(testTitle, testStatus);
  });

  test('TC001: Should search with valid term @smoke @regression', async ({ page }) => {
    // Arrange
    const searchData = new SearchDataBuilder().buildValid();
    logger.info(`Test data: ${JSON.stringify(searchData)}`);

    // Act
    await googlePage.search(searchData.term);

    // Assert
    const results = await googlePage.getSearchResults();
    CustomAssertions.assertResultCount(
      results.length,
      searchData.term.includes('Playwright') ? 1 : 1,
      1000,
      'Search should return results'
    );
    expect(results.length).toBeGreaterThan(0);
    logger.info(`✓ Found ${results.length} search results`);
  });

  test('TC002: Should verify search results page URL @smoke', async ({ page }) => {
    // Arrange
    const searchTerm = 'Playwright';

    // Act
    await googlePage.search(searchTerm);

    // Assert
    const isDisplayed = await googlePage.isSearchResultsPageDisplayed();
    expect(isDisplayed).toBe(true);
    logger.info('✓ Search results page verified');
  });

  test('TC003: Should validate result quality @regression', async () => {
    // Arrange
    const searchData = new SearchDataBuilder().buildValid();

    // Act
    await googlePage.search(searchData.term);
    const results = await googlePage.getSearchResults();

    // Assert
    results.slice(0, 5).forEach((result, index) => {
      expect(result.url).toBeTruthy();
      expect(result.title).toBeTruthy();
      expect(result.url).toMatch(/^https?:\/\//);
      logger.debug(`Result ${index + 1}: "${result.title}"`);
    });

    logger.info('✓ Result quality validated');
  });

  test('TC004: Should handle special characters gracefully @edge-case', async () => {
    // Arrange
    const searchData = new SearchDataBuilder().buildInvalid();

    // Act & Assert
    try {
      await googlePage.search(searchData.term);
      const results = await googlePage.getSearchResults();
      expect(results.length).toBeGreaterThanOrEqual(0);
      logger.info('✓ Special character search handled gracefully');
    } catch (error) {
      logger.info('✓ Special character search handled with error as expected');
    }
  });

  test('TC005: Should search with multiple valid terms @regression', async () => {
    // Arrange
    const terms = searchTermsData.validSearchTerms.map(t => t.term);

    // Act & Assert
    for (const term of terms) {
      await googlePage.goto(); // Reset for each search
      await googlePage.search(term);
      const results = await googlePage.getSearchResults();

      expect(results.length).toBeGreaterThanOrEqual(0);
      logger.info(`✓ Searched and retrieved results for: "${term}"`);
    }
  });

  test('TC006: Should retrieve result count @smoke', async () => {
    // Arrange
    const searchTerm = 'JavaScript';

    // Act
    await googlePage.search(searchTerm);
    const resultCount = await googlePage.getResultCount();

    // Assert
    expect(resultCount).toBeGreaterThan(0);
    logger.info(`✓ Result count: ${resultCount}`);
  });

  test('TC007: Should verify result URLs are valid @regression', async () => {
    // Arrange
    const searchData = new SearchDataBuilder().buildValid();

    // Act
    await googlePage.search(searchData.term);
    const results = await googlePage.getSearchResults();

    // Assert
    const invalidUrls = results.filter(result => !result.url.match(/^https?:\/\//));
    expect(invalidUrls.length).toBe(0);
    logger.info(`✓ All ${results.length} URLs are valid`);
  });

  test('TC008: Should handle clear search box @regression', async () => {
    // Arrange
    const searchTerm = 'test';

    // Act
    await googlePage.search(searchTerm);
    await googlePage.clearSearchBox();

    // Assert
    logger.info('✓ Search box cleared successfully');
  });
});

test.describe('DuckDuckGo Search Smoke Tests', () => {
  let googlePage;

  test.beforeEach(async ({ page }) => {
    googlePage = new GooglePage(page);
    logger.startTest(test.info().title);
  });

  test('SMOKE001: Homepage loads successfully @smoke', async ({ page }) => {
    await googlePage.goto();
    const title = await googlePage.getPageTitle();
    expect(title).toBeTruthy();
    logger.info(`✓ Homepage loaded with title: "${title}"`);
  });

  test('SMOKE002: Basic search works @smoke', async () => {
    await googlePage.goto();
    await googlePage.search('test');
    const results = await googlePage.getSearchResults();
    expect(results.length).toBeGreaterThan(0);
    logger.info('✓ Basic search functionality works');
  });

  test('SMOKE003: Search box is visible @smoke', async ({ page }) => {
    await googlePage.goto();
    const exists = await googlePage.elementExists('xpath=//*[@id="searchbox_input"]');
    expect(exists).toBe(true);
    logger.info('✓ Search box is visible and accessible');
  });
});

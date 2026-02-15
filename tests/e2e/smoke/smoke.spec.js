/**
 * Smoke Tests
 * Quick smoke tests to verify basic functionality
 */

const { test, expect } = require('@playwright/test');
const { GooglePage } = require('../../../src/pages/GooglePage');
const { logger } = require('../../../src/utils/logger');

test.describe('DuckDuckGo Smoke Tests @smoke', () => {
  let googlePage;

  test.beforeEach(async ({ page }) => {
    googlePage = new GooglePage(page);
    logger.startTest(test.info().title);
  });

  test.afterEach(async () => {
    const testTitle = test.info().title;
    const testStatus = test.info().status;
    logger.endTest(testTitle, testStatus);
  });

  test('SM001: Application homepage is accessible @smoke', async ({ page }) => {
    await googlePage.goto();
    const url = googlePage.getPageURL();
    expect(url).toContain('duckduckgo');
    logger.info('✓ Homepage is accessible');
  });

  test('SM002: Search functionality is operational @smoke', async () => {
    await googlePage.goto();
    await googlePage.search('Playwright');

    const isDisplayed = await googlePage.isSearchResultsPageDisplayed();
    expect(isDisplayed).toBe(true);
    logger.info('✓ Search functionality is operational');
  });

  test('SM003: Search returns results @smoke', async () => {
    await googlePage.goto();
    await googlePage.search('automation');

    const results = await googlePage.getSearchResults();
    expect(results.length).toBeGreaterThan(0);
    logger.info(`✓ Search returned ${results.length} results`);
  });

  test('SM004: Result links are clickable @smoke', async ({ page }) => {
    await googlePage.goto();
    await googlePage.search('test');

    const results = await googlePage.getSearchResults();
    results.slice(0, 3).forEach((result, index) => {
      expect(result.url).toBeTruthy();
      expect(result.title).toBeTruthy();
      logger.debug(`Result ${index + 1}: ${result.title}`);
    });

    logger.info('✓ Result links are valid');
  });
});

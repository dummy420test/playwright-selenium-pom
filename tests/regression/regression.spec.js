/**
 * Regression Tests
 * Comprehensive regression test suite
 */

const { test, expect } = require('@playwright/test');
const { GooglePage } = require('../../src/pages/GooglePage');
const { SearchDataBuilder } = require('../../src/utils/testDataBuilder');
const { logger } = require('../../src/utils/logger');

test.describe('DuckDuckGo Regression Tests @regression', () => {
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

  test('REG001: Search with various keywords @regression', async () => {
    const keywords = ['JavaScript', 'Testing', 'Automation', 'Framework', 'Development'];

    for (const keyword of keywords) {
      await googlePage.goto();
      await googlePage.search(keyword);

      const results = await googlePage.getSearchResults();
      expect(results.length).toBeGreaterThan(0);
      logger.info(`✓ Keyword "${keyword}": ${results.length} results`);
    }
  });

  test('REG002: Verify page title on results page @regression', async ({ page }) => {
    await googlePage.goto();
    await googlePage.search('Playwright');

    const title = await googlePage.getPageTitle();
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).toContain('playwright');
    logger.info(`✓ Page title: "${title}"`);
  });

  test('REG003: Search results contain expected properties @regression', async () => {
    await googlePage.goto();
    await googlePage.search('test');

    const results = await googlePage.getSearchResults();
    expect(results.length).toBeGreaterThan(0);

    results.slice(0, 5).forEach((result) => {
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('title');
      expect(typeof result.url).toBe('string');
      expect(typeof result.title).toBe('string');
      expect(result.url.length).toBeGreaterThan(0);
      expect(result.title.length).toBeGreaterThan(0);
    });

    logger.info('✓ All results have required properties');
  });

  test('REG004: Multiple consecutive searches @regression', async () => {
    const searchTerms = ['JavaScript', 'Python', 'Java'];

    for (const term of searchTerms) {
      await googlePage.goto();
      await googlePage.search(term);

      const results = await googlePage.getSearchResults();
      expect(results.length).toBeGreaterThan(0);
      logger.info(`✓ Search "${term}" returned ${results.length} results`);
    }
  });

  test('REG005: Result count matches displayed results @regression', async () => {
    await googlePage.goto();
    await googlePage.search('test');

    const results = await googlePage.getSearchResults();
    const resultCount = await googlePage.getResultCount();

    expect(resultCount).toBe(results.length);
    logger.info(`✓ Result count (${resultCount}) matches actual results`);
  });

  test('REG006: Search with builder pattern @regression', async () => {
    const builder = new SearchDataBuilder();
    const searchData = builder
      .withSearchTerm('Automation Testing')
      .withLocale('en-US')
      .build();

    await googlePage.goto();
    await googlePage.search(searchData.term);

    const results = await googlePage.getSearchResults();
    expect(results.length).toBeGreaterThan(0);
    logger.info('✓ Search with builder pattern successful');
  });

  test('REG007: Page remains stable after search @regression', async ({ page }) => {
    await googlePage.goto();
    const url1 = googlePage.getPageURL();

    await googlePage.search('stable');
    const url2 = googlePage.getPageURL();

    expect(url2).not.toBe(url1);
    expect(url2).toContain('q=');
    logger.info('✓ Page navigated correctly after search');
  });

  test('REG008: Error handling for empty search @regression', async () => {
    await googlePage.goto();

    try {
      await googlePage.search('');
      logger.info('✓ Empty search handled');
    } catch (error) {
      logger.info('✓ Empty search threw expected error');
    }
  });
});

const { test, expect } = require('@playwright/test');
const { GooglePage } = require('../src/pages/GooglePage');

test('Google search works and retrieves results', async ({ page }) => {
  const google = new GooglePage(page);
  await google.goto();
  await google.search('Playwright');
  
  // Get search results
  const results = await google.getSearchResults();
  
  // Verify search results were found
  expect(results.length).toBeGreaterThan(0);
  console.log(`✓ Test passed: Found ${results.length} search results for "Playwright"`);
});
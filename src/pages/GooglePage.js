class GooglePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('xpath=//*[@id="searchbox_input"]');
  //  this.acceptButton = page.locator('button:has-text("Accept all")');
  this.clickSearchButton = page.locator('xpath=//button[@title="Search"]');
  this.clicksubmutButton = page.locator('xpath=//*[@type="submit"]');
    this.verifySearchResults = page.locator('#search');
  }

  async goto() {
    await this.page.goto('https://duckduckgo.com/', { waitUntil: 'domcontentloaded' });

    // Handle cookie consent if present
    const acceptBtn = this.page.locator('button:has-text("Accept all"), button:has-text("I agree"), div[role="none"] button:has-text("Accept")');
    if (await acceptBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await acceptBtn.click();
      await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
    }
  }

  async search(term) {
    // Wait for the search box to be visible
    await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchBox.click();
    await this.searchBox.fill(term);
   // await this.searchBox.press('Enter');
   await this.clickSearchButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.clickSearchButton.click();
   // await this.clicksubmutButton.click();
   // await this.page.waitForLoadState('domcontentloaded');
   // await this.verifySearchResults.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getSearchResults() {
    // Wait for search results to load
    await this.page.waitForLoadState('networkidle');

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
            title: text
          });
        }
      });
      return results;
    });

    // Log the results for debugging
    console.log(`\n📊 Search Results Retrieved: ${searchResultUrls.length} URLs found\n`);
    searchResultUrls.forEach((result, index) => {
      console.log(`${index + 1}. ${result.title}`);
      console.log(`   URL: ${result.url}\n`);
    });

    return searchResultUrls;
  }
}

module.exports = { GooglePage };
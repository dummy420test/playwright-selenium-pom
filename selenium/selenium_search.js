const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

(async function () {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://www.google.com');

    // try to click consent/agree buttons if present
    try {
      const buttons = await driver.findElements(By.css('button'));
      for (const b of buttons) {
        const text = await b.getText();
        if (/agree|accept|consent/i.test(text)) {
          await b.click().catch(() => {});
          break;
        }
      }
    } catch (e) {}

    const term = 'random ' + Math.random().toString(36).slice(2, 10);
    const input = await driver.findElement(By.name('q'));
    await input.sendKeys(term, Key.RETURN);
    await driver.wait(until.titleContains(term), 5000);
    console.log(    console.log(    console.log(    console.log(    console.log(    console.log(    console.log(    console.log(    console.d <<'EOF'
# Playwright + Selenium POM Example

This scaffold shows a Playwright test (POM) and a Selenium example script that open google.com and perform a random search.

Quick start

```bash
cd playwright-selenium-pom
npm install
npm run install-browsers
# Run Playwright test (uses POM)
npm test

# Run Selenium example (requires Chrome and chromedriver)
npm run selenium
```

Files

- `package.json`: project metadata and scripts
- `playwright.config.js`: Playwright Test config
- `src/pages/GooglePage.js`: Page Object for Google
- `tests/search.spec.js`: Playwright test using the POM
- `selenium/selenium_search.js`: standalone Selenium script

Notes

- Playwright handles browser installation via `npx playwright install` (script included).
- `chromedriver` is included as a devDependency for the Selenium example.
- If Google shows a cookie/consent dialog, the scripts attempt to dismiss it.

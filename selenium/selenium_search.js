const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

(async function () {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://www.google.com');

    // try to click consent/agree buttons if present
    // try {
    //   const buttons = await driver.findElements(By.css('button'));
    //   for (const b of buttons) {
    //     const text = await b.getText();
    //     if (/agree|accept|consent/i.test(text)) {
    //       await b.click().catch(() => {});
    //       break;
    //     }
    //   }
    // } catch (e) {}

    const term = 'random ' + Math.random().toString(36).slice(2, 10);
    const input = await driver.findElement(By.name('q'));
    await input.sendKeys(term, Key.RETURN);
    await driver.wait(until.titleContains(term), 5000);
    console.log(`Searched for: ${term}`);
  } finally {
    await driver.quit();
  }
})();

# Playwright + Selenium POM Example

A test automation project using **Playwright** with **Page Object Model (POM)** pattern that automates search functionality on DuckDuckGo.

## 📋 Overview

This project demonstrates:
- **Playwright Test Framework** for modern web automation
- **Page Object Model (POM)** design pattern for maintainable test code
- **Selenium WebDriver** integration for alternative automation
- Automated search on DuckDuckGo and result extraction
- HTML reporting and detailed test logs

## 🛠️ Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Chrome/Chromium browser** (for Selenium examples)

## 📦 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd playwright-selenium-pom
```

### 2. Install dependencies
```bash
npm install
```

### 3. Install Playwright browsers
```bash
npm run install-browsers
```

## 🚀 Running Tests

### Run Playwright tests
```bash
npm test
```

### Run a specific test file
```bash
npx playwright test tests/google.spec.js
```

### Run Selenium example
```bash
npm run selenium
```

### View HTML report
```bash
npx playwright show-report
```

## 📁 Project Structure

```
playwright-selenium-pom/
├── src/
│   └── pages/
│       └── GooglePage.js           # Page Object Model for DuckDuckGo
├── tests/
│   └── google.spec.js              # Playwright test cases
├── selenium/
│   └── selenium_search.js          # Standalone Selenium script
├── playwright.config.js            # Playwright configuration
├── package.json                    # Project dependencies and scripts
└── README.md                       # This file
```

## 📄 File Descriptions

### `src/pages/GooglePage.js`
Page Object Model class that encapsulates:
- Navigation to DuckDuckGo
- Search functionality
- Results extraction and verification
- Handles cookie consent popups

**Key Methods:**
- `goto()` - Navigate to DuckDuckGo
- `search(term)` - Enter search term and click search button
- `getSearchResults()` - Extract and return all search result URLs

### `tests/google.spec.js`
Test file using Playwright Test framework:
- Tests DuckDuckGo search functionality
- Verifies search results are returned
- Logs results count and details

### `selenium/selenium_search.js`
Standalone Selenium script that:
- Opens Google.com
- Performs a random search
- Reports search term and closes browser

### `playwright.config.js`
Playwright configuration with:
- Test directory setup
- Timeout settings (60 seconds)
- Browser viewport (1280 x 720)
- Headless mode disabled (for visibility)
- HTML and JSON reporting

## 🔍 Test Features

✅ **Page Object Model Pattern** - Clean, maintainable test code  
✅ **Search Functionality** - Automated search on DuckDuckGo  
✅ **Results Extraction** - Capture all search result URLs and titles  
✅ **Error Handling** - Robust waits and timeout management  
✅ **HTML Reports** - Detailed test execution reports with screenshots  
✅ **Detailed Logging** - Console logs showing search results count and details  

## 📊 Example Output

When running tests, you'll see:
```
📊 Search Results Retrieved: 10 URLs found

1. Playwright - Fast and reliable end-to-end testing
   URL: https://playwright.dev

2. Playwright on GitHub
   URL: https://github.com/microsoft/playwright
...
```

## ⚙️ Configuration

### Update Playwright Config
Edit `playwright.config.js`:
- `testDir` - Directory containing test files
- `timeout` - Test timeout in milliseconds
- `headless` - Set to `true` for headless mode
- `slowMo` - Add delay between actions (in ms)

### Update Test Search Term
Modify the search term in `tests/google.spec.js`:
```javascript
await google.search('Your Search Term');
```

## 🔐 Important Notes

### CAPTCHA/Bot Detection
- Google and other search engines have strong anti-bot protections
- This project uses DuckDuckGo (less restrictive) for reliable automation
- **Do NOT attempt to bypass CAPTCHA** - it violates terms of service
- For production tests, use:
  - Test/staging environments you control
  - Mock APIs or test data services
  - Limited test frequency to avoid triggering bot detection

### Best Practices
- Run tests in **headed mode** (not headless) for better compatibility
- Add delays between actions with `slowMo: 100`
- Avoid running tests frequently on public search engines
- Use residential IPs for testing (avoid VPNs/proxies)

## 🐛 Troubleshooting

### "No tests found"
- Ensure test files end with `.spec.js` or `.test.js`
- Check test files are in the `tests/` directory
- Verify test file contains at least one `test()` block

### "Timeout exceeded"
- Increase timeout in `playwright.config.js`
- Check internet connectivity
- Verify selectors match current website structure

### Tests fail with CAPTCHA
- Run in headed mode for Google.com
- Use DuckDuckGo instead (used by default)
- Reduce test frequency

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test Framework](https://playwright.dev/docs/intro)
- [Page Object Model Pattern](https://playwright.dev/docs/best-practices)
- [Selenium WebDriver](https://www.selenium.dev)

## 📝 Scripts

Available npm scripts:

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `npx playwright test` | Run all Playwright tests |
| `install-browsers` | `npx playwright install` | Install Playwright browsers |
| `selenium` | `node selenium/selenium_search.js` | Run Selenium example |

## 🤝 Contributing

To add new tests:
1. Create a new `.spec.js` file in the `tests/` directory
2. Import the required Page Object from `src/pages/`
3. Write test cases using `test()` function
4. Run tests with `npm test`

## 📄 License

This project is open source and available under the MIT License.

## ✉️ Support

For issues or questions:
- Check the [Playwright Documentation](https://playwright.dev)
- Review test execution HTML reports
- Check console logs for detailed error messages

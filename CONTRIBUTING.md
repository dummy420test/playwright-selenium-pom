# Contributing Guide

## Welcome to the Playwright Test Automation Framework!

This document outlines guidelines for contributing to the project. Please read and follow these guidelines before submitting any code.

## Code of Conduct

- Be respectful and professional
- Provide constructive feedback
- Report issues clearly and comprehensively
- Help improve the codebase collaboratively

## Getting Started

### Prerequisites
- Node.js 14+ and npm 6+
- Git
- VS Code (recommended)

### Setup Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd playwright-selenium-pom

# Install dependencies
npm install

# Install Playwright browsers
npm run install-deps

# Create .env file from template
cp .env.example .env
```

## Development Workflow

### 1. Branch Naming Convention
```
feature/feature-name       # New feature
bugfix/bug-name           # Bug fix
test/test-description     # New tests
docs/documentation-topic  # Documentation
```

### 2. Commit Message Format
```
[TYPE] Brief description

Detailed explanation of changes if needed.

Fixes #issue-number
```

Types: `feat`, `fix`, `test`, `docs`, `refactor`, `style`, `ci`

### 3. Code Style

#### Before Pushing
```bash
# Format code
npm run format

# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Run tests
npm run test:smoke

# Run specific test suite
npm run test:regression
```

### 4. Writing Tests

#### Test Structure
```javascript
test.describe('Feature Name @tag1 @tag2', () => {
  let pageObject;

  test.beforeEach(async ({ page }) => {
    pageObject = new GooglePage(page);
    logger.startTest(test.info().title);
  });

  test.afterEach(async () => {
    logger.endTest(test.info().title, test.info().status);
  });

  test('TC001: Should do something @smoke', async () => {
    // Arrange
    const testData = {/** ... */};

    // Act
    await pageObject.someAction();

    // Assert
    expect(result).toBe(expected);
  });
});
```

#### Tagging Convention
- `@smoke` - Quick smoke tests (critical path)
- `@regression` - Comprehensive regression tests
- `@e2e` - End-to-end tests
- `@edge-case` - Edge case and boundary tests
- `@slow` - Tests that take longer time

#### Assertions
```javascript
// Use CustomAssertions whenever possible
await CustomAssertions.assertElementVisible(page, selector);
await CustomAssertions.assertElementContainsText(page, selector, text);
await CustomAssertions.assertPageNavigation(page, url);
```

#### Logging
```javascript
const { logger } = require('../../src/utils/logger');

logger.info('Informational message');
logger.debug('Debug message');
logger.warn('Warning message');
logger.error('Error message', error);
```

### 5. Creating New Page Objects

#### File Structure
```javascript
// src/pages/NewPage.js
const { BasePage } = require('./BasePage');
const { PageLocators } = require('../locators/PageLocators');
const { logger } = require('../utils/logger');

class NewPage extends BasePage {
  constructor(page) {
    super(page);
    this.elementOne = page.locator(PageLocators.ELEMENT_ONE);
    this.elementTwo = page.locator(PageLocators.ELEMENT_TWO);
  }

  async performAction() {
    logger.info('Performing action');
    // Implementation
  }
}

module.exports = { NewPage };
```

#### Locators File
```javascript
// src/locators/PageLocators.js
const PageLocators = {
  ELEMENT_ONE: 'selector1',
  ELEMENT_TWO: 'selector2',
};

module.exports = { PageLocators };
```

### 6. Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "[feat] Add new feature description

More detailed explanation if needed."

# Push branch
git push origin feature/new-feature

# Create Pull Request
# - Link related issues
# - Describe changes
# - Include test results
```

### 7. Pull Request Guidelines

Before submitting a PR:
- [ ] Code follows project style
- [ ] All tests pass (`npm run test`)
- [ ] Lint passes (`npm run lint`)
- [ ] No console errors
- [ ] Documentation updated (if applicable)
- [ ] Commit messages are clear

PR Description Template:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Test addition

## Related Issues
Fixes #issue-number

## Testing
- [ ] Smoke tests pass
- [ ] Regression tests pass
- [ ] New tests added

## Checklist
- [ ] Code follows style guide
- [ ] Comments added for clarity
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Testing Best Practices

### 1. Test Naming
```
TC###: Should do X when Y is Z @tag1 @tag2
```

### 2. AAA Pattern (Arrange-Act-Assert)
```javascript
test('Should validate search', async () => {
  // Arrange
  const searchTerm = 'test';

  // Act
  await googlePage.search(searchTerm);
  const results = await googlePage.getSearchResults();

  // Assert
  expect(results.length).toBeGreaterThan(0);
});
```

### 3. Wait Strategies
```javascript
// Use built-in waits
await page.locator(selector).waitFor({ state: 'visible' });
await page.waitForLoadState('networkidle');

// Use custom wait helpers
await WaitHelpers.waitWithBackoff(fn, maxRetries);
```

### 4. Error Handling
```javascript
try {
  await pageObject.action();
} catch (error) {
  logger.error('Action failed', error);
  await pageObject.takeScreenshot('error-screenshot');
  throw error;
}
```

## Troubleshooting

### Tests Failing Locally

```bash
# Clear cache and reinstall
npm run clean
npm install
npm run install-deps

# Run in debug mode
npm run test:debug

# Run with UI
npm run test:ui

# Check logs
cat reports/logs/test-*.log
```

### Flaky Tests

1. Check wait conditions
2. Verify selectors are stable
3. Add explicit waits
4. Consider retry logic

### Linting Issues

```bash
# Auto-fix common issues
npm run lint:fix

# Format code
npm run format
```

## Documentation Standards

- Document all public methods with JSDoc
- Include parameter types and return types
- Add usage examples for complex methods
- Keep README.md updated
- Add comments for non-obvious code

## Reporting Issues

### Issue Template
```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node version
- OS
- Browser

## Logs
Include relevant logs or screenshots
```

## Performance Considerations

- Minimize wait times
- Use efficient selectors
- Avoid unnecessary page reloads
- Use data builders for test data
- Clean up resources properly

## Security Guidelines

- Never commit `.env` files with secrets
- Use `SecretsManager` for sensitive data
- Mask credentials in logs
- Validate input data
- Don't hardcode API keys

## Questions?

- Check existing documentation in `/docs`
- Review test examples in `/tests`
- Check utility implementations in `/src/utils`
- Open an issue for discussion

## Recognition

Contributors will be recognized in the project's CONTRIBUTORS.md file.

Thank you for contributing! 🙌

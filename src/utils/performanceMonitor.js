/**
 * Performance Monitor
 * Track and report performance metrics
 */

const { logger } = require('./logger');

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
  }

  async measurePageLoad(page, url) {
    const startTime = Date.now();

    await page.goto(url);
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    this.metrics.pageLoadTime = loadTime;

    logger.info(`Page load time: ${loadTime}ms`);
    return loadTime;
  }

  async measureInteraction(fn, name) {
    const startTime = performance.now();

    await fn();

    const duration = performance.now() - startTime;
    this.metrics[name] = duration;

    logger.info(`${name} took ${duration.toFixed(2)}ms`);
    return duration;
  }

  async getCoreWebVitals(page) {
    return page.evaluate(() => {
      const vitals = {};

      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        vitals[entry.name] = entry.startTime;
      });

      return vitals;
    });
  }

  reportMetrics() {
    logger.info('=== Performance Metrics ===');
    Object.entries(this.metrics).forEach(([key, value]) => {
      logger.info(`${key}: ${value.toFixed(2)}ms`);
    });
  }
}

module.exports = { PerformanceMonitor };

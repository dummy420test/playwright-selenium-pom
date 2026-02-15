const fs = require('fs');
const path = require('path');

class JSONFailuresReporter {
  constructor() {
    this.failures = [];
  }

  onTestEnd(test, result) {
    if (result.status !== 'failed') {
      return;
    }

    const location = test.location || {};
    const error = result.error || null;

    this.failures.push({
      title: test.title,
      fullTitle: test.titlePath ? test.titlePath().join(' > ') : test.title,
      file: location.file || null,
      line: location.line || null,
      column: location.column || null,
      project: test.parent && test.parent.project ? test.parent.project().name : undefined,
      durationMs: result.duration,
      status: result.status,
      retry: result.retry,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : null,
    });
  }

  async onEnd() {
    const outputDir = path.join(process.cwd(), 'reports');
    const outputFile = path.join(outputDir, 'failures.json');

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
      outputFile,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          totalFailures: this.failures.length,
          failures: this.failures,
        },
        null,
        2
      )
    );
  }
}

module.exports = JSONFailuresReporter;

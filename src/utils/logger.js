/**
 * Logger Utility
 * Centralized logging for all test execution
 */

const fs = require('fs');
const path = require('path');

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  constructor(logLevel = 'INFO') {
    this.logLevel = LOG_LEVELS[logLevel];
    this.logDir = path.join(__dirname, '../../reports/logs');
    this.ensureLogDirectory();
    this.logFile = path.join(this.logDir, `test-${new Date().toISOString().split('T')[0]}.log`);
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    const correlationId = process.env.CORRELATION_ID || 'N/A';
    return `[${timestamp}] [${level}] [${correlationId}] ${message}`;
  }

  write(formattedMessage, level) {
    const colors = {
      DEBUG: '\x1b[36m',
      INFO: '\x1b[32m',
      WARN: '\x1b[33m',
      ERROR: '\x1b[31m',
      RESET: '\x1b[0m',
    };

    console.log(`${colors[level]}${formattedMessage}${colors.RESET}`);
    fs.appendFileSync(this.logFile, formattedMessage + '\n');
  }

  debug(message) {
    if (this.logLevel <= LOG_LEVELS.DEBUG) {
      this.write(this.formatMessage('DEBUG', message), 'DEBUG');
    }
  }

  info(message) {
    if (this.logLevel <= LOG_LEVELS.INFO) {
      this.write(this.formatMessage('INFO', message), 'INFO');
    }
  }

  warn(message) {
    if (this.logLevel <= LOG_LEVELS.WARN) {
      this.write(this.formatMessage('WARN', message), 'WARN');
    }
  }

  error(message, error = null) {
    if (this.logLevel <= LOG_LEVELS.ERROR) {
      let fullMessage = message;
      if (error) {
        fullMessage += `\n${error.stack}`;
      }
      this.write(this.formatMessage('ERROR', fullMessage), 'ERROR');
    }
  }

  startTest(testName) {
    this.info(`\n${'='.repeat(80)}`);
    this.info(`TEST START: ${testName}`);
    this.info(`${'='.repeat(80)}\n`);
  }

  endTest(testName, result) {
    this.info(`\n${'='.repeat(80)}`);
    this.info(`TEST END: ${testName} - ${result}`);
    this.info(`${'='.repeat(80)}\n`);
  }
}

const logger = new Logger(process.env.LOG_LEVEL || 'INFO');

module.exports = { logger, Logger };

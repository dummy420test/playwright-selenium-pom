/**
 * Test Data Builder
 * Factory for creating test data objects
 */

class SearchDataBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.data = {
      term: 'test',
      filters: [],
      locale: 'en-US',
    };
    return this;
  }

  withSearchTerm(term) {
    this.data.term = term;
    return this;
  }

  withFilters(filters) {
    this.data.filters = filters;
    return this;
  }

  withLocale(locale) {
    this.data.locale = locale;
    return this;
  }

  buildValid() {
    return {
      term: 'Playwright JavaScript Testing',
      filters: ['recent', 'news'],
      locale: 'en-US',
    };
  }

  buildInvalid() {
    return {
      term: '!!!###@@@',
      filters: [],
      locale: 'xx-XX',
    };
  }

  buildEdgeCase() {
    return {
      term: 'a',
      filters: [],
      locale: 'en-US',
    };
  }

  build() {
    return this.data;
  }
}

class UserDataBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.data = {
      username: `user_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'SecurePassword123!',
    };
    return this;
  }

  withUsername(username) {
    this.data.username = username;
    return this;
  }

  withEmail(email) {
    this.data.email = email;
    return this;
  }

  build() {
    return this.data;
  }
}

module.exports = {
  SearchDataBuilder,
  UserDataBuilder,
};

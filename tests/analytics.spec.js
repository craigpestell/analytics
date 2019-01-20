import Analytics from '../src/analytics';

import analyticsConfig from './analytics.config';

describe('Analytics', () => {
  beforeEach(() => {
    loadFixtures('main.html'); // fixtures/html/main.html becomes your DOM
    data = getJSONFixture('analytics.json');
  });

  it('should have Analytics module', () => {
    expect(typeof Analytics).toEqual("function");
  });
});

describe('Analytics tags with no configuration', () => {
  beforeEach(() => {
    loadFixtures('main.html'); // fixtures/html/main.html becomes your DOM
    data = getJSONFixture('analytics.json');
  });

  it('should instantiate Analytics object with no parameters', () => {
    const analytics = new Analytics();
    expect(typeof analytics).toEqual("object");   
    expect(typeof analytics.bootstrapAnalyticsTagging).toEqual("function");
  })


});

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

describe('Analytics instantiated with no configuration', () => {
  let analytics;
  beforeEach(() => {
    loadFixtures('main.html'); // fixtures/html/main.html becomes your DOM
    data = getJSONFixture('analytics.json');
    analytics = new Analytics();
  });

  it('should return Analytics module with addEventListeners method', () => {
    expect(typeof analytics).toEqual("object");
    expect(typeof analytics.addEventListeners).toEqual("function");
  })

  describe('addEventListeners for default Analytics configuration', () => {
    it('called with no parameters should add default event listeners', () => {

      const fireTagSpy = spyOn(Analytics.prototype, 'fireTag');

      analytics.addEventListeners();    
      const html = document.querySelector('html');
      
      expect(html.analytics).toBeDefined();
      expect(fireTagSpy).toHaveBeenCalled();
      console.log('analytics: ', html.analytics);
      console.log('fireTagSpy: ', fireTagSpy);
    });
  
  })
  
});


import { AnalyticsBootstrap } from '../src/analytics';

import analyticsConfig from './analytics.config';

describe('analytics', () => {
  let data;

  beforeEach(() => {
    loadFixtures('main.html'); // fixtures/html/main.html becomes your DOM
    data = getJSONFixture('analytics.json');
  });

  it('should have tests', () => {
    const AB = AnalyticsBootstrap(analyticsConfig);

    expect(data).toEqual({ foo: 'bar', abc: 'xyz' });
  });

  it('should be a function', () => {
    expect(typeof AnalyticsBootstrap).toBe("function");
  });

  it('should return a module when invoked', () => {
    expect(typeof AnalyticsBootstrap()).toEqual("object");
  });

  it('should have bootstrapAnalyticsTagging method', () => {
    expect (typeof AnalyticsBootstrap().bootstrapAnalyticsTagging).toEqual("function");
  });

  it('should add event listeners..', () => {
    const AB = AnalyticsBootstrap(analyticsConfig);

    function getAnalyticsData(config) {
    
      if( typeof config === "function") {
        return config;
      }
  
      if(config.product){
        if( typeof config.product === "function") {
          return config.product;
        }
    
        /*const { product } = config.data;
  
  
        const data = Promise.all(
          product.map(async(i) => await( await fetch(`https://www.macys.com/xapi/discover/v1/product?productIds=${i}&_application=SITE&_deviceType=DESKTOP&_shoppingMode=SITE&_regionCode=US&currencyCode=USD&_customerState=GUEST&clientId=QV`)).json())
        );
        return data;*/
      }
  
      return new Promise(() => {return null});
    }
  
    AB.bootstrapAnalyticsTagging(getAnalyticsData);
  
  })


  it('might have async tests', (done) => {
    Promise.resolve('foobar').then((result) => {
      expect(result).toBe('foobar');
      done();
    });
  });
})

describe('bootstrapAnalytics', () => {
  let AB;
  beforeEach(() => {
    AB = undefined;
  });

  it('should fire page view tag', (done) => {
    
    AB = AnalyticsBootstrap(analyticsConfig);
    
    spyOn(AB, 'fireTag');
    
    AB.bootstrapAnalyticsTagging();

    setTimeout(() => {
      expect(AB.fireTag).toHaveBeenCalledWith(['view', {}])
      done();
    }, 1000)
    
  });

})
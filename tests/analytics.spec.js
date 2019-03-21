import { Analytics } from '../src/analytics';
import TagManagerUtil from '@component/common/src/util/TagManagerUtil';
import ExperimentSDK from '@component/experiment';

import analyticsConfig from './analytics.config';

describe('Analytics', () => {
  beforeEach(() => {
    loadFixtures('main.html'); // fixtures/html/main.html becomes your DOM
    data = getJSONFixture('analytics.json');
  });

  it('should have Analytics module', () => {
    expect(typeof Analytics).toEqual('function');
  });

  describe('Analytics instantiated with no configuration', () => {
    let analytics;
    beforeEach(() => {
      loadFixtures('main.html'); // fixtures/html/main.html becomes your DOM
      data = getJSONFixture('analytics.json');
      analytics = new Analytics();
    });
  
    it('should return Analytics module with addEventListeners method', () => {
      expect(typeof analytics).toEqual('object');
      expect(typeof analytics.addEventListeners).toEqual('function');
    });
  });
});


describe('addEventListeners for default Analytics configuration', () => {
  let analytics, html, prodLinks, tagSpy, recipes;
  
  beforeEach((done) => {
    spyOnProperty(Analytics,'navigateToHref').and.returnValue(false);
    loadFixtures('main.html'); // fixtures/html/main.html becomes your DOM
    
    // recipes = getJSONFixture('recipes.json');
    // setup recipes testing
    recipes = require('./fixtures/json/recipes.json').recipes;
    spyOn(ExperimentSDK, 'getAllSelectedRecipes').and.returnValue(new Promise((resolve)=>{resolve(recipes)}));


    html = document.querySelector('html');
    prodLinks = document.querySelectorAll('a[data-hl-productid]')
    tagSpy = spyOn(TagManagerUtil, 'fireTag');
    analytics = new Analytics();
    const y = analytics.addEventListeners().then((h) => {
      console.log('h:::::', h);
    }).then((pageView) => {
      
    });    
    
    console.log('yyyyyyy:::', y)
    y.then((a) =>{
      console.log('a:', a);
      done();
    })
  });

  it('should fire a page view tag', () => {
    expect(tagSpy.calls.count()).toEqual(1);
    const data = tagSpy.calls.mostRecent().args[1];
    console.log('####$$$$$$data:', data['_analytics'][0].recipes);

    // expect(tagSpy.calls.mostRecent().args).toEqual(['view', {_analytics: [{event_name: 'page view', recipes: []}]}])
  });

  it('page view tag should resolve with recipe data.', () => {
    const data = tagSpy.calls.mostRecent().args[1];
    const pageRecipes = data['_analytics'][0].recipes
    console.log('####$$$$$$data:', data['_analytics'][0].recipes);
    console.log('recipes fixture:', recipes);
    
    expect(pageRecipes).toEqual(recipes);
  });

  it('should attach product link tags', () => {
    expect(prodLinks.length).toEqual(2);
    // expect(prodLinks[0].analytics).toBeDefined();
  })


  it('should fire Analytics function on click, passing href data', (done) => {
    const link = prodLinks[0];
    link.click();

    setTimeout(() => {
      expect(tagSpy.calls.count()).toEqual(2);

      expect(tagSpy.calls.mostRecent().args).toEqual(['link', {_analytics: [link]}])
      
      const link2 = prodLinks[1];
      link2.click();
      setTimeout(() => {
        expect(tagSpy.calls.count()).toEqual(3);
        
        expect(tagSpy.calls.mostRecent().args).toEqual(['link', {_analytics: [link2]}])
        done();
      }, 100);
    }, 100);
  });  
  

  
});


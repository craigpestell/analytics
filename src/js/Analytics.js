import { validate, ParameterValidationError } from 'parameter-validator';
import TagManagerUtil from '@component/common/src/util/TagManagerUtil';
import defaultConfig from './config/config.default';
import AnalyticsService from './AnalyticsService';

/*
// tag configuration
{
  selector: 'a, img, picture',
  events: {
    link: {},
    impression: {}
  },
  data: {
    generic: (e) => ( new Promise((resolve)=> {
      resolve({
        data: 'some generic data'})
      })),
    linkData: (e) => {
      let data = new Promise((resolve) => {resolve({href: undefined})});

      const closestHref = e.target.closest('a');
      if(closestHref){
        data = new Promise((resolve) => {resolve({href: closestHref})});
      }

      return data;
    }
  }
},

*/

/** 
 * Analytics
 * This class is used to add Analytics tracking events.
 */
class Analytics {
  /**
   * Create an analytics object.
   * @param {Object} [options=defaultConfig] Tag configuration.
   * @param {Array} [options.tagMeta] Tag configurations per CSS selector.
   */
  constructor(options = defaultConfig) {
    const config = options;
    if (config) {
      Object.assign(config, defaultConfig);
    }
    Analytics.validateTagMeta(config.tagMeta);

    this.tagMeta = config.tagMeta;

    this.defaultAnalyticsDataMap = this.defaultAnalyticsDataMap.bind(this);

    const observedEvent = new Event('observed');

    this.intersectionObserver = new IntersectionObserver((entries) => {
      // If intersectionRatio is 0, the element is out of view
      // and we do not need to do anything.
      if (entries[0].intersectionRatio <= 0) {
        return;
      }
      entries[0].target.dispatchEvent(observedEvent);
    });
  }

  /**
   * Fire the analytics tag.
   * 
   * @param {('view'|'link')} type - type of tag to fire.
   * @param {Object} data - Data to send to Analytics vendor library.
   */
  static fireTag(type, data) {
    console.log(`#### ANALYTICS: firing "${type}" tag with data:`, data);
    TagManagerUtil.fireTag(type, data);
  }

  /**
   * Add a tag configuration. This can be called to add subsequent configurations after an initial bootstrap,
   * or to add a tag after instantiating a view client-side.
   * 
   * @param {Object} config - Tag configuration.
   */
  addTag(config) {
    const { selector, events } = Analytics.validateTagConfig(config); // eslint-disable-line no-unused-vars
    this.tagMeta.push(config);
  }

  /**
   * DOMElements matched by configuration CSS selectors.
   * 
   * @returns {Set<DOMElement>} Elements tagged, matched by CSS selectors in config.
   */
  get taggedElements() {
    let elList = [];
    this.tagMeta.forEach((item) => {
      const thisElList = (item.selectorIsId) ? [document.getElementById(item.selector)] : document.querySelectorAll(item.selector);
      const elListArr = Array.from(thisElList);
      if (thisElList && elListArr.length) {
        elList = elList.length ? elList.concat(elListArr) : elListArr;
      }
    });

    const filtered = elList.filter(el => el != null);
    return new Set(filtered);
  }

  /**
   * Handler used to fetch data for Analytics entity.  Can be overwritten by configuration.
   * @param {Object} entity - entity to fetch data for. 
   */
  defaultAnalyticsDataMap(entity) {
    
    if(AnalyticsService[entity.name]) {
      return AnalyticsService[entity.name](); 
    }
    const defaultHandler = (e) => {
      const data = { event_name: 'generic' };
      return new Promise((resolve) => { resolve(Object.assign(e.currentTarget.analytics, data)); });
    };

    // default page entity handler.
    if (entity.name === 'page') {
      // fetch page data from xapi response.
      return this.tagMeta[0].data.page(); // hack!!!
    }

    /* if (entity.name === 'experiment') {
      //ExperimentSDK.getAllSelectedRecipes().always( function ( recipes ) { 
      return new Promise((resolve) => {
        ExperimentSDK.getAllSelectedRecipes().always(function (recipes) {
          resolve(recipes);
        });
      })
    } */

    // default product entity handler.
    if (entity.name === 'product') {
      const fetchProduct = (e) => {
        const prodId = e.currentTarget.dataset.hlProductid;
        // const url = `https://www.macys.com/xapi/discover/v1/product?productIds=${prodId}&id=3536&_application=SITE&_navigationType=BROWSE&_deviceType=DESKTOP&_shoppingMode=SITE&_regionCode=US&_customerExperiment=271-11,291-21,311-20&currencyCode=USD&_customerState=GUEST&clientId=QV`;
        // return new Promise((resolve) => {resolve(fetch(url))});
        return new Promise((resolve) => { resolve({ product_id: prodId }); });
      };
      return fetchProduct;
    }
    
    return defaultHandler;
  };

  /**
   * spyOn().and.returnValue(false) in tests to not redirect browser during debugging.
   */
  static get navigateToHref() { return true; }

  static getClickEventTagListener(config) {
    return function clickListener(e) {
      let navigateToHref = false;
      if (e.currentTarget.href) {
        e.preventDefault(); // don't allow address location change until tags fire.
        navigateToHref = Analytics.navigateToHref;
      }

      async function fetchAnalytics(fetchDataPromises) {
        const result = [];
        for (let i = 0; i < fetchDataPromises.length; i++) {
          const r = await fetchDataPromises[i](e);
          result.push(r);
        }
        return { _analytics: result };
      }

      fetchAnalytics(Object.values(config.data || {})).then((result) => {
        Analytics.fireTag('link', result);
        if (navigateToHref) {
          window.location.href = e.target.closest('a').href;
        }
        return true;
      }, (reason) => {
        console.error('Analytics data fetch failed.  Rejection reason: ', reason);
      });
    }
  };

  static getImpressionEventTagListener(config) {
    return (e) => {
      async function fetchAnalytics(fetchDataPromises) {
        const result = [];
        for (let i = 0; i < fetchDataPromises.length; i++) {
          const r = await fetchDataPromises[i](e);
          result.push(r);
        }
        return { _analytics: result };
      }

      fetchAnalytics(Object.values(config.data || {})).then((result) => {
        result._analytics.impression = true;
        Analytics.fireTag('link', result);
        window.location.href = e.target.closest('a').href;
      }, (reason) => {
        console.error('Analytics data fetch failed.  Rejection reason: ', reason);
      });
    }
  };

  /** 
   * Validate individual tag configuration.
   * 
   * @param {Object} config - The tag configuration to validate.
   * @param {string} config.selector - CSS selector to query DOMElements to apply tag configuration. 
   * @param {Object} config.events - Events to trigger tag.
   * @param {anything} [config.events.view] - If defined, tag will trigger when DOMElements queried in 
   *                                        selector are viewed - this may happen server or client-side.
   * @param {anything} [config.events.link] - If defined, tag will be triggered on 'click' event.
   * @param {anything} [config.events.impression] - If defined, tag will be triggered when viewed. TODO : - merge with 'view' event - only top-most tagged element will have view event in adobe.
   * 
   * @throws {ParameterValidationError} Error for invalid configuration options.
   * 
   * @returns {?Object} validated configuration
   */
  static validateTagConfig(config) {
    try {
      // Each config must have a css selector ('html' for page, 'a' for all anchors, etc) and an events object.

      return { selector, events } = validate(config, ['selector', 'events']);
    } catch (error) {
      if (error instanceof ParameterValidationError) {
        console.log(error.message);
        // "Invalid value of 'undefined' was provided for parameter 'age'."
      }
    }
  };

  /**
   * Validate analytics config array.
   * @param {?Array} tagMeta - Array of tag configurations to validate.
   * @returns {boolean} - true if tagMeta configuration is valid, false otherwise.
   */
  static validateTagMeta(tagMeta) {
    if (!tagMeta) {
      return false;
    }
    tagMeta.forEach((config) => {
      Analytics.validateTagConfig(config);
    });
    return true;
  };

  addEventListeners(analyticsDataMap) {
    // const getAnalyticsDataForElement = (dataHashMap) => (Promise.all(dataHashMap.map((p) => (resolvedDataMap(p)))))
    async function getAnalyticsDataForElement (dataHashMap) {
      console.log('dataHashMap:', dataHashMap);
      let d = await Promise.all(Object.keys(dataHashMap).map((entity) => {
        return { [entity]: analyticsDataMap(dataHashMap[entity]) || this.defaultAnalyticsDataMap(dataHashMap[entity])}
      }))
      console.log('d: ', d);
      return d;
    }


    const fireViewEventTag = (config) => {

      let { data = {} } = config;

      const viewTagPromise = getAnalyticsDataForElement(data).then((result) => {
        let utagData = {}; // TODO: maybe add static defaults?
        Object.assign(utagData, result);
        Analytics.fireTag('view', { _analytics: utagData });
      }, (reason) => {
        console.error('rejection reason: ', reason);
      });

      return viewTagPromise;

    };

    this.tagMeta.forEach((item) => {
      const applicableElements = (item.selectorIsId) ? [document.getElementById(item.selector)] : document.querySelectorAll(item.selector);
      const filteredEls = Array.from(applicableElements).filter(el => el != null);
      filteredEls.forEach((el) => {
        if (el.analytics) {
          if (el.analytics.events) {
            Object.assign(el.analytics.events, item.events);
          } else {
            el.anaytics.events = item.events;
          }
          if (el.analytics.data) {
            Object.assign(el.analytics.data, item.data);
          } else {
            el.analytics.data = item.data;
          }
        } else {
          el.analytics = item;
        }
      });
    });



    let viewTag = undefined;

    this.taggedElements.forEach((el) => {
      if (!el.analytics || !el.analytics.events) {
        return;
      }
      const { events } = el.analytics;

      if (events.view) {
        viewTag = fireViewEventTag(el.analytics);
      }

      if (events.link) {
        const clickListener = Analytics.getClickEventTagListener(el.analytics);
        el.addEventListener('click', clickListener);
      }

      if (events.impression) {
        const impressionListener = Analytics.getImpressionEventTagListener(el.analytics);
        el.addEventListener('observed', impressionListener);
        this.intersectionObserver.observe(el);
      }
    });

    console.log('viewTag: ', viewTag);

    return viewTag || new Promise((resolve) => { resolve(true) });
  }
}

export default Analytics;

import Analytics from 'analytics';

// import pubsub from '@component/common/src/util/PublishSubscribe';

import TagDataPlugin from './analytics-plugin-tag-data';
import TagManagerPlugin from './analytics-plugin-tag-manager';
import { validate, ParameterValidationError } from 'parameter-validator';
import Promise from 'prfun'; // subclasses global.Promise

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

// dataMap

*/

const EVENTS = {view: undefined, link: undefined};

/** 
 * Analytics
 * This class is used to add Analytics tracking events.
 */
export default class AnalyticsController {
  /**
   * Create an analytics object.
   * @param {Object} [options=defaultConfig] Tag configuration.
   * @param {Array} [options.tagMeta] Tag configurations per CSS selector.
   */
  constructor(options = {}) {
    let config = options;
    if (options && options.tagMeta) {
      config.tagMeta = defaultConfig.tagMeta.concat(config.tagMeta);
    }else{
      config = defaultConfig;
    }

    // Must provide channel
    try {
      const { channel } = validate(options, ['channel']);
    } catch (error) {
      if (error instanceof ParameterValidationError) {
        console.error(error.message);
        // "Invalid value of 'undefined' was provided for parameter 'options.channel'."
        return false;
      }
    }

    AnalyticsController.validateTagMeta(config.tagMeta);

    this.pubsubChannel = config.pubsubChannel || null;
    this.tagMeta = config.tagMeta;

    if(options.dataMap){
      this.dataMap =  options.dataMap;
    }
    this.defaultAnalyticsDataMap = this.defaultAnalyticsDataMap.bind(this);
    this.addEventListeners = this.addEventListeners.bind(this);
    this.getClickEventTagListener = this.getClickEventTagListener.bind(this);
    this.getImpressionEventTagListener = this.getImpressionEventTagListener.bind(this);

    const observedEvent = new Event('observed');

    this.intersectionObserver = new IntersectionObserver((entries) => {
      // If intersectionRatio is 0, the element is out of view
      // and we do not need to do anything.
      if (entries[0].intersectionRatio <= 0) {
        return;
      }
      entries[0].target.dispatchEvent(observedEvent);
    });

    this.initAnalytics({debug: true, channel: options.channel});
    
  }

  initAnalytics(options = {debug: false}) {
    this.analytics = Analytics({
      debug: options.debug,
      exposeRedux: true,
      app: 'digital-analytics',
      version: 100,
      plugins: [
        TagManagerPlugin({
          env: 'dev', 
          brand: options.brand || 'bcom'
        }),
        TagDataPlugin
      ]
    })

    // set up app channel pubsub communication with analytics pubsub
    options.channel.on('analytics:add-tag', (tag) => {
      this.analytics.dispatch({type: 'analytics:add-tag', tag});
      this.addEventListeners();
    })
    options.channel.on('analytics::*', (data) => {
      
      console.log('app channel received analytics generic data: ' ,data);
      this.analytics.dispatch({type: 'analytics::*', data});
    });

    if(options.debugListeners || options.debug) {
      this.analytics.on(options.debugListeners || '*', ({ payload }) => {
        // console.log(`* listener ${payload.type} with payload: ${JSON.stringify(payload.properties, null, '\t')}`)
        console.log(`* listener ${payload.type}`)
      })
    }

    /* this.analytics.on('analytics::configuration', (config) => {
      console.log('$$$$$$$$$$$$$ adding tag: ', config);
      this.addTag(config);
    }) */
    
    this.analytics.on('initializeStart', () => {
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$   initializeStart event');
      this.analytics.dispatch({type: 'analytics::configuration', payload: config});
    });
    
    this.analytics.on('analytics::*', ({payload}) => {
      console.log(`########## analytics::* listener ${payload.type}`);
    });

    this.analytics.on('analytics:add-tag', ({payload}) => {
      this.addTag(payload.tag);
    })
    
  }

  /**
   * Add a tag configuration. This can be called to add subsequent configurations after an initial bootstrap,
   * or to add a tag after instantiating a view client-side.
   * 
   * @param {Object} config - Tag configuration.
   */
  addTag(config) {
    const { selector, events } = AnalyticsController.validateTagConfig(config); // eslint-disable-line no-unused-vars
    this.tagMeta.push(config);
    this.analytics.dispatch({type: 'analytics::configuration', payload: config});
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

  fetchDataMap (e) {
      /*let combinedDataHashMap = {};
      Object.entries(dataHashMap).map((entry) => {
        const entity = entry[0];
        combinedDataHashMap[entity] = analyticsDataMap && (typeof analyticsDataMap[entity]!== "undefined")
            && analyticsDataMap(dataHashMap[entity]) || this.defaultAnalyticsDataMap(dataHashMap[entity])
      });*/
      const dataMap = e && e.currentTarget && e.currentTarget.analytics && e.currentTarget.analytics.data || e;
      Object.entries(dataMap).forEach((entry) => {
        if(!entry[1]) {
          dataMap[entry[0]] = AnalyticsService[entry[0]] && AnalyticsService[entry[0]](e);
        }else if(!(dataMap[entry[0]] instanceof Promise)){
          dataMap[entry[0]] = dataMap[entry[0]](e);
        }
      })
      return Promise.props(dataMap)
    }

  /**
   * spyOn().and.returnValue(false) in tests to not redirect browser during debugging.
   */
  static get navigateToHref() { return true; }

  getClickEventTagListener(config) {
    const trackLink = this.analytics.track;

    return function clickListener(e) {
      let navigateToHref = false;
      if (e.currentTarget.href) {
        e.preventDefault(); // don't allow address location change until tags fire.
        navigateToHref = AnalyticsController.navigateToHref;
      }

      async function fetchAnalytics(fetchDataPromises) {
        const result = [];
        for (let i = 0; i < fetchDataPromises.length; i++) {
          const r = await fetchDataPromises[i](e);
          result.push(r);
        }
        return result;
      }

      fetchAnalytics(Object.values(config.data || {})).then((result) => {
        trackLink(e.target.tagName + 'click', result);
        // AnalyticsController.fireTag('link', result);
        if (navigateToHref) {
          window.location.href = e.target.closest('a').href;
        }
        return true;
      }, (reason) => {
        console.error('Analytics data fetch failed.  Rejection reason: ', reason);
      });
    }
  };
  
  getImpressionEventTagListener(config) {
    const trackImpression = this.analytics.track;
    
    function impressionListener (e) {
      let { data = {} } = config;
      this.fetchDataMap(e).then((result) => {
        let utagData = {}; // TODO: maybe add static defaults?
        Object.assign(utagData, result);
        trackImpression('impression', utagData);
      }, (reason) => {
        console.error('rejection reason: ', reason);
      });
    }
    impressionListener = impressionListener.bind(this);
    return impressionListener;
  };

  /*
  getImpressionEventTagListener(config) {
    const trackImpression = this.analytics.track;
    return (e) => {
      async function fetchAnalytics(fetchDataPromises) {
        const result = [];
        for (let i = 0; i < fetchDataPromises.length; i++) {
          const r = await fetchDataPromises[i](e);
          result.push(r);
        }
        return result;
      }

      fetchAnalytics(Object.values(config.data || {})).then((result) => {
        
        trackImpression('impression......', result);

      }, (reason) => {
        console.error('Analytics data fetch failed.  Rejection reason: ', reason);
      });
    }
  };

   */

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
      AnalyticsController.validateTagConfig(config);
    });
    return true;
  };

  addEventListeners(analyticsDataMap) {
    // const fetchDataMap = (dataHashMap) => (Promise.all(dataHashMap.map((p) => (resolvedDataMap(p)))))
    const trackPage = this.analytics.page;
    
    const fireViewEventTag = (config) => {
      let { data = {} } = config;

      const viewTagPromise = this.fetchDataMap(data).then((result) => {
        let utagData = {}; // TODO: maybe add static defaults?
        Object.assign(utagData, result);
        trackPage(utagData);
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
            el.analytics.events = item.events;
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

      if (events.view && !events.view.fired) {
        viewTag = fireViewEventTag(el.analytics);
        el.analytics.events.view.fired = true;
      }

      if (events.link) {
        const clickListener = this.getClickEventTagListener(el.analytics);
        el.addEventListener('click', clickListener);
        el.analytics.events.link.fired = true;
      }

      if (events.impression) {
        const impressionListener = this.getImpressionEventTagListener(el.analytics);
        el.addEventListener('observed', impressionListener);
        this.intersectionObserver.observe(el);
        el.analytics.events.impression.fired = true;
      }

      // register any custom events

      if(this.pubsubChannel){
        Object.keys(events).filter((event) => (!Object.keys(EVENTS).includes(event)))
        .forEach((e) => {
          // add custom event listener
          const eventLabel = `${e}`;
          console.log('adding customEvent ' + eventLabel);
          this.pubsubChannel.on(`analytics::${eventLabel}`, (data) => {

            console.log('passing data via app channel and calling analytics event: ', data);
            this.analytics.on(`analytics:custom-event::${eventLabel}`, ({ payload }) => {
              console.log(`analytics listener ${eventLabel} with payload: ${payload.type}`)
              //this.analytics.on(`analytics:custom-event::${eventLabel}`, ({ payload }) => {
              //  console.log(`analytics custom-event listener ${eventLabel} with payload: ${payload.type}`)
              //}) 
              
            })
            this.analytics.track(`analytics:custom-event::${eventLabel}`, {test: 'payload', data}) 
          })
        });
      }
    });

    this.analytics.on('analytics::configuration', (config) => {
      console.log('analytics::configuration event: ', config);

    })

    return viewTag || new Promise((resolve) => { resolve(true) });
  }
}

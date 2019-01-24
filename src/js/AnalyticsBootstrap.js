import TagManagerUtil from '@component/common/src/util/TagManagerUtil';

/**
 * Need to:
 * - allow bootstrapping with one function call (bootstrapAnalytics(config))
 * - allow additional bootstrapping of client-side loaded components (like modals) - (bootstrapAnalytics(additonalConfig))
 *
 *
 */


/**
 * config param object:
 * Array of configurations per DOMString selector:
 * [
 *  {
 *    selector: <DOMString>, // selector to match Elements
 *
 *    // Array of analytics events to track.  Each event is an object, with 'view', 'link', or 'impression' properties.
 *    // The value for each property is additional data to track per event type, which can be overwritten by subsequent configurations.
 *    events:
 *      {
 *        'view': {},  // fire a view tag for the element right away.
 *        'link': {},  // attach a link tag event handler on the element
 *        'impression': {}, // attach an impression event handler on the element.
 *      }
 *    ,
 *
 *    // The data to track. This configuration mapsAnalyticsBootstrapthe data to track with functions to retrieve the data.
 *    // Each property maps to the getAnalyticsDataAnalyticsBootstrapfunction parameter in bootstrapAnalyticsTagging
 *    data: {
 *      page: {}, // E.g.: pass 'page' data with thAnalyticsBootstrap tag.  The object can be extra data to pass, which may be overwritten.
 *      product: {}, // E.g.: pass 'product' data wAnalyticsBootstrapth the tag.  The object can be extra data to pass, which may be overwritten.
 *    }
 *  }
 * ]
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * AnalyticsBootstrap * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  A more concise example with multiple selectors:AnalyticsBootstrap
 * [
 *  {
 *    selector: 'body',
 *    events: [
 *      {
 *        view: {page_name: 'mcom homepage'}
 *      }
 *    ],
 *    data: {
 *      page: {}  // use to trigger analytics data handler function
 *    }
 *  },
 *  {
 *    selector: '.banner',
 *    events:
 *      {
 *        'link': {},
 *        'impression':  {},
 *      },
 *    ,
 *    data: { product: [12343, 443675, 884358] }
 *  },
 *
 *  // This config was added temporarily for a campaign (dynamically added to XAPI response), and will apply to a specific banner
 *  {
 *    selector: '.banner #calvin-klein-2856',
 *    events:
 *      {
 *        link: {event_name: 'CK campaign banner click jan 2019'},
 *        impression: {event_name: 'CK campaign banner view jan 2019'},
 *      }
 *    ,
 *    data: { campaign: [2856], product: [44367, 44368]},
 *  },
 *
 *  // The campaign data property for this configuration is a function to fetch data.  The event handler returns a Promise, which resolves with the data.
 *  {
 *    selector: '.banner #calvin-klein-special-banner-28997',
 *    events:
 *      link: {event_name: 'crazy sale thing', event_id: 28997}
 *    ,
 *    data: { campaign_special_data: () => {
 *      return fetch('https://macys.com/services/campaign/?id=28997')
 *      }
 *    }
 *  }
 * ]
 *
 * getAnalyticsData function defines how data is fetched for each data property assigned to an element.
 *
 * E.g.: config == { data: { product: [12343, 443675, 884358] } }
 * (config) =>{
 *
 *   const dataKeys = Object.keys(config.data);
 *   dataKeys.map((value, key) => {
 *     if(typeof value === "function") {
 *       return { [key]: value() };
 *     }
 *   })
 *   if(config.data.)
 *   if(config.data.product){
 *     return fetch(`https://macys.com/services/product?id=${config.data.product.join(',')}`)
 *   }
 * }
 *
 */

const observedEvent = new Event('observed');

const intersectionObserver = new IntersectionObserver((entries) => {
  // If intersectionRatio is 0, the element is out of view
  // and we do not need to do anything.
  if (entries[0].intersectionRatio <= 0) {
    return;
  }
  entries[0].target.dispatchEvent(observedEvent);
});

module.exports = function AnalyticsBootstrap(analyticsConfig) {
  this.analyticsConfig = analyticsConfig;

  const tagEvent = new CustomEvent('AnalyticsTag', {
    detail: {
      message: 'static msg',
      time: new Date(),
    },
    bubbles: false,
    cancelable: true,
  });


  function notNull(el) {
    return el != null;
  }

  function getAllTaggedElements(config) {
    let elList = [];
    config.elements.forEach((item) => {
      const thisElList = (item.selectorIsId) ? [document.getElementById(item.selector)] : document.querySelectorAll(item.selector);
      const elListArr = Array.from(thisElList);
      if (thisElList && elListArr.length) {
        elList = elList.length ? elList.concat(elListArr) : elListArr;
      }
    });
    console.log('elList:', elList);
    const filtered = elList.filter(notNull);
    return new Set(filtered);
  }

  this.fireTag = (type, data) => {
    TagManagerUtil.fireTag(type, data);
  };

  this.bootstrapAnalyticsTagging = (getAnalyticsData) => {
    this.tagData = {};

    function getAnalyticsDataForElement(dataConfig) {
      return Promise.all(Object.entries(dataConfig).map((entry) => {
        console.log('entry:', entry);
        return getAnalyticsData({ [entry[0]]: entry[1] });
      }));
      /* .then((results) => {
              let idx = 0;
              Object.keys(dataConfig).forEach((key) => {
                this.tagData[key] = results[idx++];
              });
              return this.tagData;
            }); */
    }

    function fireViewEventTag(config) {
      const { data = {} } = config;
      getAnalyticsDataForElement(data).then(
        (results) => {
          // results is an array
          console.log('Analytics tag firing with data:', results); // eslint-disable-line no-console
          console.log('this.fireTag: ', this.fireTag);
          this.fireTag('view', results);
        },
        (err) => {
          console.error('error:', err); // eslint-disable-line no-console
        },
      );
    }

    function getClickEventTagListener(config) {
      return (e) => {
        getAnalyticsDataForElement(config.data).then(
          (results) => {
            // results is an array
            console.log('Analytics tag firing for targe: ', e.target, ' with data:', results); // eslint-disable-line no-console
            this.fireTag('link', results);
          },
          (err) => {
            console.error('error:', err); // eslint-disable-line no-console
          },
        );
      };
    }

    function getImpressionEventTagListener(config) {
      return (e) => {
        getAnalyticsDataForElement(config.data).then(
          // fire link tag for observed element
          (results) => {
            results.impression = true;
            // results is an array
            console.log('target:', e.target, 'data:', results); // eslint-disable-line no-console
            this.fireTag('link', results);
          },
          (err) => {
            console.error('error:', err); // eslint-disable-line no-console
          },
        );
      };
    }

    // Aggregate analytics configuration from xapi response and attach to related element.
    analyticsConfig.elements.forEach((item) => {
      const applicableElements = (item.selectorIsId) ? [document.getElementById(item.selector)] : document.querySelectorAll(item.selector);
      const filteredEls = Array.from(applicableElements).filter(notNull);
      filteredEls.forEach((el) => {
        if (el.analytics) {
          el.analytics = Object.assign(item, el.analytics);
        } else {
          el.analytics = item;
        }
      });
    });


    const analyticsTagEventListener = (e) => {
      console.log('AnalyticsTag listener currentTarget:', e.currentTarget);
      const data = e.detail && e.detail.data || {};
      console.log('e.detail: ', e.detail);
      if (e.currentTarget.analytics) {
        Object.assign(e.currentTarget.analytics.data, data);
      } else {
        e.currentTarget.analytics = { data };
      }

      if (e.target.tagName === 'HTML') {
        // Analytics event has bubbled-up to top.
      } else {
        // keep bubbling, passing async data
      }
      return true;
    };
    document.documentElement.addEventListener('AnalyticsTag', analyticsTagEventListener);

    const taggedElements = getAllTaggedElements(analyticsConfig);

    // For all elements with analytics configuration, attach event fetchPromises or fire view tag.
    taggedElements.forEach((el) => {
      if (!el.analytics || !el.analytics.events) {
        return;
      }
      const { events } = el.analytics;

      if (events.view) {
        fireViewEventTag(el.analytics);
      }

      if (events.link) {
        // let p = Promise.resolve(true);

        const clickListener = getClickEventTagListener(el.analytics);


        el.addEventListener('AnalyticsTag', analyticsTagEventListener);

        el.addEventListener('click', (e) => {
          e.preventDefault(); // for testing
          async function fetchAnalytics(fetchDataPromises) {
            console.log('fetchDataPromises:', fetchDataPromises);
            const results = [];
            for (let i = 0; i < fetchDataPromises.length; i++) {
              const r = await fetchDataPromises[i](e);
              results.push(r);
            }
            console.log('results:', results);
            return results;
          }

          fetchAnalytics(Object.values(el.analytics.data)).then((result) => {
            console.log('result: ', result);
          }, (reason) => {
            console.log('rejection reason: ', reason);
          });
        });
      }

      if (events.impression) {
        const impressionListener = getImpressionEventTagListener(el.analytics);
        el.addEventListener('observed', impressionListener);
        intersectionObserver.observe(el);
      }
    });
  };

  return {
    fireTag: this.fireTag,
    bootstrapAnalyticsTagging: this.bootstrapAnalyticsTagging,
  };
};

/** **********************************************************
 *  getDataForAnalytics - function to be created for each XAPI endpoint
 *                to map analytics config to XAPI data
 * */

/*
    function getDataForAnalytics(dataNode) {

    let xapiData = Promise.resolve({});

    if(dataNode === 'page'){
      xapiData = Promise.resolve({title: 'Search & Browse...'})
    }

    if(dataNode === 'product'){
      xapiData = Promise.resolve({productId: 12345, id: 12345, name: "some test product"})
    }

    if(dataNode === 'asyncTest') {
      xapiData = fetch('https://jsonplaceholder.typicode.com/todos/1')
    }

    return Promise.resolve(xapiData);
  }


// initialize bootstrapper
    const analyticsBootstrap = AnalyticsBootstrap(PageApp);
// attach events
    analyticsBootstrap.bootstrapAnalyticsTagging(getDataForAnalytics);

*/
/** ******* END New Analytics Tracking  ********************** */

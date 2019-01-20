'use strict';


import { validate, ParameterValidationError } from 'parameter-validator';
import TagManagerUtil from '@component/common/src/util/TagManagerUtil';

import defaultConfig from './config/config.default.js'
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

class Analytics {
    constructor(options = defaultConfig){
        let config = options;
        if(config){
            Object.assign(config, defaultConfig);
        }
        const {tagMeta} = config;
        
        Analytics.prototype.validateTagMeta(config.tagMeta);
        
        this.tagMeta = config.tagMeta;

        this.getFetchHandlerForAnalyticsEntity = this.getFetchHandlerForAnalyticsEntity.bind(this);
        
        //Get all DOM elements specified in config, aggregate and assign all config options to elements.
    }

    addTag(config){
        this.validateTagConfig(config);
        let { selector, events } = Analytics.prototype.validateTagConfig(config);
        
        this.tagMeta.push(config);
    }
        
    // each DOMElement matched by a selector & containing an event.
    get taggedElements() {
        let elList = [];
        this.tagMeta.forEach((item) => {
            console.log('item.selector: ', item.selector);
            const thisElList = (item.selectorIsId) ? [document.getElementById(item.selector)] : document.querySelectorAll(item.selector);
            const elListArr = Array.from(thisElList);
            if (thisElList && elListArr.length) {
                elList = elList.length ? elList.concat(elListArr) : elListArr;
            }
        });
        console.log('elList:', elList);
        const filtered = elList.filter(function notNull(el) {
                return el != null;
            });
        return new Set(filtered);
    }

    getFetchHandlerForAnalyticsEntity(entity) {

        const defaultHandler = (e) => {
            let data = {event_name: 'generic'}
            return new Promise((resolve) => {resolve(Object.assign(e.currentTarget.analytics, data))})
        };

        // default page entity handler.
        if ( entity.name == "page") {
            // fetch page data from xapi response.
            return this.tagMeta[0].data.page(); //hack!!!
        }

        // default product entity handler.
        if ( entity.name === "product") {
            const fetchProduct = (e) => {
                const prodId = e.currentTarget.dataset['hlProductid'];
                const url = `https://www.macys.com/xapi/discover/v1/product?productIds=${prodId}&id=3536&_application=SITE&_navigationType=BROWSE&_deviceType=DESKTOP&_shoppingMode=SITE&_regionCode=US&_customerExperiment=271-11,291-21,311-20&currencyCode=USD&_customerState=GUEST&clientId=QV`
                // return new Promise((resolve) => {resolve(fetch(url))}); 
                return new Promise((resolve) => {resolve({product_id: prodId})}); 
            }
        }
        return defaultHandler;
    }


    
    addEventListeners (getAnalyticsData){
        const fetchData = getAnalyticsData || this.getFetchHandlerForAnalyticsEntity;
        const getAnalyticsDataForElement = (dataConfig) => (Promise.all(dataConfig.map(
                (p) => {
                    return fetchData(p)
                }
            )));

        const fireViewEventTag = (config) => {
            const {data = {}} = config;
            getAnalyticsDataForElement(Object.values(config.data)).then((result) => {

                Analytics.prototype.fireTag('view', {_analytics: result});
            }, (reason) => {
                console.error('rejection reason: ', reason);
            })

        }

        const getClickEventTagListener = (config) => {

            return function clickListener(e) {

                let navigateToHref = false;
                if(e.currentTarget.href){
                    e.preventDefault() // for testing
                    navigateToHref = true;
                }

                
                
                async function fetchAnalytics(fetchDataPromises) {
                    let result = [];
                    for (let i = 0; i < fetchDataPromises.length; i++){
                        let r = await fetchDataPromises[i](e);
                        result.push(r);
                    }
                    return {_analytics: result};
                }

                fetchAnalytics(Object.values(config.data || {})).then((result) => {
                    Analytics.prototype.fireTag('link', result);
                    if( navigateToHref ) {
                        window.location.href = e.target.closest('a').href;
                    }
                    return true;
                }, (reason) => {
                    console.error('Analytics data fetch failed.  Rejection reason: ', reason);
                })

            };
        }

        function getImpressionEventTagListener(config) {
            return (e) => {
                async function fetchAnalytics(fetchDataPromises) {
                    let result = [];
                    for (let i = 0; i < fetchDataPromises.length; i++){
                        let r = await fetchDataPromises[i](e);
                        result.push(r);
                    }
                    return {_analytics: result};
                }

                fetchAnalytics(Object.values(config.data || {})).then((result) => {
                    result._analytics.impression = true;
                    Analytics.prototype.fireTag('link', result);
                    window.location.href = e.target.closest('a').href;
                }, (reason) => {
                    console.error('Analytics data fetch failed.  Rejection reason: ', reason);
                })

            };
        }
        
        this.tagMeta.forEach((item) => {
            const applicableElements = (item.selectorIsId) ? [document.getElementById(item.selector)] : document.querySelectorAll(item.selector);            
            const filteredEls = Array.from(applicableElements).filter(function notNull(el) {
                return el != null;
            });
            filteredEls.forEach((el) => {
                if (el.analytics) {
                    // Object.assign(el.analytics.data, item.data);
                    
                    if(el.analytics.events) {
                        Object.assign(el.analytics.events, item.events);
                    }else{
                        el.anaytics.events = item.events;
                    }
                    if(el.analytics.data) {
                        Object.assign(el.analytics.data, item.data);
                    }else{
                        el.analytics.data = item.data;
                    }
                } else {
                    el.analytics = item;
                }
            });
        });
    
        this.taggedElements.forEach((el) => {
            if (!el.analytics || !el.analytics.events) {
                return;
            }
            const { events } = el.analytics;

            if (events.view) {
                fireViewEventTag(el.analytics);
            }

            if (events.link) {
                const clickListener = getClickEventTagListener(el.analytics);
                console.log(clickListener);

                el.addEventListener('click', clickListener);
            }

            if (events.impression) {
                const impressionListener = getImpressionEventTagListener(el.analytics);
                el.addEventListener('observed', impressionListener);
                intersectionObserver.observe(el);
            }
        });
    };
}

Analytics.staticProperty = 'a static property';
Analytics.prototype.protoProperty = 'a prototype property';
Analytics.prototype.fireTag = (type, data) => {
    console.log(`#### ANALYTICS: firing "${type}" tag with data:`, data);
    TagManagerUtil.fireTag(type, data);
};

Analytics.prototype.validateTagConfig = (config) => {
    try {
        return { selector, events } = validate(config, [ 'selector', 'events' ]);
    } catch (error) {
        if (error instanceof ParameterValidationError) {
            console.log(error.message);
            // "Invalid value of 'undefined' was provided for parameter 'age'."
        }
    }
}

Analytics.prototype.validateTagMeta = (tagMeta) =>{

    if(!tagMeta) {
        return;
    }
    tagMeta.forEach((config) => {
        Analytics.prototype.validateTagConfig(config);        
    });
}

export default Analytics;
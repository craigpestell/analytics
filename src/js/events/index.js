import AnalyticsEvent from './AnalyticsEvent';
import QuickViewEvent from './QuickView';
import ProductThumbnailEvent from './ProductThumbnail';
import {EVENT_TYPE} from '../util/constants';
import DiscoveryPagesEvent from './DiscoveryPages';

export const ANALYTICS_EVENT = {
  //DOM events
  Element: {
    viewed: () => (new AnalyticsEvent ('EVENT.Element.viewed', EVENT_TYPE.view)),
    clicked: () => (new AnalyticsEvent ('EVENT.Element.clicked')),
    mousedOver: () =>(new AnalyticsEvent ('EVENT.Element.mousedOver')),
    redirected: () =>(new AnalyticsEvent ('EVENT.Element.redirected')),
  },

  // Generic Page view event.
  Page: {
    viewed: () =>(new AnalyticsEvent ('EVENT.Page.viewed', EVENT_TYPE.view)),
  },
  // Tailored Page events.
  DiscoveryPages: {
    viewed: (pageApp) => (new DiscoveryPagesEvent('viewed', EVENT_TYPE.view, pageApp))
  },

  // Generic Marionette events for features.
  View: {
    initialized: () => (new AnalyticsEvent ('EVENT.View.initialized', EVENT_TYPE.view)),
    viewed: () =>(new AnalyticsEvent ('EVENT.View.viewed', EVENT_TYPE.view)),
  },

  // E-commerce events
  ProductThumbnail: {
    viewed: () =>( new ProductThumbnailEvent ('viewed', EVENT_TYPE.view)),
    clicked: () =>(new ProductThumbnailEvent ('clicked')),
    fetchSuccess: () =>(new AnalyticsEvent ('EVENT.ProductThumbnail.fetchSuccess')),
    fetchFailed: () =>( new AnalyticsEvent ('EVENT.ProductThumbnail.fetchFailed')),
  },
  QuickView: {
    viewed: () =>( new QuickViewEvent ('viewed', EVENT_TYPE.view)),
    clicked: () =>( new QuickViewEvent ('clicked')),
    fetchSuccess: () =>(new AnalyticsEvent ('EVENT.QuickView.fetchSuccess')),
    fetchFailed: () =>( new AnalyticsEvent ('EVENT.QuickView.fetchFailed')),
  },
  Analytics: {
    initialized: () => (new AnalyticsEvent('EVENT.Analytics.initialized'), EVENT_TYPE.analytics)
  },
  Event: {
    added: () =>( new AnalyticsEvent ('EVENT.Analytics.added')),
    fetchDataMap: () =>( new AnalyticsEvent ('EVENT.Analytics.dataMapFetched')),
  },
};

export default ANALYTICS_EVENT;


// create hashmap lookup
let hashMap = {};
Object.entries(ANALYTICS_EVENT).forEach(([componentType, componentEvents]) => {
  Object.entries(componentEvents).forEach(([eventType, eventObj]) => {
    const hash = `EVENT.${componentType}.${eventType}`;
    hashMap[hash] = eventObj;

    
  })
});

export { hashMap as eventMap, AnalyticsEvent, QuickViewEvent, ProductThumbnailEvent};
import AnalyticsEvent from './AnalyticsEvent';
import { EVENT_TYPE } from '../util/constants';


export const ANALYTICS_EVENT = {
  // DOM events
  Element: {
    viewed: () => (new AnalyticsEvent('EVENT.Element.viewed', EVENT_TYPE.view)),
    clicked: () => (new AnalyticsEvent('EVENT.Element.clicked')),
    mousedOver: () => (new AnalyticsEvent('EVENT.Element.mousedOver')),
    redirected: () => (new AnalyticsEvent('EVENT.Element.redirected')),
  },

  // Generic Page view event.
  Page: {
    viewed: () => (new AnalyticsEvent('EVENT.Page.viewed', EVENT_TYPE.view)),
  },
  // Generic Marionette events for features.
  View: {
    initialized: () => (new AnalyticsEvent('EVENT.View.initialized', EVENT_TYPE.view)),
    viewed: () => (new AnalyticsEvent('EVENT.View.viewed', EVENT_TYPE.view)),
  },

  Analytics: {
    initialized: () => (new AnalyticsEvent('EVENT.Analytics.initialized'), EVENT_TYPE.analytics),
  },
  Event: {
    added: () => (new AnalyticsEvent('EVENT.Analytics.added')),
    fetchDataMap: () => (new AnalyticsEvent('EVENT.Analytics.dataMapFetched')),
  },
};

export default ANALYTICS_EVENT;
export { AnalyticsEvent };

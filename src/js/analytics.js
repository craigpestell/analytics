import Analytics from 'analytics';
import EventEmitter from 'events';

import ANALYTICS_EVENT from './events';
import { EVENT_TYPE } from './util/constants';
import * as mixins from './mixins';

import TagManagerPlugin from './plugins/tag-manager';

export { default as ANALYTICS_EVENT } from './events';
export * from './events';
export * from './util/constants';
export { default as AnalyticsMixins } from './mixins';
export { default as AnalyticsBehavior } from './AnalyticsBehavior';
export { default as AnalyticsService } from './AnalyticsService';


class AnalyticsController {
  constructor() {
    this._analytics = Analytics({
      app: 'macys-analytics',
      version: 100,
      // Change, add, or remove analytics vendors here (Adobe/Tealium/Google)
      plugins: [
        TagManagerPlugin({
          // TODO: read these values from .env
          env: 'dev',
          brand: 'mcom',
        }),
      ],
    });
    this._analytics.storage.removeItem('analyticsEvents');
    this._analytics.storage.removeItem('eventLog');
    this.getEvents = this.getEvents.bind(this);
    this.getLog = this.getLog.bind(this);
  }
  track(event, context) {
    return event.fetch(context)
      .then((data) => {
        this._analtytics.track(event.type, data);
        this.logEvent(event, data);
        return true;
      });
  }

  // TODO: this currently accepts an object hashmap but should also accept an array of events
  addEvents(events) {
    Object.entries(events).forEach(([key, event]) => {
      this.addEvent(event);
    });
  }
  addEvent(event) {
    // Add event to client-side storage
    /* let current = this._analytics.storage.getItem('analyticsEvents');

        if( !current ) {
            current = {
                [event.name]: event
            }
        }else{
            current[event.name] = event
        }
        this._analytics.storage.setItem('analyticsEvents', current) */

    // for now we'll trigger the 'viewed' events on document.ready
    if (event.type === EVENT_TYPE.view) {
      const trackView = () => {
        event.fetch()
          .then((data) => {
            this._analytics.track(event.type, data);
            this.logEvent(event, data);
          });
      };
      if (document.readyState === 'complete') {
        trackView();
      } else {
        document.addEventListener('DOMContentLoaded', trackView);
      }
    }
  }

  static documentReady(cb) {
    if (document.readyState === 'complete') {
      cb();
    } else {
      document.addEventListener('DOMContentLoaded', cb);
    }
  }
  documentReady(cb) {
    return AnalyticsController.documentReady(cb);
  }

  logEvent(event, data) {
    /* let current = this._analytics.storage.getItem('eventLog');
        if( !current ) {
            current = []
        }else{
            current.push([{event, data, timestamp: new Date()}])
        }
        this._analytics.storage.setItem('eventLog', current) */

  }

  getEvents() {
    return this._analytics.storage.getItem('analyticsEvents');
  }

  getLog() {
    return this._analytics.storage.getItem('eventLog');
  }


  /**
     * track is the primary method to invoke analytics events.
     * @param {string} type - The event type - currently either 'link' or 'view'.
     * @param {string} data - data to report to analytics with event.
     */
  track(type, data) {
    this._analytics.track(type, data);
    this.logEvent(type, data);
    return true;
  }
}

export default (new AnalyticsController({ brand: 'mcom' }));

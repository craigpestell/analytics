import AnalyticsController from 'analytics';
import { EVENT_TYPE } from './util/constants';
import TagManagerPlugin from './plugins/tag-manager';

export * from './events';
export * from './util/constants';
export { default as AnalyticsMixins } from './mixins';

class Analytics {
  constructor() {
    this._analytics = AnalyticsController({
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
    this.addEvent = this.addEvent.bind(this);
    this.addEvents = this.addEvents.bind(this);
    this.track = this.track.bind(this);
  }

  /**
   * track is the primary method to invoke analytics events.
   * @param {string} type - The event type - currently either 'link' or 'view'.
   * @param {string} data - data to report to analytics with event.
   */
  track(type, data, cb) {
    this._analytics.track(type, data, cb);
    return true;
  }
  // TODO: this currently accepts an object hashmap but should also accept an array of events
  addEvents(events) {
    events.map(this.addEvent);
    // Object.entries(events).forEach(([key, event]) => {
    //   this.addEvent(event);
    // });
  }

  addEvent(event) {
    // for now we'll trigger the 'viewed' events on document.ready

    if (event.type === EVENT_TYPE.view) {
      event.listener = () => {
        event.fetch().then((data) => {
          this._analytics.track(event.type, data);
        });
      };
      this.documentReady(event.listener);
    }
  }

  documentReady(callback) {
    let domResolve;
    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
      return callback();
    }
    const domReady = new Promise((resolve) => {
      // expose fulfilled state holder to outer scope
      callback();
      domResolve = resolve;
    });
    document.addEventListener('DOMContentLoaded', domResolve);
    return domReady;
  }
}

export default new Analytics({ brand: 'mcom' });

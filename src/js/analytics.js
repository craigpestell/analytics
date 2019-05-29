import Analytics from 'analytics';
import { EVENT_TYPE } from './util/constants';
import TagManagerPlugin from './plugins/tag-manager';

export * from './events';
export * from './util/constants';
export { default as AnalyticsMixins } from './mixins';

export class AnalyticsController {
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
    this.track = this.track.bind(this);
  }


  /**
     * track is the primary method to invoke analytics events.
     * @param {string} type - The event type - currently either 'link' or 'view'.
     * @param {string} data - data to report to analytics with event.
     */
  track(type, data) {
    this._analytics.track(type, data);
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
        event.fetch()
          .then((data) => {
            this._analytics.track(event.type, data);
          });
      };
      AnalyticsController.documentReady(event.listener);
    }
  }

  static documentReady(callback) {
    if (
      document.readyState === 'complete' ||
      (document.readyState !== 'loading' && !document.documentElement.doScroll)
    ) {
      return callback();
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  documentReady(cb) {
    // console.log('documentReady');
    return AnalyticsController.documentReady(cb);
  }

}

export default (new AnalyticsController({ brand: 'mcom' }));

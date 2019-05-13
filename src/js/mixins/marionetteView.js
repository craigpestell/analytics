import Radio from 'backbone.radio';

import listeners from '../listeners';
import {intersectionObserver} from '../listeners';
import {EVENT_TYPE} from '../util/constants';
import AnalyticsController from '../analytics';

const analyticsChannel = Radio.channel('analytics');
export default (target, view) => {
    /**
     * calls addEventListener on each DOM element that matches the selector passed as an option to Event constructor
     */
  
  Object.assign(target, {

    set view(view) {
      this._view = view;
    },
    get view() {
      return this._view;
    },

    addEventListeners(){
        const event = this;
        console.log({view})
        
        switch (event.type) {
            case EVENT_TYPE.impression:
                this.getEl().forEach((el) => {
                    event.listener = (e) => {
                        listeners.impress(event)(e).then((result) => {
                            event.track(e).then((result) => {
                                return result;
                            });
                        })
                    }
                    intersectionObserver.observe(el);
                    el.addEventListener('observed', event.listener);
                })
                return;
            case EVENT_TYPE.link:
                const clickListener = listeners.click(event);
                filteredEls.forEach((el) => {
                    el.addEventListener('click', event.track);
                })
            default:
                return;
        }
    },

    ui() {
      const registeredEvents = AnalyticsController.getEvents();
      let hash = {};
      registeredEvents.forEach((event, i) => {
        console.log({ event, i });
      });
    },

    events() {

    },
    /**
         * Subscribe to event, usage:
         *  menu.on('select', function(item) { ... }
        */
    on(eventName, handler) {
      analyticsChannel.on(eventName, handler);
    },

    /**
         * Cancel the subscription, usage:
         *  menu.off('select', handler)
         */
    off(eventName) {
      analyticsChannel.off(eventName);
    },

    /**
         * Generate the event and attach the data to it
         *  this.trigger('select', data1, data2);
         */
    trigger(eventName, ...args) {
      analyticsChannel.trigger(eventName, ...args);
    },
  });

  // init.
  // target.view = view;
  // target.addEventListeners.bind(view);
  target.addEventListeners();
};
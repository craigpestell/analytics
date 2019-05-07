import Analytics from 'analytics';
import EventEmitter from 'events';

import ANALYTICS_EVENT from './events'
import {EVENT_TYPE} from './util/constants'
export { default as ANALYTICS_EVENT } from './events';
export * from './events';
export * from './util/constants';
import * as mixins from './mixins';
export { default as AnalyticsMixins } from './mixins';
export { default as AnalyticsBehavior } from './AnalyticsBehavior';
export { default as AnalyticsService } from './AnalyticsService';

import TagManagerPlugin from './plugins/tag-manager'


console.log({mixins})

// temp store until graphql is worked out.
let store = {
    events: {},
    log: []
}

export default class AnalyticsController extends EventEmitter {
    constructor(options = {}) {
        super(); // calls EventEmitter's constructor
        // Module to allow 'pluggable' destinations. 
        // Change, add, or remove analytics vendors here (Adobe/Tealium/Google)
        if (!window._analytics) {
            this._analytics = Analytics({
                app: 'my-app-name',
                version: 100,
                plugins: [
                    TagManagerPlugin({
                        env: 'dev',
                        brand: options.brand || 'mcom'
                    })
                ]
            });
            window._analytics = this._analytics;
            this._eventEmitter = new EventEmitter();
            // this._eventEmitter = this._eventEmitter.bind(this);
            AnalyticsController.initStore(options);
        }
    }
    static initStore(options) {
        AnalyticsController.addEvent(ANALYTICS_EVENT.Analytics.initialized(options));
    }
    static addEvent(event, triggerName) {
        store.events[event.name] = event;
    }
    static getEvent(name) {
        return store.events[name];

    }

    static logEvent(event, data) {
        store.log.push({event, data});
    }

    get eventEmitter() {
        return this._eventEmitter;
    }

    get events() {
        return ANALYTICS_EVENTS;
    }

    static addEventListener(event){
        // attach dom event listeners.
        
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
}

if (!window._analytics) {
    window._analytics = new AnalyticsController();
}
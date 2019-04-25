import Analytics from 'analytics';
import ApolloClient from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Backbone from 'backbone';
import gql from 'graphql-tag';

import EventEmitter from 'events';

export { default as ANALYTICS_EVENT } from './events';
import ANALYTICS_VENT from './events';
export {default as AnalyticsBehavior} from './AnalyticsBehavior';
export {ANALYTICS_VENT};

import TagManagerPlugin from './plugins/tag-manager'

const cache = new InMemoryCache();

const client = new ApolloClient({
    link: new HttpLink(),
    cache,
    dataIdFromObject: object => object.name,
    addTypename: true,
    connectToDevTools: true
});

export default class AnalyticsController extends EventEmitter {
    constructor(options = {}) {
        super(); // calls EventEmitter's constructor
        // Module to allow 'pluggable' destinations. 
        // Change, add, or remove analytics vendors here (Adobe/Tealium/Google)
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
        // window.analytics = analytics;
        window.addEventListener('track', (d) => {
            console.log('addeventlistener track', d);
        })

    }
    static addEvent(event, triggerName){
        client.writeFragment({
            id: event.name,
            fragment: gql`
            fragment writeEvent on Event {
                event
            }
            `,
            data: {
                __typename: 'event',
                event: event
            }
        })
    }
    static getEvent (name) {
        return client.readFragment({
            id: name,
            fragment: gql`
            fragment getEvent on Event{
                event
            }`
        })
    }

    static logEvent(event) {
        client.writeFragment({
            id: event.name,
            fragment: gql`
            fragment writeLog on Event {
                log
            }
            `,
            data: {
                __typename: 'event',
                log: event.data
            }
        })
    }

    get events() {
        return ANALYTICS_EVENTS;
    }

    /**
     * 
     * @param {AnalyticsEvent} event 
     */
    track(type, data){
        this._analytics.track(type, data);
    }

    /**
     * 
     * @param {*} eventType 
     * @param {*} event 
     */  
    on(eventType, event, target){

        console.log({['this']: this});
    }

    doSomething() {
        // example of emitting an event that consumers can attach listeners to
        this.emit('something:done', 'foobar');
    }
}

if(!window.analyticsController){
    window.analyticsController = new AnalyticsController();
}
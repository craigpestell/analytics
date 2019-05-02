import Analytics from 'analytics';
import {ApolloClient, HttpLink} from 'apollo-boost'

import Backbone from 'backbone';
import gql from 'graphql-tag';

import EventEmitter from 'events';

import ANALYTICS_EVENT from './events'
export { default as ANALYTICS_EVENT } from './events';
import ANALYTICS_VENT from './events';
export {default as AnalyticsBehavior} from './AnalyticsBehavior';
export {ANALYTICS_VENT};

import TagManagerPlugin from './plugins/tag-manager'
import { SchemaLink } from 'apollo-link-schema';
import schema from './schema';
import OptimizedCache from './OptimizedCache';
console.log({schema});
const cache = new OptimizedCache({});

const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache,
    // dataIdFromObject: object => object.name,
    // addTypename: true,
    connectToDevTools: true,
    
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
        const CREATE_EVENT = gql`
            mutation addEvent($name: String!, $type: String!) {
                addEvent(name: $name, type: $type) {
                    name
                    type
                }
            }
        `;

        client.writeQuery({
            query: gql`
            query addEvent{
                Event{
                    id
                    type
                }
            }`,

            data: {
                Event: {
                    __typename: "Event",
                    id: event.name,
                    type: event.type
                }
            }
        })/*.then((event) => {
            console.log('event added', {event})
        })
        
        */
    }
    static getEvent (name) {
        return client.readQuery({
            id: name,
            query: gql`
                query events {
                    Event {
                        id
                        type
                    }
                }
            `
        })
    }

    static logEvent(event) {
        client.writeQuery({
            query: gql`
            query writeLog {
                Event{
                    id
                    type
                }
                log
            }`,
            data: {
                __typename: 'log',
                Event: {
                    __typename: 'Event',
                    id: event.name,
                    type: event.type
                },
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
    // initialize a test event
    AnalyticsController.addEvent(ANALYTICS_EVENT.View.viewed);
}
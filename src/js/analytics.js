import Analytics from 'analytics';
import ApolloClient from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';

import { InMemoryCache } from 'apollo-cache-inmemory';
import graphql from 'graphql.js';
import gql from 'graphql-tag';

import EventEmitter from 'events';

import ANALYTICS_EVENTS from './events';
import TagManagerPlugin from './plugins/tag-manager'

const cache = new InMemoryCache();

const client = new ApolloClient({
    link: new HttpLink(),
    cache,
    dataIdFromObject: object => object.name,
    addTypename: true,
});

client.writeFragment({
    id: '5',
    fragment: gql`
        fragment writeMyTodo on Todo {
        completed
        }
    `,
    data: {
        completed: true,
        __typename: 'todo'
    },
});
// const mutationData = client.readQuery({query});

const todo = client.readFragment({
    id: '5',
    fragment: gql`
        fragment readMyTodo on Todo {
        id
        text
        completed
        }
    `,
});
console.log({todo});

const addEvent = (event) => {
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
const getEvent= (name)=> {
    return client.readFragment({
        id: name,
        fragment: gql`
        fragment getEvent on Event{
            event
        }`
    })
}

export default class AnalyticsController extends EventEmitter {
    constructor(options) {
        super(); // calls EventEmitter's constructor
        if (!window.analytics) {

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
            window.analytics = analytics;
        }
    }

    get event() {
        return ANALYTICS_EVENTS;
    }



    doSomething() {
        // example of emitting an event that consumers can attach listeners to
        this.emit('something:done', 'foobar');
    }
}

addEvent(ANALYTICS_EVENTS.ProductThumbnail.viewed);

const retrieved = getEvent(ANALYTICS_EVENTS.ProductThumbnail.viewed.name);
console.log({retrieved});
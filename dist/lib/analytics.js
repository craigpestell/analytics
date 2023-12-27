"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_node_1 = require("@segment/analytics-node");
const Analytics = (writeKey) => {
    console.log({ writeKey });
    const analytics = new analytics_node_1.Analytics({
        writeKey,
    }).on('error', console.error);
    const methods = {
        pageview: ({ Auth0Id, category, name, properties }) => {
            /*
              {
                userId: '019mr8mf4r',
                category: 'Docs',
                name: 'Node.js Library',
                properties: {
                  url: 'https://segment.com/docs/connections/sources/catalog/librariesnode',
                  path: '/docs/connections/sources/catalog/librariesnode/',
                  title: 'Node.js Library - Segment',
                  referrer: 'https://github.com/segmentio/analytics-node'
                }
              }
              */
            const pageParams = {
                userId: Auth0Id,
                category,
                name,
                properties: Object.assign({}, properties),
            };
            console.log('page:', pageParams);
            analytics.page(pageParams);
        },
        track: ({ Auth0Id, 
        //type = 'track',
        event, properties, }) => {
            const identifyParams = Auth0Id
                ? { userId: Auth0Id }
                : { anonymousId: 'anonymous' };
            const trackParams = Object.assign({ event, properties: Object.assign({}, properties) }, identifyParams);
            console.log('track: ', trackParams);
            analytics.track(trackParams);
        },
    };
    const sendMessage = {
        pageview: (chromeRuntime, { Auth0Id, category, name, properties }) => {
            chromeRuntime.sendMessage({
                analytics: {
                    action: 'pageview',
                    Auth0Id,
                    category,
                    name,
                    properties,
                },
            }, (response) => {
                console.log({ response });
            });
        },
        track: (chromeRuntime, { userId: Auth0Id, event, properties }) => {
            chromeRuntime.sendMessage({
                analytics: {
                    action: 'track',
                    Auth0Id,
                    event,
                    properties,
                },
            }, (response) => {
                console.log({ response });
            });
        },
    };
    return Object.assign(Object.assign({}, methods), { sendMessage });
};
exports.default = Analytics;
//# sourceMappingURL=analytics.js.map
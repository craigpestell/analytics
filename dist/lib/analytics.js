"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEGMENT_WRITE_KEY = void 0;
const analytics_node_1 = require("@segment/analytics-node");
exports.SEGMENT_WRITE_KEY = process.env.SEGMENT_WRITE_KEY || 'FVXjn6W0y5iDR11coKCRC4TBHqcAP97r';
const Analytics = ({ router } = {}) => {
    console.log({ router });
    const analytics = new analytics_node_1.Analytics({
        writeKey: `${exports.SEGMENT_WRITE_KEY}`,
    }).on('error', console.error);
    return {
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
        track: ({ Auth0Id, type = 'track', event, properties, }) => {
            const identifyParams = Auth0Id
                ? { userId: Auth0Id }
                : { anonymousId: 'anonymous' };
            const trackParams = Object.assign({ event, properties: Object.assign({}, properties) }, identifyParams);
            console.log('track: ', trackParams);
            analytics.track(trackParams);
        },
    };
};
/*
          messageId?: string
        type: SegmentEventType
      
        // page specific
        category?: string
        name?: string
      
        properties?: EventProperties
      
        traits?: Traits // Traits is only defined in 'identify' and 'group', even if it can be passed in other calls.
      
        integrations?: Integrations
        context?: CoreExtraContext
        options?: CoreOptions
      
        userId?: ID
        anonymousId?: ID
        groupId?: ID
        previousId?: ID
      
        event?: string
      
        writeKey?: string
      
        sentAt?: Date
      
        _metadata?: SegmentEventMetadata
      
        timestamp?: Timestamp */
exports.default = Analytics;
//# sourceMappingURL=analytics.js.map
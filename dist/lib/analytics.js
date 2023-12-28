"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_node_1 = require("@segment/analytics-node");
const HealthTapAnalytics = (writeKey) => {
    const segmentAnalytics = new analytics_node_1.Analytics({
        writeKey,
    }).on('error', console.error);
    return {
        identify: ({ userId, anonymousId, traits, context, timestamp, integrations, }) => {
            if (userId) {
                return new Promise((resolve) => resolve(segmentAnalytics.identify({
                    userId,
                    traits,
                    context,
                    timestamp,
                    integrations,
                })));
            }
            if (anonymousId) {
                return new Promise((resolve) => resolve(segmentAnalytics.identify({
                    anonymousId,
                    traits,
                    context,
                    timestamp,
                    integrations,
                })));
            }
            return new Promise((resolve) => {
                resolve();
            });
        },
        pageview: ({ Auth0Id, category, name, properties, }) => {
            const pageParams = {
                userId: Auth0Id,
                category,
                name,
                properties: Object.assign({}, properties),
            };
            return new Promise((resolve) => resolve(segmentAnalytics.page(pageParams)));
        },
        track: ({ Auth0Id, 
        //type = 'track',
        event, properties, }) => {
            const identifyParams = Auth0Id
                ? { userId: Auth0Id }
                : { anonymousId: 'anonymous' };
            const trackParams = Object.assign({ event: event !== null && event !== void 0 ? event : 'no event specified', properties: Object.assign({}, properties) }, identifyParams);
            return new Promise((resolve) => resolve(segmentAnalytics.track(trackParams)));
        },
    };
};
exports.default = HealthTapAnalytics;
//# sourceMappingURL=analytics.js.map
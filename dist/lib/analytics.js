"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_node_1 = require("@segment/analytics-node");
const Analytics = (writeKey) => {
    const analytics = new analytics_node_1.Analytics({
        writeKey,
    }).on('error', console.error);
    const methods = {
        identify: ({ userId, anonymousId, traits, context, timestamp, integrations, }) => __awaiter(void 0, void 0, void 0, function* () {
            if (userId) {
                return yield new Promise((resolve) => resolve(analytics.identify({
                    userId,
                    traits,
                    context,
                    timestamp,
                    integrations,
                })));
            }
            if (anonymousId) {
                return yield new Promise((resolve) => resolve(analytics.identify({
                    anonymousId,
                    traits,
                    context,
                    timestamp,
                    integrations,
                })));
            }
        }),
        pageview: ({ Auth0Id, category, name, properties, }) => __awaiter(void 0, void 0, void 0, function* () {
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
            return yield new Promise((resolve) => resolve(analytics.page(pageParams)));
        }),
        track: ({ Auth0Id, 
        //type = 'track',
        event, properties, }) => __awaiter(void 0, void 0, void 0, function* () {
            const identifyParams = Auth0Id
                ? { userId: Auth0Id }
                : { anonymousId: 'anonymous' };
            const trackParams = Object.assign({ event: event !== null && event !== void 0 ? event : 'no event specified', properties: Object.assign({}, properties) }, identifyParams);
            yield new Promise((resolve) => resolve(analytics.track(trackParams)));
        }),
    };
    return Object.assign({}, methods);
};
exports.default = Analytics;
//# sourceMappingURL=analytics.js.map
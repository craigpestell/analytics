"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePageView = exports.useAnalytics = void 0;
const analytics_1 = __importDefault(require("../lib/analytics"));
const react_1 = require("react");
const useAnalytics = ({ Auth0Id }) => {
    // const analytics = new SegmentAnalytics({ writeKey: SEGMENT_WRITE_KEY });
    const analytics = (0, analytics_1.default)();
    return {
        track: ({ type = 'track', event, properties, }) => {
            const trackParams = {
                Auth0Id: Auth0Id !== null && Auth0Id !== void 0 ? Auth0Id : '',
                event,
                type,
                properties: Object.assign({}, properties),
            };
            analytics.track(trackParams);
        },
    };
};
exports.useAnalytics = useAnalytics;
const usePageView = ({ router, Auth0Id, category, name, properties, }) => {
    function isEqualShallow(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    const now = Math.round(Date.now() / 1000);
    const analytics = (0, analytics_1.default)({ router });
    const [timestamp, setTimestamp] = (0, react_1.useState)(now);
    const [pageViewProps, setPageViewProps] = (0, react_1.useState)({
        Auth0Id,
        category,
        name,
        properties,
    });
    (0, react_1.useEffect)(() => {
        const now = Math.round(Date.now() / 1000);
        const sameProps = isEqualShallow({ Auth0Id, category, name, properties }, pageViewProps);
        const paramsResolved = !(router === null || router === void 0 ? void 0 : router.pathname.includes('[id]')) &&
            !(router === null || router === void 0 ? void 0 : router.pathname.includes('[...id]'))
            ? true
            : !!router.query.id;
        const pageViewTimeThresholdMet = now - timestamp > 30;
        // console.log({ timestamp });
        //console.log({ pageViewTimeThresholdMet, now, timestamp });
        if (Auth0Id && paramsResolved && (!sameProps || pageViewTimeThresholdMet)) {
            setTimestamp(now);
            setPageViewProps({
                Auth0Id,
                category,
                name,
                properties,
            });
            analytics.pageview({ Auth0Id, category, name, properties });
        }
    }, [
        Auth0Id,
        category,
        name,
        properties,
        pageViewProps,
        analytics,
        timestamp,
    ]);
};
exports.usePageView = usePageView;
exports.default = { useAnalytics: exports.useAnalytics, usePageView: exports.usePageView };
//# sourceMappingURL=useAnalytics.js.map
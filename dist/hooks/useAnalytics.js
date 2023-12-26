"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePageView = exports.useAnalytics = void 0;
const analytics_1 = __importDefault(require("../lib/analytics"));
const react_1 = require("react");
function isEqualShallow(a, b) {
    console.log(JSON.stringify(a));
    console.log(JSON.stringify(b));
    return JSON.stringify(a) === JSON.stringify(b);
}
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
    const analytics = (0, analytics_1.default)({ router });
    const [timestamp, setTimestamp] = (0, react_1.useState)(0);
    const [pageViewProps, setPageViewProps] = (0, react_1.useState)({
        Auth0Id,
        category,
        name,
        properties,
    });
    (0, react_1.useEffect)(() => {
        const now = Date.now() / 1000;
        const sameProps = isEqualShallow({ Auth0Id, category, name, properties }, pageViewProps);
        console.log({ sameProps }, { elapsed: now - timestamp });
        //if (Auth0Id && category && name && router.pathname) {
        if (!sameProps || (now - timestamp > 15)) {
            // console.log({ Auth0Id, category, name, properties });
            setPageViewProps({
                Auth0Id,
                category,
                name,
                properties,
            });
            analytics.pageview({ Auth0Id, category, name, properties });
            setTimestamp(now);
        }
        //}
    }, [Auth0Id, category, name, properties, pageViewProps, analytics]);
};
exports.usePageView = usePageView;
exports.default = { useAnalytics: exports.useAnalytics, usePageView: exports.usePageView };
//# sourceMappingURL=useAnalytics.js.map
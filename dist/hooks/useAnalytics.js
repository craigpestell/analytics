"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePageView = exports.useAnalytics = void 0;
const analytics_node_1 = require("@segment/analytics-node");
const analytics_1 = __importStar(require("../lib/analytics"));
const react_1 = require("react");
function isEqualShallow(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
const useAnalytics = ({ Auth0Id, }) => {
    const analytics = new analytics_node_1.Analytics({ writeKey: analytics_1.SEGMENT_WRITE_KEY });
    return {
        track: ({ type = 'track', event, properties, }) => {
            const userTrack = {
                userId: Auth0Id,
                event,
                properties: Object.assign({}, properties),
            };
            const anonTrack = {
                anonymousId: 'anonymous',
                event,
                properties: Object.assign({}, properties),
            };
            const e = Auth0Id ? userTrack : anonTrack;
            analytics.track(e);
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
        const sameProps = !isEqualShallow({ Auth0Id, category, name, properties }, pageViewProps);
        //console.log({ sameProps }, { elapsed: now - timestamp });
        //if (Auth0Id && category && name && router.pathname) {
        if (!sameProps || now - timestamp > 5) {
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
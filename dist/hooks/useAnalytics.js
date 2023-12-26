"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = __importDefault(require("../lib/analytics"));
const react_1 = require("react");
function isEqualShallow(a, b) {
    for (var key in a) {
        if (!(key in b) || a[key] !== b[key]) {
            return false;
        }
    }
    for (var key in b) {
        if (!(key in a) || a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
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
exports.default = usePageView;
//# sourceMappingURL=useAnalytics.js.map
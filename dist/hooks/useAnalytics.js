"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = __importDefault(require("@/lib/analytics"));
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
    for (var key in a.properties) {
        if (!(key in b.properties) || a.properties[key] !== b.properties[key]) {
            return false;
        }
    }
    for (var key in b.properties) {
        if (!(key in a.properties) || a.properties[key] !== b.propeties[key]) {
            return false;
        }
    }
    return true;
}
const usePageView = ({ router, Auth0Id, category, name, properties, }) => {
    const analytics = (0, analytics_1.default)({ router });
    const [pageViewProps, setPageViewProps] = (0, react_1.useState)({
        pathname: '',
        Auth0Id,
        category,
        name,
        properties,
    });
    (0, react_1.useEffect)(() => {
        console.log({ pathname: router.pathname });
        const sameProps = !isEqualShallow({ pathname: router.asPath, Auth0Id, category, name, properties }, pageViewProps);
        console.log({ sameProps });
        //if (Auth0Id && category && name && router.pathname) {
        if (!sameProps) {
            console.log({ Auth0Id, category, name, properties });
            setPageViewProps({
                pathname: router.asPath,
                Auth0Id,
                category,
                name,
                properties,
            });
            analytics.pageview({ Auth0Id, category, name, properties });
        }
        //}
    }, [Auth0Id, category, name, properties, pageViewProps, analytics, router]);
};
exports.default = usePageView;
//# sourceMappingURL=useAnalytics.js.map
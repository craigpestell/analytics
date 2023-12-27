"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*import {
  IdentifyParams,
  Analytics as SegmentAnalytics,
  TrackParams,
} from '@segment/analytics-node';
*/
const analytics_1 = __importDefault(require("../lib/analytics"));
const react_1 = require("react");
const Analytics = (writeKey) => {
    const analytics = (0, analytics_1.default)(writeKey);
    const useAnalytics = ({ Auth0Id }) => {
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
    const usePageView = ({ Auth0Id, category, name, properties, }) => {
        /*function isEqualShallow(a: any, b: any) {
          return JSON.stringify(a) === JSON.stringify(b);
        }*/
        //const now = Math.round(Date.now() / 1000);
        //const [timestamp, setTimestamp] = useState<number>(now);
        const [timerThreshold, setTimerThreshold] = (0, react_1.useState)(false);
        /*const [pageViewProps, setPageViewProps] = useState<PageViewProps>({
          Auth0Id,
          category,
          name,
          properties,
        });*/
        (0, react_1.useEffect)(() => {
            //const now = Math.round(Date.now() / 1000);
            const timer = setTimeout(() => {
                setTimerThreshold(true);
                /*setPageViewProps({
                  Auth0Id,
                  category,
                  name,
                  properties,
                });*/
                clearTimeout(timer);
            }, 5000);
            //setTimestamp(now);
            if (timerThreshold) {
                /*setPageViewProps({
                  Auth0Id,
                  category,
                  name,
                  properties,
                });*/
                analytics.pageview({ Auth0Id, category, name, properties });
                //setTimerThreshold(false);
            }
            //}
        }, [timerThreshold]);
    };
    return { useAnalytics, usePageView };
};
exports.default = Analytics;
//# sourceMappingURL=useAnalytics.js.map
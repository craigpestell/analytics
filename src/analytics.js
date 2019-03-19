import Pubsub from '@component/common/src/util/PublishSubscribe';

import { ANALYTICS_OBSERVER_TYPE } from './util/constants';
import AnalyticsController from './AnalyticsController';
import AnalyticsValidator from './js/AnalyticsValidator';

import AnalyticsViewBehavior from './js/behaviors/ViewBehavior';

const publishAnalyticsConfig = (options = {}) => {
  
  const observer = Pubsub.observe(ANALYTICS_OBSERVER_TYPE.CONFIGURE);
  let config = options;
  Object.assign(config, { type: 'configure' });
  observer.publish(config);
}

/**
 * Analytics module.
 * @module @component/analytics
 * @see module:@component/analytics
 */
const Analytics = AnalyticsController;

export { AnalyticsValidator, AnalyticsViewBehavior, publishAnalyticsConfig };
export default Analytics;

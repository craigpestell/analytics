import AnalyticsEvent from './AnalyticsEvent'
import AnalyticsService from '../AnalyticsService';
import EVENT_TYPE from '../util/constants';

export default class Banner extends AnalyticsEvent {
  constructor(name, eventType, options) {
    super(`EVENT.Banner.${name}`, eventType, options);
    this.dataMap = {
      
      testEntity: () => (new Promise((resolve) => resolve({attr1: 'test attr1 data', attr2: 'test attr2 data'})))
    }
  }
}
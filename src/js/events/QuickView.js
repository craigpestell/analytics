import AnalyticsEvent from './AnalyticsEvent';
import AnalyticsService from '../AnalyticsService';
import EVENT_TYPE from '../util/constants';

export default class QuickViewEvent extends AnalyticsEvent {
    constructor (name, eventType, options) {
        super (`EVENT.QuickView.${name}`, eventType, options);
        this.dataMap = {
          product: AnalyticsService.product
        }
      }
  }
  
  
import AnalyticsEvent from './AnalyticsEvent';

import AnalyticsService from '../AnalyticsService';
import {EVENT_TYPE} from '../util/constants';

export default class DiscoveryPagesEvent extends AnalyticsEvent {
    constructor (name, eventType, pageApp) {
        super (`EVENT.DiscoveryPages.${name}`, eventType);
        this.pageApp = pageApp;
        if(eventType == EVENT_TYPE.view) {
            this.dataMap.page = () => (new Promise((resolve) => {
                resolve(pageApp.getMeta('analytics')['data']);
            }));
        }
      }
  }
  /*  */
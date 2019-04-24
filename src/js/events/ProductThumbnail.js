import AnalyticsEvent from './AnalyticsEvent'
import AnalyticsService from '../AnalyticsService';
import EVENT_TYPE from '../util/constants';

export default class ProductThumbnailEvent extends AnalyticsEvent{
    constructor (name, eventType, options) {
      super (`EVENT.ProductThumbnail.${name}`, eventType, options);
      this.dataMap = {
        product: (thumbnailEl) => {
            const id = thumbnailEl.id;
            return AnalyticsService.product(id);
        }
      }
    }
  }
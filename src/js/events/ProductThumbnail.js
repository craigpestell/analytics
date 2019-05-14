import AnalyticsEvent from './AnalyticsEvent'
import AnalyticsService from '../AnalyticsService';
import EVENT_TYPE from '../util/constants';

export default class ProductThumbnailEvent extends AnalyticsEvent {
  constructor(name, eventType, options) {
    super(`EVENT.ProductThumbnail.${name}`, eventType, options);
    this.dataMap = {
      product: ($thumbnail) => {
        const id = $thumbnail.attr('id');
        const serviceResponse = AnalyticsService.product(id);
        console.log({serviceResponse});
        return serviceResponse;
      },
      testEntity: () => (new Promise((resolve) => resolve({attr1: 'test attr1 data', attr2: 'test attr2 data'})))
    }
  }
}
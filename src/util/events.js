import AnalyticsService from '../AnalyticsService';

import enumValue from './enumValue';

export const EVENT_TYPE = Object.freeze({
  view: enumValue('view'), // Tealium page view event
  link: enumValue('link'), // Tealium link event
  analytics: enumValue('EVENT_TYPE.analytics'), // Internal analytics event
});

const product = AnalyticsService.product;

class AnalyticsEvent {
  constructor(name, type = EVENT_TYPE.link.toString(), options = {data: {}, dataMap: {}, asyncEvent: false}) {
    this._name = name;
    this._type = type;
    this._data = Object.assign(options.data || {}, {event_name: name});
    this._dataMap = options.dataMap || {};
    this._async = options.asyncEvent || false;
    
  }
  
  set dataMap(dataMap) {
    console.log({dataMap})
    Object.keys(dataMap).reduce((prev, curr, i, arr) => {
      console.log('set dataMap args', {...arguments})
    })
    this._dataMap = Object.assign(this._dataMap, dataMap);
  }
  
  get dataMap() {
    return this._dataMap;
  }

  get data() {
    return this._data;
  }
  
  get type(){
    return this._type;
  }

  get name(){
    return this._name;
  }

  get async(){
    return this._async;
  }
  [Symbol.toPrimitive]() {
    return this.name;
  }
  toString(){
    return this._name;
  }
}

const QuickView = new AnalyticsEvent('quick-view');
QuickView.dataMap = {
  product
}
class QVEvent extends AnalyticsEvent{
  constructor(name){
    super(`EVENT.QuickView.${name}`, EVENT_TYPE.link.toString(), {['default']: 'some data'}, {product})
    if(name === 'EVENT.QuickView.viewed'){
      this.type = 'view';
    }
      
  }
}

export default Object.freeze({
    //DOM events
    DOM: {
      Element: {
        viewed: new AnalyticsEvent('EVENT.Element.viewed', 'view'),
        clicked: new AnalyticsEvent('EVENT.Element.clicked'),
        mousedOver: new AnalyticsEvent('EVENT.Element.mousedOver'),
        redirected: new AnalyticsEvent('EVENT.Element.redirected'),
      }
    },

    // Generic Page view event.
    Page: {
      viewed: new AnalyticsEvent('EVENT.Page.viewed', 'view')
    },

    // Generic Marionette events for features.
    Marionette: {
      initialized: new AnalyticsEvent('EVENT.Marionette.initialized', 'view'),
      rendered: new AnalyticsEvent('EVENT.Marionette.rendered', 'view')
    },

    // E-commerce events
    ProductThumbnail: {
      viewed: new AnalyticsEvent('EVENT.ProductThumbnail.viewed'),
      clicked: new AnalyticsEvent('EVENT.ProductThumbnail.clicked'),
      fetchSuccess: new AnalyticsEvent('EVENT.ProductThumbnail.fetchSuccess'),
      fetchFailed: new AnalyticsEvent('EVENT.ProductThumbnail.fetchFailed')

    },
    QuickView: {
      viewed: new QVEvent('viewed'),
      clicked: new QVEvent('EVENT.QuickView.clicked'),
      fetchSuccess: new AnalyticsEvent('EVENT.QuickView.fetchSuccess'),
      fetchFailed: new AnalyticsEvent('EVENT.QuickView.fetchFailed'),
    },
    Analytics:{
      Event: {
        added: new AnalyticsEvent('EVENT.Analytics.added'),
        fetchDataMap: new AnalyticsEvent('EVENT.Analytics.dataMapFetched'),
      }
    }
  });

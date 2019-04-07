import AnalyticsService from '../AnalyticsService';

const product = AnalyticsService.product;

class AnalyticsEvent {
  constructor(name, data = {}, dataMap = {}) {
    this.name = name;
    this.data = {
      event_name: name
    }
    this._dataMap = dataMap;
    
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
    return this.data;
  }
  toString(){
    return this.name;
  }
}

const QuickView = new AnalyticsEvent('quick-view');
QuickView.dataMap = {
  product
}
class QVEvent extends AnalyticsEvent{
  constructor(name){
    super(`EVENT.QuickView.${name}`, {['default']: 'some data'}, {product})
  }
}

export default Object.freeze({
    //DOM events
    DOM: {
      Element: {
        viewed: new AnalyticsEvent('EVENT.Element.viewed'),
        clicked: new AnalyticsEvent('EVENT.Element.clicked'),
        mousedOver: new AnalyticsEvent('EVENT.Element.mousedOver'),
        redirected: new AnalyticsEvent('EVENT.Element.redirected'),
      }
    },

    // Generic Marionette events for features.
    Marionette: {
      initialized: new AnalyticsEvent('EVENT.Marionette.initialized'),
      rendered: new AnalyticsEvent('EVENT.Marionette.rendered')
    },

    // E-commerce events
    Product: {
      viewed: new AnalyticsEvent('EVENT.Product.viewed'),
      clicked: new AnalyticsEvent('EVENT.Product.clicked'),
      fetchSuccess: new AnalyticsEvent('EVENT.Product.fetchSuccess'),
      fetchFailed: new AnalyticsEvent('EVENT.Product.fetchFailed')

    },
    QuickView: {
      viewed: new QVEvent('viewed'),
      clicked: new QVEvent('EVENT.QuickView.clicked'),
      fetchSuccess: new AnalyticsEvent('EVENT.QuickView.fetchSuccess'),
      fetchFailed: new AnalyticsEvent('EVENT.QuickView.fetchFailed'),
    }
  });

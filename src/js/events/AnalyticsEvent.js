import { EVENT_TYPE } from '../util/constants';
import {default as AnalyticsController} from '../analytics';

export default class AnalyticsEvent {
  constructor(
    name,
    eventType = EVENT_TYPE.link.toString(),
    options = { data: {}, dataMap: {}, selector: null }
  ) {
    this._name = name;
    this._type = eventType;
    this._dataMap = options.dataMap || {};
    this._data = Object.assign(options.data || {}, { event_name: name });
    this._selector = options.selector || null;
    this.fetch = this.fetch.bind(this);
    this.track = this.track.bind(this);
    this._listener = undefined;
  }

  async fetchMap(context) {
    const keys = Object.keys(this.dataMap);
    if (keys.length > 0) {
      const entries = Object.entries(this.dataMap);
      const promiseArr = entries.map(([name, listener]) => {
        if(typeof listener == 'function') {
          const listenerResult = listener(context);
          return listenerResult;
        } else {
          return listener;
        }
      })      
      return await Promise.all(promiseArr)
    } else {
      return new Promise((resolve) => resolve({}));
    }
  }

  fetch(context) {
    const event = this;
    return new Promise((resolve) => {
      this.fetchMap(context).then((mapResults) =>{
        Object.assign(event.data, mapResults);
        resolve(event.data);
      })
    })
  }
  
  track(context){
    const event = this;
    return event.fetch(context)
      .then((data) => {
          AnalyticsController.logEvent(event, data)
          return AnalyticsController.track(event.type, data)
      });
  }
  
  set dataMap(dataMap) {
    this._dataMap = Object.assign(this._dataMap, dataMap || {});
  }

  get dataMap() {
    return this._dataMap;
  }

  get data() {
    return this._data;
  }

  get type() {
    return this._type;
  }

  get name() {
    return this._name;
  }

  get async() {
    return this._async;
  }

  get selector(){ 
    return this._selector;
  }

  [Symbol.toPrimitive](hint) {
    return this.name;
  }

  toString() {
    return this._name;
  }
}

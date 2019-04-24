import {EVENT_TYPE} from '../util/constants';
import AnalyticsController from '../analytics';

export default class AnalyticsEvent {
  constructor (
    name,
    eventType = EVENT_TYPE.link.toString (),
    options = {data: {}, dataMap: {}, asyncEvent: false}
  ) {
    this._name = name;
    this._type = eventType;
    this._data = Object.assign (options.data || {}, {event_name: name});
    this._dataMap = options.dataMap || {};
    this._async = options.asyncEvent || false;
  }

  listener(e) {
    if(this._type == EVENT_TYPE.view){

    }
    
  }

  set dataMap (dataMap) {
    console.log ({dataMap});
    Object.keys (dataMap).reduce ((prev, curr, i, arr) => {
      console.log ('set dataMap args', {...arguments});
    });
    this._dataMap = Object.assign (this._dataMap, dataMap);
  }

  get dataMap () {
    return this._dataMap;
  }

  get data () {
    return this._data;
  }

  get type () {
    return this._type;
  }

  get name () {
    return this._name;
  }

  get async () {
    return this._async;
  }

  [Symbol.toPrimitive] (hint) {
    return this.name;
  }

  toString () {
    return this._name;
  }
}
  
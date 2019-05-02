import { EVENT_TYPE } from '../util/constants';
import {default as AnalyticsController} from '../analytics';

export default class AnalyticsEvent {
  constructor(
    name,
    eventType = EVENT_TYPE.link.toString(),
    options = { data: {}, dataMap: {}, asyncEvent: false }
  ) {
    //this._channel = backbone.Radio.channel('analytics');
    // this._channel.on('track', this.listener);

    this._name = name;
    this._type = eventType;
    this._data = Object.assign(options.data || {}, { event_name: name });
    this._dataMap = options.dataMap || {};
    this._async = options.asyncEvent || false;

    this.track = this.track.bind(this);
  }

  track(context) {
    const event = this;
    // check if the event is already added/registered.
    const existing = AnalyticsController.getEvent(event.name);
    console.log({existing});
    if(!existing){
      AnalyticsController.addEvent(event);
    }
    this.fetchMap(context).then((data) => {
      const trackResult = window.analyticsController.track(event.type, data)
      AnalyticsController.logEvent(event);
      return trackResult;
    })
  }


  listener(e) {
    console.log('listener:', { e })
    if (this._type == EVENT_TYPE.view) {

    }

  }

  set dataMap(dataMap) {

    Object.keys(dataMap).reduce((prev, curr, i, arr) => {
      console.log('set dataMap args', { ...arguments });
    });
    this._dataMap = Object.assign(this._dataMap, dataMap || {});
  }

  fetchMap(context) {
    const keys = Object.keys(this.dataMap);
    
    if (keys.length > 0) {
      return Promise.all((Object.entries(this.dataMap).map(([name, listener]) => (listener(context)))))
    } else {
      return new Promise((resolve) => resolve({}));
    }
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

  [Symbol.toPrimitive](hint) {
    return this.name;
  }

  toString() {
    return this._name;
  }
}

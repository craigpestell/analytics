import { EVENT_TYPE } from '../util/constants';
import {default as AnalyticsController} from '../analytics';



let eventMixin = {
  /**
   * Subscribe to event, usage:
   *  menu.on('select', function(item) { ... }
  */
  on(eventName, handler) {
    if (!this._eventHandlers) this._eventHandlers = {};
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
  },

  /**
   * Cancel the subscription, usage:
   *  menu.off('select', handler)
   */
  off(eventName, handler) {
    let handlers = this._eventHandlers && this._eventHandlers[eventName];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }
  },

  /**
   * Generate the event and attach the data to it
   *  this.trigger('select', data1, data2);
   */
  trigger(eventName, ...args) {
    if (!this._eventHandlers || !this._eventHandlers[eventName]) {
      return; // no handlers for that event name
    }

    // call the handlers
    this._eventHandlers[eventName].forEach(handler => handler.apply(this, args));
  }
};

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
    this.on(this.name, this.listener);
  }

  listener(e) {
    const event = this;
    console.log('listener:', { e })
    if (event._type == EVENT_TYPE.view) {

    }

  }

  set dataMap(dataMap) {
    Object.keys(dataMap).reduce((prev, curr, i, arr) => {
      console.log('set dataMap args', { ...arguments });
    });
    this._dataMap = Object.assign(this._dataMap, dataMap || {});
  }

  async fetchMap(context) {
    const keys = Object.keys(this.dataMap);
    
    if (keys.length > 0) {
      const entries = Object.entries(this.dataMap);
      const promiseArr = entries.map(([name, listener]) => {
        console.log({name, listener})
        const listenerResult = listener(context);
        console.log({listenerResult});
        return listenerResult;
      })
      console.log({promiseArr});
      const promiseAll = await Promise.all(promiseArr)
      .then((data) => {
        console.log({data})
        return data;
      });
      console.log({promiseAll});
      return promiseAll;
      
      /* return Promise.all((Object.entries(this.dataMap).map(([name, listener]) => {
        console.log({name, listener})
        return listener(context)
      })))*/
    } else {
      return new Promise((resolve) => resolve({}));
    }
  }

  track(context) {
    const event = this;
    // check if the event is already added/registered.
    const existing = AnalyticsController.getEvent(event.name);
    if(!existing){
      AnalyticsController.addEvent(event);
    }
    
    return new Promise((resolve) => {

      this.fetchMap(context).then((mapResults) =>{
        Object.assign(this.data, mapResults);
        AnalyticsController.logEvent({event: this});
        resolve(window._analytics.track(this.type, this.data));
      })
    })
    
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

Object.assign(AnalyticsEvent.prototype, eventMixin);
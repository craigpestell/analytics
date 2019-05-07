import listeners from '../listeners';
import {EVENT_TYPE} from '../util/constants';

export default {
    constructor(){
        console.log('inside domEventConstructor');
    },


    addEventListeners() {
        const event = this;
        if(event.selector) {
            const applicableElements = (event.selectorIsId) ? [document.getElementById(event.selector)] : document.querySelectorAll(event.selector);
            const filteredEls = Array.from(applicableElements).filter(el => el != null);
            switch(event.type){
                case EVENT_TYPE.view: 
                    {

                    }
                    return;
                case EVENT_TYPE.impression:
                {

                }
                return;
                case EVENT_TYPE.link:
                {
                    const clickListener = listeners.click(event);
                    filteredEls.forEach((el) => {
                        el.addEventListener('click', clickListener);
                    })

                }
                return;
                default:
                {

                }
                return;
            }
        }
    },

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
  
  
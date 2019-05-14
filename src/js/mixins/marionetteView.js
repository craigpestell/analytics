import listeners from '../listeners';
import {intersectionObserver} from '../listeners';
import {EVENT_TYPE} from '../util/constants';
import AnalyticsController from '../analytics';

export default (target, view) => {
  
  if(!target.getEl) {
    Object.assign(target, {
      getEl(){
        return [view.el]
      }
    });
  }

  Object.assign(target, {
    addEventListeners() { 
      const event = this;
      target.getEl().forEach((el) => {
        switch (event.type) {
          case EVENT_TYPE.impression:
            event.getEl().forEach((el) => {
              event.listener = (e) => {
                return listeners.impress(event)(e);
              }
              intersectionObserver.observe(el);
              el.addEventListener('observed', event.listener);
            });
            return;
          
          
          // link is the default listener.
          case EVENT_TYPE.link:
          default:
            event.listener = (e) => {
              return listeners.click(event)(e)
            }
            event.getEl().forEach((el) => {
              el.addEventListener('click', event.listener);
            });
            return;
          }

        });
      
    } 
  })
  // init
  target.addEventListeners();
};
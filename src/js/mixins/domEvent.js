import listeners from '../listeners';
import { EVENT_TYPE } from '../util/constants';
import AnalyticsController from '../analytics';
import intersectionObserver from '../listeners';

export default (target) => {
  /**
     * calls addEventListener on each DOM element that matches the selector passed as an option to Event constructor
     */
  Object.assign(target, {

    getEL() {
      const applicableElements = (this.selectorIsId) ? [document.getElementById(this.selector)] : document.querySelectorAll(this.selector);
      return Array.from(applicableElements).filter(el => el != null);
    },

    addEventListeners() {
      const event = this;

      if (event.selector) {
        switch (event.type) {
          case EVENT_TYPE.impression:
            {
              this.getEl().forEach((el) => {
                event.listener = (e) => {
                  listeners.impress(event)(e).then((result) => {
                    event.track(e).then((result) => {
                      console.log('track result:', { result });
                    });
                  });
                };

                intersectionObserver.observe(el);
                el.addEventListener('observed', event.listener);
              });
            }
            return;
          case EVENT_TYPE.link:
          {
            const clickListener = listeners.click(event);
            filteredEls.forEach((el) => {
              el.addEventListener('click', event.track);
            });
          }

          default:
        }
      }
    },
  });

  // init.
  target.addEventListeners();
};


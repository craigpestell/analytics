import listeners, { intersectionObserver } from '../listeners';

import { EVENT_TYPE } from '../util/constants';
import AnalyticsController from '../analytics';

export default (target, view) => {
  if (!target.getEl) {
    Object.assign(target, {
      getEl() {
        return [view.el];
      },
    });
  }

  Object.assign(target, {
    addEventListeners() {
      const event = this;
      target.getEl().forEach((el) => {
        switch (event.type) {
          case EVENT_TYPE.view:
            event.listener = e => listeners.view(event)(e);
            AnalyticsController.documentReady(event.listener);
          case EVENT_TYPE.impression:
            event.getEl().forEach((el) => {
              event.listener = e => listeners.impress(event)(e);
              intersectionObserver.observe(el);
              el.addEventListener('observed', event.listener);
            });
            return;
          // link is the default listener.
          case EVENT_TYPE.link:
          default:
            event.listener = e => listeners.click(event)(e);
            event.getEl().forEach((el) => {
              el.addEventListener('click', event.listener);
            });
        }
      });
    },
  });
  // init
  target.addEventListeners();
};

import Analytics from '../analytics';
import { listeners, intersectionObserver } from '../listeners';
import { EVENT_TYPE } from '../util/constants';

export const marionetteViewMixin = (target, view) => {
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
      switch (event.type) {
        case EVENT_TYPE.view:
          event.listener = e => listeners.view(event)(e);
          Analytics.documentReady(event.listener);
          break;
        case EVENT_TYPE.impression:
          event.getEl().forEach((el) => {
            event.listener = e => listeners.impress(event)(e);
            intersectionObserver.observe(el);
            el.addEventListener('observed', event.listener);
          });
          break;
        // link is the default listener.
        case EVENT_TYPE.link:
        default:
          event.listener = e => listeners.click(event)(e);
          event.getEl().forEach((el) => {
            el.addEventListener('click', event.listener);
          });
      }
    },
  });
  // init
  target.addEventListeners();
};

export default marionetteViewMixin;

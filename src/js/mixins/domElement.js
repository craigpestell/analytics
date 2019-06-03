import { EVENT_TYPE } from '../util/constants';
import Analytics from '../analytics';
import { listeners, intersectionObserver } from '../listeners';

export const domElementMixin = (target) => {
  const getDomElements = (document) => {
    const applicableElements = target.selectorIsId ? [document.getElementById(target.selector)] : document.querySelectorAll(target.selector);
    return Array.from(applicableElements).filter(el => el != null);
  };

  const getMixin = () => ({
    getEl() {
      return getDomElements(document);
    },

    addEventListeners() {
      if (target.selector) {
        let addEventListener;
        switch (target.type) {
          case EVENT_TYPE.impression:
            target.listener = listeners.impress(target);
            addEventListener = (el) => {
              intersectionObserver.observe(el);
              el.addEventListener('observed', target.listener);
            };
            break;
          case EVENT_TYPE.link:
          default:
            target.listener = listeners.click(target);
            addEventListener = (el) => {
              el.addEventListener('click', target.listener);
            };
            break;
        }
        // attach listener to each dom element.
        this.getEl().forEach((el) => {
          addEventListener(el);
        });
      }
    },
  });

  Object.assign(target, getMixin());

  // init.
  Analytics.documentReady(() => {
    target.addEventListeners();
  });
};

export default domElementMixin;


const observedEvent = new Event('observed');
export const intersectionObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        entry.target.dispatchEvent(observedEvent);
        observer.unobserve(entry.target);
      } else {
      // If intersectionRatio is 0, the element is out of view
      // and we do not need to do anything.

      }
    });
  },
  {
  // root: document.querySelector('.sortableGrid'),
    threshold: [1.0],
    trackVisibility: true,
    delay: 1000,
  },
);

export default {
  click: event => (function clickListener(e) {
    return event.track(e);
  }),
  impress: event => (function impressionListener(e) {
    return event.fetch(e).then((result) => {
      event.track(e).then((result) => {
        console.log('track result:', { result });
      });
    });
  }),
};

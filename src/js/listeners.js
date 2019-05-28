const observedEvent = new Event('observed');
export const intersectionObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        entry.target.dispatchEvent(observedEvent);
        observer.unobserve(entry.target);
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

const domListener = (event) => {
  console.log('return domListener')
  return (e) => {
    console.log('return fetch')
    return event.fetch(e).then((result) => { 
      console.log('return track')
      return event.track(e);
    });
  }
}

export default {
  view: domListener,
  click: domListener,
  impress: domListener
}
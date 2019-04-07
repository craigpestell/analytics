

const observedEvent = new Event('observed');

export default new IntersectionObserver((entries) => {
  // If intersectionRatio is 0, the element is out of view
  // and we do not need to do anything.
  if (entries[0].intersectionRatio <= 0) {
    return;
  }
  entries[0].target.dispatchEvent(observedEvent);
});


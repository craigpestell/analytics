export const OBSERVER_TYPE = Object.freeze({
  CONFIGURE: 'configure',
});

export const EVENT_TYPE = Object.freeze({
  [Symbol.toPrimitive]: hint => this.name,
  view: 'view', // Tealium page view event
  link: 'link', // Tealium link event
  impression: 'impression', // IntersectionObserver event - we should report this as a 'link' event to Tealium.
  analytics: 'EVENT_TYPE.analytics', // Internal analytics event
});

export default { OBSERVER_TYPE, EVENT_TYPE };

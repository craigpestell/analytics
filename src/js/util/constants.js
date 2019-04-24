
export const OBSERVER_TYPE = Object.freeze({
  CONFIGURE: "configure"
});



export const EVENT_TYPE = Object.freeze ({
  view: 'view', // Tealium page view event
  link: 'link', // Tealium link event
  impression: 'EVENT_TYPE.impression',
  analytics: 'EVENT_TYPE.analytics', // Internal analytics event
});


export default { OBSERVER_TYPE, EVENT_TYPE };
/**
 * TagManager analytics integration
 */

import TagManagerUtil from '@component/common/src/util/TagManagerUtil';

const inBrowser = typeof window !== 'undefined';

const config = {
  assumesPageview: true,
};

export default function TagManagerPlugin(userConfig) {

  const tealiumTrack = (eventType, data) => {
    console.log(`TagManager Event > [${event}]`, data);
    if (inBrowser && typeof utag !== 'undefined') {
      TagManagerUtil.fireTag(eventType, data);
    }
  }

  return {
    NAMESPACE: 'tag-manager',
    config: Object.assign({}, config, userConfig),
    initialize: ({ config }) => {
      const { brand = 'mcom', env = 'dev' } = config;
      const brandParam = brand == 'bcom' ? 'bloomingdales' : 'macys';
      const { siteID } = config;
      
      if (inBrowser && typeof utag === 'undefined') {
        window.utag_cfg_ovrd = { noview: true };
        // Loading script asynchronously
        // https://tags.tiqcdn.com/utag/macys/main/prod/utag.js
        (function (a, b, c, d) {
          a = `https://tags.tiqcdn.com/utag/${brandParam}/main/${env}/utag.js`;
          b = document; c = 'script'; d = b.createElement(c); d.src = a; d.type = `text/java${c}`; d.async = true;
          a = b.getElementsByTagName(c)[0]; a.parentNode.insertBefore(d, a);
        }());
      }
    },
    page: ({ payload }) => {
      tealiumTrack('view', payload.properties);
    },
    track: ({ payload }) => {
      const event = payload.event == 'view' ? 'view' : 'link';
      tealiumTrack(event, payload.properties);
    },
    loaded: () => !!(window.utag && window.utag.id),
  };
}

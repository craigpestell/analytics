/**
 * TagManager analytics integration
 */

import TagManagerUtil from '@component/common/src/util/TagManagerUtil';

const inBrowser = typeof window !== 'undefined';

export default function TagManagerPlugin(config = {}) {
  const tealiumTrack = (eventType, data) => {
    // eslint-disable-next-line no-console
    console.log(`TagManager Event > [${eventType}]`, data);
    if (inBrowser && typeof utag !== 'undefined') {
      TagManagerUtil.fireTag(eventType, data);
    }
  };

  return {
    NAMESPACE: 'tag-manager',
    config,
    initialize: () => {
      const { brand = 'mcom', env = 'dev' } = config;
      const brandParam = brand === 'bcom' ? 'bloomingdales' : 'macys';

      if (inBrowser && typeof utag === 'undefined') {
        window.utag_cfg_ovrd = { noview: true };
        // Loading script asynchronously
        // https://tags.tiqcdn.com/utag/macys/main/prod/utag.js

        /* eslint-disable */
        (function(a, b, c, d) {
          a = `https://tags.tiqcdn.com/utag/${brandParam}/main/${env}/utag.js`;
          b = document;
          c = 'script';
          d = b.createElement(c);
          d.src = a;
          d.type = `text/java${c}`;
          d.async = true;
          a = b.getElementsByTagName(c)[0];
          a.parentNode.insertBefore(d, a);
        })();
        /* eslint-enable */
      }
    },
    page: ({ payload }) => {
      tealiumTrack('view', payload.properties);
    },
    track: ({ payload }) => {
      const event = payload.event === 'view' ? 'view' : 'link';
      tealiumTrack(event, payload.properties);
    },
    loaded: () => !!(window.utag && window.utag.id),
  };
}

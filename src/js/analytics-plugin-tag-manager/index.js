/**
 * TagManager analytics integration
 */
/* global utag */
import TagManagerUtil from '@component/common/src/util/TagManagerUtil';

const inBrowser = typeof window !== 'undefined'

const config = {
  assumesPageview: true
}

export default function TagManagerPlugin(userConfig) {
  return {
    NAMESPACE: 'tag-manager',
    config: Object.assign({}, config, userConfig),
    initialize: ({ config }) => {
      const {brand, env} = config
      const { siteID } = config
      if (!brand) {
        throw new Error('No TagManager brand defined')
      }
      if (!env) {
        throw new Error('No TagManager env defined')
      }
      if (inBrowser && typeof utag === 'undefined') {
        window.utag_cfg_ovrd = {noview : true};
        //Loading script asynchronously
        (function(a,b,c,d){
                a='//tags.tiqcdn.com/utag/{{properties.brand}}/main/{{properties.tagEnv}}/utag.js';
                b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;
                a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);
        })();
      }
    },
    page: ({ payload }) => {
      if (inBrowser && typeof utag !== 'undefined') {
        console.info(`TagManager Pageview > [payload: ${JSON.stringify(payload, null, 2)}]`)
        TagManagerUtil.fireTag('view', payload.properties);

        // utag.page(document.location.href, payload.properties) // eslint-disable-line
      }
    },
    track: ({ payload }) => {
      if (inBrowser && typeof utag !== 'undefined') {
        const msg = `TagManager Event > [${payload.event}] [payload: ${JSON.stringify(payload, null, 2)}]`
        console.log(msg)
        TagManagerUtil.fireTag('link', payload.properties);
        // _cio.track(payload.event, payload.properties)
        
      }
    },
    identify: ({ payload }) => {

      const { id, traits } = payload
      if (inBrowser && typeof utag !== 'undefined') {
        console.log('do TagManager identify', id, traits)
        // _cio.identify({
        //  id: id,
        //  ...traits
        //})
      }
    },
    loaded: () => {
      return !!(window.utag && window.utag.id)
    }
  }
}
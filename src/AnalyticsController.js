import Analytics from 'analytics'
// import googleAnalytics from 'analytics-plugin-ga'
import TagManagerPlugin from './plugins/analytics-plugin-tag-manager';
import TagDataPlugin from './plugins/analytics-plugin-tag-manager';
import AdobeViaTealium from './plugins/adobe-analytics-via-tealium';
import lifecycleExample from './plugins/analytics-plugin-lifecycle-example'
import visualizeLifecycle from './plugins/visualize-analytics'

const options = {brand: 'mcom', debug: true};

function listenerPlugin(userConfig) {
  
  return {
    NAMESPACE: 'analytics',
    bootstrap: ({ payload, config, instance }) => {
      // Do whatever on `bootstrap`
      // all non-anchor element links on marketing-campaigns (have data attribute 'linktrack')
      /*{
        selector: 'a[data-linktrack]',
        events: {link: true},
        data: { link: e => (new Promise((resolve) =>{resolve({link_name: e.srcElement.dataset.linktrack})}))}
      }*/
      const thisElList = document.querySelectorAll('a[data-linktrack]');
      const elListArr = Array.from(thisElList);
      
      if (thisElList && elListArr.length) {
        const elList = elList.length ? elList.concat(elListArr) : elListArr;
        
      }
    },
    pageStart: ({ payload, config, instance }) => {
      // Fire custom logic before .page calls
    },
    pageEnd: ({ payload, config, instance }) => {
      // Fire custom logic after .page calls
      

    },
    trackStart: ({ payload, config, instance }) => {
      // Fire custom logic before .track calls
      console.log('trackStart event.. put custom login here.');
    },
    'track:analytics': ({ payload, config, instance }) => {
      // Fire custom logic before customer.io plugin runs.
      // Here you can customize the data sent to individual analytics providers
      console.log('track:analytics event:', payload.payload);
    },
    'track:adobe-via-tealium': ({ payload, config, instance }) => {
      // Fire custom logic before adobe-via-tealium plugin runs.
      // Here you can customize the data sent to individual analytics providers
      console.log('track:adobe-via-tealium event:', payload.payload);
    },

    ctaSuccess: ({ payload, config, instance }) => {
      // Fire custom logic before .track calls
      console.log('ctaSuccess event:', payload);
    },

    track: ({ payload, config, instance }) => {
      // Fire custom logic after .track calls
      const { properties, event } = payload;
      
    },
    trackEnd: ({ payload, config, instance }) => {
      // Fire custom logic after .track calls
      const { properties, event } = payload;
      async function trackAdobe(payload) {
        await window.Analytics.dispatch({type: 'analytics', properties, event});
      }
      // dispatch final payload to adobe
      return trackAdobe({type: 'adobe-via-tealium', properties, event});
      // dispatch final payload to adobe
      // window.Analytics.dispatch({type: 'adobe-via-tealium', properties, event});
    },
  }
}

if(!window.Analytics) {
  /* initialize analytics and load plugins */
  const analytics = Analytics({
    // debug: options && options.debug,
    exposeRedux: true,
    app: 'digital-analytics',
    version: 100,
    plugins: [
      listenerPlugin(),
      AdobeViaTealium(),
      lifecycleExample()
      /* TagManagerPlugin({
        env: 'dev', 
        brand: options.brand || 'bcom'
      }),*/
      // TagDataPlugin
    ]
  })

  let listenerHistory = {
    '*': [],
    trackStart: [],
    page: [],
    customEvent: []
  }

  window.Analytics = analytics

}

// start listeners...
/* export analytics for usage through the app */
export default window.Analytics;

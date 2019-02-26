import TagManagerUtil from '@component/common/src/util/TagManagerUtil';
export default function adobeViaTealium(userConfig) {
  return {
    NAMESPACE: 'adobe-via-tealium',
    
    bootstrap: ({ payload, config, instance }) => {
      console.log('PLUGIN bootstrapping adobe-analytics-via-tealium');
      // Do whatever on `bootstrap`
      instance.on('pageStart:adobe-via-tealium', () => {
        console.log('PLUGIN on("pageStart:adobe-via-tealium") handler')
      });

      instance.on('adobe-via-tealium', () => {
        console.log('PLUGIN instance.on("adobe-via-tealium") handler')
      });

    },
    
    pageStart: ({ payload, config, instance }) => {
      // Fire custom logic before .page calls
    },
    /*
    pageEnd: ({ payload, config, instance }) => {
      // Fire custom logic after .page calls
    },
    trackStart: ({ payload, config, instance }) => {
      // Fire custom logic before .track calls
      console.log('trackStart event.. put custom login here.');
    },
    
    trackEnd: ({ payload, config, instance }) => {
      // Fire custom logic after .track calls

      // dispatch final payload to adobe
    
    },*/

    'adobe-via-tealium': ({ payload, config, instance }) => {
      // Send data to Tealim with TagManager
      const {event, properties} = payload;
      
      const viewEvents = [];
      const linkEvents = ['ctaSuccess'];

      let adobeEventType = 'link';

      if(viewEvents.includes(event)){
        adobeEventType = 'view';
      }
      console.log(`Analytics: >> TagManagerUtil.fireTag('${adobeEventType}', '${properties}');`)
      TagManagerUtil.fireTag(adobeEventType, properties );
    },
    'track:adobe-via-tealium': ({ payload, config, instance }) => {
      // Fire custom logic before adobe-via-tealium plugin runs.
      // Here you can customize the data sent to individual analytics providers
      console.log('PLUGIN track:adobe-via-tealium event:', payload.payload);

    },



  }
}

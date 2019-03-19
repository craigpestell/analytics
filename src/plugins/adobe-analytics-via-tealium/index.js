import TagManagerUtil from '@component/common/src/util/TagManagerUtil';

const adobeViaTealium = store => next => action => {
  if (action.type) {
    
    if(action.event === 'product:clicked'){
      // Construct the data for Tealium/Adobe based on payload (which will be data returned by fetch promise map)
      console.log('PLUGIN adobe-analytics-via-tealium: event:', action.event);

    }
  }
  console.log('next:', next);
  let result = next(action);
  return result
}

export default adobeViaTealium
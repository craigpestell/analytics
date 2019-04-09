import analytics from 'redux-analytics';
import TagManagerUtil from '@component/common/src/util/TagManagerUtil';

export default middleware = analytics(({ payload }) => {
  
  const eventType = payload.event_type;
  console.log(`redux-analytics middleware; calling TagManagerUtil.fireTag("${eventType}", ${JSON.stringify(payload)}`)
  TagManagerUtil.fireTag(eventType, payload)
});

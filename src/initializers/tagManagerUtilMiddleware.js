import analytics from 'redux-analytics';
import TagManagerUtil from '@component/common/src/util/TagManagerUtil';

const analyticsMiddleware = analytics (({type, payload}) => {
  console.log ('tagManagerUtilMiddleware:', {type, payload});
  TagManagerUtil.fireTag (type, payload);
});

export default analytics(store => next => action => {
  console.log ('analyticsMiddleWare:', {action, analyticsMiddleware});
  
  /*if (action.type === '@@router/LOCATION_CHANGE') {
      const nextPage = `${action.payload.pathname}${action.payload.search}`;
  
      //trackPage(nextPage, store.getState());
    }*/
  return next (action);
});

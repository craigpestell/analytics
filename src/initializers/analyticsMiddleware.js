export default analyticsMiddleware = store => next => action => {
  // console.log('analyticsMiddleWare:', {action});
  /*if (action.type === '@@router/LOCATION_CHANGE') {
    const nextPage = `${action.payload.pathname}${action.payload.search}`;

    //trackPage(nextPage, store.getState());
  }*/
  return next(action);
};

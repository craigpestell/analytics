
// import { createAsyncAction } from 'redux-promise-middleware-actions';
import {ACTIONS, EVENTS} from '../util';
import AnalyticsService from '../AnalyticsService';

console.log('AnalyticsService:', AnalyticsService);

/* export function receiveProduct(json) {
  console.log('receiving product json:', json);
  return {
    type: 'RECEIVE_PRODUCT_FETCH',
    payload: json
  }
}*/

/*
 * action creators
 */
// console.log('fetData action:', fetchData);
export const requestProductById = (id = 6994596) => ({
  type: ACTIONS.Product.fetch.toString(),
  payload: () =>(new Promise((resolve) => { resolve(fetch(`https://www.macys.com/xapi/discover/v1/product?productIds=${id}&id=3304&_application=SITE&_navigationType=BROWSE&_deviceType=DESKTOP&_shoppingMode=SITE&_regionCode=US&_customerExperiment=271-22,291-20,297-20,352-20&currencyCode=USD&_customerState=SIGNED_IN&clientId=QV`))}))
    //.then(response => re  sponse.json())
    //.then(json => ({ image: json.message, ...json })),
});
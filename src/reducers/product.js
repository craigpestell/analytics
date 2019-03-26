import store from '../analytics';

import { asyncReducer } from 'redux-promise-middleware-actions';
import { Product } from '../actions';
import { ACTIONS, EVENTS } from '../util';


/*const fetchReducer = asyncReducer(Product.fetchData);
export default (state = null, action) => {
  console.log('product reducer action:', action);
    switch (action.type) {
      case `${ACTIONS.Product.fetch.toString()}`:
      console.log('inside Product reducer fetch');
      return Promise.resolve('lets get it tiger');
      case `${ACTIONS.Product.fetch.toString()}_PENDING`:
      return Promise.resolve('hi');

    case `${ACTIONS.Product.fetch.toString()}_FULFILLED`:
      return {
        isFulfilled: true,
        data: action.payload
      };

    case `${ACTIONS.Product.fetch.toString()}_REJECTED`:
      return {
        isRejected: true,
        error: action.payload
      };
    case EVENTS.Product.clicked.toString(): 
      return Object.assign({}, state, {product: action.payload});
    default:
      return state;
  }
};
*/
export default productReducer = (state = {}, action) => {
  switch(action.type) {
    case `${ACTIONS.Product.fetch}`:
      return  {};
    case `${ACTIONS.Product.fetch.toString()}_FULFILLED`:
      console.log('fulfilled...');
      return {
        isFulfilled: true,
        data: action.payload
      };

    case `${ACTIONS.Product.fetch.toString()}_REJECTED`:
      console.log('rejected');
      return {
        isRejected: true,
        error: action.payload
      };
    case `${ACTIONS.Product.fetch.toString()}_PENDING`:
      console.log('pending...');
    
    default: return state;
  }
}
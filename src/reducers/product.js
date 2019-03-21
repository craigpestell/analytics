import { EVENTS } from '../util/events';
console.log('eventtypes:', EVENTS);
export default function reducer(state = {}, action) {
    /*  */
    console.log('reducer state:', state);
    console.log('action:', action)
    switch (action.type) {
      case EVENTS.DOM.Element.clicked:
        return Object.assign({}, state, {context: action.payload});
      case EVENTS.Product.clicked: 
        return Object.assign({}, state, {product: action.payload});
      default:
        return state;
    }
  } 

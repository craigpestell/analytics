
import enumValue from '../util/enumValue';
import { createAsyncAction } from '../util/async';

import {ACTION_TYPES } from '../util/actions';

console.log('actions:', ACTION_TYPES);

/*
 * action types
 */



/*
 * action creators
 */
function requestProduct() {
    return fetch(`https://www.reddit.com/latest.json`).then(
      response => response.json(),
      error => console.log("An error occured.", error)
    );
  }

export const fetch = createAsyncAction(
    ACTION_TYPES.Product.fetch.request,
    requestProduct
)


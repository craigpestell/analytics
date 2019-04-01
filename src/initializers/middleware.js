//
// Add async middleware, and other "core" middleware that
// you choose to. `applyMiddleware` creates an enhancer,
// so we can export that under `enhancers`.
//
// SEE
// https://github.com/gaearon/redux-thunk
// https://github.com/pburtchaell/redux-promise-middleware
//
import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware';
import analyticsMiddleware from './analyticsMiddleware';
import tagManagerUtilMiddleware from './tagManagerUtilMiddleware';

console.log( {tagManagerUtilMiddleware,promiseMiddleware,analyticsMiddleware});

const middleware = [
  analyticsMiddleware,
  tagManagerUtilMiddleware,
  thunk,
  promiseMiddleware,
  
]

export default {
  name: 'middleware',
  enhancers: [applyMiddleware(...middleware)],
}

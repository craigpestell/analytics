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
import { createPromise } from 'redux-promise-middleware';
const promise = createPromise({ types: { fulfilled: 'success' } });

const middleware = [
  promise,
  thunk,
]

export default {
  name: 'middleware',
  enhancers: [applyMiddleware(...middleware)],
}

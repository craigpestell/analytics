import {createStore, combineReducers} from 'redux';
import {buildStack} from 'redux-stack';
import {ACTIONS} from './util';
import {Analytics as AnalyticsActions} from './actions';

import stack from './initializers';

export {default as AnalyticsBehavior} from './AnalyticsBehavior';
export {default as AnalyticsService} from './AnalyticsService';
export {ACTIONS, EVENTS} from './util';

const TagManagerUtil = {
  fireTag(type, data){
    console.log('firing tag:', {type, data});
  }
}

const initialState = {};
const {reducers, enhancer} = buildStack (stack);
const store = createStore (combineReducers (reducers), initialState, enhancer);

const controller = {
  dispatch: store.dispatch,
  configure: config => {
    Object.entries (config).map (([key, value]) => {
      const type = `ACTIONS.Analytics.${key}`;
      switch (type) {
        case ACTIONS.Analytics.domEvents.toString ():
          AnalyticsActions.domEvents (value);
          return;
        default:
          return;
      }
    });
  },

  // add one or possibly more event listeners to track.  options.events is a object map of dom events to track (or functions to resolve to elements to track???)
  addEventListeners: config => {
    return store.dispatch ({
      type: AnalyticsActions.domEvents.toString (),
      payload: config,
    });
  },
  onAddEventListenerSuccess: (value, action) => {
    console.log ('eventListenerSuccess data:', value);
    const {el} = value;
  },
  addEventListener: (elSelector, event, dataMap) => {
    const el = document.querySelector (elSelector);
    switch (event) {
      case 'click':
        const trackClickEventListener = e => {
          const keys = Object.keys (dataMap);
          const values = keys.map (key => dataMap[key]);

          // where all the magic happens.
          store.dispatch ({
              type: ACTIONS.Analytics.fetchMap.toString(),
              payload: Promise.all (values).then (resolvedValues => {
                const resolvedHash = {};
                keys.forEach ((key, index) => {
                  resolvedHash[key] = resolvedValues[index] (e);
                });
                return resolvedHash;
              }),
            })
            .then (({value, action}) => {
              return store.dispatch ({
                type: ACTIONS.Analytics.track.toString (),
                payload: new Promise (resolve =>
                  resolve ({el, event, fetchedData: value})
                ),
              });
            })
            .then (({value, action}) => {

              console.log ('after track: ', {value, action});
              const {event, fetchedData} = action.payload;
              const tealiumEvent = (event === 'click' ? 'link': 'vien');
              TagManagerUtil.fireTag(tealiumEvent, fetchedData)
            });

          // onAddEventListenerSuccess ({value, action});
        };

        el.addEventListener ('click', trackClickEventListener);
        return true;

      default:
        return;
    }
  },
  track: (type, data) => {
    // call TagManagerUtil for now..
    console.log ('CALL TagManagerUtil.fireTag(', type, ', ', data, ')');
    TagManagerUtil.fireTag(type, data);
  },
};

export {controller as AnalyticsController, store};

export default store;

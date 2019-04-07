import {createStore, combineReducers} from 'redux';
import {buildStack} from 'redux-stack';
import {ACTIONS} from './util';
import {Analytics as AnalyticsActions} from './actions';

import stack from './initializers';
import intersectionObserver from './util/IntersectionObserver';
import actions from './util/actions';

export {default as AnalyticsBehavior} from './AnalyticsBehavior';
export {default as AnalyticsService} from './AnalyticsService';
export {ACTIONS, EVENTS} from './util';
export {ACTIONS as ANALYTICS_ACTIONS, EVENTS as ANALYTICS_EVENTS} from './util';

const TagManagerUtil = {
  fireTag (type, data) {
    console.log ('firing tag:', {type, data});
  },
};

const initialState = {};
const {reducers, enhancer} = buildStack (stack);
const store = createStore (combineReducers (reducers), initialState, enhancer);

const controller = {
  dispatch: store.dispatch,
  configure: config => {
    
    const configureDomEvents = (config) =>{
      
      Object.entries (config).map (([key, value]) => {
        const type = `ACTIONS.Analytics.${key}`;
        switch (type) {
          case ACTIONS.Analytics.domEvents.toString ():
            AnalyticsActions.configureDomEvents (value);
            return;
          
          default:
            return;
        }
      });
    }

    const configureEvents = (config) =>{
      console.log({config})
      
      Object.entries (config).map (([key, value]) => {
        if( /^EVENT./.test(key)) {

          console.log('configuring event: ', {key, value})
          return store.dispatch ({
            type: AnalyticsActions.addEventListener.toString (),
            payload: config,
          });

        }
        
        
      });
    }

    configureDomEvents(config);

    configureEvents(config);
  },

  addEvent: (type, dataMap) => {
    return store.dispatch ({
      type: ACTIONS.Analytics.event.add.toString (),
      payload: {type, dataMap},
    });
  },
  updateEvent:(type, dataMap )=> {
    return store.dispatch ({
      type: ACTIONS.Analytics.event.update.toString (),
      payload: {type, dataMap},
    });
  },

  // add one or possibly more event listeners to track.  options.events is a object map of dom events to track (or functions to resolve to elements to track???)
  addEventListeners: config => {
    return store.dispatch ({
      type: AnalyticsActions.trackDomEvents.toString (),
      payload: config,
    });
  },
  onAddEventListenerSuccess: (value, action) => {
    console.log ('eventListenerSuccess data:', value);
    const {el} = value;
  },
  addEventListener: (elSelector, event, dataMap) => {
    
    const trackEvent = e => {
      const keys = Object.keys (dataMap);
      const values = keys.map (key => dataMap[key]);

      // where all the magic happens.
      store
        .dispatch ({
          type: ACTIONS.Analytics.fetchMap.toString (),
          payload: Promise.all (values).then (resolvedValues => {
            const resolvedHash = {};
            keys.forEach ((key, index) => {
              console.log('resolving entity promises...', {key, index, resolvedHash, resolvedValues})
              if(typeof resolvedValues[index] === 'function') {
                // For now we'll assume if the provided dataMap is a function, it's an event listener that can accept an event parameter
                resolvedHash[key] = resolvedValues[index] (e);
              }else{
                resolvedHash[key] = resolvedValues[index];
              }

            });
            return resolvedHash;
          }),
        })
        .then (({value, action}) => {
          return store.dispatch ({
            type: ACTIONS.Analytics.event.track.toString (),
            meta: {
              analytics: {
                type: 'my-analytics-event',
                payload: new Promise (resolve =>
                  resolve ({el, event, fetchedData: value})
                )
              }
            },
            payload: new Promise (resolve =>
              resolve ({el, event, fetchedData: value})
            )
          });
        })
        .then (({value, action}) => {
          console.log ('after track: ', {value, action});
          const {event, fetchedData} = action.payload;
          const tealiumEvent = event === 'click' ? 'link' : 'vien';

          // TODO: use our own abstraction instead
          TagManagerUtil.fireTag (tealiumEvent, fetchedData);
        });

      // onAddEventListenerSuccess ({value, action});
    };

    const el = document.querySelector (elSelector);

    switch (event) {
      case 'view': 
        // The page view
        if (elSelector === 'html') {
          window.addEventListener('load', trackEvent)
        }else{
          // a feature or component is viewed when in the user's viewport.
          el.addEventListener('observed', trackEvent);
          intersectionObserver.observe(el);
        }
      case 'click':
        el.addEventListener ('click', trackEvent);
        return true;

      default:
        return;
    }
  },
  track: (type) => {
    return store.dispatch(
      AnalyticsActions.fetchMap(type))
        .then(({value, action}) => store.dispatch ({
          type:ACTIONS.Analytics.event.track.toString(),
          payload: {type: value.type, payload: action.payload}
        }))

  },

  fireTag: (type, data) => {
    TagManagerUtil.fireTag (type, data);
  }
};

export {controller as AnalyticsController, store};

export default store;

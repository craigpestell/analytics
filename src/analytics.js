import {createStore, combineReducers} from 'redux';
import {buildStack} from 'redux-stack';
import {ACTIONS} from './util';
import {Analytics as AnalyticsActions} from './actions';
import {Event as EventActions} from './actions';

import stack from './initializers';
import intersectionObserver from './util/IntersectionObserver';

import selectCurrentEventDataMap from './reducers/event';

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
            payload: {...config, event: value},
          });

        }
        
        
      });
    }

    configureDomEvents(config);

    configureEvents(config);
  },

  addEvent: (event, dataMap) => {
    event.dataMap = Object.assign(event.dataMap, dataMap);
    return store.dispatch ({
      type: ACTIONS.Analytics.event.add.toString (),
      payload: {event, dataMap},
    });
  },
  updateEvent:(type, dataMap )=> {
    event.dataMap = Object.assign(event.dataMap, dataMap);
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
  /**
   * @param event (Object) see @root/src/util/events.js
   */
   
  track: (event, e) => {
    const currentEvent = event;

    console.log("AnalyticsController.track:", {currentEvent});
    const currentDataMap = selectCurrentEventDataMap(store.getState());
    console.log({currentDataMap});
    return store.dispatch(
      AnalyticsActions.fetchMap(event, e))
        .then(({value, action}) => {
          const {payload} = action;
          const resultsArray = payload; // or value;

          console.log({resultsArray});
          console.log('track fetchMap results:', {value, action})
          const resolvedData = resultsArray.reduce((prev, curr, currIdx) => {
            console.log('reducing......:', curr)
            const {payload} = curr;
            const {entity} = payload;
            let fetch = payload.fetch;
            // handle quick-view fetch returning jQuery deferred.
            if(fetch.promise){
              fetch = fetch.promise;
            }
            const entityPayload = {[entity]: fetch()};
            prev[currIdx] =  entityPayload;
            return entityPayload;
          }, {});
          console.log({resolvedData});
          const keys = Object.keys (resolvedData);
          const values = keys.map (key => resolvedData[key]);

          store.dispatch({
            type: ACTIONS.Analytics.fetchEntity,
            payload: Promise.all(Object.entries(resolvedData).reduce((prev, curr, currIdx) => {
              prev[currIdx] = curr;
              return prev;
            }, []))
          })
          // combine data pased in with resolved promise map..
          // that should all happen in the reducer...
          store.dispatch ({
            type: ACTIONS.Analytics.event.track.toString(),
            payload: resolvedData,
            // passing an analytics object in meta will trigger analyticsMiddleware which abstracts our vendor lib.
            meta: {
              analytics: {
                type: event.name,
                payload: {data: resolvedData, event_type: event.type.toString()}
              }
            }
          })
        })
  },

  fireTag: (type, data) => {
    TagManagerUtil.fireTag (type, data);
  },

  startTest:(test = 1) => {
    EventActions.startTest(test);
  }

};


export {controller as AnalyticsController, store};

export default store;


// controller.startTest()
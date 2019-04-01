import {
  createAction,
  createAsyncAction,
} from 'redux-promise-middleware-actions';

import store from '../analytics';

import { ACTIONS } from '../util';
import { AnalyticsController } from '../analytics';
import CssSelectorGenerator from 'css-selector-generator';

export const foo = createAction ('FOO', num => num);
/* export const addEventListener = createAction (
  ACTIONS.Analytics.addEventListener.toString (),
  ({el, data, events}) => {
    console.log ({el, data, events});
    return true;
  }
);*/

export const domEvents = domEventsConfig => {
  const selectorGen = new CssSelectorGenerator();
  let domEventActions = [];
  domEventsConfig.forEach (elConfig => {
      const applicableElements = elConfig.selectorIsId
        ? [document.getElementById (elConfig.selector)]
        : document.querySelectorAll (elConfig.selector);
      const filteredEls = Array.from (applicableElements).filter (
        el => el != null
      );

      const {events} = elConfig;

      function elementEventActions (el, events) {
        const eventsArr = Object.entries (events);
        eventsArr.forEach (([event, value]) => {
          domEventActions.push({
            type: ACTIONS.Analytics.addEventListener.toString(),
            payload: {
              el: selectorGen.getSelector(el),
              data: elConfig.data,
              event,
            },
          });
        });
      }
      filteredEls.forEach (el => {
        elementEventActions (el, events)
      });
  });

  return store
    .dispatch ({
      type: ACTIONS.Analytics.domEvents.toString (),
      payload: Promise.all (domEventActions.map((action) => (store.dispatch(action)))),
    })
    .then (({value, action}) => {
      //actually add the event listeners to the DOM.
      value.forEach(({payload}) => {
        const {data, el, event} = payload;
        AnalyticsController.addEventListener(el, event, data);
      })
    });
};

const bar = () => ({
  type: 'ACTIONS.Analytics.bar',
  payload: {'bar': 'foo'}
})

export const fetchMap = dataMap => {
  function fetchMapAction(dataMap) {
    return store.dispatch({
      type: ACTIONS.Analytics.fetchMap.toString (),
      payload: Promise.all (
        dataMap.map (([value, key]) => {
          console.log ('track promise.all value,key:', value, key);
        })
      ),
    }).then (() => dispatch (bar ()));
  }
  console.log({dataMap});
  fetchMapAction(dataMap)
}

export const fetchEntity = entity => {
  return store.dispatch ({
      type: ACTIONS.Analytics.fetchEntity.toString (),
      payload: entity,
    }).then (() => dispatch (bar ()));
  };

export const track = action => {
  return store.dispatch({
      type: ACTIONS.Analytics.track.toString (),
      meta: {
        analytics: {
          type: 'my-analytics-event',
          payload: action.payload
        }
      },
      payload: new Promise (),
    }).then (() => dispatch (bar ()));
};

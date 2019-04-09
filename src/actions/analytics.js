import {
  createAction,
  createAsyncAction,
} from 'redux-promise-middleware-actions';
import store from '../analytics';

import {ACTIONS, EVENTS} from '../util';
import {AnalyticsController} from '../analytics';
import CssSelectorGenerator from 'css-selector-generator';
import promise from 'redux-promise-middleware';

export const trackDomEvents = domEventsConfig => {
  const selectorGen = new CssSelectorGenerator ();
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
        domEventActions.push ({
          type: ACTIONS.Analytics.addEventListener.toString (),
          payload: {
            el: selectorGen.getSelector (el),
            data: elConfig.data,
            event,
          },
        });
      });
    }
    filteredEls.forEach (el => {
      elementEventActions (el, events);
    });
  });

  return store
    .dispatch ({
      type: ACTIONS.Analytics.domEvents.toString (),
      payload: Promise.all (
        domEventActions.map (action => store.dispatch (action))
      ),
    })
    .then (({value, action}) => {
      //actually add the event listeners to the DOM.
      value.forEach (payload => {
        const {data, el, event} = payload;
        AnalyticsController.addEventListener (el, event, data);
      });
    });
};

const bar = () => ({
  type: 'ACTIONS.Analytics.bar',
  payload: {bar: 'foo'},
});

export const fetchMap = (event, e) => {

  const entityActions =
    Object.entries(event.dataMap).map (entry => ({type: ACTIONS.Analytics.fetchEntity.toString(),
    payload: {entity: entry[0], fetch: entry[1](e)}})
  );
  console.log({entityActions});
  return {
    type: ACTIONS.Analytics.event.fetchMap.toString (),
    payload: Promise.all (
      entityActions.map (action => store.dispatch (((action) => {
        console.log({action});
        return action;
      })(action)))
    )
  }
};

export const fetchEntity = entity => {
  return store
    .dispatch ({
      type: ACTIONS.Analytics.fetchEntity.toString (),
      payload: entity,
    })
    .then (() => dispatch (bar ()));
};

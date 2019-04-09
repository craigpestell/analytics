import { createSelector } from 'reselect'

import ACTIONS from '../util/actions';
import EVENTS from '../util/events';
import { serializeFunction, deserializeFunction }from '../util';

const initialState = {
  ['Events are registered here']:undefined
}

function reducer (state = initialState, action = {type: 'select'}) {
  //const newState = domEventsReducer ((state = initialState), action);
    
  switch (action.type) {
    case ACTIONS.Analytics.event.fetchMap.toString():
    {
      const {dataMap} = state[type];
      console.log(ACTIONS.Analytics.event.fetchMap.toString(), {action, dataMap})
      return {
        ...state,
        currentEvent: type
      }
    }
    case `${ACTIONS.Analytics.event.fetchMap.toString()}_PENDING`:
    {
      const {dataMap} = payload;
      console.log(`${ACTIONS.Analytics.event.fetchMap.toString()}_PENDING`, {action, dataMap})
      return {
        ...state,
        fetchingDataMap: dataMap
      }
    }
    case `${ACTIONS.Analytics.event.fetchMap.toString()}_FULFILLED`:
    {
      const {dataMap} = payload;
      console.log(`${ACTIONS.Analytics.event.fetchMap.toString()}_FULFILLED`, {action, dataMap})
      return {
        ...state,
        fetchedDataMap: dataMap
      }
    }

    case ACTIONS.Analytics.event.fetchEntity.toString():
    {
      const {entity} = state[type];
      console.log(ACTIONS.Analytics.event.fetchMap.toString(), {action, entity})
      return {
        ...state,
        currentEntity: type
      }
    }
    case `${ACTIONS.Analytics.event.fetchEntity.toString()}_PENDING`:
    {
      const {type} = payload;
      const {entity} = state[type];
      console.log(`${ACTIONS.Analytics.event.fetchEntity.toString()}_PENDING`, {action, entity})
      return {
        ...state,
        fetchingEntity: entity.name
      }
    }
    case `${ACTIONS.Analytics.event.fetchEntity.toString()}_FULFILLED`:
    {
      const {type} = payload;
      const {entity} = state[type];
      console.log(`${ACTIONS.Analytics.event.fetchEntity.toString()}_FULFILLED`, {action, entity})
      return {
        ...state,
        fetchedEntity: entity.name
      }
    }

    case ACTIONS.Analytics.event.add.toString():
    {
      console.log(ACTIONS.Analytics.event.add.toString(), {action})
      const {payload} = action;
      const {event, dataMap} = payload;
      const serializedDataMap = serializeFunction(dataMap);
      let newState = Object.assign({}, state, {
        [event.name]: {
          'dataMap': serializedDataMap
        }
      });
      return newState;
    }
    case ACTIONS.Analytics.event.track.toString():
      /*
        construct the data to send to analytics vendor library.

      */
      console.log('Actions.Analytics.event.track reducer', {action})
      return {
        ...state, 
      }
    default:
      return state;
  }
}

const selectEvents = (state) => {
  return state;
}
const selectCurrentEvent = (state) => {
  return state.currentEvent;
}

export const selectCurrentEventDataMap = createSelector(selectCurrentEvent, 
  (currentEvent) => deserializeFunction(currentEvent.dataMap));

export default reducer;
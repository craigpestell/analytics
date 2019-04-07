import ACTIONS from '../util/actions';
import EVENTS from '../util/events';

const initialState = {
  ['Events are registered here']:undefined
}
function reducer (state = initialState, action) {
  //const newState = domEventsReducer ((state = initialState), action);
  console.log('inside event reducer', {action});
  switch (action.type) {
    case ACTIONS.Analytics.event.fetchMap.toString():
    {
      const {dataMap} = state[type];
      console.log(ACTIONS.Analytics.event.fetchMap.toString(), {action, dataMap})
      return {
        ...state,
        
      }
    }
    case ACTIONS.Analytics.event.add.toString():
    {
      console.log(ACTIONS.Analytics.event.add.toString(), {action})
      const {payload} = action;
      const {type, dataMap} = payload;
      let newState = Object.assign({}, state, {
        [type]: {
          dataMap
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

export default reducer;
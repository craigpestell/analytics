import {asyncReducer} from 'redux-promise-middleware-actions';
import {ACTIONS} from '../util';
import {domEvents as domEventsAction} from '../actions/analytics';
import CssSelectorGenerator from 'css-selector-generator';

const selectorGen = new CssSelectorGenerator();
const domEventsReducer = asyncReducer(domEventsAction);

const initialState = {
    domEvents: [],
    dataMap: {},
    entities: {
        
    },
    listeners: {
    },
    track: []
}

export default function reducer (state = initialState, action) {
  //const newState = domEventsReducer ((state = initialState), action);
  switch (action.type) {
    case ACTIONS.Analytics.configure.toString():
      return {
        ...state, 
        configure: {...state.configure, configure: action.payload}
    };
    case ACTIONS.Analytics.page.toString ():
      return {
            ...state, 
            page: action.payload
        }
    case ACTIONS.Analytics.domEvents.toString():
      return {
        ...state, 
        domEvents
    }

    case ACTIONS.Analytics.track.toString ():
        // console.log('track action:',action);
        const track = action.payload;
        
        return {
            ...state, 
            track: [...state.track, track]
        };
    /*case ACTIONS.Analytics.fetch.toString():
        return Object.assign({}, state, {fetch: action.payload});*/
    case ACTIONS.Analytics.addEventListener.toString ():
        const {payload} = action;
        return {
            ...state, 
            listeners: {...state.listeners, [payload.el]: payload}
        };
    case ACTIONS.Analytics.fetchMap.toString ():
        const {payload: dataMap} = action;
        return {
            ...state, 
            dataMap
        };
    case ACTIONS.Analytics.fetchEntity.toString ():
        const {payload: entity} = action;
        return {
            ...state, 
            entities: {...state.entities, entity}
        };

    default:
      return state;
  }
}

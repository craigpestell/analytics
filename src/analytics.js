import { createStore, combineReducers } from 'redux';
import { buildStack } from 'redux-stack';
import {ANALYTICS_OBSERVER_TYPE} from './util/constants';
export { default as AnalyticsBehavior } from './AnalyticsBehavior';
import stack from './initializers';

const initialState = {}
const { reducers, enhancer } = buildStack(stack)
const store = createStore(combineReducers(reducers), initialState, enhancer)

export default store;


export const publishAnalyticsConfig = (config) => {
    Pubsub.observe(ANALYTICS_OBSERVER_TYPE.CONFIGURE).subscribe(( data) => {
        console.log( 'ANALYTICS_OBSERVER_TYPE.CONFIGURE: ', data);
        
        if(data.type == 'configure') {
          //add tracking config for feature.
          if(data.domEvents) {
            AnalyticsController.trackDomEvents(data.domEvents, store); 
    
          }
        }
      });
};



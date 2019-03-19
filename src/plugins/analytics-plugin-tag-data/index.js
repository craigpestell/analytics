// tagdata-plugin.js redux middleware


// here we should intercept each event, and for each dataEntity assigned to the element, fetch the data and assign to
//  the tag.
import ExpSDK from '@component/experiment';

import AnalyticsService from '../../js/AnalyticsService';

// const ExpSdk = new ExperimentationSDK();

const tagData = store => next => action => {
  console.log('################### inside middleware')
  let asyncResponse = false;
  if (action.type) {
    console.log(`>> dispatching ${action.type}`)
    
    if(action.type == "initializeStart") {
      console.log('initializing Analytics...');
      // TODO: dispatch custom event to be handled here instead of initializeStart to fetch Experiment recipes & other 
      // data needed for page views. We want to trigger this event either server-side or client-side depending on the app.

      asyncResponse = true;
      console.log('pageStart: fetching experiment recipes...')
      // add experiment_ids
      ExpSDK.getFinalClientRecipes().then((recipes) => {
        return next({
          ...action,
          ...{
            experiment_ids: recipes
          }
        });
      });

    }


    if(action.type == "pageStart") {
    
    }

  }
  if(!asyncResponse){
    return next(action)
  }
  
}

export default tagData
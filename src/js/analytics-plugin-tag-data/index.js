// tagdata-plugin.js redux middleware


// here we should intercept each event, and for each dataEntity assigned to the element, fetch the data and assign to
//  the tag.
import ExpSDK from '@component/experiment';

// const ExpSdk = new ExperimentationSDK();

const tagData = store => next => action => {
  console.log('################### inside middleware')
  let asyncResponse = false;
  if (action.type) {
    console.log(`>> dispatching ${action.type}`)
    
    if(action.type == "initializeStart") {
      console.log('initializing Analytics...');
      Object.assign(action, {});
      return action;
    }


    if(action.type == "pageStart") {
      asyncResponse = true;
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

  }
  if(!asyncResponse){
    return next(action)
  }
  
}

export default tagData
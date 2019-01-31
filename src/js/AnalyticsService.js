import _ from 'underscore'; // TODO: remove underscore
import ExperimentSDK from '@component/experiment';

const experiment = _.memoize((page) => {
    return new Promise((resolve) => {
        ExperimentSDK.getFinalClientRecipes().then((recipes) => {
          resolve(recipes);
        });
      })
});

export default {
    experiment:(page) => (experiment(page))
}
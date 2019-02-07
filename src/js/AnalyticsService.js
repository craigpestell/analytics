import _ from 'underscore'; // TODO: remove underscore
import ExperimentSDK from '@component/experiment';

const experiment = _.memoize(() => {
    return new Promise((resolve) => {
        ExperimentSDK.getFinalClientRecipes().then((recipes) => {
          resolve(recipes);
        });
      })
});

const product = _.memoize((pId) => {
  console.log('fetching productId: ', pId);
    //return fetch('https://www.macys.com/xapi/discover/v1/product?productIds=2226621&_application=SITE&_navigationType=SEARCH&_deviceType=DESKTOP&_shoppingMode=SITE&_regionCode=US&_customerExperiment=NO_EXPERIMENT&currencyCode=USD&_customerState=GUEST&clientId=QV');
    return new Promise((resolve) => { resolve({productId: 1234, productName: 'test product from analytics service'})})
    
});

export default {
    experiment:() => (experiment()),
    product:() => (product())
}
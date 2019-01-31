import AnalyticsService from '../AnalyticsService';
import ExperimentSDK from '@component/experiment';
export default {
  tagMeta: [
    // default page view tag.
    {
      selector: 'html',
      events: { view: true },
      data: {
        page: () => (new Promise((resolve) => {
          resolve({ 
            event_name: 'page view',
            // recipes: () => ExperimentSDK.getAllSelectedRecipes.promise
            recipes: ['put promise for recipes here']
          });
        })),
        experiment: AnalyticsService.experiment
      },
    },
    // product links on home page
    {
      selector: 'a[data-hl-productid]',
      events: { link: true },
      data: { link: e => (new Promise((resolve) => { resolve(e.target.closest('a[href]')); })) },
    },

    // all non-anchor element links on marketing-campaigns (have data attribute 'linktrack')
    {
      selector: 'a[data-linktrack]',
      events: {link: true},
      data: { link: e => (new Promise((resolve) =>{resolve({link_name: e.srcElement.dataset.linktrack})}))}
    },
    {
      selector: '.hl-name',
      events: { link: true },
      data: { productName: e => ({ name: e.target.innerHTML }) },
    },
  ],
};

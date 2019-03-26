import _ from 'underscore'; // TODO: remove underscore
import ObjectUtil from '@component/common/src/util/ObjectUtil';
import ExperimentSDK from '@component/experiment';

import PageApp from 'pageApp';

const page = _.memoize(() => {
    return new Promise((resolve) => {
      resolve({page_type: "" });
    })
});

const experiment = _.memoize(() => {
    return new Promise((resolve) => {
        ExperimentSDK.getFinalClientRecipes().then((recipes) => {
          resolve(recipes);
        });
      })
});


const product = _.memoize((pId) => {
  console.log('fetching productId: ', pId);
    return fetch(`https://www.macys.com/xapi/discover/v1/product?productIds=${pId}&_application=SITE&_navigationType=SEARCH&_deviceType=DESKTOP&_shoppingMode=SITE&_regionCode=US&_customerExperiment=NO_EXPERIMENT&currencyCode=USD&_customerState=GUEST&clientId=QV`);
    // return new Promise((resolve) => { resolve({productId: pId, productName: 'test product from analytics service'})})
    
});

const quickView = (response, brand) => {
  const ObjectUtil = require('@component/common/src/util/ObjectUtil');
  if (response) {
    const data = ObjectUtil.hasChildProperty(response, 'product.meta.analytics.data') ? response.product.meta.analytics.data : {};
    const detail = ObjectUtil.hasChildProperty(response, 'product.detail') ? response.product.detail : {};
    const flags = detail.flags || {};
    const utagData = {
      page_type: 'product quickview',
      event_name: data.eventName || 'product quickview',
      product_id: [data.productID || ''],
      product_name: [data.productName || ''],
      product_type: [data.productType || ''],
      product_original_price: [data.productOriginalPrice || ''],
      product_price: [data.productPrice || ''],
      is_big_ticket: [data.isBigTicket || 'false'],
      product_position: [response.currentProductPosition !== undefined ? response.currentProductPosition.toString() : ''],
      product_pricing_state: [data.productPricingState || ''],
      product_rating: [data.productRating || ''],
      product_reviews: [data.productReviews || ''],
      pdp_product_position: [response.index || ''],
      product_brand: [detail.brand || ''],
      zone: response.zone || '',
      choiceId: response.model || '',
      contentId: response.contentId || '',
    };
    if (brand === 'bcom') {
      const productUrl = ObjectUtil.hasChildProperty(response, 'product.identifier.productUrl') ? response.product.identifier.productUrl : '';
      const match = productUrl.match('CategoryID=([0-9]*)');
      let categoryId = match && match[1] ? match[1] : '';

      categoryId = flags.registrable && window.location.pathname.indexOf('/shop/wedding-registry/') !== -1 ? `BWEDD_${categoryId}` : categoryId;
      utagData.product_category_id = [categoryId];
      utagData.category_id = [response.product.identifier.topLevelCategoryID || ''];
      utagData.category_name = [response.product.detail.typeName || ''];
    } else {
      utagData.product_category_id = [ObjectUtil.getChildProperty(response, 'product.identifier.categoryId') || ''];
      utagData.product_category_name = [ObjectUtil.getChildProperty(response, 'product.detail.typeName') || ''];
      utagData.experimentation_ids = [response.selectedReceipe || ''];
    }
    if (response.isRecommendation) {
      utagData.event_name = 'recommendation link click';
      utagData.recommendation_position = response.currentProductPosition !== undefined ? response.currentProductPosition.toString() : '';
      utagData.recommendation_model = response.model || '';
      utagData.recommendation_zone = response.zone || '';
      utagData.recommendation_title = response.headerText || '';
      utagData.recommendation_content = response.content || {};
    }
    return utagData;
  }

};

const quickViewMcom =_.memoize((response) => {
  return new Promise((resolve) => {
    resolve(quickView(response, 'mcom'));
  })
});
const quickViewBcom =_.memoize((response) => {
  return new Promise((resolve) => {
    resolve(quickView(response, 'bcom'));
  })
});
export default {
    page: () => (page()),
    experiment:() => (experiment()),
    product:(id) => (product(id)),
    quickView:(response, brand) => {
      return _.memoize((response) => {
        return new Promise((resolve) => {
          resolve(quickView(response, brand));
        })
      });
    }
}
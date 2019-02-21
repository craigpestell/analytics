import AnalyticsService from '../AnalyticsService';
import app from 'pageApp';

export const Actions = {
  page: {
    view: 'page:view',
    redirect: 'page:redirect'
  },
  element: {
    link: 'element:link',
    impression: 'element:impression'
  },
  quickView: {
    view: 'quick-view:view',
  },
  addToBag: {
    success: 'addToBag:success'
  },
  product: {
    link: 'product:link' // product thumbnail click
  }
};

const eventDataHandlers = {
  [Actions.element.link]: {
    linkData: e => (new Promise((resolve) =>{resolve({link_name: e.srcElement.dataset.linktrack})}))
  },
  [Actions.element.impression]: {
    linkData: e => (new Promise((resolve) =>{resolve({link_name: e.srcElement.dataset.linktrack})}))
  },
  [Actions.page.view]: {
    page_name: 'lets get the page name and put it here',
    page: AnalyticsService.page
  },
  [Actions.page.redirect]: {
    page_name: 'lets get the page name and put it here',
    page: AnalyticsService.page
  },
  [Actions.quickView.view]: { 
    quickView: AnalyticsService.quickView
  },
  [Actions.addToBag.success]: {
    addToBag: AnalyticsService.addToBag
  },
  [Actions.product.link]: {
    product: e => (new Promise((resolve) => { resolve(e.target.closest('a[href]')); })) 
  }
};

export default {
  eventDataHandlers,
  tagMeta: [
    // default page view tag.
    {
      selector: 'html',
      events: { view: {} },
      data: {
        page: () => (new Promise((resolve) => {
          resolve({ 
            event_name: 'page view',
          });
        })),
        experiment: AnalyticsService.experiment
      },
    },
    /*// product links on home page
    {
      selector: 'a[data-hl-productid]',
      events: { link: true },
      data: { link: e => (new Promise((resolve) => { resolve(e.target.closest('a[href]')); })) },
    },*/

    // all non-anchor element links on marketing-campaigns (have data attribute 'linktrack')
    /*{
      selector: 'a[data-linktrack]',
      events: {link: true},
      data: { link: e => (new Promise((resolve) =>{resolve({link_name: e.srcElement.dataset.linktrack})}))}
    }*/
    
  ],


  // configure data entities here?

   
  
  

  domEvents: [
    {
      selector: 'a[data-linktrack]',
      events: {
        click: eventDataHandlers[Actions.element.link],
      },
    },
    {
      selector: 'a[data-hl-productid]',
      events: {
        click: eventDataHandlers[Actions.product.link]
      } 
    },
    {
      selector: '.productThumbnail',
      events: {
        click: eventDataHandlers[Actions.product.link]
      }
    }
  ],
  dataMap: {

    quickView: AnalyticsService.quickView(),
    page: AnalyticsService.page(),
    quickBag: new Promise((resolve) => { resolve({'qbData': 'some data'})})
    
    // discovery-pages page-view client-side
    /*
        const utagData = {
          event_name: 'product list updated',
          product_id: data.productID || [],
          facet_values: data.facetValues || [],
          product_rating: data.productRating || [],
          product_reviews: data.productReviews || [],
          results_current_page: data.resultsCurrentPage || '',
          results_per_page: data.resultsPerPage || '',
          sort_type: data.sortType || '',
          total_results: data.totalResults || '',
          product_placement_reason: data.productPlacementReason ? [data.productPlacementReason] : [],
          product_pricing_state: data.productPricingState || [],
          product_badge_new_markdown: data.newMarkDownProducts || [],
          product_badge_new_arrival: data.newArrivalProducts || [],
          customer_store_id: data.customerStoreID || '',
        };
        if (facetName && facetName.length) {
          let item;
          for (let i = 0; i < facetName.length; i += 1) {
            item = facetName[i].search('SIZE') > 0 ? `SIZE_TYPE:${facetName[i]}` : facetName[i];
            facetItems.push(item);
          }
        }
        utagData.facet_names = facetItems.length ? facetItems : [];

        if (meta.pageType && meta.pageType.search && (data.prosSource && data.prosContent && data.prosZone && data.prosChoiceId)) {
          utagData.prosSource = data.prosSource;
          utagData.prosContent = data.prosContent;
          utagData.prosZone = data.prosZone;
          utagData.prosChoiceId = data.prosChoiceId;
        } */

    // BCOM quickViewLayout
    /*
        TagManager.fireTag('view', {
          category_id: [product.identifier.categoryId],
          category_name: [product.detail.typeName],
          event_name: 'product quickview',
          is_big_ticket: [product.meta.analytics.data.isBigTicket],
          page_type: 'product quickview',
          product_brand: [product.detail.brand],
          product_category_id: [product.identifier.categoryId],
          product_id: [product.meta.analytics.data.productID],
          product_name: [product.detail.name],
          product_original_price: [this._to2DecimalPlaces(product.meta.analytics.data.prolductOriginalPrice)],
          product_position: [($(`.productThumbnail#${product.id}`).parent().prevAll().length + 1).toString()],
          product_price: [this._to2DecimalPlaces(product.meta.analytics.data.productPrice)],
          product_type: [product.meta.analytics.data.productType],
        });
    */

    // productSku change
    /*
        event_name: 'product select sku',
        product_color: selectedColor ? [selectedColor.toString()] : [''],
        product_size: selectedSize ? [selectedSize.toString()] : [''],
        product_id: product.id ? [product.id.toString()] : [''],
        product_low_availability: [lowAvailabilityFlag ? 'true' : 'false'],
        product_availability_message: [getChildProperty(upc, 'availability.lowAvailabilityMessage') || ''],
        product_price: [getPrice(upc.pricing)],
        product_upc: upc.id ? [upc.id.toString()] : [''],
        product_days_ship: [productDaysShip !== undefined ? productDaysShip.toString() : ''],
        product_badge_new_arrival: newArrival ? [newArrival.toString()] : [''],
        product_badge_new_markdown: newMarkDown ? [newMarkDown.toString()] : [''],
        product_pricing_state: pricingState ? [pricingState.toString()] : [''], */
    
    // registry add
    /*
        product_color: [product.color],
        product_id: product.productId ? [product.productId.toString()] : [],
        product_name: [product.name],
        product_original_price: product.originalPrice ? [product.originalPrice.toString()] : [],
        product_price: product.price ? [product.price.toString()] : [],
        product_quantity: product.quantity ? [product.quantity.toString()] : [],
        product_size: [productSize],
        product_subtotal: product.subTotal ? [product.subTotal.toString()] : [],
        product_upc: [product.upcNumber.toString()], */
    /*
        event_name: 'product click member carousel:view collection details',
        product_id: [id], */
    /*
        event_name: 'product click member carousel:member',
        product_id: [id], */

  }



};

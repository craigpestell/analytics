function ecommerceEventsPlugin(userConfig) {
  
  const events = {
    browse: {
      productsSearched: 'User Searched for products',
      productListViewed: 'User viewed a product list or category',
      productListFiltered: 'User filtered a product list or category'
    },
    promotion: {
      promotionViewed: 'User viewed a promotion',
      promotionClicked: 'User clicked on a promotion'

    },
    order: {
      productClicked: 'User clicked on a product',
      productViewed: 'User viewed a product details',
      productAdded: 'User added a product to their shopping cart',
      productRemoved: 'User removed a product from their shopping cart',
      cartViewed: 'User viewed their shopping cart',
      checkoutStarted: 'User initiated the order process (a transaction is created)',
      checkoutStepViewed: 'User viewed a checkout step',
      checkoutStepCompleted: 'User completed a checkout step',
      paymentInfoEntered: 'User added payment information',
      orderCompleted: 'User completed the order'

    },
    coupon: {},
    wishlist: {

    },
    share: {

    },
    review: {}


  };


  return {
    NAMESPACE: 'ecommerce',
    bootstrap: ({ payload, config, instance }) => {
      // Do whatever on `bootstrap`
      
    },
    pageStart: ({ payload, config, instance }) => {
      // Fire custom logic before .page calls
    },
    pageEnd: ({ payload, config, instance }) => {
      // Fire custom logic after .page calls
      

    },
    trackStart: ({ payload, config, instance }) => {
      // Fire custom logic before .track calls
      console.log('trackStart event.. put custom login here.');
    },

    track: ({ payload, config, instance }) => {
      // Fire custom logic after .track calls
      const { properties, event } = payload;
      console.log('ecommerce track', payload);
    },
    trackEnd: ({ payload, config, instance }) => {
      // Fire custom logic after .track calls
      const { properties, event } = payload;
      async function trackAdobe(payload) {
        await window.Analytics.dispatch({type: 'analytics', properties, event});
      }
      // dispatch final payload to adobe
      return trackAdobe({type: 'adobe-via-tealium', properties, event});
      // dispatch final payload to adobe
      // window.Analytics.dispatch({type: 'adobe-via-tealium', properties, event});
    },
    [events.order.productClicked]: ({ payload, config, instance }) => {
      // Fire custom logic after .track calls
      const { properties, event } = payload;
      console.log('ecommerce track', payload);
    }
  }
}

export default ecommerceEventsPlugin;
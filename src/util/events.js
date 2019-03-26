import enumValue from './enumValue';

export default Object.freeze({
    //DOM events
    DOM: {
      Element: {
        viewed: enumValue('EVENT.Element.viewed'),
        clicked: enumValue('EVENT.Element.clicked'),
        mousedOver: enumValue('EVENT.Element.mousedOver'),
        redirected: enumValue('EVENT.Element.redirected'),
      }
    },

    // Generic Marionette events for features.
    Marionette: {
      rendered: enumValue('EVENT.Marionette.rendered')
    },

    // E-commerce events
    Product: {
      viewed: enumValue('EVENT.Product.viewed'),
      clicked: enumValue('EVENT.Product.clicked'),
      fetchSuccess: enumValue('EVENT.Product.fetchSuccess'),
      fetchFailed: enumValue('EVENT.Product.fetchFailed')

    },
    QuickView: {
      viewed: enumValue('EVENT.QuickView.viewed'),
      clicked: enumValue('EVENT.QuickView.clicked'),
      fetchSuccess: enumValue('EVENT.QuickView.fetchSuccess'),
      fetchFailed: enumValue('EVENT.QuickView.fetchFailed'),
    }
  });

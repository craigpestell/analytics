import enumValue from './enumValue';

export default Object.freeze({
    //DOM events
     /*DOM: {
      Element: {
        click: enumValue('ACTIONS.DOM.Element.click'),
       }
    },
    Marionette: {
        view: {
            render: enumValue('ACTIONS.Marionette.view.render')
        }
    },
    */
    Product: {
        fetch: enumValue('ACTIONS.Product.fetch'),
        view:  enumValue('ACTIONS.Product.view'),
    },

    QuickView: {
        fetch: enumValue('ACTIONS.QuickView.fetch'),
        view: enumValue('ACTIONS.QuickView.view.render'),        
    },

    // Yes, Analytics has ACTIONSs too. This way we get to track the state of analytics configurations and events in redux.
    Analytics: {
        
        configure: enumValue('ACTIONS.Analytics.configure'),
        
        addEventListener: enumValue('ACTIONS.Analytics.addEventListener'),
        domEvents: enumValue('ACTIONS.Analytics.domEvents'),
        
        fetchEntity: enumValue('ACTIONS.Analytics.fetchEntity'), 
        // requestProduct: enumValue('ACTIONS.Analytics.requestProduct'), 
        page: enumValue('ACTIONS.Analytics.page'),
        

        event: {
            add: enumValue('ACTIONS.Analytics.event.add'),
            update: enumValue('ACTIONS.Analytics.event.update'),
            fetchMap: enumValue('ACTIONS.Analytics.event.fetchMap'), 
            fetchEntity: enumValue('ACTIONS.Analytics.event.fetchMap'),
            track: enumValue('ACTIONS.Analytics.event.track'),
        },
    }
  });
``
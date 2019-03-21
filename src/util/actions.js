import enumValue from './enumValue';

export const ACTIONS = Object.freeze({
    //DOM events
    DOM: {
      Element: {
        click: enumValue('ACTION.DOM.Element.click'),
       }
    },
    Marionette: {
        view: {
            rendered: enumValue('ACTION.Marionette.view.rendered')
        }
    },

    
    Product: {
        fetch: enumValue('ACTION.Product.fetch'),
        view:  enumValue('ACTION.Product.view'),
    },
    QuickView: {
        fetch: enumValue('ACTION.QuickView.fetch'),
        view: enumValue('ACTION.QuickView.view.render'),        
    }
  });
  

  export default { ACTIONS }
  

import * as Mn from 'backbone.marionette';
import PageApp from 'pageApp';
import Analytics from '@component/analytics'

import { ACTIONS } from './util/actions';
import { EVENTS } from './util/events';
console.log('ACTIONS:', ACTIONS);
console.log('EVENTS: ', EVENTS);
/*const ViewBehavior = Mn.Behavior.Extend({{
});*/
/* Mn.Behaviors.behaviorsLookup = function() {
    return this.window.Behaviors;
};*/


const AnalyticsBehavior = Mn.Behavior.extend({
    // You can set default options
    // They will be overridden if you pass in an option with the same key.
    options: {
        message: `Let's track some user events`
    },

    defaults: function() {

        return {
            'deepSpace': 9,
            'channel': PageApp.channel
        }
    },
    
    ui: {
        callToAction: '.cta-primary',
        callToActionSecondary: '.cta-secondary',
        track: '.track',
        productFetch: '.product-fetch'
    },
    
    events: {
        'click @ui.callToAction': 'onClickCta',
        'click @ui.callToActionSecondary': 'onClickCtaSecondary',
        'click @ui.productFetch': 'fetchProduct',
        'click .cta-primary': 'onClickCta',
        'click .product-fetch': 'fetchProduct',
        'click .track': 'onClickTrack'
    },
    
    triggers: {
        'click @ui.callToAction': 'callToAction',
        'analytics:cta': 'onCta',
        'analytics:ctaSuccess': 'onCtaSuccess',
        'click @ui.fetchProduct': 'fetchProduct'
    },
    
    onCta() {
        console.log('$$$$CTA');
        this.view.trigger('analytics', {'cta': 'data'});
    },
    
    // analytics:ctaSuccess
    onCtaSuccess(){
        console.log('Thumbnail onAnalyticsCtaSuccess');
    },
    
    onRender() {
        const args = arguments;
        console.log('viewBehavior onRender args:', arguments)
        // fire view tag
        this.view.trigger('analytics:track', {event_type: EVENTS.Marionette.rendered, event_name: 'onRender'});
    },
    
    modelEvents: {
        'change': 'onChangeModel',
        'fetch': 'onFetchModel'
    },

    collectionEvents: {
        'change': 'onChangeCollection'
    },

    onClickCta(evt) {
        // Primary call-to-action link click.
        Analytics.dispatch({type: EVENTS.DOM.Element.clicked.toString(), payload: { event_name: 'call to action'}});
    },

    onClickCtaSecondary(evt) {
        // Primary call-to-action link click.
        Analytics.dispatch({type: EVENTS.DOM.Element.clicked.toString(), payload: evt});
        
    },

    onClickTrack(evt) {
        const element = evt.currentTarget;
        // Handle all predefined click events.

        // .track-product
        if (element.classList.contains('track-product')) {
            // product:clicked modeled after https://segment.com/docs/spec/ecommerce/v2/ Core Ordering Overview / Product Clicked
            // Analytics.dispatch({type: 'Actions.product:clicked', payload: evt.currentTarget});
            Analytics.dispatch({type: EVENTS.Product.clicked.toString(), payload: evt.currentTarget});
            
        } else {
            Analytics.dispatch({type: EVENTS.Element.clicked.toString(), payload: evt});
            
        }
    },

    onChangeModel(model, opts) {
        // ..
        console.log('model changed:', model, 'opts: ', opts);
        this.pubsub.trigger('analytics:track:model:change', evt);
    },
    
    onChangeCollection(model, opts) {
        // ..
        this.pubsub.trigger('analytics:track:collection:change', evt);
    },
    fetchProduct(id) {
        Analytics.dispatch({type: ACTIONS.Product.fetch.toString(), payload: {product: 'a promise'} } );
    }
});

export default AnalyticsBehavior;
import * as Mn from 'backbone.marionette';
import PageApp from 'pageApp';
import Analytics from '@component/analytics';
import { AnalyticsController } from '@component/analytics';

import {ACTIONS, EVENTS} from './util';

import AnalyticsService from './AnalyticsService';

/*const ViewBehavior = Mn.Behavior.Extend({{
});*/
/* Mn.Behaviors.behaviorsLookup = function() {
    return this.window.Behaviors;
};*/

const AnalyticsBehavior = Mn.Behavior.extend ({
  // You can set default options
  // They will be overridden if you pass in an option with the same key.
  options: {
    message: `Let's track some user events`,
  },

  defaults: function () {
    return {
      deepSpace: 9,
      channel: PageApp.channel,
    };
  },

  ui: {
    callToAction: '.cta-primary',
    callToActionSecondary: '.cta-secondary',
    trackEventWithProduct: '.product-fetch',
    track: '.track',
  },

  events: {
    'click @ui.callToAction': 'onClickCta',
    'click @ui.callToActionSecondary': 'onClickCtaSecondary',
    'click .cta-primary': 'onClickCta',
    
    // 'click .product-fetch': 'fetchProductAndSuccess',
    // 'click .product-fetch-fail': 'fetchProductAndFailure',
    'click .track': 'onClickTrack',
  },

  triggers: {
    [EVENTS.Marionette.initialized.toString()]: 'onInitialize',
    'click @ui.callToAction': 'callToAction',
    'analytics:cta': 'onCta',
    'analytics:ctaSuccess': 'onCtaSuccess',
    'click @ui.productFetchAndSuccess': 'fetchProductAndSuccess',
  },

  initialize(){
    // A generic 'view' event triggered on the init of Marionette View.
    this.on('trackView', this.trackView);
    this.triggerMethod('trackView');
  },


  trackView(){
    // register and track the view event.
    AnalyticsController.addEventListener('html','view', {
        data: {'test': 'some sample data'}
    })
    /* Analytics.dispatch ({
      type: ACTIONS.Analytics.event.track.toString(),
      payload: {
          type: EVENTS.Marionette.initialized.toString(),
          payload: this
      },
    });*/
  },



  onCta () {

    console.log ('$$$$CTA');
    this.view.trigger ('analytics', {cta: 'data'});
  },

  // analytics:ctaSuccess
  onCtaSuccess () {
    console.log ('Thumbnail onAnalyticsCtaSuccess');
  },

  onRender () {
    const args = arguments;'ACTION.Analytics.configure.domEvents'
    console.log ('viewBehavior onRender args:', arguments);
    // fire view tag
    this.view.trigger ('analytics:track', {
      event_type: EVENTS.Marionette.rendered,
      event_name: 'onRender',
    });
  },

  modelEvents: {
    change: 'onChangeModel',
    fetch: 'onFetchModel',
  },

  collectionEvents: {
    change: 'onChangeCollection',
  },

  onClickCta (evt) {
    // Primary call-to-action link click.
    Analytics.dispatch ({
      type: ACTIONS.Analytics.event.track.toString(),
      payload: {
          event: EVENTS.DOM.Element.clicked.toString(), 
          data: {event_name: 'call to action'}
        }
    });
  },

  onClickCtaSecondary (evt) {
    // Primary call-to-action link click.
    Analytics.dispatch ({
      type: EVENTS.DOM.Element.clicked.toString (),
      payload: evt,
    });
  },

  onClickTrack (evt) {
    const element = evt.currentTarget;
    // Handle all predefined click events.

    // .track-product
    if (element.classList.contains ('track-product')) {
      // product:clicked modeled after https://segment.com/docs/spec/ecommerce/v2/ Core Ordering Overview / Product Clicked
      // Analytics.dispatch({type: 'Actions.product:clicked', payload: evt.currentTarget});
      Analytics.dispatch ({
        type: ACTIONS.Analytics.event.track.toString(),
        payload: {
            type: EVENTS.Product.clicked.toString(),
            payload: AnalyticsService.Product
        },
      });
    } else {
      Analytics.dispatch ({
        type: EVENTS.Element.clicked.toString(),
        payload: evt,
      });
    }
  },

  onChangeModel (model, opts) {
    // ..
    console.log ('model changed:', model, 'opts: ', opts);
    this.pubsub.trigger ('analytics:track:model:change', evt);
  },

  onChangeCollection (model, opts) {
    // ..
    this.pubsub.trigger ('analytics:track:collection:change', evt);
  },
  
});

export default AnalyticsBehavior;

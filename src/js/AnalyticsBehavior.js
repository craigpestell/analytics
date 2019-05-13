import * as Mn from 'backbone.marionette';
import PageApp from 'pageApp';

import { AnalyticsController } from './analytics';


import ANALYTICS_EVENT from './events';

import AnalyticsService from './AnalyticsService';


/* const ViewBehavior = Mn.Behavior.Extend({{
}); */
/* Mn.Behaviors.behaviorsLookup = function() {
    return this.window.Behaviors;
}; */

const AnalyticsBehavior = Mn.Behavior.extend({
  // You can set default options
  // They will be overridden if you pass in an option with the same key.
  options: {
    message: 'Let\'s track some user events',
  },

  defaults () {
    return {
      component: undefined, // name of component instead of selector.
      channel: PageApp.channel,
    };
  },

  ui: {
    test: '.productThumbnail',
    callToAction: '.cta-primary',
    callToActionSecondary: '.cta-secondary',
    trackEventWithProduct: '.product-fetch',
    trackProductThumbnail: '.track-product-thumbnail',
    track: '.track',
  },

  events: {
    'click @ui.trackProductThumbnail': 'onClickProductThumbnail',
    'click @ui.test': 'test',
    'click @ui.callToAction': 'onClickCta',
    'click @ui.callToActionSecondary': 'onClickCtaSecondary',
    'click .cta-primary': 'onClickCta',

    // 'click .product-fetch': 'fetchProductAndSuccess',
    // 'click .product-fetch-fail': 'fetchProductAndFailure',
    'click .track': 'onClickTrack',

  },

  triggers: {
    [ANALYTICS_EVENT.View.initialized.toString()]: 'onInitialize',
    'click @ui.callToAction': 'callToAction',
    'analytics:cta': 'onCta',
    'analytics:ctaSuccess': 'onCtaSuccess',
    'click @ui.productFetchAndSuccess': 'fetchProductAndSuccess',
    'analytics:track-view': 'trackView',
  },

  initialize() {
    // A generic 'view' event triggered on the init of View View.

    /* this.on('trackView', this.trackView);
    this.triggerMethod('trackView'); */

    // this.once('analytics:track-view', this.trackView);
    // ANALYTICS_EVENT.View.viewed.subscribe()
    ANALYTICS_EVENT.View.viewed.track(this);
  },

  trackView() {
    AnalyticsController.addEventListener(this.view, 'view', {
      event: ANALYTICS_EVENT.View.initialized.toString(),
      data: { 'test': 'some sample data', initialized: true },
    });
  },

  onCta() {
    console.log('$$$$CTA');
    this.view.trigger('analytics', { cta: 'data' });
  },

  // analytics:ctaSuccess
  onCtaSuccess() {
    console.log('Thumbnail onAnalyticsCtaSuccess');
  },

  onRender() {
    // by default we'll trigger the 'view' event onRender
    this.triggerMethod('analytics:track-view');
  },

  modelEvents: {
    change: 'onChangeModel',
    fetch: 'onFetchModel',
  },

  collectionEvents: {
    change: 'onChangeCollection',
  },

  onClickCta(evt) {
    // Primary call-to-action link click.
    ANALYTICS_EVENT.Element.clicked.track(evt);
  },

  onClickCtaSecondary(evt) {
    // Primary call-to-action link click.
    Analytics.dispatch({
      type: ANALYTICS_EVENT.DOM.Element.clicked,
      payload: evt,
    });
  },

  onClickProductThumbnail(evt) {
    ANALYTICS_EVENT.ProductThumbnail.clicked.track(evt);
  },

  onClickTrack(evt) {
    const element = evt.currentTarget;
    // Handle all predefined click events.

    // .track-product
    if (element.classList.contains('track-product')) {
      // product:clicked modeled after https://segment.com/docs/spec/ecommerce/v2/ Core Ordering Overview / Product Clicked
      // Analytics.dispatch({type: 'Actions.product:clicked', payload: evt.currentTarget});
      Analytics.dispatch({
        type: ACTIONS.Analytics.event.track.toString(),
        payload: {
          type: ANALYTICS_EVENT.Product.clicked.toString(),
          payload: AnalyticsService.Product,
        },
      });
    } else {
      Analytics.dispatch({
        type: ANALYTICS_EVENT.Element.clicked.toString(),
        payload: evt,
      });
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

  test() {
    console.log('test!!!!');
  },
});

export default AnalyticsBehavior;

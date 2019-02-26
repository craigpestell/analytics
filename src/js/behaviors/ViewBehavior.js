import * as Mn from 'backbone.marionette';
import PageApp from 'pageApp';

import AnalyticsService from '@component/analytics';

/*const ViewBehavior = Mn.Behavior.Extend({
    
});*/
/* Mn.Behaviors.behaviorsLookup = function() {
    return this.window.Behaviors;
};*/


const AnalyticsViewBehavior = Mn.Behavior.extend({
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

    // 
    initialize: function(options) {
       console.log('init AnalyticsViewBehavior');
       //  window.Analytics.track('view', this.el);
        
        /*this.pubsub = options.channel || PageApp.channel;
        //publish the configuration.

        this.listenTo(this.view,'analytics:track', (data) => {
            console.log('viewBehavior onRender channel event args: ',arguments);
            console.log('AnalyticsViewBehavior received analytics event on view: ', data);
            this.pubsub.trigger('analytics:track', this)
        });

        this.pubsub.trigger('analytics:view:initialize', this);*/

        
        

    },

    /*
    triggers: {
      'click .bar-button': 'click:barButton'
    },
    */
    
    ui: {
        callToAction: '.cta',
    },
    events: {
        'click @ui.callToAction': 'onClickCta'
    },
    
    triggers: {
        'click @ui.callToAction': 'callToAction',
        'analytics:cta': 'onCta',
        'analytics:ctaSuccess': 'onCtaSuccess',
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
        this.view.trigger('analytics:track', {event_type: 'view', event_name: 'onRender'});
    },
    
    modelEvents: {
        'change': 'onChangeModel'
    },
    collectionEvents: {
        'change': 'onChangeCollection'
    },
    onClickCta(evt) {
        // Primary call-to-action link click.
        Analytics.track('link', evt);
    },
    onClickBarButton(view, evt) {
        // ..
    },
    onChangeModel(model, opts) {
        // ..
        console.log('model changed:', model, 'opts: ', opts);
        this.pubsub.trigger('analytics:track:model:change', evt);
    },
    onChangeCollection(model, opts) {
        // ..
        this.pubsub.trigger('analytics:track:collection:change', evt);
    }
});

export default AnalyticsViewBehavior;
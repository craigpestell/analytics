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
        console.log('AnalyticsBehavior initialize');

        this.pubsub = options.channel || PageApp.channel;
        //publish the configuration.
        let data = {};
        let key = `feature-data`;
        if(this.view.options.el){
            key = this.view.options.el;
        }
        if(AnalyticsService[key]) {
            data = {[key]: AnalyticsService[key]}; 
        }

        this.listenTo(this.view,'analytics::view', (data) => {
            console.log('viewBehavior onRender channel event args: ',arguments);
            console.log('AnalyticsViewBehavior received analytics event on view: ', data);
        });


        
        this.pubsub.trigger('analytics:track', {
            selector: key,
            events: {view: true},
            data
        });

        this.el.addEventListener('analytics:track', (data) => {
            console.log('Analytics in ViewBehavior initialize analytics:track addEventListener')
        })
    },

    /*
    triggers: {
      'click .bar-button': 'click:barButton'
    },
    */
    triggers: {
        'click .analytics-cta': 'click:cta'
    },
    onCta() {
        console.log('$$$$CTA');
        this.view.trigger('analytics', {'cta': 'data'});
    },
    onRender() {
        const args = arguments;
        console.log('viewBehavior onRender args:', arguments)
        // fire view tag
        this.view.trigger('analytics:track', {event_type: 'view', event_name: 'onRender'});
    },
    events: {
    'click .an .primary': 'onClickPrimary'
    },
    
    modelEvents: {
        'change': 'onChangeModel'
    },
    collectionEvents: {
        'change': 'onChangeCollection'
    },
    onClickPrimary(evt) {
        // Primary call-to-action link click.
        PageApp.channel.trigger('analytics:add-tag', 
        {
            some: 'data'
        });

    },
    onClickBarButton(view, evt) {
        // ..
    },
    onChangeModel(model, opts) {
        // ..
        console.log('model changed');
    },
    onChangeCollection(model, opts) {
        // ..
    }
});

export default AnalyticsViewBehavior;
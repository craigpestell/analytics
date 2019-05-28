import Marionette from 'backbone.marionette';

import $ from 'jquery';
import AnalyticsController from '../../../../src/js/analytics';
import AnalyticsEvent from '../../../../src/js/events/AnalyticsEvent';
import { EVENT_TYPE } from '../../../../src/js/util/constants';
import mixins from '../../../../src/js/mixins';
import listeners from '../../../../src/js/listeners';


describe('marionetteViewMixin', () => {
    let event;
    beforeEach(() => {
        loadFixtures('main.html');
        class TestMarionetteViewMixinEvent extends AnalyticsEvent {
            constructor(name) {
                super(name);
                mixins.marionetteViewMixin(this);
            }
        }
        event = new TestMarionetteViewMixinEvent('testMarionetteMixin');
        AnalyticsController.addEvents([event])

    })

    xit('should attach an addEventListeners method to the target event', () => {
        expect(event.hasOwnProperty('addEventListeners')).toBeTruthy();
    })
})


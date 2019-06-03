import { ItemView } from 'backbone.marionette';
import Handlebars from 'handlebars';
import Analytics, { AnalyticsEvent } from '../../../../src/js/analytics';
import mixins from '../../../../src/js/mixins';
import { EVENT_TYPE } from '../../../../src/js/util/constants';

describe('marionetteView mixin:', () => {
  class TestMarionetteViewMixinEvent extends AnalyticsEvent {
    constructor(name, type, options = {}) {
      super(name, type, options);
      mixins.marionetteViewMixin(this, options.view ? options.view : undefined);
    }
    onRender() {
      console.log('in render');
    }
    render() {
      console.log('in render');
      return "<div>hi welcome to chilli's</div>";
    }
  }
  const TestView = ItemView.extend({
    el: '#marionetteViewContainer',
    template: Handlebars.compile('<h1>Hello, {{ name }}'),
    onRender() {
      console.log('onRender:', this);
    },
  });

  describe('listeners:', () => {
    let event;
    // let el;
    let trackSpy;
    let view;
    beforeEach(() => {
      trackSpy = spyOn(Analytics, 'track').and.callThrough();
      loadFixtures('main.html');

      view = new TestView({
        el: '#marionetteViewContainer',
      });
      event = new TestMarionetteViewMixinEvent('testMarionetteViewMixinViewListener', EVENT_TYPE.view, { view });
      view.render();
      // el = document.querySelector('#marionetteViewContainer');
    });

    it('should attach an addEventListeners method to the target event', () => {
      // eslint-disable-next-line no-prototype-builtins
      expect(event.hasOwnProperty('addEventListeners')).toBeTruthy();
    });

    xdescribe('view listener:', () => {
      it('should be added to dom elements', (done) => {
        Analytics.documentReady(() => {
          expect(trackSpy).toHaveBeenCalledWith('view', event._listener);
          done();
        });
      });
    });
  });
});

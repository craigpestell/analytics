import AnalyticsEvent from '../../../../src/js/events/AnalyticsEvent';
import { EVENT_TYPE } from '../../../../src/js/util/constants';
import mixins from '../../../../src/js/mixins';

describe('domElementMixin:', () => {
  beforeEach(() => {
    loadFixtures('main.html');
  });

  describe('listeners:', () => {
    class TestDomElementMixinEvent extends AnalyticsEvent {
      constructor(name, type, options) {
        super(name, type, options);
        mixins.domElementMixin(this);
      }
    }

    it('should attach an addEventListeners method to the target event', () => {
      const event = new TestDomElementMixinEvent('testDomMixin');
      // eslint-disable-next-line no-prototype-builtins
      expect(event.hasOwnProperty('addEventListeners')).toBeTruthy();
    });

    describe('click listener:', () => {
      let event;
      let el;
      let addEventListenerSpy;
      beforeEach(() => {
        el = document.querySelector('a.test-click');
        addEventListenerSpy = spyOn(el, 'addEventListener');
        event = new TestDomElementMixinEvent('testDomMixinClickListener', EVENT_TYPE.link, { selector: 'a.test-click' });
      });

      it('should be added to dom elements', () => {
        expect(addEventListenerSpy).toHaveBeenCalledWith('click', event.listener);
      });
    });

    describe('impress listener:', () => {
      let event;
      let el;
      let addEventListenerSpy;
      beforeEach(() => {
        loadFixtures('main.html');
        class ImpressTestEvent extends AnalyticsEvent {
          constructor(name, options) {
            super(name, EVENT_TYPE.impression, { selector: '#intersection-item' }, options);
            mixins.domElementMixin(this);
          }
        }
        el = document.querySelector('#intersection-item');
        addEventListenerSpy = spyOn(el, 'addEventListener').and.callThrough();
        event = new ImpressTestEvent('testEvent', { selector: '#intersection-item' });
      });

      it('should attach listener to "observed" DOM event', () => {
        expect(addEventListenerSpy).toHaveBeenCalledWith('observed', event.listener);
      });

      describe('event triggers:', () => {
        let eventSpy;
        beforeEach(() => {
          eventSpy = jasmine.createSpy('eventSpy');
        });
        it('should not trigger on element not in viewport', () => {
          expect(eventSpy).not.toHaveBeenCalled();
        });

        it('should call listener when observed', (done) => {
          el.addEventListener('observed', () => {
            eventSpy();
            expect(eventSpy).toHaveBeenCalled();
            done();
          });
          window.scrollTo(0, document.body.scrollHeight);
        });
      });
    });
  });
});

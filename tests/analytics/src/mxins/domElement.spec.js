import AnalyticsController from '../../../../src/js/analytics';
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
      let event = new TestDomElementMixinEvent('testDomMixin');
      expect(event.hasOwnProperty('addEventListeners')).toBeTruthy();
    });

    describe('click listener:', () => {
      let event, el, addEventListenerSpy;
      beforeEach(() => {
        el = document.querySelector("a.test-click");
        addEventListenerSpy = spyOn(el, 'addEventListener');
        event = new TestDomElementMixinEvent('testDomMixinClickListener',EVENT_TYPE.link, {selector: 'a.test-click'} );
      });
    
      it('should be added to dom elements', () => {
        expect(addEventListenerSpy).toHaveBeenCalledWith('click', event.listener)
      });
    });
    
    describe('impress listener:', () => {
      let event, el, addEventListenerSpy

      beforeEach(() => {
        loadFixtures('main.html');
        class ImpressTestEvent extends AnalyticsEvent {
          constructor(name, options) { /*  */
            super(name, EVENT_TYPE.impression, { selector: '#intersection-item' }, options, ...arguments);
            mixins.domElementMixin(this);
          }
        }
    
        el = document.querySelector("#intersection-item");
        addEventListenerSpy = spyOn(el, 'addEventListener').and.callThrough();
        event = new ImpressTestEvent('testEvent', { selector: '#intersection-item' });
      });
    
      it('should attach listener to "observed" DOM event', () => {
        expect(addEventListenerSpy).toHaveBeenCalledWith('observed', event.listener)
      });

      describe('event triggers:', () => {
        let eventSpy;
        beforeEach(() => {
          eventSpy = jasmine.createSpy('eventSpy');
        })
        it('should not trigger on element not in viewport', () => {
           expect(eventSpy).not.toHaveBeenCalled();
        });
      
        it('should call listener when observed', (done) => {
          el.addEventListener("observed", () => {
            eventSpy();
            expect(eventSpy).toHaveBeenCalled();
            done();
          })
          window.scrollTo(0,document.body.scrollHeight);
          
        });
      });
    });
  });
});

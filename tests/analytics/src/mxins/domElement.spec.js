import $ from 'jquery';
import AnalyticsController from '../../../../src/js/analytics';
import AnalyticsEvent from '../../../../src/js/events/AnalyticsEvent';
import { EVENT_TYPE } from '../../../../src/js/util/constants';
import mixins from '../../../../src/js/mixins';
import listeners from '../../../../src/js/listeners';


describe('domElementMixin:', () => {

  getListener = function( mock, type ) {
    var spy = mock.addListener;
    for( var i = 0; i < spy.callCount; i++ ) {
      if( spy.argsForCall[ i ][ 0 ] === type ) {
        return spy.argsForCall[ i ][ 1 ];
      }
    }
    throw new Error( "Listener " + type + " not found" );
  }  
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
    
    afterEach(() => {
      addEventListenerSpy = undefined;
    });
  
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
        AnalyticsController.addEvent(event);
      });
    
      it('should be added to dom elements', () => {
        expect(addEventListenerSpy).toHaveBeenCalledWith('click', event.listener)
      });
    });
    
    describe('impress listener:', () => {
      let event, el, element, addEventListenerSpy, listenerSpy, mockEvent;
        
      const observeMock = {
        observe: () => null,
        disconnect: () => null, // maybe not needed
      };
    
      var mock = function( constr, name ) {
        var keys = [];
        for( var key in constr.prototype ) {
          keys.push( key );
        }
        var result = keys.length > 0 ? jasmine.createSpyObj( name || "mock", keys ) : {};
        result.jasmineToString = function() { return "mock" + ( name ? " of " + name : "" ); };
        return result;
      };
  

      beforeEach(() => {
        
        originalIntersectionObserver = (window).IntersectionObserver;
        (window).IntersectionObserver = () => observeMock;
    
        class ImpressTestEvent extends AnalyticsEvent {
          constructor(name, options) { /*  */
            super(name, EVENT_TYPE.impression, { selector: '#intersection-item' }, options, ...arguments);
            mixins.domElementMixin(this);
          }
        }
    
        el = document.querySelector("#intersection-item");
        addEventListenerSpy = spyOn(el, 'addEventListener');
        event = new ImpressTestEvent('testEvent', { selector: '#intersection-item' });
        listenerSpy = spyOnProperty(event, 'listener').and.callThrough();


        Element.prototype.addListener = function() {};
        element = mock( Element );
      });
    
      it('should be added to dom elements', () => {
        expect(addEventListenerSpy).toHaveBeenCalledWith('observed', event.listener)
      });
    
      it('should not trigger on element not in viewport', () => {

        $('#intersection-item').triggerHandler({type: 'observed'});
        // expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(listenerSpy).not.toHaveBeenCalled();
      });
    
      it('should call listener when observed', (done) => {
        
        /* el.addListener( "changeXYZ", function( event ) {
          event.x = 1; // this is the code that we test
        } ); */
        
        var eventMock = {};
        getListener( element, "observed" )( eventMock );
        expect( eventMock.x ).toBe( 1 );


        
        // const el = event.getEl()[0];
        $(el).triggerHandler(new Event('observe'));
        setTimeout(() => {
          expect(listenerSpy).toHaveBeenCalled();
          done()
        });
      });
    });
  });
});

/* describe('view event', () => {
    let event, addEventListenersSpy, docReadySpy;
    beforeAll((done) => {
        console.log('#### beforeAll')
        loadFixtures('main.html');
        document.addEventListener("DOMContentLoaded", function (event) {
            console.log("DOM fully loaded and parsed");
            done();
        });
    });
    beforeEach(() => {
        console.log('#### beforeEach')

        class TestDomElementMixinEvent extends AnalyticsEvent {
            constructor(name) {
                super(name, EVENT_TYPE.view);
                mixins.domElementMixin(this);
            }
        }


        event = new TestDomElementMixinEvent('testDomMixin');
        addEventListenersSpy = spyOn(event, 'addEventListeners')
        docReadySpy = spyOn(AnalyticsController, 'documentReady')
        AnalyticsController.addEvent(event)


    });
    afterEach(() => {

    })

    it('should be triggered on document Ready', () => {

        expect(addEventListenersSpy).toHaveBeenCalled();
    })
}) */


import AnalyticsController from '../../../src/js/analytics';
import AnalyticsEvent from '../../../src/js/events/AnalyticsEvent';
import { EVENT_TYPE } from '../../../src/js/util/constants';

describe('Analytics module', () => {
  it('should return a singleton instance object', () => {
    expect(AnalyticsController).toEqual(jasmine.any(Object));
  });


  describe('documentReady', () => {
    describe('while page is loading', () => {
      let eventTrackSpy, readySpy;

      beforeEach(() => {
        loadFixtures('main.html');
        readySpy = spyOn(document, 'readyState').and.returnValue('loading')
        const viewEvent = new AnalyticsEvent('test view event', EVENT_TYPE.view, { data: { test: 'test data' } });
        eventTrackSpy = spyOn(viewEvent, 'track');
      });

      it('should not invoke callback', () => {
        AnalyticsController.documentReady(() => {
          setTimeout(() => {
            expect(readySpy).not.toHaveBeenCalled();
          })

        });
      })
    });
  });
});


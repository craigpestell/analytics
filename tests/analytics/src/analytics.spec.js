import AnalyticsController from '../../../src/js/analytics';
import AnalyticsEvent from '../../../src/js/events/AnalyticsEvent';
import { EVENT_TYPE } from '../../../src/js/util/constants';

describe('Analytics module', () => {
  it('should return a singleton instance object', () => {
    expect(AnalyticsController).toEqual(jasmine.any(Object));
  });


  describe('when adding a view event', () => {
    let eventTrackSpy;

    beforeEach(() => {
      loadFixtures('main.html');
      const viewEvent = new AnalyticsEvent('test view event', EVENT_TYPE.view, { data: { test: 'test data' } });
      eventTrackSpy = spyOn(viewEvent, 'track');
    });

    /* it('should track the view event on page load', () => {
        AnalyticsController.documentReady(() => {
          setTimeout(() => {
            expect(eventTrackSpy).toHaveBeenCalled();
          })

        });
      }) */
  });
});


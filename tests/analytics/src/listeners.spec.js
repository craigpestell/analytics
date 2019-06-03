import { listeners, intersectionObserver } from '../../../src/js/listeners';
import Analytics, { EVENT_TYPE, AnalyticsEvent } from '../../../src/js/analytics';

describe('listeners:', () => {
  it('should return an object with "view", "click", and "impress" methods', () => {
    expect(listeners.view).toBeTruthy();
    expect(listeners.click).toBeTruthy();
    expect(listeners.impress).toBeTruthy();
    expect(intersectionObserver instanceof IntersectionObserver).toBeTruthy();
  });

  describe('dom listener', () => {
    let event;
    let fetchSpy;
    beforeEach(() => {
      window._analytics = Analytics;
      loadFixtures('main.html');
      event = new AnalyticsEvent('listenerTest', EVENT_TYPE.view);
      Analytics.addEvents([event]);
      fetchSpy = spyOn(event, 'fetch').and.callThrough();
    });

    it('should be a function that accepts an event parameter', () => {
      const clickListener = listeners.click(event);
      expect(clickListener).toEqual(jasmine.any(Function));
      expect(clickListener.length).toEqual(1);
    });

    it("should call event's track method when invoked", () => {
      const clickListener = listeners.click(event);
      clickListener();
      expect(fetchSpy).toHaveBeenCalled();
    });
  });
});

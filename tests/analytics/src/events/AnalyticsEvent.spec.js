import AnalyticsEvent from '../../../../src/js/events/AnalyticsEvent';
import { EVENT_TYPE } from '../../../../src/js/util/constants';

describe('AnalyticsEvent', () => {
  let fetchData;
  beforeEach(() => {
    fetchData = getJSONFixture('fetchData.json');
  });

  it('should be a function', () => {
    expect(AnalyticsEvent).toEqual(jasmine.any(Function));
  });

  describe('instance', () => {
    let event;
    beforeEach(() => {
      event = new AnalyticsEvent('test');
    });

    it('should be an object', () => {
      expect(event).toEqual(jasmine.any(Object));
    });

    it('should have a fetch method', () => {
      expect(event.fetch).toEqual(jasmine.any(Function));
    });

    it('should have a track method', () => {
      expect(event.track).toEqual(jasmine.any(Function));
    });
  });

  describe('methods: ', () => {
    describe('fetchMap', () => {
      let event;

      describe('when no dataMap is specified', () => {
        beforeEach(() => {
          event = new AnalyticsEvent('fetchTest', EVENT_TYPE.link);
        });

        it('should return an empty object', (done) => {
          event.fetchMap().then((result) => {
            expect(result).toEqual({});
            done();
          });
        });
      });

      describe('when provided an object containing a value', () => {
        const dataMap = {
          test: { 'test attr': 'test data' },
        };
        beforeEach(() => {
          event = new AnalyticsEvent('fetchTest', EVENT_TYPE.link, { dataMap });
        });

        it('should return the same value', (done) => {
          event.fetchMap().then((result) => {
            expect(result).toEqual([{ 'test attr': 'test data' }]);
            done();
          });
        });
      });
    });

    describe('fetch', () => {
      describe('when provided an Object containing a function that returns a promise', () => {
        let event;
        const dataMap = {
          test: () =>
            new Promise((resolve) => {
              resolve({ test: 'test' });
            }),
        };
        beforeEach(() => {
          event = new AnalyticsEvent('fetchTest', EVENT_TYPE.link, { dataMap });
        });

        it('should return Promise data', (done) => {
          spyOn(event, 'fetchMap').and.returnValue(Promise.resolve(fetchData));
          event.fetch().then((result) => {
            expect(event.fetchMap).toHaveBeenCalled();
            expect(result).toEqual({ test: 'test', event_name: 'fetchTest' });
            done();
          });
        });
      });

      describe('when provided an object containing a value', () => {
        let event;
        const dataMap = {
          test: { 'test attr': 'test data' },
        };
        beforeEach(() => {
          event = new AnalyticsEvent('fetchTest', EVENT_TYPE.link, { dataMap });
        });

        it('should return the same value', (done) => {
          spyOn(event, 'fetchMap').and.returnValue(Promise.resolve({ 'test attr': 'test data' }));
          event.fetch().then((result) => {
            expect(event.fetchMap).toHaveBeenCalled();
            expect(result).toEqual({ 'test attr': 'test data', event_name: 'fetchTest' });
            done();
          });
        });
      });
    });

    describe('track function', () => {
      let event;
      const dataMap = {
        test: () =>
          new Promise((resolve) => {
            resolve({ test: 'test' });
          }),
      };

      beforeEach(() => {
        event = new AnalyticsEvent('test', EVENT_TYPE.link, { dataMap });
      });

      it('should call fetch and return true', (done) => {
        spyOn(event, 'fetch').and.returnValue(Promise.resolve(fetchData));
        event.track().then((result) => {
          expect(event.fetch).toHaveBeenCalled();
          expect(result).toEqual(true);
          done();
        });
      });
    });
  });
});

import Analytics from '../../../src/js/analytics';

describe('Analytics module', () => {
  it('should return a singleton instance object', () => {
    expect(Analytics).toEqual(jasmine.any(Object));
  });
  describe('documentReady', () => {
    describe('while page is loading', () => {
      let readySpy;
      beforeEach(() => {
        loadFixtures('main.html');
        readySpy = spyOn(document, 'readyState').and.returnValue('loading');
      });
      it('should not invoke callback before DOM is ready', () => {
        Analytics.documentReady(() => {
          setTimeout(() => {
            expect(readySpy).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});

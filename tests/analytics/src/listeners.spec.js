import { intersectionObserver } from '../../../src/js/listeners';

describe('listeners:', () => {
  it('should return an object with "view", "click", and "impress" methods', () => {
    expect(intersectionObserver instanceof IntersectionObserver).toBeTruthy();
  });
});


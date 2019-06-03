import * as constants from '../../../../src/js/util/constants';

describe('event type constant', () => {
  it('should have a proper string coercing method (Symbol.toPrimitive}', () => {
    expect(`${constants.EVENT_TYPE.link}`).toEqual('link');
  });
});

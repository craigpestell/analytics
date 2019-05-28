import AnalyticsController from '../../../../src/js/analytics';
import * as constants from '../../../../src/js/util/constants';

console.log({constants})
describe('event type constant', () => {
    it('should have a proper string coercing method (Symbol.toPrimitive}', () =>{
        expect(constants.EVENT_TYPE.link).toEqual('link');
    });
})
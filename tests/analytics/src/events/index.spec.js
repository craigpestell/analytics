// basic template events.
import { ANALYTICS_EVENT } from '../../../../src/js/events';
import AnalyticsEvent from '../../../../src/js/events/AnalyticsEvent';
import { EVENT_TYPE } from '../../../../src/js/util/constants';

describe('generic events', () => {
  it('should have viewed event', () => {
    expect(new AnalyticsEvent('EVENT.Element.viewed', EVENT_TYPE.view).toString()).toEqual(ANALYTICS_EVENT.Element.viewed().toString());
    expect(new AnalyticsEvent('EVENT.Element.clicked', EVENT_TYPE.link).toString()).toEqual(ANALYTICS_EVENT.Element.clicked().toString());
    expect(new AnalyticsEvent('EVENT.Element.mousedOver', EVENT_TYPE.link).toString()).toEqual(ANALYTICS_EVENT.Element.mousedOver().toString());
    expect(new AnalyticsEvent('EVENT.Element.redirected', EVENT_TYPE.link).toString()).toEqual(ANALYTICS_EVENT.Element.redirected().toString());
    expect(new AnalyticsEvent('EVENT.Page.viewed', EVENT_TYPE.link).toString()).toEqual(ANALYTICS_EVENT.Page.viewed().toString());
    expect(new AnalyticsEvent('EVENT.View.initialized', EVENT_TYPE.link).toString()).toEqual(ANALYTICS_EVENT.View.initialized().toString());
    expect(new AnalyticsEvent('EVENT.View.viewed', EVENT_TYPE.link).toString()).toEqual(ANALYTICS_EVENT.View.viewed().toString());
    // test Symbol.toPrimitive
    expect(`${new AnalyticsEvent('EVENT.Element.viewed', EVENT_TYPE.view)}`).toEqual('EVENT.Element.viewed');
  });
});

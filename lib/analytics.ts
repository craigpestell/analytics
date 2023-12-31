import {
  IdentifyParams,
  PageParams,
  Analytics as SegmentAnalytics,
  TrackParams,
} from '@segment/analytics-node';

//const analytics = AnalyticsBrowser.load({ writeKey: process.env.WRITE_KEY as string })

export type EventType =
  | 'track'
  | 'page'
  | 'identify'
  | 'group'
  | 'alias'
  | 'screen';

export type PageViewProps = {
  Auth0Id: string;
  category: string;
  name: string;
  properties?: Object;
};

export default (writeKey: string) => {
  const segmentAnalytics = new SegmentAnalytics({
    writeKey,
  }).on('error', console.error);

  return {
    identify: ({
      userId,
      anonymousId,
      traits,
      context,
      timestamp,
      integrations,
    }: IdentifyParams): Promise<void> => {
      if (userId) {
        return new Promise((resolve) => {
          segmentAnalytics.identify({
            userId,
            traits,
            context,
            timestamp,
            integrations,
          });
          resolve();
        });
      }
      if (anonymousId) {
        return new Promise((resolve) => {
          segmentAnalytics.identify({
            anonymousId,
            traits,
            context,
            timestamp,
            integrations,
          });
          resolve();
        });
      }
      return new Promise((resolve) => {
        resolve();
      });
    },
    pageview: ({
      Auth0Id,
      category,
      name,
      properties,
    }: PageViewProps): Promise<void> => {
      const pageParams: PageParams = {
        userId: Auth0Id,
        category,
        name,
        properties: {
          ...properties,
        },
      };

      return new Promise((resolve) => {
        segmentAnalytics.page(pageParams);
        resolve();
      });
    },
    track: ({
      Auth0Id,
      //type = 'track',
      event,
      properties,
    }: {
      Auth0Id: string;
      type?: EventType;
      event: string;
      properties?: Object;
    }): Promise<void> => {
      const identifyParams: IdentifyParams = Auth0Id
        ? { userId: Auth0Id }
        : { anonymousId: 'anonymous' };

      const trackParams: TrackParams = {
        event: event ?? 'no event specified',
        properties: {
          ...properties,
        },
        ...identifyParams,
      };

      return new Promise((resolve) => {
        console.log('track:', trackParams);
        segmentAnalytics.track(trackParams);
        resolve();
      });
    },
  };
};

export { type PageParams, type TrackParams };

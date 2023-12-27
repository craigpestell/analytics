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

const Analytics = (writeKey: string) => {
  console.log({ writeKey });
  const analytics = new SegmentAnalytics({
    writeKey,
  }).on('error', console.error);

  const methods = {
    identify: ({
      userId,
      anonymousId,
      traits,
      context,
      timestamp,
      integrations,
    }: IdentifyParams) => {
      if (userId) {
        analytics.identify({
          userId,
          traits,
          context,
          timestamp,
          integrations,
        });
      }
      if (anonymousId) {
        analytics.identify({
          anonymousId,
          traits,
          context,
          timestamp,
          integrations,
        });
      }
    },
    pageview: ({ Auth0Id, category, name, properties }: PageViewProps) => {
      /*
        {
          userId: '019mr8mf4r',
          category: 'Docs',
          name: 'Node.js Library',
          properties: {
            url: 'https://segment.com/docs/connections/sources/catalog/librariesnode',
            path: '/docs/connections/sources/catalog/librariesnode/',
            title: 'Node.js Library - Segment',
            referrer: 'https://github.com/segmentio/analytics-node'
          }
        }
        */
      const pageParams: PageParams = {
        userId: Auth0Id,
        category,
        name,
        properties: {
          ...properties,
        },
      };

      console.log('page:', pageParams);
      analytics.page(pageParams);
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
    }) => {
      const identifyParams: IdentifyParams = Auth0Id
        ? { userId: Auth0Id as string }
        : { anonymousId: 'anonymous' };

      const trackParams: TrackParams = {
        event: event ?? 'no event specified',
        properties: {
          ...properties,
        },
        ...identifyParams,
      };

      console.log('track: ', trackParams);
      analytics.track(trackParams);
    },
  };

  type ChromeRuntime = {
    sendMessage<M = any, R = any>(
      message: M,
      responseCallback: (response: R) => void,
    ): void;
  };
  const sendMessage = {
    identify: (
      chromeRuntime: ChromeRuntime,
      {
        userId,
        anonymousId,
        traits,
        context,
        timestamp,
        integrations,
      }: IdentifyParams,
    ) => {
      chromeRuntime.sendMessage(
        {
          analytics: {
            action: 'identify',
            userId,
            anonymousId,
            traits,
            context,
            timestamp,
            integrations,
          },
        },
        (response: any) => {
          console.log({ response });
        },
      );
    },
    pageview: (
      chromeRuntime: ChromeRuntime,
      { Auth0Id, category, name, properties }: PageViewProps,
    ) => {
      chromeRuntime.sendMessage(
        {
          analytics: {
            action: 'pageview',
            Auth0Id,
            category,
            name,
            properties,
          },
        },
        (response: any) => {
          console.log({ response });
        },
      );
    },
    track: (
      chromeRuntime: ChromeRuntime,
      {
        Auth0Id,
        event,
        properties,
      }: { Auth0Id: string; event: string; properties?: Object },
    ) => {
      console.log({ Auth0Id, event, properties });
      chromeRuntime.sendMessage(
        {
          analytics: {
            action: 'track',
            Auth0Id,
            event,
            properties,
          },
        },
        (response: any) => {
          console.log({ response });
        },
      );
    },
  };

  return { ...methods, sendMessage };
};
export default Analytics;

import { NextRouter } from 'next/router';
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

const Analytics = (
  writeKey: string,
  { router }: { router?: NextRouter } = {},
) => {
  console.log({ router });
  const analytics = new SegmentAnalytics({
    writeKey,
  }).on('error', console.error);

  return {
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
        event,
        properties: {
          ...properties,
        },
        ...identifyParams,
      };

      console.log('track: ', trackParams);
      analytics.track(trackParams);
    },
  };
};
export default Analytics;

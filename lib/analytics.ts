import { NextRouter } from 'next/router';
import {
  PageParams,
  Analytics as SegmentAnalytics,
} from '@segment/analytics-node';

const SEGMENT_WRITE_KEY =
  process.env.SEGMENT_WRITE_KEY || 'FVXjn6W0y5iDR11coKCRC4TBHqcAP97r';

//const analytics = AnalyticsBrowser.load({ writeKey: process.env.WRITE_KEY as string })

type EventType = 'track' | 'page' | 'identify' | 'group' | 'alias' | 'screen';

export type PageViewProps = {
  Auth0Id: string;
  category: string;
  name: string;
  properties?: Object;
};

const Analytics = ({ router }: { router?: NextRouter }) => {
  const analytics = new SegmentAnalytics({
    writeKey: `${SEGMENT_WRITE_KEY}`,
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
      type = 'track',
      event,
      properties,
    }: {
      Auth0Id: string;
      type?: EventType;
      event: string;
      properties: Object;
    }) => {
      const e: {
        userId: string;
        type: EventType;
        event: string;
        properties: any;
      } = {
        userId: Auth0Id,
        type,
        event,
        properties: {
          ...properties,
        },
      };
      console.log('track: ', e);
      analytics.track(e);
    },
  };
};
/*
          messageId?: string
        type: SegmentEventType
      
        // page specific
        category?: string
        name?: string
      
        properties?: EventProperties
      
        traits?: Traits // Traits is only defined in 'identify' and 'group', even if it can be passed in other calls.
      
        integrations?: Integrations
        context?: CoreExtraContext
        options?: CoreOptions
      
        userId?: ID
        anonymousId?: ID
        groupId?: ID
        previousId?: ID
      
        event?: string
      
        writeKey?: string
      
        sentAt?: Date
      
        _metadata?: SegmentEventMetadata
      
        timestamp?: Timestamp */
export default Analytics;

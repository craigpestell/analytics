import { NextRouter } from 'next/router';
import {
  Analytics as SegmentAnalytics,
  TrackParams,
} from '@segment/analytics-node';

import Analytics, {
  type PageViewProps,
  SEGMENT_WRITE_KEY,
  type EventType,
} from '../lib/analytics';
import { useEffect, useState } from 'react';

function isEqualShallow(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const useAnalytics = ({
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
  const analytics = new SegmentAnalytics({ writeKey: SEGMENT_WRITE_KEY });

  const e = {
    userId: Auth0Id,
    type,
    event,
    properties: {
      ...properties,
    },
  };
  analytics.track(e);

  return {
    track: ({
      Auth0Id,
      type = 'track',
      event,
      properties,
    }: {
      Auth0Id?: string;
      type?: EventType;
      event: string;
      properties: Object;
    }) => {
      const userTrack: TrackParams = {
        userId: Auth0Id as string,
        event,
        properties: {
          ...properties,
        },
      };

      const anonTrack: TrackParams = {
        anonymousId: 'anonymous',
        event,
        properties: {
          ...properties,
        },
      };

      const e: TrackParams = Auth0Id ? userTrack : anonTrack;
      analytics.track(e);
    },
  };
};

export interface UsePageViewProps extends PageViewProps {
  router?: NextRouter;
}
export const usePageView = ({
  router,
  Auth0Id,
  category,
  name,
  properties,
}: UsePageViewProps) => {
  const analytics = Analytics({ router });
  const [timestamp, setTimestamp] = useState<number>(0);
  const [pageViewProps, setPageViewProps] = useState<PageViewProps>({
    Auth0Id,
    category,
    name,
    properties,
  });

  useEffect(() => {
    const now = Date.now() / 1000;

    const sameProps = !isEqualShallow(
      { Auth0Id, category, name, properties },
      pageViewProps,
    );

    //console.log({ sameProps }, { elapsed: now - timestamp });
    //if (Auth0Id && category && name && router.pathname) {
    if (!sameProps || now - timestamp > 5) {
      // console.log({ Auth0Id, category, name, properties });

      setPageViewProps({
        Auth0Id,
        category,
        name,
        properties,
      });

      analytics.pageview({ Auth0Id, category, name, properties });
      setTimestamp(now);
    }
    //}
  }, [Auth0Id, category, name, properties, pageViewProps, analytics]);
};

export default { useAnalytics, usePageView };

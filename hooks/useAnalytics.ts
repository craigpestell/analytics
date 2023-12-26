import { NextRouter } from 'next/router';
import {
  IdentifyParams,
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
  console.log(JSON.stringify(a), JSON.stringify(b));
  return JSON.stringify(a) === JSON.stringify(b);
}

export const useAnalytics = ({ Auth0Id }: { Auth0Id?: string }) => {
  // const analytics = new SegmentAnalytics({ writeKey: SEGMENT_WRITE_KEY });
  const analytics = Analytics();
  return {
    track: ({
      type = 'track',
      event,
      properties,
    }: {
      type?: EventType;
      event: string;
      properties: Object;
    }) => {
      const trackParams = {
        Auth0Id: Auth0Id ?? '',
        event,
        type,
        properties: {
          ...properties,
        },
      };

      analytics.track(trackParams);
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

    const sameProps = isEqualShallow(
      { Auth0Id, category, name, properties },
      pageViewProps,
    );

    console.log({ sameProps }, { elapsed: now - timestamp });
    //if (Auth0Id && category && name && router.pathname) {
    if ((!sameProps) || now - timestamp > 15) {
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

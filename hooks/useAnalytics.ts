import { NextRouter } from 'next/router';
/*import {
  IdentifyParams,
  Analytics as SegmentAnalytics,
  TrackParams,
} from '@segment/analytics-node';
*/
import AnalyticsBase, {
  type PageViewProps,
  type EventType,
} from '../lib/analytics';
import { useEffect, useState } from 'react';

export interface UsePageViewProps extends PageViewProps {
  router?: NextRouter;
}

const Analytics = (writeKey: string) => {
  const analytics = AnalyticsBase(writeKey);

  const useAnalytics = ({ Auth0Id }: { Auth0Id?: string }) => {
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

  const usePageView = ({
    router,
    Auth0Id,
    category,
    name,
    properties,
  }: UsePageViewProps) => {
    /*function isEqualShallow(a: any, b: any) {
      return JSON.stringify(a) === JSON.stringify(b);
    }*/
    //const now = Math.round(Date.now() / 1000);

    //const [timestamp, setTimestamp] = useState<number>(now);

    const [timerThreshold, setTimerThreshold] = useState<boolean>(false);

    /*const [pageViewProps, setPageViewProps] = useState<PageViewProps>({
      Auth0Id,
      category,
      name,
      properties,
    });*/

    useEffect(() => {
      //const now = Math.round(Date.now() / 1000);
      const timer = setTimeout(() => {
        setTimerThreshold(true);
        /*setPageViewProps({
          Auth0Id,
          category,
          name,
          properties,
        });*/
        clearTimeout(timer);
      }, 5000);

      //setTimestamp(now);
      if (timerThreshold) {
        /*setPageViewProps({
          Auth0Id,
          category,
          name,
          properties,
        });*/

        analytics.pageview({ Auth0Id, category, name, properties });
        //setTimerThreshold(false);
      }
      //}
    }, [timerThreshold]);
  };
  return { useAnalytics, usePageView };
};

export default Analytics;

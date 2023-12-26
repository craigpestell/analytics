import { NextRouter } from 'next/router';
import Analytics, { type PageViewProps } from '../lib/analytics';
import { useEffect, useState } from 'react';

function isEqualShallow(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export interface UsePageViewProps extends PageViewProps {
  router?: NextRouter;
}
const usePageView = ({
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

export default usePageView;
